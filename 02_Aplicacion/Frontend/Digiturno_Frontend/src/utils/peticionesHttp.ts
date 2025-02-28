import { useContext } from "react";
import { UsuarioContext } from "./usuarioContext";

const useFetchWithAuth = () => {
  const context = useContext(UsuarioContext);

  const fetchWithAuth = async (
    url: string,
    options: RequestInit = {}
  ): Promise<Response> => {
    const token =  (context?.usuario !== undefined) ? context?.usuario.token : "";

    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
      ...{ Authorization: token } ,
    };

    const fetchOptions: RequestInit = {
      ...options,
      headers,
    };

    const response = await fetch(url, fetchOptions);

    if (response.status === 401 || response.status === 403) {
      // redireccionar a pantalla de error o inicio de sesion
    }

    return response;
  };

  return { fetchWithAuth };
};

export default useFetchWithAuth;
