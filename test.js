const VError = require('verror');
const SilentVError = require('./');
const { expect } = require('chai');

describe('SilentVError', () => {
  let error;

  it('keeps created name and is silent', () => {
    error = new SilentVError({ name: 'SomeError' });
    expect(error.name, 'SomeError');
    expect(VError.info(error).silent, true);
  });

  it('should suppress the stack trace by default', () => {
    error = new SilentVError();
    expect(error.suppressStacktrace, 'suppressesStacktrace should be true');
  });

  describe('with EMBER_VERBOSE_ERRORS set', () => {
    beforeEach(() => {
      delete process.env.EMBER_VERBOSE_ERRORS;
    });

    it('should suppress stack when true', () => {
      process.env.EMBER_VERBOSE_ERRORS = 'true';
      error = new SilentVError();
      expect(!error.suppressStacktrace, 'suppressesStacktrace should be false');
    });

    it("shouldn't suppress stack when false", () => {
      process.env.EMBER_VERBOSE_ERRORS = 'false';
      error = new SilentVError();
      expect(error.suppressStacktrace, 'suppressesStacktrace should be true');
    });
  });

  describe('with SILENT_ERROR set', () => {
    beforeEach(() => {
      delete process.env.SILENT_ERROR;
    });

    it('should suppress stack when false', () => {
      process.env.SILENT_ERROR = 'verbose';
      error = new SilentVError();
      expect(!error.suppressStacktrace, 'suppressesStacktrace should be false');
    });

    it("shouldn't suppress stack when unset", () => {
      delete process.env.SILENT_ERROR;
      error = new SilentVError();
      expect(error.suppressStacktrace, 'suppressesStacktrace should be true');
    });
  });

  describe('debugOrThrow', () => {
    it('throws non SilentVError', () => {
      expect(() => {
        SilentVError.debugOrThrow('label', new Error('I AM ERROR'));
      }).to.throw('I AM ERROR');
    });

    [false, true, undefined, null].forEach((testVar) =>
      it(`throw ${testVar}`, () =>
        // this test is why we're on chai 3.X and less
        expect(() => SilentVError.debugOrThrow('label', testVar)).to.throw(
          testVar
        ))
    );

    it('doesnt throw with SilentVError', () => {
      expect(() => {
        SilentVError.debugOrThrow('label', new SilentVError('ERROR'));
      }).to.not.throw();
    });
  });
});
