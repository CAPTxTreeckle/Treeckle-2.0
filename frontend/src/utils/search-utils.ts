import * as JsSearch from "js-search";

export function generateSearchEngine(
  searchIndex: string | string[],
  searchKeys: string[] | string[][],
  documents: Object[],
) {
  const searchEngine = new JsSearch.Search(searchIndex);
  searchEngine.indexStrategy = new JsSearch.AllSubstringsIndexStrategy();
  searchEngine.searchIndex = new JsSearch.UnorderedSearchIndex();

  searchKeys.forEach((key: string | string[]) => searchEngine.addIndex(key));

  searchEngine.addDocuments(documents);

  return searchEngine;
}
