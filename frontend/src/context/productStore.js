import { createContext, useContext } from "react";

export const ProductContext = createContext();
export const API_URL = import.meta.env.VITE_API_URL || "https://artionary-backend.onrender.com/api";
export const useProducts = () => useContext(ProductContext);
