export function getPageOffset(link?: string): number | null {
  if (!link) return null
  const offset = new URL(link).searchParams.get('page[offset]')
  return offset === null ? null : Number(offset)
}
