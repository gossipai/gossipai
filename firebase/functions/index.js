const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { Firestore, FieldValue } = require("@google-cloud/firestore");
  
const OpenAI = require("openai");
const numeric = require('numeric');

const config = functions.config();

const SIMILAR_NEWS_LIMIT = 20;
const COSINE_THRESHOLD = 0.749;
const EMBEDDING_DIMENSIONS = 2048;
const EMBEDDING_MODEL = "text-embedding-3-large";
const OPENAI_API_KEY = config.openai.apikey;
const OPENAI_ASSISTANT_ID = config.openai.assistantid;

const openai = new OpenAI({
    apiKey: OPENAI_API_KEY
});

admin.initializeApp();

const db = new Firestore();
const logger = functions.logger;

function averageEmbedding(vectors) {
    if (vectors.length === 0) {
        throw new Error('No vectors provided');
    }

    let sumVector = numeric.rep([vectors[0].length], 0);

    for (let vector of vectors) {
        sumVector = numeric.add(sumVector, vector);
    }

    return numeric.div(sumVector, vectors.length);
}

async function getKeywords(title){

    const thread = await openai.beta.threads.create();
    await openai.beta.threads.messages.create(thread.id, {
        role: "user",
        content: `"${title}"`,
    });
    
    const run = await openai.beta.threads.runs.create(thread.id, {
        assistant_id: OPENAI_ASSISTANT_ID,
    });
    
    let runStatus = await openai.beta.threads.runs.retrieve(
        thread.id,
        run.id
    );
    
    while (runStatus.status !== "completed") {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    }
    
    const messages = await openai.beta.threads.messages.list(thread.id);

    const lastMessageForRun = messages.data
    .filter(
    (message) => message.run_id === run.id && message.role === "assistant"
    )
    .pop();

    const resultText = lastMessageForRun.content[0].text.value;
    const resultJSON = JSON.parse(resultText);
    return resultJSON.keywords;
}

const getKeywordEmbeddings = async (keywords) => {
    const payload = {
        "input": keywords,
        "dimensions": EMBEDDING_DIMENSIONS,
        "model": EMBEDDING_MODEL
    };
    
    const response = await openai.embeddings.create(payload);

    const embeddings = response.data;
    const embeddingArrays = embeddings.map(embeddingObject => embeddingObject.embedding);
    return embeddingArrays;

}

exports.onNewsUpdate = functions.firestore.document("/news/{documentId}").onUpdate(async (change, context) => {
    const newsData = change.after.data();
    const { documentId } = context.params;

    // if similar news exist, find related customers and send the article
    if (newsData.similarNews) {

        const users = new Set();

        const similarNewsIds = newsData.similarNews.map(article => article.id)
        const userNewsQuery = db.collection('users').where("newsRead", "array-contains-any", similarNewsIds);
        
        const userNewsSnapshot = await userNewsQuery.get();

        userNewsSnapshot.forEach(user => {
            users.add(user.id);
        });
        
        if(users.size > 0){
          const currentArticle = db.collection("finalNews").doc(documentId);
          currentArticle.set({
            recommendedUsers: [...users],
            ...newsData
          });
        }
        
        return;
    }

    // if similar news do not exist, find KNNs and add to document
    if (newsData.embedding && newsData.keywords) {
        logger.info(`Searching ${documentId} similar news...`);

        const coll = db.collection('news');

        const vectorQuery = coll.
        where('language', '==', newsData.language)
        .findNearest('embedding', FieldValue.vector(newsData.embedding.value),
            {
                limit: SIMILAR_NEWS_LIMIT,
                distanceMeasure: 'COSINE',
            }
        );
        
        const vectorQuerySnapshot = await vectorQuery.get();

        const similarNews = vectorQuerySnapshot.docs.filter(doc => doc.id !== documentId).map(doc => {
            return {
                id: doc.id,
                ...doc.data()
            }}
        );
        
        similarNews.forEach(similarArticle => {
            const cosine = numeric.dot(newsData.embedding.value, similarArticle.embedding._values) / (numeric.norm2(newsData.embedding.value) * numeric.norm2(similarArticle.embedding._values));
            similarArticle.cosine = cosine;
        });

        const similarNewsFiltered = similarNews.filter(article => article.cosine > COSINE_THRESHOLD);
        
        const article = coll.doc(documentId);

        await article.update({
            similarNews: 
                similarNewsFiltered.map(article => {
                    return {
                        id: article.id,
                        title: article.title,
                        cosine: article.cosine,
                        category: article.category,
                        language: article.language
                    }
                })
        });

        logger.info(`Updated ${documentId} with similar news...`);

        return;
    }

    

});


exports.onNewsCreate = functions.firestore.document("/news/{documentId}").onCreate(async (snap, context) => {
    const newsData = snap.data();
    const { documentId } = context.params;
    
    logger.info(`Start processings document ${documentId}`);
    try {
        const keywords = await getKeywords(newsData.title);
        const embeddings = await getKeywordEmbeddings(keywords);
        const embeddingsAverage = averageEmbedding(embeddings);        

        const article = db.collection('news').doc(documentId);

        await article.update({
            embedding: FieldValue.vector(embeddingsAverage),
            keywords: keywords,
            category: keywords[0]
        });

        logger.info(`Document ${documentId} processed successfully`);
    } catch (error) {
        logger.error(`Error processing document ${documentId}:`, error);
    }

    return;
});

exports.createUserDocument = functions.auth.user().onCreate((user) => {
    const userRef = db.collection("users").doc(user.uid);
    return userRef.set({
        newsRead: []
    });
  });