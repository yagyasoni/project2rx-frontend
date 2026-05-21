import { Filter } from "bad-words";

const filter = new Filter();

// Optional: add domain-specific words your team wants blocked
// filter.addWords("scam", "fraud");

export const containsProfanity = (text: string) => filter.isProfane(text);

// Returns a cleaned version with asterisks; useful if you'd rather soften
// than block outright
export const cleanProfanity = (text: string) => filter.clean(text);