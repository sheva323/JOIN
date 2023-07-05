import React, { ChangeEvent, useContext, useState } from "react";
import {
  Text,
  Box,
  Heading,
  Stack,
  Checkbox,
  Link,
  useColorModeValue,
  Flex,
  VStack,
  Radio,
  RadioGroup,
  Switch,
  FormLabel,
  FormControl,
  Button,
  Spacer,
  useColorMode,
} from "@chakra-ui/react";
import Image from "next/image";
import logoLight from "../assets/images/logo.png";
import logoDark from "../assets/images/logo_dark.png";
import { EventsContext } from "../context/EventsContext";
import {
  AddTagOnEvent,
  CreateEvent,
  FilterEventsBetweenDates,
  Platform,
} from "../helpers/PolybaseData";
import {
  getUnixTimestampsForThisWeek,
  getUnixTimestampsForToday,
  getUnixTimestampsForWeekend,
} from "../helpers/DateData";
import { Tag } from "../types/types";
import { nanoid } from "nanoid";
import moment from "moment";
import { FilterEvent } from "../helpers/FilterFunctions";

import { Polybase } from "@polybase/client";
import { useCollection, useDocument, usePolybase } from "@polybase/react";

export const SidebarFilters = ({}) => {
  const { colorMode } = useColorMode();
  const logoSrc = colorMode === "dark" ? logoDark : logoLight;
  const { setEvents, setTagFilters, tagFilters } = useContext(EventsContext);
  const [platform, setPlatform] = useState<string>("None");
  const [location, setLocation] = useState<string>("None");
  const [conferenceChecked, setConferenceChecked] = useState(false);
  const [hackathonChecked, setHackathonChecked] = useState(false);
  const [meetupChecked, setMeetupChecked] = useState(false);
  const [ethereumChecked, setEthereumChecked] = useState(false);
  const [polygonChecked, setPolygonChecked] = useState(false);
  const [bitcoinChecked, setBitcoinChecked] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("English");

  const db = new Polybase({
    defaultNamespace: process.env.NEXT_PUBLIC_NAMESPACE,
  });

  //Filtering by time
  const filterTime = async (start: number, end: number) => {
    try {
      const filtered = await FilterEventsBetweenDates(start, end);
      setEvents(filtered);
    } catch (error) {
      console.log(error);
    }
  };
  //Buttons
  const onFilter = async () => {
    try {
      const [startOfDayUnix] = getUnixTimestampsForToday();

      const response = await FilterEvent(
        platform,
        isOnline,
        selectedLanguage,
        startOfDayUnix
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
  const handleLanguageChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedLanguage(event.target.value);
  };
  const handleplatformChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPlatform(event.target.value);
  };
  const handleLocation = (event: ChangeEvent<HTMLInputElement>) => {
    setPlatform(event.target.value);
  };
  return (
    <Box
      width={"100%"}
      p={4}
      bg={useColorModeValue("neutrals.light.100", "neutrals.gray.400")}
      mx={6}
      my={4}
      borderRadius={"3xl"}
    >
      <Stack spacing={4}>
        <Flex justify={"start"}>
          <Link href="/">
            <Image alt="StratEx" src={logoSrc} width={80} height={80} />
          </Link>
        </Flex>
        <Text
          color={useColorModeValue("neutrals.gray.200", "neutrals.gray.200")}
          fontWeight={"normal"}
        >
          {" "}
          Welcome 👋
        </Text>
        <VStack justifyContent={"space-between"} align={"start"} gap={6}>
          <VStack align={"start"}>
            <Heading
              size="sm"
              color={useColorModeValue(
                "neutrals.gray.300",
                "neutrals.gray.300"
              )}
            >
              Platform
            </Heading>
            <RadioGroup
              color={useColorModeValue(
                "neutrals.gray.200",
                "neutrals.gray.200"
              )}
              fontWeight={"normal"}
              defaultValue="None"
            >
              <Stack direction="column">
                <Radio
                  value="Twitter"
                  checked={platform === "Twitter"}
                  onChange={handleplatformChange}
                >
                  Twitter
                </Radio>
                <Radio
                  value="Twitch"
                  checked={platform === "Twitch"}
                  onChange={handleplatformChange}
                >
                  Twitch
                </Radio>
                <Radio
                  value="Youtube"
                  checked={platform === "Youtube"}
                  onChange={handleplatformChange}
                >
                  Youtube
                </Radio>
                <Radio
                  value="ZoomMeet"
                  checked={platform === "ZoomMeet"}
                  onChange={handleplatformChange}
                >
                  Zoom / Meet
                </Radio>
                <Radio
                  value="None"
                  checked={platform === "None"}
                  onChange={handleplatformChange}
                >
                  None
                </Radio>
              </Stack>
            </RadioGroup>
          </VStack>
          <VStack align={"start"}>
            <Heading
              size="sm"
              color={useColorModeValue(
                "neutrals.gray.300",
                "neutrals.gray.300"
              )}
            >
              Activity
            </Heading>
            <Checkbox
              colorScheme="brand.primary.default"
              fontWeight={"normal"}
              color={useColorModeValue(
                "neutrals.gray.200",
                "neutrals.gray.200"
              )}
              isChecked={conferenceChecked}
              onChange={() => setConferenceChecked(!conferenceChecked)}
            >
              Conference
            </Checkbox>
            <Checkbox
              fontWeight={"normal"}
              color={useColorModeValue(
                "neutrals.gray.200",
                "neutrals.gray.200"
              )}
              isChecked={hackathonChecked}
              onChange={() => setHackathonChecked(!hackathonChecked)}
            >
              Hackathon
            </Checkbox>
            <Checkbox
              fontWeight={"normal"}
              color={useColorModeValue(
                "neutrals.gray.200",
                "neutrals.gray.200"
              )}
              isChecked={meetupChecked}
              onChange={() => setMeetupChecked(!meetupChecked)}
            >
              Meetup
            </Checkbox>
          </VStack>
          <VStack align={"start"}>
            <Heading
              size="sm"
              color={useColorModeValue(
                "neutrals.gray.300",
                "neutrals.gray.300"
              )}
            >
              Location
            </Heading>
            <RadioGroup
              color={useColorModeValue(
                "neutrals.gray.200",
                "neutrals.gray.200"
              )}
              fontWeight={"normal"}
              defaultValue="None"
            >
              <Stack direction="column">
                <Radio
                  value="Asia"
                  checked={location === "Asia"}
                  onChange={handleLocation}
                >
                  Asia
                </Radio>
                <Radio
                  value="LatAm"
                  checked={location === "LatAm"}
                  onChange={handleLocation}
                >
                  LatAm
                </Radio>
                <Radio
                  value="Europe"
                  checked={location === "Europe"}
                  onChange={handleLocation}
                >
                  Europe
                </Radio>
                <Radio
                  value="Africa"
                  checked={location === "Africa"}
                  onChange={handleLocation}
                >
                  Africa
                </Radio>
                <Radio
                  value="None"
                  checked={location === "None"}
                  onChange={handleLocation}
                >
                  None
                </Radio>
              </Stack>
            </RadioGroup>
          </VStack>
          <VStack align={"start"}>
            <Heading
              size="sm"
              color={useColorModeValue(
                "neutrals.gray.300",
                "neutrals.gray.300"
              )}
            >
              Community
            </Heading>
            <Checkbox
              fontWeight={"normal"}
              color={useColorModeValue(
                "neutrals.gray.200",
                "neutrals.gray.200"
              )}
              isChecked={ethereumChecked}
              onChange={() => setEthereumChecked(!ethereumChecked)}
            >
              Ethereum
            </Checkbox>
            <Checkbox
              fontWeight={"normal"}
              color={useColorModeValue(
                "neutrals.gray.200",
                "neutrals.gray.200"
              )}
              isChecked={polygonChecked}
              onChange={() => setPolygonChecked(!polygonChecked)}
            >
              Polygon
            </Checkbox>
            <Checkbox
              fontWeight={"normal"}
              color={useColorModeValue(
                "neutrals.gray.200",
                "neutrals.gray.200"
              )}
              isChecked={bitcoinChecked}
              onChange={() => setBitcoinChecked(!bitcoinChecked)}
            >
              Bitcoin
            </Checkbox>
          </VStack>
          <VStack align={"start"}>
            <Heading
              size="sm"
              color={useColorModeValue(
                "neutrals.gray.300",
                "neutrals.gray.300"
              )}
            >
              Language
            </Heading>
            <RadioGroup
              color={useColorModeValue(
                "neutrals.gray.200",
                "neutrals.gray.200"
              )}
              fontWeight={"normal"}
            >
              <Stack direction="column">
                <Radio
                  value="English"
                  checked={selectedLanguage === "English"}
                  onChange={handleLanguageChange}
                >
                  English
                </Radio>
                <Radio
                  value="Spanish"
                  checked={selectedLanguage === "Spanish"}
                  onChange={handleLanguageChange}
                >
                  Spanish
                </Radio>
              </Stack>
            </RadioGroup>
          </VStack>
          <VStack
            p={4}
            borderRadius={"3xl"}
            border={"1px"}
            borderColor={useColorModeValue(
              "neutrals.light.300",
              "neutrals.gray.300"
            )}
            width={"100%"}
          >
            <FormControl display="flex" alignItems="center">
              <FormLabel
                color={useColorModeValue(
                  "neutrals.gray.200",
                  "neutrals.gray.200"
                )}
                htmlFor="email-alerts"
                mb="0"
              >
                Online Events
              </FormLabel>
              <Spacer />
              <Switch
                id="email-alerts"
                onChange={() => setIsOnline(!isOnline)}
                checked={isOnline}
                defaultChecked={true}
              />
            </FormControl>
          </VStack>
          <VStack width="100%">
            <Button variant="primary" width={"70%"} onClick={onFilter}>
              Filter
            </Button>
          </VStack>
        </VStack>
      </Stack>
    </Box>
  );
};
