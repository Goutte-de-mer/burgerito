import { getSession } from "@/app/lib/session";
import ChatSupport from "./ChatSupport";

const ChatSupportWrapper = async () => {
  const user = await getSession();
  
  if (!user) {
    return null;
  }

  return <ChatSupport userId={user.id} userName={user.name} />;
};

export default ChatSupportWrapper;

