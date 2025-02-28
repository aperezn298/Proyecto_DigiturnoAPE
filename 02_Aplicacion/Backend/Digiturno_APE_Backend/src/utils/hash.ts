import bcrypt from "bcrypt";

export const crearHash = async (value: string) => {
  const salt = await bcrypt.genSalt();
  return bcrypt.hashSync(value, salt);
};

export async function isContrasenaValida(contrasena:string, contrasenaEncriptada:string) {
  return await bcrypt.compare(contrasena, contrasenaEncriptada);
};
