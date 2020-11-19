export function toTitleCase(str: string) {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0) + txt.substr(1).toLowerCase(),
  );
}
