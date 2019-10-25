import { parse as acornParse } from 'acorn';
import { parseFunction } from '.';

function fooFn(bar, baz = 123) {
  return bar + baz;
}

// `node` is an AST Node
function bobbyPlugin(node, result) {
  const bobby = 'bobby';

  return { ...result, bobby };
}

function barryPlugin(node, result) {
  const hasDefaultParams =
    Object.values(result.defaults).filter(Boolean).length > 0;

  return { ...result, barry: 'barry barry', hasDefaultParams };
}

const result = parseFunction(fooFn, {
  parse: acornParse,
  plugins: [bobbyPlugin, barryPlugin],
  parserOptions: {},
});

console.log(result);

/* {
  name: 'fooFn',
  body: '\n  return bar + baz;\n',
  args: [ 'bar', 'baz' ],
  params: 'bar, baz',
  defaults: { bar: undefined, baz: '123' },
  value: '(function fooFn(bar, baz = 123) {\n  return bar + baz;\n})',
  isValid: true,
  isArrow: false,
  isAsync: false,
  isNamed: true,
  isAnonymous: false,
  isGenerator: false,
  isExpression: false,
  bobby: 'bobby',
  barry: 'barry barry',
  hasDefaultParams: true
} */
