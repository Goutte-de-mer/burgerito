import Hero from "@/components/layout/Hero";
import BurgerCard from "@/components/BurgerCard";
import BurgerItem from "@/types/burgerItem";
import { getProducts } from "@/services/productService";

export default async function Home() {
  const products = await getProducts();

  const burgers = products.items.map((item: BurgerItem) => (
    <BurgerCard key={item.id} burger={item} />
  ));

  return (
    <main>
      <Hero />
      <div className="grid grid-cols-4 gap-4 mt-12">{burgers}</div>
    </main>
  );
}
