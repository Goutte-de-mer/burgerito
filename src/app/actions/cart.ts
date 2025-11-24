"use server";
import {
  addToCart as addToCartLib,
  updateCartItem as updateCartItemLib,
  removeFromCart as removeFromCartLib,
  clearCart as clearCartLib,
  getCart,
} from "@/app/lib/cart";
import { cookies } from "next/headers";
import { createOrder } from "@/services/orderService";
import type CartItem from "@/types/cartItem";

export async function addToCartAction(item: CartItem) {
  await addToCartLib(item);
}

export async function updateCartItemAction(
  productId: string,
  quantity: number,
) {
  await updateCartItemLib(productId, quantity);
}

export async function removeFromCartAction(productId: string) {
  await removeFromCartLib(productId);
}

export async function clearCartAction() {
  await clearCartLib();
}

export async function createOrderAction() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("auth_token")?.value;

  if (!authToken) {
    return {
      success: false,
      error: "Vous devez être connecté pour passer une commande",
    };
  }

  const cart = await getCart();

  if (cart.length === 0) {
    return {
      success: false,
      error: "Votre panier est vide",
    };
  }

  // Transformer le panier en tableau de productId
  // Si un produit a quantity: 3, on ajoute 3 fois le productId
  const items: string[] = [];
  for (const cartItem of cart) {
    for (let i = 0; i < cartItem.quantity; i++) {
      items.push(cartItem.productId);
    }
  }

  try {
    const result = await createOrder(authToken, items);
    await clearCartLib();
    return {
      success: true,
      order: result.order,
      items: result.items,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erreur lors de la commande";
    return {
      success: false,
      error: message,
    };
  }
}
