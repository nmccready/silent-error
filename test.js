'use strict';

const SilentError = require('./');
const { expect } = require('chai');

describe('SilentError', () => {
  let error;

  it('should suppress the stack trace by default', () => {
    error = new SilentError();
    expect(error.suppressStacktrace, 'suppressesStacktrace should be true');
  });

  describe('with EMBER_VERBOSE_ERRORS set', () => {
    beforeEach(() => {
      delete process.env.EMBER_VERBOSE_ERRORS;
    });

    it('should suppress stack when true', () => {
      process.env.EMBER_VERBOSE_ERRORS = 'true';
      error = new SilentError();
      expect(!error.suppressStacktrace, 'suppressesStacktrace should be false');
    });

    it("shouldn't suppress stack when false", () => {
      process.env.EMBER_VERBOSE_ERRORS = 'false';
      error = new SilentError();
      expect(error.suppressStacktrace, 'suppressesStacktrace should be true');
    });
  });

  describe('with SILENT_ERROR set', () => {
    beforeEach(() => {
      delete process.env.SILENT_ERROR;
    });

    it('should suppress stack when false', () => {
      process.env.SILENT_ERROR = 'verbose';
      error = new SilentError();
      expect(!error.suppressStacktrace, 'suppressesStacktrace should be false');
    });

    it("shouldn't suppress stack when unset", () => {
      delete process.env.SILENT_ERROR;
      error = new SilentError();
      expect(error.suppressStacktrace, 'suppressesStacktrace should be true');
    });
  });

  describe('debugOrThrow', () => {
    it('throws non SilentError', () => {
      expect(() => {
        SilentError.debugOrThrow('label', new Error('I AM ERROR'));
      }).to.throw('I AM ERROR');
    });

    [false, true, undefined, null].forEach((testVar) =>
      it(`throw ${testVar}`, () =>
        // this test is why we're on chai 3.X and less
        expect(() => SilentError.debugOrThrow('label', testVar)).to.throw(
          testVar
        ))
    );

    it('doesnt throw with SilentError', () => {
      expect(() => {
        SilentError.debugOrThrow('label', new SilentError('ERROR'));
      }).to.not.throw();
    });
  });
});
