// SPDX-License-Identifier: MPL-2.0

import { FormidableFile } from './FormidableFile.js';
import { multipart } from './multipart.js';

export * from 'fetch-blob';

export class Formidable {
  constructor(options = {}) {
    this.options = { hooks: {}, ...options };
  }

  async formData(req, options = {}) {
    this.options = { ...this.options, ...options };

    const { parser, toFormData } = await multipart(req, this.options);

    Formidable.mockParser(parser, this.options.hooks);

    return toFormData({ request: req, parser });
  }

  static mockParser(parser = {}, hooks = {}) {
    const hooksList = Object.keys(parser)
      .filter((x) => x.startsWith('on'))
      .concat('onEnd');

    const hooksMap = { ...hooks };

    for (const hookName of hooksList) {
      const hookFn = parser[hookName];

      // eslint-disable-next-line no-param-reassign
      parser[hookName] = (...args) => {
        // eslint-disable-next-line no-unused-expressions
        hooksMap[hookName] && hooksMap[hookName](...args);
        hookFn(...args);
      };
    }
  }

  async parse(req, options = {}) {
    this.options = { ...this.options, ...options };

    const result = { files: new Set(), fields: new Set() };
    const formData = await this.formData(req, this.options);

    for (const [_, value] of formData.entries()) {
      const isFile = value instanceof FormidableFile;

      if (isFile) {
        result.files.add(value);
      } else {
        result.fields.add(value);
      }
    }

    return result;
  }
}

export default function formidable(options) {
  return new Formidable(options);
}
export { Blob } from 'fetch-blob';
export { FormData, multipart, MultipartParser } from './multipart.js';
export { File, FormidableFile } from './FormidableFile.js';
