import { Sequelize as Sq } from "sequelize";
import dotenv from "dotenv";

// Cargar variables de entorno desde el archivo .env
dotenv.config();

export const sequelize = new Sq(process.env.DATABASE_URL as string, {
    dialect: "postgres", // Dialecto
    protocol: "postgres", // Protocolo utilizado
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false, // Ajuste para servidores que no verifican el certificado SSL
        },
    },
});