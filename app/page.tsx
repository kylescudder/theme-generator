"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Download, Mail, AlertTriangle, Palette, Eye } from "lucide-react"
import { PreviewPane } from "@/components/preview-pane"
import { ColorPicker } from "@/components/color-picker"

// Color utility functions
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: Number.parseInt(result[1], 16),
        g: Number.parseInt(result[2], 16),
        b: Number.parseInt(result[3], 16),
      }
    : null
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
}

function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c = c / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1)
  const rgb2 = hexToRgb(color2)
  if (!rgb1 || !rgb2) return 1

  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b)
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b)

  const brightest = Math.max(lum1, lum2)
  const darkest = Math.min(lum1, lum2)

  return (brightest + 0.05) / (darkest + 0.05)
}

function getOptimalContrast(baseColor: string): string {
  const rgb = hexToRgb(baseColor)
  if (!rgb) return "#ffffff"

  const luminance = getLuminance(rgb.r, rgb.g, rgb.b)
  return luminance > 0.5 ? "#000000" : "#ffffff"
}

function adjustColor(hex: string, amount: number): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex

  const adjust = (color: number) => {
    const adjusted = color + amount
    return Math.max(0, Math.min(255, adjusted))
  }

  return rgbToHex(adjust(rgb.r), adjust(rgb.g), adjust(rgb.b))
}

function generateShade(hex: string): string {
  return adjustColor(hex, -30)
}

function generateTint(hex: string): string {
  return adjustColor(hex, 30)
}

interface ThemeColors {
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

export default function ThemeGenerator() {
  const [colors, setColors] = useState<ThemeColors>({
    primary: "#ed174c",
    primaryRgb: "237,23,76",
    primaryContrast: "#ffffff",
    primaryContrastRgb: "255,255,255",
    primaryShade: "#d11443",
    primaryTint: "#ef2e5e",
    secondary: "#fcdce4",
    secondaryRgb: "252,220,228",
    secondaryContrast: "#000000",
    secondaryContrastRgb: "0,0,0",
    secondaryShade: "#dec2c9",
    secondaryTint: "#fce0e7",
  })

  const [warnings, setWarnings] = useState<string[]>([])
  const [userName, setUserName] = useState("")
  const [orgName, setOrgName] = useState("")

  const handleColorChange = (key: keyof ThemeColors, value: string) => {
    setColors((prevColors) => {
      const updated = { ...prevColors, [key]: value }

      // Update RGB value for the changed color
      const rgbKey = `${key}Rgb` as keyof ThemeColors
      if (rgbKey in updated) {
        const rgb = hexToRgb(value)
        if (rgb) {
          updated[rgbKey] = `${rgb.r},${rgb.g},${rgb.b}`
        }
      }

      return updated
    })
  }

  const handlePrimaryChange = (value: string) => {
    const contrast = getOptimalContrast(value)
    const shade = generateShade(value)
    const tint = generateTint(value)

    setColors((prevColors) => {
      const updated = {
        ...prevColors,
        primary: value,
        primaryContrast: contrast,
        primaryShade: shade,
        primaryTint: tint,
      }

      // Update RGB values for all primary colors
      const primaryRgb = hexToRgb(value)
      const contrastRgb = hexToRgb(contrast)
      if (primaryRgb) updated.primaryRgb = `${primaryRgb.r},${primaryRgb.g},${primaryRgb.b}`
      if (contrastRgb) updated.primaryContrastRgb = `${contrastRgb.r},${contrastRgb.g},${contrastRgb.b}`

      return updated
    })
  }

  const handleSecondaryChange = (value: string) => {
    const contrast = getOptimalContrast(value)
    const shade = generateShade(value)
    const tint = generateTint(value)

    setColors((prevColors) => {
      const updated = {
        ...prevColors,
        secondary: value,
        secondaryContrast: contrast,
        secondaryShade: shade,
        secondaryTint: tint,
      }

      // Update RGB values for all secondary colors
      const secondaryRgb = hexToRgb(value)
      const contrastRgb = hexToRgb(contrast)
      if (secondaryRgb) updated.secondaryRgb = `${secondaryRgb.r},${secondaryRgb.g},${secondaryRgb.b}`
      if (contrastRgb) updated.secondaryContrastRgb = `${contrastRgb.r},${contrastRgb.g},${contrastRgb.b}`

      return updated
    })
  }

  // Check accessibility warnings
  useEffect(() => {
    const newWarnings: string[] = []

    const primaryContrast = getContrastRatio(colors.primary, colors.primaryContrast)
    const secondaryContrast = getContrastRatio(colors.secondary, colors.secondaryContrast)

    if (primaryContrast < 4.5) {
      newWarnings.push(
        `Primary/Primary Contrast ratio (${primaryContrast.toFixed(2)}) may be difficult for those with visual impairment`,
      )
    }

    if (secondaryContrast < 4.5) {
      newWarnings.push(
        `Secondary/Secondary Contrast ratio (${secondaryContrast.toFixed(2)}) may be difficult for those with visual impairment`,
      )
    }

    setWarnings(newWarnings)
  }, [colors])

  const downloadTheme = () => {
    const blob = new Blob([JSON.stringify(colors, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "custom-theme.json"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const openEmailClient = () => {
    const subject = encodeURIComponent("mpro5 Saturn colour profile")
    const body = encodeURIComponent(`To whom it may concern

My name is ${userName} and I am from ${orgName}. I have generated a theme I would like to discuss with you for use in our mpro5 Saturn mobile app.

I look forward to hearing from you`)

    window.location.href = `mailto:support@mpro.app?subject=${subject}&body=${body}`
  }

  const ColorPickerField = ({
    id,
    label,
    value,
    onChange,
    description,
    isMain = false,
  }: {
    id: string
    label: string
    value: string
    onChange: (value: string) => void
    description: string
    isMain?: boolean
  }) => (
    <ColorPicker id={id} label={label} value={value} onChange={onChange} description={description} isMain={isMain} />
  )

  return (
    <div className="min-h-screen gradient-bg">
      <div className="max-w-7xl mx-auto px-4 py-8">
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
            Create Your Unique Theme: Tailor the perfect look for your workspace. Use the color pickers to customize
            your theme and preview changes in real-time.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Color Controls */}
          <div className="space-y-8">
            {/* Primary Colors Card */}
            <Card className="gradient-card theme-transition hover:shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl font-[family-name:var(--font-heading)]">
                  <div className="w-2 h-8 bg-primary rounded-full" />
                  Primary Colors
                </CardTitle>
                <CardDescription className="text-base">
                  Configure your primary brand colors that define your app's identity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ColorPickerField
                    id="primary"
                    label="Primary"
                    value={colors.primary}
                    onChange={handlePrimaryChange}
                    description="Main brand color used for buttons, highlights, and key interface elements"
                    isMain={true}
                  />
                  <ColorPickerField
                    id="primaryContrast"
                    label="Primary Contrast"
                    value={colors.primaryContrast}
                    onChange={(value) => handleColorChange("primaryContrast", value)}
                    description="Text color that appears on primary backgrounds for optimal readability"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ColorPickerField
                    id="primaryShade"
                    label="Primary Shade"
                    value={colors.primaryShade}
                    onChange={(value) => handleColorChange("primaryShade", value)}
                    description="Darker variant used for hover states and pressed buttons"
                  />
                  <ColorPickerField
                    id="primaryTint"
                    label="Primary Tint"
                    value={colors.primaryTint}
                    onChange={(value) => handleColorChange("primaryTint", value)}
                    description="Lighter variant used for subtle backgrounds and accents"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Secondary Colors Card */}
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
                    value={colors.secondary}
                    onChange={handleSecondaryChange}
                    description="Secondary accent color used for backgrounds and subtle highlights"
                    isMain={true}
                  />
                  <ColorPickerField
                    id="secondaryContrast"
                    label="Secondary Contrast"
                    value={colors.secondaryContrast}
                    onChange={(value) => handleColorChange("secondaryContrast", value)}
                    description="Text color that appears on secondary backgrounds"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ColorPickerField
                    id="secondaryShade"
                    label="Secondary Shade"
                    value={colors.secondaryShade}
                    onChange={(value) => handleColorChange("secondaryShade", value)}
                    description="Darker secondary variant for depth and contrast"
                  />
                  <ColorPickerField
                    id="secondaryTint"
                    label="Secondary Tint"
                    value={colors.secondaryTint}
                    onChange={(value) => handleColorChange("secondaryTint", value)}
                    description="Lighter secondary variant for gentle backgrounds"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Accessibility Warnings */}
            {warnings.length > 0 && (
              <Alert className="border-destructive/20 bg-destructive/5">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <AlertDescription className="text-sm">
                  <div className="font-medium mb-2">Accessibility Concerns:</div>
                  <ul className="space-y-1">
                    {warnings.map((warning, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="w-1 h-1 bg-destructive rounded-full mt-2 flex-shrink-0" />
                        {warning}
                      </li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Right Column - Live Preview */}
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

        <div className="mt-16">
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
                  <Label htmlFor="userName" className="text-sm font-medium">
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
                  <Label htmlFor="orgName" className="text-sm font-medium">
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
      </div>
    </div>
  )
}
