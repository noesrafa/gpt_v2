import { CheckIcon, HeruIcon } from "@/app/icons";
import React from "react";

interface Props {
  role: "system" | "user";
  message: string;
  userName?: string;
  isSending?: boolean;
}

const Message = ({ role, message, userName, isSending }: Props) => {
  if (role === "system") {
    return (
      <div>
        <div className="flex items-center gap-2">
          <HeruIcon />
          <h6 className="text-[12px] font-semibold text-slate-500 uppercase">
            {userName}
          </h6>
        </div>
        <p className="bg-blue-50 px-5 py-4 rounded-xl rounded-tl-none mt-1 ml-[24px] text-slate-800 mr-5">
          {message}
        </p>
      </div>
    );
  }

  return (
    <div className="w-fit ml-auto">
      <div className="flex gap-2 items-end ml-auto">
        <div className="flex flex-col items-end gap-[1px]">
          <h6 className="text-[12px] font-semibold text-slate-500 uppercase">
            {userName}
          </h6>
          <p className=" text-slate-900">{message}</p>
        </div>
        <div className="">
          <CheckIcon type={isSending ? "empty" : "check"} />
        </div>
      </div>
    </div>
  );
};

export default Message;
