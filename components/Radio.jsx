import { radioAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(radioAnatomy.keys)

const baseStyle = definePartsStyle({
  // define the part you're going to style
  control: {
    _checked: {
    bg: "brand.primary.default",
    border: 0,
    }
  },
})

export const radioTheme = defineMultiStyleConfig({ baseStyle })