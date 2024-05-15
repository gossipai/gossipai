const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { Firestore, FieldValue } = require("@google-cloud/firestore");
const OpenAI = require("openai");
const numeric = require('numeric');

const config = functions.config();

const EMBEDDING_DIMENSIONS = 2048;
const EMBEDDING_MODEL = "text-embedding-3-large";
const OPENAI_API_KEY = config.openai.apiKey;
const OPENAI_ASSISTANT_ID = config.openai.assistantId;

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

async function getCategories(title){

    const thread = await openai.beta.threads.create();
    await openai.beta.threads.messages.create(thread.id, {
        role: "user",
        content: `{"title":"${title}"}`,
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
    return resultJSON.news[0].categories;
}

const getCategoryEmbeddings = async (categories) => {
    const payload = {
        "input": categories,
        "dimensions": EMBEDDING_DIMENSIONS,
        "model": EMBEDDING_MODEL
    };
    
    const response = await openai.createEmbedding(payload);

    const embeddings = response.data.data;
    const embeddingArrays = embeddings.map(embeddingObject => embeddingObject.embedding);
    return embeddingArrays;
}

exports.onNewsCreate = functions.firestore.document("/news/{documentId}").onCreate(async (snap, context) => {
    const newsData = snap.data();
    const { documentId } = context.params;
    
    logger.info(`Start processings document ${documentId}`);
    try {
        const categories = await getCategories(newsData.title);
        const embeddings = await getCategoryEmbeddings(categories);
        const embeddingsAverage = averageEmbedding(embeddings);        

        const article = db.collection('news').doc(documentId);

        await article.update({
            embedding: FieldValue.vector(embeddingsAverage)
        });

        logger.info(`Document ${documentId} processed successfully`);
    } catch (error) {
        logger.error(`Error processing document ${documentId}:`, error);
    }
});
