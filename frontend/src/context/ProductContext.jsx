import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { products as starterProducts } from "../data/products";
import { API_URL, ProductContext } from "./productStore";

export function ProductProvider({ children }) {
  const [remoteProducts, setRemoteProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  const refreshProducts = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API_URL}/products`);
      setRemoteProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setIsLoadingProducts(false);
    }
  }, []);

  useEffect(() => {
    let isActive = true;

    axios
      .get(`${API_URL}/products`)
      .then(({ data }) => {
        if (isActive) setRemoteProducts(data);
      })
      .catch((error) => console.error("Failed to fetch products:", error))
      .finally(() => {
        if (isActive) setIsLoadingProducts(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  // Existing catalogue remains visible until it is migrated into Firestore.
  // A Firestore product with the same ID replaces its starter-data version.
  const products = useMemo(() => {
    const productMap = new Map(starterProducts.map((product) => [product.id, product]));
    remoteProducts.forEach((product) => {
      if (product.deleted) {
        productMap.delete(product.id);
      } else {
        productMap.set(product.id, product);
      }
    });
    return [...productMap.values()];
  }, [remoteProducts]);

  return (
    <ProductContext.Provider value={{ products, isLoadingProducts, refreshProducts }}>
      {children}
    </ProductContext.Provider>
  );
}
