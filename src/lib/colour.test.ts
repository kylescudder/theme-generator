import { describe, expect, test } from 'bun:test'
import {
  generateShade,
  generateTint,
  getContrastRatio,
  getOptimalContrast
} from './colour'

describe('getContrastRatio', () => {
  test('is 21 for black on white in either order', () => {
    expect(getContrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 5)
    expect(getContrastRatio('#ffffff', '#000000')).toBeCloseTo(21, 5)
  })

  test('is 1 for identical colours', () => {
    expect(getContrastRatio('#ed174c', '#ed174c')).toBe(1)
  })

  test('accepts hex without a leading hash', () => {
    expect(getContrastRatio('000000', 'ffffff')).toBeCloseTo(21, 5)
  })

  test('falls back to 1 for invalid hex', () => {
    expect(getContrastRatio('#fff', '#000000')).toBe(1)
    expect(getContrastRatio('not a colour', '#000000')).toBe(1)
  })
})

describe('getOptimalContrast', () => {
  test('picks black on light colours and white on dark ones', () => {
    expect(getOptimalContrast('#fcdce4')).toBe('#000000')
    expect(getOptimalContrast('#ed174c')).toBe('#ffffff')
  })

  test('falls back to white for invalid hex', () => {
    expect(getOptimalContrast('nope')).toBe('#ffffff')
  })
})

describe('shades and tints', () => {
  test('match the default theme', () => {
    expect(generateShade('#ed174c')).toBe('#cf002e')
    expect(generateTint('#ed174c')).toBe('#ff356a')
  })

  test('clamp each channel to the valid range', () => {
    expect(generateShade('#000000')).toBe('#000000')
    expect(generateTint('#ffffff')).toBe('#ffffff')
  })

  test('return invalid input unchanged', () => {
    expect(generateShade('nope')).toBe('nope')
  })
})
