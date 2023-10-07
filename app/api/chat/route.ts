//@ts-nocheck
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

function getCurrentWeather(location, unit = "fahrenheit") {
  const weatherInfo = {
    location: location,
    temperature: "72",
    unit: unit,
    forecast: ["sunny", "windy"],
  };
  const weather = JSON.stringify(weatherInfo);
  return weather;
}

async function getRandomJoke() {
  const res = await fetch("https://api.chucknorris.io/jokes/random");

  const joke = await res.json();

  return JSON.stringify(joke);
}

export async function POST(request: Request) {
  const { question } = await request.json();

  async function runConversation() {
    // Step 1: send the conversation and available functions to GPT
    const responsePinecone = await fetch(
      "http://localhost:3000/api/pinecone/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: question, sendDocs: false }),
      }
    );

    const context = await responsePinecone.json();
    const formatedContext = context.map((text) => text.pageContent).join("\n");
    console.log(
      formatedContext,
      "/n -------------------------------------- /n "
    );

    const messages = [
      {
        role: "system",
        content: `Eres un agente de soporte que trabaja en la empresa heru. utiliza este contexto para responder la pregunta del usuario: \n ${formatedContext}
        
        USER QUESTION: /n
        `,
      },
      { role: "user", content: question },
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      functions: functions,
      function_call: "auto", // auto is default, but we'll be explicit
    });
    const responseMessage = response.choices[0].message;
    // Step 2: check if GPT wanted to call a function

    if (responseMessage.function_call) {
      // Step 3: call the function
      // Note: the JSON response may not always be valid; be sure to handle errors
      const availableFunctions = {
        get_current_weather: getCurrentWeather,
        get_random_joke: getRandomJoke,
      }; // only one function in this example, but you can have multiple
      const functionName = responseMessage.function_call.name;

      const functionToCall = availableFunctions[functionName];
      const functionArgs = JSON.parse(responseMessage.function_call.arguments);

      const functionResponse = await functionToCall(functionArgs);

      // Step 4: send the info on the function call and function response to GPT
      messages.push(responseMessage); // extend conversation with assistant's reply
      messages.push({
        role: "function",
        name: functionName,
        content: functionResponse,
      }); // extend conversation with function response
      const secondResponse = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: messages,
      }); // get a new response from GPT where it can see the function response
      return secondResponse;
    } else {
      // Step 3: if GPT didn't want to call a function, return the response
      return response;
    }
  }

  const res = await runConversation();

  return NextResponse.json(res);
}
