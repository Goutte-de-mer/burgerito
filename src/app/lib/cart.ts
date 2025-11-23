import "server-only";
import { cookies } from "next/headers";
import type CartItem from "@/types/cartItem";
import { encrypt, decrypt } from "./session";

// Type pour le payload du panier dans le cookie
type CartPayload = {
  items: CartItem[];
  expiresAt: Date;
};

/**
 * Récupère le panier depuis les cookies
 * @returns Le tableau d'articles du panier, ou un tableau vide si le panier n'existe pas/est expiré
 */
export async function getCart(): Promise<CartItem[]> {
  const cookieStore = await cookies();
  const cartCookie = cookieStore.get("cart")?.value;

  // Si pas de cookie, retourner un panier vide
  if (!cartCookie) return [];

  // Déchiffrer le cookie avec decrypt
  // On spécifie le type CartPayload pour que TypeScript sache ce qu'on récupère
  const payload = await decrypt<CartPayload>(cartCookie);

  // Si le déchiffrement échoue ou le payload est null
  if (!payload) return [];

  // Vérifier si le panier est expiré
  if (new Date(payload.expiresAt) < new Date()) {
    return [];
  }

  // Retourner les articles du panier
  return payload.items;
}

/**
 * Sauvegarde le panier dans les cookies
 * @param items - Le tableau d'articles à sauvegarder
 */
export async function saveCart(items: CartItem[]) {
  // Date d'expiration : 14 jours à partir de maintenant
  const expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

  // Créer le payload avec les articles et la date d'expiration
  const cartPayload: CartPayload = {
    items,
    expiresAt,
  };

  // Chiffrer le payload avec encrypt
  // On passe "14d" comme durée d'expiration pour le JWT
  const cartToken = await encrypt<CartPayload>(cartPayload, "14d");

  // Sauvegarder dans les cookies
  const cookieStore = await cookies();
  cookieStore.set("cart", cartToken, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

/**
 * Ajoute un article au panier (ou augmente sa quantité s'il existe déjà)
 * @param item - L'article à ajouter
 */
export async function addToCart(item: CartItem) {
  const currentCart = await getCart();

  // Chercher si l'article existe déjà dans le panier
  const existingItemIndex = currentCart.findIndex(
    (cartItem) => cartItem.productId === item.productId,
  );

  if (existingItemIndex >= 0) {
    // Si l'article existe, augmenter la quantité
    currentCart[existingItemIndex].quantity += item.quantity;
  } else {
    // Sinon, ajouter le nouvel article
    currentCart.push(item);
  }

  // Sauvegarder le panier mis à jour
  await saveCart(currentCart);
}

/**
 * Met à jour la quantité d'un article dans le panier
 * @param productId - L'ID du produit à modifier
 * @param quantity - La nouvelle quantité (si 0, l'article est supprimé)
 */
export async function updateCartItem(productId: string, quantity: number) {
  const currentCart = await getCart();

  if (quantity <= 0) {
    // Si la quantité est 0 ou moins, supprimer l'article
    const filteredCart = currentCart.filter(
      (item) => item.productId !== productId,
    );
    await saveCart(filteredCart);
    return;
  }

  // Trouver l'article et mettre à jour sa quantité
  const itemIndex = currentCart.findIndex(
    (item) => item.productId === productId,
  );

  if (itemIndex >= 0) {
    currentCart[itemIndex].quantity = quantity;
    await saveCart(currentCart);
  }
}

/**
 * Supprime un article du panier
 * @param productId - L'ID du produit à supprimer
 */
export async function removeFromCart(productId: string) {
  const currentCart = await getCart();
  const filteredCart = currentCart.filter(
    (item) => item.productId !== productId,
  );
  await saveCart(filteredCart);
}

/**
 * Vide complètement le panier
 */
export async function clearCart() {
  const cookieStore = await cookies();
  cookieStore.delete("cart");
}

/**
 * Calcule le nombre total d'articles dans le panier
 * @returns Le nombre total d'articles (somme des quantités)
 */
export async function getCartItemCount(): Promise<number> {
  const cart = await getCart();
  return cart.reduce((total, item) => total + item.quantity, 0);
}

/**
 * Calcule le prix total du panier
 * @returns Le prix total en euros
 */
export async function getCartTotal(): Promise<number> {
  const cart = await getCart();
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}
