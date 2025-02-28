import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./index.css";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import { BrowserRouter } from "react-router-dom";
import { NextUIProvider } from "@nextui-org/react";
import { UsuarioProvider } from "./utils/usuarioContext";
import { WebSocketProvider }from "./utils/webSocketContext";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <NextUIProvider>
      <BrowserRouter  >
        <UsuarioProvider>
          <WebSocketProvider>
            <App />
          </WebSocketProvider>
        </UsuarioProvider>
      </BrowserRouter>
    </NextUIProvider>
  </StrictMode>
);
