"use client;";
import { signup } from "@/app/actions/auth";
import { useActionState } from "react";

const SignupForm = () => {
  const [state, action] = useActionState(signup, undefined);
  return (
    <form action={action} className="flex w-full max-w-lg flex-col">
      <div className="grid grid-cols-2 gap-2.5">
        <div className="col-span-2">
          {state?.errors?.name && (
            <p className="text-sm font-light text-white/50">
              {state.errors.name}
            </p>
          )}
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Nom"
            required
            className="input w-full"
          />
        </div>
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

      {state?.errors?.password && (
        <p className="text-sm font-light text-white/50">
          {state.errors.password}
        </p>
      )}
      {state?.errors?.email && (
        <p className="text-sm font-light text-white/50">{state.errors.email}</p>
      )}
      <button type="submit" className="btn-primary mx-auto mt-6 min-w-60">
        Confirmer
      </button>
    </form>
  );
};

export default SignupForm;
