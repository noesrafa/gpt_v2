import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch("https://api.chucknorris.io/jokes/random");

  const joke = await res.json();

  return NextResponse.json(joke);
}
