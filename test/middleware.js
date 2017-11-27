/**
 * Created by sajjad on 11/24/17.
 */
/* eslint no-undef: 0 */
import chai, {expect, assert} from 'chai';
import { MiddlEmitter } from './../src';

//var assert = require('assert');
describe('Middleware', function() {
  describe('#emit', function() {
    it('should apply middleware in order', function() {
      const emitter = new MiddlEmitter();
      let receivedCalls;
      emitter.on('test', (calls) => {
        receivedCalls = calls;
      });

      emitter.use('test', async ([calls], next) => {
        calls.push(1);
        await next();
      });

      emitter.use('test', async ([calls], next) => {
        calls.push(2);
        await next();
      });

      return emitter.emit('test',[]).then(()=>{
        expect(receivedCalls, 'expect to call middleware in order').to.deep.equal([1,2]);
      });
    });

    it('should apply middleware with priority', function() {
      const emitter = new MiddlEmitter();
      let receivedCalls;
      emitter.on('test', (calls) => {
        receivedCalls = calls;
      });

      emitter.use('test', async ([calls], next) => {
        calls.push(5);
        await next();
      });

      emitter.use('test', async ([calls], next) => {
        calls.push(2);
        await next();
      }, 10);

      emitter.use('test', async ([calls], next) => {
        calls.push(4);
        await next();
      }, 5);

      emitter.use('test', async ([calls], next) => {
        calls.push(3);
        await next();
      }, 10);

      emitter.use('test', async ([calls], next) => {
        calls.push(1);
        await next();
      }, 15);

      return emitter.emit('test', []).then(() => {
        expect(
          receivedCalls,
          'expect to call middleware from height to low priority an in order'
        ).to.deep.equal([1, 2, 3, 4, 5]);
      });
    });

    it('should apply multiple middleware at once with priority', function () {
      const emitter = new MiddlEmitter();
      let receivedParams;
      const calls = [];
      emitter.on('test', (...params) => {
        receivedParams = params;
      });
      emitter.use(
        'test',
        async (params, next) => {
          calls.push(3)
          await next();
        },
        10
      );
      emitter.use(
        'test',
        async (params, next) => {
          calls.push(1)
          await next();
        },
        async (params, next) => {
          calls.push(2)
          await next();
        },
        11
      );
      return emitter.emit('test', 1, 2, 3).then(() => {
        expect(calls, 'expect to apply middleware that added at once with priority').to.deep.equal([1, 2, 3]);
      });
    });

    it('should should skip next middleware', function () {
      const emitter = new MiddlEmitter();
      let receivedCalls;
      emitter.on('test', (calls) => {
        receivedCalls = calls;
      });

      emitter.use('test', async ([calls], next) => {
        calls.push(1);
      });

      emitter.use('test', async ([calls], next) => {
        calls.push(2);
        await next();
      });

      return emitter.emit('test', []).then(() => {
        expect(receivedCalls, 'expect to skip next middleware').to.deep.equal([1]);
      });
    });
  });
});
