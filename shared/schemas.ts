import { z } from 'zod'
import { ALLERGENEN, BTW_CATEGORIEEN, EENHEDEN, GANGEN } from '../domain'

/**
 * Eén schema per entiteit, gedeeld door formulieren, opslag en (straks) API en import.
 * Velden in camelCase; de database gebruikt snake_case (zie supabase/migrations).
 */

const id = z.uuid()
const naam = z.string().trim().min(1, 'Geef een naam')

export const ingredientSchema = z.object({
  id,
  naam,
  categorie: z.string().trim().min(1, 'Kies een categorie'),
  eenheid: z.enum(EENHEDEN),
  allergenen: z.array(z.enum(ALLERGENEN)),
  seizoenen: z.array(z.string()),
})
export type Ingredient = z.infer<typeof ingredientSchema>

export const ingredientPrijsSchema = z.object({
  id,
  ingredientId: id,
  leverancier: z.string().trim().nullable(),
  verpakkingsgrootte: z.number().positive('Moet groter dan 0 zijn'),
  eenheid: z.enum(EENHEDEN),
  prijsCenten: z.int().nonnegative('Prijs kan niet negatief zijn'),
  geldigVanaf: z.iso.date(),
})
export type IngredientPrijsRecord = z.infer<typeof ingredientPrijsSchema>

export const gerechtSchema = z.object({
  id,
  naam,
  omschrijving: z.string(),
  gang: z.enum(GANGEN),
  menuprijsCenten: z.int().nonnegative('Prijs kan niet negatief zijn'),
  btw: z.enum(BTW_CATEGORIEEN),
  seizoenen: z.array(z.string()),
  labels: z.array(z.string()),
  actief: z.boolean(),
})
export type Gerecht = z.infer<typeof gerechtSchema>

export const receptRegelSchema = z.object({
  id,
  gerechtId: id,
  ingredientId: id,
  hoeveelheid: z.number().positive('Moet groter dan 0 zijn'),
  eenheid: z.enum(EENHEDEN),
  yieldPct: z.number().gt(0, 'Yield moet boven 0% zijn').max(100, 'Yield kan niet boven 100% zijn'),
  volgorde: z.int(),
})
export type ReceptRegelRecord = z.infer<typeof receptRegelSchema>

/** Alles wat de app lokaal bewaart, met een versienummer voor latere migraties. */
export const keukenSchema = z.object({
  versie: z.literal(1),
  ingredienten: z.array(ingredientSchema),
  prijzen: z.array(ingredientPrijsSchema),
  gerechten: z.array(gerechtSchema),
  receptRegels: z.array(receptRegelSchema),
})
export type Keuken = z.infer<typeof keukenSchema>
