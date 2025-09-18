export async function getProducts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`);
  if (!res.ok) {
    throw new Error("Erreur lors du chargement des produits");
  }
  return res.json();
}

export async function getProductById(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`);
  if (!res.ok) {
    throw new Error("Erreur lor du chargement du produit");
  }
  return res.json();
}
