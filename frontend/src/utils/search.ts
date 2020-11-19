import * as JsSearch from "js-search";
import { UserData } from "../types/users";

export function generateSearchUtil(
  searchIndex: string,
  indices: string[],
  users: UserData[],
) {
  const userSearch = new JsSearch.Search(searchIndex);
  indices.forEach((index) => userSearch.addIndex(index));
  userSearch.addDocuments(users);
  console.log(users);
  return userSearch;
}
