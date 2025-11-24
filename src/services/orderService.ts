import type Order from "@/types/order";

async function handleResponse<T>(res: Response): Promise<T> {
  const contentType = res.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");
  const body = isJson ? await res.json().catch(() => ({})) : {};

  if (!res.ok) {
    const message = (body && (body.message as string)) || `HTTP ${res.status}`;
    throw new Error(message);
  }
  return body as T;
}

type CreateOrderResponse = {
  order: {
    _id: string;
    user: string;
    total: number;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
  items: Array<{
    _id: string;
    product: {
      _id: string;
      name: string;
      price: number;
      imageUrl: string;
    };
    priceAtPurchase: number;
    order: string;
  }>;
};

export async function createOrder(
  authToken: string,
  items: string[],
): Promise<CreateOrderResponse> {
  const res = await fetch(`${process.env.API_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + authToken,
    },
    body: JSON.stringify({ items }),
  });
  return handleResponse<CreateOrderResponse>(res);
}

type ListOrdersResponse = {
  items: Order[];
};

export async function getMyOrders(
  authToken: string,
): Promise<ListOrdersResponse> {
  const res = await fetch(`${process.env.API_URL}/orders/me`, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + authToken,
    },
  });
  return handleResponse<ListOrdersResponse>(res);
}

type OrderItem = {
  _id: string;
  product: {
    _id: string;
    name: string;
    price: number;
    imageUrl: string;
  };
  priceAtPurchase: number;
  order: string;
};

type GetOrderByIdResponse = {
  order: Order;
  items: OrderItem[];
};

export async function getOrderById(
  authToken: string,
  orderId: string,
): Promise<GetOrderByIdResponse> {
  const res = await fetch(`${process.env.API_URL}/orders/${orderId}`, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + authToken,
    },
  });
  return handleResponse<GetOrderByIdResponse>(res);
}
