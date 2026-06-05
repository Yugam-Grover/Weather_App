import { Moon, SunMedium } from "lucide-react";
import { Switch } from "./ui/switch";
import { useTheme } from "./ThemeProvider";

const DarkLightToggle = () => {
  const { Theme, toggleTheme } = useTheme();
  return (
    <div className="flex items-center gap-2">
      <SunMedium className="size-5 shrink-0" />
      <Switch checked={Theme === "dark"} onCheckedChange={toggleTheme} />
      <Moon className="size-5 shrink-0" />
    </div>
  );
};

export default DarkLightToggle;
