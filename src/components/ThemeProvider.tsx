import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type Props = {
  children: ReactNode;
};

type Theme = "light" | "dark";
type themeContextType = {
  Theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<themeContextType | undefined>(undefined);

const ThemeProvider = ({ children }: Props) => {
  const [themeValue, setThemeValue] = useState<Theme>(() => {
    return (localStorage.getItem("theme") as Theme) || "dark";
  });
  function toggleTheme() {
    setThemeValue((prev) => {
      const newTheme = prev === "dark" ? "light" : "dark";
      localStorage.setItem("theme", newTheme);
      return newTheme;
    });
  }
  useEffect(() => {
    const root = document.documentElement;
    if (themeValue === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [themeValue]);

  return (
    <ThemeContext.Provider
      value={{
        Theme: themeValue,
        toggleTheme,
      }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
export const useTheme = () => {
  const Context = useContext(ThemeContext);
  if (!Context) throw new Error("Please use useTheme inside a themeProvider.");
  return Context;
};
