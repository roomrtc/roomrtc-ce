'use strict';
const test = require('tape');
const request = require('supertest');
const kites = require('../../app');

test('kites initDatabase()', function (t) {
    t.plan(2)

    kites.ready((kites) => {
        request(kites.express.app)
            .post('/api/user/demo')
            .set('Authorization', 'Bearer foobar')
            .expect(200, (err, res) => {
                t.equal(res.body.length, 1, 'Init database');
            })

        // find created user
        request(kites.express.app)
            .post('/api/user/admin')
            .set('Authorization', 'Bearer foobar')
            .expect(200, (err, res) => {
                t.equal(res.body.email, 'vunb@nodejs.vn', 'Find admin user');
            })
    })
})