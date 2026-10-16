/**
 * Leest een upload als tekst. Kassa's exporteren niet altijd UTF-8; als er
 * onleesbare tekens uitkomen, proberen we Windows-1252 (oudere Windows-kassa's).
 */
export async function leesBestandAlsTekst(bestand: File): Promise<string> {
  const bytes = await bestand.arrayBuffer()
  const utf8 = new TextDecoder('utf-8').decode(bytes)
  if (!utf8.includes('�')) return utf8
  return new TextDecoder('windows-1252').decode(bytes)
}
