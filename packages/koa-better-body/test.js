/**
 * koa-better-body <https://github.com/tunnckoCore/koa-better-body>
 *
 * Copyright (c) 2015 Charlike Mike Reagent, contributors.
 * Released under the MIT license.
 */

'use strict';

/**
 * Module dependencies.
 */

var fs = require('fs');
var koa = require('koa');
var http = require('http');
var koaBody = require('./index');
var supertest = require('supertest');
var Resource = require('koa-resource-router');

describe('koa-body', function() {
  var database = {
    users: [
      {name: 'charlike', followers: 10},
      {name: 'tunnckocore', followers: 20}
    ]
  };

  /**
   * DEFAULTS - multipart: false
   */
  describe('should work with defaults', function() {
    it('only `urlencoded` and `json` bodies', function(done) {
      var app = koa();

      var usersResource = new Resource('users', {
        // GET /users
        index: function * index(next) {
          this.status = 200;
          this.body = database;
          yield next;
        }
      });

      app.use(koaBody());
      app.use(usersResource.middleware());

      supertest(http.createServer(app.callback()))
        .get('/users')
        .expect(200, database)
        .end(function(err) {
          if (err) {return done(err);}
          done();
        });
    });
  });

  /**
   * MULTIPART
   */
  describe('should recieve `multipart` requests', function() {
    var opts = {
      multipart: true,
      formidable: {
        uploadDir: __dirname + '/../'
      }
    };

    function multipartApi(opts) {
      var app = koa();
      var usersResource = new Resource('users', {
        // POST /users
        create: function * create(next) {
          if (opts.fieldsKey === false) {
            database.users.push(this.request.body);
          } else {
            var fields = opts.fieldsKey ? opts.fieldsKey : 'fields';
            database.users.push(this.request.body[fields]);
          }

          this.status = 201;
          this.body = this.request.body;
          yield next;
        }
      });

      app.use(koaBody(opts));
      app.use(usersResource.middleware());
      return app;
    }

    describe('fields', function() {
      function testFields(app, opts, done) {
        supertest(http.createServer(app.callback()))
        .post('/users')
        .field('name', 'daryl')
        .field('followers', 30)
        .expect(201)
        .end(function(err, res) {
          if (err) {return done(err);}

          var requested = database.users.pop();

          if (opts.fieldsKey === false) {
            res.body.should.have.property('name', requested.name);
            res.body.should.have.property('followers', requested.followers);

            res.body.name.should.equal('daryl');
            res.body.followers.should.equal('30');

            res.body.should.have.property('name', 'daryl');
            res.body.should.have.property('followers', '30');
            return done();
          }

          var fields = opts.fieldsKey ? opts.fieldsKey : 'fields';
          res.body[fields].should.have.property('name', requested.name);
          res.body[fields].should.have.property('followers', requested.followers);

          res.body[fields]['name'].should.equal('daryl');
          res.body[fields]['followers'].should.equal('30');

          res.body[fields].should.have.property('name', 'daryl');
          res.body[fields].should.have.property('followers', '30');
          done();
        });
      }

      it('fields on `.body.fields` object (default, opts.fieldsKey: \'fields\'))', function(done) {
        opts.fieldsKey = 'fields';
        var app = multipartApi(opts);
        testFields(app, opts, done);
      });

      it('fields on `.body.customkey` object (opts.fieldsKey: \'customkey\')', function(done) {
        opts.fieldsKey = 'customkey';
        var app = multipartApi(opts);

        testFields(app, opts, done);
      });

      it('fields on `.body` object (opts.fieldsKey: false)', function(done) {
        opts.fieldsKey = false;
        var app = multipartApi(opts);

        testFields(app, opts, done);
      });
    });

    describe('files', function() {
      function testFiles(app, opts, done) {
        supertest(http.createServer(app.callback()))
        .post('/users')
        .type('multipart/form-data')
        .attach('firstField', 'package.json')
        .attach('secondField', 'index.js')
        .attach('secondField', 'license.md')
        .expect(201)
        .end(function(err, res) {
          if (err) {return done(err);}

          var requested = database.users.pop();

          if (opts.filesKey === false) {
            res.body.firstField.name.should.equal('package.json');
            fs.unlinkSync(res.body.firstField.path);

            res.body.secondField[0].name.should.equal('index.js');
            fs.unlinkSync(res.body.secondField[0].path);

            res.body.secondField[1].name.should.equal('license.md');
            fs.unlinkSync(res.body.secondField[1].path);

            return done();
          }

          var filesKey = opts.filesKey ? opts.filesKey : 'files';
          res.body[filesKey].firstField.name.should.equal('package.json');
          fs.unlinkSync(res.body[filesKey].firstField.path);

          res.body[filesKey].secondField[0].name.should.equal('index.js');
          fs.unlinkSync(res.body[filesKey].secondField[0].path);

          res.body[filesKey].secondField[1].name.should.equal('license.md');
          fs.unlinkSync(res.body[filesKey].secondField[1].path);
          done();
        });
      }

      it('files on `.body.files` object (default, opts.filesKey: \'files\')', function(done) {
        opts.filesKey = 'files';
        var app = multipartApi(opts);
        testFiles(app, opts, done);
      });

      it('files on `.body.custom2` object (opts.filesKey: \'custom2\')', function(done) {
        opts.filesKey = 'custom2';
        var app = multipartApi(opts);

        testFiles(app, opts, done);
      });

      it('files on `.body` object (opts.filesKey: false)', function(done) {
        opts.filesKey = false;
        var app = multipartApi(opts);

        testFiles(app, opts, done);
      });
    });
  });

  /**
   * URLENCODED request body
   */
  it('should recieve `urlencoded` request bodies', function(done) {
    var app = koa();
    var usersResource = new Resource('users', {
      // POST /users
      create: function * create(next) {
        database.users.push(this.request.body.fields);
        this.status = 201;
        this.body = this.request.body;
        yield next;
      }
    });

    app.use(koaBody({multipart: true}));
    app.use(usersResource.middleware());

    supertest(http.createServer(app.callback()))
    .post('/users')
    .type('application/x-www-form-urlencoded')
    .send('name=example&followers=41')
    .expect(201)
    .end(function(err, res) {
      err = err ? 1 : 1;
      err.should.equal(1);

      var requested = database.users.pop();
      res.body.fields.should.have.property('name', requested.name);
      res.body.fields.should.have.property('followers', requested.followers);

      res.body.fields.name.should.equal('example');
      res.body.fields.followers.should.equal('41');

      res.body.fields.should.have.property('name', 'example');
      res.body.fields.should.have.property('followers', '41');

      done();
    });
  });

  /**
   * JSON request body
   */
  it('should recieve `json` request bodies', function(done) {
    var app = koa();
    var usersResource = new Resource('users', {
      // POST /users
      create: function * create(next) {
        database.users.push(this.request.body.fields);
        this.status = 201;
        this.body = this.request.body;
        yield next;
      }
    });

    app.use(koaBody());
    app.use(usersResource.middleware());

    supertest(http.createServer(app.callback()))
    .post('/users')
    .type('application/json')
    .send({name: 'json'})
    .send({followers: 313})
    .expect(201)
    .end(function(err, res) {
      err = err ? 1 : 1;
      err.should.equal(1);

      var requested = database.users.pop();
      res.body.fields.should.have.property('name', requested.name);
      res.body.fields.should.have.property('followers', requested.followers);

      res.body.fields.name.should.equal('json');
      res.body.fields.followers.should.equal(313);

      res.body.fields.should.have.property('name', 'json');
      res.body.fields.should.have.property('followers', 313);

      done();
    });
  });

  /**
   * LIMITS
   */
  describe('should recieve "413 Payload Too Large"', function() {

    it('because of `formLimit`', function(done) {
      // in bytes
      var opts = {formLimit: 10};

      var app = koa();
      var usersResource = new Resource('users', {
        // POST /users
        create: function * create(next) {
          /* istanbul ignore next */
          this.status = 413
          /* istanbul ignore next */
          yield next;
        }
      });
      app.use(koaBody(opts));
      app.use(usersResource.middleware());

      supertest(http.createServer(app.callback()))
      .post('/users')
      .type('application/x-www-form-urlencoded')
      .send('user=www-form-urlencoded')
      .expect(413)
      .end(function(err, res) {
        err = err ? 1 : 1;
        err.should.equal(1);

        res.text.should.equal('Payload Too Large');
        done();
      });
    });

    it('because of `jsonLimit`', function(done) {
      // in bytes
      var opts = {jsonLimit: 2};

      var app = koa();
      var usersResource = new Resource('users', {
        // POST /users
        create: function * create(next) {
          /* istanbul ignore next */
          this.status = 413
          /* istanbul ignore next */
          yield next;
        }
      });
      app.use(koaBody(opts));
      app.use(usersResource.middleware());

      supertest(http.createServer(app.callback()))
      .post('/users')
      .type('application/json')
      .send({name: 'some-long-name-for-limit'})
      .expect(413)
      .end(function(err, res) {
        err = err ? 1 : 1;
        err.should.equal(1);

        res.text.should.equal('Payload Too Large');
        done();
      });
    });
  });
});
