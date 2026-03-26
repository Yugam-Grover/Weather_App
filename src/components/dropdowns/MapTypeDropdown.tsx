import { type Dispatch, type SetStateAction } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
type Props = {
  MapType: string;
  setMapType: Dispatch<SetStateAction<string>>;
};
const MapTypeDropdown = ({ MapType, setMapType }: Props) => {
  const mapTypeArray = [
    "clouds_new",
    "precipitation_new",
    "pressure_new",
    "wind_new",
    "temp_new",
  ];
  return (
    <Select
      value={MapType}
      onValueChange={(value) => setMapType(value || MapType)}>
      <SelectTrigger className="w-45">
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent>
        {mapTypeArray.map((layer) => (
          <SelectItem key={layer} value={layer}>
            {layer}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default MapTypeDropdown;
