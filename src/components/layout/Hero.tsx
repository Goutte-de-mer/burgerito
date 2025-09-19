import React from "react";

const Hero = () => {
  return (
    <div className="w-full h-[350px] sm:h-[450px] rounded-3xl relative overflow-hidden p-3 flex flex-col pb-0 justify-end">
      <div className="absolute inset-0 bg-[url(/hero-bg.jpg)] bg-cover bg-center brightness-30 -z-10" />
      <div className="w-fit mx-auto">
        <p className="md:text-lg mb-4 max-w-2xl">
          Lorem ipsum dolor sit amet consectetur. Velit nisl tempus mattis sit
          mauris nunc adipiscing sit massa. Maecenas vel facilisis arcu turpis
          nunc.
        </p>
        <h1 className="uppercase text-primary text-7xl sm:text-8xl md:text-[120px] lg:text-[160px] xl:text-[180px] font-extrabold text-center leading-none w-fit">
          burgerito
        </h1>
      </div>
    </div>
  );
};

export default Hero;
