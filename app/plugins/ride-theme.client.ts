import { useColorMode } from '@vueuse/core'
import type { RideThemeMode, RideThemeContext } from '~/composables/useRideTheme'

const STORAGE_KEY = 'ride-wrapped-color-mode'

function applyThemeClass(isDark: boolean) {
  document.documentElement.classList.toggle('dark', isDark)
}

export default defineNuxtPlugin(() => {
  const mode = useColorMode({
    attribute: 'class',
    modes: {
      light: '',
      dark: 'dark',
    },
    storageKey: STORAGE_KEY,
    initialValue: 'light',
  })

  if (mode.value === 'auto') {
    mode.value = 'light'
  }
  applyThemeClass(mode.value === 'dark')

  watch(
    () => mode.value,
    (value) => {
      if (value === 'auto') {
        mode.value = 'light'
        return
      }
      applyThemeClass(value === 'dark')
    },
  )

  const isDark = computed(() => mode.value === 'dark')

  const theme: RideThemeContext = {
    mode: mode as Ref<RideThemeMode>,
    isDark,
    toggle() {
      mode.value = isDark.value ? 'light' : 'dark'
    },
    setLight() {
      mode.value = 'light'
    },
    setDark() {
      mode.value = 'dark'
    },
  }

  return {
    provide: {
      rideTheme: theme,
    },
  }
})
