import { join } from 'path';
import { createJestRunner } from '@tunnckocore/create-jest-runner';

var index = createJestRunner(join(__dirname, 'runner.js'));

export default index;
