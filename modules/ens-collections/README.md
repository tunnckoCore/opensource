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

# Collections (80, for now)

> You should add again (eventually) Chinese, Japanise, and Indian ones. It was
> complete mess and I don't see such characters or understand what the
> difference was.

- 0x10k Club
- 0x99 Club **(verified)**
- 0x999 Club
- 0xemojis
- 1-Hex Club **(verified)**
- 100k Club
- 10k Club **(verified)**
- 2-Hex Club **(verified)**
- 24 Clock Times
- 24h Club **(verified)**
- 3 Digit Palindromes **(verified)**
- 3-Hex Club **(verified)**
- 3 Letter All Vowels
- 3 Letter Dictionary
- 3 Letter First Names
- 3 Letter Months
- 3 Letter Palindromes **(verified)**
- 3 Letters **(verified)**
- 360 Degree Club
- 365 Club
- 4 Digit Palindromes **(verified)**
- 4 Letter Dictionary
- 5 Digit Palindromes **(verified)**
- 5 Letter Dictionary
- 6 Digit Palindromes
- 99 Temperature Club
- 999 Club **(verified)**
- Arabic 10k Club **(verified)**
- Arabic 3 Digit Palindromes
- Arabic 999 Club **(verified)**
- Binary Club
- Bip39 Club
- Braille 999 Club
- Capital Cities **(verified)**
- Countries **(verified)**
- Country Codes **(verified)**
- Country Leaders
- Double Triples Club
- English Adjectives
- English Nouns
- English Verbs
- Ens Date Club
- Ens Full Date Club
- Ethmoji 99 Club
- Ethmoji 999 Club
- Ethmoji Double Club
- Ethmoji Single Club
- Ethmoji Triple Club
- First Names Female
- First Names Male
- Flag Country Club
- Gen1 Pokemons
- GOT Houses Club
- Greek Alphabet
- Harry Potter Club
- Hindi 10k Club
- Hindi 999 Club
- Hyphens LL **(verified)**
- Hyphens LN NL **(verified)**
- Hyphens NN **(verified)**
- Hyphens NNN **(verified)**
- Jurassic ENS
- Languages Of The World
- Marvel Club
- MMDD Club **(verified)**
- Mnemonic Club
- Full Months
- Naruto Names
- Nasdaq Index Club
- NCAA College Abbrev
- Palindrome Cities **(verified)**
- Pokemon Trainer DAO Japanese **(verified)**
- Pokemon Trainer DAO **(verified)**
- Poker Club
- Pre Punk Club **(verified)**
- Psalms Club
- Roman Numerals Club
- Single Digit Multiply **(verified)**
- Substances Club
- The Cents Club 80
