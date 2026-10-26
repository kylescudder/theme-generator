import { useState, useEffect, memo, useCallback } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Download, Mail, AlertTriangle, Palette, Eye } from 'lucide-react'
import { PreviewPane } from '@/components/preview-pane'
import { ColorPicker } from '@/components/color-picker'
import { useThemeStore } from '@/store/themeStore'
import {
  generateShade,
  generateTint,
  getContrastRatio,
  getOptimalContrast
} from '@/lib/colour'

export default function ThemeGenerator() {
  const colors = useThemeStore((state) => state.colors)
  const setColors = useThemeStore((state) => state.setColors)

  const [warnings, setWarnings] = useState<string[]>([])
  const [userName, setUserName] = useState('')
  const [orgName, setOrgName] = useState('')

  // Auto-update related colors for primary
  const handlePrimaryChange = useCallback(
    (value: string) => {
      setColors({
        primary: value,
        primaryContrast: getOptimalContrast(value),
        primaryShade: generateShade(value),
        primaryTint: generateTint(value)
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
        secondaryTint: generateTint(value)
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
      type: 'application/json'
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'custom-theme.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Open email client
  const openEmailClient = () => {
    const subject = encodeURIComponent('mpro5 Saturn colour profile')
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
      onChange
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
    <div className='gradient-bg min-h-screen'>
      <div className='mx-auto max-w-7xl px-4 py-8'>
        {/* HEADER */}
        <div className='mb-12 text-center'>
          <div className='mb-4 flex items-center justify-center gap-3'>
            <div className='rounded-2xl bg-primary/10 p-3'>
              <Palette className='h-8 w-8 text-primary' />
            </div>
            <h1 className='font-[family-name:var(--font-heading)] text-4xl font-bold text-foreground lg:text-5xl'>
              mpro5 Theme Generator
            </h1>
          </div>
          <p className='mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground'>
            Create Your Unique Theme: Tailor the perfect look for your
            workspace. Use the color pickers to customize your theme and preview
            changes in real-time.
          </p>
        </div>

        <div className='grid grid-cols-1 items-start gap-12 lg:grid-cols-2'>
          {/* LEFT COLUMN */}
          <div className='space-y-8'>
            {/* PRIMARY */}
            <Card className='gradient-card theme-transition hover:shadow-lg'>
              <CardHeader className='pb-4'>
                <CardTitle className='flex items-center gap-2 font-[family-name:var(--font-heading)] text-xl'>
                  <div className='h-8 w-2 rounded-full bg-primary' />
                  Primary Colors
                </CardTitle>
                <CardDescription className='text-base'>
                  Configure your primary brand colors that define your app's
                  identity
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-6'>
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                  <ColorPickerField
                    id='primary'
                    label='Primary'
                    description='Main brand color used for buttons, highlights, and key interface elements'
                    isMain={true}
                    onChange={handlePrimaryChange}
                  />
                  <ColorPickerField
                    id='primaryContrast'
                    label='Primary Contrast'
                    description='Text color that appears on primary backgrounds for optimal readability'
                  />
                </div>
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                  <ColorPickerField
                    id='primaryShade'
                    label='Primary Shade'
                    description='Darker variant used for hover states and pressed buttons'
                  />
                  <ColorPickerField
                    id='primaryTint'
                    label='Primary Tint'
                    description='Lighter variant used for subtle backgrounds and accents'
                  />
                </div>
              </CardContent>
            </Card>

            {/* SECONDARY */}
            <Card className='gradient-card theme-transition hover:shadow-lg'>
              <CardHeader className='pb-4'>
                <CardTitle className='flex items-center gap-2 font-[family-name:var(--font-heading)] text-xl'>
                  <div className='h-8 w-2 rounded-full bg-secondary' />
                  Secondary Colors
                </CardTitle>
                <CardDescription className='text-base'>
                  Configure your secondary accent colors for supporting elements
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-6'>
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                  <ColorPickerField
                    id='secondary'
                    label='Secondary'
                    description='Secondary accent color used for backgrounds and subtle highlights'
                    isMain={true}
                    onChange={handleSecondaryChange}
                  />
                  <ColorPickerField
                    id='secondaryContrast'
                    label='Secondary Contrast'
                    description='Text color that appears on secondary backgrounds'
                  />
                </div>
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                  <ColorPickerField
                    id='secondaryShade'
                    label='Secondary Shade'
                    description='Darker secondary variant for depth and contrast'
                  />
                  <ColorPickerField
                    id='secondaryTint'
                    label='Secondary Tint'
                    description='Lighter secondary variant for gentle backgrounds'
                  />
                </div>
              </CardContent>
            </Card>

            {/* WARNINGS */}
            {warnings.length > 0 && (
              <Alert className='border-destructive/20 bg-destructive/5'>
                <AlertTriangle className='h-5 w-5 text-destructive' />
                <AlertDescription className='text-sm'>
                  <div className='mb-2 font-medium'>
                    Accessibility Concerns:
                  </div>
                  <ul className='space-y-1'>
                    {warnings.map((warning, index) => (
                      <li key={index} className='flex items-start gap-2'>
                        <span className='mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-destructive' />
                        {warning}
                      </li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* DESCRIPTION GRID */}
            <Card className='gradient-card theme-transition hover:shadow-lg'>
              <CardHeader className='pb-4'>
                <CardTitle className='flex items-center gap-2 font-[family-name:var(--font-heading)] text-xl'>
                  Description Guide
                </CardTitle>
                <CardDescription className='text-base'>
                  Quick reference for what each color is used for.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-1 gap-x-6 gap-y-3 text-sm sm:grid-cols-2'>
                  <div className='font-semibold'>Field</div>
                  <div className='font-semibold'>Description</div>

                  <div className='text-muted-foreground'>primary</div>
                  <div>
                    Base colour for primary UI elements (e.g., buttons).
                  </div>

                  <div className='text-muted-foreground'>primaryContrast</div>
                  <div>
                    Text/icon colour that contrasts well with the primary
                    colour.
                  </div>

                  <div className='text-muted-foreground'>primaryShade</div>
                  <div>Slightly darker variation of the primary colour.</div>

                  <div className='text-muted-foreground'>primaryTint</div>
                  <div>Slightly lighter variation of the primary colour.</div>

                  <div className='text-muted-foreground'>secondary</div>
                  <div>Base colour for secondary UI elements.</div>

                  <div className='text-muted-foreground'>secondaryContrast</div>
                  <div>
                    Text/icon colour that contrasts with the secondary colour.
                  </div>

                  <div className='text-muted-foreground'>secondaryShade</div>
                  <div>Darker variation of the secondary colour.</div>

                  <div className='text-muted-foreground'>secondaryTint</div>
                  <div>Lighter variation of the secondary colour.</div>
                </div>
              </CardContent>
            </Card>

            {/* EXPORT */}
            <Card className='gradient-card theme-transition hover:shadow-lg'>
              <CardHeader className='pb-4'>
                <CardTitle className='flex items-center gap-2 font-[family-name:var(--font-heading)] text-xl'>
                  <Download className='h-5 w-5 text-primary' />
                  Export & Contact
                </CardTitle>
                <CardDescription className='text-base'>
                  Save your favorite themes and share them with your team!
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-6'>
                <div className='grid max-w-2xl grid-cols-1 gap-4 md:grid-cols-2'>
                  <div>
                    <Label htmlFor='userName' className='text-sm font-medium'>
                      Your Name
                    </Label>
                    <Input
                      id='userName'
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder='Enter your name'
                      className='theme-transition mt-2 focus:border-primary'
                    />
                  </div>
                  <div>
                    <Label htmlFor='orgName' className='text-sm font-medium'>
                      Organization
                    </Label>
                    <Input
                      id='orgName'
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      placeholder='Enter your organization'
                      className='theme-transition mt-2 focus:border-primary'
                    />
                  </div>
                </div>

                <div className='flex max-w-2xl flex-col gap-4 sm:flex-row'>
                  <Button
                    onClick={downloadTheme}
                    // Use Tailwind classes with CSS variables for dynamic colors
                    className='theme-transition flex-1 bg-[var(--button-bg)] text-primary-foreground shadow-lg hover:scale-[1.02] hover:bg-[var(--button-hover-bg)]'
                    size='lg'
                    // Set CSS variables dynamically via inline style
                    style={
                      {
                        '--button-bg': colors.primary,
                        '--button-hover-bg': generateShade(colors.primary)
                      } as React.CSSProperties
                    } // Type assertion for custom vars
                  >
                    <Download className='mr-2 h-4 w-4' />
                    Download Theme
                  </Button>
                  <Button
                    onClick={openEmailClient}
                    variant='outline'
                    className='theme-transition flex-1 border-primary/20 bg-transparent hover:scale-[1.02] hover:border-primary hover:bg-primary/5'
                    size='lg'
                    disabled={!userName || !orgName}
                  >
                    <Mail className='mr-2 h-4 w-4' />
                    Contact Support
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT COLUMN */}
          <div className='space-y-8'>
            <Card className='gradient-card theme-transition hover:shadow-lg'>
              <CardHeader className='pb-4'>
                <CardTitle className='flex items-center gap-2 font-[family-name:var(--font-heading)] text-xl'>
                  <Eye className='h-5 w-5 text-primary' />
                  Live Preview
                </CardTitle>
                <CardDescription className='text-base'>
                  See how your theme looks in the mpro5 app interface
                </CardDescription>
              </CardHeader>
              <CardContent className='p-6'>
                <div className='rounded-xl bg-gray-100 p-4'>
                  <div className='mx-auto max-w-sm rounded-2xl'>
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
