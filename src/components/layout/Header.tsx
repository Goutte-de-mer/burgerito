import Image from "next/image";
const Header = () => {
  return (
    <header className="flex justify-between items-center">
      <Image src="/logo.svg" alt="Logo" width={120} height={60} />
      <div className="flex gap-2.5">
        <button className="btn-secondary">Inscription</button>
        <button className="btn-primary">Connexion</button>
      </div>
    </header>
  );
};

export default Header;
