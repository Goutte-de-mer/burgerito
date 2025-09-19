import Link from "next/link";
import { Undo2 } from "lucide-react";

export default function NotFound() {
  return (
    <main className="h-full flex flex-col justify-center items-center gap-6">
      <h2 className="text-2xl">Ressource introuvable 🧐</h2>
      <p>{`Nous n'avons pas pu trouver la ressoucre demandée`}</p>
      <Link
        href={"/"}
        className="flex gap-2.5 text-white/50 font-light text-sm items-center mb-12"
      >
        <Undo2 size={20} /> {`Retour à l'accueil`}
      </Link>
    </main>
  );
}
