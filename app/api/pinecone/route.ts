const OPENAI_API_KEY = process.env.OPENAI_API_KEY as string;
const PINECONE_API_KEY = process.env.PINECONE_API_KEY as string;
const PINECONE_ENVIRONMENT = process.env.PINECONE_ENVIRONMENT as string;
const PINECONE_INDEX = process.env.PINECONE_INDEX as string;

import { NextResponse } from "next/server";

import { Pinecone } from "@pinecone-database/pinecone";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { OpenAI } from "langchain/llms/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import * as fs from "fs";

// CONFIG PINECONE
const pinecone = new Pinecone({
  apiKey: PINECONE_API_KEY,
  environment: PINECONE_ENVIRONMENT,
});

const pineconeIndex = pinecone.Index(PINECONE_INDEX);

// GET STORE
async function getStore() {
  const vectorStore = await PineconeStore.fromExistingIndex(
    new OpenAIEmbeddings(),
    { pineconeIndex }
  );

  return vectorStore;
}

// UPLOAD DOCS
async function uploadDocs() {
  new OpenAI({
    openAIApiKey: OPENAI_API_KEY,
  });
  const text = fs.readFileSync("./document.txt", {
    encoding: "utf8",
    flag: "r",
  });
  const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
  const chunks = await textSplitter.createDocuments([text]);
  await PineconeStore.fromDocuments(chunks, new OpenAIEmbeddings(), {
    pineconeIndex,
    //@ts-ignore
    maxConcurrency: 5, // Maximum number of batch requests to allow at once. Each batch is 1000 vectors.
  });
}

// DELETE DOCS
async function deleteDocs() {
  const vectorStore = await getStore();
  vectorStore.delete({ deleteAll: true });

  console.log("✅ Deleted all documents");
}

// QUERY DOC
async function queryDoc(query: string) {
  const vectorStore = await getStore();
  const vectorStoreRetriever = vectorStore.asRetriever(3);

  const relevant = await vectorStoreRetriever.getRelevantDocuments(query);
  return relevant;
}

// -------------------------- QUERY AND SEND DOCS --------------------------

export async function POST(request: Request) {
  const { query, sendDocs } = await request.json();

  if (sendDocs) {
    await uploadDocs();
    return NextResponse.json("Creados");
  }

  const results = await queryDoc(query);
  return NextResponse.json(results);
}

// -------------------------- DELETE DOCS ----------------------------------

export async function DELETE() {
  await deleteDocs();

  return NextResponse.json("Deleted");
}
