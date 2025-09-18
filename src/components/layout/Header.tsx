import Image from "next/image";
import Link from "next/link";
const Header = () => {
  return (
    <header className="flex justify-between items-center z-30">
      <Link href={"/"}>
        <Image src="/logo.svg" alt="Logo" width={120} height={60} />
      </Link>

      <div className="flex gap-2.5">
        <button className="btn-secondary">Inscription</button>
        <button className="btn-primary">Connexion</button>
      </div>
    </header>
  );
};

export default Header;
