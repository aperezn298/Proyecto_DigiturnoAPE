import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export function crearToken(usuario:any){
    return jwt.sign(usuario, process.env.SECRET as string, {expiresIn: "24h"});
}

export function validarToken(req: any, res: any, next: any) {
    // Busca el token en el header o en un parametro de la URL
    const token = req.headers["authorization"] || req.query.token || req.headers["Authorization"];
    
    if (!token) {
        return res.status(403).json({ message: "Acceso denegado" });
    }

    jwt.verify(token, process.env.SECRET as string, (err: any, usuario: any) => {
        if (err) {
            return res.status(403).json({ message: "Acceso denegado, token expirado o incorrecto" });
        } else {
            next();
        }
    });
}
