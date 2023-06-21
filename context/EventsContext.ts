import { createContext } from "react";
import { EventResponse } from "../types/types";

export const EventsContext = createContext<EventResponse["data"]>([]);