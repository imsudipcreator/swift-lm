import { Colors } from "@/constants/theme";
import { createContext, useEffect, useState } from "react";
import { Appearance } from "react-native";

interface ThemeContextProps {
    theme: typeof Colors.light;
}

export const ThemeContext = createContext<ThemeContextProps | null>(null);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const lightTheme = Colors.light;
    const darkTheme = Colors.dark;

    const system = Appearance.getColorScheme();
    const [theme, setTheme] = useState(system === "dark" ? darkTheme : lightTheme);

    // Auto update whenever system theme changes
    useEffect(() => {
        const listener = Appearance.addChangeListener(({ colorScheme }) => {
            setTheme(colorScheme === "dark" ? darkTheme : lightTheme);
        });

        return () => listener.remove();
    }, []);

    return (
        <ThemeContext.Provider value={{ theme }}>
            {children}
        </ThemeContext.Provider>
    );
};