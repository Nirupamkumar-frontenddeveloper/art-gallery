import { useCallback, useEffect, useState } from "react";
import axios from "axios";
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

  return (
    <ProductContext.Provider value={{ products: remoteProducts, isLoadingProducts, refreshProducts }}>
      {children}
    </ProductContext.Provider>
  );
}
