import { expect } from "chai";
import sinon from "sinon";
import { HTTP, METHODS } from './http';
import { newServer } from 'mock-xmlhttprequest';
import assert from 'node:assert/strict';

const FakeNotFoundComponent = function() {
    return {
        _render() {
            return '<div>404</div>';
        },
        hide() {},
        show() {}
    };
};

describe('HTTP', () => {
    let http;
    let onRequestSpy;
    let server;

    beforeEach(()=> {
        server = newServer({
            get: ['/my/url', {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
              body: '{ "message": "Success!" }',
            }],
            put: ['/my/404', {
                status: 404,
                headers: { 'Content-Type': 'text/html' },
                body: 'Not found',
              }],
            post: ['/my/post', {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
                body: '{ "message": "Success!" }',
              }],
        });
        server.install();

        http = new HTTP();
        onRequestSpy = sinon.spy(http, "request");
    });

    it('Should exist', () => {
        expect(http).to.be.ok;
    });

    it('Should correctly use `request` method', () => {
        http.get('/my/url');

        expect(onRequestSpy.calledWith(
            '/my/url',
            {
                timeout: 5000,
                method: METHODS.GET
            }
        )).to.be.true;
    });

    it('Should return correct result by GET method', async () => {
        await http.get('/my/url').then((result) => {
            expect(result).to.equal('{ "message": "Success!" }');
        });
    });

    it('Should return correct result by POST method', async () => {
        await http.post('/my/post').then((result) => {
            expect(result).to.equal('{ "message": "Success!" }');
        });
    });

    it('Should return rejected promise in case of error', async () => {
        http.router.use('/404', FakeNotFoundComponent);
        const promise = http.put('/my/404');
        await assert.rejects(promise);
    });

    it('Should open specified page in case of error', async () => {
        const onGoSpy = sinon.spy(http.router, "go");
        http.router.use('/404', FakeNotFoundComponent);
        await http.put('/my/404').then().catch((e) => {
            expect(onGoSpy.calledWith('/404')).to.be.true;
        });
    });
})
