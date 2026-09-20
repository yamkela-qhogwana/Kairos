import worldCountries from 'world-countries';

export type Country = {
  code: string;
  name: string;
  flag: string;
  dialCode: string;
};

export const COUNTRIES: Country[] = worldCountries
  .filter((c) => c.idd?.root)
  .map((c) => ({
    code: c.cca2,
    name: c.name.common,
    flag: c.flag,
    dialCode: c.idd.root + (c.idd.suffixes?.[0] ?? ''),
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

export const DEFAULT_COUNTRY: Country =
  COUNTRIES.find((c) => c.code === 'ZA') ?? COUNTRIES[0];
