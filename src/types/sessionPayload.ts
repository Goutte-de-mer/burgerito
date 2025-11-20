import User from "./user";

type SessionPayload = {
  user: User;
  expiresAt: Date;
};

export default SessionPayload;
