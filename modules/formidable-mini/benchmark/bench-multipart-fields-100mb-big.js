'use strict';

function createMultipartBuffers(boundary, sizes) {
  const bufs = [];
  for (const [i, size] of sizes.entries()) {
    const mb = size * 1024 * 1024;
    bufs.push(
      Buffer.from(
        [
          `--${boundary}`,
          `content-disposition: form-data; name="field${i + 1}"`,
          '',
          '0'.repeat(mb),
          '',
        ].join('\r\n'),
      ),
    );
  }
  bufs.push(Buffer.from([`--${boundary}--`, ''].join('\r\n')));
  return bufs;
}

const boundary = `-----------------------------${Date.now()}`;
const buffers = createMultipartBuffers(boundary, [10, 10, 10, 20, 50]);
const calls = {
  partBegin: 0,
  headerField: 0,
  headerValue: 0,
  headerEnd: 0,
  headersEnd: 0,
  partData: 0,
  partEnd: 0,
  end: 0,
};

const moduleName = process.argv[2];
switch (moduleName) {
  case 'busboy': {
    const busboy = require('busboy');

    const parser = busboy({
      limits: {
        fieldSizeLimit: Number.POSITIVE_INFINITY,
      },
      headers: {
        'content-type': `multipart/form-data; boundary=${boundary}`,
      },
    });
    parser
      .on('field', (name, val, info) => {
        ++calls.partBegin;
        ++calls.partData;
        ++calls.partEnd;
      })
      .on('close', () => {
        ++calls.end;
        console.timeLog(moduleName);
        console.timeEnd(moduleName);
      });

    console.time(moduleName);
    for (const buf of buffers) parser.write(buf);

    break;
  }

  case 'formidable': {
    const { MultipartParser } = require('formidable');

    const parser = new MultipartParser();
    parser.initWithBoundary(boundary);
    parser.on('data', ({ name }) => {
      ++calls[name];
      if (name === 'end') console.timeEnd(moduleName);
    });

    console.time(moduleName);
    for (const buf of buffers) parser.write(buf);

    break;
  }

  case 'multiparty': {
    const { Readable } = require('stream');

    const { Form } = require('multiparty');

    const form = new Form({
      maxFieldsSize: Number.POSITIVE_INFINITY,
      maxFields: Number.POSITIVE_INFINITY,
      maxFilesSize: Number.POSITIVE_INFINITY,
      autoFields: false,
      autoFiles: false,
    });

    const req = new Readable({ read: () => {} });
    req.headers = {
      'content-type': `multipart/form-data; boundary=${boundary}`,
    };

    function hijack(name, fn) {
      const oldFn = form[name];
      form[name] = function () {
        fn();
        return Reflect.apply(oldFn, this, arguments);
      };
    }

    hijack('onParseHeaderField', () => {
      ++calls.headerField;
    });
    hijack('onParseHeaderValue', () => {
      ++calls.headerValue;
    });
    hijack('onParsePartBegin', () => {
      ++calls.partBegin;
    });
    hijack('onParsePartData', () => {
      ++calls.partData;
    });
    hijack('onParsePartEnd', () => {
      ++calls.partEnd;
    });

    form
      .on('close', () => {
        ++calls.end;
        console.timeEnd(moduleName);
      })
      .on('part', (p) => p.resume());

    console.time(moduleName);
    form.parse(req);
    for (const buf of buffers) req.push(buf);
    req.push(null);

    break;
  }

  default:
    if (moduleName === undefined) console.error('Missing parser module name');
    else console.error(`Invalid parser module name: ${moduleName}`);
    process.exit(1);
}
