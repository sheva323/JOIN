import { CollectionRecordResponse, Polybase } from "@polybase/client";
import { Auth } from "@polybase/auth";
import { Tag } from "../types/types";
import { nanoid } from "nanoid";

const auth = typeof window !== "undefined" ? new Auth() : null;
const db = new Polybase({
  defaultNamespace: process.env.NEXT_PUBLIC_NAMESPACE,
});
export enum Platform {
  Twitter = "Twitter",
  Twitch = "Twitch",
  Youtube = "Youtube",
  Discord = "Discord",
  Physical = "Physical",
}
db.signer(async (data) => {
  if (!auth) return null;
  return {
    h: "eth-personal-sign",
    sig: await auth.ethPersonalSign(data),
  };
});
//Fetch Data
export const FetchKeyCollection = async (
  collection: string,
  record: string
) => {
  try {
    const { data } = await db.collection(collection).record(record).get();
    const response = {
      data: data,
      error: null,
    };
    return response;
  } catch (error) {
    const response = {
      data: null,
      error: error,
    };
    return response;
  }
};
export const FetchCollection = async (collection: string) => {
  try {
    const { data } = await db
      .collection(collection)
      .sort("start_date_timestamp", "asc")
      .get();
    const response = {
      data: data,
      error: null,
    };
    return response;
  } catch (error) {
    const response = {
      data: null,
      error: error,
    };
    return response;
  }
};
//Filtering Data
export async function ShowAllEventsFromToday(startDate: number) {
  try {
    const { data } = await db
      .collection("Event")
      .where("start_date_timestamp", ">", startDate)
      .sort("start_date_timestamp", "asc")
      .get();
    return data;
  } catch (error) {
    throw new Error(`Error filtering events: ${error}`);
  }
}
export async function FilterEventsBetweenDates(
  startDate: number,
  endDate: number
) {
  try {
    const { data } = await db
      .collection("Event")
      .where("start_date_timestamp", ">", startDate)
      .where("start_date_timestamp", "<", endDate)
      .sort("start_date_timestamp", "asc")
      .get();
    return data;
  } catch (error) {
    throw new Error(`Error filtering events: ${error}`);
  }
}

//Tags
export const CreateTag = async (id: string, name: string) => {
  try {
  } catch (error) {}
};
export const ReadTagsFromEvent = async (eventId: string) => {
  try {
    const response = db
      .collection("EventTagRel")
      .where("event", "==", db.collection("Event").record(eventId))
      .get();
    return response;
  } catch (error) {
    throw new Error(`Error reading tags: ${error}`);
  }
};
export const FetchTagData = async (tagId: string) => {
  try {
    const { data } = await db.collection("Tag").record(tagId).get();
    return data.name;
  } catch (error) {
    throw new Error(`Error reading specific tag info: ${error}`);
  }
};
//Events
export const CreateEvent = async (
  id: string,
  calendar: string,
  name: string,
  desc: string,
  image: string,
  location: string,
  platform: string,
  url: string,
  is_online: boolean,
  dateStart: number,
  dateEnd: number,
  createDate: number,
  tags: Tag[]
) => {
  try {
    const createEvent = await db
      .collection("Event")
      .create([
        id,
        db.collection("Calendar").record(calendar),
        name,
        desc,
        image,
        location,
        platform,
        url,
        is_online,
        dateStart,
        dateEnd,
        [
          db.collection("Tag").record("dao"),
          db.collection("Tag").record("defi"),
        ],
        createDate,
      ]);
    const response = {
      data: createEvent,
      error: null,
    };
    return response;
  } catch (error) {
    console.log(error);
    const response = {
      data: null,
      error: error,
    };
    return response;
  }
};
export const AddTagOnEvent = async (record: string, tag: Tag) => {
  try {
    const write = await db
      .collection("Event")
      .record(record)
      .call("addTag", [db.collection("Tag").record("dao")]);

    console.log(write);
    return write;
  } catch (error) {
    console.log(error);
    return error;
  }
};
//Users
export const UserExists = async (address: string | undefined | null) => {
  try {
    if (address) {
      const response = db.collection("User").where("id", "==", address).get();
      return response;
    } else {
      throw new Error(`Error reading users`);
    }
  } catch (error) {
    throw new Error(`Error reading tags: ${error}`);
  }
};
export const CreateUser = async (
  id: string | undefined | null,
  pvkey: string | undefined | null
) => {
  try {
    if (id && pvkey) {
      const createUser = await db.collection("User").create([id, pvkey]);
      return createUser;
    } else {
      throw new Error("Error creating user");
    }
  } catch (error) {
    console.log(error);
  }
};

//Modify Event
export const EditEvent = async (eventId: string) => {
  try {
    const editEvent = await db
      .collection("Event")
      .record(eventId)
      .call("addTag", [db.collection("Tag").record("dao")]);
    return editEvent;
  } catch (error) {
    throw new Error(`Error editing event: ${error}`);
  }
};
//Calendar
export const CalendarExists = async (id: string | undefined | null) => {
  try {
    if (id) {
      const response = db.collection("Calendar").where("id", "==", id).get();
      return response;
    } else {
      throw new Error(`Error, Not valid id`);
    }
  } catch (error) {
    throw new Error(`Error reading tags: ${error}`);
  }
};
export const CreateCalendar = (
  id: string | null | undefined,
  name: string | null | undefined
) => {
  try {
    if (id && name) {
      const response = db.collection("Calendar").create([id, name]);
      return response;
    } else {
      throw new Error(`Error, Not valid id or name`);
    }
  } catch (error) {
    throw new Error(`Error reading tags: ${error}`);
  }
};
export const AddReminder = async (
  eventId: string,
  //dateReminder: number,
  timeStamps: number[],
  subscriber: string | null
) => {
  try {
    if (subscriber) {
      let resp: CollectionRecordResponse<any, any>[] = [];
      for (const timeStamp of timeStamps) {
        const response = await db
          .collection("ReminderEventSubscriber")
          .create([
            nanoid(),
            subscriber,
            db.collection("Event").record(eventId),
            timeStamp,
          ]);
        resp.push(response);
      }
      const schedule = await db
        .collection("ScheduledCalendarEvent")
        .create([
          nanoid(),
          db.collection("User").record(subscriber),
          db.collection("Event").record(eventId),
        ]);
      return resp;
    } else {
      throw new Error(`Error subscriber value`);
    }
  } catch (error) {
    throw new Error(`Error creating reminder: ${error}`);
  }
};
export const ReadEvents = async (address: string | null) => {
  try {
    if (address) {
      const { data } = await db
        .collection("ScheduledCalendarEvent")
        .where("user", "==", db.collection("User").record(address))
        .get();
      return data;
    }
  } catch (error) {
    throw new Error(`Error reading events: ${error}`);
  }
};
export const ReadEventInfo = async (id: string) => {
  try {
    const event = db.collection("Event").record(id).get();
    return event;
  } catch (error) {
    throw new Error(`Error reading event: ${error}`);
  }
};
