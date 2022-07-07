# ens-collections

> A standardized list of all ENS (Ethereum Name Service) based collections, used
> by https://ens.vision

The structure

```ts
type Project = {
	info: {
		name: string;
		description: string;
		slug?: string;
		supply: number; // auto-calculated
		links: string[]; // websites, and etc
		community: string[]; // just social media
		logo: string; // url preferably; if not given we generate one from the symbol/slug
	};
	data: {
		[label: string]: string; // label: tokenId
	};
};
```

# Collections

- 0x99 Club **(verified)**
- 0x999 Club
- 1 Hex Club **(verified)**
- 0xemojis
- 2 Hex Club **(verified)**
- 24 Clock Times
- 24h Club **(verified)**
- 3 Digit Palindromes **(verified)**
- 3 Letter All Vowels
- 3 Letter Dictionary
- 3 Letter First Names
- 3 Letter Months
- 3 Letter Palindromes **(verified)**
- 3 Hex Club **(verified)**
- 360 Degree Club
- 365 Club
- 4 Digit Palindromes **(verified)**
- 5 Digit Palindromes **(verified)**
- 4 Letter Dictionary
- 6 Digit Palindromes
- 99 Temperature Club
- 999 Club **(verified)**
- Arabic 3 Digit Palindromes
- Arabic 999 Club **(verified)**
- Binary Club
- Capital Cities **(verified)**
- Countries **(verified)**
- Country Codes **(verified)**
- Country Leaders
- Braille 999 Club
- Double Triples Club
- Double Ethmoji
- Bip39 Club
- English Adjectives
- Ens Date Club
- Ens Full Date Club
- Ethmoji 99 Club
- Ethmoji 999 Club
- undefined
- Ethmoji Single Club
- undefined
- Ethmoji Triple Club
- undefined
- First Names Female
- Gen1 Pokemon
- Flagcountry Club
- Greek Alphabet
- First Names Male
- Harry Potter Club
- Got Houses Club
- Hyphens Ll **(verified)**
- Hyphens Ln Nl **(verified)**
- Hyphens Nn **(verified)**
- Hindi 999 Club
- Hyphens Nnn **(verified)**
- Languages Of The World
- Marvel Club
- Mmdd Club **(verified)**
- Jurassic Ens
- Months
- Mnemonic Club
- English Nouns
- Ncaa College Abbrev
- Palindrome Cities **(verified)**
- Nasdaq Index Club
- Pokemon Trainer Dao **(verified)**
- Poker Club
- Pokemon Trainer Dao Japanese **(verified)**
- Psalms Club
- Single Digit Multiply **(verified)**
- Substances Club
- The Cents Club
- Roman Numerals Club
- Naruto Names
- 0x10k Club
- 10k Club **(verified)**
- Arabic 10k Club **(verified)**
- 5 Letter Dictionary
- English Verbs
- Hindi 10k Club
- 3 Letters **(verified)**
- Pre Punk Club **(verified)**
- 100k Club
