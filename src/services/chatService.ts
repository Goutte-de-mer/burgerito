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

type Chat = {
  _id: string;
  userA: string;
  userB: string;
  lastMessageAt: string;
  lastMessageText?: string;
};

type Message = {
  _id: string;
  chat: string;
  sender: {
    _id: string;
    name: string;
    email: string;
  };
  text: string;
  attachments?: string[];
  createdAt: string;
};

export async function ensureChat(
  authToken: string,
  peerId: string,
): Promise<Chat> {
  const res = await fetch(`${process.env.API_URL}/chat/ensure`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + authToken,
    },
    body: JSON.stringify({ peerId }),
  });
  return handleResponse<Chat>(res);
}

export async function getChatMessages(
  authToken: string,
  chatId: string,
  limit = 50,
): Promise<Message[]> {
  const res = await fetch(
    `${process.env.API_URL}/chat/${chatId}/messages?limit=${limit}`,
    {
      method: "GET",
      headers: {
        Authorization: "Bearer " + authToken,
      },
    },
  );
  return handleResponse<Message[]>(res);
}

export async function sendChatMessage(
  authToken: string,
  chatId: string,
  text: string,
): Promise<Message> {
  const res = await fetch(`${process.env.API_URL}/chat/${chatId}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + authToken,
    },
    body: JSON.stringify({ text }),
  });
  return handleResponse<Message>(res);
}

