import { getSession } from "@/app/lib/session";
import Image from "next/image";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import CartButton from "../CartButton";
import { getCart } from "@/app/lib/cart";

const Header = async () => {
  const user = await getSession();
  const cart = await getCart();
  return (
    <header className="z-30 flex items-center justify-between">
      <Link href={"/"}>
        <Image src="/logo.svg" alt="Logo" width={120} height={60} />
      </Link>

      <div className="flex items-center gap-2.5">
        <CartButton cart={cart} isLoggedIn={!!user} />
        {!user ? (
          <>
            <Link href={"/register"} className="btn-secondary">
              Inscription
            </Link>
            <Link href={"/login"} className="btn-primary">
              Connexion
            </Link>
          </>
        ) : (
          <>
            <LogoutButton />
            <Link href={"/profile"} className="btn-primary">
              Mon profil
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
