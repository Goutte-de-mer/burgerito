import { getSession } from "@/app/lib/session";
import { Undo2, Package, Calendar, Euro, Eye } from "lucide-react";
import Link from "next/link";
import { getMyOrdersAction } from "@/app/actions/orders";

const Profile = async () => {
  const user = await getSession();
  const { orders } = await getMyOrdersAction();

  const formatDate = (dateString: string) => {
    if (!dateString) return "Date inconnue";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-500/20 text-green-400";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400";
      case "cancelled":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "Confirmée";
      case "pending":
        return "En attente";
      case "cancelled":
        return "Annulée";
      default:
        return status;
    }
  };

  return (
    <main className="space-y-8">
      <Link
        href={"/"}
        className="mb-12 flex items-center gap-2.5 text-sm font-light text-white/50"
      >
        <Undo2 size={20} /> {`Retour à l'accueil`}
      </Link>
      <p className="text-7xl font-extrabold">{user?.name}</p>

      <div className="mt-12">
        {orders.length === 0 ? (
          <div className="rounded-lg border border-white/10 bg-white/5 p-8 text-center">
            <Package className="mx-auto mb-4 h-12 w-12 text-white/30" />
            <p className="text-lg text-white/70">
              Vous n'avez pas encore de commandes
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-lg border border-white/10 bg-white/5 p-6 transition hover:bg-white/7"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-3 flex items-center gap-3">
                      <h3 className="text-xl font-bold">
                        Commande #{order.id.slice(-8).toUpperCase()}
                      </h3>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(order.status || "unknown")}`}
                      >
                        {getStatusLabel(order.status || "unknown")}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-white/70">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>{formatDate(order.createdAt || "")}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Euro size={16} />
                        <span className="font-semibold text-white">
                          {(order.total || 0).toFixed(2)} €
                        </span>
                      </div>
                    </div>
                    <Link
                      href={`/profile/orders/${order.id}`}
                      className="mt-4 flex items-center gap-2 rounded-sm border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium transition hover:bg-white/10"
                    >
                      <Eye size={16} />
                      Voir les détails
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Profile;
