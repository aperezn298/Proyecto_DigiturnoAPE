import express from "express";
import cors from "cors";
import empleadoRutas from "./routes/empleado.routes";
import tipoEmpleadoRutas from "./routes/tipoEmpleado.routes";
import accesoRutas from "./routes/acceso.routes";
import turnoRutas from "./routes/turno.routes";
import servicioRutas from "./routes/servicio.routes";
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
import tvRutas from "./routes/tv.routes";
import { validarToken } from "./utils/jwt";

const app = express();

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: "doza0twgj",
  api_key: "547823795774979",
  api_secret: "PVI2hACsISs2nqEkreqfJnoEtII",
});

// Configuración de multer-storage-cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads", // Cambia el nombre de la carpeta según tu preferencia
    allowed_formats: ["jpg", "png", "jpeg", "gif", "mp4", "mov"],
    transformation: [{ 
      quality: "auto:good", // Ajusta la calidad automáticamente para mantener un buen equilibrio entre calidad y tamaño
      fetch_format: "auto" // Permite que Cloudinary decida el formato más adecuado
    }],
  },
});

const upload = multer({ storage: storage });
app.use(cors());

// Ruta para la carga de múltiples archivos
app.post("/public", upload.array("files", 1), (req:any, res:any) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).send({ error: "No se han subido archivos" });
    }

    const fileUrls = req.files.map((file: { path: any; }) => file.path); // URLs generadas por Cloudinary
    res.status(200).send({
      data: "Archivos cargados correctamente",
      files: fileUrls,
    });
  } catch (error:any) {
    res.status(500).send({ error: "Error al subir los archivos", details: error.message });
  }
});

//middlewares
const corsOptions = {

  origin: "*",  // Permite solicitudes de todos los orígenes
  methods: ["GET", "POST", "PUT", "DELETE"],
  optionsSuccessStatus: 200,
};


app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//routes
//QUITAR LOS COMENTARIOS PARA VALIDAR EL TOKEN EN ESTAS RUTAS
app.use("/api/empleado", validarToken, empleadoRutas);
app.use("/api/tipoEmpleado", validarToken, tipoEmpleadoRutas);
app.use("/api/acceso", accesoRutas);
app.use("/api/turno", /*validarToken,*/ turnoRutas);
app.use("/api/servicio", validarToken, servicioRutas);
app.use("/api/tv", tvRutas);
app.use("/api/acceso", accesoRutas);//No se valida el token por ser el acceso

export default app;
