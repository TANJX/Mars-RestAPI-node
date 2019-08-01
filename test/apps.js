/* eslint-disable no-undef */
// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');

// Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');

const should = chai.should();

const { db_apps, app, close_server } = require('../build/app');

const Log = db_apps.model('Log');
const Event = db_apps.model('Event');
const Progress = db_apps.model('Progress');

chai.use(chaiHttp);

describe('Mars Apps', () => {
  describe('Logs', () => {
    before('Resetting Logs Collection', function (done) {
      this.timeout(3000);
      // Before each test we empty the database
      Log.deleteMany({}, (err) => {
        done();
      });
    });
    /*
     * Test the /GET route
     */
    describe('/GET Log', () => {
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

    describe('/POST Log', () => {
      it('it should POST a Log ', (done) => {
        chai.request(app)
          .post('/apps/log/add')
          .send(log)
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

    describe('/POST another Log', () => {
      it('it should POST the second Log', (done) => {
        chai.request(app)
          .post('/apps/log/add')
          .send(log_2)
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

    describe('/GET 2 Log', () => {
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
    describe('/GET Event', () => {
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
    /*
     * Test the /POST route
     */
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

    describe('/POST Event', () => {
      it('it should POST a Event ', (done) => {
        chai.request(app)
          .post('/apps/event/add')
          .send(event)
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

    describe('/POST another Event', () => {
      it('it should POST the second Event', (done) => {
        chai.request(app)
          .post('/apps/event/add')
          .send(event_2)
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

    describe('/GET 2 Event', () => {
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
      // Before each test we empty the database
      Progress.deleteMany({}, (err) => {
        done();
      });
    });
    /*
     * Test the /GET route
     */
    describe('/GET Event', () => {
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
    /*
     * Test the /POST route
     */
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

    describe('/POST Progress', () => {
      it('it should POST a Progress ', (done) => {
        chai.request(app)
          .post('/apps/progress/add')
          .send(progress)
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

    describe('/POST another Progress', () => {
      it('it should POST the second Progress', (done) => {
        chai.request(app)
          .post('/apps/progress/add')
          .send(progress_2)
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

    describe('/GET 2 Progress', () => {
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

  after('Stop Server', (done) => {
    close_server();
    done();
  });
});
