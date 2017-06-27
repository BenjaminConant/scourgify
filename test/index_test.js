/**
 * Module dependencies.
 */
const { describe, it, before, after, beforeEach, afterEach } = require('mocha');
const scourgify = require('../index');


/**
 * Test `scourgify`.
 */

describe('scourgify()', () => {
  it('should accept a custom `ignoreCase`', () => {
    const object = {
      bar: ['biz', 'baz'],
      foo: {
        PaSSWorD: 'barbiz',
        password: 'foobar',
        secret: 'bizbaz'
      }
    };
    const options = {
      keyBlacklist: ['password', 'secret'],
      ignoreKeyCase: true,
    }

    scourgify(options)(object).should.eql({
      bar: ['biz', 'baz'],
      foo: {
        PaSSWorD: '--REDACTED--',
        password: '--REDACTED--',
        secret: '--REDACTED--'
      }
    });
  });

  it('should accept a custom `replacement`', () => {
    const object = {
      foo: {
        password: 'foobar',
        secret: 'bizbaz'
      }
    };
    const options = {
      keyBlacklist: ['password', 'secret'],
      ignoreKeyCase: true,
      replacement: '*****',
    }

    scourgify(options)(object).should.eql({
      foo: {
        password: '*****',
        secret: '*****'
      }
    });
  });

  it('should mask non-plain objects', () => {
    const object = {
      bar: {
        biz: 'baz'
      },
      foo: {
        expiration: new Date()
      }
    };
    const options = {
      keyBlacklist: ['expiration'],
    };
    scourgify(options)(object).should.eql({
      bar: {
        biz: 'baz'
      },
      foo: {
        expiration: '--REDACTED--'
      }
    });
  });

  it('should mask values from the object', () => {
    const object = {
      bar: {
        biz: 'baz'
      },
      foo: {
        password: 'foobar',
        secret: 'bizbaz'
      }
    };
    const options = {
      keyBlacklist: ['password', 'secret'],
    };

    scourgify(options)(object).should.eql({
      bar: {
        biz: 'baz'
      },
      foo: {
        password: '--REDACTED--',
        secret: '--REDACTED--'
      }
    });
  });


  it('should mask values inside a nested array', () => {
    const object = {
      bar: {
        biz: 'baz'
      },
      foo: {
        password: 'foobar',
        secret: 'bizbaz',
        someArray: [{
          name: 'beeboo',
          password: 'bixbang',
        }]
      }
    };
    const options = {
      keyBlacklist: ['password', 'secret'],
    };

    scourgify(options)(object).should.eql({
      bar: {
        biz: 'baz'
      },
      foo: {
        password: '--REDACTED--',
        secret: '--REDACTED--',
        someArray: [{
          name: 'beeboo',
          password: '--REDACTED--',
        }]
      }
    });
  });

  it('should redact values based on regex', () => {
    const object = {
      bar: {
        biz: 'baz'
      },
      foo: {
        password: 'foobar',
        taxID: '123456789',
        secret: 'bizbaz',
        someArray: [{
          name: 'beeboo',
          password: 'bixbang',
        }]
      }
    };
    const allDigitsRegex = /^[0-9]*$/;

    const options = {
      keyBlacklist: ['password', 'secret'],
      regexList: [allDigitsRegex]
    };

    scourgify(options)(object).should.eql({
      bar: {
        biz: 'baz'
      },
      foo: {
        taxID: '--REDACTED--',
        password: '--REDACTED--',
        secret: '--REDACTED--',
        someArray: [{
          name: 'beeboo',
          password: '--REDACTED--',
        }]
      }
    });
  });

  /^[0-9]*$/



});
