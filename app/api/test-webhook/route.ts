import { NextResponse } from "next/server";

export async function POST(request: any) {
  const reqData = await request.json();

  const response = await fetch(
    "https://api.hubapi.com/conversations/v3/conversations/threads/" +
      JSON.stringify(reqData) +
      "/messages",
    {
      headers: {
        Authorization: "Bearer pat-na1-ede60426-372b-4a88-a642-7835df95d896",
      },
    }
  );

  console.log(response);
  return NextResponse.json(response);
}
