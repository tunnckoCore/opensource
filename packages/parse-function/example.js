import { parse as acornParse } from 'acorn';
import { parseFunction } from './dist/module';

// `node` is an AST Node
function bobbyPlugin(node, result) {
  const bobby = 'bobby';

  return { ...result, bobby };
}

function barryPlugin(node, result) {
  return { ...result, barry: 'barry barry' };
}

const result = parseFunction(bobbyPlugin.toString(), {
  parse: acornParse,
  plugins: [bobbyPlugin, barryPlugin], // supports array of plugins
  parserOptions: {},
});

console.log(result);

/* {
  name: 'bobbyPlugin',
  body: "\n  const bobby = 'bobby';\n\n  return { ...result, bobby };\n",
  args: [ 'node', 'result' ],
  params: 'node, result',
  defaults: { node: undefined, result: undefined },
  value: '(function bobbyPlugin(node, result) {\n  const ' +
    "bobby = 'bobby';\n\n  return { ...result, bobby };\n" +
    '})',
  isValid: true,
  isArrow: false,
  isAsync: false,
  isNamed: true,
  isAnonymous: false,
  isGenerator: false,
  isExpression: false,
  bobby: 'bobby',
  barry: 'barry barry'
} */
