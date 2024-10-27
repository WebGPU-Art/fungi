let paramsString = location.search;
const searchParams = new URLSearchParams(paramsString);

export let getGridSize = () => {
  return Number.parseInt(searchParams.get("grid") || "0");
};

export let getSlowSize = () => {
  return Number.parseInt(searchParams.get("slow") || "1");
};

export let getAutoRule = () => {
  return searchParams.get("rule") || undefined;
};
export let getIndex = () => {
  return Number.parseInt(searchParams.get("index") || "0");
};
