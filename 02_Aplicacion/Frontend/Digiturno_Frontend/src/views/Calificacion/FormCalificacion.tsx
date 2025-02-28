import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Rating from "./Estrellas";
import { Button, Input, Textarea } from "@nextui-org/react";
import showToast from "../../utils/toastUtil";
import { validarObservacion } from "./Validaciones";

export const FormCalificacion = () => {
    const { turno } = useParams();
    const RUTA_API = import.meta.env.VITE_API_URL;
    const [loading, setLoading] = useState(false);
    const [rating, setRating] = useState(0);
    const [observacion, setObservacion] = useState("");
    const [error, setError] = useState<string | null>(null);


    const handleObservacionChange = useCallback((value: string) => {
        setObservacion(value);
        const validationError = validarObservacion(value);
        setError(validationError);
    }, []);

    const handleSubmit = async (e: any) => {
      

        setLoading(true);
        if (rating < 1 || rating > 5) {
            setLoading(false);
            return showToast("error", "Selecciona una calificación de 1 a 5 estrellas");
        }
        if (error) {
            setLoading(false);
            return showToast("error", error);
        }
        try {
            const response = await fetch(`${RUTA_API}api/tv/calificacion`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    codigo: turno,
                    calificacion: rating,
                    observacion: observacion,
                }),
            });
            const responseData = await response.json();
            if (response.ok) {
                showToast("success", responseData.message)
                setTimeout(()=>{
                    window.location.href= "/"
                },5000)
            } else {
                showToast("error", responseData.message || "Ocurrió un error");
            }
        } catch (error) {
        
            showToast("error", `Ocurrió un error al calificar el turno. ${error}`)
        } finally {
            setLoading(false);
        }
    };
    return (
        <>

            <div className="w-full p-10 rounded-md shadow-xl sm:mx-5 my-4 shadow-[#d1d1d1]">

                <p className="text-center text-2xl font-semibold mb-6">
                    ¡Califica nuestro servicio!
                </p>

                <Rating rating={rating} setRating={setRating} />

                <Textarea
                    className="mt-4"
                    type="text"
                    label="Observación (Opcional)"
                    value={observacion}
                    onValueChange={handleObservacionChange}
                    isInvalid={!!error}
                    errorMessage={error || ""}
                />

                <div className="flex mt-4 space-x-3 justify-end">

                    <Button
                        onPress={handleSubmit}
                        className={`${loading ? "bg-[#00619DFF]" : "bg-[#00304D]"
                            } text-white text-lg w-40`}
                        disabled={loading}
                        isLoading={loading ? true : false}
                    >
                        Enviar
                    </Button>
                </div>

            </div>
        </>
    );
}