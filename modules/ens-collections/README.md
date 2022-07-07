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
