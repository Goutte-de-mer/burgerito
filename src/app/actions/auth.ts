"use server";
import AuthFormState from "@/types/authFormState";
export async function signup(
  prevState: AuthFormState | undefined,
  formData: FormData,
) {
  const name = formData.get("name") as string; //minLength 2 maxLength 80
  const email = formData.get("email") as string; //match /^\S+@\S+\.\S+$/
  const password = formData.get("password") as string; //minLength 6

  //Validation
  const errors = {} as { name?: string; email?: string; password?: string };
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
  return { success: true, errors: {} };
}
export async function login(formData: FormData) {}
