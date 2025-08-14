import { create } from "zustand"
import { persist } from "zustand/middleware"

type ThemeColors = {
    primary: string
    primaryRgb: string
    primaryContrast: string
    primaryContrastRgb: string
    primaryShade: string
    primaryTint: string
    secondary: string
    secondaryRgb: string
    secondaryContrast: string
    secondaryContrastRgb: string
    secondaryShade: string
    secondaryTint: string
}

type ThemeState = {
    colors: ThemeColors
    setColor: (key: keyof ThemeColors, value: string) => void
    setColors: (newColors: Partial<ThemeColors>) => void
    resetTheme: () => void
}

const defaultColors: ThemeColors = {
    primary: "#ed174c",
    primaryRgb: "237,23,76",
    primaryContrast: "#ffffff",
    primaryContrastRgb: "255, 255, 255",
    primaryShade: "#d11443",
    primaryTint: "#ef2e5e",

    secondary: "#fcdce4",
    secondaryRgb: "252,220,228",
    secondaryContrast: "#000000",
    secondaryContrastRgb: "0,0,0",
    secondaryShade: "#dec2c9",
    secondaryTint: "#fce0e7",
}

export const useThemeStore = create<ThemeState>()(
    persist(
        (set) => ({
            colors: defaultColors,

            setColor: (key, value) =>
                set((state) => ({
                    colors: {
                        ...state.colors,
                        [key]: value,
                    },
                })),

            setColors: (newColors) =>
                set((state) => ({
                    colors: {
                        ...state.colors,
                        ...newColors,
                    },
                })),

            resetTheme: () =>
                set(() => ({
                    colors: defaultColors,
                })),
        }),
        {
            name: "theme-storage", // localStorage key
        }
    )
)