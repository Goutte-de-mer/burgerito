export async function getProducts() {
  const res = await fetch(`${process.env.API_URL}/products`);
  if (!res.ok) {
    throw new Error("Erreur lors du chargement des produits");
  }
  return res.json();
}

export async function getProductById(id: string) {
  const res = await fetch(`${process.env.API_URL}/products/${id}`);
  if (!res.ok) {
    throw new Error("Erreur lors du chargement du produit");
  }
  return res.json();
}
