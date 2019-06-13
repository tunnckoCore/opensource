import * as config from '@tunnckocore/scripts-config';

export const build = config.build; // eslint-disable-line prefer-destructuring

/** DO NOT EDIT ABOVE */

export const preFoo = 'echo "before Foo script"';
export const Foo = 'echo "the Foo woohoo!"';
export const postFoo = 'echo "after Foo task"';

export const preeslint = 'echo "Starts to lint"';
export const eslint = 'eslint . --format codeframe';

// ! Not called if `eslint` task fails
export const posteslint = 'echo "Done linting!"';

// Super composable, flexible and crazy, huh?!
export const eslintFix = [`${eslint} --fix --quiet`, posteslint];

export const tryme = 'echo "will override pkg.scripts.tryme"';

// try `npm start buildExample` haha
export const buildExample = 'yarn scripts pika-pack build --emoji --cwd $PWD';

export const presimple = 'echo "simple script starts"';
export const simple = () => 'echo simple-yea';

export const barry = 'echo "script without hooks"';

const some1 = 'echo some1';
const some2 = () => 'echo "some2"';

// ? `args` is suitable to be passed to argv parser
// ? may not be optimal and good idea currently
// ? for more crazy stuff check out `hela`  package - pretty similar, but older
export const advanced = (scripts, args) => {
  console.log('scripts obj:', scripts);
  console.log('cli process.argv.slice(2) args:', args);

  // ? Notice that we put `scripts.simple` here,
  // ? but in the output we don't see the result of `presimple` hook!
  return ['echo "advanced script starting"', scripts.simple, some2, some1];
};

export const basicPrettier = 'prettier "src/*.js" --write';

export const postadvanced = ['echo "advanced is done"', basicPrettier];

// ? also try running some not existing command or binary
// ? e.g. `yarn scripts foo-bar-baz23k1j2h3`
