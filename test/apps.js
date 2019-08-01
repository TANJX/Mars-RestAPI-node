/* eslint-disable no-undef,prefer-destructuring */
// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');

// Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');

const sha256 = require('js-sha256');

const should = chai.should();

const { db_apps, app, close_server } = require('../build/app');

const Log = db_apps.model('Log');
const Event = db_apps.model('Event');
const Progress = db_apps.model('Progress');
const User = db_apps.model('User');
const Token = db_apps.model('Token');

chai.use(chaiHttp);

describe('Mars Apps', () => {
  let token;

  describe('Login', () => {
    const username = Math.random().toString(36).substr(2);
    const password = Math.random().toString(36).substr(2);
    const password_hash = sha256(password);

    before('Clean and Add a User', function (done) {
      this.timeout(5000);
      User.deleteMany({}, () => {
        Token.deleteMany({}, () => {
          const user = new User();
          user.name = username;
          user.password = password_hash;
          user.save().then(() => {
            done();
          });
        });
      });
    });

    describe('POST /login/', () => {
      it('it should send a wrong user and return an error', (done) => {
        chai.request(app)
          .post('/apps/login')
          .send({ name: 'a', password: 'b' })
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.be.a('object');
            res.body.errors.message.should.includes('Cannot find');
            done();
          });
      });
    });

    describe('POST /login/', () => {
      it('it should login in successfully', (done) => {
        chai.request(app)
          .post('/apps/login')
          .send({ name: username, password })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('token');
            res.body.should.have.property('expire');
            token = res.body.token;
            done();
          });
      });
    });
  });

  describe('Logs', () => {
    before('Resetting Logs Collection', function (done) {
      this.timeout(3000);
      // Before each test we empty the database
      Log.deleteMany({}, (err) => {
        done();
      });
    });
    describe('GET /log/list/', () => {
      it('it should GET 0 Log', (done) => {
        chai.request(app)
          .get('/apps/log/list')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.length.should.be.eql(0);
            done();
          });
      });
    });
    /*
     * Test the /POST route
     */
    const log = {
      msg: 'The Lord of the Rings',
    };
    const time = Date.now();
    const log_2 = {
      msg: 'Mars Inc.',
    };
    const time_2 = Date.now();

    describe('POST /log/add/', () => {
      it('it should POST a empty Log and return an error', (done) => {
        chai.request(app)
          .post('/apps/log/add')
          .send({})
          .end((err, res) => {
            res.should.have.status(422);
            res.body.should.be.a('object');
            res.body.should.have.property('errors');
            done();
          });
      });
    });

    describe('POST /log/add/', () => {
      it('it should POST a Log without a token and return an error', (done) => {
        chai.request(app)
          .post('/apps/log/add')
          .send({ msg: log.msg, token: '1' })
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.be.a('object');
            res.body.should.have.property('errors');
            done();
          });
      });
    });

    describe('POST /log/add/', () => {
      it('it should POST the first log', (done) => {

        chai.request(app)
          .post('/apps/log/add')
          .send({ msg: log.msg, token })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('msg');
            res.body.msg.should.equals(log.msg);
            res.body.should.have.property('time');
            (new Date(res.body.time)).getTime().should.closeTo(time, 5000);
            done();
          });
      });
    });

    describe('POST /log/add/', () => {
      it('it should POST the second Log', (done) => {
        chai.request(app)
          .post('/apps/log/add')
          .send({ msg: log_2.msg, token })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('msg');
            res.body.msg.should.equals(log_2.msg);
            res.body.should.have.property('time');
            (new Date(res.body.time)).getTime().should.closeTo(time_2, 5000);
            done();
          });
      });
    });

    describe('GET /log/list/', () => {
      it('it should GET 2 Logs, in reverse order', (done) => {
        chai.request(app)
          .get('/apps/log/list')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.length.should.be.eql(2);
            res.body[0].msg.should.equals(log_2.msg);
            (new Date(res.body[0].time)).getTime().should.closeTo(time_2, 5000);
            res.body[1].msg.should.equals(log.msg);
            (new Date(res.body[1].time)).getTime().should.closeTo(time, 5000);
            done();
          });
      });
    });

    after('Resetting Logs Collection', (done) => {
      Log.deleteMany({}, (err) => {
        done();
      });
    });
  });

  describe('Events', () => {
    before('Resetting Events Collection', function (done) {
      this.timeout(3000);
      // Before each test we empty the database
      Event.deleteMany({}, (err) => {
        done();
      });
    });
    /*
     * Test the /GET route
     */
    describe('GET /event/list/', () => {
      it('it should GET 0 Event', (done) => {
        chai.request(app)
          .get('/apps/event/list')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.length.should.be.eql(0);
            done();
          });
      });
    });

    describe('POST /event/add/', () => {
      it('it should post an empty event and return an error', (done) => {
        chai.request(app)
          .post('/apps/event/add')
          .send({ name: 't' })
          .end((err, res) => {
            res.should.have.status(422);
            res.body.should.be.a('object');
            res.body.should.have.property('errors');
            res.body.errors.should.have.property('message');
            res.body.errors.message.should.includes('no time');
            done();
          });
      });
    });

    const event = {
      name: 'The Lord of the Rings',
      time: Date.now(),
      type: 'type a',
    };
    const event_2 = {
      name: 'Mars Inc.',
      time: Date.now() + 10000,
      type: 'type b',
    };

    describe('POST /event/add/', () => {
      it('it should post a event without a token and return an error', (done) => {
        chai.request(app)
          .post('/apps/event/add')
          .send({ name: event.name, time: event.time, type: event.type, token: '1' })
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.be.a('object');
            res.body.should.have.property('errors');
            done();
          });
      });
    });

    describe('POST /event/add/', () => {
      it('it should POST a Event ', (done) => {
        chai.request(app)
          .post('/apps/event/add')
          .send({
            name: event.name, time: event.time, type: event.type, token,
          })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('name');
            res.body.name.should.equals(event.name);
            res.body.should.have.property('type');
            res.body.type.should.equals(event.type);
            res.body.should.have.property('time');
            (new Date(res.body.time)).getTime().should.equals(event.time);
            done();
          });
      });
    });

    describe('POST /event/add/', () => {
      it('it should POST the second Event', (done) => {
        chai.request(app)
          .post('/apps/event/add')
          .send({
            name: event_2.name, time: event_2.time, type: event_2.type, token,
          })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.name.should.equals(event_2.name);
            res.body.type.should.equals(event_2.type);
            (new Date(res.body.time)).getTime().should.equals(event_2.time);
            done();
          });
      });
    });

    describe('GET /event/list/', () => {
      it('it should GET 2 Events, in time order', (done) => {
        chai.request(app)
          .get('/apps/event/list')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.length.should.be.eql(2);
            res.body[0].name.should.equals(event.name);
            res.body[0].type.should.equals(event.type);
            (new Date(res.body[0].time)).getTime().should.closeTo(event.time, 5000);
            res.body[1].name.should.equals(event_2.name);
            res.body[1].type.should.equals(event_2.type);
            (new Date(res.body[1].time)).getTime().should.closeTo(event_2.time, 5000);
            done();
          });
      });
    });

    after('Resetting Logs Collection', (done) => {
      Event.deleteMany({}, (err) => {
        done();
      });
    });
  });

  describe('Progress', () => {
    before('Resetting Progress Collection', function (done) {
      this.timeout(3000);
      Progress.deleteMany({}, (err) => {
        done();
      });
    });
    describe('GET /progress/list/', () => {
      it('it should GET 0 Progress', (done) => {
        chai.request(app)
          .get('/apps/progress/list')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.length.should.be.eql(0);
            done();
          });
      });
    });

    describe('POST /progress/add/', () => {
      it('it should post an empty progress and return an error', (done) => {
        chai.request(app)
          .post('/apps/progress/add')
          .send({ name: 't', end: 123 })
          .end((err, res) => {
            res.should.have.status(422);
            res.body.should.be.a('object');
            res.body.should.have.property('errors');
            res.body.errors.should.have.property('message');
            res.body.errors.message.should.includes('no start');
            done();
          });
      });
    });

    const progress = {
      name: 'The Lord of the Rings',
      start: Date.now(),
      end: Date.now() + 200,
    };
    const progress_2 = {
      name: 'Mars Inc.',
      start: Date.now() - 500,
      end: Date.now() + 200,
    };

    describe('POST /progress/add/', () => {
      it('it should post a progress without token and return an error', (done) => {
        chai.request(app)
          .post('/apps/progress/add')
          .send({ name: 't', start: 100, end: 123, token: '1' })
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.be.a('object');
            res.body.should.have.property('errors');
            done();
          });
      });
    });

    describe('POST /progress/add/', () => {
      it('it should POST a Progress ', (done) => {
        chai.request(app)
          .post('/apps/progress/add')
          .send({
            name: progress.name, start: progress.start, end: progress.end, token,
          })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('name');
            res.body.name.should.equals(progress.name);
            res.body.should.have.property('start');
            (new Date(res.body.start)).getTime().should.equals(progress.start);
            res.body.should.have.property('end');
            (new Date(res.body.end)).getTime().should.equals(progress.end);
            done();
          });
      });
    });

    describe('POST /progress/add/', () => {
      it('it should POST the second Progress', (done) => {
        chai.request(app)
          .post('/apps/progress/add')
          .send({
            name: progress_2.name, start: progress_2.start, end: progress_2.end, token,
          })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.name.should.equals(progress_2.name);
            (new Date(res.body.start)).getTime().should.equals(progress_2.start);
            (new Date(res.body.end)).getTime().should.equals(progress_2.end);
            done();
          });
      });
    });

    describe('GET /progress/list/', () => {
      it('it should GET 2 Progress, in start time order', (done) => {
        chai.request(app)
          .get('/apps/progress/list')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.length.should.be.eql(2);
            res.body[0].name.should.equals(progress_2.name);
            (new Date(res.body[0].start)).getTime().should.equals(progress_2.start);
            (new Date(res.body[0].end)).getTime().should.equals(progress_2.end);
            res.body[1].name.should.equals(progress.name);
            (new Date(res.body[1].start)).getTime().should.equals(progress.start);
            (new Date(res.body[1].end)).getTime().should.equals(progress.end);
            done();
          });
      });
    });

    after('Resetting Progress Collection', (done) => {
      Progress.deleteMany({}, (err) => {
        done();
      });
    });
  });

  after('Cleanup and Stop Server', (done) => {
    User.deleteMany({}, () => {
      Token.deleteMany({}, () => {
        close_server();
        done();
      });
    });
  });
});
