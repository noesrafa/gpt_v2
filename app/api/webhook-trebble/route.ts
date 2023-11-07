import { TrebleRequest } from "@/types";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let responseFinal = {};
  const data: TrebleRequest = await request.json();

  const payload = {
    user_session_keys: [
      {
        key: "message",
        value: data.session_id ?? "Sin session ID",
      },
      {
        key: "request",
        value: JSON.stringify(data) ?? "body vacio",
      },
      {
        key: "url",
        value:
          `https://main.treble.ai/session/${data.session_id}/update` ??
          "URL vacia",
      },
      {
        key: "handoff",
        value: false,
      },
    ],
  };

  try {
    console.log("PAYLOAD", payload);

    await fetch(`https://main.treble.ai/session/${data.session_id}/update`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${"ak_uO0qsSyY94F0dKCDvD2-r0RRgCz8s5MCrA"}`,
      },
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
