import Image from "next/image";

const Loading = () => {
  return (
    <Image
      src={"/logo.svg"}
      alt="Logo"
      width={100}
      height={60}
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse"
    />
  );
};

export default Loading;
