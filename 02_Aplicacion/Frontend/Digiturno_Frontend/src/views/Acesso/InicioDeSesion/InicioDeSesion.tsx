/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Image, Divider } from "@nextui-org/react";
import {
  FormSesion,
  FooterSesion,
  FormCodigo,
  FormCorreo,
  FormNuevaContrasena,
} from "../index";
import Imagen from "../../../assets/image 12.png";
import {  useState } from "react";

export const InicioDeSesion = () => {
  const [formData, setFormData] = useState({
    correo: "",
    contrasena: "",
    correoRecuperar: "",
    codigo: "",
    nuevaContrasena: "",
    confirmarNuevaContrasena: "",
    vista: 0,
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const reiniciarRecuperar = () => {
    setFormData((prevData) => ({
      ...prevData,
      correo: "",
      contrasena: "",
      correoRecuperar: "",
      codigo: "",
      nuevaContrasena: "",
      confirmarNuevaContrasena: "",
      vista: 0,
    }));
  };
  
  return (
    <div  className="bg-slate-50 bg-[url('assets/fondoBlancoVerde.png')] bg-cover bg-center bg-no-repeat flex items-center justify-center min-h-screen shadow-2xl shadow-gray-50" >
      <div className="bg-white rounded-2xl flex flex-col lg:flex-row w-4/5 max-w-4xl shadow-2xl">
        {/* Mantener la imagen en la mitad izquierda solo en pantallas grandes */}
        <div className="hidden rounded-2xl lg:flex w-1/2 bg-cover p-4  bg-origin-padding bg-center " style={{backgroundImage: `url(${Imagen})` }}>
          
        </div>
        {/* Colocar el contenido en la otra mitad derecha */}
        <div className="flex-grow lg:w-1/2 flex flex-col justify-between  ">
          <div className="flex flex-col items-center h-full">
            <Image
              src={"https://res.cloudinary.com/doza0twgj/image/upload/v1734039010/LOGO_APE_color_gjlabc.png"}
              className="w-4/5 lg:w-64 mt-3 mb-1  mx-auto "
            />
            <Divider className="my-2 w-full" />

            {formData.vista === 0 && (
              <FormSesion
              
                formData={formData}
                setFormData={setFormData}
                handleChange={handleChange}
              />
            )}
            {formData.vista === 1 && (
              <FormCorreo
                formData={formData}
                setFormData={setFormData}
                handleChange={handleChange}
                reiniciarRecuperar={reiniciarRecuperar}
              />
            )}
            {formData.vista === 2 && (
              <FormCodigo
                formData={formData}
                setFormData={setFormData}
                handleChange={handleChange}
                reiniciarRecuperar={reiniciarRecuperar}
              />
            )}
            {formData.vista === 3 && (
              <FormNuevaContrasena
                formData={formData}
                setFormData={setFormData}
                handleChange={handleChange}
                reiniciarRecuperar={reiniciarRecuperar}
              />
            )}
          </div>
          {/* Footer en la parte inferior de la segunda mitad */}
          <FooterSesion />
        </div>
      </div>
    </div>
  );
};
