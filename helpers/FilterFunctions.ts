import { Polybase } from "@polybase/client";
import { Language } from "../types/types";

const db = new Polybase({
  defaultNamespace: process.env.NEXT_PUBLIC_NAMESPACE,
});
export const FilterEvent = async (
  platform: string,
  isOnline: boolean,
  language: string,
  startDate: number
) => {
  try {
    const { data } = await db
      .collection("Event")
      .where("platform", "==", platform)
      .where("start_date_timestamp", ">", 1674076400)
      //.where("language", "==", "English")
      .get();
    return data;
  } catch (error) {
    return error;
  }
};
