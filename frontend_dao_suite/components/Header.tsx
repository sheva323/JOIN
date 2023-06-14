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
} from "@chakra-ui/react";
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import Image from "next/image";
import logo from "../assets/images/logo.png";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Auth } from "@polybase/auth";
import { useEffect, useState } from "react";
import Toggle from "./Toggle";
import { BsBell, BsSearch } from "react-icons/bs";

export default function WithSubnavigation() {
  const [logged, setLogged] = useState(false);
  useEffect(() => {
    console.log(localStorage.getItem("address"));
    if (localStorage.getItem("address")) setLogged(true);
  }, [logged]);

  const { isOpen, onToggle } = useDisclosure();
  const auth = typeof window !== "undefined" ? new Auth() : null;
  const login = async () => {
    try {
      const authState = await auth.signIn();
      console.log(authState);
      if (authState?.userId) setLogged(true);
      localStorage.setItem("address", authState?.userId);
    } catch (error) {
      console.log(error);
    }
  };
  const logOut = async () => {
    try {
      const out = await auth.signOut();
      console.log(out);
      setLogged(false);
      localStorage.clear();
    } catch (error) {
      console.log(error);
    }
  };
  function trimAddress(address) {
    if (!address) return "";
  
    const trimmedAddress = address.substring(0, 6) + "..." + address.substring(address.length - 4);
    return trimmedAddress;
  }
  
  return (
    <Box my={3}>
      <Flex
        color={useColorModeValue("gray.600", "white")}
        minH={"60px"}
        align={"center"}
      >
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
        <Button variant="primary" onClick={login} mr={6}>
            Create Event
          </Button>
        <IconButton
        aria-label="Your notifications"
        bg={useColorModeValue("white", "neutrals.gray.400")} 
        color="neutrals.gray.100"
        size="md"
        mr={2}
        borderRadius={"full"}
        icon={<BsBell />}/>
        <Toggle />
        {/* <ConnectButton /> */}
        {logged ? (
          <HStack>
          <Flex>
           <Text color={useColorModeValue("neutrals.gray.200", "neutrals.gray.200")} fontWeight={"normal"}>{trimAddress(localStorage.getItem("address"))}</Text>
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
  const linkColor = useColorModeValue("brand.primary.default", "brand.primary.disabled");
  const linkHoverColor = useColorModeValue("brand.primary.hover", "brand.primary.default");

  return (
    <Stack direction={"row"} spacing={4}>
      <Stack spacing={4} direction={{ base: 'column', md: 'row' }} w={'full'} align={"center"}  bg={useColorModeValue("white", "neutrals.gray.400")} pl={4} pr={2} borderRadius={"3xl"} py={1}>
          <Icon
          aria-label="Search"
          bg="transparent"
          size="lg"
          color="neutrals.gray.100"
          borderRadius={"full"}
          as={BsSearch}/>
          <Input
            type={'text'}
            placeholder={'Search your next event'}
            _placeholder={{ color: 'gray.500',  }}
            color='gray.800'
            bg={useColorModeValue("neutrals.light.300", "neutrals.gray.400")}
            rounded={'full'}
            border={0}
            _focus={{
           
              outline: 'brand.primary.default',
            }}
          />
        </Stack>
      {NAV_ITEMS.map((navItem) => (
        <Flex key={navItem.label} w="130px" align={"center"}>
              <Link
                p={2}
                href={navItem.href ?? "#"}
                fontSize={"md"}
                fontWeight={500}
                color={linkColor}
                _hover={{
                  textDecoration: "none",
                  color: linkHoverColor,
                }}
              >
                {navItem.label}
              </Link>
        </Flex>
      ))}
    </Stack>
  );
};

const MobileNav = () => {
  return (
    <Stack
      bg={useColorModeValue("white", "gray.800")}
      p={4}
      display={{ md: "none" }}
    >
      {NAV_ITEMS.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({ label, children, href }: NavItem) => {
  const { isOpen, onToggle } = useDisclosure();

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
        <Text
          fontWeight={600}
          color={useColorModeValue("gray.600", "gray.200")}
        >
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
    href: "/",
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
  }
];
