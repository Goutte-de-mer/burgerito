import React from "react";
import BurgerItem from "@/types/burgerItem";
import Image from "next/image";
import { Info } from "lucide-react";
import Link from "next/link";

type Props = {
  burger: BurgerItem;
};

const BurgerCard = ({ burger }: Props) => {
  return (
    <div className="bg-white/7 border-[1px] border-white/10 rounded-xl p-4 space-y-3.5 max-w-sm mx-auto">
      <Image
        src={burger.imageUrl}
        width={200}
        height={200}
        alt="burger image"
        className="rounded-md max-h-56 w-full object-cover"
      />
      <div>
        <h2 className="text-lg font-bold">{burger.name}</h2>
        <p className="text-white/70 font-bold">{burger.price} €</p>
      </div>
      <div className="flex justify-between items-center gap-2">
        <Link
          href={`/product/${burger.id}`}
          className="p-2 rounded-sm bg-white/10 transition hover:bg-white/20 cursor-pointer"
        >
          <Info color="white" />
        </Link>
        <button className="btn-primary">Ajouter au panier</button>
      </div>
    </div>
  );
};

export default BurgerCard;
