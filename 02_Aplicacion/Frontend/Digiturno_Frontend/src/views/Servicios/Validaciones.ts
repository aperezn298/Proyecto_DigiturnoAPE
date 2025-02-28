export const Codigo = (codigo: string): string | null => { 
    if (/^[A-Z]{2}$/.test(codigo)) {
      return null;
    } else {
      return "El código debe contener solo dos letras en mayúsculas.";
    }
};

export const Nombre = (codigo: string): string | null => { 
    if (/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,-]{1,150}$/.test(codigo)) { 
      return null;
    } else {
        return "El nombre debe ser alfanumérico; máximo 150 caracteres";
    }
  };
  export const validarDescripcion = (Descripcion: string): string | null => { 
    if ( /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,-]{1,255}$/.test(Descripcion)) { 
      return null;
    } else {
        return "La descripción debe ser alfanumérica; máximo 250 caracteres";
    }
  };export const validarFecha = (fecha: string): string | null => {

  
    const ahora = new Date();
    const fechaIngresada = new Date(ahora.toDateString() + ' ' + fecha); // Crear fecha completa
  
    if (isNaN(fechaIngresada.getTime())) {
      return "La fecha ingresada no es válida.";
    }
    if (fecha.length > 4) { return "La fecha ingresada no puede tener más de 4 caracteres."; }
    else {
      return null;
    }
     
  };
  