"use server";
import { cookies } from "next/headers";
import { getMyOrders, getOrderById } from "@/services/orderService";

export async function getMyOrdersAction() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("auth_token")?.value;

  if (!authToken) {
    return {
      success: false,
      error: "Vous devez être connecté pour voir vos commandes",
      orders: [],
    };
  }

  try {
    const result = await getMyOrders(authToken);
    return {
      success: true,
      orders: result?.items || [],
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Erreur lors du chargement des commandes";
    return {
      success: false,
      error: message,
      orders: [],
    };
  }
}

export async function getOrderByIdAction(orderId: string) {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("auth_token")?.value;

  if (!authToken) {
    return {
      success: false,
      error: "Vous devez être connecté pour voir les détails de la commande",
      order: null,
      items: [],
    };
  }

  try {
    const result = await getOrderById(authToken, orderId);
    return {
      success: true,
      order: result.order,
      items: result.items,
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Erreur lors du chargement de la commande";
    return {
      success: false,
      error: message,
      order: null,
      items: [],
    };
  }
}
