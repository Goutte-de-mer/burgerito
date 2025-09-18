import Image from "next/image";
import BurgerDetailsProps from "@/types/burgerDetailsProps";

const BurgerDetails = ({
  name,
  description,
  price,
  imageUrl,
}: BurgerDetailsProps) => {
  return (
    <div className="flex flex-col">
      <h1 className="text-7xl font-bold"> {name} </h1>
      <div className="flex flex-col mx-auto md:mx-0 md:flex-row gap-10 mt-10">
        <Image
          src={imageUrl}
          alt={name}
          width={300}
          height={300}
          className="rounded-md"
        />
        <div className="space-y-6 flex flex-col pt-2">
          <h2 className="text-xl font-medium">Description</h2>
          <p className="text-white/50 font-light text-justify">
            {" "}
            {description}{" "}
          </p>
          <div className="flex justify-between items-center border-t border-white/20 pt-6 mt-auto gap-2.5 w-fit">
            <p className="rounded-sm py-2 px-4.5 bg-white text-black font-medium">
              € {price}{" "}
            </p>
            <button className="btn-primary">Ajouter au panier</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BurgerDetails;
