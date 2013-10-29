/*! Debug Bookmarklet - v0.1.0 - 2013-10-29
* https://github.com/nbubna/debug
* Copyright (c) 2013 ESHA Research; Licensed MIT */
(function(window, console) {
    "use strict";

    var debug = function(ref) {
        return (typeof debug.resolve(ref) === "function" ? debug.intercept : debug.watch).apply(debug, arguments);
    };
    debug.intercept = function(ref) {
        var split = _.split(ref),
            id = split[1],
            parent = split[0];
        return parent[id] = debug.wrap(parent[id], ref);
    };
    debug.interval = 1000;
    debug.watch = function(ref, interval) {
        _.out('Value: ', ref, _.resolve(ref));
        return _.watched[ref] = setInterval(function() {
            _.out('Value: ', ref, _.resolve(ref));
        }, interval || debug.interval);
    };
    debug.stop = function(ref) {
        delete _.watched[ref];
        var o = debug.resolve(ref);
        if (typeof o === "function" && o._debugUnwrap) {
            var split = _.split(ref),
                id = split[1],
                parent = split[0];
            return parent[id] = o._debugUnwrap;
        }
    };
    debug.resolve = function(reference, context) {
        if (_.refRE.test(reference)) {
            context = context || window;
            return eval('context'+(reference.charAt(0) !== '[' ? '.'+reference : reference));
        }
    };
    debug.wrap = function(fn, id) {
        id = id || fn.name;
        var wrapper = function() {
            _.out('Enter: ', id, _.slice.call(arguments));
            var ret = fn.apply(this, arguments);
            _.out('Exit: ', id, ret);
            return ret;
        };
        wrapper._debugUnwrap = fn;
        for (var k in fn) {
            if (fn.hasOwnProperty(k)) {
                wrapper[k] = fn[k];
            }
        }
        return wrapper;
    };

    var _ = debug._ = {
        slice: Array.prototype.slice,
        version: "<%= pkg.version %>",
        refRE: /^([\w\$]+)?((\.[\w\$]+)|\[(\d+|'(\\'|[^'])+'|"(\\"|[^"])+")\])*$/,
        split: function(ref) {
            var cut = (ref.lastIndexOf('.') + 1) || (cut = ref.lastIndexOf('[') + 1),
                id = ref.substring(cut),
                parent = debug.resolve(ref.substring(0, cut-1)) || window;
            return [parent, id];
        },
        watched: {},
        out: console.debug || console.log,
    };

    // export debug
    if (typeof define === 'function' && define.amd) {
        define(function(){ return debug; });
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = debug;
    } else {
        window.debug = debug;
    }

})(window, window.console || {log:function(){}});
