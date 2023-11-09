import { TrebleRequest } from "@/types";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const req: TrebleRequest = await request.json();

  const responseOpenAI = await fetch(
    "https://gpt-v2-git-main-noesrafa.vercel.app/api/openai-webhook",
    {
      method: "POST",
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: req.actual_response,
          },
        ],
      }),
    }
  );

  const responseOpenAIJson = await responseOpenAI.json();

  const payload = {
    user_session_keys: [
      {
        key: "message",
        value: responseOpenAIJson.choices?.[0].message.content,
      },
    ],
  };

  const response = await fetch(
    `https://main.treble.ai/session/${req.session_id}/update`,
    {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const resJson = await response.json();

  if (response.status !== 200) {
    return NextResponse.json(
      {
        error: resJson.message,
      },
      { status: 500 }
    );
  }

  console.log("\n\n\nREQ", req, "\n\n\nPAYLOAD", payload, "\n\n\nRES", resJson);

  return NextResponse.json([]);
}
