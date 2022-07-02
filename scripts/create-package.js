import fs from 'node:fs';
import path from 'node:path';
import semver from 'semver';
// eslint-disable-next-line import/no-unresolved
import * as enquirer from 'enquirer';

const { prompt } = enquirer;
const answers = {
	license: 'MPL-2.0',
	licenseStart: new Date().getFullYear(),
	keywords: ['hela', 'development', 'developer experience', 'dx'],
};

function onSubmit(key, value) {
	if (key === 'keywords') {
		const kws = typeof value === 'string' ? value.split(',') : [];
		let val = answers.keywords;

		if (kws.length > 0) {
			val = [kws]
				.flat()
				.filter(Boolean)
				.map((x) => x.trim());
		}

		answers.keywords = val;

		return val;
	}

	if (key === 'name') {
		answers.name = String(value).toLowerCase();
		answers.name = answers.name.replace('@tck', '@tunnckocore');

		return value;
	}

	answers[key] = value;
	return value;
}

await commandAction();

async function commandAction() {
	// console.log(args);
	await prompt([
		{
			message: 'Name of the package?',
			type: 'input',
			name: 'name',
			onSubmit,
		},
		{
			message: 'Description of the package?',
			type: 'input',
			name: 'description',
			initial: 'WIP: some description',
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
			message: 'Project or package?',
			type: 'select',
			name: 'typeof',
			choices: ['projects', 'packages'],
			onSubmit,
			result(value) {
				answers.typeof = value;
			},
		},

		{
			message: 'Destination location',
			type: 'input',
			name: 'location',
			initial() {
				if (answers.name.startsWith('@')) {
					const [scope, name] = answers.name.split('/');

					if (answers.typeof === 'projects') {
						return path.join('projects', scope.slice(1), name);
					}

					return path.join(
						'packages',
						scope === '@tck' ? '@tunnckocore' : scope,
						name,
					);
				}

				return path.join(answers.typeof, answers.name);
			},
			onSubmit,
			// validate(value, state, item) {
			//   const exists = fs.statSync(path.resolve(value));
			//   if (exists) {
			//     return prompt.styles.danger("location already exists");
			//   }
			//   const dir = value.includes(item.name)
			//     ? value.replace(item.name, "")
			//     : value;

			//   answers.location = path.join(dir, item.name);
			//   return true;
			// },
		},
		// {
		//   message: "Is it scoped?",
		//   type: "toggle",
		//   name: "scoped",
		//   enabled: "Yes",
		//   disabled: "No",
		//   onSubmit,
		//   // result(value) {
		//   //   answers.scopedOf = value;
		//   // },
		// },
		// {
		//   message: "Project or package?",
		//   type: "select",
		//   name: "typeof",
		//   choices: ["projects", "packages"],
		//   onSubmit,
		//   result(value) {
		//     answers.typeof = value;
		//   },
		// },

		// {
		//   message: "What is the scope?",
		//   type: "autocomplete",
		//   name: "scope",
		//   choices: ["@tunnckocore", "@hela"],
		//   onSubmit,
		//   skip() {
		//     if (!answers.scoped) {
		//       answers.location = `@packages/${answers.name}`;
		//       return true;
		//     }

		//     return false;
		//   },
		//   result(value) {
		//     if (answers.scoped) {
		//       if (/config|preset/.test(answers.name)) {
		//         answers.location = `@configs/${answers.name}`;
		//       } else {
		//         answers.location = `${value}/${answers.name}`;
		//       }
		//       answers.name = `${value}/${answers.name}`;
		//       answers.scope = value;
		//     }
		//   },
		// },
		// {
		//   type: "select",
		//   name: "publishType",
		//   message: "What type of publishing?",
		//   choices: ["build", "bundle", "source"],
		//   initial: 0,
		//   onSubmit,
		//   result(value) {
		//     answers.publishType = value;
		//   },
		// },
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
			initial: 4,
			choices: [
				'Parity-7.0.0',
				'(Parity-7.0.0 AND Prosperity-3.0.0) OR Patron-1.0.0',
				'Prosperity-3.0.0',
				'MPL-2.0',
				'Apache-2.0',
			],
		},
		{
			type: 'list',
			name: 'keywords',
			initial: answers.keywords,
			message: 'Type comma-separated keywords',
			onSubmit,
		},
		// ...[].concat(require(settings.questions)(answers)),
	]);

	const pkg = createPkgJson();
	const monoRoot = path.dirname(path.dirname(import.meta.url.slice(7)));

	const srcDir = path.join(monoRoot, answers.location, 'src');
	const testDir = path.join(monoRoot, answers.location, 'test');

	fs.mkdirSync(srcDir, { recursive: true });
	fs.mkdirSync(testDir, { recursive: true });

	const pkgFile = JSON.stringify(pkg, null, 2);
	const srcFile = `// SPDX-License-Identifier: ${answers.license}

  export default () => {};\n`;

	const testFile = `// SPDX-License-Identifier: ${answers.license}

  import mod from '../src/index.js';

  test('todo tests for ${answers.name} package', async () => {
    expect(typeof mod).toStrictEqual('function');
  });
  `;

	fs.writeFileSync(path.join(srcDir, 'index.js'), srcFile);
	fs.writeFileSync(path.join(testDir, 'index.js'), testFile);

	const pkgPath = path.join(monoRoot, answers.location, 'package.json');
	fs.writeFileSync(pkgPath, pkgFile);
}

function createPkgJson() {
	return {
		name: answers.name,
		version: answers.version,
		description: answers.description,
		license: answers.license,
		licenseStart: Number.parseInt(answers.licenseStart, 10),
		type: 'module',
		main: 'src/index.js',
		files: ['src'],
		publishConfig: {
			registry: 'https://registry.npmjs.org',
			access: 'public',
			tag: 'latest',
		},
		author: 'Charlike Mike Reagent <opensource@tunnckocore.com>',
		contributors: ['Charlike Mike Reagent <opensource@tunnckocore.com>'],
		engines: {
			node: '>=14 <15 || >=16 <17 || >=18',
		},
		repository: {
			type: 'git',
			url: 'https://github.com/tunnckoCore/opensource.git',
			directory: answers.location,
		},
		funding: [
			'https://ko-fi.com/tunnckoCore/commissions',
			'https://github.com/sponsors/tunnckoCore',
		],
		keywords: answers.keywords,
		scripts: {},
		jest: {
			coverageThreshold: {
				'src/**/*.js': {
					statements: 100,
					branches: 100,
					functions: 100,
					lines: 100,
				},
			},
		},
	};
}
