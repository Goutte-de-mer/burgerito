import React from "react";

const Hero = () => {
  return (
    <div className="relative flex h-[350px] w-full flex-col justify-end overflow-hidden rounded-3xl p-3 pb-0 sm:h-[450px]">
      <div className="absolute inset-0 -z-10 bg-[url(/hero-bg.jpg)] bg-cover bg-center brightness-30" />
      <div className="mx-auto w-fit">
        <p className="mb-4 max-w-2xl md:text-lg">
          Lorem ipsum dolor sit amet consectetur. Velit nisl tempus mattis sit
          mauris nunc adipiscing sit massa. Maecenas vel facilisis arcu turpis
          nunc.
        </p>
        <h1 className="text-primary w-fit text-center text-7xl leading-none font-extrabold uppercase sm:text-8xl md:text-[120px] lg:text-[160px] xl:text-[180px]">
          burgerito
        </h1>
      </div>
    </div>
  );
};

export default Hero;
