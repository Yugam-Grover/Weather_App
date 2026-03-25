import { type Dispatch, type SetStateAction } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
type Props = {
  location: string;
  setLocation: Dispatch<SetStateAction<string>>;
};
const LocationDropdown = ({ location, setLocation }: Props) => {
  const locationsArray = [
    "Bangkok",
    "Paris",
    "London",
    "Dubai",
    "Singapore",
    "Kuala Lumpur",
    "New York",
    "Istanbul",
    "Tokyo",
    "Seoul",
  ];
  return (
    <Select
      value={location}
      onValueChange={(value) => setLocation(value || location)}>
      <SelectTrigger className="w-45">
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent>
        {locationsArray.map((city) => (
          <SelectItem key={city} value={city}>
            {city}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LocationDropdown;
