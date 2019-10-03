const fs = require('fs');
const Comments = require('parse-comments');

const parser = new Comments();

module.exports = function docks(filepath) {
  const comments = parser.parse(fs.readFileSync(filepath, 'utf8'));
  const contents = comments
    .filter((cmt) =>
      cmt.tags.find(
        (x) =>
          (x.title === 'api' && x.name === 'public') || x.title === 'public',
      ),
    )
    .reduce((acc, comment) => {
      const tagName = comment.tags.find((tag) => tag.title === 'name');
      const tags = tagName
        ? comment.tags.filter((x) => x.title !== 'name')
        : comment.tags;

      let name = (tagName && tagName.name) || comment.code.context.name;
      name = !name.startsWith('.') ? `.${name}` : name;

      const index = comment.code.value.indexOf('(');
      const signature = comment.code.value.slice(index, -1);
      const signatureBlock = `\n\`\`\`ts\nfunction${signature}\n\`\`\`\n`;

      const tagsString = tags
        .filter((tag) => !/api|public|private/.test(tag.title))
        .map((tag) =>
          /returns?/.test(tag.title) ? { ...tag, name: 'returns' } : tag,
        )
        .map((tag) => `- **${tag.name}** - ${tag.description}`)
        .join('\n');

      const str = `### ${name}\n\n${
        comment.description
      }\n\n**Signature**\n${signatureBlock}\n**Params**\n\n${tagsString}\n${comment.examples
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
