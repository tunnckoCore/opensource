/* eslint-disable unicorn/no-empty-file */

// async function eslintLoading() {
//  const { default: rc } = await import('./x.eslintrc.cjs');

//  const allRulesConfs = {};

//  const linter = new Linter();
//  const filePath = path.join(process.cwd(), 'worker.js');
//  /*
//    rules: {
//      ruleId: ruleConf
//    }
//  */

//  const pluginRules = Object.keys(rc.rules).filter((ruleId) =>
//    ruleId.includes('/'),
//  );

//  await parallel(pluginRules, async ({ value: ruleId }) => {
//    const [pluginName, ...ruleName] = ruleId.split('/');

//    // scoped
//    const plugin = pluginName.startsWith('@')
//      ? `${pluginName}/eslint-plugin`
//      : `eslint-plugin-${pluginName}`;

//    const { default: pluginMod } = await import(plugin);

//    await linter.defineRule(ruleId, pluginMod.rules[ruleName.join('/')]);
//  });

//  const foo = null;

//  const text = await fs.readFile(filePath, 'utf8');

//  await serial(rc.extends, async ({ value: key }) => {
//    const isEslintBuiltin = key.startsWith('eslint:');
//    const isPluginRules = key.startsWith('plugin:');
//    const configId = key.replace('eslint:', '').replace('plugin:', '');

//    const [pluginNameCfg, ...presetName] = configId.split('/');

//    let preset = null;

//    if (isPluginRules) {
//      console.log('cfg from plugin');
//      const id = configId.startsWith('@')
//        ? `${pluginNameCfg}/eslint-plugin`
//        : `eslint-plugin-${pluginNameCfg}`;

//      const { default: pluginMod } = await import(id);

//      // Note: Currently it won't work if there is `extends` in the recommended cfg
//      // like in `@typescript-eslint/recommended` which loads local files
//      // Such cases just should adopt proper JS loading.
//      // airbnb is using require.resolve passed to `extends`

//      preset = pluginMod.configs[presetName.join('/')];
//    } else if (isEslintBuiltin) {
//      console.log('cfg from builtin');
//      const id = `eslint/conf/eslint-${configId}.js`;
//      preset = (await import(id)).default;
//    } else {
//      console.log('normal shareable cfg');
//      const id = `eslint-config-${pluginNameCfg}`;
//      preset = (await import(id)).default;

//      // Cuz bad loading principles,
//      // we ignore all the rest of the things except `rules`
//      // a temporary solution
//      if (pluginNameCfg.includes('airbnb')) {
//        await serial(preset.extends, async ({ value: filepath }) => {
//          const mod = (await import(filepath)).default;

//          Object.entries(mod.rules).map(([ruleId, ruleConf]) => {
//            allRulesConfs[ruleId] = ruleConf;
//          });
//        });
//        return;
//      }
//    }

//    // Note: Currently it won't work if there is `extends` in the recommended cfg
//    // like in `@typescript-eslint/recommended` which loads local files
//    // Such cases just should adopt proper JS loading.
//    // airbnb is using require.resolve passed to `extends`
//    Object.entries(preset.rules).map(([ruleId, ruleConf]) => {
//      allRulesConfs[ruleId] = ruleConf;
//    });
//  });

//  // console.log(allRulesConfs);
//  // things that linter.verify accepts
//  const config = {
//    env: rc.env,
//    settings: rc.settings,
//    reportUnusedDisableDirectives: true,
//    rules: { ...allRulesConfs, ...rc.rules },
//    parserOptions: rc.parserOptions,
//  };

//  // if (rc.parser) {
//  //  const parserMod = await import(rc.parser);
//  //  const parserParse = parserMod.parseForESLint || parserMod.parse;

//  //  linter.defineParser(rc.parser, {
//  //    parse: (code, options) => {
//  //      const opts = { ...options, ...rc.parserOptions };

//  //      return parserParse(code, opts);
//  //    },
//  //  });
//  // }
//  const { fixed, messages, output } = linter.verifyAndFix(text, config, {
//    fix: true,
//  });

//  const result = {
//    filePath,
//    messages,
//  };

//  console.log(result);

//  // if (fixed) {
//  //  result.output = output;
//  // }
// }
