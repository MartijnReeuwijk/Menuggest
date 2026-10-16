/** De 14 allergenen die je volgens EU-verordening 1169/2011 moet kunnen melden. */
export const ALLERGENEN = [
  'gluten',
  'schaaldieren',
  'ei',
  'vis',
  'pinda',
  'soja',
  'melk',
  'noten',
  'selderij',
  'mosterd',
  'sesam',
  'sulfiet',
  'lupine',
  'weekdieren',
] as const
export type Allergeen = (typeof ALLERGENEN)[number]

/**
 * Een gerecht bevat elk allergeen dat in één van zijn ingrediënten zit.
 * Afleiden in plaats van aanvinken: wie een ingrediënt toevoegt, kan het niet vergeten.
 */
export function allergenenVan(
  ingredientIds: Iterable<string>,
  allergenenVanIngredient: (id: string) => readonly Allergeen[] | undefined,
): Allergeen[] {
  const gevonden = new Set<Allergeen>()
  for (const id of ingredientIds) {
    for (const allergeen of allergenenVanIngredient(id) ?? []) gevonden.add(allergeen)
  }
  return ALLERGENEN.filter(a => gevonden.has(a))
}
