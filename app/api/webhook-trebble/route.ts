import { TrebleRequest } from "@/types";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data: TrebleRequest = await request.json();

  const isDevelopment = process.env.NODE_ENV;
  const API_URL = isDevelopment
    ? "http://localhost:3000"
    : "https://gpt-v2-git-main-noesrafa.vercel.app";

  if (true) {
    console.log("REQ", data);

    const test = {
      user_session_keys: [
        {
          key: "message",
          value: "pamplinas",
        },
      ],
    };

    const response = await fetch(
      `https://main.treble.ai/session/${data.session_id}/update`,
      {
        method: "POST",
        body: JSON.stringify(test),
      }
    );

    await fetch(
      "https://api.hubapi.com/conversations/v3/conversations/threads/" +
        JSON.stringify({ response, session: data.session_id, data }),
      {
        headers: {
          Authorization: "Bearer pat-na1-ede60426-372b-4a88-a642-7835df95d896",
        },
      }
    );

    return NextResponse.json(test);
  }

  const response = await fetch(
    "https://gpt-v2-git-main-noesrafa.vercel.app/api/openai-webhook",
    {
      method: "POST",
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: "hola",
          },
        ],
      }),
    }
  );

  const responseJson = await response.json();
  console.log(responseJson);

  if (responseJson?.choices?.[0]?.finish_reason === "function_call") {
    const functionName = responseJson.choices[0]?.message?.function_call?.name;
    console.log(functionName);
    if (functionName === "talk_to_human") {
      return NextResponse.json({
        botMessage: null,
        nextModuleNickname: "",
        responseExpected: false,
      });
    }
  }

  return NextResponse.json({
    botMessage: responseJson.choices?.[0].message.content,
    nextModuleNickname: "",
    responseExpected: true,
  });
}
