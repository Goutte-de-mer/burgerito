"use client";
import SignupForm from "@/components/SignupForm";

const Register = () => {
  return (
    <main className="flex flex-col items-center justify-center">
      <h1 className="mb-8 text-7xl font-extrabold">{`Je m'inscris`}</h1>
      <SignupForm />
    </main>
  );
};

export default Register;
