import React from "react";

const Typing = () => {
  return (
    <div className="bg-slate-100/80 flex space-x-2 px-8 py-6 rounded-full rounded-tl-none justify-center items-center scale-[40%] w-fit ml-[-14px] mt-[-6px]">
      <div className="bg-slate-400/80 p-2  w-2 h-2 rounded-full animate-bounce blue-circle"></div>
      <div className="bg-slate-400/80 p-2 w-2 h-2 rounded-full animate-bounce green-circle"></div>
      <div className="bg-slate-400/80 p-2  w-2 h-2 rounded-full animate-bounce red-circle"></div>
    </div>
  );
};

export default Typing;
