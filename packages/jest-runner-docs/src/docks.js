'use strict';

const fs = require('fs');
const path = require('path');
const Comments = require('parse-comments');

const parser = new Comments();

module.exports = function docks(filepath, pkgRoot) {
  const relativePath = path.relative(pkgRoot, filepath);

  const comments = parser.parse(fs.readFileSync(filepath, 'utf8'));
  const contents = comments
    .filter((cmt) =>
      cmt.tags.find(
        (x) =>
          (x.title === 'api' && x.name === 'public') || x.title === 'public',
      ),
    )
    .reduce((acc, comment) => {
      const locUrl = `${relativePath}#L${comment.code.loc.start.line}`;

      const tagName = comment.tags.find((tag) => tag.title === 'name');
      const tags = tagName
        ? comment.tags.filter((x) => x.title !== 'name')
        : comment.tags;

      const name = (tagName && tagName.name) || comment.code.context.name;
      // name = !name.startsWith('.') ? `.${name}` : name;

      const index = comment.code.value.indexOf('(');
      const signature = comment.code.value.slice(index, -1);
      const signatureBlock =
        signature.trim().length > 0
          ? `**Signature**\n\n\`\`\`ts\nfunction${signature}\n\`\`\`\n`
          : '';

      const tagsString = tags
        .filter((tag) => !/api|public|private/.test(tag.title))
        .map((tag) =>
          /returns?/.test(tag.title) ? { ...tag, name: 'returns' } : tag,
        )
        .map((tag) => {
          const descr = tag.description.replace(/-\s+/, '');
          const description = descr.length > 0 ? ` - ${descr}` : '';
          const tagType = getParamType(tag);

          return `- \`${tag.name}\`${tagType}${description}`;
        })
        .join('\n');

      const str = `### [${name}](./${locUrl})\n\n${
        comment.description
      }\n\n${signatureBlock}\n**Params**\n\n${tagsString}\n${comment.examples
        .map(
          (example) =>
            `\n${
              example.description
            }\n\n**Example**\n\n\`\`\`${example.language || 'js'}${
              example.value
            }\`\`\``,
        )
        .join('\n')}`;

      return `${acc}\n\n${str}`;
    }, '');

  return {
    filepath,
    contents,
  };
};

function getParamType(tag) {
  let paramType = '';

  if (tag.type.type === 'NameExpression') {
    paramType = tag.type.name;
  }
  if (tag.type.type === 'UnionType') {
    paramType = tag.type.elements.map((x) => x.name).join('|');
  }

  // currently only works for basic cases like `Array<string>` and `string[]`
  // which is completely okay for most cases
  if (tag.type.type === 'TypeApplication') {
    paramType = tag.type.expression.name;
    paramType += '<';
    paramType += tag.type.applications[0].name;
    paramType += '>';
  }

  return paramType.length > 0 ? ` **{${paramType}}**` : '';
}
