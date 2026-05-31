export type RideThemeMode = 'light' | 'dark'

export type RideThemeContext = {
  mode: Ref<RideThemeMode>
  isDark: ComputedRef<boolean>
  toggle: () => void
  setLight: () => void
  setDark: () => void
}

const ssrFallback: RideThemeContext = {
  mode: ref('light'),
  isDark: computed(() => false),
  toggle: () => {},
  setLight: () => {},
  setDark: () => {},
}

export function useRideTheme(): RideThemeContext {
  return useNuxtApp().$rideTheme ?? ssrFallback
}
