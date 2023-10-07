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
    name: "get_random_joke",
    description: "Get a random joke from rafa",
    parameters: {
      type: "object",
      properties: {},
    },
  },
];

export async function POST(request: Request) {
  const { messages } = await request.json();

  if (!messages) {
    return NextResponse.json({ message: "Query is required" });
  }

  // console.log("-----------------------------------------------------");
  // if (messages) {
  //   return NextResponse.json({ message: openai.apiKey });
  // }

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

  const responsePinecone = await fetch("http://localhost:3000/api/pinecone/", {
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
  console.log(formatedContext, "\n -------------------------------------- \n ");

  const messages_chat = [
    {
      role: "system",
      content: `Eres un agente de soporte que trabaja en la empresa heru. utiliza este contexto para responder la pregunta del usuario: \n ${formatedContext}
      CONTESTA EN 3 SENTENCIAS O MENOS. \n
      
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
