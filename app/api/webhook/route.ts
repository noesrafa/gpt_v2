import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // const data = await request.json();

  // const response = await fetch(
  //   "https://api.hubapi.com/conversations/v3/conversations/threads/" +
  //     JSON.stringify(data) +
  //     "/messages",
  //   {
  //     headers: {
  //       Authorization: "Bearer pat-na1-ede60426-372b-4a88-a642-7835df95d896",
  //     },
  //   }
  // );

  return NextResponse.json({
    botMessage:
      "En Heru, nos dedicamos a simplificar y automatizar los procesos fiscales para miles de mexicanos. Ofrecemos una amplia gama de servicios, que incluyen asistencia con procedimientos del SAT, generación de certificados de situación fiscal, ayuda con declaraciones de impuestos mensuales y anuales. También apoyamos con la actualización de declaraciones mensuales pendientes y proporcionamos una forma fácil de ver y emitir facturas. Nuestros servicios atienden a una variedad de regímenes fiscales, lo que nos hace versátiles y accesibles para una amplia gama de clientes. Estamos disponibles en las plataformas Android e iOS, lo que nos hace fácilmente accesibles. ¿Hay algo específico que te gustaría saber sobre nuestros servicios?",
    nextModuleNickname: "",
    responseExpected: true,
  });
}
