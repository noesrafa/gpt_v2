/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    OPENAI_API_KEY: "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",
    PINECONE_API_KEY: "e1217651-a131-4557-952a-1b427c0e9720",
    PINECONE_ENVIRONMENT: "us-west4-gcp-free",
    PINECONE_INDEX: "heru",
  },
};

module.exports = nextConfig;
