(function() {
  /*
    ======== A Handy Little QUnit Reference ========
    http://api.qunitjs.com/

    Test methods:
      module(name, {[setup][ ,teardown]})
      test(name, callback)
      expect(numberOfAssertions)
      stop(increment)
      start(decrement)
    Test assertions:
      ok(value, [message])
      equal(actual, expected, [message])
      notEqual(actual, expected, [message])
      deepEqual(actual, expected, [message])
      notDeepEqual(actual, expected, [message])
      strictEqual(actual, expected, [message])
      notStrictEqual(actual, expected, [message])
      throws(block, [expected], [message])
  */

  function intercepted(ref, ret) {
    var args = Array.prototype.slice.call(arguments, 2),
      out = debug._.out,
      enter = out.enter.pop(),
      exit = out.exit.pop();

      strictEqual(enter[0], ref);
      strictEqual(exit[0], ref);
      strictEqual(exit[1], ret);
      deepEqual(enter[1], args);
  }
  /*function watched(ref, value) {
    var val = debug._.out.value.pop();
    strictEqual(val[0], ref);
    strictEqual(val[1], value);
  }*/

  module('debug', {
    // This will run before each test in this module.
    setup: function() {
      var out = debug._.out = function(label, ref, value) {
        label = label.split(':')[0].toLowerCase();
        if (!out[label]) {
          out[label] = [];
        }
        out[label].push([ref, value]);
      };
    }
  });

  test('API presence', function() {
    ok(typeof debug === "function", 'debug should be a function');
    ok(typeof debug.intercept === "function", "debug.intercept should be a function");
    ok(typeof debug.interval === "number", "debug.version should be a string");
    ok(typeof debug.watch === "function", "debug.watch should be a function");
    ok(typeof debug.stop === "function", "debug.stop should be a function");
    ok(typeof debug.wrap === "function", "debug.wrap should be a function");
    ok(typeof debug.resolve === "function", "debug.resolve should be a function");
  });

  test('intercept', function() {
    var bar = foo.bar;
    debug('foo.bar');
    notEqual(foo.bar, bar, 'bar should be replaced');
    strictEqual(foo.bar._debugUnwrap, bar, 'original bar should be bar._debugUnwrap');
    foo.bar(1);
    intercepted('foo.bar', 2, 1);
  });

  var foo = window.foo = {
      bar: function(a) {
        return a + a;
      }
  };

}());
