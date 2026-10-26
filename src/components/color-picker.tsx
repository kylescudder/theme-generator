import { useState, useEffect, useCallback, type ChangeEvent } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sparkles } from 'lucide-react'
import { HexColorPicker } from 'react-colorful'
import { useThemeStore, type ThemeColors } from '@/store/themeStore'

interface ColorPickerProps {
  id: keyof ThemeColors
  label: string
  description: string
  isMain?: boolean
  onChange?: (value: string) => void
}

export function ColorPicker({
  id,
  label,
  description,
  isMain = false,
  onChange
}: ColorPickerProps) {
  const storeColor = useThemeStore((state) => state.colors[id])
  const setColor = useThemeStore((state) => state.setColor)

  const [localColor, setLocalColor] = useState(storeColor)
  const [isDragging, setIsDragging] = useState(false)
  const [pendingColor, setPendingColor] = useState(storeColor) // For batch deferral

  // Keep local state in sync with store unless dragging
  useEffect(() => {
    if (!isDragging) {
      setLocalColor(storeColor)
      setPendingColor(storeColor)
    }
  }, [storeColor, isDragging])

  // Real-time local update while dragging
  const handleColorChange = useCallback((value: string) => {
    setLocalColor(value)
    setPendingColor(value) // Store for batch on end
    setIsDragging(true)
  }, [])

  // Explicit drag start
  const handleDragStart = useCallback(() => {
    setIsDragging(true)
  }, [])

  // On drag end, commit changes (batch if main)
  const handleDragEnd = useCallback(() => {
    setIsDragging(false)

    // If main and onChange provided, batch-update via onChange
    if (isMain && onChange) {
      onChange(pendingColor)
    } else {
      setColor(id, pendingColor)
    }
  }, [isMain, onChange, pendingColor, setColor, id])

  // Manual hex input (instant, no deferral needed)
  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setLocalColor(value)
      setPendingColor(value)

      const isValidHex = /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value)
      if (isValidHex) {
        const normalizedValue = value.startsWith('#') ? value : `#${value}`
        if (onChange) {
          onChange(normalizedValue)
        } else {
          setColor(id, normalizedValue)
        }
      }
    },
    [onChange, setColor, id]
  )

  return (
    <div className='space-y-3'>
      <Label
        htmlFor={id}
        className='flex items-center gap-2 text-sm font-medium text-foreground'
      >
        {isMain && <Sparkles className='h-4 w-4 text-primary' />}
        {label}
      </Label>

      <div className='flex flex-col gap-3 sm:items-start'>
        <div
          className='relative w-full cursor-pointer touch-auto select-none'
          style={{ pointerEvents: 'auto' }}
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
          onMouseUp={handleDragEnd}
          onTouchEnd={handleDragEnd}
          onMouseLeave={handleDragEnd} // Handle if mouse leaves during drag
        >
          <div className='rounded-lg border-2 border-border bg-background p-2'>
            <HexColorPicker
              color={localColor}
              onChange={handleColorChange}
              className='!w-full'
            />
          </div>
          {isMain && (
            <div className='absolute -top-1 -right-1 h-3 w-3 rounded-full border-2 border-background bg-primary' />
          )}
        </div>

        <Input
          id={id}
          type='text'
          value={localColor}
          onChange={handleInputChange}
          className='w-full font-mono text-sm transition-colors focus:border-primary sm:flex-1'
          placeholder='#000000'
        />
      </div>

      <p className='text-xs leading-relaxed text-muted-foreground'>
        {description}
      </p>
    </div>
  )
}
