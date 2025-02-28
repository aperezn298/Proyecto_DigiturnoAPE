import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer/Footer";
import { FormCalificacion } from "./FormCalificacion";

export const Calificacion = () => {

  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center w-full min-h-screen px-4">
        <div className="w-full md:w-1/2 lg:w-1/3">
          <FormCalificacion />
        </div>
      </div>
      <Footer />
    </>
  );
}