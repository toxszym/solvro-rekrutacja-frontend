const pluralRules = new Intl.PluralRules("pl");

type PluralForms = {
  one: string; // 1 koktajl
  few: string; // 2, 3, 4, 22... koktajle
  many: string; // 0, 5, 11, 25... koktajli
};

/** Polska odmiana po liczebniku, np. pluralize(5, { one: "koktajl", few: "koktajle", many: "koktajli" }). */
export function pluralize(count: number, forms: PluralForms) {
  const category = pluralRules.select(count);
  const word =
    category === "one" ? forms.one : category === "few" ? forms.few : forms.many;
  return `${count} ${word}`;
}
