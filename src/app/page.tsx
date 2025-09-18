import Hero from "@/components/layout/Hero";
import BurgerCard from "@/components/BurgerCard";
import BurgerItem from "@/types/burgerItem";
export default async function Home() {
  const data = await fetch("https://node-eemi.vercel.app/api/products");
  const products = await data.json();

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
