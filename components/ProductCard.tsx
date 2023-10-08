import { CheckIcon } from "@/app/icons";
import React from "react";

interface Props {
  title: string;
  description: string;
  recommended?: boolean;
  price: number;
}

const ProductCard = ({ title, description, recommended, price }: Props) => {
  return (
    <div className="bg-white border-slate-200 shadow-sm rounded-2xl border-[1px] px-5 py-6 relative flex flex-col gap-4 justify-between w-full lg:w-[340px]">
      {recommended && (
        <div className="bg-blue-50 text-blue-500 rounded-lg px-3 py-1 text-sm  absolute right-2 top-2 whitespace-nowrap">
          Más vendido
        </div>
      )}
      <div className="flex flex-col gap-4">
        <h4 className="text-xl font-bold text-blue-950">{title}</h4>
        <p className="text-slate-500  leading-5">{description}</p>
        <ul className="flex flex-col gap-2 bg-blue-200/20 px-3 py-3 rounded-lg text-blue-950 ">
          <li className="flex gap-2 items-center">
            <CheckIcon type="benefit" />
            Cubre todas tus actividades.
          </li>
          <li className="flex gap-2 items-center">
            <CheckIcon type="benefit" />
            Tomamos en cuenta tus deducibles.
          </li>
          <li className="flex gap-2 items-center">
            <CheckIcon type="benefit" />
            Soporte personalizado.
          </li>
        </ul>
      </div>
      <span className="text-blue-950">
        <b className="text-xl">${price}</b>/mes
      </span>
      <button
        className={
          recommended
            ? "bg-blue-500 text-white py-3 rounded-xl"
            : "border-[1px] border-blue-500 py-3 rounded-xl text-blue-500"
        }
      >
        Ver detalles y contratar
      </button>
    </div>
  );
};

export default ProductCard;
