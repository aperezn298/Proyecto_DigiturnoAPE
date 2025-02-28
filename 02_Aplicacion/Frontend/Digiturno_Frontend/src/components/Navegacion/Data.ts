import IconDasboard from "../../assets/dashboard-interface.png";
import Iconempleado from "../../assets/empleado.png";
import Iconservicio from "../../assets/servicio.png";
import IconGente from "../../assets/gente 1.png";
import IconTicket from "../../assets/TicketBlanco.png";

export const Info = [{
    Icono: IconDasboard,
    Titulo: "Dashboard",
    Url: "/dashboard",
    selectedIcon: "Dashboard",
    onSelect: "Dashboard",


},
{
    Icono: Iconempleado,
    Titulo: "Empleado",
    Url: "/empleados",
    selectedIcon: "Empleados",
    onSelect: "Empleados",


},
{
    Icono: Iconservicio,
    Titulo: "Servicios",
    Url: "/servicio",
    selectedIcon: "Servicios",
    onSelect: "Servicios",


},
{
    Icono: IconGente,
    Titulo: "Historial de Turnos",
    Url: "/historialturnos",
    selectedIcon: "Historial de Turnos",
    onSelect: "Historial de Turnos",


},
{
    Icono: IconTicket,
    Titulo: "Seguimiento de Turnos",
    Url: "/seguimiento",
    selectedIcon: "Turnos",
    onSelect: "Turnos",


}

]