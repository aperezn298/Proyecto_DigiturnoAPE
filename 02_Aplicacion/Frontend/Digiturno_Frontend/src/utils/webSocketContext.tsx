import React, { useState, useEffect, useContext, ReactNode } from "react";
import { v4 as uuidv4 } from 'uuid';

interface Event {
  type: string;
  data: any;
}

const WebSocketContext = React.createContext<{
  eventoActual: Event | null;
} | null>(null);

interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const [eventoActual, setEventoActual] = useState<Event | null>(null);

  useEffect(() => {
    let socket: WebSocket | null = null;

    const connect = () => {

      const clientId = uuidv4(); // Genera un clientId único
      socket = new WebSocket("wss://digiturno-ape-backend.onrender.com?clientId=" + clientId);
      //socket = new WebSocket("ws://localhost:3000?clientId=" + clientId);

      socket.onopen = () => {
        console.log("Conexión WebSocket establecida");
      };

      socket.onmessage = (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);
          setEventoActual(data); //guardar el evento para que los demas componentes reaccionen a el
        } catch (error) {
          console.error("Error al procesar el mensaje WebSocket:", error);
        }
      };

      socket.onclose = (event) => {
        console.log(`Conexión cerrada: Código ${event.code}, Razón: ${event.reason}`);
      
        // Si el código de cierre es 4000, significa que la reconexión fue forzada por el servidor
        if (event.code === 4000) {
          console.log("Reconexión por cierre forzado del servidor");
        }
      
      };

      socket.onerror = (error) => {
        console.error("Error en WebSocket:", error);
      };
    };

    connect(); // establece la conexion

    return () => {
      if (socket) socket.close(); // Cierra el WebSocket cuando el componente se desmonte
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ eventoActual }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocketContext = () => {
  const context = useContext(WebSocketContext);
  if (!context) throw new Error("useWebSocketContext debe usarse dentro de WebSocketProvider");
  return context;
};
