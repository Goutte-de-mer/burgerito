import { login } from "@/app/actions/auth";
const LoginForm = () => {
  return (
    <form action={login} className="flex w-full max-w-md flex-col space-y-6">
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
      <button type="submit" className="btn-primary mx-auto min-w-60">
        Connexion
      </button>
    </form>
  );
};

export default LoginForm;
