/** Dial codes offered in the phone selector. Brazil first (primary audience). */
export interface Country {
  iso: string;
  dial: string;
}

export const COUNTRIES: Country[] = [
  { iso: "BR", dial: "55" },
  { iso: "US", dial: "1" },
  { iso: "PT", dial: "351" },
  { iso: "AR", dial: "54" },
  { iso: "CL", dial: "56" },
  { iso: "CO", dial: "57" },
  { iso: "MX", dial: "52" },
  { iso: "PE", dial: "51" },
  { iso: "UY", dial: "598" },
  { iso: "PY", dial: "595" },
  { iso: "BO", dial: "591" },
  { iso: "EC", dial: "593" },
  { iso: "VE", dial: "58" },
  { iso: "CR", dial: "506" },
  { iso: "PA", dial: "507" },
  { iso: "DO", dial: "1" },
  { iso: "ES", dial: "34" },
  { iso: "GB", dial: "44" },
  { iso: "DE", dial: "49" },
  { iso: "FR", dial: "33" },
  { iso: "IT", dial: "39" },
  { iso: "CH", dial: "41" },
  { iso: "AE", dial: "971" },
  { iso: "CA", dial: "1" },
];
