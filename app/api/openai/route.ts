import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY_CUSTOM,
});

const functions = [
  {
    name: "get_current_weather",
    description: "Get the current weather in a given location",
    parameters: {
      type: "object",
      properties: {
        location: {
          type: "string",
          description: "The city and state, e.g. San Francisco, CA",
        },
        unit: { type: "string", enum: ["celsius", "fahrenheit"] },
      },
      required: ["location"],
    },
  },
  {
    name: "get_plans",
    description: `
      RULES: THE USER MUST SAY 'PLAN' OR 'PLANES' OR THE FUNCTION MUST NOT BE CALLED.
      Get a list of plans, usefull for users who ask for plans, contract a plan.
      EXAMPLES: 'Quiero contratar un plan.', 'Quiero un plan.'
      `,
    parameters: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "link_fiscal_account",
    description: `
      RULES: THE USER MUST SAY 'vincular' OR 'sat' OR THE FUNCTION MUST NOT BE CALLED.
      Usefull for users who want to link their fiscal account.
      EXAMPLES: 'Quiero vincular mi cuenta', 'Quiero vincular mi SAT'
      `,
    parameters: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "forgot_password",
    description: `
      RULES: THE USER MUST SAY 'contraseña' OR 'olvide' OR THE FUNCTION MUST NOT BE CALLED. 
      Usefull for users who forgot their SAT password.
      EXAMPLES: 'Olvide mi contraseña del sat', 'no me se mi contraseña del sat'
      `,
    parameters: {
      type: "object",
      properties: {},
    },
  },
];

export async function POST(request: Request) {
  const { messages } = await request.json();

  console.log(
    "\n -------------------------------------- \n ",
    messages,
    "\n -------------------------------------- \n "
  );

  if (!messages) {
    return NextResponse.json({ message: "Query is required" });
  }

  if (process.env.OPENAI_API_KEY_CUSTOM === undefined) {
    console.log("No API key provided.");
    return NextResponse.json(
      {
        message: "No API key provided.",
      },
      {
        status: 401,
      }
    );
  }

  const isDevelopment = process.env.NODE_ENV;
  const API_URL = isDevelopment
    ? "https://gpt-v2-git-main-noesrafa.vercel.app/api/"
    : "http://localhost:3000/api/";

  const responsePinecone = await fetch(API_URL + "pinecone", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: messages[messages.length - 1].content,
      sendDocs: false,
    }),
  });

  const context = await responsePinecone.json();

  const formatedContext = context
    .map((text: any) => text.pageContent)
    .join("\n");

  const messages_chat = [
    {
      role: "system",
      content: `
      Eres un agente de soporte que trabaja en la empresa heru. 
      Utiliza este contexto para responder la pregunta del usuario en 3 sentencias o menos: \n ${formatedContext}
      
      USER QUESTION: \n
      `,
    },
    ...messages,
  ];

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      // @ts-ignore
      messages: messages_chat,
      functions: functions,
      function_call: "auto", // auto is default, but we'll be explicit
    });

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      {
        message: error,
      },
      {
        status: 401,
      }
    );
  }
}
