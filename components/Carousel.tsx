import { useContext } from "react";
import {
  Text,
  Box,
  Heading,
  Stack,
  Checkbox,
  useColorModeValue,
  Flex,
  VStack,
  Radio,
  RadioGroup,
  Switch,
  FormLabel,
  FormControl,
  Button,
  ButtonGroup,
  Tooltip,
} from "@chakra-ui/react";
import { EventsContext } from "../context/EventsContext";
import { Auth, AuthState } from "@polybase/auth";

export const Carousel = ({}) => {
  const { isLogged, setIsLogged } = useContext(EventsContext);
  const auth = typeof window !== "undefined" ? new Auth() : null;
  const login = async () => {
    try {
      const authState: AuthState | undefined | null = await auth?.signIn();
      if (authState?.userId) {
        setIsLogged(true);
      }
      const address: string | null | undefined = authState
        ? authState.userId
        : null;
      localStorage.setItem("address", address ? address : "null");
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Box
        bgGradient="linear(to-bl, brand.primary.default, brand.primary.hover)"
        width="100%"
        py="10"
        px="8"
        borderRadius={"3xl"}
        my={4}
      >
        <Flex direction={"column"} gap="4" width="50%">
          <Heading as="h1" color={"white"}>
            {" "}
            Experience the future of decentralized event discovery.
          </Heading>
          <Text color={"white"} fontWeight="normal">
            {" "}
            Connect with like-minded individuals, expand your knowledge, and
            seize incredible opportunities in the decentralized realm.
          </Text>
          <ButtonGroup variant="outline" spacing="6">
            {!isLogged && (
              <Button variant="secondary" onClick={login}>
                Join now!
              </Button>
            )}
            <Tooltip label="Will be available soon...">
              <Button variant="secondaryOutline" mr={6}>
                Create Event
              </Button>
            </Tooltip>
          </ButtonGroup>
        </Flex>
      </Box>
    </>
  );
};
