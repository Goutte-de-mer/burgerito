import Link from "next/link";
import { Undo2 } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex h-full flex-col items-center justify-center gap-6">
      <h2 className="mb-3 text-7xl font-extrabold">Page 404</h2>
      <Link href={"/"} className="btn-primary">
        {`Retour à l'accueil`}
      </Link>
    </main>
  );
}
