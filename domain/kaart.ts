export const GANGEN = ['voorgerecht', 'hoofdgerecht', 'nagerecht', 'bijgerecht'] as const
export type Gang = (typeof GANGEN)[number]

export const GANG_LABELS: Record<Gang, string> = {
  voorgerecht: 'Voorgerecht',
  hoofdgerecht: 'Hoofdgerecht',
  nagerecht: 'Nagerecht',
  bijgerecht: 'Bijgerecht',
}

/** Seizoenen uit v1 (`season.json`), als filteras voor ingrediënten en gerechten. */
export const SEIZOENEN = [
  'Lente',
  'Zomer',
  'Herfst',
  'Winter',
  'Wildseizoen',
  'Aspergeseizoen',
  'Kreeft Oosterschelde',
  'Truffel',
  'Lamseizoen',
  'Europese ansjovis',
  'Frutti di mare',
] as const
export type Seizoen = (typeof SEIZOENEN)[number]
