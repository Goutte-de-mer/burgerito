"use server";
import AuthFormState from "@/types/authFormState";
import { loginUser, registerUser } from "@/services/authService";

export async function signup(
  _prevState: AuthFormState | undefined,
  formData: FormData,
) {
  const name = formData.get("name") as string; //minLength 2 maxLength 80
  const email = formData.get("email") as string; //match /^\S+@\S+\.\S+$/
  const password = formData.get("password") as string; //minLength 6

  //Validation
  const errors = {} as {
    name?: string;
    email?: string;
    password?: string;
    form?: string;
  };
  if (!name || name.trim().length < 2 || name.trim().length > 80) {
    errors.name = "Le nom doit contenir entre 2 et 80 caractères.";
  }
  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!email || !emailRegex.test(email)) {
    errors.email = "L'adresse e-mail n'est pas valide.";
  }
  if (!password || password.length < 6) {
    errors.password = "Le mot de passe doit contenir au moins 6 caractères.";
  }
  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  try {
    await registerUser(name.trim(), email, password);
    return { success: true, errors: {} };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Une erreur est survenue";
    return { success: false, errors: { form: message } };
  }
}

export async function login(
  _prevState: { success: boolean; error: string | null } | undefined,
  formData: FormData,
) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  //Validation
  if (!email || !password) {
    return { success: false, error: "Tous les champs sont obligatoires" };
  }

  // Appel API
  try {
    await loginUser(email, password);
    return { success: true, error: null };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Une erreur est survenue";
    return { success: false, error: message };
  }
}
