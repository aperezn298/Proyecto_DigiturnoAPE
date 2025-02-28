export const NumeroDocumento = (NumeroDocumento: string): string  => {
    const documentoString = NumeroDocumento.toString();
  
    if (/^\d{8,13}$/.test(documentoString)) {
      return ""; 
    } else {
      return "El número de documento no es válido, debe ser un número de 8 a 13 caracteres";
      ;
    }
  };
  
  export const validarNombre = (nombre: string): string  => {
    if (/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+( [A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/.test(nombre)  || nombre.length > 50) {
      return ""; // Retorna vacío si cumple con la condición
    } else {
      return "El nombre debe contener solo letras máximo 50 caracteres";;
    }
  };
  export const validarApellidos = (nombre: string): string  => {
    if (/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?: [A-Za-zÁÉÍÓÚáéíóúÑñ]+)+$/.test(nombre) || nombre.length > 50) {
      return ""; // Retorna vacío si cumple con la condición
    } else {
      return "Debe ingresar los 2 apellidos; debe contener solo letras y máximo 50 caracteres";
    }
  };

  export const validarCorreo = (correo: string): string  => {
    const regexCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
    if (regexCorreo.test(correo)) {
      return ""; // Retorna vacío si cumple con la condición
    } else {
      return "El correo electrónico no es válido.";
    }
  };
