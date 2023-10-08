import { CheckIcon, HeruIcon } from "@/app/icons";
import React from "react";
import ProductCard from "./ProductCard";

interface Props {
  role: string;
  message: string;
  userName?: string;
  isSending?: boolean;
  component?: string | null;
}

const PlansMessage = () => {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <Message
          role={"system"}
          message={
            "Basado en tu régimen y actividades, te recomiendo estos planes:"
          }
          userName={"HERU SOPORTE"}
        />
      </div>
      <div className="pr-4 pl-6 flex flex-col gap-3 lg:flex-row">
        <ProductCard
          title={"Heru plus"}
          description={
            "Contabilidad mensual completa para las declaraciones de todos tus regímenes"
          }
          recommended
          price={849}
        />
        <ProductCard
          title={"Heru básico"}
          description={
            "Contabilidad mensual completa para las declaraciones de un solo régimen"
          }
          price={199}
        />
      </div>
    </div>
  );
};

const Message = ({ role, message, userName, isSending, component }: Props) => {
  if (component === "get_plans") {
    return <PlansMessage />;
  }

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
