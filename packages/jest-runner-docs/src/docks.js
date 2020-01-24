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
      const clearName = name.replace(/^\./, '').toLowerCase();
      const paramsId = `<span id="${clearName}-params"></span>\n\n`;
      const signatureId = `<span id="${clearName}-signature"></span>\n\n`;
      const examplesId = `<span id="${clearName}-examples"></span>\n\n`;

      // name = !name.startsWith('.') ? `.${name}` : name;

      const index = comment.code.value.indexOf('(');
      const signature = comment.code.value.slice(index, -1).trim();
      const signatureBlock =
        signature.length > 0
          ? `${signatureId}#### Signature\n\n\`\`\`ts\nfunction${signature}\n\`\`\`\n`
          : '';

      const tagsStr = tags
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

      // const nameIdParams = `${name.replace(/^\./, '').toLowerCase()}-params`;
      const params =
        tagsStr.length > 0 ? `\n${paramsId}#### Params\n\n${tagsStr}` : '';

      const str = `### [${name}](./${locUrl})\n\n${
        comment.description
      }\n\n${signatureBlock}${params}\n${comment.examples
        .map(
          (example) =>
            `\n${example.description.trim()}\n\n${examplesId}#### Examples\n\n\`\`\`${example.language ||
              'js'}${example.value}\`\`\``,
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
    paramType += '&lt;';
    paramType += tag.type.applications[0].name;
    paramType += '&gt;';
  }

  return paramType.length > 0 ? ` **{${paramType}}**` : '';
}
