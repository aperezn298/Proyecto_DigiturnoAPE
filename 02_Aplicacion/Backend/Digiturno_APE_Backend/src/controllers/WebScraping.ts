import dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.API_KEY_PYTHON;
const URL = process.env.BACK_URL_PYTHON;

export async function verificarUsuario(
  numeroDocumento: string,
  email: string,
  servicioId: number
): Promise<any> {
  try {
    // Construir la URL con los parámetros de consulta
    const urlConParametros = `${URL}/webscraping?numero_documento=${encodeURIComponent(numeroDocumento)}&email=${encodeURIComponent(email)}&servicio_id=${servicioId}`;
    
    // Hacer la solicitud POST
    const respuesta= await fetch(urlConParametros, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        ...(API_KEY && { 'x-api-key': API_KEY }), // Agrega 'x-api-key' solo si API_KEY tiene un valor
      },
    });
    
    // Verificar la respuesta del servidor
    if (!respuesta.ok) {
      console.error(`Error en la solicitud: ${respuesta.status} - ${respuesta.statusText}`);
      return false;
    }

    // Retornar `true` si todo salió bien
    return respuesta;
  } catch (error) {
    console.error("Error al verificar el usuario:", error);
    return false;
  }
}
