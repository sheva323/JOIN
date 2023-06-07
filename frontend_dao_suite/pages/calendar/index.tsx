import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import styled from "@emotion/styled";
import EventModal from "../../components/modals/EventModal";
import { Polybase } from "@polybase/client";
import "dotenv/config";
import PageLayout from "../../layouts/PageLayout";
import CalendarHolder from "../../components/CalendarHolder";

const index = () => {
  const db = new Polybase({
    defaultNamespace: process.env.NEXT_PUBLIC_NAMESPACE,
  });
  useEffect(() => {
    readData();
  }, []);
  const readData = async () => {
    try {
      const { data } = await db.collection("Tag").record("dao").get();
      console.log("Tag id:", data.id);
      console.log("Tag name:", data.name);
    } catch (error) {
      console.log(error);
    }
  };

  const [modalEvent, setModalEvent] = useState(false);
  const onDateClick = (arg: any) => {
    console.log(arg);
    setModalEvent(true);
  };
  const closeModal = () => {
    setModalEvent(false);
  };

  return (
    <PageLayout title="Calendar" footer={true}>
      <CalendarHolder/>
    </PageLayout>
  );
};

export default index;

const Container = styled.div`
  width: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
`;