const flags = {
  NA: '🇺🇸',
  EU: '🇪🇺',
  ASIA: '🇯🇵',
  SA: '🇧🇷',
  OCE: '🇦🇺',
} as const

export type FlagKeys = keyof typeof flags

export const getRegionFlag = (region: FlagKeys | string) => {
  return flags[region as FlagKeys] ?? '🌍'
}

export const getLevelColor = (lvl: number) => {
  if (lvl >= 91) return 'text-[#7E22CE]'
  if (lvl >= 81) return 'text-[#8B5CF6]'
  if (lvl >= 61) return 'text-[#3B82F6]'
  if (lvl >= 41) return 'text-[#10B981]'
  if (lvl >= 21) return 'text-[#F59E0B]'
  return '#9CA3AF'
}

export const CURRENT_LEVEL = 53
