'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var config = require('@tunnckocore/scripts-config');

const build = config.build; // eslint-disable-line prefer-destructuring

/** DO NOT EDIT ABOVE */

const preFoo = 'echo "before Foo script"';
const Foo = 'echo "the Foo woohoo!"';
const postFoo = 'echo "after Foo task"';
const preeslint = 'echo "Starts to lint"';
const eslint = 'eslint . --format codeframe'; // ! Not called if `eslint` task fails

const posteslint = 'echo "Done linting!"'; // Super composable, flexible and crazy, huh?!

const eslintFix = [`${eslint} --fix --quiet`, posteslint];
const tryme = 'echo "will override pkg.scripts.tryme"'; // try `npm start buildExample` haha

const buildExample = 'yarn scripts pika-pack build --emoji --cwd $PWD';
const presimple = 'echo "simple script starts"';
const simple = () => 'echo simple-yea';
const barry = 'echo "script without hooks"';
const some1 = 'echo some1';

const some2 = () => 'echo "some2"'; // ? `args` is suitable to be passed to argv parser
// ? may not be optimal and good idea currently
// ? for more crazy stuff check out `hela`  package - pretty similar, but older


const advanced = (scripts, args) => {
  console.log('scripts obj:', scripts);
  console.log('cli process.argv.slice(2) args:', args); // ? Notice that we put `scripts.simple` here,
  // ? but in the output we don't see the result of `presimple` hook!

  return ['echo "advanced script starting"', scripts.simple, some2, some1];
};
const basicPrettier = 'prettier "src/*.js" --write';
const postadvanced = ['echo "advanced is done"', basicPrettier]; // ? also try running some not existing command or binary
// ? e.g. `yarn scripts foo-bar-baz23k1j2h3`

exports.Foo = Foo;
exports.advanced = advanced;
exports.barry = barry;
exports.basicPrettier = basicPrettier;
exports.build = build;
exports.buildExample = buildExample;
exports.eslint = eslint;
exports.eslintFix = eslintFix;
exports.postFoo = postFoo;
exports.postadvanced = postadvanced;
exports.posteslint = posteslint;
exports.preFoo = preFoo;
exports.preeslint = preeslint;
exports.presimple = presimple;
exports.simple = simple;
exports.tryme = tryme;
