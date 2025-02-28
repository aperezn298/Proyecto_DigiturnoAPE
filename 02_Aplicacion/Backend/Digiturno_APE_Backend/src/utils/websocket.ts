import WebSocket from "ws";

export const setupWebSocket = (server: any) => {
  const wss = new WebSocket.Server({ server });
  const clients: Map<string, WebSocket> = new Map(); // Mapa para gestionar los clientes

  wss.on("connection", (ws: WebSocket, req: any) => {
    const params = new URLSearchParams(req.url.split("?")[1]);
    const clientId = params.get("clientId");

    if (!clientId) {
      ws.close(1008, "El cliente necesita ID");
      return;
    }

    console.log(`Cliente conectado: ${clientId}`);

    // **Gestión de conexiones duplicadas**
    if (clients.has(clientId)) {
      const oldSocket = clients.get(clientId);
      oldSocket?.close(4000, "Conexión duplicada cerrada"); // Cierra con un código y mensaje personalizado
      console.log(`Cliente reconectado: ${clientId}`);
    }    

    clients.set(clientId, ws); // Asocia el nuevo WebSocket con el clientId

    // elimina al cliente si coincide con la conexion
    ws.on("close", () => {
      if (clients.get(clientId) === ws) {
        clients.delete(clientId); 
      }
      console.log(`Cliente desconectado: ${clientId}`);
    });

  });

  // envia mensaje a todos los clientes conctados
  const broadcast = (message: object) => {
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  };

  console.log("WebSocket configurado\n");

  return { wss, broadcast };
};
