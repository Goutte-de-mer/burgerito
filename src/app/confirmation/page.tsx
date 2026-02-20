import { CheckCircle } from "lucide-react";
import Link from "next/link";
const Confirmation = () => {
  return (
    <main className="flex flex-col items-center justify-center gap-y-6">
      <CheckCircle size={100} className="text-green-400" />
      <h1 className="max-w-2xl text-center text-5xl/normal font-extrabold uppercase">
        Votre commande a bien été enregistrée. Merci !
      </h1>
      <Link href={"/"} className="btn-primary">
        {`Retour à l'accueil`}
      </Link>
    </main>
  );
};

export default Confirmation;
