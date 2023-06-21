import { checkboxAnatomy as parts } from "@chakra-ui/anatomy";
import {
  createMultiStyleConfigHelpers,
  defineStyle,
} from "@chakra-ui/styled-system";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys);

// default base style from the Checkbox theme
const baseStyle = definePartsStyle({
  label: {},
  control: {

  }
});

// Defining a custom variant
const variantCircular = definePartsStyle({
  control: defineStyle({
    rounded: "full",
    border: "0px"
  }),
  icon: {
    color: "brand.primary.default",
  },
  container: {
    border: "1px",
    borderColor: "neutrals.light.300",
    borderRadius: "3xl",
    bg: "transparent",
    px: "8px",
    _hover: {
      bg: "neutrals.light.300",
      transitionDuration: "0.5s",
      transitionTimingFunction: "ease-in-out",
    }
  }
});

const variants = {
  circular: variantCircular,
};

const sizes = {
  xl: definePartsStyle({
    control: defineStyle({
      boxSize: 14,
    }),
    label: defineStyle({
      fontSize: "2xl",
      marginLeft: 6,
    }),
  }),
};

export const checkboxTheme = defineMultiStyleConfig({
  baseStyle,
  variants,
  sizes,
});
