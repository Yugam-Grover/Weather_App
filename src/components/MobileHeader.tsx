import { Menu } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import DarkLightToggle from "./DarkLightToggle";
type Props = {
  setSidePanelOpen: Dispatch<SetStateAction<boolean>>;
};

const MobileHeader = ({ setSidePanelOpen }: Props) => {
  return (
    <div className="w-full h-16 bg-background sticky top-0 flex justify-end xs:hidden p-4 pr-7 z-1000 gap-6">
      <DarkLightToggle />
      <button onClick={() => setSidePanelOpen(true)}>
        <Menu className="size-5" />
      </button>
    </div>
  );
};

export default MobileHeader;
