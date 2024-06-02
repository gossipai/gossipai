const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { Firestore, FieldValue } = require("@google-cloud/firestore");

const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, } = require("@google/generative-ai");
const OpenAI = require("openai");
const numeric = require('numeric');

const config = functions.config();

const SIMILAR_NEWS_LIMIT = 20;
const COSINE_THRESHOLD = 0.749;
const RECOMMENDATION_THRESHOLD = 0.20;
const EMBEDDING_DIMENSIONS = 2048;
const EMBEDDING_MODEL = "text-embedding-3-large";
const OPENAI_API_KEY = config.openai.apikey;
const OPENAI_ASSISTANT_ID = config.openai.assistantid;
const GEMINI_API_KEY = config.gemini.apikey;

const openai = new OpenAI({
    apiKey: OPENAI_API_KEY
});

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  
admin.initializeApp();

const db = new Firestore();
const logger = functions.logger;

function normalizeCosine(score) {
    return (score - 0.7) / 0.2;
}


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

    if (newsData.summary) {
        return;
    }

    // if similar news exist, find related customers and send the article
    if (newsData.similarNews) {

        const users = new Set();
        const articleCategory = newsData.category;
        const similarNewsIds = newsData.similarNews.map(article => article.id)
        const userNewsQuery = db.collection('users').where("newsRead", "array-contains-any", similarNewsIds);
        
        const userNewsSnapshot = await userNewsQuery.get();

        userNewsSnapshot.forEach(user => {
            const userData = user.data();
            const readArticleID = userData.newsRead.find(article => similarNewsIds.includes(article));
            const cosine = newsData.similarNews.find(article => article.id === readArticleID).cosine;
            const recommendationScore = normalizeCosine(cosine) * userData.categories[articleCategory];
            if (recommendationScore > RECOMMENDATION_THRESHOLD) {
                console.log("PASS " + readArticleID + " User: " + user.id + " Recommendation Score: " + recommendationScore);
                users.add(user.id);
            }else{
                console.log("FAIL " + readArticleID + " User: " + user.id + " Recommendation Score: " + recommendationScore);
            }
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
        newsRead: [],
        categories: {
            "politics": 0.5,
            "business": 0.5,
            "technology": 0.5,
            "science": 0.5,
            "health": 0.5,
            "entertainment": 0.5,
            "sports": 0.5,
            "travel": 0.5,
            "lifestyle": 0.5,
            "environment": 0.5,
            "education": 0.5,
            "crime": 0.5,
            "fashion": 0.5,
            "food": 0.5,
            "celebrity": 0.5,
            "art": 0.5,
        },
    });
  });

const getSummary = async (content) => {
    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: "Your task is to read and summarize news articles. Here are the guidelines to follow:\n\nUnderstand the Article: Carefully read the entire news article to grasp its main points and overall message.\n\nIdentify Key Information: Focus on the most critical aspects of the article, such as:\n\nThe main event or topic being discussed.\nImportant dates, names, and places.\nKey facts, figures, and statistics.\nQuotes from relevant individuals, if they add significant value.\nCreate a Concise Summary: Condense the article into a summary that captures the essence of the original content. The summary should be:\n\nClear and Coherent: Ensure that the summary makes sense on its own, without needing to refer back to the original article.\nInformative: Include all important information that gives a complete picture of the article’s content.\nBrief: Keep the summary short and to the point, ideally within 3-5 sentences.\nAvoid Redundancy: Do not repeat information or include unnecessary details. Focus on providing a streamlined version of the article.\n\nMaintain Neutral Tone: Write the summary in a neutral tone, without adding any personal opinions or biases.\n\nUse Simple Language: Ensure the summary is easily understandable, avoiding complex jargon or technical terms unless absolutely necessary",
    });

    const generationConfig = {
        temperature: 1,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 8192,
        responseMimeType: "text/plain",
    };

    const safetySettings = [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
    ];

    const chatSession = model.startChat({
        generationConfig,
        safetySettings,
        history: [],
    });
    
    const result = await chatSession.sendMessage(content);
    return result.response.text();
}

exports.getArticleSummary = functions.https.onCall(
    async (data, context) => {
    const { articleId, body } = data;
    const articleRef = db.collection("news").doc(articleId);
    const articleDoc = await articleRef.get();
    if (!articleDoc.exists) {
        throw new functions.https.HttpsError("not-found", "Article not found");
    }
    const summary = await getSummary(body);
    await articleRef.update({
        summary: summary
    });
    return summary;
});

const getAnswer = async (body, question) => {

    const bodyParsed = body.replace(/(?:\r\n|\r|\n)/g, ' ');
    const instructionText = `Your task is to answer questions about a news article. Here are the guidelines to follow:\nFocus on Article: Answer questions directly using the provided news article.\nRelevant & Missing Info: If relevant but missing from the article, use general knowledge for brief answers.\nMention using general knowledge (e.g., "beyond the article").\nIrrelevant Questions: Refuse to answer to the irrelevant questions.\n\nExample:\nQuestion: France capital? (Not in but relevant to the article)\nAnswer: Beyond this article, France's capital is Paris.\nExample 2:\nQuestion 2: France capital? (Neither in the article, nor related to the article)\nAnswer 2: I am only here to answer your questions related to the article.\nExample 3: \nQuestion 3: France capital? (in the article)\nAnswer: Paris is the capital of France.\n\nHere is the article content:'${bodyParsed}'`;

    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: instructionText,
    });

    const generationConfig = {
        temperature: 1,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 8192,
        responseMimeType: "text/plain",
    };

    const safetySettings = [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
    ];

    const chatSession = model.startChat({
        generationConfig,
        safetySettings,
        history: [],
    });
    
    const result = await chatSession.sendMessage(question);
    return result.response.text();
}

exports.getArticleAnswer = functions.https.onCall(async (data, context) => {
    const answer = await getAnswer(data.body, data.question);
    return answer;
});