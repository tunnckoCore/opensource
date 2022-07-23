import { createServer } from 'node:http';
import formidable from './src/index.js';

initServer();

function initServer() {
  const server = createServer(async (req, res) => {
    if (req.url === '/' && req.method.toLowerCase() === 'post') {
      // parse a file upload
      // `upload` does nothing now, could be used with `createTemporary*`
      const form = formidable({ upload: '/tmp' });

      // Similar to WHATWG `request.fromData()`
      const formData = await form.formData(req);

      for (const [key, file] of formData) {
        console.log('key:', key);
        console.log('value:', file);
      }

      // or old-school `form.parse`
      // files: Set, fields: Set
      const { files, fields } = await form.parse(req);

      console.log(files, fields);
      /**
      $ node example.js
        Server listening on http://localhost:8080/ ...

        Set(2) {
          FormidableFile [File] {
            path: '/home/sigma/dev/opensource/modules/formidable-mini/cl5x8g6zu0000l6j16rgy42up',
            basename: 'cl5x8g6zu0000l6j16rgy42up',
            dirname: '/home/sigma/dev/opensource/modules/formidable-mini',
            extname: '',
            stem: 'cl5x8g6zu0000l6j16rgy42up',
            mime: 'application/x-javascript'
          },
          FormidableFile [File] {
            path: '/home/sigma/dev/opensource/modules/formidable-mini/cl5x8g6zx0001l6j14mds0vln',
            basename: 'cl5x8g6zx0001l6j14mds0vln',
            dirname: '/home/sigma/dev/opensource/modules/formidable-mini',
            extname: '',
            stem: 'cl5x8g6zx0001l6j14mds0vln',
            mime: 'application/x-javascript'
          }
        } Set(1) { 'foobie' }
       */
      res.end('ok');
      return;
    }

    // show a file upload form
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <h2>With Node.js <code>"http"</code> module</h2>
      <form action="/" enctype="multipart/form-data" method="post">
        <div>Text field title: <input type="text" name="title"/></div>
        <div>File: <input type="file" name="pics" multiple/></div>
        <input type="submit" value="Upload" />
      </form>
    `);
  });

  server.listen(8080, () => {
    console.log('Server listening on http://localhost:8080/ ...');
  });
}
