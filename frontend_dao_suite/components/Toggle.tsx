//Toggle.js

import {
    VStack,
    IconButton,
    useColorMode,
    useColorModeValue,
    Heading,
  } from "@chakra-ui/react";
  import { BsSun, BsMoon } from "react-icons/bs";
  
  function Toggle() {
    // Chakra UI hook that toggle the color mode
    const { toggleColorMode } = useColorMode();
    return (
      <VStack>
        <IconButton
          aria-label="Switch to dark mode"
          bg="transparent"
          size="lg"
          icon={useColorModeValue(<BsMoon />, <BsSun />)}
          onClick={toggleColorMode}
        />
      </VStack>
    );
  }
  
  export default Toggle;
  