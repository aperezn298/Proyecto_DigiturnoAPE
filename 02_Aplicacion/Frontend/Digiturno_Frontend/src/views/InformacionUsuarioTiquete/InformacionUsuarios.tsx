import { FooterUsuario } from "../../components/Footer";
import { Header } from "../../components/Header";
import { FormDataUsuario } from "./index";

export const InformacionUsurioTiqute: React.FC = () => {
  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center w-full min-h-screen px-4">
        <div className="w-full md:w-1/2">
          <FormDataUsuario />
        </div>
      </div>
      <FooterUsuario />
    </>
  );
};
