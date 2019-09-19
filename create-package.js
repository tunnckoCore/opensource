const fs = require('fs');
const path = require('path');
const semver = require('semver');
const { prompt } = require('enquirer');

const answers = {
  license: 'MPL-2.0',
  licenseStart: new Date().getFullYear(),
  keywords: [
    'tunnckocorehq',
    'tunnckocore-oss',
    'hela',
    'development',
    'developer-experience',
    'dx',
  ],
};

function onSubmit(name, value) {
  if (name === 'keywords') {
    const val = answers.keywords.concat(value.split(',')).filter(Boolean);
    answers[name] = val;

    return val;
  }
  answers[name] = value;
  return value;
}

async function main() {
  await prompt([
    {
      message: 'Name of the package?',
      type: 'input',
      name: 'name',
      onSubmit,
    },
    {
      message: 'Package version',
      type: 'input',
      initial: '0.1.0',
      name: 'version',
      validate(value, state, item) {
        if (item && item.name === 'version' && !semver.valid(value)) {
          return prompt.styles.danger('version should be a valid semver value');
        }
        return true;
      },
      onSubmit,
    },
    {
      message: 'Is it scoped?',
      type: 'toggle',
      name: 'scoped',
      enabled: 'Yes',
      disabled: 'No',
      onSubmit,
    },
    {
      message: 'What is the scope?',
      type: 'select',
      name: 'scope',
      choices: ['@tunnckocore', '@hela'],
      onSubmit,
      skip() {
        if (!answers.scoped) {
          answers.location = `packages/${answers.name}`;
          return true;
        }

        return false;
      },
      result(value) {
        if (answers.scoped) {
          answers.location = `${value}/${answers.name}`;
          answers.name = answers.location;
          answers.scope = value;
        }
      },
    },
    {
      type: 'input',
      name: 'licenseStart',
      message: 'When the package is first published?',
      initial: answers.licenseStart,
      onSubmit,
    },
    {
      type: 'autocomplete',
      name: 'license',
      message: 'What is the license of the package?',
      initial: 2,
      choices: ['Parity-6.0.0', 'Prosperity-2.0.0', 'MPL-2.0', 'Apache-2.0'],
    },
    {
      type: 'list',
      name: 'keywords',
      initial: answers.keywords,
      message: 'Type comma-separated keywords',
      onSubmit,
    },
  ]);

  const pkg = {
    version: answers.version,
    name: answers.name,
    description: answers.description,
    author: 'Charlike Mike Reagent <opensource@tunnckocore.com>',
    homepage: 'https://github.com/tunnckoCore/opensource',
    license: answers.license,
    licenseStart: parseInt(answers.licenseStart, 10),
    main: 'dist/main/index.js',
    module: 'dist/module/index.js',
    types: 'dist/types/index.d.ts',
    scripts: {},
    engines: {
      node: '>=8.11',
    },
    repository: {
      type: 'git',
      url: 'git@github.com:tunnckoCore/opensource.git',
      directory: answers.location,
    },
    publishConfig: {
      access: 'public',
      tag: 'latest',
    },
    files: ['dist'],
    keywords: answers.keywords,
  };

  const srcDir = path.join(__dirname, answers.location, 'src');
  const testDir = path.join(__dirname, answers.location, 'test');

  fs.mkdirSync(srcDir, { recursive: true });
  fs.mkdirSync(testDir, { recursive: true });

  const pkgFile = JSON.stringify(pkg, null, 2);
  const srcFile = `export default () => {};\n`;
  const testFile = `import mod from '../src';

test('make tests for ${answers.name} package', async () => {
  expect(typeof mod).toStrictEqual('function');
  mod();
});
`;

  fs.writeFileSync(path.join(srcDir, 'index.js'), srcFile);
  fs.writeFileSync(path.join(testDir, 'index.js'), testFile);

  const pkgPath = path.join(__dirname, answers.location, 'package.json');
  fs.writeFileSync(pkgPath, pkgFile);
}
main();

// const res = new Toggle({
//   message: 'Want to answer?',
//   enabled: 'Yep',
//   disabled: 'Nope',
// });

// res
//   .run()
//   .then((answer) => console.log('Answer:', answer))
//   .catch(console.error);

// const prompt = new Snippet({
//   name: 'username',
//   message: 'Fill out the fields in package.json',
//   required: true,
//   fields: [
//     {
//       name: 'version',
//       validate(value, state, item) {
//         if (item && item.name === 'version' && !semver.valid(value)) {
//           return prompt.styles.danger('version should be a valid semver value');
//         }
//         return true;
//       },
//     },
//   ],
//   template: `{
//   "version": "{{version:0.1.0}}",
//   "name": "{{name}}",
//   "description": "{{description}}",
//   "author": "Charlike Mike Reagent <opensource@tunnckocore.com>",
//   "homepage": "https://github.com/tunnckoCore/opensource",
//   "license": "{{license:MPL-2.0}}",
//   "licenseStart": {{licenseStart}},
//   "main": "dist/main/index.js",
//   "module": "dist/module/index.js",
//   "types": "dist/types/index.d.ts",
//   "scripts": {},
//   "engines": {
//     "node": ">=8.11"
//   },
//   "repository": {
//     "type": "git",
//     "url": "git@github.com:tunnckoCore/opensource.git",
//     "directory": "{{name}}"
//   },
//   "publishConfig": {
//     "access": "public",
//     "tag": "latest"
//   },
//   "files": [
//     "dist"
//   ],
//   "keywords": [
//     "tunnckocorehq",
//     "tunnckocore-oss",
//     "opensource",
//     "develop",
//     "hela"
//   ]
// }
// `,
// });

// prompt
//   .run()
//   .then((answer) => console.log('Answer:', typeof answer.result))
//   .catch(console.error);
