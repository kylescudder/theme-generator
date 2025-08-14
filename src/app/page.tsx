"use client"

import { useState, useEffect, memo, useCallback } from "react"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Download, Mail, AlertTriangle, Palette, Eye } from "lucide-react"
import { PreviewPane } from "@/components/preview-pane"
import { ColorPicker } from "@/components/color-picker"
import { useThemeStore } from "@/store/themeStore"

// -------------------- Utility Functions --------------------
function hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
        ? {
            r: Number.parseInt(result[1], 16),
            g: Number.parseInt(result[2], 16),
            b: Number.parseInt(result[3], 16),
        }
        : null
}

function rgbToHex(r: number, g: number, b: number) {
    return (
        "#" +
        ((1 << 24) + (r << 16) + (g << 8) + b)
            .toString(16)
            .slice(1)
    )
}

function getLuminance(r: number, g: number, b: number) {
    const [rs, gs, bs] = [r, g, b].map((c) => {
        c = c / 255
        return c <= 0.03928
            ? c / 12.92
            : Math.pow((c + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

function getContrastRatio(color1: string, color2: string) {
    const rgb1 = hexToRgb(color1)
    const rgb2 = hexToRgb(color2)
    if (!rgb1 || !rgb2) return 1

    const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b)
    const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b)

    const brightest = Math.max(lum1, lum2)
    const darkest = Math.min(lum1, lum2)

    return (brightest + 0.05) / (darkest + 0.05)
}

function getOptimalContrast(baseColor: string) {
    const rgb = hexToRgb(baseColor)
    if (!rgb) return "#ffffff"

    const luminance = getLuminance(rgb.r, rgb.g, rgb.b)
    return luminance > 0.5 ? "#000000" : "#ffffff"
}

function adjustColor(hex: string, amount: number) {
    const rgb = hexToRgb(hex)
    if (!rgb) return hex

    const adjust = (color: number) => {
        const adjusted = color + amount
        return Math.max(0, Math.min(255, adjusted))
    }

    return rgbToHex(adjust(rgb.r), adjust(rgb.g), adjust(rgb.b))
}

function generateShade(hex: string) {
    return adjustColor(hex, -30)
}

function generateTint(hex: string) {
    return adjustColor(hex, 30)
}

// -------------------- Component --------------------
export default function ThemeGenerator() {
    const colors = useThemeStore((state) => state.colors)
    const setColors = useThemeStore((state) => state.setColors)

    const [warnings, setWarnings] = useState<string[]>([])
    const [userName, setUserName] = useState("")
    const [orgName, setOrgName] = useState("")

    // Auto-update related colors for primary
    const handlePrimaryChange = useCallback(
        (value: string) => {
            setColors({
                primary: value,
                primaryContrast: getOptimalContrast(value),
                primaryShade: generateShade(value),
                primaryTint: generateTint(value),
            })
        },
        [setColors]
    )

    // Auto-update related colors for secondary
    const handleSecondaryChange = useCallback(
        (value: string) => {
            setColors({
                secondary: value,
                secondaryContrast: getOptimalContrast(value),
                secondaryShade: generateShade(value),
                secondaryTint: generateTint(value),
            })
        },
        [setColors]
    )

    // Accessibility warnings
    useEffect(() => {
        const newWarnings: string[] = []
        const primaryContrast = getContrastRatio(
            colors.primary,
            colors.primaryContrast
        )
        const secondaryContrast = getContrastRatio(
            colors.secondary,
            colors.secondaryContrast
        )

        if (primaryContrast < 4.5) {
            newWarnings.push(
                `Primary/Primary Contrast ratio (${primaryContrast.toFixed(
                    2
                )}) may be difficult for those with visual impairment`
            )
        }
        if (secondaryContrast < 4.5) {
            newWarnings.push(
                `Secondary/Secondary Contrast ratio (${secondaryContrast.toFixed(
                    2
                )}) may be difficult for those with visual impairment`
            )
        }
        setWarnings(newWarnings)
    }, [colors])

    // Download theme JSON
    const downloadTheme = () => {
        const blob = new Blob([JSON.stringify(colors, null, 2)], {
            type: "application/json",
        })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "custom-theme.json"
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    // Open email client
    const openEmailClient = () => {
        const subject = encodeURIComponent("mpro5 Saturn colour profile")
        const body = encodeURIComponent(`To whom it may concern

My name is ${userName} and I am from ${orgName}. I have generated a theme I would like to discuss with you for use in our mpro5 Saturn mobile app.

I look forward to hearing from you`)

        window.location.href = `mailto:support@mpro.app?subject=${subject}&body=${body}`
    }

    // Memoized ColorPicker wrapper
    const ColorPickerField = memo(
        ({
             id,
             label,
             description,
             isMain = false,
             onChange,
         }: {
            id: keyof typeof colors
            label: string
            description: string
            isMain?: boolean
            onChange?: (value: string) => void
        }) => (
            <ColorPicker
                id={id}
                label={label}
                description={description}
                isMain={isMain}
                onChange={onChange}
            />
        )
    )

    return (
        <div className="min-h-screen gradient-bg">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* HEADER */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="p-3 bg-primary/10 rounded-2xl">
                            <Palette className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold text-foreground font-[family-name:var(--font-heading)]">
                            mpro5 Theme Generator
                        </h1>
                    </div>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Create Your Unique Theme: Tailor the perfect look for your workspace.
                        Use the color pickers to customize your theme and preview changes in
                        real-time.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* LEFT COLUMN */}
                    <div className="space-y-8">
                        {/* PRIMARY */}
                        <Card className="gradient-card theme-transition hover:shadow-lg">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-2 text-xl font-[family-name:var(--font-heading)]">
                                    <div className="w-2 h-8 bg-primary rounded-full" />
                                    Primary Colors
                                </CardTitle>
                                <CardDescription className="text-base">
                                    Configure your primary brand colors that define your app's
                                    identity
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <ColorPickerField
                                        id="primary"
                                        label="Primary"
                                        description="Main brand color used for buttons, highlights, and key interface elements"
                                        isMain={true}
                                        onChange={handlePrimaryChange}
                                    />
                                    <ColorPickerField
                                        id="primaryContrast"
                                        label="Primary Contrast"
                                        description="Text color that appears on primary backgrounds for optimal readability"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <ColorPickerField
                                        id="primaryShade"
                                        label="Primary Shade"
                                        description="Darker variant used for hover states and pressed buttons"
                                    />
                                    <ColorPickerField
                                        id="primaryTint"
                                        label="Primary Tint"
                                        description="Lighter variant used for subtle backgrounds and accents"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* SECONDARY */}
                        <Card className="gradient-card theme-transition hover:shadow-lg">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-2 text-xl font-[family-name:var(--font-heading)]">
                                    <div className="w-2 h-8 bg-secondary rounded-full" />
                                    Secondary Colors
                                </CardTitle>
                                <CardDescription className="text-base">
                                    Configure your secondary accent colors for supporting elements
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <ColorPickerField
                                        id="secondary"
                                        label="Secondary"
                                        description="Secondary accent color used for backgrounds and subtle highlights"
                                        isMain={true}
                                        onChange={handleSecondaryChange}
                                    />
                                    <ColorPickerField
                                        id="secondaryContrast"
                                        label="Secondary Contrast"
                                        description="Text color that appears on secondary backgrounds"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <ColorPickerField
                                        id="secondaryShade"
                                        label="Secondary Shade"
                                        description="Darker secondary variant for depth and contrast"
                                    />
                                    <ColorPickerField
                                        id="secondaryTint"
                                        label="Secondary Tint"
                                        description="Lighter secondary variant for gentle backgrounds"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* WARNINGS */}
                        {warnings.length > 0 && (
                            <Alert className="border-destructive/20 bg-destructive/5">
                                <AlertTriangle className="h-5 w-5 text-destructive" />
                                <AlertDescription className="text-sm">
                                    <div className="font-medium mb-2">
                                        Accessibility Concerns:
                                    </div>
                                    <ul className="space-y-1">
                                        {warnings.map((warning, index) => (
                                            <li
                                                key={index}
                                                className="flex items-start gap-2"
                                            >
                                                <span className="w-1 h-1 bg-destructive rounded-full mt-2 flex-shrink-0" />
                                                {warning}
                                            </li>
                                        ))}
                                    </ul>
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* DESCRIPTION GRID */}
                        <Card className="gradient-card theme-transition hover:shadow-lg">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-2 text-xl font-[family-name:var(--font-heading)]">
                                    Description Guide
                                </CardTitle>
                                <CardDescription className="text-base">
                                    Quick reference for what each color is used for.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                                    <div className="font-semibold">Field</div>
                                    <div className="font-semibold">Description</div>

                                    <div className="text-muted-foreground">primary</div>
                                    <div>Base colour for primary UI elements (e.g., buttons).</div>

                                    <div className="text-muted-foreground">primaryContrast</div>
                                    <div>Text/icon colour that contrasts well with the primary colour.</div>

                                    <div className="text-muted-foreground">primaryShade</div>
                                    <div>Slightly darker variation of the primary colour.</div>

                                    <div className="text-muted-foreground">primaryTint</div>
                                    <div>Slightly lighter variation of the primary colour.</div>

                                    <div className="text-muted-foreground">secondary</div>
                                    <div>Base colour for secondary UI elements.</div>

                                    <div className="text-muted-foreground">secondaryContrast</div>
                                    <div>Text/icon colour that contrasts with the secondary colour.</div>

                                    <div className="text-muted-foreground">secondaryShade</div>
                                    <div>Darker variation of the secondary colour.</div>

                                    <div className="text-muted-foreground">secondaryTint</div>
                                    <div>Lighter variation of the secondary colour.</div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* EXPORT */}
                        <Card className="gradient-card theme-transition hover:shadow-lg">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-2 text-xl font-[family-name:var(--font-heading)]">
                                    <Download className="w-5 h-5 text-primary" />
                                    Export & Contact
                                </CardTitle>
                                <CardDescription className="text-base">
                                    Save your favorite themes and share them with your team!
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                                    <div>
                                        <Label
                                            htmlFor="userName"
                                            className="text-sm font-medium"
                                        >
                                            Your Name
                                        </Label>
                                        <Input
                                            id="userName"
                                            value={userName}
                                            onChange={(e) => setUserName(e.target.value)}
                                            placeholder="Enter your name"
                                            className="mt-2 theme-transition focus:border-primary"
                                        />
                                    </div>
                                    <div>
                                        <Label
                                            htmlFor="orgName"
                                            className="text-sm font-medium"
                                        >
                                            Organization
                                        </Label>
                                        <Input
                                            id="orgName"
                                            value={orgName}
                                            onChange={(e) => setOrgName(e.target.value)}
                                            placeholder="Enter your organization"
                                            className="mt-2 theme-transition focus:border-primary"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 max-w-2xl">
                                    <Button
                                        onClick={downloadTheme}
                                        className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground theme-transition hover:scale-[1.02] shadow-lg"
                                        size="lg"
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        Download Theme
                                    </Button>
                                    <Button
                                        onClick={openEmailClient}
                                        variant="outline"
                                        className="flex-1 border-primary/20 hover:bg-primary/5 hover:border-primary theme-transition hover:scale-[1.02] bg-transparent"
                                        size="lg"
                                        disabled={!userName || !orgName}
                                    >
                                        <Mail className="w-4 h-4 mr-2" />
                                        Contact Support
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="space-y-8">
                        <Card className="gradient-card theme-transition hover:shadow-lg">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-2 text-xl font-[family-name:var(--font-heading)]">
                                    <Eye className="w-5 h-5 text-primary" />
                                    Live Preview
                                </CardTitle>
                                <CardDescription className="text-base">
                                    See how your theme looks in the mpro5 app interface
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="bg-gray-100 rounded-xl p-8">
                                    <div className="mx-auto max-w-sm rounded-2xl">
                                        <PreviewPane colors={colors} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

            </div>
        </div>
    )
}