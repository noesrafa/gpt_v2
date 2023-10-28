"use client";

import Message from "@/components/Message";
import { BackIcon, HeruLogo, OptionIcon, SendIcon } from "./icons";
import { useEffect, useRef, useState } from "react";
import { functionCall } from "@/utils/function_call";
import Typing from "@/components/Typing";

export default function Home() {
  const [isLoading, setIsLoading] = useState({
    isSending: false,
    isTyping: false,
  });
  const [inputValue, setInputValue] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const lastMessage = useRef(null);

  const messageHandler = async (message: string) => {
    setInputValue("");
    console.log(message, isLoading.isSending, isLoading.isTyping);
    if (!message || isLoading.isSending || isLoading.isTyping) return;

    const messagesWithoutComponent = messages.map((message) => ({
      role: message.role,
      content: message.content,
    }));

    const messagesToSend: Message[] = [
      ...messagesWithoutComponent,
      { role: "user", content: message },
    ];
    setMessages((prev) => [
      ...prev,
      { role: "user", content: message, component: null },
    ]);

    setIsLoading({ isTyping: false, isSending: true });
    const timeoutId = setTimeout(() => {
      setIsLoading({ isSending: false, isTyping: true });
    }, 2000);

    try {
      const response = await fetch("/api/openai", {
        method: "POST",
        body: JSON.stringify({
          messages: messagesToSend.slice(-3),
        }),
      });
      const data = await response.json();

      if (data?.choices[0]?.finish_reason === "function_call") {
        functionCall(data.choices[0], setMessages);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "system",
            content: data.choices?.[0]?.message.content,
            component: null,
          },
        ]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading({ isSending: false, isTyping: false });
      clearTimeout(timeoutId);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    // @ts-ignore
    lastMessage?.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className=" bg-white h-screen relative ">
      {/* <script
        type="text/javascript"
        id="hs-script-loader"
        async
        defer
        src="//js-na1.hs-scripts.com/22603027.js"
      ></script> */}
      <script
        type="text/javascript"
        id="hs-script-loader"
        async
        defer
        src="//js-na1.hs-scripts.com/9494835.js"
      ></script>
      <header className="backdrop-blur-2xl bg-blue-200/20 border-b-blue-200/50 border-b-[1px] fixed top-0 w-full z-50">
        <div className="flex justify-between items-center max-w-[800px] mx-auto pt-5 pb-3 px-4">
          <button className="w-[40px] h-[40px] rounded-xl bg-white grid place-items-center shadow-sm">
            <BackIcon />
          </button>
          <HeruLogo />
          <button className="w-[40px] h-[40px] rounded-xl bg-white grid place-items-center shadow-sm">
            <OptionIcon />
          </button>
        </div>
      </header>
      {/* ================== MESSAGES ================== */}
      <section className="max-w-[800px] mx-auto flex flex-col gap-6 px-4 pb-40">
        <div className="h-20" />
        <Message
          role={"system"}
          message={"Hola, ¿en qué puedo ayudarte?"}
          userName={"HERU SOPORTE"}
        />
        {messages.map(({ role, content, component }, index) => {
          return (
            <div ref={index === 0 ? null : lastMessage} key={index}>
              <Message
                role={role}
                message={content}
                userName={role === "user" ? "CARLOS" : "HERU SOPORTE"}
                isSending={
                  index === messages.length - 1 ? isLoading.isSending : false
                }
                component={component}
              />
              {index === messages.length - 1 && isLoading.isTyping && (
                <Typing />
              )}
            </div>
          );
        })}
      </section>
      {/* ================== INPUT ================== */}
      <form
        onSubmit={() => messageHandler(inputValue)}
        className="w-full fixed bottom-0 mx-auto items-center flex flex-col px-2 z-50"
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
