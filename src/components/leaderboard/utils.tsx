const flags = {
  NA: '🇺🇸',
  EU: '🇪🇺',
  ASIA: '🇯🇵',
  SA: '🇧🇷',
  OCE: '🇦🇺',
} as const

export type FlagKeys = keyof typeof flags

export const getRegionFlag = (region: FlagKeys) => {
  return flags[region] ?? '🌍'
}

export const getFlagColor = (lvl: number) => {
  if (lvl >= 91) return '#7E22CE'
  if (lvl >= 81) return '#8B5CF6'
  if (lvl >= 61) return '#3B82F6'
  if (lvl >= 41) return '#10B981'
  if (lvl >= 21) return '#F59E0B'
  return '#9CA3AF'
}

export const CURRENT_LEVEL = 53
