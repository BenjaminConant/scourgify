/**
 * Module dependencies.
 *
**/

 const _ = require('lodash');

/**
 * Export `maskJson` function.
 */

module.exports = function scourgify(options) {
  const defaultOptions = {
    keyBlacklist: [],
    regexList: [],
    replacement: '--REDACTED--',
    ignoreKeyCase: false,
  }
  options = _.pick(options, _.keys(defaultOptions))
  options = _.merge({}, defaultOptions, options)


  return function(values) {
    return _.cloneDeepWith(values, (value, key) => {
      // Strip matching keys.
      if (_.some(options.keyBlacklist, item => options.ignoreKeyCase ? _.toLower(key) === _.toLower(item) : key === item)) {
        return options.replacement;
      }

      if (_.isString(value) || _.isNumber(value)) {
        const val = value.toString();
        if (_.some(options.regexList, (regex) => regex.test(value))) {
          return options.replacement;
        }
      }

      // Allow cloneDeep to recurse into nested objects.
      if (_.isObject(value)) {
        return;
      }

      // Otherwise, return the value.
      return value;
    });
  };
};
