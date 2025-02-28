import { Image, Tooltip } from "@nextui-org/react";
import { Link } from "react-router-dom";
interface IconoNavegacionProps {
  Icono: string;
  Titulo: string;
  Url: string;
  isSelected: boolean;
  onSelect: () => void;
}

export const IconoNavegacion: React.FC<IconoNavegacionProps> = ({
  Icono,
  Titulo,
  Url,
  isSelected,
  onSelect,
}) => {
  return (
    <div className="my-2">
      <Link to={Url} className="py-2" onClick={onSelect}>
        <Tooltip content={Titulo} color="primary" placement="right">
          <div className={`p-2 rounded-full ${isSelected ? "border-1 border-white" : ""}`}>
            <Image width={50} src={Icono} className="" />
          </div>
        </Tooltip>
      </Link>
    </div>
  );
};
