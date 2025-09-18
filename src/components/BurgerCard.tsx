import React from "react";
import BurgerItem from "@/types/burgerItem";
import Image from "next/image";
import { Info } from "lucide-react";

type Props = {
  burger: BurgerItem;
};

const BurgerCard = ({ burger }: Props) => {
  return (
    <div className="bg-white/7 border-[1px] border-white/10 rounded-xl p-4 space-y-3.5">
      <Image
        src={burger.imageUrl}
        width={100}
        height={100}
        alt="burger image"
        className="rounded-md w-full"
      />
      <div>
        <h2 className="text-lg font-bold">{burger.name}</h2>
        <p className="text-white/70 font-bold">{burger.price} €</p>
      </div>
      <div className="flex justify-between items-center gap-2">
        <button className="p-2 rounded-sm bg-white/10 transition hover:bg-white/20 cursor-pointer">
          <Info color="white" />
        </button>
        <button className="btn-primary">Ajouter au panier</button>
      </div>
    </div>
  );
};

export default BurgerCard;
