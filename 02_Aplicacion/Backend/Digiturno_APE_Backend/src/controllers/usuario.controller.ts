import {
    Modelos
} from "../models/modelos"

const Usuario = Modelos.Usuario

//constrolador que trae todos usuario 
export const getUsuarios =(req: any, res: any) =>{
    try {
        const usuario = Usuario.findAll()
        return res.json(usuario)
    } catch (error: any) {
        return res.status(500).json({
            message: error.message,
          });
    }

}
//controlador que busca por el id del usuario 
export const getUsuario =(req: any, res: any) =>{
    const {id} = req.params
    try {
        const usuario = Usuario.findOne({
            where: id,
        });
        return res.json(usuario)
    } catch (error: any) {
        return res.status(500).json({
            message: error.message,
          });
    }
}
//controlador que crea el nuevo usuario 
export async function createUsuario(req: any, res: any) {
    const { tipoDocumento, numeroDocumento, nombres, apellidos, correo, tipoPoblacion,   } = req.body;
  
    try {
      // Verificar si ya existe un usuario con el mismo número de documento
      const usuarioExistente = await Usuario.findOne({ where: { numeroDocumento } });
      if (usuarioExistente) {
        return res.status(400).json({ message: "El número de documento ya está registrado" });
      }
  

      const nuevoUsuario = await Usuario.create({
        tipoDocumento,
        numeroDocumento,
        nombres,
        apellidos,
        correo,
        estado:"Activo", 
        tipoPoblacionId : tipoPoblacion,
        tipoUsuarioId : 1,
      });
  
  
      return res.status(201).json(nuevoUsuario);
    } catch (error: any) {
      return res.status(500).json({
        message: error.message,
      });
    }
  }

//controlador que editar el nuevo usuario  

  export async function updateUsuario(req: any, res: any) {
    const { id } = req.params;
    const { tipoDocumento, numeroDocumento, nombres, apellidos, correo, estado } = req.body;
  
    try {
      // Verificar si el usuario existe
      const usuario = await Usuario.findByPk(id);
      if (!usuario) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
  
      // Verificar si el número de documento ya está registrado por otro usuario
      const usuarioExistente = await Usuario.findOne({ 
        where: { numeroDocumento, id: { $ne: id } } // Comprobar si el número de documento ya está en uso por otro usuario
      });
      if (usuarioExistente) {
        return res.status(400).json({ message: "El número de documento ya está registrado por otro usuario" });
      }
  
      // Actualizar los datos del usuario
      await usuario.update({
        tipoDocumento,
        numeroDocumento,
        nombres,
        apellidos,
        correo,
        estado,
      });
  
      return res.status(200).json(usuario);
    } catch (error: any) {
      return res.status(500).json({
        message: error.message,
      });
    }
  }
//controlador que elimina el  usuario 
  export async function deleteUsuario(req: any, res: any) {
    const { id } = req.params;
  
    try {
      // Verificar si el usuario existe
      const usuario = await Usuario.findByPk(id);
      if (!usuario) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
      // Eliminar el usuario
      await usuario.destroy();
  
      return res.status(200).json({ message: "Usuario eliminado correctamente" });
    } catch (error: any) {
      return res.status(500).json({
        message: error.message,
      });
    }
  }

//controlador que cambia el estado de usuario 
  export async function EstadoUsuario(req: any, res: any) {
    const { id } = req.params;
    try {
      const usuario = await Usuario.findByPk(id);
      if (!usuario) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
      let nuevoEstado: "Activo" | "Deshabilitado" = usuario.estado === "Activo" ? "Deshabilitado" : "Activo";
      usuario.estado = nuevoEstado; 
      await usuario.save();
  
      return res.status(200).json({ message: `Estado del usuario cambiado a ${nuevoEstado} `,  });
    } catch (error: any) {
      return res.status(500).json({
        message: error.message,
      });
    }
  }
  