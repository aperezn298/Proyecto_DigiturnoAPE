import dotenv from "dotenv";
import http from "http";
import "./models/modelos";
import { sequelize } from "./database/database";
import app from "./app";
import { setupWebSocket } from "./utils/websocket";
dotenv.config();
let broadcast: (message: object) => void;
async function main() {
  const PORT: number = parseInt(process.env.PORT || "3000", 10);

  try {
    await sequelize.sync();
    const server = http.createServer(app);

    const wsSetup = setupWebSocket(server);
    broadcast = wsSetup.broadcast;

    server.listen(PORT, () => {
      console.log(`Servidor escuchando en el puerto: ${PORT}`);
      console.log(`Puedes acceder en http://localhost:${PORT}/`);
    });
  } catch (e) {
    console.error("Error al iniciar el servidor:", e);
    process.exit(1);
  }

}

main();

export { broadcast };