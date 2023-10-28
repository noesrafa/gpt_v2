import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = await request.json();
  const response = await fetch(
    "https://gpt-v2-git-main-noesrafa.vercel.app/api/openai",
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
  return NextResponse.json({
    botMessage: responseJson.choices[0].message.content,
    nextModuleNickname: "",
    responseExpected: false,
  });
}
