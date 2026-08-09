const RED_FLAG_PATTERNS: readonly string[] = [
  // chest pain / heart
  "chest pain",
  "nyeri dada",
  "sakit dada",
  "dada terasa berat",
  "dada sakit",
  // breathing
  "shortness of breath",
  "sesak napas",
  "sesak nafas",
  "susah bernapas",
  "sulit bernapas",
  "sulit nafas",
  "tersengal",
  // fainting / consciousness
  "pingsan",
  "fainting",
  "kehilangan kesadaran",
  "hampir pingsan",
  // paralysis / numbness
  "paralysis",
  "lumpuh",
  "lemah sebelah",
  "mati rasa",
  // speech / face
  "slurred speech",
  "bicara pelo",
  "sulit bicara",
  // bleeding / stool
  "muntah darah",
  "vomiting blood",
  "berak hitam",
  "bloody stool",
  "kencing darah",
  // seizures
  "kejang",
  "seizure",
  // severe headache
  "sakit kepala hebat",
  "severe headache",
];

/**
 * Word-order tolerant patterns: "dada aku sakit", "dada sebelah kiri
 * terasa sakit", "nyeri di dada" — the user rarely types the exact
 * phrase. These catch chest-pain mentions with 0-4 words between the
 * body part and the complaint word, in both orders.
 */
const RED_FLAG_REGEX: readonly RegExp[] = [
  /\bdada(?:\s+\w+){0,4}\s+sakit\b/,
  /\bsakit(?:\s+\w+){0,4}\s+dada\b/,
  /\bdada(?:\s+\w+){0,4}\s+nyeri\b/,
  /\bnyeri(?:\s+\w+){0,4}\s+dada\b/,
];

export function isRedFlag(input: string): boolean {
  const normalized = input.toLowerCase();
  return (
    RED_FLAG_PATTERNS.some((pattern) => normalized.includes(pattern)) ||
    RED_FLAG_REGEX.some((regex) => regex.test(normalized))
  );
}