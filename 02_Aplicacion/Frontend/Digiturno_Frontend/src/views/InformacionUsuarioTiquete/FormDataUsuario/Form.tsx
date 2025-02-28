import {
  Autocomplete,
  AutocompleteItem,
  Button,

  Checkbox,

  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { ChangeEvent, useState } from "react";
import { useParams } from "react-router-dom";
import { Tiquete } from "../Tiquete/Tiquete";
import { tipoUsuarioId, tipoIdentidad, tipoPoblacionId } from "./Data";
import {
  NumeroDocumento,
  validarApellidos,
  validarCorreo,
  validarNombre,
} from "./Validaciones";
import { UsuarioFormato } from "../../../states/context/Interface";
import showToast from "../../../utils/toastUtil";
import { Link } from "react-router-dom";
import { Item } from "react-stately";

const RUTA_API = import.meta.env.VITE_API_URL;

export const FormDataUsuario = () => {
  const { servicio } = useParams();
  const [formData, setFormData] = useState<UsuarioFormato>({
    id: 0, // Valor inicial para 'id'
    tipoUsuarioId: 0,
    tipoDocumento: "RC",
    numeroDocumento: "",
    nombres: "",
    apellidos: "",
    correo: "",
    prioridad: false,
    tipoPoblacion:{nombre:""},
    tipoUsuario:{nombre:""},
    tipoPoblacionId: 1,
    estado: "Activo", // Valor inicial para 'estado'
  });
  const [identidad, setIdentidad] = useState<Set<string>>(new Set());
  const [usuario, setUsuario] = useState<Set<string>>(new Set());
  const [touchedIdentidad, setTouchedIdentidad] = useState(false);
  const [touchedUsuario, setTouchedUsuario] = useState(false);
  const [nombreComppleto, setnombreCompleto] =useState("");
  const isIdentidadValid = identidad.size > 0;
  const isUsuarioValid = usuario.size > 0;
  const [servicios, setServicios] = useState({
    servicios: [{ id: 0, nombre: "" }],
  });
  const [checkbox, setCheckbox] = useState(false)
  const [showTicket, setShowTicket] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [Codigo, setCodigo] = useState("");
  // Estado adicional para gestionar el valor del Autocomplete
  const [autocompleteValue, setAutocompleteValue] = useState("");
  const [selectedPoblacionId, setSelectedPoblacionId] = useState("");
  const [registrarApe, setregistrarApe] = useState(false);

  const handleInputChange = (
    e: ChangeEvent<
      | HTMLInputElement
      | HTMLSelectElement
      | { target: { name: string; value: any } }
    >
  ) => {
    const { name, value }: any = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]:
        name === "tipoUsuarioId" || name === "tipoPoblacionId"
          ? Number(value)
          : value,
    }));

    // Validación en tiempo real
    let error: any = "";
    if (name === "numeroDocumento") {
      error = NumeroDocumento(value);
    } else if (name === "nombres") {
      error = validarNombre(value);
    } else if (name === "apellidos") {
      error = validarApellidos(value);
    } else if (name === "correo") {
      error = validarCorreo(value);
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error || "",
    }));
  };

  const handleAutocompleteSelectionChange = (key: any | null) => {
    if (key === null) {
      
      showToast("error", "No se seleccionó ninguna opción.")
      return;
    }

    const id = key.toString();
    setSelectedPoblacionId(id);
    setFormData((prevData) => ({
      ...prevData,
      tipoPoblacionId: Number(id),
    }));
  };



  const handleAutocompleteInputChange = (value: string) => {
    setAutocompleteValue(value);
  };
  const validationErrors: { [key: string]: string } = {};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouchedIdentidad(true);
    setTouchedUsuario(true);
    // Validar campos requeridos y otros errores
    if (!formData.numeroDocumento) {
      validationErrors.numeroDocumento = "Rellene este campo.";
    } else if (NumeroDocumento(formData.numeroDocumento)) {
      validationErrors.numeroDocumento = NumeroDocumento(formData.numeroDocumento);
    }

    if (!formData.nombres) {
      validationErrors.nombres = "Rellene este campo.";
    } else if (validarNombre(formData.nombres)) {
      validationErrors.nombres = validarNombre(formData.nombres);
    }

    if (!formData.apellidos) {
      validationErrors.apellidos = "Rellene este campo.";
    } else if (validarApellidos(formData.apellidos)) {
      validationErrors.apellidos = validarApellidos(formData.apellidos);
    }

    if (!formData.correo) {
      validationErrors.correo = "Rellene este campo.";
    } else if (validarCorreo(formData.correo)) {
      validationErrors.correo = validarCorreo(formData.correo);
    }

    if (!selectedPoblacionId) {
      validationErrors.tipoPoblacionId = "Seleccione un tipo de población.";
    }

    if (!formData.tipoUsuarioId === null) {
      validationErrors.tipoUsuarioId = "Seleccione un tipo de usuario.";
    }
    if (!formData.tipoDocumento === null) {
      validationErrors.tipoUsuarioId = "Seleccione un tipo de Documentos.";
    }


    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      console.log("formData", formData);
      const response = await fetch(`${RUTA_API}api/tv`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          prioridad: checkbox,
          servicioId: Number(servicio),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setCodigo(data.codigo);
        setServicios(data.servicios);
        setregistrarApe(data.verificado);
        showToast("success", "¡Turno registrado exitosamente!");
        setShowTicket(true);
        setnombreCompleto(formData.nombres + " " + formData.apellidos);
        setFormData({
          id: 0,
          tipoUsuarioId: 0,
          tipoDocumento: "RC",
          numeroDocumento: "",
          nombres: "",
          apellidos: "",
          correo: "",
          prioridad: false,
          tipoPoblacion: { nombre: "" },
          tipoUsuario: { nombre: "" },
          tipoPoblacionId: 1,
          estado: "Activo",
        });
        setIdentidad(new Set());
        setUsuario(new Set());
        setTouchedIdentidad(false);
        setTouchedUsuario(false);
        setCheckbox(false);
        setAutocompleteValue("");
        setSelectedPoblacionId("");
      } else {
        const errorMessage = await response.json();
        showToast("error", errorMessage.message || "Ocurrió un error");
      }
     // aqui vasia el formlario 
    } catch (error) {
      showToast("error", `Ocurrió un error al registrar el turno. ${error}`);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="w-full p-10 rounded-md shadow-xl sm:mx-5 my-4 shadow-[#d1d1d1]">
      <p className="text-center text-2xl font-semibold mb-6">
        Información del Usuario
      </p>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 justify-center items-center"
      >
        <div className=" grid sm:grid-cols-2 gap-4">
        <Select
          variant="underlined"
          label="Tipo de Documento"
          size="md"
          name="tipoDocumento"
          onChange={handleInputChange}
          value={formData.tipoDocumento}
        
          placeholder="Selecciona una opción"
          selectedKeys={usuario}
          onSelectionChange={(keys) => setUsuario(new Set(keys as unknown as string[]))}
          onClose={() => setTouchedUsuario(true)}
          isInvalid={!isUsuarioValid && touchedUsuario}
          errorMessage={!isUsuarioValid && touchedUsuario ? "Campo obligatorio" : ""}
        >
          {tipoIdentidad.map((item) => (
            <SelectItem key={item.value} value={item.value}>{item.nombre}</SelectItem>
          ))}
        </Select>
        <Select
         
         variant="underlined"
         label="Tipo de Usuario"
         size="md"
         name="tipoUsuarioId"
         onChange={handleInputChange}
         value={formData.tipoUsuarioId}
          placeholder="Selecciona una opción"
          selectedKeys={identidad}
          onSelectionChange={(keys) => setIdentidad(new Set(keys as unknown as string[]))}
          onClose={() => setTouchedIdentidad(true)}
          isInvalid={!isIdentidadValid && touchedIdentidad}
          errorMessage={!isIdentidadValid && touchedIdentidad ? "Campo obligatorio" : ""}
        >
          {tipoUsuarioId.map((item) => (
            <SelectItem key={item.id} value={item.id}>{item.nombre}</SelectItem>
          ))}
        </Select>
     

          <Input

            type="text"
            variant="underlined"
            label="Número de Identidad"
            size="md"
            name="numeroDocumento"
            onChange={handleInputChange}
            isInvalid={!!errors.numeroDocumento}
            errorMessage={errors.numeroDocumento || ""}
            value={formData.numeroDocumento}
          />
          <Input

            type="text"
            variant="underlined"
            label="Nombres"
            size="md"
            name="nombres"
            onChange={handleInputChange}
            isInvalid={!!errors.nombres}
            errorMessage={errors.nombres || ""}
            value={formData.nombres}
          />
          <Input

            type="text"
            variant="underlined"
            label="Apellidos"
            size="md"
            name="apellidos"
            onChange={handleInputChange}
            isInvalid={!!errors.apellidos}
            errorMessage={errors.apellidos || ""}
            value={formData.apellidos}
          />
          <Input

            type="email"
            variant="underlined"
            label="Email"
            size="md"
            name="correo"
            onChange={handleInputChange}
            isInvalid={!!errors.correo}
            errorMessage={errors.correo || ""}
            value={formData.correo}
          />
          <Autocomplete
            isRequired
            label="Tipo de Población"
            variant="underlined"
            allowsCustomValue={false}
            onSelectionChange={handleAutocompleteSelectionChange}
           
            onInputChange={(value) => {
              setAutocompleteValue(value);

              // Opcionalmente puedes limpiar errores si el usuario escribe algo
              if (value) {
                setErrors((prevErrors) => ({
                  ...prevErrors,
                  tipoPoblacionId: "",
                }));
              }
            }}
            defaultItems={tipoPoblacionId.map((tipo) => ({
              key: tipo.id.toString(),
              label: tipo.nombre,
            }))}
            value={autocompleteValue}
            errorMessage={errors.tipoPoblacionId || ""}
          >
            {(item) => (
              <AutocompleteItem key={item.key} value={item.key}>
                {item.label}
              </AutocompleteItem>
            )}
          </Autocomplete>
        </div>
        <Checkbox isSelected={checkbox} onValueChange={setCheckbox}>
          <p>¿Es usted una persona de la tercera edad, con discapacidad, con niño en brazos o una mujer embarazada?</p>
        </Checkbox>


        <div className="flex mt-4 space-x-3 justify-end">
          <div>
            <Link to={"/servicios"}>
              <button color="default" className="text-base text-center justify-center items-center bg-[#D4D4D8] p-2 px-3  rounded-xl">
                Volver
              </button>
            </Link>
          </div>

          <Button
            type="submit"
            className={`${loading ? "bg-[#00619DFF]" : "bg-[#00304D]"
              } text-white text-lg w-40`}
            disabled={loading}
            isLoading={loading ? true : false}
          >
            Enviar
          </Button>
        </div>
      </form>

      {showTicket && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={() => setShowTicket(false)}
        >
          <Tiquete
          key={servicio}
            servicios={servicios}
            nombre={`${nombreComppleto}`}
            codigo={Codigo}
            registradoEnLaAPE={registrarApe}
          />
        </div>
      )}
    </div>
  );
};
