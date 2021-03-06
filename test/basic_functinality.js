/**
 * Created by sajjad on 11/24/17.
 */
/* eslint no-undef: 0 */
import 'babel-polyfill';
import { expect } from 'chai';
import { MiddlEmitter } from './../src';

describe('MiddlEmitter basic functionality', () => {
  describe('#on', () => {
    it('should add listener', () => {
      const emitter = new MiddlEmitter();
      let called = false;
      emitter.on('test', () => {
        called = true;
      });
      return emitter.emit('test').then(() => {
        expect(called, 'expect to listener receive event').to.equal(true);
      });
    });
    it('should add isolate different events', () => {
      const emitter = new MiddlEmitter();
      let test1Called = false;
      let test2Called = false;
      emitter.on('test1', () => {
        test1Called = true;
      });
      emitter.on('test2', () => {
        test2Called = true;
      });
      return emitter.emit('test1').then(() => {
        expect(test2Called, 'expect to test2 listener not to receive event while emitting test1 event').to.equal(false);
        test1Called = false;
        return emitter.emit('test2').then(() => {
          expect(test1Called, 'expect to test1 listener not to receive event while emitting test2 event')
            .to.equal(false);
        });
      });
    });
    it('should add listener to multiple event', () => {
      const emitter = new MiddlEmitter();
      const calls = [];
      emitter.on('test1 test2 test3', (eventName) => {
        calls.push(eventName);
      });
      return emitter.emit('test1', 'test1')
        .then(() => emitter.emit('test2', 'test2'))
        .then(() => emitter.emit('test3', 'test3'))
        .then(() => {
          expect(calls, 'expect to listener receive event').to.deep.equal(['test1', 'test2', 'test3']);
        });
    });
  });

  describe('#off', () => {
    it('should remove listener', () => {
      const emitter = new MiddlEmitter();
      let called = false;
      const listener = emitter.on('test', () => {
        called = true;
      });
      emitter.off('test', listener);
      return emitter.emit('test').then(() => {
        expect(called, 'expect to remove listener').to.equal(false);
      });
    });
  });

  describe('#once', () => {
    it('should call one time', () => {
      const emitter = new MiddlEmitter();
      let callCounter = 0;
      emitter.once('test', () => {
        callCounter += 1;
      });
      return emitter.emit('test')
        .then(() => emitter.emit('test'))
        .then(() => {
          expect(callCounter, 'expect to receive only one emit').to.equal(1);
        });
    });
    it('should add listener to multiple event', () => {
      const emitter = new MiddlEmitter();
      const calls = [];
      emitter.once('test1 test2 test3', (eventName) => {
        calls.push(eventName);
      });
      return emitter.emit('test1', 'test1')
        .then(() => emitter.emit('test2', 'test2'))
        .then(() => emitter.emit('test3', 'test3'))
        .then(() => {
          expect(calls, 'expect to listener receive event').to.deep.equal(['test1', 'test2', 'test3']);
        });
    });
  });

  describe('#off', () => {
    it('should remove listener added via once using returned listener', () => {
      const emitter = new MiddlEmitter();
      let called = false;
      const listener = emitter.once('test', () => {
        called = true;
      });
      emitter.off('test', listener);
      return emitter.emit('test').then(() => {
        expect(called, 'expect to remove listener that\'s added via once, using return value of once method')
          .to.equal(false);
      });
    });

    it('should remove listener added via once using listener itself', () => {
      const emitter = new MiddlEmitter();
      let called = false;
      const listener = () => {
        called = true;
      };
      emitter.once('test', listener);
      emitter.off('test', listener);
      return emitter.emit('test').then(() => {
        expect(called, 'expect to remove listener that\'s added via once, using listener reference').to.equal(false);
      });
    });
  });

  describe('#emit', () => {
    it('should pass many parameters to listeners', () => {
      const emitter = new MiddlEmitter();
      let receivedParams;
      emitter.once('test', (...params) => {
        receivedParams = params;
      });
      return emitter.emit('test', 1, 2, 3).then(() => {
        expect(receivedParams, 'expect to receive 1,2,3 as params').to.deep.equal([1, 2, 3]);
      });
    });

    it('should execute listeners on order', () => {
      const emitter = new MiddlEmitter();
      const calls = [];
      emitter.on('test', () => {
        calls.push(1);
      });
      emitter.on('test', () => {
        calls.push(2);
      });
      return emitter.emit('test').then(() => {
        expect(calls, 'expect to exec listeners with same priority in the order they added').to.deep.equal([1, 2]);
      });
    });
  });

  describe('#use', () => {
    it('should apply middleware', () => {
      const emitter = new MiddlEmitter();
      let receivedParams;
      emitter.on('test', (...params) => {
        receivedParams = params;
      });
      emitter.use('test', async (params, next) => {
        params.forEach((item, i) => {
          params[i] = item + 1; // eslint-disable-line no-param-reassign
        });
        await next();
      });
      return emitter.emit('test', 1, 2, 3).then(() => {
        expect(receivedParams, 'expect to apply middleware before executing of listeners').to.deep.equal([2, 3, 4]);
      });
    });

    it('should apply multiple middleware at once', () => {
      const emitter = new MiddlEmitter();
      let receivedParams;
      emitter.on('test', (...params) => {
        receivedParams = params;
      });
      emitter.use(
        'test',
        async (params, next) => {
          params.forEach((item, i) => {
            params[i] = item + 1; // eslint-disable-line no-param-reassign
          });
          await next();
        },
        async (params, next) => {
          params.forEach((item, i) => {
            params[i] = item + 1; // eslint-disable-line no-param-reassign
          });
          await next();
        },
      );
      return emitter.emit('test', 1, 2, 3).then(() => {
        expect(receivedParams, 'expect to apply middleware that added at once').to.deep.equal([3, 4, 5]);
      });
    });
  });
});
