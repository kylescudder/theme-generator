import { readFile } from 'node:fs/promises'
import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await expect(
    page.getByRole('heading', { name: 'mpro5 Theme Generator' })
  ).toBeVisible()
})

test('derives contrast, shade and tint from a typed primary colour', async ({
  page
}) => {
  await page.locator('#primary').fill('#1a73e8')

  await expect(page.locator('#primaryContrast')).toHaveValue('#ffffff')
  await expect(page.locator('#primaryShade')).toHaveValue('#0055ca')
  await expect(page.locator('#primaryTint')).toHaveValue('#3891ff')
})

test('warns about low secondary contrast and clears the warning when fixed', async ({
  page
}) => {
  // The default primary (#ed174c on white, about 4.2:1) already warns
  await expect(
    page.getByText(/Primary\/Primary Contrast ratio \(4\.\d\d\)/)
  ).toBeVisible()
  const secondaryWarning = page.getByText(
    /Secondary\/Secondary Contrast ratio \(1\.00\)/
  )
  await expect(secondaryWarning).toBeHidden()

  await page.locator('#secondaryContrast').fill('#fcdce4')
  await expect(secondaryWarning).toBeVisible()

  await page.locator('#secondaryContrast').fill('#000000')
  await expect(secondaryWarning).toBeHidden()
})

test('keeps the theme after a reload', async ({ page }) => {
  await page.locator('#primary').fill('#0f9d58')
  await page.reload()

  await expect(page.locator('#primary')).toHaveValue('#0f9d58')
  await expect(page.locator('#primaryShade')).toHaveValue('#007f3a')
})

test('downloads the current theme as JSON', async ({ page }) => {
  await page.locator('#primary').fill('#1a73e8')

  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Download Theme' }).click()
  const download = await downloadPromise

  expect(download.suggestedFilename()).toBe('custom-theme.json')
  const theme = JSON.parse(await readFile(await download.path(), 'utf8'))
  expect(theme).toMatchObject({
    primary: '#1a73e8',
    primaryContrast: '#ffffff',
    primaryShade: '#0055ca',
    primaryTint: '#3891ff',
    secondary: '#fcdce4'
  })
})

test('enables Contact Support only once name and organisation are filled', async ({
  page
}) => {
  const contact = page.getByRole('button', { name: 'Contact Support' })
  await expect(contact).toBeDisabled()

  await page.getByLabel('Your Name').fill('Ada')
  await expect(contact).toBeDisabled()
  await page.getByLabel('Organization').fill('Analytical Engines')
  await expect(contact).toBeEnabled()
})

test('renders the live preview', async ({ page }) => {
  await expect(page.getByText('Jobs Screen')).toBeVisible()
})
