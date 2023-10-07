"use client";

import Message from "@/components/Message";
import { BackIcon, HeruLogo, OptionIcon, SendIcon } from "./icons";
import { useEffect, useRef, useState } from "react";
import { functionCall } from "@/utils/function_call";

export default function Home() {
  const [isLoading, setIsLoading] = useState({
    isSending: false,
    isTyping: false,
  });
  const [inputValue, setInputValue] = useState<string>("");

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      content: "Hola, ¿en qué puedo ayudarte?",
    },
  ]);

  const lastMessage = useRef(null);

  const messageHandler = async (message: string) => {
    setInputValue("");
    if (!message || isLoading.isSending) return;

    const messagesToSend: Message[] = [
      ...messages,
      { role: "user", content: message },
    ];
    setMessages(messagesToSend);

    try {
      setIsLoading({ ...isLoading, isSending: true });
      setTimeout(() => {
        setIsLoading({ isSending: false, isTyping: true });
      }, 1500);
      const response = await fetch("/api/openai", {
        method: "POST",
        body: JSON.stringify({
          messages: messagesToSend.slice(-3),
        }),
      });
      const data = await response.json();

      if (data?.choices[0]?.finish_reason === "function_call") {
        functionCall(data.choices[0]);
        return;
      }

      setMessages([
        ...messagesToSend,
        { role: "system", content: data.choices?.[0]?.message.content },
      ]);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading({ ...isLoading, isTyping: false });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    // @ts-ignore
    lastMessage.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className=" bg-white h-screen relative ">
      <header className="backdrop-blur-xl bg-blue-200/20 border-b-blue-200/50 border-b-[1px] fixed top-0 w-full">
        <div className="flex justify-between items-center max-w-[800px] mx-auto pt-5 pb-3 px-4">
          <button className="w-[40px] h-[40px] rounded-full bg-white grid place-items-center shadow-sm">
            <BackIcon />
          </button>
          <HeruLogo />
          <button className="w-[40px] h-[40px] rounded-full bg-white grid place-items-center shadow-sm">
            <OptionIcon />
          </button>
        </div>
      </header>
      <section className="max-w-[800px] mx-auto flex flex-col gap-6 px-4 pt-24 pb-40">
        {messages.map((message, index) => (
          <div ref={lastMessage} key={index}>
            <Message
              role={message.role}
              message={message.content}
              userName={message.role === "user" ? "juanito" : "HERU SOPORTE"}
              isSending={
                index === messages.length - 1 ? isLoading.isSending : false
              }
            />
            {index === messages.length - 1 && isLoading.isTyping && (
              <div className="bg-slate-50 flex space-x-2 px-8 py-6 rounded-full rounded-tl-none justify-center items-center scale-[40%] w-fit ml-[-14px] mt-[-6px]">
                <div className="bg-slate-300 p-2  w-2 h-2 rounded-full animate-bounce blue-circle"></div>
                <div className="bg-slate-300 p-2 w-2 h-2 rounded-full animate-bounce green-circle"></div>
                <div className="bg-slate-300 p-2  w-2 h-2 rounded-full animate-bounce red-circle"></div>
              </div>
            )}
          </div>
        ))}
      </section>
      <form
        onSubmit={() => messageHandler(inputValue)}
        className="w-full fixed bottom-0 mx-auto items-center flex flex-col px-2"
      >
        <div className="bg-white w-full max-w-[800px] rounded-2xl p-2 flex border-slate-200 border-[1px] drop-shadow-md z-10">
          <input
            placeholder="Pregunta lo que sea..."
            className="w-full pl-4 outline-none"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button
            onClick={() => messageHandler(inputValue)}
            disabled={isLoading.isSending || !inputValue}
            className="bg-blue-500 hover:bg-blue-600 min-w-[44px] w-[44px] h-[44px] rounded-xl grid place-items-center transition-colors disabled:cursor-not-allowed disabled:bg-slate-100"
          >
            <SendIcon disabled={isLoading.isSending || !inputValue} />
          </button>
        </div>
        <span className="text-[13px] text-slate-400 bg-white w-full max-w-[800px] text-center pt-3 pb-3">
          Tiempo promedio de respuesta: 1 min
        </span>
      </form>
    </main>
  );
}
