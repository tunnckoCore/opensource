import { join } from 'path';
import { createJestRunner } from '@tunnckocore/create-jest-runner';

export default createJestRunner(join(__dirname, 'runner.js'));
