import { getProducts } from "@/services/productService";
import BurgerDetails from "@/components/BurgerDetails";
import BurgerCard from "@/components/BurgerCard";
import { Undo2 } from "lucide-react";
import Link from "next/link";
import BurgerItem from "@/types/burgerItem";
import { notFound } from "next/navigation";

const Product = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const products = await getProducts();
  const product = products.items.find((item: BurgerItem) => item.id === id);

  if (!product) {
    notFound();
  }

  const randomProducts = products.items
    .filter((item: BurgerItem) => item.id !== id)
    .slice(0, 4);

  return (
    <main>
      <Link
        href={"/"}
        className="mb-12 flex items-center gap-2.5 text-sm font-light text-white/50"
      >
        <Undo2 size={20} /> {`Retour à l'accueil`}
      </Link>
      <BurgerDetails {...product} />
      <div className="mt-14">
        <h2 className="mb-5 text-2xl font-bold">Nos autres propositions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {randomProducts.map((item: BurgerItem) => (
            <BurgerCard key={item.id} burger={item} />
          ))}
        </div>
      </div>
    </main>
  );
};

export default Product;
