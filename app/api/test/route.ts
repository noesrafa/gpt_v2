const OPENAI_API_KEY = process.env.OPENAI_API_KEY as string;
const PINECONE_API_KEY = process.env.PINECONE_API_KEY as string;
const PINECONE_ENVIRONMENT = process.env.PINECONE_ENVIRONMENT as string;
const PINECONE_INDEX = process.env.PINECONE_INDEX as string;

import { Pinecone } from "@pinecone-database/pinecone";
import * as dotenv from "dotenv";
import { VectorDBQAChain } from "langchain/chains";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { OpenAI } from "langchain/llms/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { Document } from "langchain/document";

import { RetrievalQAChain } from "langchain/chains";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import * as fs from "fs";

dotenv.config();

const docs = [
  new Document({
    metadata: { foo: "bar" },
    pageContent: "pinecone is a vector db",
  }),
  new Document({
    metadata: { foo: "bar" },
    pageContent: "the quick brown fox jumped over the lazy dog",
  }),
  new Document({
    metadata: { baz: "qux" },
    pageContent: "lorem ipsum dolor sit amet",
  }),
  new Document({
    metadata: { baz: "qux" },
    pageContent: "pinecones are the woody fruiting body and of a pine tree",
  }),
];

const pinecone = new Pinecone({
  apiKey: PINECONE_API_KEY,
  environment: PINECONE_ENVIRONMENT,
});

const pineconeIndex = pinecone.Index(PINECONE_INDEX);

async function createStore() {
  const vectorStore = await PineconeStore.fromExistingIndex(
    new OpenAIEmbeddings(),
    { pineconeIndex }
  );

  return vectorStore;
}

async function search(vectorStore: PineconeStore) {
  const results = await vectorStore.similaritySearch("pinecone", 1, {
    foo: "bar",
  });
  console.log(results, "--------------------------------------");
  return results;
}

async function createDocs(documents: any) {
  const response = await PineconeStore.fromDocuments(
    documents,
    new OpenAIEmbeddings(),
    {
      pineconeIndex,
      //@ts-ignore
      maxConcurrency: 5, // Maximum number of batch requests to allow at once. Each batch is 1000 vectors.
    }
  );

  console.log(response, "--------------------------------------");

  return response;
}

async function run() {
  const vectorStore = await createStore();
  await search(vectorStore);
}

async function queryDoc() {
  const vectorStore = await createStore();

  const vectorStoreRetriever = vectorStore.asRetriever(2);

  const relevant = await vectorStoreRetriever.getRelevantDocuments(
    "¿Qué hace Heru?"
  );
  console.log("Initialized model ---------------- ", relevant);
}

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // Initialize the LLM to use to answer the question.
  const model = new OpenAI({
    openAIApiKey: OPENAI_API_KEY,
  });
  const text = fs.readFileSync("./document.txt", {
    encoding: "utf8",
    flag: "r",
  });
  const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
  const docs = await textSplitter.createDocuments([text]);
  const create = await createDocs(docs);
  console.log("Initialized model ---------------- ", create);
  //   const create = await queryDoc();

  return NextResponse.json("Creados");
}

export async function GET() {
  //   const res = await run();
  const res = await queryDoc();

  return NextResponse.json("pinecone");
}
