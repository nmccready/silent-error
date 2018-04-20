const debug = require('debug');
const VError = require('verror');

class SilentError extends VError {
  constructor(...args) {
    super(...args);

    this.name = this.name || 'SilentError';
    this.jse_info.silent = true;

    if (!(this instanceof SilentError)) {
      throw new TypeError('SilentError must be instantiated with `new`');
    }

    this.suppressedStacktrace = true;

    if (
      process.env.SILENT_ERROR === 'verbose' ||
      process.env.EMBER_VERBOSE_ERRORS === 'true'
    ) {
      this.suppressedStacktrace = false;
      this.stack = new Error().stack;
    }
  }
}
SilentError.prototype = Object.create(Error.prototype);

SilentError.debugOrThrow = function debugOrThrow(label, e) {
  // if the error is a SilentError, ignore
  if (e && e.jse_info && e.jse_info.silent) {
    // ignore this error, invalid blueprints are handled in run
    debug(label)(e);
  } else {
    // rethrow all other errors
    throw e;
  }
};

module.exports = SilentError;
