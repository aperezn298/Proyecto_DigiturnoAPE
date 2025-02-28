export function obtenerHoraActual(): string {
    const fecha = new Date();
    const horaColombia = fecha.toLocaleTimeString('es-CO', { timeZone: 'America/Bogota', hour12: false });
    return horaColombia.slice(0,8);
}

export function obtenerFechaActual(): Date {
    const ahoraUTC = new Date();
    const opciones: Intl.DateTimeFormatOptions = { 
        timeZone: 'America/Bogota', 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit', 
        hour12: false 
    };

    const formatoColombiano = ahoraUTC.toLocaleString('es-CO', opciones);

    const [fecha] = formatoColombiano.split(', ');
    const [dia, mes, anio] = fecha.split('/');

    return new Date(
        parseInt(anio), 
        parseInt(mes) - 1, 
        parseInt(dia), 
    );
}

