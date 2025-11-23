"use client";
import { ShoppingCart, Plus, Minus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import CartItem from "@/types/cartItem";
import {
  updateCartItemAction,
  removeFromCartAction,
  clearCartAction,
} from "@/app/actions/cart";

type CartButtonProps = {
  cart: CartItem[];
};

const CartButton = ({ cart }: CartButtonProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const router = useRouter();

  const handleUpdateQuantity = async (
    productId: string,
    newQuantity: number,
  ) => {
    await updateCartItemAction(productId, newQuantity);
    router.refresh();
  };

  const handleRemoveItem = async (productId: string) => {
    await removeFromCartAction(productId);
    router.refresh();
  };

  const handleClearCart = async () => {
    await clearCartAction();
    router.refresh();
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="relative">
      {cart.length > 0 && (
        <div className="absolute -top-2 -left-2 flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs text-black">
          {totalQuantity}
        </div>
      )}
      <button
        className="rounded-sm p-1.5 transition hover:bg-white/15 active:scale-90"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <ShoppingCart />
      </button>
      <div
        className={`invisible absolute top-11 left-0 z-10 w-screen max-w-xs rounded-md bg-white px-4 py-3 text-black shadow-lg transition ${isOpen ? "visible translate-y-0 opacity-100" : "translate-y-1 opacity-0"}`}
      >
        <div className="mb-3 flex items-center justify-between border-b pb-2">
          <h3 className="text-lg font-bold">Panier</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-sm p-1 transition hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        {cart.length === 0 ? (
          <p className="py-4 text-center text-gray-500">
            Aucun article dans le panier
          </p>
        ) : (
          <>
            <div className="max-h-64 space-y-3 overflow-y-auto">
              {cart.map((cartItem) => (
                <div
                  className="flex items-start gap-3 border-b pb-3 last:border-0"
                  key={cartItem.productId}
                >
                  <div className="flex-1">
                    <p className="font-semibold">{cartItem.name}</p>
                    <p className="text-sm text-gray-600">
                      {cartItem.price} € × {cartItem.quantity}
                    </p>
                    <p className="font-bold">
                      {(cartItem.price * cartItem.quantity).toFixed(2)} €
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => handleRemoveItem(cartItem.productId)}
                      className="rounded-sm p-1 text-red-500 transition hover:bg-red-50"
                      title="Supprimer"
                    >
                      <Trash2 size={16} />
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          handleUpdateQuantity(
                            cartItem.productId,
                            cartItem.quantity - 1,
                          )
                        }
                        className="rounded-sm border border-gray-300 p-1 transition hover:bg-gray-100"
                        disabled={cartItem.quantity <= 1}
                        title="Diminuer"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="min-w-[2rem] text-center text-sm font-semibold">
                        {cartItem.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleUpdateQuantity(
                            cartItem.productId,
                            cartItem.quantity + 1,
                          )
                        }
                        className="rounded-sm border border-gray-300 p-1 transition hover:bg-gray-100"
                        title="Augmenter"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 border-t pt-3">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-lg font-bold">TOTAL</p>
                <p className="text-lg font-bold">{total.toFixed(2)} €</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleClearCart}
                  className="flex-1 rounded-sm border border-red-500 bg-white px-3 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-50"
                >
                  Vider le panier
                </button>
                <button
                  onClick={() => {
                    // TODO: Rediriger vers la page de commande
                    setIsOpen(false);
                  }}
                  className="flex-1 rounded-sm bg-black px-3 py-2 text-sm font-semibold text-white transition hover:bg-gray-800"
                >
                  Commander
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartButton;
