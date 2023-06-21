import { extendTheme, type ThemeConfig } from '@chakra-ui/react';
import { checkboxTheme } from "../components/Checkbox";


import {
  useColorModeValue,
} from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
}

const theme = extendTheme({ 
  colors: {
    brand: {
      primary: {
        default: "#5155DA",
        hover: "#4f4fde",
        disabled: "#695eff"
      },
      secondary: {
        default: "#EDEA00",
      },
    },
    neutrals: {
      gray: {
        100: "#A5A6BA",
        200: "#7A7A86",
        300: "#3A3A37",
        400: "#1C1C1C",
        500: "#101010"

      },
      light: {
        100: "#FFFF",
        200: "#F4F7FE",
        300: "#EAE8FD",
      },
    },
    semantic: {
      error: {
        red: "#F15151",
      },
      success: {
        200: "#00F5B4",
        600: "#00BC8B",
        800: "#00A378",
      },
    },
  },
  components: {
    Button: {
      variants: {
        primary: {
          bg: "brand.primary.default",
          borderRadius: "3xl",
          _hover: {
            bg: "brand.primary.hover",
            shadow: "md",
            transitionDuration: "0.2s",
            color: "neutrals.light.100",
            transitionTimingFunction: "ease-in-out",
            transform: "scale(1.05)",
          },
          _disabled: { bg: "brand.primary.disabled" },
          color: "neutrals.light.200",
          fontWeight:"normal"
        },
        secondary: {
          bg: "white",
          borderRadius: "3xl",
          color: "brand.primary.primary",
          fontWeight:"normal",
          _hover: {
            shadow: "md",
            transitionDuration: "0.2s",
            transitionTimingFunction: "ease-in-out",
            transform: "scale(1.1)",
          },
          _disabled: { bg: "semantic.success.200" },
        },
        primaryOutline: {
          bg: "transparent",
          borderRadius: "3xl",
          fontWeight:"normal",
          border:"1px",
          borderColor:"brand.primary.default",
          _hover: {
            bg: "brand.primary.disabled",
            shadow: "md",
            transitionDuration: "0.2s",
            color: "neutrals.light.100",
            transitionTimingFunction: "ease-in-out",
            transform: "scale(1.05)",
          },
          _disabled: { bg: "brand.primary.disabled" },
          color: "brand.primary.default",
        },
        secondaryOutline: {
          bg: "transparent",
          borderRadius: "3xl",
          borderColor:"white",
          fontWeight:"normal",
          border:"1px",
          _hover: {
            bg: "white",
            shadow: "md",
            transitionDuration: "0.2s",
            color: "brand.primary.default",
            transitionTimingFunction: "ease-in-out",
            transform: "scale(1.05)",
          },
          _disabled: { bg: "brand.primary.disabled" },
          color: "neutrals.light.200",
        },
        outline: {
          bg: "transparent",
          borderRadius: "3xl",
          borderColor:"neutrals.light.300",
          fontWeight:"normal",
          border:"1px",
          _hover: {
            shadow: "md",
            transitionDuration: "0.2s",
            color: "brand.primary.default",
            transitionTimingFunction: "ease-in-out",
            transform: "scale(1.05)",
          },
          _disabled: { bg: "brand.primary.disabled" },
          color: "neutrals.gray.100",
        },
      },
    },
    Checkbox: checkboxTheme,

  },
 })

export default theme