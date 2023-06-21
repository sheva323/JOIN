import { Polybase } from "@polybase/client";
import { Language } from "../types/types";

const db = new Polybase({
  defaultNamespace: process.env.NEXT_PUBLIC_NAMESPACE,
});
export const FilterEvent = async (
  twitterChecked: boolean,
  twitchChecked: boolean,
  youtubeChecked: boolean,
  isOnline: boolean,
  language: string,
  startDate: number
) => {
  try {
    
    const { data } = await db
      .collection("Event")
      .where("start_date_timestamp", ">", startDate)
      .get();

    const filteredResults = data.filter((item) => {
      return (
        ((twitterChecked && item.data.platform === "Twitter") ||
          (twitchChecked && item.data.platform === "Twitch") ||
          (youtubeChecked && item.data.platform === "Youtube")) &&
        item.data.is_online === isOnline &&
        item.data.language === language
      );
    });

    filteredResults.sort(
      (a, b) => a.data.start_date_timestamp - b.data.start_date_timestamp
    );

    return filteredResults;
  } catch (error) {
    throw new Error(`Error filtering events: ${error}`);
  }
};
