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

export const kassaImportSchema = z.object({
  id,
  bestandsnaam: z.string(),
  periodeVan: z.iso.date(),
  periodeTot: z.iso.date(),
  locatie: z.string().trim().nullable(),
  geimporteerdOp: z.iso.datetime(),
}).refine(i => i.periodeTot >= i.periodeVan, { message: 'Einddatum ligt voor de begindatum', path: ['periodeTot'] })
export type KassaImport = z.infer<typeof kassaImportSchema>

/** Eén kassa-artikel binnen één import, opgeteld over de regels van de export. */
export const verkoopregelSchema = z.object({
  id,
  importId: id,
  kassaArtikelnaam: z.string().min(1),
  /** Genormaliseerde naam; sleutel naar het koppelgeheugen. */
  sleutel: z.string().min(1),
  kassaArtikelnummers: z.array(z.string()),
  omzetgroep: z.string().nullable(),
  aantal: z.int(),
  omzetExclCenten: z.int(),
  omzetInclCenten: z.int().nullable(),
  gangbarePrijsInclCenten: z.int().nullable(),
})
export type Verkoopregel = z.infer<typeof verkoopregelSchema>

/**
 * Koppelgeheugen: welk kassa-artikel hoort bij welk gerecht. `gerechtId: null`
 * betekent bewust genegeerd (drank, borrelhapjes, …). Eén keer kiezen, elke import raak.
 */
export const kassaKoppelingSchema = z.object({
  sleutel: z.string().min(1),
  kassaArtikelnaam: z.string(),
  gerechtId: z.uuid().nullable(),
})
export type KassaKoppeling = z.infer<typeof kassaKoppelingSchema>

/** Alles wat de app lokaal bewaart, met een versienummer voor migraties. */
export const keukenSchema = z.object({
  versie: z.literal(2),
  ingredienten: z.array(ingredientSchema),
  prijzen: z.array(ingredientPrijsSchema),
  gerechten: z.array(gerechtSchema),
  receptRegels: z.array(receptRegelSchema),
  imports: z.array(kassaImportSchema),
  verkoopregels: z.array(verkoopregelSchema),
  koppelingen: z.array(kassaKoppelingSchema),
})
export type Keuken = z.infer<typeof keukenSchema>

/** Brengt opgeslagen data van een oudere versie naar de huidige vorm. */
export function migreerKeuken(ruw: unknown): unknown {
  if (ruw && typeof ruw === 'object' && 'versie' in ruw && ruw.versie === 1) {
    return { ...ruw, versie: 2, imports: [], verkoopregels: [], koppelingen: [] }
  }
  return ruw
}
