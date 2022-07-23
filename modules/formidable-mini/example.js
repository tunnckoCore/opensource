import { createServer } from 'node:http';
import formidable from './src/index.js';

initServer();

function initServer() {
  const server = createServer(async (req, res) => {
    if (req.url === '/' && req.method.toLowerCase() === 'post') {
      // parse a file upload
      const form = formidable({ upload: '/tmp' });

      // Similar to WHATWG `request.fromData()`
      // const formData = await form.formData(req);

      // files: Set, fields: Set
      const { files, fields } = await form.parse(req);

      console.log(files, fields);
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
