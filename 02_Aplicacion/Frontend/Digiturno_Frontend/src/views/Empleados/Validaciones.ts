export const NumeroDocumento = (NumeroDocumento: number): string | boolean => {
    const documentoString = NumeroDocumento.toString();
  
    if (/^\d{8,13}$/.test(documentoString) || documentoString == null) {
      return false; 
    } else {
      return "El número de documento no es válido, debe ser un número de 8 a 13 caracteres";
      ;
    }
  };
  
  export const validarNombre = (nombre: string): string |boolean => {
    if (/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+( [A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/.test(nombre)  && nombre.length <= 50) {
      return false; // Retorna vacío si cumple con la condición
    } else {
      return "El nombre debe contener solo letras máximo 50 caracteres";;
    }
  };
  export const validarApellidos = (nombre: string): string |boolean => {
    if (/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?: [A-Za-zÁÉÍÓÚáéíóúÑñ]+)+$/.test(nombre) && nombre.length <= 50) {
      return false; // Retorna vacío si cumple con la condición
    } else {
      return "Debe ingresar los 2 apellidos; debe contener solo letras y máximo 50 caracteres";
    }
  };

  export const validartelefono = (telefono: number): string | boolean => {
    if (  /^\d{10}$/.test(telefono.toString())) {
      return false; // Retorna false si cumple con la condición
    } else {
      return "El número de telefono debe comenzar con 3, tener 10 dígitos y solo contener números.";
    }
  };
  

  export const validarCorreo = (correo: string): string | boolean => {
    const regexCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
    if (regexCorreo.test(correo)) {
      return false; // Retorna vacío si cumple con la condición
    } else {
      return "El correo electrónico no es válido.";
    }
  };
export  const validarContrasena = (contrasena: string): string | boolean=> {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;

    if (regex.test(contrasena)) {
        return false; // Retorna vacío si cumple con la condición
      } else {
        return "La contraseña debe tener al menos 6 caracteres, una mayúscula, un número y un carácter especial";
      }
  };

  export const ValidarConfirmarContrsena = (contrasena: string, contrasenaconfirmar: string): string | boolean =>{
    if (contrasena === contrasenaconfirmar){
        return false;
    }else {
        return "Las contraseñas no coinciden"
    }
  }  