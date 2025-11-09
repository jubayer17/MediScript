import { useAppContext } from "@/context/AppContext";

export const isLoggedIn = () => {
  //   const { token } = useAppContext();
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("token");
};
