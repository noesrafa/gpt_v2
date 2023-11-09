import { TrebleRequest } from "@/types";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const req: TrebleRequest = await request.json();

  fetch("https://gpt-v2-git-main-noesrafa.vercel.app/api/webhook-handler", {
    method: "POST",
    body: JSON.stringify(req),
  });

  return NextResponse.json([]);
}