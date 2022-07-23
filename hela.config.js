import tckPreset from '@hela/preset-tunnckocore';
import * as ensPreset from '@hela/preset-ens';

export default async () => {
	const tck = await tckPreset();
	// const tck = {};

	return { ...tck, ...ensPreset };
};
