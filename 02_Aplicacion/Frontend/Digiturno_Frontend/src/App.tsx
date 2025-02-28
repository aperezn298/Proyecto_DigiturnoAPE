
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Rutas } from "./routes";
export const App = () => {
  return (
    <>
      <Rutas />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
};
