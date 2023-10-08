import { CheckIcon, HeruIcon, ShieldIcon, UnlockIcon } from "@/app/icons";
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
    <div className="flex flex-col gap-4">
      <div>
        <Message
          role={"system"}
          message={
            "Basado en tu régimen y actividades, te recomiendo estos planes:"
          }
          userName={"HERU SOPORTE"}
        />
      </div>
      <div className="lg:pr-4 lg:pl-6 flex flex-col gap-3 lg:flex-row lg:justify-center">
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

const FormLinkFiscal = () => {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <Message
          role={"system"}
          message={
            "Claro, puedes vincular tu cuenta del SAT de manera segura desde aquí:"
          }
          userName={"HERU SOPORTE"}
        />
      </div>
      <div className="flex flex-col gap-4 border-2 border-blue-200 w-[350px] mx-auto pt-8 pb-6 px-5 rounded-3xl shadow-sm items-center text-center">
        <UnlockIcon />
        <div className="text-blue-950 mb-2">
          <h4 className="font-bold text-xl">Vincula tu cuenta del SAT</h4>
          <h5 className="font-[14px] text-sm">
            Y accede a toda tu información fiscal
          </h5>
        </div>
        <div className="flex flex-col gap-2 w-full">
          <input
            placeholder="Ingresa tu RFC"
            className="border-2 border-slate-200 w-full px-4 py-2 rounded-xl"
          />
          <input
            placeholder="Ingresa tu contraseña del SAT"
            className="border-2 border-slate-200 w-full px-4 py-2 rounded-xl"
          />
        </div>
        <div className="bg-blue-50 px-3 py-5 rounded-xl text-blue-500 text-sm">
          <h3 className="font-bold flex gap-2 items-center justify-center mb-1">
            Datos Encriptados <ShieldIcon />
          </h3>
          <p className="leading-4">
            Tu RFC y contraseña del SAT se encuentran 100% protegidos.
          </p>
        </div>
        <button className={"bg-blue-500 text-white py-3 rounded-xl w-full"}>
          Iniciar vinculación
        </button>
      </div>
    </div>
  );
};

const ForgotPassword = () => {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <Message
          role={"system"}
          message={
            "No te preocupes, te podemos ayudar a recuperar o generar tu contraseña."
          }
          userName={"HERU SOPORTE"}
        />
      </div>
      <div className="lg:pr-4 lg:pl-6 flex flex-col gap-3 lg:flex-row lg:justify-center">
        <ProductCard
          title={"Ayuda con el SAT"}
          description={
            "Te ayudamos a configurar tus datos fiscales y a obtener tu contraseña del SAT"
          }
          recommended
          price={99}
        />
      </div>
    </div>
  );
};

const Message = ({ role, message, userName, isSending, component }: Props) => {
  if (component === "get_plans") {
    return <PlansMessage />;
  }

  if (component === "link_fiscal_account") {
    return <FormLinkFiscal />;
  }

  if (component === "forgot_password") {
    return <ForgotPassword />;
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
