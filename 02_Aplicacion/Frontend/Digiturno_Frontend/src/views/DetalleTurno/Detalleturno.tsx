import { Footer } from "../../components/Footer/Footer";
import { Header } from "../../components/Header";
import { InformacionUsuarioTurno } from "./index"

export const InformacionTurno: React.FC = () => {
  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center w-full min-h-screen px-4">
        <div className="w-full md:w-1/2 lg:w-1/3">
          <InformacionUsuarioTurno />
        </div>
      </div>
      <Footer />
    </>
  );
};
