"use client"

import type React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sparkles } from "lucide-react"

interface ColorPickerProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  description: string
  isMain?: boolean
}

export function ColorPicker({ id, label, value, onChange, description, isMain = false }: ColorPickerProps) {
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  return (
    <div className="space-y-3">
      <Label htmlFor={id} className="text-sm font-medium text-foreground flex items-center gap-2">
        {isMain && <Sparkles className="w-4 h-4 text-primary" />}
        {label}
      </Label>

      <div className="flex gap-3">
        <div className="relative">
          <input
            type="color"
            value={value}
            onChange={handleColorChange}
            className="w-16 h-12 border-2 border-border rounded-lg cursor-pointer hover:border-primary/50 transition-all hover:scale-105"
          />
          {isMain && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-background" />
          )}
        </div>

        <Input
          type="text"
          value={value}
          onChange={handleHexChange}
          className="flex-1 font-mono text-sm transition-colors focus:border-primary"
          placeholder="#000000"
        />
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
    </div>
  )
}
