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
import { useCollection, useDocument, usePolybase } from '@polybase/react'

export const SidebarFilters = ({}) => {
  const { colorMode } = useColorMode();
  const logoSrc = colorMode === "dark" ? logoDark : logoLight;
  const { setEvents, setTagFilters, tagFilters } = useContext(EventsContext);
  const [dateFilter, setDateFilter] = useState<string>("0");
  const [twitterChecked, setTwitterChecked] = useState(false);
  const [twitchChecked, setTwitchChecked] = useState(false);
  const [youtubeChecked, setYoutubeChecked] = useState(false);
  const [conferenceChecked, setConferenceChecked] = useState(false);
  const [hackathonChecked, setHackathonChecked] = useState(false);
  const [meetupChecked, setMeetupChecked] = useState(false);
  const [asiaChecked, setAsiaChecked] = useState(false);
  const [latamChecked, setLatamChecked] = useState(false);
  const [europeChecked, setEuropeChecked] = useState(false);
  const [ethereumChecked, setEthereumChecked] = useState(false);
  const [polygonChecked, setPolygonChecked] = useState(false);
  const [bitcoinChecked, setBitcoinChecked] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('English');


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
  const createEventManual = async () => {
    const tags: Tag[] = [
      { id: "dao", name: "DAO" },
      { id: "defi", name: "DeFi" },
    ];
    try {
      const startDate = new Date();
      const endDate = new Date();
      startDate.setMonth(startDate.getMonth() + 1);
      endDate.setMonth(endDate.getMonth() + 2);
      endDate.setDate(endDate.getDate() + 3);
      const name = "event 007";
      const newEvent = await CreateEvent(
        nanoid(),
        "calendar001",
        name,
        "this is a basic description of the event",
        "QmR8h1s4cyNJELt1MBeyVJUgArDLNvseeiXAwtLicWDQvg",
        "Dash House California",
        Platform.Twitter,
        "https://twitter.com/marketersweb3/status/1665810617704259584?s=20",
        true,
        moment(startDate).unix(),
        moment(endDate).unix(),
        moment().unix(),
        tags
      );
    } catch (error) {
      console.log(error);
    }
  };
  const addTag = async () => {
    try {
      const tag: Tag = {
        id: "dao",
        name: "DAO",
      };
      const ans = await AddTagOnEvent("gjYYD5IiM8zAjInMrchna", tag);
    } catch (error) {}
  };
  //Buttons
  const onFilter = async () => {
    try {
      const response = await FilterEvent(
        twitterChecked, 
        twitchChecked, 
        youtubeChecked,
        isOnline,
        selectedLanguage,
        1674066800
      );
      setEvents(response);
      setTagFilters({
        ...tagFilters,
        conference:  conferenceChecked,
        hackaton: hackathonChecked,
        meetUp : meetupChecked,
        asia: asiaChecked,
        latam: latamChecked,
        europe: europeChecked,
        ethereum : ethereumChecked,
        polygon: polygonChecked,
        bitcoin: bitcoinChecked,
        workshop: meetupChecked,
        isFiltered: true,
      })
    } catch (error) {
      console.log(error);
    }
  };
  const handleLanguageChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedLanguage(event.target.value);
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
            <Checkbox
              fontWeight={"normal"}
              color={useColorModeValue(
                "neutrals.gray.200",
                "neutrals.gray.200"
              )}
              isChecked={twitterChecked}
              onChange={() => setTwitterChecked(!twitterChecked)}
            >
              Twitter
            </Checkbox>
            <Checkbox
              fontWeight={"normal"}
              color={useColorModeValue(
                "neutrals.gray.200",
                "neutrals.gray.200"
              )}
              isChecked={twitchChecked}
              onChange={() => setTwitchChecked(!twitchChecked)}
            >
              Twitch
            </Checkbox>
            <Checkbox
              fontWeight={"normal"}
              color={useColorModeValue(
                "neutrals.gray.200",
                "neutrals.gray.200"
              )}
              isChecked={youtubeChecked}
              onChange={() => setYoutubeChecked(!youtubeChecked)}
            >
              Youtube
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
              Activity
            </Heading>
            <Checkbox
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
            <Checkbox
              fontWeight={"normal"}
              color={useColorModeValue(
                "neutrals.gray.200",
                "neutrals.gray.200"
              )}
              isChecked={asiaChecked}
              onChange={() => setMeetupChecked(!asiaChecked)}
            >
              Asia
            </Checkbox>
            <Checkbox
              fontWeight={"normal"}
              color={useColorModeValue(
                "neutrals.gray.200",
                "neutrals.gray.200"
              )}
              isChecked={latamChecked}
              onChange={() => setLatamChecked(!latamChecked)}
            >
              LatAm
            </Checkbox>
            <Checkbox
              fontWeight={"normal"}
              color={useColorModeValue(
                "neutrals.gray.200",
                "neutrals.gray.200"
              )}
              isChecked={europeChecked}
              onChange={() => setEuropeChecked(!europeChecked)}
            >
              Europe
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
          {/* <VStack align={'start'}>
    <Heading size="sm" color={useColorModeValue("neutrals.gray.300", "neutrals.gray.300")}>Date</Heading>
    <RadioGroup>
    <Stack direction='column' color={useColorModeValue("neutrals.gray.200", "neutrals.gray.200")} fontWeight={'normal'}>
      <Radio value='1'>Today</Radio>
      <Radio value='2'>This week</Radio>
      <Radio value='3'>This weekend</Radio>
      </Stack>
      </RadioGroup>
    </VStack> */}
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
                  checked={selectedLanguage === 'English'}
                  onChange={handleLanguageChange}
                >English</Radio>
                <Radio 
                  value="Spanish"
                  checked={selectedLanguage === 'Spanish'}
                  onChange={handleLanguageChange}
                >Spanish</Radio>
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
              <Switch id="email-alerts" 
                onChange={() => setIsOnline(!isOnline)}
                checked={isOnline}
                defaultChecked={true}
              />
            </FormControl>
          </VStack>
          <VStack width="100%">
            <Button variant="primary" width={"100%"} onClick={onFilter}>
              Filter
            </Button>
          </VStack>
        </VStack>
      </Stack>
    </Box>
  );
};
