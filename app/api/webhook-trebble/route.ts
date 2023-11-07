import { TrebleRequest } from "@/types";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let responseFinal = {};
  const data: TrebleRequest = await request.json();

  try {
    await fetch(`https://main.treble.ai/session/${data.session_id}/update`, {
      method: "POST",
      body: JSON.stringify({
        user_session_keys: [
          {
            key: "message",
            value: data.session_id ?? "Vacio Session ID",
          },
        ],
      }),
    })
      .then((res) => res.json())
      .then((responseJson) => {
        console.log("RESPONSE", responseJson);
        responseFinal = responseJson;
      })
      .catch((error) => {
        console.log("ERROR", error);
        return NextResponse.json(error);
      });
  } catch (error) {
    return NextResponse.json(error);
  }

  return NextResponse.json(responseFinal);
}
