import Image from "next/image";
import Link from "next/link";
const Header = () => {
  return (
    <header className="z-30 flex items-center justify-between">
      <Link href={"/"}>
        <Image src="/logo.svg" alt="Logo" width={120} height={60} />
      </Link>

      <div className="flex gap-2.5">
        <Link href={"/register"} className="btn-secondary">
          Inscription
        </Link>
        <Link href={"/login"} className="btn-primary">
          Connexion
        </Link>
      </div>
    </header>
  );
};

export default Header;
