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
    "none",
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
      <SelectTrigger aria-label="Select map Layer" className="w-full xs:w-45">
        <SelectValue>{MapType.split("_")[0]}</SelectValue>
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false}>
        {mapTypeArray.map((layer) => (
          <SelectItem key={layer} value={layer} className="capitalize">
            {layer.split("_")[0]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default MapTypeDropdown;
