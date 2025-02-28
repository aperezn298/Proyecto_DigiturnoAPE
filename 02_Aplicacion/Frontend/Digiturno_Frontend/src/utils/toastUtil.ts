// src/utils/toastUtils.ts
import { toast, ToastOptions } from "react-toastify";
import { Slide } from "react-toastify";

// Define un tipo para los tipos de toast que deseas manejar
type ToastType = "success" | "error" | "info" | "warning";

const defaultOptions: ToastOptions = {
  position: "bottom-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "colored",
  transition: Slide,
};

const showToast = (type: ToastType, message: string, options?: ToastOptions) => {
  const toastOptions = { ...defaultOptions, ...options }; // Combina opciones por defecto con las opciones personalizadas

  switch (type) {
    case "success":
      toast.success(message, toastOptions);
      break;
    case "error":
      toast.error(message, toastOptions);
      break;
    case "info":
      toast.info(message, toastOptions);
      break;
    case "warning":
      toast.warning(message, toastOptions);
      break;
    default:
      break;
  }
};

export default showToast;
