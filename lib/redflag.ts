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

export function isRedFlag(input: string): boolean {
  const normalized = input.toLowerCase();
  return RED_FLAG_PATTERNS.some((pattern) => normalized.includes(pattern));
}