"use client";
import Image from "next/image";
import BurgerDetailsProps from "@/types/burgerDetailsProps";
import { addToCartAction } from "@/app/actions/cart";

const BurgerDetails = ({
  id,
  name,
  description,
  price,
  imageUrl,
}: BurgerDetailsProps) => {
  console.log(id);
  return (
    <div className="flex flex-col">
      <h1 className="text-7xl font-bold"> {name} </h1>
      <div className="mx-auto mt-10 flex flex-col gap-10 md:mx-0 md:flex-row">
        <Image
          src={imageUrl}
          alt={name}
          width={300}
          height={300}
          className="rounded-md"
        />
        <div className="flex flex-col space-y-6 pt-2">
          <h2 className="text-xl font-medium">Description</h2>
          <p className="text-justify font-light text-white/50">
            {" "}
            {description}{" "}
          </p>
          <div className="mt-auto flex w-fit items-center justify-between gap-2.5 border-t border-white/20 pt-6">
            <p className="rounded-sm bg-white px-4.5 py-2 font-medium text-black">
              € {price}{" "}
            </p>
            <button
              className="btn-primary"
              onClick={() => {
                addToCartAction({
                  productId: id,
                  quantity: 1,
                  name: name,
                  imageUrl: imageUrl,
                  price: price,
                });
              }}
            >
              Ajouter au panier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BurgerDetails;
