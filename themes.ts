import { createThemes, defaultComponentThemes } from '@tamagui/theme-builder'
import * as Colors from '@tamagui/colors'

const darkPalette = [
  'hsla(327, 73%, 1%, 1)',
  'hsla(327, 73%, 6%, 1)',
  'hsla(327, 73%, 12%, 1)',
  'hsla(327, 73%, 17%, 1)',
  'hsla(327, 73%, 23%, 1)',
  'hsla(327, 73%, 28%, 1)',
  'hsla(327, 73%, 34%, 1)',
  'hsla(327, 73%, 39%, 1)',
  'hsla(327, 73%, 45%, 1)',
  'hsla(327, 73%, 50%, 1)',
  'hsla(0, 15%, 93%, 1)',
  'hsla(0, 15%, 99%, 1)',
]
const lightPalette = [
  'hsla(327, 73%, 97%, 1)',
  'hsla(327, 73%, 92%, 1)',
  'hsla(327, 73%, 87%, 1)',
  'hsla(327, 73%, 81%, 1)',
  'hsla(327, 73%, 76%, 1)',
  'hsla(327, 73%, 71%, 1)',
  'hsla(327, 73%, 66%, 1)',
  'hsla(327, 73%, 60%, 1)',
  'hsla(327, 73%, 55%, 1)',
  'hsla(327, 73%, 50%, 1)',
  'hsla(0, 15%, 15%, 1)',
  'hsla(0, 15%, 1%, 1)',
]

const lightShadows = {
  shadow1: 'rgba(0,0,0,0.04)',
  shadow2: 'rgba(0,0,0,0.08)',
  shadow3: 'rgba(0,0,0,0.16)',
  shadow4: 'rgba(0,0,0,0.24)',
  shadow5: 'rgba(0,0,0,0.32)',
  shadow6: 'rgba(0,0,0,0.4)',
}

const darkShadows = {
  shadow1: 'rgba(0,0,0,0.2)',
  shadow2: 'rgba(0,0,0,0.3)',
  shadow3: 'rgba(0,0,0,0.4)',
  shadow4: 'rgba(0,0,0,0.5)',
  shadow5: 'rgba(0,0,0,0.6)',
  shadow6: 'rgba(0,0,0,0.7)',
}

// we're adding some example sub-themes for you to show how they are done, "success" "warning", "error":

const builtThemes = createThemes({
  componentThemes: defaultComponentThemes,

  base: {
    palette: {
      dark: darkPalette,
      light: lightPalette,
    },

    extra: {
      light: {
        ...Colors.green,
        ...Colors.red,
        ...Colors.yellow,
        ...lightShadows,
        shadowColor: lightShadows.shadow1,
      },
      dark: {
        ...Colors.greenDark,
        ...Colors.redDark,
        ...Colors.yellowDark,
        ...darkShadows,
        shadowColor: darkShadows.shadow1,
      },
    },
  },

  accent: {
    palette: {
      dark: [
        'hsla(330, 50%, 35%, 1)',
        'hsla(330, 50%, 38%, 1)',
        'hsla(330, 50%, 41%, 1)',
        'hsla(330, 50%, 43%, 1)',
        'hsla(330, 50%, 46%, 1)',
        'hsla(330, 50%, 49%, 1)',
        'hsla(330, 50%, 52%, 1)',
        'hsla(330, 50%, 54%, 1)',
        'hsla(330, 50%, 57%, 1)',
        'hsla(330, 50%, 60%, 1)',
        'hsla(250, 50%, 90%, 1)',
        'hsla(250, 50%, 95%, 1)',
      ],
      light: [
        'hsla(330, 50%, 50%, 1)',
        'hsla(330, 50%, 52%, 1)',
        'hsla(330, 50%, 53%, 1)',
        'hsla(330, 50%, 55%, 1)',
        'hsla(330, 50%, 57%, 1)',
        'hsla(330, 50%, 58%, 1)',
        'hsla(330, 50%, 60%, 1)',
        'hsla(330, 50%, 62%, 1)',
        'hsla(330, 50%, 63%, 1)',
        'hsla(330, 50%, 65%, 1)',
        'hsla(250, 50%, 95%, 1)',
        'hsla(250, 50%, 95%, 1)',
      ],
    },
  },

  childrenThemes: {
    warning: {
      palette: {
        dark: Object.values(Colors.yellowDark),
        light: Object.values(Colors.yellow),
      },
    },

    error: {
      palette: {
        dark: Object.values(Colors.redDark),
        light: Object.values(Colors.red),
      },
    },

    success: {
      palette: {
        dark: Object.values(Colors.greenDark),
        light: Object.values(Colors.green),
      },
    },
  },

  // optionally add more, can pass palette or template

  // grandChildrenThemes: {
  //   alt1: {
  //     template: 'alt1',
  //   },
  //   alt2: {
  //     template: 'alt2',
  //   },
  //   surface1: {
  //     template: 'surface1',
  //   },
  //   surface2: {
  //     template: 'surface2',
  //   },
  //   surface3: {
  //     template: 'surface3',
  //   },
  // },
})

export type Themes = typeof builtThemes

// the process.env conditional here is optional but saves web client-side bundle
// size by leaving out themes JS. tamagui automatically hydrates themes from CSS
// back into JS for you, and the bundler plugins set TAMAGUI_ENVIRONMENT. so
// long as you are using the Vite, Next, Webpack plugins this should just work,
// but if not you can just export builtThemes directly as themes:
export const themes: Themes =
  process.env.TAMAGUI_ENVIRONMENT === 'client' && process.env.NODE_ENV === 'production'
    ? ({} as any)
    : (builtThemes as any)
