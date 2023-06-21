import {
  Box,
  Flex,
  Text,
  IconButton,
  Spacer,
  Stack,
  Collapse,
  Icon,
  Link,
  Input,
  useColorModeValue,
  useDisclosure,
  HStack,
  Button,
  Tooltip,
} from "@chakra-ui/react";
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
} from "@chakra-ui/icons";
import { Auth, AuthState } from "@polybase/auth";
import { useContext, useEffect, useState } from "react";
import Toggle from "./Toggle";
import { BsBell, BsSearch } from "react-icons/bs";
import { EventsContext } from "../context/EventsContext";

export default function WithSubnavigation() {
  const { isLogged, setIsLogged } = useContext(EventsContext);
  const bg = useColorModeValue("gray.600", "white");
  const bg2 = useColorModeValue("white", "neutrals.gray.400");
  const textColor = useColorModeValue("neutrals.gray.200", "neutrals.gray.200");

  useEffect(() => {
    if (localStorage.getItem("address")) setIsLogged(true);
  }, [isLogged]);

  const { isOpen, onToggle } = useDisclosure();
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
  const logOut = async () => {
    try {
      const out = await auth?.signOut();
      setIsLogged(false);
      localStorage.clear();
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };
  function trimAddress(address: string | null) {
    if (!address) return "";
    const trimmedAddress =
      address.substring(0, 6) + "..." + address.substring(address.length - 4);
    return trimmedAddress;
  }

  return (
    <Box my={3}>
      <Flex color={bg} minH={"60px"} align={"center"}>
        <Flex
          flex={{ base: 1, md: "auto" }}
          ml={{ base: -2 }}
          display={{ base: "flex", md: "none" }}
        >
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant={"ghost"}
            aria-label={"Toggle Navigation"}
          />
        </Flex>
        <Flex flex={{ base: 1 }} justify={{ base: "center", md: "start" }}>
          <Flex display={{ base: "none", md: "flex" }} align="center">
            <DesktopNav />
          </Flex>
        </Flex>
        <Tooltip label='Will be available soon...'>
          <Button variant="primary"  mr={6} >
            Create Event
          </Button>
        </Tooltip>
        <IconButton
          aria-label="Your notifications"
          bg={bg2}
          color="neutrals.gray.100"
          size="md"
          mr={2}
          borderRadius={"full"}
          icon={<BsBell />}
        />
        <Toggle />
        {/* <ConnectButton /> */}
        {isLogged ? (
          <HStack>
            <Flex>
              <Text color={textColor} fontWeight={"normal"}>
                {trimAddress(localStorage.getItem("address"))}
              </Text>
            </Flex>
            <Button variant="primaryOutline" onClick={logOut} mr={6}>
              Logout
            </Button>
          </HStack>
        ) : (
          <Button variant="primaryOutline" onClick={login} mr={6}>
            Login
          </Button>
        )}
        <HStack>
          <Spacer />
        </HStack>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </Collapse>
    </Box>
  );
}

const DesktopNav = () => {
  const { setCalendarView, calendarView } = useContext(EventsContext);
  const linkColor = useColorModeValue(
    "brand.primary.default",
    "brand.primary.disabled"
  );
  const linkHoverColor = useColorModeValue(
    "brand.primary.hover",
    "brand.primary.default"
  );
  const bg2 = useColorModeValue("white", "neutrals.gray.400");
  const input = useColorModeValue("neutrals.light.300", "neutrals.gray.400");
  return (
    <Stack direction={"row"} spacing={4}>
      <Stack
        spacing={4}
        direction={{ base: "column", md: "row" }}
        w={"full"}
        align={"center"}
        bg={bg2}
        pl={4}
        pr={2}
        borderRadius={"3xl"}
        py={1}
      >
        <Icon
          aria-label="Search"
          bg="transparent"
          size="lg"
          color="neutrals.gray.100"
          borderRadius={"full"}
          as={BsSearch}
        />
        <Input
          type={"text"}
          placeholder={"Search your next event"}
          _placeholder={{ color: "gray.500" }}
          color="gray.800"
          bg={input}
          rounded={"full"}
          border={0}
          _focus={{
            outline: "brand.primary.default",
          }}
        />
      </Stack>
      <Flex w="160px" align={"center"}>
        <Link
          p={2}
          href={"#"}
          fontSize={"md"}
          fontWeight={500}
          color={linkColor}
          _hover={{
            textDecoration: "none",
            color: linkHoverColor,
          }}
          onClick={() => setCalendarView(!calendarView)}
        >
          {calendarView ?  'Only events' : 'My calendar'}
        </Link>
      </Flex>
    </Stack>
  );
};

const MobileNav = () => {
  const bg = useColorModeValue("white", "gray.800");
  return (
    <Stack bg={bg} p={4} display={{ md: "none" }}>
      {/* //TODO fix this <========= */}
      {NAV_ITEMS.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({ label, children, href }: NavItem) => {
  const { isOpen, onToggle } = useDisclosure();
  const bg = useColorModeValue("gray.600", "gray.200");
  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        as={Link}
        href={href ?? "#"}
        justify={"space-between"}
        align={"center"}
        _hover={{
          textDecoration: "none",
        }}
      >
        <Text fontWeight={600} color={bg}>
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={"all .25s ease-in-out"}
            transform={isOpen ? "rotate(180deg)" : ""}
            w={6}
            h={6}
          />
        )}
      </Flex>
    </Stack>
  );
};

interface NavItem {
  label: string;
  subLabel?: string;
  children?: Array<NavItem>;
  href?: string;
}

const NAV_ITEMS: Array<NavItem> = [
  {
    label: "My Events",
    href: "/calendar",
    children: [
      {
        label: "Explore Upcoming Events",
        subLabel: "Find your next online or onsite events",
        href: "#",
      },
      {
        label: "News & Updates",
        subLabel: "Up-and-coming Designers",
        href: "#",
      },
    ],
  },
];
