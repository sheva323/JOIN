import { useContext, useEffect, useState } from "react";
import {
  Text,
  Box,
  Heading,
  Stack,
  useColorModeValue,
  Flex,
  VStack,
  Button,
  HStack,
  Avatar,
  Icon,
  Link,
} from "@chakra-ui/react";
import {
  FaTwitter,
  FaYoutube,
  FaTwitch,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { ReadEventInfo, ReadEvents } from "../helpers/PolybaseData";
import { CollectionRecordResponse } from "@polybase/client/dist/Record";
import CardDetailsExtern from "./modals/CardDetailsExtern";
import { EventsContext } from "../context/EventsContext";

export const HighlightEvents = ({}) => {
  const { refresMyEvents } = useContext(EventsContext);
  const [eventsList, setEventsList] = useState<
    CollectionRecordResponse<any, any>[]
  >([]);
  const [details, setDetails] = useState(false);
  const [eventDetail, setEventDetail] = useState<CollectionRecordResponse<any, any>>();
  useEffect(() => {
    readEvents();
  }, [refresMyEvents]);
  const readEvents = async () => {
    try {
      const address = localStorage.getItem("address");
      const events = await ReadEvents(address);
      if (events) {
        let eventsArray: CollectionRecordResponse<any, any>[] = [];
        for (const ans of events) {
          const ev = await ReadEventInfo(ans.data.event.id);
          eventsArray.push(ev);
        }
        setEventsList(eventsArray);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getDetails = (event: CollectionRecordResponse<any, any>) => {
    setEventDetail(event);
    setDetails(true);
  };
  return (
    <>
      <Box
        width="100%"
        py="6"
        px="4"
        borderRadius={"3xl"}
        my={4}
        bg="neutrals.light.100"
        _dark={{ bg: "neutrals.gray.400"}}
      >
        <Heading
          as="h3"
          fontSize={"xl"}
          fontWeight="medium"
          mb={4}
          color={useColorModeValue("neutrals.gray.200", "neutrals.gray.200")}
        >
          My events
        </Heading>
        <Flex direction={"column"} mb={2} width="100%">
          {eventsList.map((item, index) => {
            if (index < 10) {
              return (
                <div key={index}>
                  <HStack
                    mb={4}
                    align={"center"}
                    justifyContent={"space-between"}
                  >
                    <Avatar
                      name="Kent Dodds"
                      src={`https://ipfs.io/ipfs/${item.data.image}`}
                    />
                    <VStack align={"start"} gap={0}>
                      <Text
                        color= "neutrals.gray.300"
                        _dark={{color:  "neutrals.gray.200"}}
                      >
                        {item.data.name}
                      </Text>
                      <Stack direction="row" align="center">
                        {item?.data.platform.toLowerCase() === "twitter" ? (
                          <Icon as={FaTwitter} color="neutrals.gray.200" />
                        ) : item?.data.platform.toLowerCase() === "twitch" ? (
                          <Icon as={FaTwitch} color="neutrals.gray.200" />
                        ) : item?.data.platform.toLowerCase() === "youtube" ? (
                          <Icon as={FaYoutube} color="neutrals.gray.200" />
                        ) : (
                          <Icon as={FaMapMarkerAlt} color="neutrals.gray.200" />
                        )}
                        {item?.data.is_online ? (
                          <Link
                            href={item?.data.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(ev) => ev.stopPropagation()}
                          >
                            <Text fontWeight="normal" color="neutrals.gray.200">
                              {item?.data.platform}
                            </Text>
                          </Link>
                        ) : (
                          <Text fontWeight="normal" color="neutrals.gray.200">
                            {item?.data.location}
                          </Text>
                        )}
                      </Stack>
                    </VStack>
                    <Button
                      variant="outline"
                      size={"sm"}
                      onClick={() => getDetails(item)}
                    >
                      Details
                    </Button>
                  </HStack>
                </div>
              );
            }
            return null;
          })}
        </Flex>
        <Button variant="primaryOutline" width="100%">
          View all
        </Button>
      </Box>
      {details && eventDetail && (
        <CardDetailsExtern
          onClose={() => setDetails(false)}
          onOpen={() => setDetails(true)}
          isOpen={details}
          event={eventDetail}
        />
      )}
    </>
  );
};
