/**
 * koa-better-body <https://github.com/tunnckoCore/koa-better-body>
 *
 * Copyright (c) 2014 Charlike Mike Reagent, contributors.
 * Released under the MIT license.
 */

'use strict';

/**
 * Module dependencies.
 */

var fs = require('fs');
var koa = require('koa');
var http = require('http');
var request = require('supertest');
var koaBody = require('./index');
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

      request(http.createServer(app.callback()))
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
    it('fields on .body.fields object', function(done) {
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

      app.use(koaBody({multipart: true, jsonLimit: '1mb',formLimit: '56kb'}));
      app.use(usersResource.middleware());

      request(http.createServer(app.callback()))
      .post('/users')
      .field('name', 'daryl')
      .field('followers', 30)
      .expect(201)
      .end(function(err, res) {
        if (err) {return done(err);}

        var requested = database.users.pop();
        res.body.fields.should.have.property('name', requested.name);
        res.body.fields.should.have.property('followers', requested.followers);

        res.body.fields.name.should.equal('daryl');
        res.body.fields.followers.should.equal('30');

        res.body.fields.should.have.property('name', 'daryl');
        res.body.fields.should.have.property('followers', '30');

        done();
      });
    });

    it('files on .body.files object', function(done) {
      var app = koa();
      var usersResource = new Resource('users', {
        // POST /users
        create: function * create(next) {
          this.status = 201;
          this.body = this.request.body;
          yield next;
        }
      });

      app.use(koaBody({
        multipart: true,
        formidable: {
          uploadDir: __dirname + '/../'
        }
      }));
      app.use(usersResource.middleware());

      request(http.createServer(app.callback()))
      .post('/users')
      .type('multipart/form-data')
      .attach('firstField', 'package.json')
      .attach('secondField', 'index.js')
      .attach('secondField', 'license.md')
      .expect(201)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }

        res.body.files.firstField.name.should.equal('package.json');
        fs.unlinkSync(res.body.files.firstField.path);

        res.body.files.secondField[0].name.should.equal('index.js');
        fs.unlinkSync(res.body.files.secondField[0].path);

        res.body.files.secondField[1].name.should.equal('license.md');
        fs.unlinkSync(res.body.files.secondField[1].path);

        done();
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

    request(http.createServer(app.callback()))
    .post('/users')
    .type('application/x-www-form-urlencoded')
    .send('name=example&followers=41')
    .expect(201)
    .end(function(err, res) {
      if (err) {
        return done(err);
      }

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

    request(http.createServer(app.callback()))
    .post('/users')
    .type('application/json')
    .send({name: 'json'})
    .send({followers: 313})
    .expect(201)
    .end(function(err, res) {
      if (err) {
        return done(err);
      }

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
      var app = koa();
      var usersResource = new Resource('users', {
        // POST /users
        create: function * create(next) {
          //suggestions for handling?
          //what if we want to make body more user-friendly?
          this.status = 413
          yield next;
        }
      });

      // in bytes
      app.use(koaBody({formLimit: 10}));
      app.use(usersResource.middleware());

      request(http.createServer(app.callback()))
      .post('/users')
      .type('application/x-www-form-urlencoded')
      .send('user=www-form-urlencoded')
      .expect(413)
      .end(done);
    });

    it('because of `jsonLimit`', function(done) {
      var app = koa();
      var usersResource = new Resource('users', {
        // POST /users
        create: function * create(next) {
          //suggestions for handling?
          //what if we want to make body more user-friendly?
          this.status = 413
          yield next;
        }
      });

      // in bytes
      app.use(koaBody({jsonLimit: 2}));
      app.use(usersResource.middleware());

      request(http.createServer(app.callback()))
      .post('/users')
      .type('application/json')
      .send({name: 'some-long-name-for-limit'})
      .expect(413)
      .end(done);
    });
  });
});
