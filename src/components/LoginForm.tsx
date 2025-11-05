"use client";
import { login } from "@/app/actions/auth";
import { useActionState } from "react";
import { CircleAlert } from "lucide-react";

const LoginForm = () => {
  const [state, action] = useActionState(login, undefined);
  return (
    <form action={action} className="flex w-full max-w-md flex-col space-y-6">
      <div className="grid grid-cols-1 grid-rows-2 gap-2.5">
        <input
          type="email"
          name="email"
          id="email"
          placeholder="E-mail"
          required
          className="input"
        />
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Mot de passe"
          required
          className="input"
        />
      </div>
      {state?.error && (
        <div className="mt-2.5 flex flex-nowrap items-center gap-x-2.5 text-red-300">
          <CircleAlert size={20} />
          <p className="text-sm font-light text-red-300">{state.error}</p>
        </div>
      )}
      <button type="submit" className="btn-primary mx-auto min-w-60">
        Connexion
      </button>
    </form>
  );
};

export default LoginForm;
