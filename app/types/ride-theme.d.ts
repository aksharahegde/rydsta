import type { RideThemeContext } from '~/composables/useRideTheme'

declare module '#app' {
  interface NuxtApp {
    $rideTheme: RideThemeContext
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $rideTheme: RideThemeContext
  }
}

export {}
