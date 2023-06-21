import {
  Stack,
  Text,
  Image,
  Heading,
  Button,
  Badge,
  Icon,
  Card,
  CardBody,
  CardFooter,
  useDisclosure,
  IconButton,
  Box,
  Wrap,
  useColorModeValue,
  WrapItem,
  Link,
} from "@chakra-ui/react";
import {
  FaTwitter,
  FaYoutube,
  FaTwitch,
  FaShareAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
import SheduleModal from "./modals/ScheduleModal";
import { useContext, useEffect, useState } from "react";
import { ReadTagsFromEvent } from "../helpers/PolybaseData";
import { CollectionRecordResponse } from "@polybase/client/dist/Record";
import { returnTagNames } from "../helpers/FetchData";
import { EventsContext } from "../context/EventsContext";
import CardDetails from "./modals/CardDetails";
import ScheduleModal from "./modals/ScheduleModal";
import { GetDataFormatted } from "../helpers/DateData";
type Props = {
  event: CollectionRecordResponse<any, any>;
};
export default function CardEvent({ event }: Props) {
  const [cardImage, setCardImage] = useState("/standard/calendar.jpg");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { tagFilters } = useContext(EventsContext);
  const [tags, setTags] = useState<string[]>([]);
  const [norender, setNorender] = useState(false);
  const [details, setDetails] = useState(false);
  let bg = useColorModeValue("white", "neutrals.gray.400");
  useEffect(() => {
    if (event?.data.image && event?.data.image !== "")
      setCardImage(`https://ipfs.io/ipfs/${event?.data.image}`);
    readTags();
  }, []);
  const readTags = async () => {
    try {
      // const tags = await ReadTagsFromEvent(event.data.id);
      // const tagsNames = await returnTagNames(tags.data);
      // setTags(tagsNames);
      // if (tagFilters.isFiltered) {
      //   checkFilterTags(tags.data);
      // }
    } catch (error) {
      console.log(error);
    }
  };
  const checkFilterTags = (data: any) => {
    const filteredTags = data.filter((tag: any) => {
      return tagFilters[tag.data.tag.id];
    });
  };
  const handleImageError = () => {
    setCardImage("/nocover.png");
  };
  const onSchedule = () => {
    setDetails(false);
    onOpen();
  };
  if (norender) return;
  return (
    <>
      <Card
        maxW="sm"
        borderRadius="3xl"
        onClick={() => setDetails(true)}
        bg={bg}
        css={{
          cursor: "pointer",
        }}
      >
        <Image
          src={cardImage}
          alt="Event Image"
          borderTopRadius="3xl"
          maxH="200px"
          maxW="100%"
          objectFit="cover"
          onError={handleImageError}
          height={200}
        />
        <Box pos="absolute" top="3" right="3">
          <IconButton
            aria-label="Search database"
            borderRadius={"3xl"}
            color="brand.primary.default"
            icon={<FaShareAlt />}
          />
        </Box>
        <CardBody py={3} px={5}>
          <Stack spacing="1">
            <Text color="neutrals.gray.100" fontWeight="semibold" fontSize="sm">
              {GetDataFormatted(event?.data.start_date_timestamp)}
            </Text>
            <Heading
              size="md"
              as="h2"
              color="brand.primary.default"
              textTransform="capitalize"
              overflow="hidden"
              textOverflow="ellipsis"
              css={{
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2,
              }}
            >
              {event?.data.name}
            </Heading>
            <Stack direction="row" align="center">
              {event?.data.platform.toLowerCase() === "twitter" ? (
                <Icon as={FaTwitter} color="neutrals.gray.200" />
              ) : event?.data.platform.toLowerCase() === "twitch" ? (
                <Icon as={FaTwitch} color="neutrals.gray.200" />
              ) : event?.data.platform.toLowerCase() === "youtube" ? (
                <Icon as={FaYoutube} color="neutrals.gray.200" />
              ) : (
                <Icon as={FaMapMarkerAlt} color="neutrals.gray.200" />
              )}
              {event?.data.is_online ? (
                <Link
                  href={event?.data.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(ev) => ev.stopPropagation()}
                >
                  <Text fontWeight="normal" color="neutrals.gray.200">
                    {event?.data.platform}
                  </Text>
                </Link>
              ) : (
                <Text fontWeight="normal" color="neutrals.gray.200">
                  {event?.data.location}
                </Text>
              )}
            </Stack>
            <Wrap mt={2}>
              {tags.map((tag, index) => {
                return (
                  // eslint-disable-next-line react/jsx-key
                  <WrapItem key={index}>
                    <Badge
                      px={2}
                      bg="transparent"
                      border="1px"
                      color="neutrals.gray.200"
                      borderColor="neutrals.light.300"
                      borderRadius={"xl"}
                      fontWeight="medium"
                    >
                      {tag}
                    </Badge>
                  </WrapItem>
                );
              })}
            </Wrap>
          </Stack>
        </CardBody>
        <CardFooter pt={1}>
          <Button
            variant="primary"
            colorScheme="blue"
            w="100%"
            onClick={(event: any) => {
              event.stopPropagation();
              onOpen();
            }}
          >
            Schedule
          </Button>
        </CardFooter>
      </Card>
      {isOpen &&<SheduleModal
        onClose={onClose}
        onOpen={onOpen}
        isOpen={isOpen}
        event={event}
      />}
      {details && <CardDetails
        onClose={() => setDetails(false)}
        onOpen={() => setDetails(true)}
        isOpen={details}
        event={event}
        onSchedule={onSchedule}
      />}
    </>
  );
}
