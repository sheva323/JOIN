import {
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useColorModeValue,
  VStack,
  Box,
  Stack,
  Text,
  Image,
  Heading,
  ButtonGroup,
  Button,
  Icon,
  HStack,
  Avatar,
  Link,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import {
  FaTwitter,
  FaYoutube,
  FaTwitch,
  FaShareAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { PropsWithChildren, useEffect, useState } from "react";
import { CollectionRecordResponse } from "@polybase/client/dist/Record";
import { GetDataFormatted } from "../../helpers/DateData";

type CardDetailsProps = {
  onClose: () => void;
  onOpen: () => void;
  isOpen: boolean;
  event: CollectionRecordResponse<any, any>;
};

export default function CardDetailsExtern({
  onClose,
  onOpen,
  isOpen,
  event,
}: PropsWithChildren<CardDetailsProps>) {
  const [cardImage, setCardImage] = useState("/standard/calendar.jpg");
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    if (event?.data.image && event?.data.image !== "")
      setCardImage(`https://ipfs.io/ipfs/${event?.data.image}`);
  }, []);
  return (
    <Box position="absolute" h="100vh" p={12}>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg={useColorModeValue("white", "neutrals.gray.400")}>
          <Image
            src={cardImage}
            alt="Green double couch with wooden legs"
            borderTopRadius="lg"
          />
          <ModalCloseButton />
          <ModalBody>
            <Stack mt="2" spacing="1">
              <HStack justifyContent={"space-between"}>
                <VStack align={"start"}>
                  <Text
                    color="neutrals.gray.100"
                    fontWeight="semibold"
                    fontSize="sm"
                  >
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
                    {event.data.name}
                  </Heading>
                </VStack>
                <VStack align={"end"}>
                  <Link
                    href={event.data.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(ev) => ev.stopPropagation()}
                  >
                    <Button variant="primary" size="sm">
                      Visit event
                    </Button>
                  </Link>
                </VStack>
              </HStack>
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
              <Text my={2} color="neutrals.gray.200">
                {" "}
                {event?.data.description}
              </Text>

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
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
