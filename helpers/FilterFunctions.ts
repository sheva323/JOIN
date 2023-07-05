import { Polybase } from "@polybase/client";
import { Language } from "../types/types";

const db = new Polybase({
  defaultNamespace: process.env.NEXT_PUBLIC_NAMESPACE,
});
export const FilterEvent = async (
  platform: string,
  location: string,
  language: string,
  startDate: number
) => {
  try {
    let query = db.collection("Event");
    
    if(platform !== "None") {
      query = query.where("platform", "==", platform);
    }
    if(location !== "None"){
      query = query.where("location", "==", location);
    }
    if(language !== "All"){
      query = query.where("language", "==", language);
    }
    

    query = query.where("start_date_timestamp", ">", 1674076700);
    query = query.sort("start_date_timestamp", "asc");

    const { data } = await query.get();

    return data;


    // const { data } = await db
    //   .collection("Event")
    //   .where("platform", "==", platform)
    //   .where("start_date_timestamp", ">", 1674076400)
    //   //.where("language", "==", "English")
    //   .get();
    // return data;
  } catch (error) {
    return error;
  }
};
