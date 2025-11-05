"use client;";
import { signup } from "@/app/actions/auth";
import { useActionState } from "react";
import { CircleAlert } from "lucide-react";

const SignupForm = () => {
  const [state, action] = useActionState(signup, undefined);
  return (
    <form action={action} className="flex w-full max-w-lg flex-col">
      <div className="grid grid-cols-2 gap-2.5">
        <div className="col-span-2">
          {state?.errors?.name && (
            <div className="mb-2.5 flex flex-nowrap items-center gap-x-2.5 text-red-300">
              <CircleAlert size={20} />
              <p className="text-sm font-light">{state.errors.name}</p>
            </div>
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
        <div className="mt-2.5 flex flex-nowrap items-center gap-x-2.5 text-red-300">
          <CircleAlert size={20} />
          <p className="text-sm font-light text-red-300">
            {state.errors.password}
          </p>
        </div>
      )}
      {state?.errors?.email && (
        <div className="mt-2.5 flex flex-nowrap items-center gap-x-2.5 text-red-300">
          <CircleAlert size={20} />
          <p className="text-sm font-light text-red-300">
            {state.errors.email}
          </p>
        </div>
      )}
      <button type="submit" className="btn-primary mx-auto mt-6 min-w-60">
        Confirmer
      </button>
    </form>
  );
};

export default SignupForm;
