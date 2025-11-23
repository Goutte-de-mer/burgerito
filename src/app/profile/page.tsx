import { getSession } from "@/app/lib/session";

const Profile = async () => {
  const user = await getSession();
  return <div>Bonjour {user?.name} </div>;
};

export default Profile;
