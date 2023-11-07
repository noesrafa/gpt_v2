import { TrebleRequest } from "@/types";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const req: TrebleRequest = await request.json();

  const payload = {
    user_session_keys: [
      {
        key: "message",
        value: "Hello from webhook",
      },
      {
        key: "handoff",
        value: 'false',
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

  console.log(
    "\n\n\nPAYLOAD",
    payload,
    "\n\n\nURL",
    `https://main.treble.ai/session/${req.session_id}/update`,
    "\n\n\nREQ",
    req,
    "\n\n\nRES",
    resJson
  );

  if (response.status !== 200) {
    return NextResponse.json(
      {
        error: resJson.message,
      },
      { status: 500 }
    );
  }

  return NextResponse.json(resJson);
}
