import { Polybase } from "@polybase/client";
import { CollectionRecordResponse } from "@polybase/client/dist/Record";
const db = new Polybase({
  defaultNamespace: process.env.NEXT_PUBLIC_NAMESPACE,
});
export const returnTagNames = async (dataColl : CollectionRecordResponse<any, any>[]) => {
  try {
    const tags : string[] = [];
    for (const item of dataColl) {
      const { data } = await db.collection("Tag").record(item.data.tag.id).get();
      tags.push(data.name);
    }
    return tags;
  } catch (error) {
    throw new Error(`Error reading tags: ${error}`);
  }
}