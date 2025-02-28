import { Image } from "@nextui-org/react";
import ImagenFooter from "../../assets/footer.png";

export const FooterSesion = () => {
  return (
    <div className="bg-[#39A900] w-full h-24 flex justify-end items-center relative rounded-r-xl">
      <Image src={ImagenFooter} className="mx-5 max-w-36" alt="Footer" />
    </div>
  );
};
