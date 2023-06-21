import { useContext, useEffect, useState } from 'react';
import {
  Container,
  Stack,
  useDisclosure,
} from '@chakra-ui/react';
import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import interactionPlugin from "@fullcalendar/interaction";
import { ReadEventInfo, ReadEvents } from '../helpers/PolybaseData';
import { CollectionRecordResponse } from '@polybase/client/dist/Record';
import moment from 'moment';
import { EventClickArg, EventSourceInput } from '@fullcalendar/core';
import CardCalendarDetails from './modals/CardCalendarDetails';
import { EventDef } from '@fullcalendar/core/internal';
import { EventsContext } from '../context/EventsContext';


export default function CalendarHolder() {
  const { refresMyEvents } = useContext(EventsContext);
  useEffect(() => {
    readEvents();
  }, [refresMyEvents]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [events, setEvents] = useState<EventSourceInput>([]);
  const [modalEvent, setModalEvent] = useState(false);
  const [eventDetail, setEventDetail] = useState<EventDef>();
  const closeModal = () => {
    setModalEvent(false);
  };
  const readEvents = async () => {
    try {
      const address = localStorage.getItem("address");
      const events = await ReadEvents(address);
      formatEvents(events);
    } catch (error) {
      console.log(error);
    }
  }
  const formatEvents = async (events : CollectionRecordResponse<any, any>[] | undefined) => {
    try {
      if(events){
        let eventsList : EventSourceInput = [];
        let counter: number = 0;
        for (const ans of events) {
          const ev = await ReadEventInfo(ans.data.event.id);
          const event = {
            title: ev.data.name,
            start: moment.unix(ev.data.start_date_timestamp).format("YYYY-MM-DD"),
            end: moment.unix(ev.data.end_date_timestamp).format("YYYY-MM-DD"),
            url: ev.data.url,
            backgroundColor: EventColors[counter].backgroundColor,
            borderColor: EventColors[counter].borderColor,
            textColor: EventColors[counter].textColor,
            imageUrl: ev.data.image,
            start_date_timestamp: ev.data.start_date_timestamp,
            platform: ev.data.platform,
            is_online: ev.data.is_online,
            location: ev.data.location,
            description: ev.data.description,
          };
          eventsList.push(event);
          counter++;
          if(counter > EventColors.length-1) counter = 0;
        }
        setEvents(eventsList);
      }
    } catch (error) {
      console.log(error);
    }
  }
  const onEventClick = (ev : EventClickArg) => {
    ev.jsEvent.preventDefault();
    const event = ev.event._def;
    setEventDetail(event);
    onOpen();
  }
  return (
    <>
      <Container maxW={"5xl"}>
        <Stack
          textAlign={"center"}
          align={"center"}
          spacing={{ base: 8, md: 10 }}
          p={{ base: 6, md: 8 }}
          bg="white"
          borderRadius={"3xl"}
        >
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            eventClick={(ev) => onEventClick(ev)}
            slotDuration="01:00:00"
            // slotMaxTime="12:00:00"
            dayHeaderFormat={{ weekday: "short", day: "numeric" }}
            eventBackgroundColor="#5155DA"
            height={"auto"}
            headerToolbar={{
              start: "title",
              center: "",
              end: "dayGridMonth today prev,next",
            }}
          />
        </Stack>
        {isOpen && (
        <CardCalendarDetails 
          isOpen={isOpen} 
          onClose={onClose} 
          onOpen={onOpen} 
          event={eventDetail}
        />
        )}
      </Container>
    </>
  );
}

const EventColors = [
  {
    backgroundColor: "#e6f4d6",
    borderColor: "#e6f4d6",
    textColor: "#7A7A86",
  },
  {
    backgroundColor: "#e0ebff",
    borderColor: "#e0ebff",
    textColor: "#7A7A86",
  },
  {
    backgroundColor: "#fef0c8",
    borderColor: "#fef0c8",
    textColor: "#7A7A86",
  },
];


// [
//   { title: " 🪢 ETHGLobal SF", start: "2023-06-04", end:"2023-06-08", url: "http://www.google.com", backgroundColor: '#e6f4d6', borderColor:"#e6f4d6", textColor:'#7A7A86' },
//   { title: " 🪢 ETHGLobal SF", start: "2023-06-12", end:"2023-06-18", url: "http://www.google.com", backgroundColor: '#e0ebff', borderColor:"#e0ebff", textColor:'#7A7A86' },
//   { title: " 🪢 ETHGLobal SF", start: "2023-06-25", end:"2023-06-28", url: "http://www.google.com", backgroundColor: '#fef0c8', borderColor:"#fef0c8", textColor:'#7A7A86' },
//   { title: "🦄 Polkadot", date: "2023-06-06", duration: '06:00', allDay: false, displayEventEnd: true },
//   { title: 'my event', start: "2023-06-03",duration: '06:00', allDay: false, displayEventEnd: true, backgroundColor: '#f6f6f6', borderColor:"#f6f6f6",   googleCalendarId: 'abcd1234@group.calendar.google.com',}
// ]