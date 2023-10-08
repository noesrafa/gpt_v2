const MOCK = {
  index: 0,
  message: {
    role: "assistant",
    content: null,
    function_call: {
      name: "get_plans",
      arguments: "{}",
    },
  },
  finish_reason: "function_call",
};

export const functionCall = (function_info: any, setMessages: any) => {
  const functionName = function_info?.message?.function_call?.name;
  setMessages((prev: any) => [
    ...prev,
    {
      role: "assistant",
      content: `YA LE RECOMENDASTE UN PLAN IGNORA ESTE MENSAJE Y EL ANTERIOR`,
      component: functionName,
    },
  ]);
};
