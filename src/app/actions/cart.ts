"use server";
import {
  addToCart as addToCartLib,
  updateCartItem as updateCartItemLib,
  removeFromCart as removeFromCartLib,
  clearCart as clearCartLib,
} from "@/app/lib/cart";
import type CartItem from "@/types/cartItem";

export async function addToCartAction(item: CartItem) {
  await addToCartLib(item);
}

export async function updateCartItemAction(productId: string, quantity: number) {
  await updateCartItemLib(productId, quantity);
}

export async function removeFromCartAction(productId: string) {
  await removeFromCartLib(productId);
}

export async function clearCartAction() {
  await clearCartLib();
}

