"use client";
import BurgerItem from "@/types/burgerItem";
import Image from "next/image";
import { Info } from "lucide-react";
import Link from "next/link";
import { addToCartAction } from "@/app/actions/cart";

type Props = {
  burger: BurgerItem;
};

const BurgerCard = ({ burger }: Props) => {
  return (
    <div className="mx-auto max-w-sm space-y-3.5 rounded-xl border-[1px] border-white/10 bg-white/7 p-4">
      <Image
        src={burger.imageUrl}
        width={200}
        height={200}
        alt="burger image"
        className="max-h-56 w-full rounded-md object-cover"
      />
      <div>
        <h2 className="text-lg font-bold">{burger.name}</h2>
        <p className="font-bold text-white/70">{burger.price} €</p>
      </div>
      <div className="flex items-center justify-between gap-2">
        <Link
          href={`/product/${burger.id}`}
          className="cursor-pointer rounded-sm bg-white/10 p-2 transition hover:bg-white/20"
        >
          <Info color="white" />
        </Link>
        <button
          className="btn-primary"
          onClick={() => {
            addToCartAction({
              productId: burger.id,
              quantity: 1,
              name: burger.name,
              imageUrl: burger.imageUrl,
              price: burger.price,
            });
          }}
        >
          Ajouter au panier
        </button>
      </div>
    </div>
  );
};

export default BurgerCard;
