import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = await request.json();

  const isDevelopment = process.env.NODE_ENV;
  const API_URL = isDevelopment
    ? "http://localhost:3000"
    : "https://gpt-v2-git-main-noesrafa.vercel.app";

  const trebbleURL = (session: string) =>
    `https://main.treble.ai/session/${session}/update`;

  if (true) {
    const response = await fetch(trebbleURL(data.session_id), {
      method: "POST",
      body: JSON.stringify({
        user_session_keys: [
          {
            key: "message",
            value: data.user_session_keys?.[0].value,
          },
          {
            key: "handoff",
            value: false,
          },
        ],
      }),
    });

    return NextResponse.json({
      user_session_keys: [
        {
          key: "message",
          value: data.user_session_keys?.[0].value,
        },
        {
          key: "handoff",
          value: false,
        },
      ],
    });

    return NextResponse.json({
      hola: API_URL + "/api/openai",
      data: data.userMessage.message,
    });
  }

  const response = await fetch(
    "https://gpt-v2-git-main-noesrafa.vercel.app/api/openai-webhook",
    {
      method: "POST",
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: data.userMessage.message,
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
