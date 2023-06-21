import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  VStack,
  Checkbox,
  CheckboxGroup,
  Button,
  Box,
  Grid,
  Image,
  Stack,
  Flex,
  Text,
  Heading,
  ButtonGroup,
  useColorModeValue,
  GridItem,
  Badge,
} from "@chakra-ui/react";
import { Auth, AuthState } from "@polybase/auth";
import { PropsWithChildren, useContext, useEffect, useState } from "react";
import { CollectionRecordResponse } from "@polybase/client/dist/Record";
import {
  AddReminder,
  CreateUser,
  UserExists,
} from "../../helpers/PolybaseData";
import moment, { Moment } from "moment";
import { EventsContext } from "../../context/EventsContext";
import { GetDataFormatted } from "../../helpers/DateData";

export type CardDetailsProps = {
  onClose: () => void;
  onOpen: () => void;
  isOpen: boolean;
  event: CollectionRecordResponse<any, any>;
};
export default function ScheduleModal({
  onClose,
  onOpen,
  isOpen,
  event,
}: PropsWithChildren<CardDetailsProps>) {
  const auth = typeof window !== "undefined" ? new Auth() : null;
  const { setIsLogged, setRefresMyEvents, refresMyEvents } = useContext(EventsContext);
  const [cardImage, setCardImage] = useState("/standard/calendar.jpg");
  const [thirty, setThirty] = useState(true);
  const [fifteen, setFifteen] = useState(false);
  const [five, setFive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [createUser, setCreateUser] = useState(false);
  const [resultScreen, setResultScreen] = useState(false);
  const [results, setResults] = useState<CollectionRecordResponse<any, any>[]>(
    []
  );
  const [modalInfo, setModalInfo] = useState({
    bodyTxt: "",
    buttonTxt: "",
    login: false,
  });
  const [error, setError] = useState("");
  useEffect(() => {
    if (event?.data.image && event?.data.image !== "")
      setCardImage(`https://ipfs.io/ipfs/${event?.data.image}`);
    readUser();
  }, []);
  const handleImageError = () => {
    setCardImage("/nocover.png");
  };
  const onImageLoad = () => {
  };
  const onSetReminder = async () => {
    try {
      setLoading(true);
      const address = localStorage.getItem("address");
      let timeStamps: number[] = [];
      if (five) {
        const reminderDate = subtractMinutesFromUnixTime(
          event?.data.start_date_timestamp,
          5
        );
        timeStamps.push(reminderDate);
      }
      if (fifteen) {
        const reminderDate = subtractMinutesFromUnixTime(
          event?.data.start_date_timestamp,
          15
        );
        timeStamps.push(reminderDate);
      }
      if (thirty) {
        const reminderDate = subtractMinutesFromUnixTime(
          event?.data.start_date_timestamp,
          30
        );
        timeStamps.push(reminderDate);
      }
      if (timeStamps.length <= 0) {
        setErrorMsg("Please pick a reminder time");
      } else {
        
        const reminder = await AddReminder(event.data.id, timeStamps, address);
        setResults(reminder);
        setResultScreen(true);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  function subtractMinutesFromUnixTime(
    unixTime: number,
    minutes: number
  ): number {
    const newTime = moment.unix(unixTime).subtract(minutes, "minutes").unix();
    return newTime;
  }
  //user management
  const readUser = async () => {
    try {
      const address = localStorage.getItem("address");
      if (!address) {
        console.log("error");
        setModalInfo({
          ...modalInfo,
          bodyTxt: "Please login to schedule your event",
          buttonTxt: "Login",
        });
        setCreateUser(true);
      } else {
        const userExists = await UserExists(address);
        if (
          userExists &&
          userExists.data.length > 0 &&
          userExists.data[0].data.id === address
        ) {
          setLoading(false);
        } else {
          setModalInfo({
            ...modalInfo,
            bodyTxt:
              "Congrats! This is your first scheduled event, therefor we need to create an User for you",
            buttonTxt: "Create User With Your Wallet Address",
            login: true,
          });
          setCreateUser(true);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const createUserProfile = async () => {
    try {
      if (modalInfo.login) {
        const address = localStorage.getItem("address");
        const create = await CreateUser(address, address);
        if (create && create.data?.id === address) {
          setCreateUser(false);
          setLoading(false);
        }
      } else {
        const authState: AuthState | undefined | null = await auth?.signIn();
        const address: string | null | undefined = authState
          ? authState.userId
          : null;
        localStorage.setItem("address", address ? address : "null");
        setIsLogged(true);
        const userExists = await UserExists(address);
        if (
          userExists &&
          userExists.data.length > 0 &&
          userExists.data[0].data.id === address
        ) {
          setLoading(false);
          setCreateUser(false);
        } else {
          setModalInfo({
            ...modalInfo,
            bodyTxt:
              "Congrats! This is your first scheduled event, therefor we need to create an User for you",
            buttonTxt: "Create User With Your Wallet Address",
            login: true,
          });
          setCreateUser(true);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const onCloseModal = () => {
    setLoading(true);
    setCreateUser(false);
    setResultScreen(false);
    setRefresMyEvents(!refresMyEvents);
    onClose();
  };
  const setErrorMsg = (msg: string) => {
    setError(msg);
    setTimeout(() => {
      setError("");
    }, 4000);
  };
  return (
    <>
      <Box position="absolute" h="100vh" p={12}>
        <Modal isOpen={isOpen} onClose={onCloseModal} isCentered>
          <ModalOverlay />
          {resultScreen ? (
            <ModalContent bg="white" _dark={{bg: "neutrals.gray.400"}} >
              <ModalCloseButton />
              <ModalBody>
                <Grid mt="2" templateColumns="repeat(5, 1fr)">
                  <GridItem height={"full"} width="100%" colSpan={2}>
                    <VStack
                      border="1px"
                      borderColor={"neutrals.light.300"}
                      borderRadius="3xl"
                      p="4"
                    >
                      <Image
                        alt="Event Image"
                        src={cardImage}
                        maxH={120}
                        maxW={120}
                        width={120}
                        height={120}
                        onError={handleImageError}
                        onLoad={onImageLoad}
                      />
                      <Text
                        color="neutrals.gray.100"
                        fontWeight="semibold"
                        fontSize="sm"
                        textAlign={"center"}
                      >
                        {GetDataFormatted(event?.data.start_date_timestamp)}
                      </Text>
                      <Heading
                        size="md"
                        as="h3"
                        textAlign={"center"}
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
                  </GridItem>
                  <GridItem height={"full"} width="100%" colSpan={3} p={4}>
                    <Heading
                      as="h4"
                      fontWeight={"medium"}
                      fontSize="lg"
                      my={2}
                      color="neutrals.gray.200"
                    >
                      {" "}
                      Great, your reminders were created
                    </Heading>
                    {results.map((result) => {
                      return (
                        // eslint-disable-next-line react/jsx-key
                        <Badge ml="1" colorScheme="blue">
                          {GetDataFormatted(result.data.timestamp)}
                        </Badge>
                      );
                    })}
                  </GridItem>
                </Grid>
              </ModalBody>
              <ModalFooter pt="1">
                <ButtonGroup variant="outline" spacing="6">
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={onCloseModal}
                    isLoading={loading}
                    loadingText="Close ..."
                  >
                    Close
                  </Button>
                </ButtonGroup>
              </ModalFooter>
            </ModalContent>
          ) : (
            <ModalContent  bg="white" _dark={{bg: "neutrals.gray.400"}}>
              <ModalCloseButton />
              <ModalBody>
                {createUser ? (
                  <GridItem height={"full"} width="80%" colSpan={3} p={4}>
                    <Text
                      as="h4"
                      fontWeight={"medium"}
                      fontSize="lg"
                      my={2}
                      color="neutrals.gray.200"
                    >
                      {modalInfo.bodyTxt}
                    </Text>
                    <Button
                      variant="primary"
                      colorScheme="blue"
                      size="md"
                      style={{ margin: 30 }}
                      onClick={createUserProfile}
                    >
                      {modalInfo.buttonTxt}
                    </Button>
                  </GridItem>
                ) : (
                  <Grid mt="2" templateColumns="repeat(5, 1fr)">
                    <GridItem height={"full"} width="100%" colSpan={2}>
                      <VStack
                        border="1px"
                        borderColor={"neutrals.light.300"}
                        borderRadius="3xl"
                        p="4"
                      >
                        <Image
                          alt="Event Image"
                          src={cardImage}
                          maxH={120}
                          maxW={120}
                          width={120}
                          height={120}
                          onError={handleImageError}
                          onLoad={onImageLoad}
                        />
                        <Text
                          color="neutrals.gray.100"
                          fontWeight="semibold"
                          fontSize="sm"
                          textAlign={"center"}
                        >
                          {GetDataFormatted(event?.data.start_date_timestamp)}
                        </Text>
                        <Heading
                          size="md"
                          as="h3"
                          textAlign={"center"}
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
                    </GridItem>
                    <GridItem height={"full"} width="100%" colSpan={3} p={4}>
                      <Heading
                        as="h4"
                        fontWeight={"medium"}
                        fontSize="lg"
                        my={2}
                        color="neutrals.gray.200"
                      >
                        {" "}
                        When would you like to receive the reminder?
                      </Heading>
                      <Flex>
                        <CheckboxGroup
                          colorScheme="whiteAlpha"
                          defaultValue={["naruto", "kakashi"]}
                        >
                          <Stack spacing={[3]} direction={["column"]} mt={2}>
                            <Checkbox
                              variant="circular"
                              color="neutrals.gray.200"
                              isChecked={thirty}
                              onChange={() => setThirty(!thirty)}
                            >
                              30 minutes before
                            </Checkbox>
                            <Checkbox
                              variant="circular"
                              color="neutrals.gray.200"
                              isChecked={fifteen}
                              onChange={() => setFifteen(!fifteen)}
                            >
                              15 minutes before
                            </Checkbox>
                            <Checkbox
                              variant="circular"
                              color="neutrals.gray.200"
                              isChecked={five}
                              onChange={() => setFive(!five)}
                            >
                              5 minutes before
                            </Checkbox>
                            {error !== "" && (
                              <Text style={{ color: "red" }}>
                                Please pick a reminder option
                              </Text>
                            )}
                          </Stack>
                        </CheckboxGroup>
                      </Flex>
                    </GridItem>
                  </Grid>
                )}
              </ModalBody>
              <ModalFooter pt="1">
                <ButtonGroup variant="outline" spacing="6">
                  <Button size="sm" onClick={onCloseModal}>
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={onSetReminder}
                    isLoading={loading}
                    loadingText="Checkin User ..."
                  >
                    Save
                  </Button>
                </ButtonGroup>
              </ModalFooter>
            </ModalContent>
          )}
        </Modal>
      </Box>
    </>
  );
}
