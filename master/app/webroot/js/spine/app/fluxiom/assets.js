var Prototype = {
    Version: "1.6.1",
    Browser: (function () {
        var b = navigator.userAgent;
        var a = Object.prototype.toString.call(window.opera) == "[object Opera]";
        return {
            IE: !! window.attachEvent && !a,
            Opera: a,
            WebKit: b.indexOf("AppleWebKit/") > -1,
            Gecko: b.indexOf("Gecko") > -1 && b.indexOf("KHTML") === -1,
            MobileSafari: /Apple.*Mobile.*Safari/.test(b)
        }
    })(),
    BrowserFeatures: {
        XPath: !! document.evaluate,
        SelectorsAPI: !! document.querySelector,
        ElementExtensions: (function () {
            var a = window.Element || window.HTMLElement;
            return !!(a && a.prototype)
        })(),
        SpecificElementExtensions: (function () {
            if (typeof window.HTMLDivElement !== "undefined") {
                return true
            }
            var c = document.createElement("div");
            var b = document.createElement("form");
            var a = false;
            if (c.__proto__ && (c.__proto__ !== b.__proto__)) {
                a = true
            }
            c = b = null;
            return a
        })()
    },
    ScriptFragment: "<script[^>]*>([\\S\\s]*?)<\/script>",
    JSONFilter: /^\/\*-secure-([\s\S]*)\*\/\s*$/,
    emptyFunction: function () {},
    K: function (a) {
        return a
    }
};
if (Prototype.Browser.MobileSafari) {
    Prototype.BrowserFeatures.SpecificElementExtensions = false
}
var Abstract = {};
var Try = {
    these: function () {
        var c;
        for (var b = 0, d = arguments.length; b < d; b++) {
            var a = arguments[b];
            try {
                c = a();
                break
            } catch (f) {}
        }
        return c
    }
};
var Class = (function () {
    function a() {}
    function b() {
        var g = null,
            f = $A(arguments);
        if (Object.isFunction(f[0])) {
            g = f.shift()
        }
        function d() {
            this.initialize.apply(this, arguments)
        }
        Object.extend(d, Class.Methods);
        d.superclass = g;
        d.subclasses = [];
        if (g) {
            a.prototype = g.prototype;
            d.prototype = new a;
            g.subclasses.push(d)
        }
        for (var e = 0; e < f.length; e++) {
            d.addMethods(f[e])
        }
        if (!d.prototype.initialize) {
            d.prototype.initialize = Prototype.emptyFunction
        }
        d.prototype.constructor = d;
        return d
    }
    function c(k) {
        var f = this.superclass && this.superclass.prototype;
        var e = Object.keys(k);
        if (!Object.keys({
            toString: true
        }).length) {
            if (k.toString != Object.prototype.toString) {
                e.push("toString")
            }
            if (k.valueOf != Object.prototype.valueOf) {
                e.push("valueOf")
            }
        }
        for (var d = 0, g = e.length; d < g; d++) {
            var j = e[d],
                h = k[j];
            if (f && Object.isFunction(h) && h.argumentNames().first() == "$super") {
                var l = h;
                h = (function (n) {
                    return function () {
                        return f[n].apply(this, arguments)
                    }
                })(j).wrap(l);
                h.valueOf = l.valueOf.bind(l);
                h.toString = l.toString.bind(l)
            }
            this.prototype[j] = h
        }
        return this
    }
    return {
        create: b,
        Methods: {
            addMethods: c
        }
    }
})();
(function () {
    var d = Object.prototype.toString;

    function j(r, u) {
        for (var s in u) {
            r[s] = u[s]
        }
        return r
    }
    function m(r) {
        try {
            if (e(r)) {
                return "undefined"
            }
            if (r === null) {
                return "null"
            }
            return r.inspect ? r.inspect() : String(r)
        } catch (s) {
            if (s instanceof RangeError) {
                return "..."
            }
            throw s
        }
    }
    function l(r) {
        var u = typeof r;
        switch (u) {
        case "undefined":
        case "function":
        case "unknown":
            return;
        case "boolean":
            return r.toString()
        }
        if (r === null) {
            return "null"
        }
        if (r.toJSON) {
            return r.toJSON()
        }
        if (h(r)) {
            return
        }
        var s = [];
        for (var w in r) {
            var v = l(r[w]);
            if (!e(v)) {
                s.push(w.toJSON() + ": " + v)
            }
        }
        return "{" + s.join(", ") + "}"
    }
    function c(r) {
        return $H(r).toQueryString()
    }
    function f(r) {
        return r && r.toHTML ? r.toHTML() : String.interpret(r)
    }
    function p(r) {
        var s = [];
        for (var u in r) {
            s.push(u)
        }
        return s
    }
    function n(r) {
        var s = [];
        for (var u in r) {
            s.push(r[u])
        }
        return s
    }
    function k(r) {
        return j({}, r)
    }
    function h(r) {
        return !!(r && r.nodeType == 1)
    }
    function g(r) {
        return d.call(r) == "[object Array]"
    }
    function q(r) {
        return r instanceof Hash
    }
    function b(r) {
        return typeof r === "function"
    }
    function a(r) {
        return d.call(r) == "[object String]"
    }
    function o(r) {
        return d.call(r) == "[object Number]"
    }
    function e(r) {
        return typeof r === "undefined"
    }
    j(Object, {
        extend: j,
        inspect: m,
        toJSON: l,
        toQueryString: c,
        toHTML: f,
        keys: p,
        values: n,
        clone: k,
        isElement: h,
        isArray: g,
        isHash: q,
        isFunction: b,
        isString: a,
        isNumber: o,
        isUndefined: e
    })
})();
Object.extend(Function.prototype, (function () {
    var l = Array.prototype.slice;

    function d(p, m) {
        var o = p.length,
            n = m.length;
        while (n--) {
            p[o + n] = m[n]
        }
        return p
    }
    function j(n, m) {
        n = l.call(n, 0);
        return d(n, m)
    }
    function g() {
        var m = this.toString().match(/^[\s\(]*function[^(]*\(([^)]*)\)/)[1].replace(/\/\/.*?[\r\n]|\/\*(?:.|[\r\n])*?\*\//g, "").replace(/\s+/g, "").split(",");
        return m.length == 1 && !m[0] ? [] : m
    }
    function h(o) {
        if (arguments.length < 2 && Object.isUndefined(arguments[0])) {
            return this
        }
        var m = this,
            n = l.call(arguments, 1);
        return function () {
            var p = j(n, arguments);
            return m.apply(o, p)
        }
    }
    function f(o) {
        var m = this,
            n = l.call(arguments, 1);
        return function (q) {
            var p = d([q || window.event], n);
            return m.apply(o, p)
        }
    }
    function k() {
        if (!arguments.length) {
            return this
        }
        var m = this,
            n = l.call(arguments, 0);
        return function () {
            var o = j(n, arguments);
            return m.apply(this, o)
        }
    }
    function e(o) {
        var m = this,
            n = l.call(arguments, 1);
        o = o * 1000;
        return window.setTimeout(function () {
            return m.apply(m, n)
        }, o)
    }
    function a() {
        var m = d([0.01], arguments);
        return this.delay.apply(this, m)
    }
    function c(n) {
        var m = this;
        return function () {
            var o = d([m.bind(this)], arguments);
            return n.apply(this, o)
        }
    }
    function b() {
        if (this._methodized) {
            return this._methodized
        }
        var m = this;
        return this._methodized = function () {
            var n = d([this], arguments);
            return m.apply(null, n)
        }
    }
    return {
        argumentNames: g,
        bind: h,
        bindAsEventListener: f,
        curry: k,
        delay: e,
        defer: a,
        wrap: c,
        methodize: b
    }
})());
Date.prototype.toJSON = function () {
    return '"' + this.getUTCFullYear() + "-" + (this.getUTCMonth() + 1).toPaddedString(2) + "-" + this.getUTCDate().toPaddedString(2) + "T" + this.getUTCHours().toPaddedString(2) + ":" + this.getUTCMinutes().toPaddedString(2) + ":" + this.getUTCSeconds().toPaddedString(2) + 'Z"'
};
RegExp.prototype.match = RegExp.prototype.test;
RegExp.escape = function (a) {
    return String(a).replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1")
};
var PeriodicalExecuter = Class.create({
    initialize: function (b, a) {
        this.callback = b;
        this.frequency = a;
        this.currentlyExecuting = false;
        this.registerCallback()
    },
    registerCallback: function () {
        this.timer = setInterval(this.onTimerEvent.bind(this), this.frequency * 1000)
    },
    execute: function () {
        this.callback(this)
    },
    stop: function () {
        if (!this.timer) {
            return
        }
        clearInterval(this.timer);
        this.timer = null
    },
    onTimerEvent: function () {
        if (!this.currentlyExecuting) {
            try {
                this.currentlyExecuting = true;
                this.execute();
                this.currentlyExecuting = false
            } catch (a) {
                this.currentlyExecuting = false;
                throw a
            }
        }
    }
});
Object.extend(String, {
    interpret: function (a) {
        return a == null ? "" : String(a)
    },
    specialChar: {
        "\b": "\\b",
        "\t": "\\t",
        "\n": "\\n",
        "\f": "\\f",
        "\r": "\\r",
        "\\": "\\\\"
    }
});
Object.extend(String.prototype, (function () {
    function prepareReplacement(replacement) {
        if (Object.isFunction(replacement)) {
            return replacement
        }
        var template = new Template(replacement);
        return function (match) {
            return template.evaluate(match)
        }
    }
    function gsub(pattern, replacement) {
        var result = "",
            source = this,
            match;
        replacement = prepareReplacement(replacement);
        if (Object.isString(pattern)) {
            pattern = RegExp.escape(pattern)
        }
        if (!(pattern.length || pattern.source)) {
            replacement = replacement("");
            return replacement + source.split("").join(replacement) + replacement
        }
        while (source.length > 0) {
            if (match = source.match(pattern)) {
                result += source.slice(0, match.index);
                result += String.interpret(replacement(match));
                source = source.slice(match.index + match[0].length)
            } else {
                result += source, source = ""
            }
        }
        return result
    }
    function sub(pattern, replacement, count) {
        replacement = prepareReplacement(replacement);
        count = Object.isUndefined(count) ? 1 : count;
        return this.gsub(pattern, function (match) {
            if (--count < 0) {
                return match[0]
            }
            return replacement(match)
        })
    }
    function scan(pattern, iterator) {
        this.gsub(pattern, iterator);
        return String(this)
    }
    function truncate(length, truncation) {
        length = length || 30;
        truncation = Object.isUndefined(truncation) ? "..." : truncation;
        return this.length > length ? this.slice(0, length - truncation.length) + truncation : String(this)
    }
    function strip() {
        return this.replace(/^\s+/, "").replace(/\s+$/, "")
    }
    function stripTags() {
        return this.replace(/<\w+(\s+("[^"]*"|'[^']*'|[^>])+)?>|<\/\w+>/gi, "")
    }
    function stripScripts() {
        return this.replace(new RegExp(Prototype.ScriptFragment, "img"), "")
    }
    function extractScripts() {
        var matchAll = new RegExp(Prototype.ScriptFragment, "img");
        var matchOne = new RegExp(Prototype.ScriptFragment, "im");
        return (this.match(matchAll) || []).map(function (scriptTag) {
            return (scriptTag.match(matchOne) || ["", ""])[1]
        })
    }
    function evalScripts() {
        return this.extractScripts().map(function (script) {
            return eval(script)
        })
    }
    function escapeHTML() {
        return this.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    }
    function unescapeHTML() {
        return this.stripTags().replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&")
    }
    function toQueryParams(separator) {
        var match = this.strip().match(/([^?#]*)(#.*)?$/);
        if (!match) {
            return {}
        }
        return match[1].split(separator || "&").inject({}, function (hash, pair) {
            if ((pair = pair.split("="))[0]) {
                var key = decodeURIComponent(pair.shift());
                var value = pair.length > 1 ? pair.join("=") : pair[0];
                if (value != undefined) {
                    value = decodeURIComponent(value)
                }
                if (key in hash) {
                    if (!Object.isArray(hash[key])) {
                        hash[key] = [hash[key]]
                    }
                    hash[key].push(value)
                } else {
                    hash[key] = value
                }
            }
            return hash
        })
    }
    function toArray() {
        return this.split("")
    }
    function succ() {
        return this.slice(0, this.length - 1) + String.fromCharCode(this.charCodeAt(this.length - 1) + 1)
    }
    function times(count) {
        return count < 1 ? "" : new Array(count + 1).join(this)
    }
    function camelize() {
        var parts = this.split("-"),
            len = parts.length;
        if (len == 1) {
            return parts[0]
        }
        var camelized = this.charAt(0) == "-" ? parts[0].charAt(0).toUpperCase() + parts[0].substring(1) : parts[0];
        for (var i = 1; i < len; i++) {
            camelized += parts[i].charAt(0).toUpperCase() + parts[i].substring(1)
        }
        return camelized
    }
    function capitalize() {
        return this.charAt(0).toUpperCase() + this.substring(1).toLowerCase()
    }
    function underscore() {
        return this.replace(/::/g, "/").replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2").replace(/([a-z\d])([A-Z])/g, "$1_$2").replace(/-/g, "_").toLowerCase()
    }
    function dasherize() {
        return this.replace(/_/g, "-")
    }
    function inspect(useDoubleQuotes) {
        var escapedString = this.replace(/[\x00-\x1f\\]/g, function (character) {
            if (character in String.specialChar) {
                return String.specialChar[character]
            }
            return "\\u00" + character.charCodeAt().toPaddedString(2, 16)
        });
        if (useDoubleQuotes) {
            return '"' + escapedString.replace(/"/g, '\\"') + '"'
        }
        return "'" + escapedString.replace(/'/g, "\\'") + "'"
    }
    function toJSON() {
        return this.inspect(true)
    }
    function unfilterJSON(filter) {
        return this.replace(filter || Prototype.JSONFilter, "$1")
    }
    function isJSON() {
        var str = this;
        if (str.blank()) {
            return false
        }
        str = this.replace(/\\./g, "@").replace(/"[^"\\\n\r]*"/g, "");
        return (/^[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]*$/).test(str)
    }
    function evalJSON(sanitize) {
        var json = this.unfilterJSON();
        try {
            if (!sanitize || json.isJSON()) {
                return eval("(" + json + ")")
            }
        } catch (e) {}
        throw new SyntaxError("Badly formed JSON string: " + this.inspect())
    }
    function include(pattern) {
        return this.indexOf(pattern) > -1
    }
    function startsWith(pattern) {
        return this.indexOf(pattern) === 0
    }
    function endsWith(pattern) {
        var d = this.length - pattern.length;
        return d >= 0 && this.lastIndexOf(pattern) === d
    }
    function empty() {
        return this == ""
    }
    function blank() {
        return /^\s*$/.test(this)
    }
    function interpolate(object, pattern) {
        return new Template(this, pattern).evaluate(object)
    }
    return {
        gsub: gsub,
        sub: sub,
        scan: scan,
        truncate: truncate,
        strip: String.prototype.trim ? String.prototype.trim : strip,
        stripTags: stripTags,
        stripScripts: stripScripts,
        extractScripts: extractScripts,
        evalScripts: evalScripts,
        escapeHTML: escapeHTML,
        unescapeHTML: unescapeHTML,
        toQueryParams: toQueryParams,
        parseQuery: toQueryParams,
        toArray: toArray,
        succ: succ,
        times: times,
        camelize: camelize,
        capitalize: capitalize,
        underscore: underscore,
        dasherize: dasherize,
        inspect: inspect,
        toJSON: toJSON,
        unfilterJSON: unfilterJSON,
        isJSON: isJSON,
        evalJSON: evalJSON,
        include: include,
        startsWith: startsWith,
        endsWith: endsWith,
        empty: empty,
        blank: blank,
        interpolate: interpolate
    }
})());
var Template = Class.create({
    initialize: function (a, b) {
        this.template = a.toString();
        this.pattern = b || Template.Pattern
    },
    evaluate: function (a) {
        if (a && Object.isFunction(a.toTemplateReplacements)) {
            a = a.toTemplateReplacements()
        }
        return this.template.gsub(this.pattern, function (d) {
            if (a == null) {
                return (d[1] + "")
            }
            var f = d[1] || "";
            if (f == "\\") {
                return d[2]
            }
            var b = a,
                g = d[3];
            var e = /^([^.[]+|\[((?:.*?[^\\])?)\])(\.|\[|$)/;
            d = e.exec(g);
            if (d == null) {
                return f
            }
            while (d != null) {
                var c = d[1].startsWith("[") ? d[2].replace(/\\\\]/g, "]") : d[1];
                b = b[c];
                if (null == b || "" == d[3]) {
                    break
                }
                g = g.substring("[" == d[3] ? d[1].length : d[0].length);
                d = e.exec(g)
            }
            return f + String.interpret(b)
        })
    }
});
Template.Pattern = /(^|.|\r|\n)(#\{(.*?)\})/;
var $break = {};
var Enumerable = (function () {
    function c(A, z) {
        var y = 0;
        try {
            this._each(function (C) {
                A.call(z, C, y++)
            })
        } catch (B) {
            if (B != $break) {
                throw B
            }
        }
        return this
    }
    function s(B, A, z) {
        var y = -B,
            C = [],
            D = this.toArray();
        if (B < 1) {
            return D
        }
        while ((y += B) < D.length) {
            C.push(D.slice(y, y + B))
        }
        return C.collect(A, z)
    }
    function b(A, z) {
        A = A || Prototype.K;
        var y = true;
        this.each(function (C, B) {
            y = y && !! A.call(z, C, B);
            if (!y) {
                throw $break
            }
        });
        return y
    }
    function j(A, z) {
        A = A || Prototype.K;
        var y = false;
        this.each(function (C, B) {
            if (y = !! A.call(z, C, B)) {
                throw $break
            }
        });
        return y
    }
    function k(A, z) {
        A = A || Prototype.K;
        var y = [];
        this.each(function (C, B) {
            y.push(A.call(z, C, B))
        });
        return y
    }
    function v(A, z) {
        var y;
        this.each(function (C, B) {
            if (A.call(z, C, B)) {
                y = C;
                throw $break
            }
        });
        return y
    }
    function h(A, z) {
        var y = [];
        this.each(function (C, B) {
            if (A.call(z, C, B)) {
                y.push(C)
            }
        });
        return y
    }
    function g(B, A, z) {
        A = A || Prototype.K;
        var y = [];
        if (Object.isString(B)) {
            B = new RegExp(RegExp.escape(B))
        }
        this.each(function (D, C) {
            if (B.match(D)) {
                y.push(A.call(z, D, C))
            }
        });
        return y
    }
    function a(y) {
        if (Object.isFunction(this.indexOf)) {
            if (this.indexOf(y) != -1) {
                return true
            }
        }
        var z = false;
        this.each(function (A) {
            if (A == y) {
                z = true;
                throw $break
            }
        });
        return z
    }
    function r(z, y) {
        y = Object.isUndefined(y) ? null : y;
        return this.eachSlice(z, function (A) {
            while (A.length < z) {
                A.push(y)
            }
            return A
        })
    }
    function m(y, A, z) {
        this.each(function (C, B) {
            y = A.call(z, y, C, B)
        });
        return y
    }
    function x(z) {
        var y = $A(arguments).slice(1);
        return this.map(function (A) {
            return A[z].apply(A, y)
        })
    }
    function q(A, z) {
        A = A || Prototype.K;
        var y;
        this.each(function (C, B) {
            C = A.call(z, C, B);
            if (y == null || C >= y) {
                y = C
            }
        });
        return y
    }
    function o(A, z) {
        A = A || Prototype.K;
        var y;
        this.each(function (C, B) {
            C = A.call(z, C, B);
            if (y == null || C < y) {
                y = C
            }
        });
        return y
    }
    function e(B, z) {
        B = B || Prototype.K;
        var A = [],
            y = [];
        this.each(function (D, C) {
            (B.call(z, D, C) ? A : y).push(D)
        });
        return [A, y]
    }
    function f(z) {
        var y = [];
        this.each(function (A) {
            y.push(A[z])
        });
        return y
    }
    function d(A, z) {
        var y = [];
        this.each(function (C, B) {
            if (!A.call(z, C, B)) {
                y.push(C)
            }
        });
        return y
    }
    function n(z, y) {
        return this.map(function (B, A) {
            return {
                value: B,
                criteria: z.call(y, B, A)
            }
        }).sort(function (D, C) {
            var B = D.criteria,
                A = C.criteria;
            return B < A ? -1 : B > A ? 1 : 0
        }).pluck("value")
    }
    function p() {
        return this.map()
    }
    function u() {
        var z = Prototype.K,
            y = $A(arguments);
        if (Object.isFunction(y.last())) {
            z = y.pop()
        }
        var A = [this].concat(y).map($A);
        return this.map(function (C, B) {
            return z(A.pluck(B))
        })
    }
    function l() {
        return this.toArray().length
    }
    function w() {
        return "#<Enumerable:" + this.toArray().inspect() + ">"
    }
    return {
        each: c,
        eachSlice: s,
        all: b,
        every: b,
        any: j,
        some: j,
        collect: k,
        map: k,
        detect: v,
        findAll: h,
        select: h,
        filter: h,
        grep: g,
        include: a,
        member: a,
        inGroupsOf: r,
        inject: m,
        invoke: x,
        max: q,
        min: o,
        partition: e,
        pluck: f,
        reject: d,
        sortBy: n,
        toArray: p,
        entries: p,
        zip: u,
        size: l,
        inspect: w,
        find: v
    }
})();

function $A(c) {
    if (!c) {
        return []
    }
    if ("toArray" in Object(c)) {
        return c.toArray()
    }
    var b = c.length || 0,
        a = new Array(b);
    while (b--) {
        a[b] = c[b]
    }
    return a
}
function $w(a) {
    if (!Object.isString(a)) {
        return []
    }
    a = a.strip();
    return a ? a.split(/\s+/) : []
}
Array.from = $A;
(function () {
    var u = Array.prototype,
        n = u.slice,
        p = u.forEach;

    function b(y) {
        for (var x = 0, z = this.length; x < z; x++) {
            y(this[x])
        }
    }
    if (!p) {
        p = b
    }
    function m() {
        this.length = 0;
        return this
    }
    function d() {
        return this[0]
    }
    function g() {
        return this[this.length - 1]
    }
    function j() {
        return this.select(function (x) {
            return x != null
        })
    }
    function w() {
        return this.inject([], function (y, x) {
            if (Object.isArray(x)) {
                return y.concat(x.flatten())
            }
            y.push(x);
            return y
        })
    }
    function h() {
        var x = n.call(arguments, 0);
        return this.select(function (y) {
            return !x.include(y)
        })
    }
    function f(x) {
        return (x !== false ? this : this.toArray())._reverse()
    }
    function l(x) {
        return this.inject([], function (A, z, y) {
            if (0 == y || (x ? A.last() != z : !A.include(z))) {
                A.push(z)
            }
            return A
        })
    }
    function q(x) {
        return this.uniq().findAll(function (y) {
            return x.detect(function (z) {
                return y === z
            })
        })
    }
    function r() {
        return n.call(this, 0)
    }
    function k() {
        return this.length
    }
    function v() {
        return "[" + this.map(Object.inspect).join(", ") + "]"
    }
    function s() {
        var x = [];
        this.each(function (y) {
            var z = Object.toJSON(y);
            if (!Object.isUndefined(z)) {
                x.push(z)
            }
        });
        return "[" + x.join(", ") + "]"
    }
    function a(z, x) {
        x || (x = 0);
        var y = this.length;
        if (x < 0) {
            x = y + x
        }
        for (; x < y; x++) {
            if (this[x] === z) {
                return x
            }
        }
        return -1
    }
    function o(y, x) {
        x = isNaN(x) ? this.length : (x < 0 ? this.length + x : x) + 1;
        var z = this.slice(0, x).reverse().indexOf(y);
        return (z < 0) ? z : x - z - 1
    }
    function c() {
        var C = n.call(this, 0),
            A;
        for (var y = 0, z = arguments.length; y < z; y++) {
            A = arguments[y];
            if (Object.isArray(A) && !("callee" in A)) {
                for (var x = 0, B = A.length; x < B; x++) {
                    C.push(A[x])
                }
            } else {
                C.push(A)
            }
        }
        return C
    }
    Object.extend(u, Enumerable);
    if (!u._reverse) {
        u._reverse = u.reverse
    }
    Object.extend(u, {
        _each: p,
        clear: m,
        first: d,
        last: g,
        compact: j,
        flatten: w,
        without: h,
        reverse: f,
        uniq: l,
        intersect: q,
        clone: r,
        toArray: r,
        size: k,
        inspect: v,
        toJSON: s
    });
    var e = (function () {
        return [].concat(arguments)[0][0] !== 1
    })(1, 2);
    if (e) {
        u.concat = c
    }
    if (!u.indexOf) {
        u.indexOf = a
    }
    if (!u.lastIndexOf) {
        u.lastIndexOf = o
    }
})();

function $H(a) {
    return new Hash(a)
}
var Hash = Class.create(Enumerable, (function () {
    function e(r) {
        this._object = Object.isHash(r) ? r.toObject() : Object.clone(r)
    }
    function f(s) {
        for (var r in this._object) {
            var u = this._object[r],
                v = [r, u];
            v.key = r;
            v.value = u;
            s(v)
        }
    }
    function l(r, s) {
        return this._object[r] = s
    }
    function c(r) {
        if (this._object[r] !== Object.prototype[r]) {
            return this._object[r]
        }
    }
    function o(r) {
        var s = this._object[r];
        delete this._object[r];
        return s
    }
    function q() {
        return Object.clone(this._object)
    }
    function p() {
        return this.pluck("key")
    }
    function n() {
        return this.pluck("value")
    }
    function g(s) {
        var r = this.detect(function (u) {
            return u.value === s
        });
        return r && r.key
    }
    function j(r) {
        return this.clone().update(r)
    }
    function d(r) {
        return new Hash(r).inject(this, function (s, u) {
            s.set(u.key, u.value);
            return s
        })
    }
    function b(r, s) {
        if (Object.isUndefined(s)) {
            return r
        }
        return r + "=" + encodeURIComponent(String.interpret(s))
    }
    function a() {
        return this.inject([], function (u, v) {
            var s = encodeURIComponent(v.key),
                r = v.value;
            if (r && typeof r == "object") {
                if (Object.isArray(r)) {
                    return u.concat(r.map(b.curry(s)))
                }
            } else {
                u.push(b(s, r))
            }
            return u
        }).join("&")
    }
    function m() {
        return "#<Hash:{" + this.map(function (r) {
            return r.map(Object.inspect).join(": ")
        }).join(", ") + "}>"
    }
    function k() {
        return Object.toJSON(this.toObject())
    }
    function h() {
        return new Hash(this)
    }
    return {
        initialize: e,
        _each: f,
        set: l,
        get: c,
        unset: o,
        toObject: q,
        toTemplateReplacements: q,
        keys: p,
        values: n,
        index: g,
        merge: j,
        update: d,
        toQueryString: a,
        inspect: m,
        toJSON: k,
        clone: h
    }
})());
Hash.from = $H;
Object.extend(Number.prototype, (function () {
    function d() {
        return this.toPaddedString(2, 16)
    }
    function e() {
        return this + 1
    }
    function a(l, k) {
        $R(0, this, true).each(l, k);
        return this
    }
    function b(m, l) {
        var k = this.toString(l || 10);
        return "0".times(m - k.length) + k
    }
    function f() {
        return isFinite(this) ? this.toString() : "null"
    }
    function j() {
        return Math.abs(this)
    }
    function h() {
        return Math.round(this)
    }
    function g() {
        return Math.ceil(this)
    }
    function c() {
        return Math.floor(this)
    }
    return {
        toColorPart: d,
        succ: e,
        times: a,
        toPaddedString: b,
        toJSON: f,
        abs: j,
        round: h,
        ceil: g,
        floor: c
    }
})());

function $R(c, a, b) {
    return new ObjectRange(c, a, b)
}
var ObjectRange = Class.create(Enumerable, (function () {
    function b(f, d, e) {
        this.start = f;
        this.end = d;
        this.exclusive = e
    }
    function c(d) {
        var e = this.start;
        while (this.include(e)) {
            d(e);
            e = e.succ()
        }
    }
    function a(d) {
        if (d < this.start) {
            return false
        }
        if (this.exclusive) {
            return d < this.end
        }
        return d <= this.end
    }
    return {
        initialize: b,
        _each: c,
        include: a
    }
})());
var Ajax = {
    getTransport: function () {
        return Try.these(function () {
            return new XMLHttpRequest()
        }, function () {
            return new ActiveXObject("Msxml2.XMLHTTP")
        }, function () {
            return new ActiveXObject("Microsoft.XMLHTTP")
        }) || false
    },
    activeRequestCount: 0
};
Ajax.Responders = {
    responders: [],
    _each: function (a) {
        this.responders._each(a)
    },
    register: function (a) {
        if (!this.include(a)) {
            this.responders.push(a)
        }
    },
    unregister: function (a) {
        this.responders = this.responders.without(a)
    },
    dispatch: function (d, b, c, a) {
        this.each(function (f) {
            if (Object.isFunction(f[d])) {
                try {
                    f[d].apply(f, [b, c, a])
                } catch (g) {}
            }
        })
    }
};
Object.extend(Ajax.Responders, Enumerable);
Ajax.Responders.register({
    onCreate: function () {
        Ajax.activeRequestCount++
    },
    onComplete: function () {
        Ajax.activeRequestCount--
    }
});
Ajax.Base = Class.create({
    initialize: function (a) {
        this.options = {
            method: "post",
            asynchronous: true,
            contentType: "application/x-www-form-urlencoded",
            encoding: "UTF-8",
            parameters: "",
            evalJSON: true,
            evalJS: true
        };
        Object.extend(this.options, a || {});
        this.options.method = this.options.method.toLowerCase();
        if (Object.isString(this.options.parameters)) {
            this.options.parameters = this.options.parameters.toQueryParams()
        } else {
            if (Object.isHash(this.options.parameters)) {
                this.options.parameters = this.options.parameters.toObject()
            }
        }
    }
});
Ajax.Request = Class.create(Ajax.Base, {
    _complete: false,
    initialize: function ($super, b, a) {
        $super(a);
        this.transport = Ajax.getTransport();
        this.request(b)
    },
    request: function (b) {
        this.url = b;
        this.method = this.options.method;
        var d = Object.clone(this.options.parameters);
        if (!["get", "post"].include(this.method)) {
            d._method = this.method;
            this.method = "post"
        }
        this.parameters = d;
        if (d = Object.toQueryString(d)) {
            if (this.method == "get") {
                this.url += (this.url.include("?") ? "&" : "?") + d
            } else {
                if (/Konqueror|Safari|KHTML/.test(navigator.userAgent)) {
                    d += "&_="
                }
            }
        }
        try {
            var a = new Ajax.Response(this);
            if (this.options.onCreate) {
                this.options.onCreate(a)
            }
            Ajax.Responders.dispatch("onCreate", this, a);
            this.transport.open(this.method.toUpperCase(), this.url, this.options.asynchronous);
            if (this.options.asynchronous) {
                this.respondToReadyState.bind(this).defer(1)
            }
            this.transport.onreadystatechange = this.onStateChange.bind(this);
            this.setRequestHeaders();
            this.body = this.method == "post" ? (this.options.postBody || d) : null;
            this.transport.send(this.body);
            if (!this.options.asynchronous && this.transport.overrideMimeType) {
                this.onStateChange()
            }
        } catch (c) {
            this.dispatchException(c)
        }
    },
    onStateChange: function () {
        var a = this.transport.readyState;
        if (a > 1 && !((a == 4) && this._complete)) {
            this.respondToReadyState(this.transport.readyState)
        }
    },
    setRequestHeaders: function () {
        var e = {
            "X-Requested-With": "XMLHttpRequest",
            "X-Prototype-Version": Prototype.Version,
            Accept: "text/javascript, text/html, application/xml, text/xml, */*"
        };
        if (this.method == "post") {
            e["Content-type"] = this.options.contentType + (this.options.encoding ? "; charset=" + this.options.encoding : "");
            if (this.transport.overrideMimeType && (navigator.userAgent.match(/Gecko\/(\d{4})/) || [0, 2005])[1] < 2005) {
                e.Connection = "close"
            }
        }
        if (typeof this.options.requestHeaders == "object") {
            var c = this.options.requestHeaders;
            if (Object.isFunction(c.push)) {
                for (var b = 0, d = c.length; b < d; b += 2) {
                    e[c[b]] = c[b + 1]
                }
            } else {
                $H(c).each(function (f) {
                    e[f.key] = f.value
                })
            }
        }
        for (var a in e) {
            this.transport.setRequestHeader(a, e[a])
        }
    },
    success: function () {
        var a = this.getStatus();
        return !a || (a >= 200 && a < 300)
    },
    getStatus: function () {
        try {
            return this.transport.status || 0
        } catch (a) {
            return 0
        }
    },
    respondToReadyState: function (a) {
        var c = Ajax.Request.Events[a],
            b = new Ajax.Response(this);
        if (c == "Complete") {
            try {
                this._complete = true;
                (this.options["on" + b.status] || this.options["on" + (this.success() ? "Success" : "Failure")] || Prototype.emptyFunction)(b, b.headerJSON)
            } catch (d) {
                this.dispatchException(d)
            }
            var f = b.getHeader("Content-type");
            if (this.options.evalJS == "force" || (this.options.evalJS && this.isSameOrigin() && f && f.match(/^\s*(text|application)\/(x-)?(java|ecma)script(;.*)?\s*$/i))) {
                this.evalResponse()
            }
        }
        try {
            (this.options["on" + c] || Prototype.emptyFunction)(b, b.headerJSON);
            Ajax.Responders.dispatch("on" + c, this, b, b.headerJSON)
        } catch (d) {
            this.dispatchException(d)
        }
        if (c == "Complete") {
            this.transport.onreadystatechange = Prototype.emptyFunction
        }
    },
    isSameOrigin: function () {
        var a = this.url.match(/^\s*https?:\/\/[^\/]*/);
        return !a || (a[0] == "#{protocol}//#{domain}#{port}".interpolate({
            protocol: location.protocol,
            domain: document.domain,
            port: location.port ? ":" + location.port : ""
        }))
    },
    getHeader: function (a) {
        try {
            return this.transport.getResponseHeader(a) || null
        } catch (b) {
            return null
        }
    },
    evalResponse: function () {
        try {
            return eval((this.transport.responseText || "").unfilterJSON())
        } catch (e) {
            this.dispatchException(e)
        }
    },
    dispatchException: function (a) {
        (this.options.onException || Prototype.emptyFunction)(this, a);
        Ajax.Responders.dispatch("onException", this, a)
    }
});
Ajax.Request.Events = ["Uninitialized", "Loading", "Loaded", "Interactive", "Complete"];
Ajax.Response = Class.create({
    initialize: function (c) {
        this.request = c;
        var d = this.transport = c.transport,
            a = this.readyState = d.readyState;
        if ((a > 2 && !Prototype.Browser.IE) || a == 4) {
            this.status = this.getStatus();
            this.statusText = this.getStatusText();
            this.responseText = String.interpret(d.responseText);
            this.headerJSON = this._getHeaderJSON()
        }
        if (a == 4) {
            var b = d.responseXML;
            this.responseXML = Object.isUndefined(b) ? null : b;
            this.responseJSON = this._getResponseJSON()
        }
    },
    status: 0,
    statusText: "",
    getStatus: Ajax.Request.prototype.getStatus,
    getStatusText: function () {
        try {
            return this.transport.statusText || ""
        } catch (a) {
            return ""
        }
    },
    getHeader: Ajax.Request.prototype.getHeader,
    getAllHeaders: function () {
        try {
            return this.getAllResponseHeaders()
        } catch (a) {
            return null
        }
    },
    getResponseHeader: function (a) {
        return this.transport.getResponseHeader(a)
    },
    getAllResponseHeaders: function () {
        return this.transport.getAllResponseHeaders()
    },
    _getHeaderJSON: function () {
        var a = this.getHeader("X-JSON");
        if (!a) {
            return null
        }
        a = decodeURIComponent(escape(a));
        try {
            return a.evalJSON(this.request.options.sanitizeJSON || !this.request.isSameOrigin())
        } catch (b) {
            this.request.dispatchException(b)
        }
    },
    _getResponseJSON: function () {
        var a = this.request.options;
        if (!a.evalJSON || (a.evalJSON != "force" && !(this.getHeader("Content-type") || "").include("application/json")) || this.responseText.blank()) {
            return null
        }
        try {
            return this.responseText.evalJSON(a.sanitizeJSON || !this.request.isSameOrigin())
        } catch (b) {
            this.request.dispatchException(b)
        }
    }
});
Ajax.Updater = Class.create(Ajax.Request, {
    initialize: function ($super, a, c, b) {
        this.container = {
            success: (a.success || a),
            failure: (a.failure || (a.success ? null : a))
        };
        b = Object.clone(b);
        var d = b.onComplete;
        b.onComplete = (function (e, f) {
            this.updateContent(e.responseText);
            if (Object.isFunction(d)) {
                d(e, f)
            }
        }).bind(this);
        $super(c, b)
    },
    updateContent: function (d) {
        var c = this.container[this.success() ? "success" : "failure"],
            a = this.options;
        if (!a.evalScripts) {
            d = d.stripScripts()
        }
        if (c = $(c)) {
            if (a.insertion) {
                if (Object.isString(a.insertion)) {
                    var b = {};
                    b[a.insertion] = d;
                    c.insert(b)
                } else {
                    a.insertion(c, d)
                }
            } else {
                c.update(d)
            }
        }
    }
});
Ajax.PeriodicalUpdater = Class.create(Ajax.Base, {
    initialize: function ($super, a, c, b) {
        $super(b);
        this.onComplete = this.options.onComplete;
        this.frequency = (this.options.frequency || 2);
        this.decay = (this.options.decay || 1);
        this.updater = {};
        this.container = a;
        this.url = c;
        this.start()
    },
    start: function () {
        this.options.onComplete = this.updateComplete.bind(this);
        this.onTimerEvent()
    },
    stop: function () {
        this.updater.options.onComplete = undefined;
        clearTimeout(this.timer);
        (this.onComplete || Prototype.emptyFunction).apply(this, arguments)
    },
    updateComplete: function (a) {
        if (this.options.decay) {
            this.decay = (a.responseText == this.lastText ? this.decay * this.options.decay : 1);
            this.lastText = a.responseText
        }
        this.timer = this.onTimerEvent.bind(this).delay(this.decay * this.frequency)
    },
    onTimerEvent: function () {
        this.updater = new Ajax.Updater(this.container, this.url, this.options)
    }
});

function $(b) {
    if (arguments.length > 1) {
        for (var a = 0, d = [], c = arguments.length; a < c; a++) {
            d.push($(arguments[a]))
        }
        return d
    }
    if (Object.isString(b)) {
        b = document.getElementById(b)
    }
    return Element.extend(b)
}
if (Prototype.BrowserFeatures.XPath) {
    document._getElementsByXPath = function (f, a) {
        var c = [];
        var e = document.evaluate(f, $(a) || document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        for (var b = 0, d = e.snapshotLength; b < d; b++) {
            c.push(Element.extend(e.snapshotItem(b)))
        }
        return c
    }
}
if (!window.Node) {
    var Node = {}
}
if (!Node.ELEMENT_NODE) {
    Object.extend(Node, {
        ELEMENT_NODE: 1,
        ATTRIBUTE_NODE: 2,
        TEXT_NODE: 3,
        CDATA_SECTION_NODE: 4,
        ENTITY_REFERENCE_NODE: 5,
        ENTITY_NODE: 6,
        PROCESSING_INSTRUCTION_NODE: 7,
        COMMENT_NODE: 8,
        DOCUMENT_NODE: 9,
        DOCUMENT_TYPE_NODE: 10,
        DOCUMENT_FRAGMENT_NODE: 11,
        NOTATION_NODE: 12
    })
}(function (c) {
    var b = (function () {
        var f = document.createElement("form");
        var e = document.createElement("input");
        var d = document.documentElement;
        e.setAttribute("name", "test");
        f.appendChild(e);
        d.appendChild(f);
        var g = f.elements ? (typeof f.elements.test == "undefined") : null;
        d.removeChild(f);
        f = e = null;
        return g
    })();
    var a = c.Element;
    c.Element = function (f, e) {
        e = e || {};
        f = f.toLowerCase();
        var d = Element.cache;
        if (b && e.name) {
            f = "<" + f + ' name="' + e.name + '">';
            delete e.name;
            return Element.writeAttribute(document.createElement(f), e)
        }
        if (!d[f]) {
            d[f] = Element.extend(document.createElement(f))
        }
        return Element.writeAttribute(d[f].cloneNode(false), e)
    };
    Object.extend(c.Element, a || {});
    if (a) {
        c.Element.prototype = a.prototype
    }
})(this);
Element.cache = {};
Element.idCounter = 1;
Element.Methods = {
    visible: function (a) {
        return $(a).style.display != "none"
    },
    toggle: function (a) {
        a = $(a);
        Element[Element.visible(a) ? "hide" : "show"](a);
        return a
    },
    hide: function (a) {
        a = $(a);
        a.style.display = "none";
        return a
    },
    show: function (a) {
        a = $(a);
        a.style.display = "";
        return a
    },
    remove: function (a) {
        a = $(a);
        a.parentNode.removeChild(a);
        return a
    },
    update: (function () {
        var b = (function () {
            var e = document.createElement("select"),
                f = true;
            e.innerHTML = '<option value="test">test</option>';
            if (e.options && e.options[0]) {
                f = e.options[0].nodeName.toUpperCase() !== "OPTION"
            }
            e = null;
            return f
        })();
        var a = (function () {
            try {
                var f = document.createElement("table");
                if (f && f.tBodies) {
                    f.innerHTML = "<tbody><tr><td>test</td></tr></tbody>";
                    var h = typeof f.tBodies[0] == "undefined";
                    f = null;
                    return h
                }
            } catch (g) {
                return true
            }
        })();
        var d = (function () {
            var f = document.createElement("script"),
                h = false;
            try {
                f.appendChild(document.createTextNode(""));
                h = !f.firstChild || f.firstChild && f.firstChild.nodeType !== 3
            } catch (g) {
                h = true
            }
            f = null;
            return h
        })();

        function c(f, g) {
            f = $(f);
            if (g && g.toElement) {
                g = g.toElement()
            }
            if (Object.isElement(g)) {
                return f.update().insert(g)
            }
            g = Object.toHTML(g);
            var e = f.tagName.toUpperCase();
            if (e === "SCRIPT" && d) {
                f.text = g;
                return f
            }
            if (b || a) {
                if (e in Element._insertionTranslations.tags) {
                    while (f.firstChild) {
                        f.removeChild(f.firstChild)
                    }
                    Element._getContentFromAnonymousElement(e, g.stripScripts()).each(function (h) {
                        f.appendChild(h)
                    })
                } else {
                    f.innerHTML = g.stripScripts()
                }
            } else {
                f.innerHTML = g.stripScripts()
            }
            g.evalScripts.bind(g).defer();
            return f
        }
        return c
    })(),
    replace: function (b, c) {
        b = $(b);
        if (c && c.toElement) {
            c = c.toElement()
        } else {
            if (!Object.isElement(c)) {
                c = Object.toHTML(c);
                var a = b.ownerDocument.createRange();
                a.selectNode(b);
                c.evalScripts.bind(c).defer();
                c = a.createContextualFragment(c.stripScripts())
            }
        }
        b.parentNode.replaceChild(c, b);
        return b
    },
    insert: function (c, e) {
        c = $(c);
        if (Object.isString(e) || Object.isNumber(e) || Object.isElement(e) || (e && (e.toElement || e.toHTML))) {
            e = {
                bottom: e
            }
        }
        var d, f, b, g;
        for (var a in e) {
            d = e[a];
            a = a.toLowerCase();
            f = Element._insertionTranslations[a];
            if (d && d.toElement) {
                d = d.toElement()
            }
            if (Object.isElement(d)) {
                f(c, d);
                continue
            }
            d = Object.toHTML(d);
            b = ((a == "before" || a == "after") ? c.parentNode : c).tagName.toUpperCase();
            g = Element._getContentFromAnonymousElement(b, d.stripScripts());
            if (a == "top" || a == "after") {
                g.reverse()
            }
            g.each(f.curry(c));
            d.evalScripts.bind(d).defer()
        }
        return c
    },
    wrap: function (b, c, a) {
        b = $(b);
        if (Object.isElement(c)) {
            $(c).writeAttribute(a || {})
        } else {
            if (Object.isString(c)) {
                c = new Element(c, a)
            } else {
                c = new Element("div", c)
            }
        }
        if (b.parentNode) {
            b.parentNode.replaceChild(c, b)
        }
        c.appendChild(b);
        return c
    },
    inspect: function (b) {
        b = $(b);
        var a = "<" + b.tagName.toLowerCase();
        $H({
            id: "id",
            className: "class"
        }).each(function (f) {
            var e = f.first(),
                c = f.last();
            var d = (b[e] || "").toString();
            if (d) {
                a += " " + c + "=" + d.inspect(true)
            }
        });
        return a + ">"
    },
    recursivelyCollect: function (a, c) {
        a = $(a);
        var b = [];
        while (a = a[c]) {
            if (a.nodeType == 1) {
                b.push(Element.extend(a))
            }
        }
        return b
    },
    ancestors: function (a) {
        return Element.recursivelyCollect(a, "parentNode")
    },
    descendants: function (a) {
        return Element.select(a, "*")
    },
    firstDescendant: function (a) {
        a = $(a).firstChild;
        while (a && a.nodeType != 1) {
            a = a.nextSibling
        }
        return $(a)
    },
    immediateDescendants: function (a) {
        if (!(a = $(a).firstChild)) {
            return []
        }
        while (a && a.nodeType != 1) {
            a = a.nextSibling
        }
        if (a) {
            return [a].concat($(a).nextSiblings())
        }
        return []
    },
    previousSiblings: function (a) {
        return Element.recursivelyCollect(a, "previousSibling")
    },
    nextSiblings: function (a) {
        return Element.recursivelyCollect(a, "nextSibling")
    },
    siblings: function (a) {
        a = $(a);
        return Element.previousSiblings(a).reverse().concat(Element.nextSiblings(a))
    },
    match: function (b, a) {
        if (Object.isString(a)) {
            a = new Selector(a)
        }
        return a.match($(b))
    },
    up: function (b, d, a) {
        b = $(b);
        if (arguments.length == 1) {
            return $(b.parentNode)
        }
        var c = Element.ancestors(b);
        return Object.isNumber(d) ? c[d] : Selector.findElement(c, d, a)
    },
    down: function (b, c, a) {
        b = $(b);
        if (arguments.length == 1) {
            return Element.firstDescendant(b)
        }
        return Object.isNumber(c) ? Element.descendants(b)[c] : Element.select(b, c)[a || 0]
    },
    previous: function (b, d, a) {
        b = $(b);
        if (arguments.length == 1) {
            return $(Selector.handlers.previousElementSibling(b))
        }
        var c = Element.previousSiblings(b);
        return Object.isNumber(d) ? c[d] : Selector.findElement(c, d, a)
    },
    next: function (c, d, b) {
        c = $(c);
        if (arguments.length == 1) {
            return $(Selector.handlers.nextElementSibling(c))
        }
        var a = Element.nextSiblings(c);
        return Object.isNumber(d) ? a[d] : Selector.findElement(a, d, b)
    },
    select: function (b) {
        var a = Array.prototype.slice.call(arguments, 1);
        return Selector.findChildElements(b, a)
    },
    adjacent: function (b) {
        var a = Array.prototype.slice.call(arguments, 1);
        return Selector.findChildElements(b.parentNode, a).without(b)
    },
    identify: function (a) {
        a = $(a);
        var b = Element.readAttribute(a, "id");
        if (b) {
            return b
        }
        do {
            b = "anonymous_element_" + Element.idCounter++
        } while ($(b));
        Element.writeAttribute(a, "id", b);
        return b
    },
    readAttribute: function (c, a) {
        c = $(c);
        if (Prototype.Browser.IE) {
            var b = Element._attributeTranslations.read;
            if (b.values[a]) {
                return b.values[a](c, a)
            }
            if (b.names[a]) {
                a = b.names[a]
            }
            if (a.include(":")) {
                return (!c.attributes || !c.attributes[a]) ? null : c.attributes[a].value
            }
        }
        return c.getAttribute(a)
    },
    writeAttribute: function (e, c, f) {
        e = $(e);
        var b = {},
            d = Element._attributeTranslations.write;
        if (typeof c == "object") {
            b = c
        } else {
            b[c] = Object.isUndefined(f) ? true : f
        }
        for (var a in b) {
            c = d.names[a] || a;
            f = b[a];
            if (d.values[a]) {
                c = d.values[a](e, f)
            }
            if (f === false || f === null) {
                e.removeAttribute(c)
            } else {
                if (f === true) {
                    e.setAttribute(c, c)
                } else {
                    e.setAttribute(c, f)
                }
            }
        }
        return e
    },
    getHeight: function (a) {
        return Element.getDimensions(a).height
    },
    getWidth: function (a) {
        return Element.getDimensions(a).width
    },
    classNames: function (a) {
        return new Element.ClassNames(a)
    },
    hasClassName: function (a, b) {
        if (!(a = $(a))) {
            return
        }
        var c = a.className;
        return (c.length > 0 && (c == b || new RegExp("(^|\\s)" + b + "(\\s|$)").test(c)))
    },
    addClassName: function (a, b) {
        if (!(a = $(a))) {
            return
        }
        if (!Element.hasClassName(a, b)) {
            a.className += (a.className ? " " : "") + b
        }
        return a
    },
    removeClassName: function (a, b) {
        if (!(a = $(a))) {
            return
        }
        a.className = a.className.replace(new RegExp("(^|\\s+)" + b + "(\\s+|$)"), " ").strip();
        return a
    },
    toggleClassName: function (a, b) {
        if (!(a = $(a))) {
            return
        }
        return Element[Element.hasClassName(a, b) ? "removeClassName" : "addClassName"](a, b)
    },
    cleanWhitespace: function (b) {
        b = $(b);
        var c = b.firstChild;
        while (c) {
            var a = c.nextSibling;
            if (c.nodeType == 3 && !/\S/.test(c.nodeValue)) {
                b.removeChild(c)
            }
            c = a
        }
        return b
    },
    empty: function (a) {
        return $(a).innerHTML.blank()
    },
    descendantOf: function (b, a) {
        b = $(b), a = $(a);
        if (b.compareDocumentPosition) {
            return (b.compareDocumentPosition(a) & 8) === 8
        }
        if (a.contains) {
            return a.contains(b) && a !== b
        }
        while (b = b.parentNode) {
            if (b == a) {
                return true
            }
        }
        return false
    },
    scrollTo: function (a) {
        a = $(a);
        var b = Element.cumulativeOffset(a);
        window.scrollTo(b[0], b[1]);
        return a
    },
    getStyle: function (b, c) {
        b = $(b);
        c = c == "float" ? "cssFloat" : c.camelize();
        var d = b.style[c];
        if (!d || d == "auto") {
            var a = document.defaultView.getComputedStyle(b, null);
            d = a ? a[c] : null
        }
        if (c == "opacity") {
            return d ? parseFloat(d) : 1
        }
        return d == "auto" ? null : d
    },
    getOpacity: function (a) {
        return $(a).getStyle("opacity")
    },
    setStyle: function (b, c) {
        b = $(b);
        var e = b.style,
            a;
        if (Object.isString(c)) {
            b.style.cssText += ";" + c;
            return c.include("opacity") ? b.setOpacity(c.match(/opacity:\s*(\d?\.?\d*)/)[1]) : b
        }
        for (var d in c) {
            if (d == "opacity") {
                b.setOpacity(c[d])
            } else {
                e[(d == "float" || d == "cssFloat") ? (Object.isUndefined(e.styleFloat) ? "cssFloat" : "styleFloat") : d] = c[d]
            }
        }
        return b
    },
    setOpacity: function (a, b) {
        a = $(a);
        a.style.opacity = (b == 1 || b === "") ? "" : (b < 0.00001) ? 0 : b;
        return a
    },
    getDimensions: function (c) {
        c = $(c);
        var g = Element.getStyle(c, "display");
        if (g != "none" && g != null) {
            return {
                width: c.offsetWidth,
                height: c.offsetHeight
            }
        }
        var b = c.style;
        var f = b.visibility;
        var d = b.position;
        var a = b.display;
        b.visibility = "hidden";
        if (d != "fixed") {
            b.position = "absolute"
        }
        b.display = "block";
        var h = c.clientWidth;
        var e = c.clientHeight;
        b.display = a;
        b.position = d;
        b.visibility = f;
        return {
            width: h,
            height: e
        }
    },
    makePositioned: function (a) {
        a = $(a);
        var b = Element.getStyle(a, "position");
        if (b == "static" || !b) {
            a._madePositioned = true;
            a.style.position = "relative";
            if (Prototype.Browser.Opera) {
                a.style.top = 0;
                a.style.left = 0
            }
        }
        return a
    },
    undoPositioned: function (a) {
        a = $(a);
        if (a._madePositioned) {
            a._madePositioned = undefined;
            a.style.position = a.style.top = a.style.left = a.style.bottom = a.style.right = ""
        }
        return a
    },
    makeClipping: function (a) {
        a = $(a);
        if (a._overflow) {
            return a
        }
        a._overflow = Element.getStyle(a, "overflow") || "auto";
        if (a._overflow !== "hidden") {
            a.style.overflow = "hidden"
        }
        return a
    },
    undoClipping: function (a) {
        a = $(a);
        if (!a._overflow) {
            return a
        }
        a.style.overflow = a._overflow == "auto" ? "" : a._overflow;
        a._overflow = null;
        return a
    },
    cumulativeOffset: function (b) {
        var a = 0,
            c = 0;
        do {
            a += b.offsetTop || 0;
            c += b.offsetLeft || 0;
            b = b.offsetParent
        } while (b);
        return Element._returnOffset(c, a)
    },
    positionedOffset: function (b) {
        var a = 0,
            d = 0;
        do {
            a += b.offsetTop || 0;
            d += b.offsetLeft || 0;
            b = b.offsetParent;
            if (b) {
                if (b.tagName.toUpperCase() == "BODY") {
                    break
                }
                var c = Element.getStyle(b, "position");
                if (c !== "static") {
                    break
                }
            }
        } while (b);
        return Element._returnOffset(d, a)
    },
    absolutize: function (b) {
        b = $(b);
        if (Element.getStyle(b, "position") == "absolute") {
            return b
        }
        var d = Element.positionedOffset(b);
        var f = d[1];
        var e = d[0];
        var c = b.clientWidth;
        var a = b.clientHeight;
        b._originalLeft = e - parseFloat(b.style.left || 0);
        b._originalTop = f - parseFloat(b.style.top || 0);
        b._originalWidth = b.style.width;
        b._originalHeight = b.style.height;
        b.style.position = "absolute";
        b.style.top = f + "px";
        b.style.left = e + "px";
        b.style.width = c + "px";
        b.style.height = a + "px";
        return b
    },
    relativize: function (a) {
        a = $(a);
        if (Element.getStyle(a, "position") == "relative") {
            return a
        }
        a.style.position = "relative";
        var c = parseFloat(a.style.top || 0) - (a._originalTop || 0);
        var b = parseFloat(a.style.left || 0) - (a._originalLeft || 0);
        a.style.top = c + "px";
        a.style.left = b + "px";
        a.style.height = a._originalHeight;
        a.style.width = a._originalWidth;
        return a
    },
    cumulativeScrollOffset: function (b) {
        var a = 0,
            c = 0;
        do {
            a += b.scrollTop || 0;
            c += b.scrollLeft || 0;
            b = b.parentNode
        } while (b);
        return Element._returnOffset(c, a)
    },
    getOffsetParent: function (a) {
        if (a.offsetParent) {
            return $(a.offsetParent)
        }
        if (a == document.body) {
            return $(a)
        }
        while ((a = a.parentNode) && a != document.body) {
            if (Element.getStyle(a, "position") != "static") {
                return $(a)
            }
        }
        return $(document.body)
    },
    viewportOffset: function (d) {
        var a = 0,
            c = 0;
        var b = d;
        do {
            a += b.offsetTop || 0;
            c += b.offsetLeft || 0;
            if (b.offsetParent == document.body && Element.getStyle(b, "position") == "absolute") {
                break
            }
        } while (b = b.offsetParent);
        b = d;
        do {
            if (!Prototype.Browser.Opera || (b.tagName && (b.tagName.toUpperCase() == "BODY"))) {
                a -= b.scrollTop || 0;
                c -= b.scrollLeft || 0
            }
        } while (b = b.parentNode);
        return Element._returnOffset(c, a)
    },
    clonePosition: function (b, d) {
        var a = Object.extend({
            setLeft: true,
            setTop: true,
            setWidth: true,
            setHeight: true,
            offsetTop: 0,
            offsetLeft: 0
        }, arguments[2] || {});
        d = $(d);
        var e = Element.viewportOffset(d);
        b = $(b);
        var f = [0, 0];
        var c = null;
        if (Element.getStyle(b, "position") == "absolute") {
            c = Element.getOffsetParent(b);
            f = Element.viewportOffset(c)
        }
        if (c == document.body) {
            f[0] -= document.body.offsetLeft;
            f[1] -= document.body.offsetTop
        }
        if (a.setLeft) {
            b.style.left = (e[0] - f[0] + a.offsetLeft) + "px"
        }
        if (a.setTop) {
            b.style.top = (e[1] - f[1] + a.offsetTop) + "px"
        }
        if (a.setWidth) {
            b.style.width = d.offsetWidth + "px"
        }
        if (a.setHeight) {
            b.style.height = d.offsetHeight + "px"
        }
        return b
    }
};
Object.extend(Element.Methods, {
    getElementsBySelector: Element.Methods.select,
    childElements: Element.Methods.immediateDescendants
});
Element._attributeTranslations = {
    write: {
        names: {
            className: "class",
            htmlFor: "for"
        },
        values: {}
    }
};
if (Prototype.Browser.Opera) {
    Element.Methods.getStyle = Element.Methods.getStyle.wrap(function (d, b, c) {
        switch (c) {
        case "left":
        case "top":
        case "right":
        case "bottom":
            if (d(b, "position") === "static") {
                return null
            }
        case "height":
        case "width":
            if (!Element.visible(b)) {
                return null
            }
            var e = parseInt(d(b, c), 10);
            if (e !== b["offset" + c.capitalize()]) {
                return e + "px"
            }
            var a;
            if (c === "height") {
                a = ["border-top-width", "padding-top", "padding-bottom", "border-bottom-width"]
            } else {
                a = ["border-left-width", "padding-left", "padding-right", "border-right-width"]
            }
            return a.inject(e, function (f, g) {
                var h = d(b, g);
                return h === null ? f : f - parseInt(h, 10)
            }) + "px";
        default:
            return d(b, c)
        }
    });
    Element.Methods.readAttribute = Element.Methods.readAttribute.wrap(function (c, a, b) {
        if (b === "title") {
            return a.title
        }
        return c(a, b)
    })
} else {
    if (Prototype.Browser.IE) {
        Element.Methods.getOffsetParent = Element.Methods.getOffsetParent.wrap(function (c, b) {
            b = $(b);
            try {
                b.offsetParent
            } catch (f) {
                return $(document.body)
            }
            var a = b.getStyle("position");
            if (a !== "static") {
                return c(b)
            }
            b.setStyle({
                position: "relative"
            });
            var d = c(b);
            b.setStyle({
                position: a
            });
            return d
        });
        $w("positionedOffset viewportOffset").each(function (a) {
            Element.Methods[a] = Element.Methods[a].wrap(function (f, c) {
                c = $(c);
                try {
                    c.offsetParent
                } catch (h) {
                    return Element._returnOffset(0, 0)
                }
                var b = c.getStyle("position");
                if (b !== "static") {
                    return f(c)
                }
                var d = c.getOffsetParent();
                if (d && d.getStyle("position") === "fixed") {
                    d.setStyle({
                        zoom: 1
                    })
                }
                c.setStyle({
                    position: "relative"
                });
                var g = f(c);
                c.setStyle({
                    position: b
                });
                return g
            })
        });
        Element.Methods.cumulativeOffset = Element.Methods.cumulativeOffset.wrap(function (b, a) {
            try {
                a.offsetParent
            } catch (c) {
                return Element._returnOffset(0, 0)
            }
            return b(a)
        });
        Element.Methods.getStyle = function (a, b) {
            a = $(a);
            b = (b == "float" || b == "cssFloat") ? "styleFloat" : b.camelize();
            var c = a.style[b];
            if (!c && a.currentStyle) {
                c = a.currentStyle[b]
            }
            if (b == "opacity") {
                if (c = (a.getStyle("filter") || "").match(/alpha\(opacity=(.*)\)/)) {
                    if (c[1]) {
                        return parseFloat(c[1]) / 100
                    }
                }
                return 1
            }
            if (c == "auto") {
                if ((b == "width" || b == "height") && (a.getStyle("display") != "none")) {
                    return a["offset" + b.capitalize()] + "px"
                }
                return null
            }
            return c
        };
        Element.Methods.setOpacity = function (b, e) {
            function f(g) {
                return g.replace(/alpha\([^\)]*\)/gi, "")
            }
            b = $(b);
            var a = b.currentStyle;
            if ((a && !a.hasLayout) || (!a && b.style.zoom == "normal")) {
                b.style.zoom = 1
            }
            var d = b.getStyle("filter"),
                c = b.style;
            if (e == 1 || e === "") {
                (d = f(d)) ? c.filter = d : c.removeAttribute("filter");
                return b
            } else {
                if (e < 0.00001) {
                    e = 0
                }
            }
            c.filter = f(d) + "alpha(opacity=" + (e * 100) + ")";
            return b
        };
        Element._attributeTranslations = (function () {
            var b = "className";
            var a = "for";
            var c = document.createElement("div");
            c.setAttribute(b, "x");
            if (c.className !== "x") {
                c.setAttribute("class", "x");
                if (c.className === "x") {
                    b = "class"
                }
            }
            c = null;
            c = document.createElement("label");
            c.setAttribute(a, "x");
            if (c.htmlFor !== "x") {
                c.setAttribute("htmlFor", "x");
                if (c.htmlFor === "x") {
                    a = "htmlFor"
                }
            }
            c = null;
            return {
                read: {
                    names: {
                        "class": b,
                        className: b,
                        "for": a,
                        htmlFor: a
                    },
                    values: {
                        _getAttr: function (d, e) {
                            return d.getAttribute(e)
                        },
                        _getAttr2: function (d, e) {
                            return d.getAttribute(e, 2)
                        },
                        _getAttrNode: function (d, f) {
                            var e = d.getAttributeNode(f);
                            return e ? e.value : ""
                        },
                        _getEv: (function () {
                            var d = document.createElement("div");
                            d.onclick = Prototype.emptyFunction;
                            var g = d.getAttribute("onclick");
                            var e;
                            if (String(g).indexOf("{") > -1) {
                                e = function (f, h) {
                                    h = f.getAttribute(h);
                                    if (!h) {
                                        return null
                                    }
                                    h = h.toString();
                                    h = h.split("{")[1];
                                    h = h.split("}")[0];
                                    return h.strip()
                                }
                            } else {
                                if (g === "") {
                                    e = function (f, h) {
                                        h = f.getAttribute(h);
                                        if (!h) {
                                            return null
                                        }
                                        return h.strip()
                                    }
                                }
                            }
                            d = null;
                            return e
                        })(),
                        _flag: function (d, e) {
                            return $(d).hasAttribute(e) ? e : null
                        },
                        style: function (d) {
                            return d.style.cssText.toLowerCase()
                        },
                        title: function (d) {
                            return d.title
                        }
                    }
                }
            }
        })();
        Element._attributeTranslations.write = {
            names: Object.extend({
                cellpadding: "cellPadding",
                cellspacing: "cellSpacing"
            }, Element._attributeTranslations.read.names),
            values: {
                checked: function (a, b) {
                    a.checked = !! b
                },
                style: function (a, b) {
                    a.style.cssText = b ? b : ""
                }
            }
        };
        Element._attributeTranslations.has = {};
        $w("colSpan rowSpan vAlign dateTime accessKey tabIndex encType maxLength readOnly longDesc frameBorder").each(function (a) {
            Element._attributeTranslations.write.names[a.toLowerCase()] = a;
            Element._attributeTranslations.has[a.toLowerCase()] = a
        });
        (function (a) {
            Object.extend(a, {
                href: a._getAttr2,
                src: a._getAttr2,
                type: a._getAttr,
                action: a._getAttrNode,
                disabled: a._flag,
                checked: a._flag,
                readonly: a._flag,
                multiple: a._flag,
                onload: a._getEv,
                onunload: a._getEv,
                onclick: a._getEv,
                ondblclick: a._getEv,
                onmousedown: a._getEv,
                onmouseup: a._getEv,
                onmouseover: a._getEv,
                onmousemove: a._getEv,
                onmouseout: a._getEv,
                onfocus: a._getEv,
                onblur: a._getEv,
                onkeypress: a._getEv,
                onkeydown: a._getEv,
                onkeyup: a._getEv,
                onsubmit: a._getEv,
                onreset: a._getEv,
                onselect: a._getEv,
                onchange: a._getEv
            })
        })(Element._attributeTranslations.read.values);
        if (Prototype.BrowserFeatures.ElementExtensions) {
            (function () {
                function a(e) {
                    var b = e.getElementsByTagName("*"),
                        d = [];
                    for (var c = 0, f; f = b[c]; c++) {
                        if (f.tagName !== "!") {
                            d.push(f)
                        }
                    }
                    return d
                }
                Element.Methods.down = function (c, d, b) {
                    c = $(c);
                    if (arguments.length == 1) {
                        return c.firstDescendant()
                    }
                    return Object.isNumber(d) ? a(c)[d] : Element.select(c, d)[b || 0]
                }
            })()
        }
    } else {
        if (Prototype.Browser.Gecko && /rv:1\.8\.0/.test(navigator.userAgent)) {
            Element.Methods.setOpacity = function (a, b) {
                a = $(a);
                a.style.opacity = (b == 1) ? 0.999999 : (b === "") ? "" : (b < 0.00001) ? 0 : b;
                return a
            }
        } else {
            if (Prototype.Browser.WebKit) {
                Element.Methods.setOpacity = function (a, b) {
                    a = $(a);
                    a.style.opacity = (b == 1 || b === "") ? "" : (b < 0.00001) ? 0 : b;
                    if (b == 1) {
                        if (a.tagName.toUpperCase() == "IMG" && a.width) {
                            a.width++;
                            a.width--
                        } else {
                            try {
                                var d = document.createTextNode(" ");
                                a.appendChild(d);
                                a.removeChild(d)
                            } catch (c) {}
                        }
                    }
                    return a
                };
                Element.Methods.cumulativeOffset = function (b) {
                    var a = 0,
                        c = 0;
                    do {
                        a += b.offsetTop || 0;
                        c += b.offsetLeft || 0;
                        if (b.offsetParent == document.body) {
                            if (Element.getStyle(b, "position") == "absolute") {
                                break
                            }
                        }
                        b = b.offsetParent
                    } while (b);
                    return Element._returnOffset(c, a)
                }
            }
        }
    }
}
if ("outerHTML" in document.documentElement) {
    Element.Methods.replace = function (c, e) {
        c = $(c);
        if (e && e.toElement) {
            e = e.toElement()
        }
        if (Object.isElement(e)) {
            c.parentNode.replaceChild(e, c);
            return c
        }
        e = Object.toHTML(e);
        var d = c.parentNode,
            b = d.tagName.toUpperCase();
        if (Element._insertionTranslations.tags[b]) {
            var f = c.next();
            var a = Element._getContentFromAnonymousElement(b, e.stripScripts());
            d.removeChild(c);
            if (f) {
                a.each(function (g) {
                    d.insertBefore(g, f)
                })
            } else {
                a.each(function (g) {
                    d.appendChild(g)
                })
            }
        } else {
            c.outerHTML = e.stripScripts()
        }
        e.evalScripts.bind(e).defer();
        return c
    }
}
Element._returnOffset = function (b, c) {
    var a = [b, c];
    a.left = b;
    a.top = c;
    return a
};
Element._getContentFromAnonymousElement = function (c, b) {
    var d = new Element("div"),
        a = Element._insertionTranslations.tags[c];
    if (a) {
        d.innerHTML = a[0] + b + a[1];
        a[2].times(function () {
            d = d.firstChild
        })
    } else {
        d.innerHTML = b
    }
    return $A(d.childNodes)
};
Element._insertionTranslations = {
    before: function (a, b) {
        a.parentNode.insertBefore(b, a)
    },
    top: function (a, b) {
        a.insertBefore(b, a.firstChild)
    },
    bottom: function (a, b) {
        a.appendChild(b)
    },
    after: function (a, b) {
        a.parentNode.insertBefore(b, a.nextSibling)
    },
    tags: {
        TABLE: ["<table>", "</table>", 1],
        TBODY: ["<table><tbody>", "</tbody></table>", 2],
        TR: ["<table><tbody><tr>", "</tr></tbody></table>", 3],
        TD: ["<table><tbody><tr><td>", "</td></tr></tbody></table>", 4],
        SELECT: ["<select>", "</select>", 1]
    }
};
(function () {
    var a = Element._insertionTranslations.tags;
    Object.extend(a, {
        THEAD: a.TBODY,
        TFOOT: a.TBODY,
        TH: a.TD
    })
})();
Element.Methods.Simulated = {
    hasAttribute: function (a, c) {
        c = Element._attributeTranslations.has[c] || c;
        var b = $(a).getAttributeNode(c);
        return !!(b && b.specified)
    }
};
Element.Methods.ByTag = {};
Object.extend(Element, Element.Methods);
(function (a) {
    if (!Prototype.BrowserFeatures.ElementExtensions && a.__proto__) {
        window.HTMLElement = {};
        window.HTMLElement.prototype = a.__proto__;
        Prototype.BrowserFeatures.ElementExtensions = true
    }
    a = null
})(document.createElement("div"));
Element.extend = (function () {
    function c(g) {
        if (typeof window.Element != "undefined") {
            var j = window.Element.prototype;
            if (j) {
                var l = "_" + (Math.random() + "").slice(2);
                var h = document.createElement(g);
                j[l] = "x";
                var k = (h[l] !== "x");
                delete j[l];
                h = null;
                return k
            }
        }
        return false
    }
    function b(h, g) {
        for (var k in g) {
            var j = g[k];
            if (Object.isFunction(j) && !(k in h)) {
                h[k] = j.methodize()
            }
        }
    }
    var d = c("object");
    if (Prototype.BrowserFeatures.SpecificElementExtensions) {
        if (d) {
            return function (h) {
                if (h && typeof h._extendedByPrototype == "undefined") {
                    var g = h.tagName;
                    if (g && (/^(?:object|applet|embed)$/i.test(g))) {
                        b(h, Element.Methods);
                        b(h, Element.Methods.Simulated);
                        b(h, Element.Methods.ByTag[g.toUpperCase()])
                    }
                }
                return h
            }
        }
        return Prototype.K
    }
    var a = {},
        e = Element.Methods.ByTag;
    var f = Object.extend(function (j) {
        if (!j || typeof j._extendedByPrototype != "undefined" || j.nodeType != 1 || j == window) {
            return j
        }
        var g = Object.clone(a),
            h = j.tagName.toUpperCase();
        if (e[h]) {
            Object.extend(g, e[h])
        }
        b(j, g);
        j._extendedByPrototype = Prototype.emptyFunction;
        return j
    }, {
        refresh: function () {
            if (!Prototype.BrowserFeatures.ElementExtensions) {
                Object.extend(a, Element.Methods);
                Object.extend(a, Element.Methods.Simulated)
            }
        }
    });
    f.refresh();
    return f
})();
Element.hasAttribute = function (a, b) {
    if (a.hasAttribute) {
        return a.hasAttribute(b)
    }
    return Element.Methods.Simulated.hasAttribute(a, b)
};
Element.addMethods = function (c) {
    var j = Prototype.BrowserFeatures,
        d = Element.Methods.ByTag;
    if (!c) {
        Object.extend(Form, Form.Methods);
        Object.extend(Form.Element, Form.Element.Methods);
        Object.extend(Element.Methods.ByTag, {
            FORM: Object.clone(Form.Methods),
            INPUT: Object.clone(Form.Element.Methods),
            SELECT: Object.clone(Form.Element.Methods),
            TEXTAREA: Object.clone(Form.Element.Methods)
        })
    }
    if (arguments.length == 2) {
        var b = c;
        c = arguments[1]
    }
    if (!b) {
        Object.extend(Element.Methods, c || {})
    } else {
        if (Object.isArray(b)) {
            b.each(g)
        } else {
            g(b)
        }
    }
    function g(l) {
        l = l.toUpperCase();
        if (!Element.Methods.ByTag[l]) {
            Element.Methods.ByTag[l] = {}
        }
        Object.extend(Element.Methods.ByTag[l], c)
    }
    function a(n, m, l) {
        l = l || false;
        for (var p in n) {
            var o = n[p];
            if (!Object.isFunction(o)) {
                continue
            }
            if (!l || !(p in m)) {
                m[p] = o.methodize()
            }
        }
    }
    function e(o) {
        var l;
        var n = {
            OPTGROUP: "OptGroup",
            TEXTAREA: "TextArea",
            P: "Paragraph",
            FIELDSET: "FieldSet",
            UL: "UList",
            OL: "OList",
            DL: "DList",
            DIR: "Directory",
            H1: "Heading",
            H2: "Heading",
            H3: "Heading",
            H4: "Heading",
            H5: "Heading",
            H6: "Heading",
            Q: "Quote",
            INS: "Mod",
            DEL: "Mod",
            A: "Anchor",
            IMG: "Image",
            CAPTION: "TableCaption",
            COL: "TableCol",
            COLGROUP: "TableCol",
            THEAD: "TableSection",
            TFOOT: "TableSection",
            TBODY: "TableSection",
            TR: "TableRow",
            TH: "TableCell",
            TD: "TableCell",
            FRAMESET: "FrameSet",
            IFRAME: "IFrame"
        };
        if (n[o]) {
            l = "HTML" + n[o] + "Element"
        }
        if (window[l]) {
            return window[l]
        }
        l = "HTML" + o + "Element";
        if (window[l]) {
            return window[l]
        }
        l = "HTML" + o.capitalize() + "Element";
        if (window[l]) {
            return window[l]
        }
        var m = document.createElement(o);
        var p = m.__proto__ || m.constructor.prototype;
        m = null;
        return p
    }
    var h = window.HTMLElement ? HTMLElement.prototype : Element.prototype;
    if (j.ElementExtensions) {
        a(Element.Methods, h);
        a(Element.Methods.Simulated, h, true)
    }
    if (j.SpecificElementExtensions) {
        for (var k in Element.Methods.ByTag) {
            var f = e(k);
            if (Object.isUndefined(f)) {
                continue
            }
            a(d[k], f.prototype)
        }
    }
    Object.extend(Element, Element.Methods);
    delete Element.ByTag;
    if (Element.extend.refresh) {
        Element.extend.refresh()
    }
    Element.cache = {}
};
document.viewport = {
    getDimensions: function () {
        return {
            width: this.getWidth(),
            height: this.getHeight()
        }
    },
    getScrollOffsets: function () {
        return Element._returnOffset(window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft, window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop)
    }
};
(function (b) {
    var g = Prototype.Browser,
        e = document,
        c, d = {};

    function a() {
        if (g.WebKit && !e.evaluate) {
            return document
        }
        if (g.Opera && window.parseFloat(window.opera.version()) < 9.5) {
            return document.body
        }
        return document.documentElement
    }
    function f(h) {
        if (!c) {
            c = a()
        }
        d[h] = "client" + h;
        b["get" + h] = function () {
            return c[d[h]]
        };
        return b["get" + h]()
    }
    b.getWidth = f.curry("Width");
    b.getHeight = f.curry("Height")
})(document.viewport);
Element.Storage = {
    UID: 1
};
Element.addMethods({
    getStorage: function (b) {
        if (!(b = $(b))) {
            return
        }
        var a;
        if (b === window) {
            a = 0
        } else {
            if (typeof b._prototypeUID === "undefined") {
                b._prototypeUID = [Element.Storage.UID++]
            }
            a = b._prototypeUID[0]
        }
        if (!Element.Storage[a]) {
            Element.Storage[a] = $H()
        }
        return Element.Storage[a]
    },
    store: function (b, a, c) {
        if (!(b = $(b))) {
            return
        }
        if (arguments.length === 2) {
            Element.getStorage(b).update(a)
        } else {
            Element.getStorage(b).set(a, c)
        }
        return b
    },
    retrieve: function (c, b, a) {
        if (!(c = $(c))) {
            return
        }
        var e = Element.getStorage(c),
            d = e.get(b);
        if (Object.isUndefined(d)) {
            e.set(b, a);
            d = a
        }
        return d
    },
    clone: function (c, a) {
        if (!(c = $(c))) {
            return
        }
        var e = c.cloneNode(a);
        e._prototypeUID = void 0;
        if (a) {
            var d = Element.select(e, "*"),
                b = d.length;
            while (b--) {
                d[b]._prototypeUID = void 0
            }
        }
        return Element.extend(e)
    }
});
var Selector = Class.create({
    initialize: function (a) {
        this.expression = a.strip();
        if (this.shouldUseSelectorsAPI()) {
            this.mode = "selectorsAPI"
        } else {
            if (this.shouldUseXPath()) {
                this.mode = "xpath";
                this.compileXPathMatcher()
            } else {
                this.mode = "normal";
                this.compileMatcher()
            }
        }
    },
    shouldUseXPath: (function () {
        var a = (function () {
            var e = false;
            if (document.evaluate && window.XPathResult) {
                var d = document.createElement("div");
                d.innerHTML = "<ul><li></li></ul><div><ul><li></li></ul></div>";
                var c = ".//*[local-name()='ul' or local-name()='UL']//*[local-name()='li' or local-name()='LI']";
                var b = document.evaluate(c, d, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
                e = (b.snapshotLength !== 2);
                d = null
            }
            return e
        })();
        return function () {
            if (!Prototype.BrowserFeatures.XPath) {
                return false
            }
            var b = this.expression;
            if (Prototype.Browser.WebKit && (b.include("-of-type") || b.include(":empty"))) {
                return false
            }
            if ((/(\[[\w-]*?:|:checked)/).test(b)) {
                return false
            }
            if (a) {
                return false
            }
            return true
        }
    })(),
    shouldUseSelectorsAPI: function () {
        if (!Prototype.BrowserFeatures.SelectorsAPI) {
            return false
        }
        if (Selector.CASE_INSENSITIVE_CLASS_NAMES) {
            return false
        }
        if (!Selector._div) {
            Selector._div = new Element("div")
        }
        try {
            Selector._div.querySelector(this.expression)
        } catch (a) {
            return false
        }
        return true
    },
    compileMatcher: function () {
        var e = this.expression,
            ps = Selector.patterns,
            h = Selector.handlers,
            c = Selector.criteria,
            le, p, m, len = ps.length,
            name;
        if (Selector._cache[e]) {
            this.matcher = Selector._cache[e];
            return
        }
        this.matcher = ["this.matcher = function(root) {", "var r = root, h = Selector.handlers, c = false, n;"];
        while (e && le != e && (/\S/).test(e)) {
            le = e;
            for (var i = 0; i < len; i++) {
                p = ps[i].re;
                name = ps[i].name;
                if (m = e.match(p)) {
                    this.matcher.push(Object.isFunction(c[name]) ? c[name](m) : new Template(c[name]).evaluate(m));
                    e = e.replace(m[0], "");
                    break
                }
            }
        }
        this.matcher.push("return h.unique(n);\n}");
        eval(this.matcher.join("\n"));
        Selector._cache[this.expression] = this.matcher
    },
    compileXPathMatcher: function () {
        var h = this.expression,
            j = Selector.patterns,
            c = Selector.xpath,
            g, b, a = j.length,
            d;
        if (Selector._cache[h]) {
            this.xpath = Selector._cache[h];
            return
        }
        this.matcher = [".//*"];
        while (h && g != h && (/\S/).test(h)) {
            g = h;
            for (var f = 0; f < a; f++) {
                d = j[f].name;
                if (b = h.match(j[f].re)) {
                    this.matcher.push(Object.isFunction(c[d]) ? c[d](b) : new Template(c[d]).evaluate(b));
                    h = h.replace(b[0], "");
                    break
                }
            }
        }
        this.xpath = this.matcher.join("");
        Selector._cache[this.expression] = this.xpath
    },
    findElements: function (a) {
        a = a || document;
        var c = this.expression,
            b;
        switch (this.mode) {
        case "selectorsAPI":
            if (a !== document) {
                var d = a.id,
                    f = $(a).identify();
                f = f.replace(/([\.:])/g, "\\$1");
                c = "#" + f + " " + c
            }
            b = $A(a.querySelectorAll(c)).map(Element.extend);
            a.id = d;
            return b;
        case "xpath":
            return document._getElementsByXPath(this.xpath, a);
        default:
            return this.matcher(a)
        }
    },
    match: function (k) {
        this.tokens = [];
        var q = this.expression,
            a = Selector.patterns,
            f = Selector.assertions;
        var b, d, g, o = a.length,
            c;
        while (q && b !== q && (/\S/).test(q)) {
            b = q;
            for (var j = 0; j < o; j++) {
                d = a[j].re;
                c = a[j].name;
                if (g = q.match(d)) {
                    if (f[c]) {
                        this.tokens.push([c, Object.clone(g)]);
                        q = q.replace(g[0], "")
                    } else {
                        return this.findElements(document).include(k)
                    }
                }
            }
        }
        var n = true,
            c, l;
        for (var j = 0, h; h = this.tokens[j]; j++) {
            c = h[0], l = h[1];
            if (!Selector.assertions[c](k, l)) {
                n = false;
                break
            }
        }
        return n
    },
    toString: function () {
        return this.expression
    },
    inspect: function () {
        return "#<Selector:" + this.expression.inspect() + ">"
    }
});
if (Prototype.BrowserFeatures.SelectorsAPI && document.compatMode === "BackCompat") {
    Selector.CASE_INSENSITIVE_CLASS_NAMES = (function () {
        var c = document.createElement("div"),
            a = document.createElement("span");
        c.id = "prototype_test_id";
        a.className = "Test";
        c.appendChild(a);
        var b = (c.querySelector("#prototype_test_id .test") !== null);
        c = a = null;
        return b
    })()
}
Object.extend(Selector, {
    _cache: {},
    xpath: {
        descendant: "//*",
        child: "/*",
        adjacent: "/following-sibling::*[1]",
        laterSibling: "/following-sibling::*",
        tagName: function (a) {
            if (a[1] == "*") {
                return ""
            }
            return "[local-name()='" + a[1].toLowerCase() + "' or local-name()='" + a[1].toUpperCase() + "']"
        },
        className: "[contains(concat(' ', @class, ' '), ' #{1} ')]",
        id: "[@id='#{1}']",
        attrPresence: function (a) {
            a[1] = a[1].toLowerCase();
            return new Template("[@#{1}]").evaluate(a)
        },
        attr: function (a) {
            a[1] = a[1].toLowerCase();
            a[3] = a[5] || a[6];
            return new Template(Selector.xpath.operators[a[2]]).evaluate(a)
        },
        pseudo: function (a) {
            var b = Selector.xpath.pseudos[a[1]];
            if (!b) {
                return ""
            }
            if (Object.isFunction(b)) {
                return b(a)
            }
            return new Template(Selector.xpath.pseudos[a[1]]).evaluate(a)
        },
        operators: {
            "=": "[@#{1}='#{3}']",
            "!=": "[@#{1}!='#{3}']",
            "^=": "[starts-with(@#{1}, '#{3}')]",
            "$=": "[substring(@#{1}, (string-length(@#{1}) - string-length('#{3}') + 1))='#{3}']",
            "*=": "[contains(@#{1}, '#{3}')]",
            "~=": "[contains(concat(' ', @#{1}, ' '), ' #{3} ')]",
            "|=": "[contains(concat('-', @#{1}, '-'), '-#{3}-')]"
        },
        pseudos: {
            "first-child": "[not(preceding-sibling::*)]",
            "last-child": "[not(following-sibling::*)]",
            "only-child": "[not(preceding-sibling::* or following-sibling::*)]",
            empty: "[count(*) = 0 and (count(text()) = 0)]",
            checked: "[@checked]",
            disabled: "[(@disabled) and (@type!='hidden')]",
            enabled: "[not(@disabled) and (@type!='hidden')]",
            not: function (f) {
                var j = f[6],
                    c = Selector.patterns,
                    k = Selector.xpath,
                    a, l, h = c.length,
                    b;
                var d = [];
                while (j && a != j && (/\S/).test(j)) {
                    a = j;
                    for (var g = 0; g < h; g++) {
                        b = c[g].name;
                        if (f = j.match(c[g].re)) {
                            l = Object.isFunction(k[b]) ? k[b](f) : new Template(k[b]).evaluate(f);
                            d.push("(" + l.substring(1, l.length - 1) + ")");
                            j = j.replace(f[0], "");
                            break
                        }
                    }
                }
                return "[not(" + d.join(" and ") + ")]"
            },
            "nth-child": function (a) {
                return Selector.xpath.pseudos.nth("(count(./preceding-sibling::*) + 1) ", a)
            },
            "nth-last-child": function (a) {
                return Selector.xpath.pseudos.nth("(count(./following-sibling::*) + 1) ", a)
            },
            "nth-of-type": function (a) {
                return Selector.xpath.pseudos.nth("position() ", a)
            },
            "nth-last-of-type": function (a) {
                return Selector.xpath.pseudos.nth("(last() + 1 - position()) ", a)
            },
            "first-of-type": function (a) {
                a[6] = "1";
                return Selector.xpath.pseudos["nth-of-type"](a)
            },
            "last-of-type": function (a) {
                a[6] = "1";
                return Selector.xpath.pseudos["nth-last-of-type"](a)
            },
            "only-of-type": function (a) {
                var b = Selector.xpath.pseudos;
                return b["first-of-type"](a) + b["last-of-type"](a)
            },
            nth: function (g, e) {
                var h, j = e[6],
                    d;
                if (j == "even") {
                    j = "2n+0"
                }
                if (j == "odd") {
                    j = "2n+1"
                }
                if (h = j.match(/^(\d+)$/)) {
                    return "[" + g + "= " + h[1] + "]"
                }
                if (h = j.match(/^(-?\d*)?n(([+-])(\d+))?/)) {
                    if (h[1] == "-") {
                        h[1] = -1
                    }
                    var f = h[1] ? Number(h[1]) : 1;
                    var c = h[2] ? Number(h[2]) : 0;
                    d = "[((#{fragment} - #{b}) mod #{a} = 0) and ((#{fragment} - #{b}) div #{a} >= 0)]";
                    return new Template(d).evaluate({
                        fragment: g,
                        a: f,
                        b: c
                    })
                }
            }
        }
    },
    criteria: {
        tagName: 'n = h.tagName(n, r, "#{1}", c);      c = false;',
        className: 'n = h.className(n, r, "#{1}", c);    c = false;',
        id: 'n = h.id(n, r, "#{1}", c);           c = false;',
        attrPresence: 'n = h.attrPresence(n, r, "#{1}", c); c = false;',
        attr: function (a) {
            a[3] = (a[5] || a[6]);
            return new Template('n = h.attr(n, r, "#{1}", "#{3}", "#{2}", c); c = false;').evaluate(a)
        },
        pseudo: function (a) {
            if (a[6]) {
                a[6] = a[6].replace(/"/g, '\\"')
            }
            return new Template('n = h.pseudo(n, "#{1}", "#{6}", r, c); c = false;').evaluate(a)
        },
        descendant: 'c = "descendant";',
        child: 'c = "child";',
        adjacent: 'c = "adjacent";',
        laterSibling: 'c = "laterSibling";'
    },
    patterns: [{
        name: "laterSibling",
        re: /^\s*~\s*/
    }, {
        name: "child",
        re: /^\s*>\s*/
    }, {
        name: "adjacent",
        re: /^\s*\+\s*/
    }, {
        name: "descendant",
        re: /^\s/
    }, {
        name: "tagName",
        re: /^\s*(\*|[\w\-]+)(\b|$)?/
    }, {
        name: "id",
        re: /^#([\w\-\*]+)(\b|$)/
    }, {
        name: "className",
        re: /^\.([\w\-\*]+)(\b|$)/
    }, {
        name: "pseudo",
        re: /^:((first|last|nth|nth-last|only)(-child|-of-type)|empty|checked|(en|dis)abled|not)(\((.*?)\))?(\b|$|(?=\s|[:+~>]))/
    }, {
        name: "attrPresence",
        re: /^\[((?:[\w-]+:)?[\w-]+)\]/
    }, {
        name: "attr",
        re: /\[((?:[\w-]*:)?[\w-]+)\s*(?:([!^$*~|]?=)\s*((['"])([^\4]*?)\4|([^'"][^\]]*?)))?\]/
    }],
    assertions: {
        tagName: function (a, b) {
            return b[1].toUpperCase() == a.tagName.toUpperCase()
        },
        className: function (a, b) {
            return Element.hasClassName(a, b[1])
        },
        id: function (a, b) {
            return a.id === b[1]
        },
        attrPresence: function (a, b) {
            return Element.hasAttribute(a, b[1])
        },
        attr: function (b, c) {
            var a = Element.readAttribute(b, c[1]);
            return a && Selector.operators[c[2]](a, c[5] || c[6])
        }
    },
    handlers: {
        concat: function (d, c) {
            for (var e = 0, f; f = c[e]; e++) {
                d.push(f)
            }
            return d
        },
        mark: function (a) {
            var d = Prototype.emptyFunction;
            for (var b = 0, c; c = a[b]; b++) {
                c._countedByPrototype = d
            }
            return a
        },
        unmark: (function () {
            var a = (function () {
                var b = document.createElement("div"),
                    e = false,
                    d = "_countedByPrototype",
                    c = "x";
                b[d] = c;
                e = (b.getAttribute(d) === c);
                b = null;
                return e
            })();
            return a ?
            function (b) {
                for (var c = 0, d; d = b[c]; c++) {
                    d.removeAttribute("_countedByPrototype")
                }
                return b
            } : function (b) {
                for (var c = 0, d; d = b[c]; c++) {
                    d._countedByPrototype = void 0
                }
                return b
            }
        })(),
        index: function (a, d, g) {
            a._countedByPrototype = Prototype.emptyFunction;
            if (d) {
                for (var b = a.childNodes, e = b.length - 1, c = 1; e >= 0; e--) {
                    var f = b[e];
                    if (f.nodeType == 1 && (!g || f._countedByPrototype)) {
                        f.nodeIndex = c++
                    }
                }
            } else {
                for (var e = 0, c = 1, b = a.childNodes; f = b[e]; e++) {
                    if (f.nodeType == 1 && (!g || f._countedByPrototype)) {
                        f.nodeIndex = c++
                    }
                }
            }
        },
        unique: function (b) {
            if (b.length == 0) {
                return b
            }
            var d = [],
                e;
            for (var c = 0, a = b.length; c < a; c++) {
                if (typeof (e = b[c])._countedByPrototype == "undefined") {
                    e._countedByPrototype = Prototype.emptyFunction;
                    d.push(Element.extend(e))
                }
            }
            return Selector.handlers.unmark(d)
        },
        descendant: function (a) {
            var d = Selector.handlers;
            for (var c = 0, b = [], e; e = a[c]; c++) {
                d.concat(b, e.getElementsByTagName("*"))
            }
            return b
        },
        child: function (a) {
            var e = Selector.handlers;
            for (var d = 0, c = [], f; f = a[d]; d++) {
                for (var b = 0, g; g = f.childNodes[b]; b++) {
                    if (g.nodeType == 1 && g.tagName != "!") {
                        c.push(g)
                    }
                }
            }
            return c
        },
        adjacent: function (a) {
            for (var c = 0, b = [], e; e = a[c]; c++) {
                var d = this.nextElementSibling(e);
                if (d) {
                    b.push(d)
                }
            }
            return b
        },
        laterSibling: function (a) {
            var d = Selector.handlers;
            for (var c = 0, b = [], e; e = a[c]; c++) {
                d.concat(b, Element.nextSiblings(e))
            }
            return b
        },
        nextElementSibling: function (a) {
            while (a = a.nextSibling) {
                if (a.nodeType == 1) {
                    return a
                }
            }
            return null
        },
        previousElementSibling: function (a) {
            while (a = a.previousSibling) {
                if (a.nodeType == 1) {
                    return a
                }
            }
            return null
        },
        tagName: function (a, j, c, b) {
            var k = c.toUpperCase();
            var e = [],
                g = Selector.handlers;
            if (a) {
                if (b) {
                    if (b == "descendant") {
                        for (var f = 0, d; d = a[f]; f++) {
                            g.concat(e, d.getElementsByTagName(c))
                        }
                        return e
                    } else {
                        a = this[b](a)
                    }
                    if (c == "*") {
                        return a
                    }
                }
                for (var f = 0, d; d = a[f]; f++) {
                    if (d.tagName.toUpperCase() === k) {
                        e.push(d)
                    }
                }
                return e
            } else {
                return j.getElementsByTagName(c)
            }
        },
        id: function (a, l, b, c) {
            var k = $(b),
                g = Selector.handlers;
            if (l == document) {
                if (!k) {
                    return []
                }
                if (!a) {
                    return [k]
                }
            } else {
                if (!l.sourceIndex || l.sourceIndex < 1) {
                    var a = l.getElementsByTagName("*");
                    for (var e = 0, d; d = a[e]; e++) {
                        if (d.id === b) {
                            return [d]
                        }
                    }
                }
            }
            if (a) {
                if (c) {
                    if (c == "child") {
                        for (var f = 0, d; d = a[f]; f++) {
                            if (k.parentNode == d) {
                                return [k]
                            }
                        }
                    } else {
                        if (c == "descendant") {
                            for (var f = 0, d; d = a[f]; f++) {
                                if (Element.descendantOf(k, d)) {
                                    return [k]
                                }
                            }
                        } else {
                            if (c == "adjacent") {
                                for (var f = 0, d; d = a[f]; f++) {
                                    if (Selector.handlers.previousElementSibling(k) == d) {
                                        return [k]
                                    }
                                }
                            } else {
                                a = g[c](a)
                            }
                        }
                    }
                }
                for (var f = 0, d; d = a[f]; f++) {
                    if (d == k) {
                        return [k]
                    }
                }
                return []
            }
            return (k && Element.descendantOf(k, l)) ? [k] : []
        },
        className: function (b, a, c, d) {
            if (b && d) {
                b = this[d](b)
            }
            return Selector.handlers.byClassName(b, a, c)
        },
        byClassName: function (c, b, f) {
            if (!c) {
                c = Selector.handlers.descendant([b])
            }
            var h = " " + f + " ";
            for (var e = 0, d = [], g, a; g = c[e]; e++) {
                a = g.className;
                if (a.length == 0) {
                    continue
                }
                if (a == f || (" " + a + " ").include(h)) {
                    d.push(g)
                }
            }
            return d
        },
        attrPresence: function (c, b, a, g) {
            if (!c) {
                c = b.getElementsByTagName("*")
            }
            if (c && g) {
                c = this[g](c)
            }
            var e = [];
            for (var d = 0, f; f = c[d]; d++) {
                if (Element.hasAttribute(f, a)) {
                    e.push(f)
                }
            }
            return e
        },
        attr: function (a, j, h, k, c, b) {
            if (!a) {
                a = j.getElementsByTagName("*")
            }
            if (a && b) {
                a = this[b](a)
            }
            var l = Selector.operators[c],
                f = [];
            for (var e = 0, d; d = a[e]; e++) {
                var g = Element.readAttribute(d, h);
                if (g === null) {
                    continue
                }
                if (l(g, k)) {
                    f.push(d)
                }
            }
            return f
        },
        pseudo: function (b, c, e, a, d) {
            if (b && d) {
                b = this[d](b)
            }
            if (!b) {
                b = a.getElementsByTagName("*")
            }
            return Selector.pseudos[c](b, e, a)
        }
    },
    pseudos: {
        "first-child": function (b, f, a) {
            for (var d = 0, c = [], e; e = b[d]; d++) {
                if (Selector.handlers.previousElementSibling(e)) {
                    continue
                }
                c.push(e)
            }
            return c
        },
        "last-child": function (b, f, a) {
            for (var d = 0, c = [], e; e = b[d]; d++) {
                if (Selector.handlers.nextElementSibling(e)) {
                    continue
                }
                c.push(e)
            }
            return c
        },
        "only-child": function (b, g, a) {
            var e = Selector.handlers;
            for (var d = 0, c = [], f; f = b[d]; d++) {
                if (!e.previousElementSibling(f) && !e.nextElementSibling(f)) {
                    c.push(f)
                }
            }
            return c
        },
        "nth-child": function (b, c, a) {
            return Selector.pseudos.nth(b, c, a)
        },
        "nth-last-child": function (b, c, a) {
            return Selector.pseudos.nth(b, c, a, true)
        },
        "nth-of-type": function (b, c, a) {
            return Selector.pseudos.nth(b, c, a, false, true)
        },
        "nth-last-of-type": function (b, c, a) {
            return Selector.pseudos.nth(b, c, a, true, true)
        },
        "first-of-type": function (b, c, a) {
            return Selector.pseudos.nth(b, "1", a, false, true)
        },
        "last-of-type": function (b, c, a) {
            return Selector.pseudos.nth(b, "1", a, true, true)
        },
        "only-of-type": function (b, d, a) {
            var c = Selector.pseudos;
            return c["last-of-type"](c["first-of-type"](b, d, a), d, a)
        },
        getIndices: function (d, c, e) {
            if (d == 0) {
                return c > 0 ? [c] : []
            }
            return $R(1, e).inject([], function (a, b) {
                if (0 == (b - c) % d && (b - c) / d >= 0) {
                    a.push(b)
                }
                return a
            })
        },
        nth: function (c, s, v, r, e) {
            if (c.length == 0) {
                return []
            }
            if (s == "even") {
                s = "2n+0"
            }
            if (s == "odd") {
                s = "2n+1"
            }
            var q = Selector.handlers,
                p = [],
                d = [],
                g;
            q.mark(c);
            for (var o = 0, f; f = c[o]; o++) {
                if (!f.parentNode._countedByPrototype) {
                    q.index(f.parentNode, r, e);
                    d.push(f.parentNode)
                }
            }
            if (s.match(/^\d+$/)) {
                s = Number(s);
                for (var o = 0, f; f = c[o]; o++) {
                    if (f.nodeIndex == s) {
                        p.push(f)
                    }
                }
            } else {
                if (g = s.match(/^(-?\d*)?n(([+-])(\d+))?/)) {
                    if (g[1] == "-") {
                        g[1] = -1
                    }
                    var w = g[1] ? Number(g[1]) : 1;
                    var u = g[2] ? Number(g[2]) : 0;
                    var x = Selector.pseudos.getIndices(w, u, c.length);
                    for (var o = 0, f, k = x.length; f = c[o]; o++) {
                        for (var n = 0; n < k; n++) {
                            if (f.nodeIndex == x[n]) {
                                p.push(f)
                            }
                        }
                    }
                }
            }
            q.unmark(c);
            q.unmark(d);
            return p
        },
        empty: function (b, f, a) {
            for (var d = 0, c = [], e; e = b[d]; d++) {
                if (e.tagName == "!" || e.firstChild) {
                    continue
                }
                c.push(e)
            }
            return c
        },
        not: function (a, d, k) {
            var g = Selector.handlers,
                l, c;
            var j = new Selector(d).findElements(k);
            g.mark(j);
            for (var f = 0, e = [], b; b = a[f]; f++) {
                if (!b._countedByPrototype) {
                    e.push(b)
                }
            }
            g.unmark(j);
            return e
        },
        enabled: function (b, f, a) {
            for (var d = 0, c = [], e; e = b[d]; d++) {
                if (!e.disabled && (!e.type || e.type !== "hidden")) {
                    c.push(e)
                }
            }
            return c
        },
        disabled: function (b, f, a) {
            for (var d = 0, c = [], e; e = b[d]; d++) {
                if (e.disabled) {
                    c.push(e)
                }
            }
            return c
        },
        checked: function (b, f, a) {
            for (var d = 0, c = [], e; e = b[d]; d++) {
                if (e.checked) {
                    c.push(e)
                }
            }
            return c
        }
    },
    operators: {
        "=": function (b, a) {
            return b == a
        },
        "!=": function (b, a) {
            return b != a
        },
        "^=": function (b, a) {
            return b == a || b && b.startsWith(a)
        },
        "$=": function (b, a) {
            return b == a || b && b.endsWith(a)
        },
        "*=": function (b, a) {
            return b == a || b && b.include(a)
        },
        "~=": function (b, a) {
            return (" " + b + " ").include(" " + a + " ")
        },
        "|=": function (b, a) {
            return ("-" + (b || "").toUpperCase() + "-").include("-" + (a || "").toUpperCase() + "-")
        }
    },
    split: function (b) {
        var a = [];
        b.scan(/(([\w#:.~>+()\s-]+|\*|\[.*?\])+)\s*(,|$)/, function (c) {
            a.push(c[1].strip())
        });
        return a
    },
    matchElements: function (f, g) {
        var e = $$(g),
            d = Selector.handlers;
        d.mark(e);
        for (var c = 0, b = [], a; a = f[c]; c++) {
            if (a._countedByPrototype) {
                b.push(a)
            }
        }
        d.unmark(e);
        return b
    },
    findElement: function (b, c, a) {
        if (Object.isNumber(c)) {
            a = c;
            c = false
        }
        return Selector.matchElements(b, c || "*")[a || 0]
    },
    findChildElements: function (e, g) {
        g = Selector.split(g.join(","));
        var d = [],
            f = Selector.handlers;
        for (var c = 0, b = g.length, a; c < b; c++) {
            a = new Selector(g[c].strip());
            f.concat(d, a.findElements(e))
        }
        return (b > 1) ? f.unique(d) : d
    }
});
if (Prototype.Browser.IE) {
    Object.extend(Selector.handlers, {
        concat: function (d, c) {
            for (var e = 0, f; f = c[e]; e++) {
                if (f.tagName !== "!") {
                    d.push(f)
                }
            }
            return d
        }
    })
}
function $$() {
    return Selector.findChildElements(document, $A(arguments))
}
var Form = {
    reset: function (a) {
        a = $(a);
        a.reset();
        return a
    },
    serializeElements: function (g, b) {
        if (typeof b != "object") {
            b = {
                hash: !! b
            }
        } else {
            if (Object.isUndefined(b.hash)) {
                b.hash = true
            }
        }
        var c, f, a = false,
            e = b.submit;
        var d = g.inject({}, function (h, j) {
            if (!j.disabled && j.name) {
                c = j.name;
                f = $(j).getValue();
                if (f != null && j.type != "file" && (j.type != "submit" || (!a && e !== false && (!e || c == e) && (a = true)))) {
                    if (c in h) {
                        if (!Object.isArray(h[c])) {
                            h[c] = [h[c]]
                        }
                        h[c].push(f)
                    } else {
                        h[c] = f
                    }
                }
            }
            return h
        });
        return b.hash ? d : Object.toQueryString(d)
    }
};
Form.Methods = {
    serialize: function (b, a) {
        return Form.serializeElements(Form.getElements(b), a)
    },
    getElements: function (e) {
        var f = $(e).getElementsByTagName("*"),
            d, a = [],
            c = Form.Element.Serializers;
        for (var b = 0; d = f[b]; b++) {
            a.push(d)
        }
        return a.inject([], function (g, h) {
            if (c[h.tagName.toLowerCase()]) {
                g.push(Element.extend(h))
            }
            return g
        })
    },
    getInputs: function (g, c, d) {
        g = $(g);
        var a = g.getElementsByTagName("input");
        if (!c && !d) {
            return $A(a).map(Element.extend)
        }
        for (var e = 0, h = [], f = a.length; e < f; e++) {
            var b = a[e];
            if ((c && b.type != c) || (d && b.name != d)) {
                continue
            }
            h.push(Element.extend(b))
        }
        return h
    },
    disable: function (a) {
        a = $(a);
        Form.getElements(a).invoke("disable");
        return a
    },
    enable: function (a) {
        a = $(a);
        Form.getElements(a).invoke("enable");
        return a
    },
    findFirstElement: function (b) {
        var c = $(b).getElements().findAll(function (d) {
            return "hidden" != d.type && !d.disabled
        });
        var a = c.findAll(function (d) {
            return d.hasAttribute("tabIndex") && d.tabIndex >= 0
        }).sortBy(function (d) {
            return d.tabIndex
        }).first();
        return a ? a : c.find(function (d) {
            return /^(?:input|select|textarea)$/i.test(d.tagName)
        })
    },
    focusFirstElement: function (a) {
        a = $(a);
        a.findFirstElement().activate();
        return a
    },
    request: function (b, a) {
        b = $(b), a = Object.clone(a || {});
        var d = a.parameters,
            c = b.readAttribute("action") || "";
        if (c.blank()) {
            c = window.location.href
        }
        a.parameters = b.serialize(true);
        if (d) {
            if (Object.isString(d)) {
                d = d.toQueryParams()
            }
            Object.extend(a.parameters, d)
        }
        if (b.hasAttribute("method") && !a.method) {
            a.method = b.method
        }
        return new Ajax.Request(c, a)
    }
};
Form.Element = {
    focus: function (a) {
        $(a).focus();
        return a
    },
    select: function (a) {
        $(a).select();
        return a
    }
};
Form.Element.Methods = {
    serialize: function (a) {
        a = $(a);
        if (!a.disabled && a.name) {
            var b = a.getValue();
            if (b != undefined) {
                var c = {};
                c[a.name] = b;
                return Object.toQueryString(c)
            }
        }
        return ""
    },
    getValue: function (a) {
        a = $(a);
        var b = a.tagName.toLowerCase();
        return Form.Element.Serializers[b](a)
    },
    setValue: function (a, b) {
        a = $(a);
        var c = a.tagName.toLowerCase();
        Form.Element.Serializers[c](a, b);
        return a
    },
    clear: function (a) {
        $(a).value = "";
        return a
    },
    present: function (a) {
        return $(a).value != ""
    },
    activate: function (a) {
        a = $(a);
        try {
            a.focus();
            if (a.select && (a.tagName.toLowerCase() != "input" || !(/^(?:button|reset|submit)$/i.test(a.type)))) {
                a.select()
            }
        } catch (b) {}
        return a
    },
    disable: function (a) {
        a = $(a);
        a.disabled = true;
        return a
    },
    enable: function (a) {
        a = $(a);
        a.disabled = false;
        return a
    }
};
var Field = Form.Element;
var $F = Form.Element.Methods.getValue;
Form.Element.Serializers = {
    input: function (a, b) {
        switch (a.type.toLowerCase()) {
        case "checkbox":
        case "radio":
            return Form.Element.Serializers.inputSelector(a, b);
        default:
            return Form.Element.Serializers.textarea(a, b)
        }
    },
    inputSelector: function (a, b) {
        if (Object.isUndefined(b)) {
            return a.checked ? a.value : null
        } else {
            a.checked = !! b
        }
    },
    textarea: function (a, b) {
        if (Object.isUndefined(b)) {
            return a.value
        } else {
            a.value = b
        }
    },
    select: function (c, f) {
        if (Object.isUndefined(f)) {
            return this[c.type == "select-one" ? "selectOne" : "selectMany"](c)
        } else {
            var b, d, g = !Object.isArray(f);
            for (var a = 0, e = c.length; a < e; a++) {
                b = c.options[a];
                d = this.optionValue(b);
                if (g) {
                    if (d == f) {
                        b.selected = true;
                        return
                    }
                } else {
                    b.selected = f.include(d)
                }
            }
        }
    },
    selectOne: function (b) {
        var a = b.selectedIndex;
        return a >= 0 ? this.optionValue(b.options[a]) : null
    },
    selectMany: function (d) {
        var a, e = d.length;
        if (!e) {
            return null
        }
        for (var c = 0, a = []; c < e; c++) {
            var b = d.options[c];
            if (b.selected) {
                a.push(this.optionValue(b))
            }
        }
        return a
    },
    optionValue: function (a) {
        return Element.extend(a).hasAttribute("value") ? a.value : a.text
    }
};
Abstract.TimedObserver = Class.create(PeriodicalExecuter, {
    initialize: function ($super, a, b, c) {
        $super(c, b);
        this.element = $(a);
        this.lastValue = this.getValue()
    },
    execute: function () {
        var a = this.getValue();
        if (Object.isString(this.lastValue) && Object.isString(a) ? this.lastValue != a : String(this.lastValue) != String(a)) {
            this.callback(this.element, a);
            this.lastValue = a
        }
    }
});
Form.Element.Observer = Class.create(Abstract.TimedObserver, {
    getValue: function () {
        return Form.Element.getValue(this.element)
    }
});
Form.Observer = Class.create(Abstract.TimedObserver, {
    getValue: function () {
        return Form.serialize(this.element)
    }
});
Abstract.EventObserver = Class.create({
    initialize: function (a, b) {
        this.element = $(a);
        this.callback = b;
        this.lastValue = this.getValue();
        if (this.element.tagName.toLowerCase() == "form") {
            this.registerFormCallbacks()
        } else {
            this.registerCallback(this.element)
        }
    },
    onElementEvent: function () {
        var a = this.getValue();
        if (this.lastValue != a) {
            this.callback(this.element, a);
            this.lastValue = a
        }
    },
    registerFormCallbacks: function () {
        Form.getElements(this.element).each(this.registerCallback, this)
    },
    registerCallback: function (a) {
        if (a.type) {
            switch (a.type.toLowerCase()) {
            case "checkbox":
            case "radio":
                Event.observe(a, "click", this.onElementEvent.bind(this));
                break;
            default:
                Event.observe(a, "change", this.onElementEvent.bind(this));
                break
            }
        }
    }
});
Form.Element.EventObserver = Class.create(Abstract.EventObserver, {
    getValue: function () {
        return Form.Element.getValue(this.element)
    }
});
Form.EventObserver = Class.create(Abstract.EventObserver, {
    getValue: function () {
        return Form.serialize(this.element)
    }
});
(function () {
    var x = {
        KEY_BACKSPACE: 8,
        KEY_TAB: 9,
        KEY_RETURN: 13,
        KEY_ESC: 27,
        KEY_LEFT: 37,
        KEY_UP: 38,
        KEY_RIGHT: 39,
        KEY_DOWN: 40,
        KEY_DELETE: 46,
        KEY_HOME: 36,
        KEY_END: 35,
        KEY_PAGEUP: 33,
        KEY_PAGEDOWN: 34,
        KEY_INSERT: 45,
        cache: {}
    };
    var e = document.documentElement;
    var y = "onmouseenter" in e && "onmouseleave" in e;
    var p;
    if (Prototype.Browser.IE) {
        var h = {
            0: 1,
            1: 4,
            2: 2
        };
        p = function (A, z) {
            return A.button === h[z]
        }
    } else {
        if (Prototype.Browser.WebKit) {
            p = function (A, z) {
                switch (z) {
                case 0:
                    return A.which == 1 && !A.metaKey;
                case 1:
                    return A.which == 1 && A.metaKey;
                default:
                    return false
                }
            }
        } else {
            p = function (A, z) {
                return A.which ? (A.which === z + 1) : (A.button === z)
            }
        }
    }
    function s(z) {
        return p(z, 0)
    }
    function r(z) {
        return p(z, 1)
    }
    function l(z) {
        return p(z, 2)
    }
    function c(B) {
        B = x.extend(B);
        var A = B.target,
            z = B.type,
            C = B.currentTarget;
        if (C && C.tagName) {
            if (z === "load" || z === "error" || (z === "click" && C.tagName.toLowerCase() === "input" && C.type === "radio")) {
                A = C
            }
        }
        if (A.nodeType == Node.TEXT_NODE) {
            A = A.parentNode
        }
        return Element.extend(A)
    }
    function n(A, C) {
        var z = x.element(A);
        if (!C) {
            return z
        }
        var B = [z].concat(z.ancestors());
        return Selector.findElement(B, C, 0)
    }
    function q(z) {
        return {
            x: b(z),
            y: a(z)
        }
    }
    function b(B) {
        var A = document.documentElement,
            z = document.body || {
                scrollLeft: 0
            };
        return B.pageX || (B.clientX + (A.scrollLeft || z.scrollLeft) - (A.clientLeft || 0))
    }
    function a(B) {
        var A = document.documentElement,
            z = document.body || {
                scrollTop: 0
            };
        return B.pageY || (B.clientY + (A.scrollTop || z.scrollTop) - (A.clientTop || 0))
    }
    function o(z) {
        x.extend(z);
        z.preventDefault();
        z.stopPropagation();
        z.stopped = true
    }
    x.Methods = {
        isLeftClick: s,
        isMiddleClick: r,
        isRightClick: l,
        element: c,
        findElement: n,
        pointer: q,
        pointerX: b,
        pointerY: a,
        stop: o
    };
    var v = Object.keys(x.Methods).inject({}, function (z, A) {
        z[A] = x.Methods[A].methodize();
        return z
    });
    if (Prototype.Browser.IE) {
        function g(A) {
            var z;
            switch (A.type) {
            case "mouseover":
                z = A.fromElement;
                break;
            case "mouseout":
                z = A.toElement;
                break;
            default:
                return null
            }
            return Element.extend(z)
        }
        Object.extend(v, {
            stopPropagation: function () {
                this.cancelBubble = true
            },
            preventDefault: function () {
                this.returnValue = false
            },
            inspect: function () {
                return "[object Event]"
            }
        });
        x.extend = function (A, z) {
            if (!A) {
                return false
            }
            if (A._extendedByPrototype) {
                return A
            }
            A._extendedByPrototype = Prototype.emptyFunction;
            var B = x.pointer(A);
            Object.extend(A, {
                target: A.srcElement || z,
                relatedTarget: g(A),
                pageX: B.x,
                pageY: B.y
            });
            return Object.extend(A, v)
        }
    } else {
        x.prototype = window.Event.prototype || document.createEvent("HTMLEvents").__proto__;
        Object.extend(x.prototype, v);
        x.extend = Prototype.K
    }
    function m(D, C, E) {
        var B = Element.retrieve(D, "prototype_event_registry");
        if (Object.isUndefined(B)) {
            d.push(D);
            B = Element.retrieve(D, "prototype_event_registry", $H())
        }
        var z = B.get(C);
        if (Object.isUndefined(z)) {
            z = [];
            B.set(C, z)
        }
        if (z.pluck("handler").include(E)) {
            return false
        }
        var A;
        if (C.include(":")) {
            A = function (F) {
                if (Object.isUndefined(F.eventName)) {
                    return false
                }
                if (F.eventName !== C) {
                    return false
                }
                x.extend(F, D);
                E.call(D, F)
            }
        } else {
            if (!y && (C === "mouseenter" || C === "mouseleave")) {
                if (C === "mouseenter" || C === "mouseleave") {
                    A = function (G) {
                        x.extend(G, D);
                        var F = G.relatedTarget;
                        while (F && F !== D) {
                            try {
                                F = F.parentNode
                            } catch (H) {
                                F = D
                            }
                        }
                        if (F === D) {
                            return
                        }
                        E.call(D, G)
                    }
                }
            } else {
                A = function (F) {
                    x.extend(F, D);
                    E.call(D, F)
                }
            }
        }
        A.handler = E;
        z.push(A);
        return A
    }
    function f() {
        for (var z = 0, A = d.length; z < A; z++) {
            x.stopObserving(d[z]);
            d[z] = null
        }
    }
    var d = [];
    if (Prototype.Browser.IE) {
        window.attachEvent("onunload", f)
    }
    if (Prototype.Browser.WebKit) {
        window.addEventListener("unload", Prototype.emptyFunction, false)
    }
    var k = Prototype.K;
    if (!y) {
        k = function (A) {
            var z = {
                mouseenter: "mouseover",
                mouseleave: "mouseout"
            };
            return A in z ? z[A] : A
        }
    }
    function u(C, B, D) {
        C = $(C);
        var A = m(C, B, D);
        if (!A) {
            return C
        }
        if (B.include(":")) {
            if (C.addEventListener) {
                C.addEventListener("dataavailable", A, false)
            } else {
                C.attachEvent("ondataavailable", A);
                C.attachEvent("onfilterchange", A)
            }
        } else {
            var z = k(B);
            if (C.addEventListener) {
                C.addEventListener(z, A, false)
            } else {
                C.attachEvent("on" + z, A)
            }
        }
        return C
    }
    function j(E, C, F) {
        E = $(E);
        var B = Element.retrieve(E, "prototype_event_registry");
        if (Object.isUndefined(B)) {
            return E
        }
        if (C && !F) {
            var D = B.get(C);
            if (Object.isUndefined(D)) {
                return E
            }
            D.each(function (G) {
                Element.stopObserving(E, C, G.handler)
            });
            return E
        } else {
            if (!C) {
                B.each(function (I) {
                    var G = I.key,
                        H = I.value;
                    H.each(function (J) {
                        Element.stopObserving(E, G, J.handler)
                    })
                });
                return E
            }
        }
        var D = B.get(C);
        if (!D) {
            return
        }
        var A = D.find(function (G) {
            return G.handler === F
        });
        if (!A) {
            return E
        }
        var z = k(C);
        if (C.include(":")) {
            if (E.removeEventListener) {
                E.removeEventListener("dataavailable", A, false)
            } else {
                E.detachEvent("ondataavailable", A);
                E.detachEvent("onfilterchange", A)
            }
        } else {
            if (E.removeEventListener) {
                E.removeEventListener(z, A, false)
            } else {
                E.detachEvent("on" + z, A)
            }
        }
        B.set(C, D.without(A));
        return E
    }
    function w(C, B, A, z) {
        C = $(C);
        if (Object.isUndefined(z)) {
            z = true
        }
        if (C == document && document.createEvent && !C.dispatchEvent) {
            C = document.documentElement
        }
        var D;
        if (document.createEvent) {
            D = document.createEvent("HTMLEvents");
            D.initEvent("dataavailable", true, true)
        } else {
            D = document.createEventObject();
            D.eventType = z ? "ondataavailable" : "onfilterchange"
        }
        D.eventName = B;
        D.memo = A || {};
        if (document.createEvent) {
            C.dispatchEvent(D)
        } else {
            C.fireEvent(D.eventType, D)
        }
        return x.extend(D)
    }
    Object.extend(x, x.Methods);
    Object.extend(x, {
        fire: w,
        observe: u,
        stopObserving: j
    });
    Element.addMethods({
        fire: w,
        observe: u,
        stopObserving: j
    });
    Object.extend(document, {
        fire: w.methodize(),
        observe: u.methodize(),
        stopObserving: j.methodize(),
        loaded: false
    });
    if (window.Event) {
        Object.extend(window.Event, x)
    } else {
        window.Event = x
    }
})();
(function () {
    var d;

    function a() {
        if (document.loaded) {
            return
        }
        if (d) {
            window.clearTimeout(d)
        }
        document.loaded = true;
        document.fire("dom:loaded")
    }
    function c() {
        if (document.readyState === "complete") {
            document.stopObserving("readystatechange", c);
            a()
        }
    }
    function b() {
        try {
            document.documentElement.doScroll("left")
        } catch (f) {
            d = b.defer();
            return
        }
        a()
    }
    if (document.addEventListener) {
        document.addEventListener("DOMContentLoaded", a, false)
    } else {
        document.observe("readystatechange", c);
        if (window == top) {
            d = b.defer()
        }
    }
    Event.observe(window, "load", a)
})();
Element.addMethods();
Hash.toQueryString = Object.toQueryString;
var Toggle = {
    display: Element.toggle
};
Element.Methods.childOf = Element.Methods.descendantOf;
var Insertion = {
    Before: function (a, b) {
        return Element.insert(a, {
            before: b
        })
    },
    Top: function (a, b) {
        return Element.insert(a, {
            top: b
        })
    },
    Bottom: function (a, b) {
        return Element.insert(a, {
            bottom: b
        })
    },
    After: function (a, b) {
        return Element.insert(a, {
            after: b
        })
    }
};
var $continue = new Error('"throw $continue" is deprecated, use "return" instead');
var Position = {
    includeScrollOffsets: false,
    prepare: function () {
        this.deltaX = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0;
        this.deltaY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
    },
    within: function (b, a, c) {
        if (this.includeScrollOffsets) {
            return this.withinIncludingScrolloffsets(b, a, c)
        }
        this.xcomp = a;
        this.ycomp = c;
        this.offset = Element.cumulativeOffset(b);
        return (c >= this.offset[1] && c < this.offset[1] + b.offsetHeight && a >= this.offset[0] && a < this.offset[0] + b.offsetWidth)
    },
    withinIncludingScrolloffsets: function (b, a, d) {
        var c = Element.cumulativeScrollOffset(b);
        this.xcomp = a + c[0] - this.deltaX;
        this.ycomp = d + c[1] - this.deltaY;
        this.offset = Element.cumulativeOffset(b);
        return (this.ycomp >= this.offset[1] && this.ycomp < this.offset[1] + b.offsetHeight && this.xcomp >= this.offset[0] && this.xcomp < this.offset[0] + b.offsetWidth)
    },
    overlap: function (b, a) {
        if (!b) {
            return 0
        }
        if (b == "vertical") {
            return ((this.offset[1] + a.offsetHeight) - this.ycomp) / a.offsetHeight
        }
        if (b == "horizontal") {
            return ((this.offset[0] + a.offsetWidth) - this.xcomp) / a.offsetWidth
        }
    },
    cumulativeOffset: Element.Methods.cumulativeOffset,
    positionedOffset: Element.Methods.positionedOffset,
    absolutize: function (a) {
        Position.prepare();
        return Element.absolutize(a)
    },
    relativize: function (a) {
        Position.prepare();
        return Element.relativize(a)
    },
    realOffset: Element.Methods.cumulativeScrollOffset,
    offsetParent: Element.Methods.getOffsetParent,
    page: Element.Methods.viewportOffset,
    clone: function (b, c, a) {
        a = a || {};
        return Element.clonePosition(c, b, a)
    }
};
if (!document.getElementsByClassName) {
    document.getElementsByClassName = function (b) {
        function a(c) {
            return c.blank() ? null : "[contains(concat(' ', @class, ' '), ' " + c + " ')]"
        }
        b.getElementsByClassName = Prototype.BrowserFeatures.XPath ?
        function (c, e) {
            e = e.toString().strip();
            var d = /\s/.test(e) ? $w(e).map(a).join("") : a(e);
            return d ? document._getElementsByXPath(".//*" + d, c) : []
        } : function (e, f) {
            f = f.toString().strip();
            var g = [],
                h = (/\s/.test(f) ? $w(f) : null);
            if (!h && !f) {
                return g
            }
            var c = $(e).getElementsByTagName("*");
            f = " " + f + " ";
            for (var d = 0, k, j; k = c[d]; d++) {
                if (k.className && (j = " " + k.className + " ") && (j.include(f) || (h && h.all(function (l) {
                    return !l.toString().blank() && j.include(" " + l + " ")
                })))) {
                    g.push(Element.extend(k))
                }
            }
            return g
        };
        return function (d, c) {
            return $(c || document.body).getElementsByClassName(d)
        }
    }(Element.Methods)
}
Element.ClassNames = Class.create();
Element.ClassNames.prototype = {
    initialize: function (a) {
        this.element = $(a)
    },
    _each: function (a) {
        this.element.className.split(/\s+/).select(function (b) {
            return b.length > 0
        })._each(a)
    },
    set: function (a) {
        this.element.className = a
    },
    add: function (a) {
        if (this.include(a)) {
            return
        }
        this.set($A(this).concat(a).join(" "))
    },
    remove: function (a) {
        if (!this.include(a)) {
            return
        }
        this.set($A(this).without(a).join(" "))
    },
    toString: function () {
        return $A(this).join(" ")
    }
};
Object.extend(Element.ClassNames.prototype, Enumerable);
(function () {
    function d(h) {
        var f = h.element(),
            g = [f].concat(f.ancestors());
        ((this.retrieve("prototype_delegates") || $H()).get(h.eventName || h.type) || []).each(function (j) {
            if (f = Selector.matchElements(g, j.key)[0]) {
                j.value.invoke("call", f, h)
            }
        })
    }
    function b(j, f, l, k) {
        j = $(j);
        var g = j.retrieve("prototype_delegates");
        if (Object.isUndefined(g)) {
            j.store("prototype_delegates", g = $H())
        }
        var h = g.get(l);
        if (Object.isUndefined(h)) {
            Event.observe(j, l, d);
            g.set(l, $H()).set(f, [k])
        } else {
            (h.get(f) || h.set(f, [])).push(k)
        }
        return j
    }
    function a(g, f, h) {
        f.unset(h);
        Event.observe(g, h, d)
    }
    function c(j, h, f, k, g) {
        g.unset(f);
        if (g.values().length == 0) {
            a(j, h, k)
        }
    }
    function e(j, f, l, k) {
        j = $(j);
        var h = j.retrieve("prototype_delegates");
        if (Object.isUndefined(h)) {
            return
        }
        switch (arguments.length) {
        case 1:
            h.each(function (n) {
                a(j, h, n.key)
            });
            break;
        case 2:
            h.each(function (n) {
                c(j, h, f, n.key, n.value)
            });
            break;
        case 3:
            var g = h.get(l);
            if (g) {
                c(j, h, f, l, g)
            }
            break;
        default:
        case 4:
            var g = h.get(l);
            if (!g) {
                return
            }
            var m = g.get(f);
            if (m) {
                m = m.reject(function (n) {
                    return n == k
                });
                if (m.length > 0) {
                    g.set(f, m)
                } else {
                    c(j, h, f, l, g)
                }
            }
        }
    }
    document.delegate = b.methodize();
    document.stopDelegate = e.methodize();
    Event.delegate = b;
    Event.stopDelegate = e;
    Element.addMethods({
        delegate: b,
        stopDelegating: e
    })
})();
String.prototype.parseColor = function () {
    var a = "#";
    if (this.slice(0, 4) == "rgb(") {
        var c = this.slice(4, this.length - 1).split(",");
        var b = 0;
        do {
            a += parseInt(c[b]).toColorPart()
        } while (++b < 3)
    } else {
        if (this.slice(0, 1) == "#") {
            if (this.length == 4) {
                for (var b = 1; b < 4; b++) {
                    a += (this.charAt(b) + this.charAt(b)).toLowerCase()
                }
            }
            if (this.length == 7) {
                a = this.toLowerCase()
            }
        }
    }
    return (a.length == 7 ? a : (arguments[0] || this))
};
Element.collectTextNodes = function (a) {
    return $A($(a).childNodes).collect(function (b) {
        return (b.nodeType == 3 ? b.nodeValue : (b.hasChildNodes() ? Element.collectTextNodes(b) : ""))
    }).flatten().join("")
};
Element.collectTextNodesIgnoreClass = function (a, b) {
    return $A($(a).childNodes).collect(function (c) {
        return (c.nodeType == 3 ? c.nodeValue : ((c.hasChildNodes() && !Element.hasClassName(c, b)) ? Element.collectTextNodesIgnoreClass(c, b) : ""))
    }).flatten().join("")
};
Element.setContentZoom = function (a, b) {
    a = $(a);
    a.setStyle({
        fontSize: (b / 100) + "em"
    });
    if (Prototype.Browser.WebKit) {
        window.scrollBy(0, 0)
    }
    return a
};
Element.getInlineOpacity = function (a) {
    return $(a).style.opacity || ""
};
Element.forceRerendering = function (a) {
    try {
        a = $(a);
        var c = document.createTextNode(" ");
        a.appendChild(c);
        a.removeChild(c)
    } catch (b) {}
};
var Effect = {
    _elementDoesNotExistError: {
        name: "ElementDoesNotExistError",
        message: "The specified DOM element does not exist, but is required for this effect to operate"
    },
    Transitions: {
        linear: Prototype.K,
        sinoidal: function (a) {
            return (-Math.cos(a * Math.PI) / 2) + 0.5
        },
        reverse: function (a) {
            return 1 - a
        },
        flicker: function (a) {
            var a = ((-Math.cos(a * Math.PI) / 4) + 0.75) + Math.random() / 4;
            return a > 1 ? 1 : a
        },
        wobble: function (a) {
            return (-Math.cos(a * Math.PI * (9 * a)) / 2) + 0.5
        },
        pulse: function (b, a) {
            return (-Math.cos((b * ((a || 5) - 0.5) * 2) * Math.PI) / 2) + 0.5
        },
        spring: function (a) {
            return 1 - (Math.cos(a * 4.5 * Math.PI) * Math.exp(-a * 6))
        },
        none: function (a) {
            return 0
        },
        full: function (a) {
            return 1
        }
    },
    DefaultOptions: {
        duration: 1,
        fps: 100,
        sync: false,
        from: 0,
        to: 1,
        delay: 0,
        queue: "parallel"
    },
    tagifyText: function (a) {
        var b = "position:relative";
        if (Prototype.Browser.IE) {
            b += ";zoom:1"
        }
        a = $(a);
        $A(a.childNodes).each(function (c) {
            if (c.nodeType == 3) {
                c.nodeValue.toArray().each(function (d) {
                    a.insertBefore(new Element("span", {
                        style: b
                    }).update(d == " " ? String.fromCharCode(160) : d), c)
                });
                Element.remove(c)
            }
        })
    },
    multiple: function (b, c) {
        var e;
        if (((typeof b == "object") || Object.isFunction(b)) && (b.length)) {
            e = b
        } else {
            e = $(b).childNodes
        }
        var a = Object.extend({
            speed: 0.1,
            delay: 0
        }, arguments[2] || {});
        var d = a.delay;
        $A(e).each(function (g, f) {
            new c(g, Object.extend(a, {
                delay: f * a.speed + d
            }))
        })
    },
    PAIRS: {
        slide: ["SlideDown", "SlideUp"],
        blind: ["BlindDown", "BlindUp"],
        appear: ["Appear", "Fade"]
    },
    toggle: function (b, c) {
        b = $(b);
        c = (c || "appear").toLowerCase();
        var a = Object.extend({
            queue: {
                position: "end",
                scope: (b.id || "global"),
                limit: 1
            }
        }, arguments[2] || {});
        Effect[b.visible() ? Effect.PAIRS[c][1] : Effect.PAIRS[c][0]](b, a)
    }
};
Effect.DefaultOptions.transition = Effect.Transitions.sinoidal;
Effect.ScopedQueue = Class.create(Enumerable, {
    initialize: function () {
        this.effects = [];
        this.interval = null
    },
    _each: function (a) {
        this.effects._each(a)
    },
    add: function (b) {
        var c = new Date().getTime();
        var a = Object.isString(b.options.queue) ? b.options.queue : b.options.queue.position;
        switch (a) {
        case "front":
            this.effects.findAll(function (d) {
                return d.state == "idle"
            }).each(function (d) {
                d.startOn += b.finishOn;
                d.finishOn += b.finishOn
            });
            break;
        case "with-last":
            c = this.effects.pluck("startOn").max() || c;
            break;
        case "end":
            c = this.effects.pluck("finishOn").max() || c;
            break
        }
        b.startOn += c;
        b.finishOn += c;
        if (!b.options.queue.limit || (this.effects.length < b.options.queue.limit)) {
            this.effects.push(b)
        }
        if (!this.interval) {
            this.interval = setInterval(this.loop.bind(this), 15)
        }
    },
    remove: function (a) {
        this.effects = this.effects.reject(function (b) {
            return b == a
        });
        if (this.effects.length == 0) {
            clearInterval(this.interval);
            this.interval = null
        }
    },
    loop: function () {
        var c = new Date().getTime();
        for (var b = 0, a = this.effects.length; b < a; b++) {
            this.effects[b] && this.effects[b].loop(c)
        }
    }
});
Effect.Queues = {
    instances: $H(),
    get: function (a) {
        if (!Object.isString(a)) {
            return a
        }
        return this.instances.get(a) || this.instances.set(a, new Effect.ScopedQueue())
    }
};
Effect.Queue = Effect.Queues.get("global");
Effect.Base = Class.create({
    position: null,
    start: function (a) {
        if (a && a.transition === false) {
            a.transition = Effect.Transitions.linear
        }
        this.options = Object.extend(Object.extend({}, Effect.DefaultOptions), a || {});
        this.currentFrame = 0;
        this.state = "idle";
        this.startOn = this.options.delay * 1000;
        this.finishOn = this.startOn + (this.options.duration * 1000);
        this.fromToDelta = this.options.to - this.options.from;
        this.totalTime = this.finishOn - this.startOn;
        this.totalFrames = this.options.fps * this.options.duration;
        this.render = (function () {
            function b(d, c) {
                if (d.options[c + "Internal"]) {
                    d.options[c + "Internal"](d)
                }
                if (d.options[c]) {
                    d.options[c](d)
                }
            }
            return function (c) {
                if (this.state === "idle") {
                    this.state = "running";
                    b(this, "beforeSetup");
                    if (this.setup) {
                        this.setup()
                    }
                    b(this, "afterSetup")
                }
                if (this.state === "running") {
                    c = (this.options.transition(c) * this.fromToDelta) + this.options.from;
                    this.position = c;
                    b(this, "beforeUpdate");
                    if (this.update) {
                        this.update(c)
                    }
                    b(this, "afterUpdate")
                }
            }
        })();
        this.event("beforeStart");
        if (!this.options.sync) {
            Effect.Queues.get(Object.isString(this.options.queue) ? "global" : this.options.queue.scope).add(this)
        }
    },
    loop: function (c) {
        if (c >= this.startOn) {
            if (c >= this.finishOn) {
                this.render(1);
                this.cancel();
                this.event("beforeFinish");
                if (this.finish) {
                    this.finish()
                }
                this.event("afterFinish");
                return
            }
            var b = (c - this.startOn) / this.totalTime,
                a = (b * this.totalFrames).round();
            if (a > this.currentFrame) {
                this.render(b);
                this.currentFrame = a
            }
        }
    },
    cancel: function () {
        if (!this.options.sync) {
            Effect.Queues.get(Object.isString(this.options.queue) ? "global" : this.options.queue.scope).remove(this)
        }
        this.state = "finished"
    },
    event: function (a) {
        if (this.options[a + "Internal"]) {
            this.options[a + "Internal"](this)
        }
        if (this.options[a]) {
            this.options[a](this)
        }
    },
    inspect: function () {
        var a = $H();
        for (property in this) {
            if (!Object.isFunction(this[property])) {
                a.set(property, this[property])
            }
        }
        return "#<Effect:" + a.inspect() + ",options:" + $H(this.options).inspect() + ">"
    }
});
Effect.Parallel = Class.create(Effect.Base, {
    initialize: function (a) {
        this.effects = a || [];
        this.start(arguments[1])
    },
    update: function (a) {
        this.effects.invoke("render", a)
    },
    finish: function (a) {
        this.effects.each(function (b) {
            b.render(1);
            b.cancel();
            b.event("beforeFinish");
            if (b.finish) {
                b.finish(a)
            }
            b.event("afterFinish")
        })
    }
});
Effect.Tween = Class.create(Effect.Base, {
    initialize: function (c, f, e) {
        c = Object.isString(c) ? $(c) : c;
        var b = $A(arguments),
            d = b.last(),
            a = b.length == 5 ? b[3] : null;
        this.method = Object.isFunction(d) ? d.bind(c) : Object.isFunction(c[d]) ? c[d].bind(c) : function (g) {
            c[d] = g
        };
        this.start(Object.extend({
            from: f,
            to: e
        }, a || {}))
    },
    update: function (a) {
        this.method(a)
    }
});
Effect.Event = Class.create(Effect.Base, {
    initialize: function () {
        this.start(Object.extend({
            duration: 0
        }, arguments[0] || {}))
    },
    update: Prototype.emptyFunction
});
Effect.Opacity = Class.create(Effect.Base, {
    initialize: function (b) {
        this.element = $(b);
        if (!this.element) {
            throw (Effect._elementDoesNotExistError)
        }
        if (Prototype.Browser.IE && (!this.element.currentStyle.hasLayout)) {
            this.element.setStyle({
                zoom: 1
            })
        }
        var a = Object.extend({
            from: this.element.getOpacity() || 0,
            to: 1
        }, arguments[1] || {});
        this.start(a)
    },
    update: function (a) {
        this.element.setOpacity(a)
    }
});
Effect.Move = Class.create(Effect.Base, {
    initialize: function (b) {
        this.element = $(b);
        if (!this.element) {
            throw (Effect._elementDoesNotExistError)
        }
        var a = Object.extend({
            x: 0,
            y: 0,
            mode: "relative"
        }, arguments[1] || {});
        this.start(a)
    },
    setup: function () {
        this.element.makePositioned();
        this.originalLeft = parseFloat(this.element.getStyle("left") || "0");
        this.originalTop = parseFloat(this.element.getStyle("top") || "0");
        if (this.options.mode == "absolute") {
            this.options.x = this.options.x - this.originalLeft;
            this.options.y = this.options.y - this.originalTop
        }
    },
    update: function (a) {
        this.element.setStyle({
            left: (this.options.x * a + this.originalLeft).round() + "px",
            top: (this.options.y * a + this.originalTop).round() + "px"
        })
    }
});
Effect.MoveBy = function (b, a, c) {
    return new Effect.Move(b, Object.extend({
        x: c,
        y: a
    }, arguments[3] || {}))
};
Effect.Scale = Class.create(Effect.Base, {
    initialize: function (b, c) {
        this.element = $(b);
        if (!this.element) {
            throw (Effect._elementDoesNotExistError)
        }
        var a = Object.extend({
            scaleX: true,
            scaleY: true,
            scaleContent: true,
            scaleFromCenter: false,
            scaleMode: "box",
            scaleFrom: 100,
            scaleTo: c
        }, arguments[2] || {});
        this.start(a)
    },
    setup: function () {
        this.restoreAfterFinish = this.options.restoreAfterFinish || false;
        this.elementPositioning = this.element.getStyle("position");
        this.originalStyle = {};
        ["top", "left", "width", "height", "fontSize"].each(function (b) {
            this.originalStyle[b] = this.element.style[b]
        }.bind(this));
        this.originalTop = this.element.offsetTop;
        this.originalLeft = this.element.offsetLeft;
        var a = this.element.getStyle("font-size") || "100%";
        ["em", "px", "%", "pt"].each(function (b) {
            if (a.indexOf(b) > 0) {
                this.fontSize = parseFloat(a);
                this.fontSizeType = b
            }
        }.bind(this));
        this.factor = (this.options.scaleTo - this.options.scaleFrom) / 100;
        this.dims = null;
        if (this.options.scaleMode == "box") {
            this.dims = [this.element.offsetHeight, this.element.offsetWidth]
        }
        if (/^content/.test(this.options.scaleMode)) {
            this.dims = [this.element.scrollHeight, this.element.scrollWidth]
        }
        if (!this.dims) {
            this.dims = [this.options.scaleMode.originalHeight, this.options.scaleMode.originalWidth]
        }
    },
    update: function (a) {
        var b = (this.options.scaleFrom / 100) + (this.factor * a);
        if (this.options.scaleContent && this.fontSize) {
            this.element.setStyle({
                fontSize: this.fontSize * b + this.fontSizeType
            })
        }
        this.setDimensions(this.dims[0] * b, this.dims[1] * b)
    },
    finish: function (a) {
        if (this.restoreAfterFinish) {
            this.element.setStyle(this.originalStyle)
        }
    },
    setDimensions: function (a, e) {
        var f = {};
        if (this.options.scaleX) {
            f.width = e.round() + "px"
        }
        if (this.options.scaleY) {
            f.height = a.round() + "px"
        }
        if (this.options.scaleFromCenter) {
            var c = (a - this.dims[0]) / 2;
            var b = (e - this.dims[1]) / 2;
            if (this.elementPositioning == "absolute") {
                if (this.options.scaleY) {
                    f.top = this.originalTop - c + "px"
                }
                if (this.options.scaleX) {
                    f.left = this.originalLeft - b + "px"
                }
            } else {
                if (this.options.scaleY) {
                    f.top = -c + "px"
                }
                if (this.options.scaleX) {
                    f.left = -b + "px"
                }
            }
        }
        this.element.setStyle(f)
    }
});
Effect.Highlight = Class.create(Effect.Base, {
    initialize: function (b) {
        this.element = $(b);
        if (!this.element) {
            throw (Effect._elementDoesNotExistError)
        }
        var a = Object.extend({
            startcolor: "#ffff99"
        }, arguments[1] || {});
        this.start(a)
    },
    setup: function () {
        if (this.element.getStyle("display") == "none") {
            this.cancel();
            return
        }
        this.oldStyle = {};
        if (!this.options.keepBackgroundImage) {
            this.oldStyle.backgroundImage = this.element.getStyle("background-image");
            this.element.setStyle({
                backgroundImage: "none"
            })
        }
        if (!this.options.endcolor) {
            this.options.endcolor = this.element.getStyle("background-color").parseColor("#ffffff")
        }
        if (!this.options.restorecolor) {
            this.options.restorecolor = this.element.getStyle("background-color")
        }
        this._base = $R(0, 2).map(function (a) {
            return parseInt(this.options.startcolor.slice(a * 2 + 1, a * 2 + 3), 16)
        }.bind(this));
        this._delta = $R(0, 2).map(function (a) {
            return parseInt(this.options.endcolor.slice(a * 2 + 1, a * 2 + 3), 16) - this._base[a]
        }.bind(this))
    },
    update: function (a) {
        this.element.setStyle({
            backgroundColor: $R(0, 2).inject("#", function (b, c, d) {
                return b + ((this._base[d] + (this._delta[d] * a)).round().toColorPart())
            }.bind(this))
        })
    },
    finish: function () {
        this.element.setStyle(Object.extend(this.oldStyle, {
            backgroundColor: this.options.restorecolor
        }))
    }
});
Effect.ScrollTo = function (c) {
    var b = arguments[1] || {},
        a = document.viewport.getScrollOffsets(),
        d = $(c).cumulativeOffset();
    if (b.offset) {
        d[1] += b.offset
    }
    return new Effect.Tween(null, a.top, d[1], b, function (e) {
        scrollTo(a.left, e.round())
    })
};
Effect.Fade = function (c) {
    c = $(c);
    var a = c.getInlineOpacity();
    var b = Object.extend({
        from: c.getOpacity() || 1,
        to: 0,
        afterFinishInternal: function (d) {
            if (d.options.to != 0) {
                return
            }
            d.element.hide().setStyle({
                opacity: a
            })
        }
    }, arguments[1] || {});
    return new Effect.Opacity(c, b)
};
Effect.Appear = function (b) {
    b = $(b);
    var a = Object.extend({
        from: (b.getStyle("display") == "none" ? 0 : b.getOpacity() || 0),
        to: 1,
        afterFinishInternal: function (c) {
            c.element.forceRerendering()
        },
        beforeSetup: function (c) {
            c.element.setOpacity(c.options.from).show()
        }
    }, arguments[1] || {});
    return new Effect.Opacity(b, a)
};
Effect.Puff = function (b) {
    b = $(b);
    var a = {
        opacity: b.getInlineOpacity(),
        position: b.getStyle("position"),
        top: b.style.top,
        left: b.style.left,
        width: b.style.width,
        height: b.style.height
    };
    return new Effect.Parallel([new Effect.Scale(b, 200, {
        sync: true,
        scaleFromCenter: true,
        scaleContent: true,
        restoreAfterFinish: true
    }), new Effect.Opacity(b, {
        sync: true,
        to: 0
    })], Object.extend({
        duration: 1,
        beforeSetupInternal: function (c) {
            Position.absolutize(c.effects[0].element)
        },
        afterFinishInternal: function (c) {
            c.effects[0].element.hide().setStyle(a)
        }
    }, arguments[1] || {}))
};
Effect.BlindUp = function (a) {
    a = $(a);
    a.makeClipping();
    return new Effect.Scale(a, 0, Object.extend({
        scaleContent: false,
        scaleX: false,
        restoreAfterFinish: true,
        afterFinishInternal: function (b) {
            b.element.hide().undoClipping()
        }
    }, arguments[1] || {}))
};
Effect.BlindDown = function (b) {
    b = $(b);
    var a = b.getDimensions();
    return new Effect.Scale(b, 100, Object.extend({
        scaleContent: false,
        scaleX: false,
        scaleFrom: 0,
        scaleMode: {
            originalHeight: a.height,
            originalWidth: a.width
        },
        restoreAfterFinish: true,
        afterSetup: function (c) {
            c.element.makeClipping().setStyle({
                height: "0px"
            }).show()
        },
        afterFinishInternal: function (c) {
            c.element.undoClipping()
        }
    }, arguments[1] || {}))
};
Effect.SwitchOff = function (b) {
    b = $(b);
    var a = b.getInlineOpacity();
    return new Effect.Appear(b, Object.extend({
        duration: 0.4,
        from: 0,
        transition: Effect.Transitions.flicker,
        afterFinishInternal: function (c) {
            new Effect.Scale(c.element, 1, {
                duration: 0.3,
                scaleFromCenter: true,
                scaleX: false,
                scaleContent: false,
                restoreAfterFinish: true,
                beforeSetup: function (d) {
                    d.element.makePositioned().makeClipping()
                },
                afterFinishInternal: function (d) {
                    d.element.hide().undoClipping().undoPositioned().setStyle({
                        opacity: a
                    })
                }
            })
        }
    }, arguments[1] || {}))
};
Effect.DropOut = function (b) {
    b = $(b);
    var a = {
        top: b.getStyle("top"),
        left: b.getStyle("left"),
        opacity: b.getInlineOpacity()
    };
    return new Effect.Parallel([new Effect.Move(b, {
        x: 0,
        y: 100,
        sync: true
    }), new Effect.Opacity(b, {
        sync: true,
        to: 0
    })], Object.extend({
        duration: 0.5,
        beforeSetup: function (c) {
            c.effects[0].element.makePositioned()
        },
        afterFinishInternal: function (c) {
            c.effects[0].element.hide().undoPositioned().setStyle(a)
        }
    }, arguments[1] || {}))
};
Effect.Shake = function (d) {
    d = $(d);
    var b = Object.extend({
        distance: 20,
        duration: 0.5
    }, arguments[1] || {});
    var e = parseFloat(b.distance);
    var c = parseFloat(b.duration) / 10;
    var a = {
        top: d.getStyle("top"),
        left: d.getStyle("left")
    };
    return new Effect.Move(d, {
        x: e,
        y: 0,
        duration: c,
        afterFinishInternal: function (f) {
            new Effect.Move(f.element, {
                x: -e * 2,
                y: 0,
                duration: c * 2,
                afterFinishInternal: function (g) {
                    new Effect.Move(g.element, {
                        x: e * 2,
                        y: 0,
                        duration: c * 2,
                        afterFinishInternal: function (h) {
                            new Effect.Move(h.element, {
                                x: -e * 2,
                                y: 0,
                                duration: c * 2,
                                afterFinishInternal: function (j) {
                                    new Effect.Move(j.element, {
                                        x: e * 2,
                                        y: 0,
                                        duration: c * 2,
                                        afterFinishInternal: function (k) {
                                            new Effect.Move(k.element, {
                                                x: -e,
                                                y: 0,
                                                duration: c,
                                                afterFinishInternal: function (l) {
                                                    l.element.undoPositioned().setStyle(a)
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    })
};
Effect.SlideDown = function (c) {
    c = $(c).cleanWhitespace();
    var a = c.down().getStyle("bottom");
    var b = c.getDimensions();
    return new Effect.Scale(c, 100, Object.extend({
        scaleContent: false,
        scaleX: false,
        scaleFrom: window.opera ? 0 : 1,
        scaleMode: {
            originalHeight: b.height,
            originalWidth: b.width
        },
        restoreAfterFinish: true,
        afterSetup: function (d) {
            d.element.makePositioned();
            d.element.down().makePositioned();
            if (window.opera) {
                d.element.setStyle({
                    top: ""
                })
            }
            d.element.makeClipping().setStyle({
                height: "0px"
            }).show()
        },
        afterUpdateInternal: function (d) {
            d.element.down().setStyle({
                bottom: (d.dims[0] - d.element.clientHeight) + "px"
            })
        },
        afterFinishInternal: function (d) {
            d.element.undoClipping().undoPositioned();
            d.element.down().undoPositioned().setStyle({
                bottom: a
            })
        }
    }, arguments[1] || {}))
};
Effect.SlideUp = function (c) {
    c = $(c).cleanWhitespace();
    var a = c.down().getStyle("bottom");
    var b = c.getDimensions();
    return new Effect.Scale(c, window.opera ? 0 : 1, Object.extend({
        scaleContent: false,
        scaleX: false,
        scaleMode: "box",
        scaleFrom: 100,
        scaleMode: {
            originalHeight: b.height,
            originalWidth: b.width
        },
        restoreAfterFinish: true,
        afterSetup: function (d) {
            d.element.makePositioned();
            d.element.down().makePositioned();
            if (window.opera) {
                d.element.setStyle({
                    top: ""
                })
            }
            d.element.makeClipping().show()
        },
        afterUpdateInternal: function (d) {
            d.element.down().setStyle({
                bottom: (d.dims[0] - d.element.clientHeight) + "px"
            })
        },
        afterFinishInternal: function (d) {
            d.element.hide().undoClipping().undoPositioned();
            d.element.down().undoPositioned().setStyle({
                bottom: a
            })
        }
    }, arguments[1] || {}))
};
Effect.Squish = function (a) {
    return new Effect.Scale(a, window.opera ? 1 : 0, {
        restoreAfterFinish: true,
        beforeSetup: function (b) {
            b.element.makeClipping()
        },
        afterFinishInternal: function (b) {
            b.element.hide().undoClipping()
        }
    })
};
Effect.Grow = function (c) {
    c = $(c);
    var b = Object.extend({
        direction: "center",
        moveTransition: Effect.Transitions.sinoidal,
        scaleTransition: Effect.Transitions.sinoidal,
        opacityTransition: Effect.Transitions.full
    }, arguments[1] || {});
    var a = {
        top: c.style.top,
        left: c.style.left,
        height: c.style.height,
        width: c.style.width,
        opacity: c.getInlineOpacity()
    };
    var g = c.getDimensions();
    var h, f;
    var e, d;
    switch (b.direction) {
    case "top-left":
        h = f = e = d = 0;
        break;
    case "top-right":
        h = g.width;
        f = d = 0;
        e = -g.width;
        break;
    case "bottom-left":
        h = e = 0;
        f = g.height;
        d = -g.height;
        break;
    case "bottom-right":
        h = g.width;
        f = g.height;
        e = -g.width;
        d = -g.height;
        break;
    case "center":
        h = g.width / 2;
        f = g.height / 2;
        e = -g.width / 2;
        d = -g.height / 2;
        break
    }
    return new Effect.Move(c, {
        x: h,
        y: f,
        duration: 0.01,
        beforeSetup: function (j) {
            j.element.hide().makeClipping().makePositioned()
        },
        afterFinishInternal: function (j) {
            new Effect.Parallel([new Effect.Opacity(j.element, {
                sync: true,
                to: 1,
                from: 0,
                transition: b.opacityTransition
            }), new Effect.Move(j.element, {
                x: e,
                y: d,
                sync: true,
                transition: b.moveTransition
            }), new Effect.Scale(j.element, 100, {
                scaleMode: {
                    originalHeight: g.height,
                    originalWidth: g.width
                },
                sync: true,
                scaleFrom: window.opera ? 1 : 0,
                transition: b.scaleTransition,
                restoreAfterFinish: true
            })], Object.extend({
                beforeSetup: function (k) {
                    k.effects[0].element.setStyle({
                        height: "0px"
                    }).show()
                },
                afterFinishInternal: function (k) {
                    k.effects[0].element.undoClipping().undoPositioned().setStyle(a)
                }
            }, b))
        }
    })
};
Effect.Shrink = function (c) {
    c = $(c);
    var b = Object.extend({
        direction: "center",
        moveTransition: Effect.Transitions.sinoidal,
        scaleTransition: Effect.Transitions.sinoidal,
        opacityTransition: Effect.Transitions.none
    }, arguments[1] || {});
    var a = {
        top: c.style.top,
        left: c.style.left,
        height: c.style.height,
        width: c.style.width,
        opacity: c.getInlineOpacity()
    };
    var f = c.getDimensions();
    var e, d;
    switch (b.direction) {
    case "top-left":
        e = d = 0;
        break;
    case "top-right":
        e = f.width;
        d = 0;
        break;
    case "bottom-left":
        e = 0;
        d = f.height;
        break;
    case "bottom-right":
        e = f.width;
        d = f.height;
        break;
    case "center":
        e = f.width / 2;
        d = f.height / 2;
        break
    }
    return new Effect.Parallel([new Effect.Opacity(c, {
        sync: true,
        to: 0,
        from: 1,
        transition: b.opacityTransition
    }), new Effect.Scale(c, window.opera ? 1 : 0, {
        sync: true,
        transition: b.scaleTransition,
        restoreAfterFinish: true
    }), new Effect.Move(c, {
        x: e,
        y: d,
        sync: true,
        transition: b.moveTransition
    })], Object.extend({
        beforeStartInternal: function (g) {
            g.effects[0].element.makePositioned().makeClipping()
        },
        afterFinishInternal: function (g) {
            g.effects[0].element.hide().undoClipping().undoPositioned().setStyle(a)
        }
    }, b))
};
Effect.Pulsate = function (c) {
    c = $(c);
    var b = arguments[1] || {},
        a = c.getInlineOpacity(),
        e = b.transition || Effect.Transitions.linear,
        d = function (f) {
            return 1 - e((-Math.cos((f * (b.pulses || 5) * 2) * Math.PI) / 2) + 0.5)
        };
    return new Effect.Opacity(c, Object.extend(Object.extend({
        duration: 2,
        from: 0,
        afterFinishInternal: function (f) {
            f.element.setStyle({
                opacity: a
            })
        }
    }, b), {
        transition: d
    }))
};
Effect.Fold = function (b) {
    b = $(b);
    var a = {
        top: b.style.top,
        left: b.style.left,
        width: b.style.width,
        height: b.style.height
    };
    b.makeClipping();
    return new Effect.Scale(b, 5, Object.extend({
        scaleContent: false,
        scaleX: false,
        afterFinishInternal: function (c) {
            new Effect.Scale(b, 1, {
                scaleContent: false,
                scaleY: false,
                afterFinishInternal: function (d) {
                    d.element.hide().undoClipping().setStyle(a)
                }
            })
        }
    }, arguments[1] || {}))
};
Effect.Morph = Class.create(Effect.Base, {
    initialize: function (c) {
        this.element = $(c);
        if (!this.element) {
            throw (Effect._elementDoesNotExistError)
        }
        var a = Object.extend({
            style: {}
        }, arguments[1] || {});
        if (!Object.isString(a.style)) {
            this.style = $H(a.style)
        } else {
            if (a.style.include(":")) {
                this.style = a.style.parseStyle()
            } else {
                this.element.addClassName(a.style);
                this.style = $H(this.element.getStyles());
                this.element.removeClassName(a.style);
                var b = this.element.getStyles();
                this.style = this.style.reject(function (d) {
                    return d.value == b[d.key]
                });
                a.afterFinishInternal = function (d) {
                    d.element.addClassName(d.options.style);
                    d.transforms.each(function (e) {
                        d.element.style[e.style] = ""
                    })
                }
            }
        }
        this.start(a)
    },
    setup: function () {
        function a(b) {
            if (!b || ["rgba(0, 0, 0, 0)", "transparent"].include(b)) {
                b = "#ffffff"
            }
            b = b.parseColor();
            return $R(0, 2).map(function (c) {
                return parseInt(b.slice(c * 2 + 1, c * 2 + 3), 16)
            })
        }
        this.transforms = this.style.map(function (g) {
            var f = g[0],
                e = g[1],
                d = null;
            if (e.parseColor("#zzzzzz") != "#zzzzzz") {
                e = e.parseColor();
                d = "color"
            } else {
                if (f == "opacity") {
                    e = parseFloat(e);
                    if (Prototype.Browser.IE && (!this.element.currentStyle.hasLayout)) {
                        this.element.setStyle({
                            zoom: 1
                        })
                    }
                } else {
                    if (Element.CSS_LENGTH.test(e)) {
                        var c = e.match(/^([\+\-]?[0-9\.]+)(.*)$/);
                        e = parseFloat(c[1]);
                        d = (c.length == 3) ? c[2] : null
                    }
                }
            }
            var b = this.element.getStyle(f);
            return {
                style: f.camelize(),
                originalValue: d == "color" ? a(b) : parseFloat(b || 0),
                targetValue: d == "color" ? a(e) : e,
                unit: d
            }
        }.bind(this)).reject(function (b) {
            return ((b.originalValue == b.targetValue) || (b.unit != "color" && (isNaN(b.originalValue) || isNaN(b.targetValue))))
        })
    },
    update: function (a) {
        var d = {},
            b, c = this.transforms.length;
        while (c--) {
            d[(b = this.transforms[c]).style] = b.unit == "color" ? "#" + (Math.round(b.originalValue[0] + (b.targetValue[0] - b.originalValue[0]) * a)).toColorPart() + (Math.round(b.originalValue[1] + (b.targetValue[1] - b.originalValue[1]) * a)).toColorPart() + (Math.round(b.originalValue[2] + (b.targetValue[2] - b.originalValue[2]) * a)).toColorPart() : (b.originalValue + (b.targetValue - b.originalValue) * a).toFixed(3) + (b.unit === null ? "" : b.unit)
        }
        this.element.setStyle(d, true)
    }
});
Effect.Transform = Class.create({
    initialize: function (a) {
        this.tracks = [];
        this.options = arguments[1] || {};
        this.addTracks(a)
    },
    addTracks: function (a) {
        a.each(function (b) {
            b = $H(b);
            var c = b.values().first();
            this.tracks.push($H({
                ids: b.keys().first(),
                effect: Effect.Morph,
                options: {
                    style: c
                }
            }))
        }.bind(this));
        return this
    },
    play: function () {
        return new Effect.Parallel(this.tracks.map(function (a) {
            var d = a.get("ids"),
                c = a.get("effect"),
                b = a.get("options");
            var e = [$(d) || $$(d)].flatten();
            return e.map(function (f) {
                return new c(f, Object.extend({
                    sync: true
                }, b))
            })
        }).flatten(), this.options)
    }
});
Element.CSS_PROPERTIES = $w("backgroundColor backgroundPosition borderBottomColor borderBottomStyle borderBottomWidth borderLeftColor borderLeftStyle borderLeftWidth borderRightColor borderRightStyle borderRightWidth borderSpacing borderTopColor borderTopStyle borderTopWidth bottom clip color fontSize fontWeight height left letterSpacing lineHeight marginBottom marginLeft marginRight marginTop markerOffset maxHeight maxWidth minHeight minWidth opacity outlineColor outlineOffset outlineWidth paddingBottom paddingLeft paddingRight paddingTop right textIndent top width wordSpacing zIndex");
Element.CSS_LENGTH = /^(([\+\-]?[0-9\.]+)(em|ex|px|in|cm|mm|pt|pc|\%))|0$/;
String.__parseStyleElement = document.createElement("div");
String.prototype.parseStyle = function () {
    var b, a = $H();
    if (Prototype.Browser.WebKit) {
        b = new Element("div", {
            style: this
        }).style
    } else {
        String.__parseStyleElement.innerHTML = '<div style="' + this + '"></div>';
        b = String.__parseStyleElement.childNodes[0].style
    }
    Element.CSS_PROPERTIES.each(function (c) {
        if (b[c]) {
            a.set(c, b[c])
        }
    });
    if (Prototype.Browser.IE && this.include("opacity")) {
        a.set("opacity", this.match(/opacity:\s*((?:0|1)?(?:\.\d*)?)/)[1])
    }
    return a
};
if (document.defaultView && document.defaultView.getComputedStyle) {
    Element.getStyles = function (b) {
        var a = document.defaultView.getComputedStyle($(b), null);
        return Element.CSS_PROPERTIES.inject({}, function (c, d) {
            c[d] = a[d];
            return c
        })
    }
} else {
    Element.getStyles = function (b) {
        b = $(b);
        var a = b.currentStyle,
            c;
        c = Element.CSS_PROPERTIES.inject({}, function (d, e) {
            d[e] = a[e];
            return d
        });
        if (!c.opacity) {
            c.opacity = b.getOpacity()
        }
        return c
    }
}
Effect.Methods = {
    morph: function (a, b) {
        a = $(a);
        new Effect.Morph(a, Object.extend({
            style: b
        }, arguments[2] || {}));
        return a
    },
    visualEffect: function (c, e, b) {
        c = $(c);
        var d = e.dasherize().camelize(),
            a = d.charAt(0).toUpperCase() + d.substring(1);
        new Effect[a](c, b);
        return c
    },
    highlight: function (b, a) {
        b = $(b);
        new Effect.Highlight(b, a);
        return b
    }
};
$w("fade appear grow shrink fold blindUp blindDown slideUp slideDown pulsate shake puff squish switchOff dropOut").each(function (a) {
    Effect.Methods[a] = function (c, b) {
        c = $(c);
        Effect[a.charAt(0).toUpperCase() + a.substring(1)](c, b);
        return c
    }
});
$w("getInlineOpacity forceRerendering setContentZoom collectTextNodes collectTextNodesIgnoreClass getStyles").each(function (a) {
    Effect.Methods[a] = Element[a]
});
Element.addMethods(Effect.Methods);
if (typeof Effect == "undefined") {
    throw ("controls.js requires including script.aculo.us' effects.js library")
}
var Autocompleter = {};
Autocompleter.Base = Class.create({
    baseInitialize: function (b, c, a) {
        b = $(b);
        this.element = b;
        this.update = $(c);
        this.hasFocus = false;
        this.changed = false;
        this.active = false;
        this.index = 0;
        this.entryCount = 0;
        this.oldElementValue = this.element.value;
        if (this.setOptions) {
            this.setOptions(a)
        } else {
            this.options = a || {}
        }
        this.options.paramName = this.options.paramName || this.element.name;
        this.options.tokens = this.options.tokens || [];
        this.options.frequency = this.options.frequency || 0.4;
        this.options.minChars = this.options.minChars || 1;
        this.options.onShow = this.options.onShow ||
        function (d, e) {
            if (!e.style.position || e.style.position == "absolute") {
                e.style.position = "absolute";
                Position.clone(d, e, {
                    setHeight: false,
                    offsetTop: d.offsetHeight
                })
            }
            Effect.Appear(e, {
                duration: 0.15
            })
        };
        this.options.onHide = this.options.onHide ||
        function (d, e) {
            new Effect.Fade(e, {
                duration: 0.15
            })
        };
        if (typeof (this.options.tokens) == "string") {
            this.options.tokens = new Array(this.options.tokens)
        }
        if (!this.options.tokens.include("\n")) {
            this.options.tokens.push("\n")
        }
        this.observer = null;
        this.element.setAttribute("autocomplete", "off");
        Element.hide(this.update);
        Event.observe(this.element, "blur", this.onBlur.bindAsEventListener(this));
        Event.observe(this.element, "keydown", this.onKeyPress.bindAsEventListener(this))
    },
    show: function () {
        if (Element.getStyle(this.update, "display") == "none") {
            this.options.onShow(this.element, this.update)
        }
        if (!this.iefix && (Prototype.Browser.IE) && (Element.getStyle(this.update, "position") == "absolute")) {
            new Insertion.After(this.update, '<iframe id="' + this.update.id + '_iefix" style="display:none;position:absolute;filter:progid:DXImageTransform.Microsoft.Alpha(opacity=0);" src="javascript:false;" frameborder="0" scrolling="no"></iframe>');
            this.iefix = $(this.update.id + "_iefix")
        }
        if (this.iefix) {
            setTimeout(this.fixIEOverlapping.bind(this), 50)
        }
    },
    fixIEOverlapping: function () {
        Position.clone(this.update, this.iefix, {
            setTop: (!this.update.style.height)
        });
        this.iefix.style.zIndex = 1;
        this.update.style.zIndex = 2;
        Element.show(this.iefix)
    },
    hide: function () {
        this.stopIndicator();
        if (Element.getStyle(this.update, "display") != "none") {
            this.options.onHide(this.element, this.update)
        }
        if (this.iefix) {
            Element.hide(this.iefix)
        }
    },
    startIndicator: function () {
        if (this.options.indicator) {
            Element.show(this.options.indicator)
        }
    },
    stopIndicator: function () {
        if (this.options.indicator) {
            Element.hide(this.options.indicator)
        }
    },
    onKeyPress: function (a) {
        if (this.active) {
            switch (a.keyCode) {
            case Event.KEY_TAB:
            case Event.KEY_RETURN:
                this.selectEntry();
                Event.stop(a);
            case Event.KEY_ESC:
                this.hide();
                this.active = false;
                Event.stop(a);
                return;
            case Event.KEY_LEFT:
            case Event.KEY_RIGHT:
                return;
            case Event.KEY_UP:
                this.markPrevious();
                this.render();
                Event.stop(a);
                return;
            case Event.KEY_DOWN:
                this.markNext();
                this.render();
                Event.stop(a);
                return
            }
        } else {
            if (a.keyCode == Event.KEY_TAB || a.keyCode == Event.KEY_RETURN || (Prototype.Browser.WebKit > 0 && a.keyCode == 0)) {
                return
            }
        }
        this.changed = true;
        this.hasFocus = true;
        if (this.observer) {
            clearTimeout(this.observer)
        }
        this.observer = setTimeout(this.onObserverEvent.bind(this), this.options.frequency * 1000)
    },
    activate: function () {
        this.changed = false;
        this.hasFocus = true;
        this.getUpdatedChoices()
    },
    onHover: function (b) {
        var a = Event.findElement(b, "LI");
        if (this.index != a.autocompleteIndex) {
            this.index = a.autocompleteIndex;
            this.render()
        }
        Event.stop(b)
    },
    onClick: function (b) {
        var a = Event.findElement(b, "LI");
        this.index = a.autocompleteIndex;
        this.selectEntry();
        this.hide()
    },
    onBlur: function (a) {
        setTimeout(this.hide.bind(this), 250);
        this.hasFocus = false;
        this.active = false
    },
    render: function () {
        if (this.entryCount > 0) {
            for (var a = 0; a < this.entryCount; a++) {
                this.index == a ? Element.addClassName(this.getEntry(a), "selected") : Element.removeClassName(this.getEntry(a), "selected")
            }
            if (this.hasFocus) {
                this.show();
                this.active = true
            }
        } else {
            this.active = false;
            this.hide()
        }
    },
    markPrevious: function () {
        if (this.index > 0) {
            this.index--
        } else {
            this.index = this.entryCount - 1
        }
        this.getEntry(this.index).scrollIntoView(true)
    },
    markNext: function () {
        if (this.index < this.entryCount - 1) {
            this.index++
        } else {
            this.index = 0
        }
        this.getEntry(this.index).scrollIntoView(false)
    },
    getEntry: function (a) {
        return this.update.firstChild.childNodes[a]
    },
    getCurrentEntry: function () {
        return this.getEntry(this.index)
    },
    selectEntry: function () {
        this.active = false;
        this.updateElement(this.getCurrentEntry())
    },
    updateElement: function (f) {
        if (this.options.updateElement) {
            this.options.updateElement(f);
            return
        }
        var d = "";
        if (this.options.select) {
            var a = $(f).select("." + this.options.select) || [];
            if (a.length > 0) {
                d = Element.collectTextNodes(a[0], this.options.select)
            }
        } else {
            d = Element.collectTextNodesIgnoreClass(f, "informal")
        }
        var c = this.getTokenBounds();
        if (c[0] != -1) {
            var e = this.element.value.substr(0, c[0]);
            var b = this.element.value.substr(c[0]).match(/^\s+/);
            if (b) {
                e += b[0]
            }
            this.element.value = e + d + this.element.value.substr(c[1])
        } else {
            this.element.value = d
        }
        this.oldElementValue = this.element.value;
        this.element.focus();
        if (this.options.afterUpdateElement) {
            this.options.afterUpdateElement(this.element, f)
        }
    },
    updateChoices: function (c) {
        if (!this.changed && this.hasFocus) {
            this.update.innerHTML = c;
            Element.cleanWhitespace(this.update);
            Element.cleanWhitespace(this.update.down());
            if (this.update.firstChild && this.update.down().childNodes) {
                this.entryCount = this.update.down().childNodes.length;
                for (var a = 0; a < this.entryCount; a++) {
                    var b = this.getEntry(a);
                    b.autocompleteIndex = a;
                    this.addObservers(b)
                }
            } else {
                this.entryCount = 0
            }
            this.stopIndicator();
            this.index = 0;
            if (this.entryCount == 1 && this.options.autoSelect) {
                this.selectEntry();
                this.hide()
            } else {
                this.render()
            }
        }
    },
    addObservers: function (a) {
        Event.observe(a, "mouseover", this.onHover.bindAsEventListener(this));
        Event.observe(a, "click", this.onClick.bindAsEventListener(this))
    },
    onObserverEvent: function () {
        this.changed = false;
        this.tokenBounds = null;
        if (this.getToken().length >= this.options.minChars) {
            this.getUpdatedChoices()
        } else {
            this.active = false;
            this.hide()
        }
        this.oldElementValue = this.element.value
    },
    getToken: function () {
        var a = this.getTokenBounds();
        return this.element.value.substring(a[0], a[1]).strip()
    },
    getTokenBounds: function () {
        if (null != this.tokenBounds) {
            return this.tokenBounds
        }
        var e = this.element.value;
        if (e.strip().empty()) {
            return [-1, 0]
        }
        var f = arguments.callee.getFirstDifferencePos(e, this.oldElementValue);
        var h = (f == this.oldElementValue.length ? 1 : 0);
        var d = -1,
            c = e.length;
        var g;
        for (var b = 0, a = this.options.tokens.length; b < a; ++b) {
            g = e.lastIndexOf(this.options.tokens[b], f + h - 1);
            if (g > d) {
                d = g
            }
            g = e.indexOf(this.options.tokens[b], f + h);
            if (-1 != g && g < c) {
                c = g
            }
        }
        return (this.tokenBounds = [d + 1, c])
    }
});
Autocompleter.Base.prototype.getTokenBounds.getFirstDifferencePos = function (c, a) {
    var d = Math.min(c.length, a.length);
    for (var b = 0; b < d; ++b) {
        if (c[b] != a[b]) {
            return b
        }
    }
    return d
};
Ajax.Autocompleter = Class.create(Autocompleter.Base, {
    initialize: function (c, d, b, a) {
        this.baseInitialize(c, d, a);
        this.options.asynchronous = true;
        this.options.onComplete = this.onComplete.bind(this);
        this.options.defaultParams = this.options.parameters || null;
        this.url = b
    },
    getUpdatedChoices: function () {
        this.startIndicator();
        var a = encodeURIComponent(this.options.paramName) + "=" + encodeURIComponent(this.getToken());
        this.options.parameters = this.options.callback ? this.options.callback(this.element, a) : a;
        if (this.options.defaultParams) {
            this.options.parameters += "&" + this.options.defaultParams
        }
        new Ajax.Request(this.url, this.options)
    },
    onComplete: function (a) {
        this.updateChoices(a.responseText)
    }
});
Autocompleter.Local = Class.create(Autocompleter.Base, {
    initialize: function (b, d, c, a) {
        this.baseInitialize(b, d, a);
        this.options.array = c
    },
    getUpdatedChoices: function () {
        this.updateChoices(this.options.selector(this))
    },
    setOptions: function (a) {
        this.options = Object.extend({
            choices: 10,
            partialSearch: true,
            partialChars: 2,
            ignoreCase: true,
            fullSearch: false,
            selector: function (b) {
                var d = [];
                var c = [];
                var h = b.getToken();
                var g = 0;
                for (var e = 0; e < b.options.array.length && d.length < b.options.choices; e++) {
                    var f = b.options.array[e];
                    var j = b.options.ignoreCase ? f.toLowerCase().indexOf(h.toLowerCase()) : f.indexOf(h);
                    while (j != -1) {
                        if (j == 0 && f.length != h.length) {
                            d.push("<li><strong>" + f.substr(0, h.length) + "</strong>" + f.substr(h.length) + "</li>");
                            break
                        } else {
                            if (h.length >= b.options.partialChars && b.options.partialSearch && j != -1) {
                                if (b.options.fullSearch || /\s/.test(f.substr(j - 1, 1))) {
                                    c.push("<li>" + f.substr(0, j) + "<strong>" + f.substr(j, h.length) + "</strong>" + f.substr(j + h.length) + "</li>");
                                    break
                                }
                            }
                        }
                        j = b.options.ignoreCase ? f.toLowerCase().indexOf(h.toLowerCase(), j + 1) : f.indexOf(h, j + 1)
                    }
                }
                if (c.length) {
                    d = d.concat(c.slice(0, b.options.choices - d.length))
                }
                return "<ul>" + d.join("") + "</ul>"
            }
        }, a || {})
    }
});
Field.scrollFreeActivate = function (a) {
    setTimeout(function () {
        Field.activate(a)
    }, 1)
};
Ajax.InPlaceEditor = Class.create({
    initialize: function (c, b, a) {
        this.url = b;
        this.element = c = $(c);
        this.prepareOptions();
        this._controls = {};
        arguments.callee.dealWithDeprecatedOptions(a);
        Object.extend(this.options, a || {});
        if (!this.options.formId && this.element.id) {
            this.options.formId = this.element.id + "-inplaceeditor";
            if ($(this.options.formId)) {
                this.options.formId = ""
            }
        }
        if (this.options.externalControl) {
            this.options.externalControl = $(this.options.externalControl)
        }
        if (!this.options.externalControl) {
            this.options.externalControlOnly = false
        }
        this._originalBackground = this.element.getStyle("background-color") || "transparent";
        this.element.title = this.options.clickToEditText;
        this._boundCancelHandler = this.handleFormCancellation.bind(this);
        this._boundComplete = (this.options.onComplete || Prototype.emptyFunction).bind(this);
        this._boundFailureHandler = this.handleAJAXFailure.bind(this);
        this._boundSubmitHandler = this.handleFormSubmission.bind(this);
        this._boundWrapperHandler = this.wrapUp.bind(this);
        this.registerListeners()
    },
    checkForEscapeOrReturn: function (a) {
        if (!this._editing || a.ctrlKey || a.altKey || a.shiftKey) {
            return
        }
        if (Event.KEY_ESC == a.keyCode) {
            this.handleFormCancellation(a)
        } else {
            if (Event.KEY_RETURN == a.keyCode) {
                this.handleFormSubmission(a)
            }
        }
    },
    createControl: function (g, c, b) {
        var e = this.options[g + "Control"];
        var f = this.options[g + "Text"];
        if ("button" == e) {
            var a = document.createElement("input");
            a.type = "submit";
            a.value = f;
            a.className = "editor_" + g + "_button";
            if ("cancel" == g) {
                a.onclick = this._boundCancelHandler
            }
            this._form.appendChild(a);
            this._controls[g] = a
        } else {
            if ("link" == e) {
                var d = document.createElement("a");
                d.href = "#";
                d.appendChild(document.createTextNode(f));
                d.onclick = "cancel" == g ? this._boundCancelHandler : this._boundSubmitHandler;
                d.className = "editor_" + g + "_link";
                if (b) {
                    d.className += " " + b
                }
                this._form.appendChild(d);
                this._controls[g] = d
            }
        }
    },
    createEditField: function () {
        var c = (this.options.loadTextURL ? this.options.loadingText : this.getText());
        var b;
        if (1 >= this.options.rows && !/\r|\n/.test(this.getText())) {
            b = document.createElement("input");
            b.type = "text";
            var a = this.options.size || this.options.cols || 0;
            if (0 < a) {
                b.size = a
            }
        } else {
            b = document.createElement("textarea");
            b.rows = (1 >= this.options.rows ? this.options.autoRows : this.options.rows);
            b.cols = this.options.cols || 40
        }
        b.name = this.options.paramName;
        b.value = c;
        b.className = "editor_field";
        if (this.options.submitOnBlur) {
            b.onblur = this._boundSubmitHandler
        }
        this._controls.editor = b;
        if (this.options.loadTextURL) {
            this.loadExternalText()
        }
        this._form.appendChild(this._controls.editor)
    },
    createForm: function () {
        var b = this;

        function a(d, e) {
            var c = b.options["text" + d + "Controls"];
            if (!c || e === false) {
                return
            }
            b._form.appendChild(document.createTextNode(c))
        }
        this._form = $(document.createElement("form"));
        this._form.id = this.options.formId;
        this._form.addClassName(this.options.formClassName);
        this._form.onsubmit = this._boundSubmitHandler;
        this.createEditField();
        if ("textarea" == this._controls.editor.tagName.toLowerCase()) {
            this._form.appendChild(document.createElement("br"))
        }
        if (this.options.onFormCustomization) {
            this.options.onFormCustomization(this, this._form)
        }
        a("Before", this.options.okControl || this.options.cancelControl);
        this.createControl("ok", this._boundSubmitHandler);
        a("Between", this.options.okControl && this.options.cancelControl);
        this.createControl("cancel", this._boundCancelHandler, "editor_cancel");
        a("After", this.options.okControl || this.options.cancelControl)
    },
    destroy: function () {
        if (this._oldInnerHTML) {
            this.element.innerHTML = this._oldInnerHTML
        }
        this.leaveEditMode();
        this.unregisterListeners()
    },
    enterEditMode: function (a) {
        if (this._saving || this._editing) {
            return
        }
        this._editing = true;
        this.triggerCallback("onEnterEditMode");
        if (this.options.externalControl) {
            this.options.externalControl.hide()
        }
        this.element.hide();
        this.createForm();
        this.element.parentNode.insertBefore(this._form, this.element);
        if (!this.options.loadTextURL) {
            this.postProcessEditField()
        }
        if (a) {
            Event.stop(a)
        }
    },
    enterHover: function (a) {
        if (this.options.hoverClassName) {
            this.element.addClassName(this.options.hoverClassName)
        }
        if (this._saving) {
            return
        }
        this.triggerCallback("onEnterHover")
    },
    getText: function () {
        return this.element.innerHTML.unescapeHTML()
    },
    handleAJAXFailure: function (a) {
        this.triggerCallback("onFailure", a);
        if (this._oldInnerHTML) {
            this.element.innerHTML = this._oldInnerHTML;
            this._oldInnerHTML = null
        }
    },
    handleFormCancellation: function (a) {
        this.wrapUp();
        if (a) {
            Event.stop(a)
        }
    },
    handleFormSubmission: function (d) {
        var b = this._form;
        var c = $F(this._controls.editor);
        this.prepareSubmission();
        var f = this.options.callback(b, c) || "";
        if (Object.isString(f)) {
            f = f.toQueryParams()
        }
        f.editorId = this.element.id;
        if (this.options.htmlResponse) {
            var a = Object.extend({
                evalScripts: true
            }, this.options.ajaxOptions);
            Object.extend(a, {
                parameters: f,
                onComplete: this._boundWrapperHandler,
                onFailure: this._boundFailureHandler
            });
            new Ajax.Updater({
                success: this.element
            }, this.url, a)
        } else {
            var a = Object.extend({
                method: "get"
            }, this.options.ajaxOptions);
            Object.extend(a, {
                parameters: f,
                onComplete: this._boundWrapperHandler,
                onFailure: this._boundFailureHandler
            });
            new Ajax.Request(this.url, a)
        }
        if (d) {
            Event.stop(d)
        }
    },
    leaveEditMode: function () {
        this.element.removeClassName(this.options.savingClassName);
        this.removeForm();
        this.leaveHover();
        this.element.style.backgroundColor = this._originalBackground;
        this.element.show();
        if (this.options.externalControl) {
            this.options.externalControl.show()
        }
        this._saving = false;
        this._editing = false;
        this._oldInnerHTML = null;
        this.triggerCallback("onLeaveEditMode")
    },
    leaveHover: function (a) {
        if (this.options.hoverClassName) {
            this.element.removeClassName(this.options.hoverClassName)
        }
        if (this._saving) {
            return
        }
        this.triggerCallback("onLeaveHover")
    },
    loadExternalText: function () {
        this._form.addClassName(this.options.loadingClassName);
        this._controls.editor.disabled = true;
        var a = Object.extend({
            method: "get"
        }, this.options.ajaxOptions);
        Object.extend(a, {
            parameters: "editorId=" + encodeURIComponent(this.element.id),
            onComplete: Prototype.emptyFunction,
            onSuccess: function (c) {
                this._form.removeClassName(this.options.loadingClassName);
                var b = c.responseText;
                if (this.options.stripLoadedTextTags) {
                    b = b.stripTags()
                }
                this._controls.editor.value = b;
                this._controls.editor.disabled = false;
                this.postProcessEditField()
            }.bind(this),
            onFailure: this._boundFailureHandler
        });
        new Ajax.Request(this.options.loadTextURL, a)
    },
    postProcessEditField: function () {
        var a = this.options.fieldPostCreation;
        if (a) {
            $(this._controls.editor)["focus" == a ? "focus" : "activate"]()
        }
    },
    prepareOptions: function () {
        this.options = Object.clone(Ajax.InPlaceEditor.DefaultOptions);
        Object.extend(this.options, Ajax.InPlaceEditor.DefaultCallbacks);
        [this._extraDefaultOptions].flatten().compact().each(function (a) {
            Object.extend(this.options, a)
        }.bind(this))
    },
    prepareSubmission: function () {
        this._saving = true;
        this.removeForm();
        this.leaveHover();
        this.showSaving()
    },
    registerListeners: function () {
        this._listeners = {};
        var a;
        $H(Ajax.InPlaceEditor.Listeners).each(function (b) {
            a = this[b.value].bind(this);
            this._listeners[b.key] = a;
            if (!this.options.externalControlOnly) {
                this.element.observe(b.key, a)
            }
            if (this.options.externalControl) {
                this.options.externalControl.observe(b.key, a)
            }
        }.bind(this))
    },
    removeForm: function () {
        if (!this._form) {
            return
        }
        this._form.remove();
        this._form = null;
        this._controls = {}
    },
    showSaving: function () {
        this._oldInnerHTML = this.element.innerHTML;
        this.element.innerHTML = this.options.savingText;
        this.element.addClassName(this.options.savingClassName);
        this.element.style.backgroundColor = this._originalBackground;
        this.element.show()
    },
    triggerCallback: function (b, a) {
        if ("function" == typeof this.options[b]) {
            this.options[b](this, a)
        }
    },
    unregisterListeners: function () {
        $H(this._listeners).each(function (a) {
            if (!this.options.externalControlOnly) {
                this.element.stopObserving(a.key, a.value)
            }
            if (this.options.externalControl) {
                this.options.externalControl.stopObserving(a.key, a.value)
            }
        }.bind(this))
    },
    wrapUp: function (a) {
        this.leaveEditMode();
        this._boundComplete(a, this.element)
    }
});
Object.extend(Ajax.InPlaceEditor.prototype, {
    dispose: Ajax.InPlaceEditor.prototype.destroy
});
Ajax.InPlaceCollectionEditor = Class.create(Ajax.InPlaceEditor, {
    initialize: function ($super, c, b, a) {
        this._extraDefaultOptions = Ajax.InPlaceCollectionEditor.DefaultOptions;
        $super(c, b, a)
    },
    createEditField: function () {
        var a = document.createElement("select");
        a.name = this.options.paramName;
        a.size = 1;
        this._controls.editor = a;
        this._collection = this.options.collection || [];
        if (this.options.loadCollectionURL) {
            this.loadCollection()
        } else {
            this.checkForExternalText()
        }
        this._form.appendChild(this._controls.editor)
    },
    loadCollection: function () {
        this._form.addClassName(this.options.loadingClassName);
        this.showLoadingText(this.options.loadingCollectionText);
        var options = Object.extend({
            method: "get"
        }, this.options.ajaxOptions);
        Object.extend(options, {
            parameters: "editorId=" + encodeURIComponent(this.element.id),
            onComplete: Prototype.emptyFunction,
            onSuccess: function (transport) {
                var js = transport.responseText.strip();
                if (!/^\[.*\]$/.test(js)) {
                    throw ("Server returned an invalid collection representation.")
                }
                this._collection = eval(js);
                this.checkForExternalText()
            }.bind(this),
            onFailure: this.onFailure
        });
        new Ajax.Request(this.options.loadCollectionURL, options)
    },
    showLoadingText: function (b) {
        this._controls.editor.disabled = true;
        var a = this._controls.editor.firstChild;
        if (!a) {
            a = document.createElement("option");
            a.value = "";
            this._controls.editor.appendChild(a);
            a.selected = true
        }
        a.update((b || "").stripScripts().stripTags())
    },
    checkForExternalText: function () {
        this._text = this.getText();
        if (this.options.loadTextURL) {
            this.loadExternalText()
        } else {
            this.buildOptionList()
        }
    },
    loadExternalText: function () {
        this.showLoadingText(this.options.loadingText);
        var a = Object.extend({
            method: "get"
        }, this.options.ajaxOptions);
        Object.extend(a, {
            parameters: "editorId=" + encodeURIComponent(this.element.id),
            onComplete: Prototype.emptyFunction,
            onSuccess: function (b) {
                this._text = b.responseText.strip();
                this.buildOptionList()
            }.bind(this),
            onFailure: this.onFailure
        });
        new Ajax.Request(this.options.loadTextURL, a)
    },
    buildOptionList: function () {
        this._form.removeClassName(this.options.loadingClassName);
        this._collection = this._collection.map(function (d) {
            return 2 === d.length ? d : [d, d].flatten()
        });
        var b = ("value" in this.options) ? this.options.value : this._text;
        var a = this._collection.any(function (d) {
            return d[0] == b
        }.bind(this));
        this._controls.editor.update("");
        var c;
        this._collection.each(function (e, d) {
            c = document.createElement("option");
            c.value = e[0];
            c.selected = a ? e[0] == b : 0 == d;
            c.appendChild(document.createTextNode(e[1]));
            this._controls.editor.appendChild(c)
        }.bind(this));
        this._controls.editor.disabled = false;
        Field.scrollFreeActivate(this._controls.editor)
    }
});
Ajax.InPlaceEditor.prototype.initialize.dealWithDeprecatedOptions = function (a) {
    if (!a) {
        return
    }
    function b(c, d) {
        if (c in a || d === undefined) {
            return
        }
        a[c] = d
    }
    b("cancelControl", (a.cancelLink ? "link" : (a.cancelButton ? "button" : a.cancelLink == a.cancelButton == false ? false : undefined)));
    b("okControl", (a.okLink ? "link" : (a.okButton ? "button" : a.okLink == a.okButton == false ? false : undefined)));
    b("highlightColor", a.highlightcolor);
    b("highlightEndColor", a.highlightendcolor)
};
Object.extend(Ajax.InPlaceEditor, {
    DefaultOptions: {
        ajaxOptions: {},
        autoRows: 3,
        cancelControl: "link",
        cancelText: "cancel",
        clickToEditText: "Click to edit",
        externalControl: null,
        externalControlOnly: false,
        fieldPostCreation: "activate",
        formClassName: "inplaceeditor-form",
        formId: null,
        highlightColor: "#ffff99",
        highlightEndColor: "#ffffff",
        hoverClassName: "",
        htmlResponse: true,
        loadingClassName: "inplaceeditor-loading",
        loadingText: "Loading...",
        okControl: "button",
        okText: "ok",
        paramName: "value",
        rows: 1,
        savingClassName: "inplaceeditor-saving",
        savingText: "Saving...",
        size: 0,
        stripLoadedTextTags: false,
        submitOnBlur: false,
        textAfterControls: "",
        textBeforeControls: "",
        textBetweenControls: ""
    },
    DefaultCallbacks: {
        callback: function (a) {
            return Form.serialize(a)
        },
        onComplete: function (b, a) {
            new Effect.Highlight(a, {
                startcolor: this.options.highlightColor,
                keepBackgroundImage: true
            })
        },
        onEnterEditMode: null,
        onEnterHover: function (a) {
            a.element.style.backgroundColor = a.options.highlightColor;
            if (a._effect) {
                a._effect.cancel()
            }
        },
        onFailure: function (b, a) {
            alert("Error communication with the server: " + b.responseText.stripTags())
        },
        onFormCustomization: null,
        onLeaveEditMode: null,
        onLeaveHover: function (a) {
            a._effect = new Effect.Highlight(a.element, {
                startcolor: a.options.highlightColor,
                endcolor: a.options.highlightEndColor,
                restorecolor: a._originalBackground,
                keepBackgroundImage: true
            })
        }
    },
    Listeners: {
        click: "enterEditMode",
        keydown: "checkForEscapeOrReturn",
        mouseover: "enterHover",
        mouseout: "leaveHover"
    }
});
Ajax.InPlaceCollectionEditor.DefaultOptions = {
    loadingCollectionText: "Loading options..."
};
Form.Element.DelayedObserver = Class.create({
    initialize: function (b, a, c) {
        this.delay = a || 0.5;
        this.element = $(b);
        this.callback = c;
        this.timer = null;
        this.lastValue = $F(this.element);
        Event.observe(this.element, "keyup", this.delayedListener.bindAsEventListener(this))
    },
    delayedListener: function (a) {
        if (this.lastValue == $F(this.element)) {
            return
        }
        if (this.timer) {
            clearTimeout(this.timer)
        }
        this.timer = setTimeout(this.onTimerEvent.bind(this), this.delay * 1000);
        this.lastValue = $F(this.element)
    },
    onTimerEvent: function () {
        this.timer = null;
        this.callback(this.element, $F(this.element))
    }
});
if (Object.isUndefined(Effect)) {
    throw ("dragdrop.js requires including script.aculo.us' effects.js library")
}
var Droppables = {
    drops: [],
    remove: function (a) {
        this.drops = this.drops.reject(function (b) {
            return b.element == $(a)
        })
    },
    add: function (b) {
        b = $(b);
        var a = Object.extend({
            greedy: true,
            hoverclass: null,
            tree: false
        }, arguments[1] || {});
        if (a.containment) {
            a._containers = [];
            var c = a.containment;
            if (Object.isArray(c)) {
                c.each(function (d) {
                    a._containers.push($(d))
                })
            } else {
                a._containers.push($(c))
            }
        }
        if (a.accept) {
            a.accept = [a.accept].flatten()
        }
        Element.makePositioned(b);
        a.element = b;
        this.drops.push(a)
    },
    findDeepestChild: function (a) {
        deepest = a[0];
        for (i = 1; i < a.length; ++i) {
            if (Element.isParent(a[i].element, deepest.element)) {
                deepest = a[i]
            }
        }
        return deepest
    },
    isContained: function (b, a) {
        var c;
        if (a.tree) {
            c = b.treeNode
        } else {
            c = b.parentNode
        }
        return a._containers.detect(function (d) {
            return c == d
        })
    },
    isAffected: function (a, c, b) {
        return ((b.element != c) && ((!b._containers) || this.isContained(c, b)) && ((!b.accept) || (Element.classNames(c).detect(function (d) {
            return b.accept.include(d)
        }))) && Position.within(b.element, a[0], a[1]))
    },
    deactivate: function (a) {
        if (a.hoverclass) {
            Element.removeClassName(a.element, a.hoverclass)
        }
        this.last_active = null
    },
    activate: function (a) {
        if (a.hoverclass) {
            Element.addClassName(a.element, a.hoverclass)
        }
        this.last_active = a
    },
    show: function (a, c) {
        if (!this.drops.length) {
            return
        }
        var b, d = [];
        this.drops.each(function (e) {
            if (Droppables.isAffected(a, c, e)) {
                d.push(e)
            }
        });
        if (d.length > 0) {
            b = Droppables.findDeepestChild(d)
        }
        if (this.last_active && this.last_active != b) {
            this.deactivate(this.last_active)
        }
        if (b) {
            Position.within(b.element, a[0], a[1]);
            if (b.onHover) {
                b.onHover(c, b.element, Position.overlap(b.overlap, b.element))
            }
            if (b != this.last_active) {
                Droppables.activate(b)
            }
        }
    },
    fire: function (b, a) {
        if (!this.last_active) {
            return
        }
        Position.prepare();
        if (this.isAffected([Event.pointerX(b), Event.pointerY(b)], a, this.last_active)) {
            if (this.last_active.onDrop) {
                this.last_active.onDrop(a, this.last_active.element, b);
                return true
            }
        }
    },
    reset: function () {
        if (this.last_active) {
            this.deactivate(this.last_active)
        }
    }
};
var Draggables = {
    drags: [],
    observers: [],
    register: function (a) {
        if (this.drags.length == 0) {
            this.eventMouseUp = this.endDrag.bindAsEventListener(this);
            this.eventMouseMove = this.updateDrag.bindAsEventListener(this);
            this.eventKeypress = this.keyPress.bindAsEventListener(this);
            Event.observe(document, "mouseup", this.eventMouseUp);
            Event.observe(document, "mousemove", this.eventMouseMove);
            Event.observe(document, "keypress", this.eventKeypress)
        }
        this.drags.push(a)
    },
    unregister: function (a) {
        this.drags = this.drags.reject(function (b) {
            return b == a
        });
        if (this.drags.length == 0) {
            Event.stopObserving(document, "mouseup", this.eventMouseUp);
            Event.stopObserving(document, "mousemove", this.eventMouseMove);
            Event.stopObserving(document, "keypress", this.eventKeypress)
        }
    },
    activate: function (a) {
        if (a.options.delay) {
            this._timeout = setTimeout(function () {
                Draggables._timeout = null;
                window.focus();
                Draggables.activeDraggable = a
            }.bind(this), a.options.delay)
        } else {
            window.focus();
            this.activeDraggable = a
        }
    },
    deactivate: function () {
        this.activeDraggable = null
    },
    updateDrag: function (a) {
        if (!this.activeDraggable) {
            return
        }
        var b = [Event.pointerX(a), Event.pointerY(a)];
        if (this._lastPointer && (this._lastPointer.inspect() == b.inspect())) {
            return
        }
        this._lastPointer = b;
        this.activeDraggable.updateDrag(a, b)
    },
    endDrag: function (a) {
        if (this._timeout) {
            clearTimeout(this._timeout);
            this._timeout = null
        }
        if (!this.activeDraggable) {
            return
        }
        this._lastPointer = null;
        this.activeDraggable.endDrag(a);
        this.activeDraggable = null
    },
    keyPress: function (a) {
        if (this.activeDraggable) {
            this.activeDraggable.keyPress(a)
        }
    },
    addObserver: function (a) {
        this.observers.push(a);
        this._cacheObserverCallbacks()
    },
    removeObserver: function (a) {
        this.observers = this.observers.reject(function (b) {
            return b.element == a
        });
        this._cacheObserverCallbacks()
    },
    notify: function (b, a, c) {
        if (this[b + "Count"] > 0) {
            this.observers.each(function (d) {
                if (d[b]) {
                    d[b](b, a, c)
                }
            })
        }
        if (a.options[b]) {
            a.options[b](a, c)
        }
    },
    _cacheObserverCallbacks: function () {
        ["onStart", "onEnd", "onDrag"].each(function (a) {
            Draggables[a + "Count"] = Draggables.observers.select(function (b) {
                return b[a]
            }).length
        })
    }
};
var Draggable = Class.create({
    initialize: function (b) {
        var c = {
            handle: false,
            reverteffect: function (f, e, d) {
                var g = Math.sqrt(Math.abs(e ^ 2) + Math.abs(d ^ 2)) * 0.02;
                new Effect.Move(f, {
                    x: -d,
                    y: -e,
                    duration: g,
                    queue: {
                        scope: "_draggable",
                        position: "end"
                    }
                })
            },
            endeffect: function (e) {
                var d = Object.isNumber(e._opacity) ? e._opacity : 1;
                new Effect.Opacity(e, {
                    duration: 0.2,
                    from: 0.7,
                    to: d,
                    queue: {
                        scope: "_draggable",
                        position: "end"
                    },
                    afterFinish: function () {
                        Draggable._dragging[e] = false
                    }
                })
            },
            zindex: 1000,
            revert: false,
            quiet: false,
            scroll: false,
            scrollSensitivity: 20,
            scrollSpeed: 15,
            snap: false,
            delay: 0
        };
        if (!arguments[1] || Object.isUndefined(arguments[1].endeffect)) {
            Object.extend(c, {
                starteffect: function (d) {
                    d._opacity = Element.getOpacity(d);
                    Draggable._dragging[d] = true;
                    new Effect.Opacity(d, {
                        duration: 0.2,
                        from: d._opacity,
                        to: 0.7
                    })
                }
            })
        }
        var a = Object.extend(c, arguments[1] || {});
        this.element = $(b);
        if (a.handle && Object.isString(a.handle)) {
            this.handle = this.element.down("." + a.handle, 0)
        }
        if (!this.handle) {
            this.handle = $(a.handle)
        }
        if (!this.handle) {
            this.handle = this.element
        }
        if (a.scroll && !a.scroll.scrollTo && !a.scroll.outerHTML) {
            a.scroll = $(a.scroll);
            this._isScrollChild = Element.childOf(this.element, a.scroll)
        }
        Element.makePositioned(this.element);
        this.options = a;
        this.dragging = false;
        this.eventMouseDown = this.initDrag.bindAsEventListener(this);
        Event.observe(this.handle, "mousedown", this.eventMouseDown);
        Draggables.register(this)
    },
    destroy: function () {
        Event.stopObserving(this.handle, "mousedown", this.eventMouseDown);
        Draggables.unregister(this)
    },
    currentDelta: function () {
        return ([parseInt(Element.getStyle(this.element, "left") || "0"), parseInt(Element.getStyle(this.element, "top") || "0")])
    },
    initDrag: function (a) {
        if (!Object.isUndefined(Draggable._dragging[this.element]) && Draggable._dragging[this.element]) {
            return
        }
        if (Event.isLeftClick(a)) {
            var c = Event.element(a);
            if ((tag_name = c.tagName.toUpperCase()) && (tag_name == "INPUT" || tag_name == "SELECT" || tag_name == "OPTION" || tag_name == "BUTTON" || tag_name == "TEXTAREA")) {
                return
            }
            var b = [Event.pointerX(a), Event.pointerY(a)];
            var d = Position.cumulativeOffset(this.element);
            this.offset = [0, 1].map(function (e) {
                return (b[e] - d[e])
            });
            Draggables.activate(this);
            Event.stop(a)
        }
    },
    startDrag: function (b) {
        this.dragging = true;
        if (!this.delta) {
            this.delta = this.currentDelta()
        }
        if (this.options.zindex) {
            this.originalZ = parseInt(Element.getStyle(this.element, "z-index") || 0);
            this.element.style.zIndex = this.options.zindex
        }
        if (this.options.ghosting) {
            this._clone = this.element.cloneNode(true);
            this._originallyAbsolute = (this.element.getStyle("position") == "absolute");
            if (!this._originallyAbsolute) {
                Position.absolutize(this.element)
            }
            this.element.parentNode.insertBefore(this._clone, this.element)
        }
        if (this.options.scroll) {
            if (this.options.scroll == window) {
                var a = this._getWindowScroll(this.options.scroll);
                this.originalScrollLeft = a.left;
                this.originalScrollTop = a.top
            } else {
                this.originalScrollLeft = this.options.scroll.scrollLeft;
                this.originalScrollTop = this.options.scroll.scrollTop
            }
        }
        Draggables.notify("onStart", this, b);
        if (this.options.starteffect) {
            this.options.starteffect(this.element)
        }
    },
    updateDrag: function (event, pointer) {
        if (!this.dragging) {
            this.startDrag(event)
        }
        if (!this.options.quiet) {
            Position.prepare();
            Droppables.show(pointer, this.element)
        }
        Draggables.notify("onDrag", this, event);
        this.draw(pointer);
        if (this.options.change) {
            this.options.change(this)
        }
        if (this.options.scroll) {
            this.stopScrolling();
            var p;
            if (this.options.scroll == window) {
                with(this._getWindowScroll(this.options.scroll)) {
                    p = [left, top, left + width, top + height]
                }
            } else {
                p = Position.page(this.options.scroll);
                p[0] += this.options.scroll.scrollLeft + Position.deltaX;
                p[1] += this.options.scroll.scrollTop + Position.deltaY;
                p.push(p[0] + this.options.scroll.offsetWidth);
                p.push(p[1] + this.options.scroll.offsetHeight)
            }
            var speed = [0, 0];
            if (pointer[0] < (p[0] + this.options.scrollSensitivity)) {
                speed[0] = pointer[0] - (p[0] + this.options.scrollSensitivity)
            }
            if (pointer[1] < (p[1] + this.options.scrollSensitivity)) {
                speed[1] = pointer[1] - (p[1] + this.options.scrollSensitivity)
            }
            if (pointer[0] > (p[2] - this.options.scrollSensitivity)) {
                speed[0] = pointer[0] - (p[2] - this.options.scrollSensitivity)
            }
            if (pointer[1] > (p[3] - this.options.scrollSensitivity)) {
                speed[1] = pointer[1] - (p[3] - this.options.scrollSensitivity)
            }
            this.startScrolling(speed)
        }
        if (Prototype.Browser.WebKit) {
            window.scrollBy(0, 0)
        }
        Event.stop(event)
    },
    finishDrag: function (b, f) {
        this.dragging = false;
        if (this.options.quiet) {
            Position.prepare();
            var e = [Event.pointerX(b), Event.pointerY(b)];
            Droppables.show(e, this.element)
        }
        if (this.options.ghosting) {
            if (!this._originallyAbsolute) {
                Position.relativize(this.element)
            }
            delete this._originallyAbsolute;
            Element.remove(this._clone);
            this._clone = null
        }
        var g = false;
        if (f) {
            g = Droppables.fire(b, this.element);
            if (!g) {
                g = false
            }
        }
        if (g && this.options.onDropped) {
            this.options.onDropped(this.element)
        }
        Draggables.notify("onEnd", this, b);
        var a = this.options.revert;
        if (a && Object.isFunction(a)) {
            a = a(this.element)
        }
        var c = this.currentDelta();
        if (a && this.options.reverteffect) {
            if (g == 0 || a != "failure") {
                this.options.reverteffect(this.element, c[1] - this.delta[1], c[0] - this.delta[0])
            }
        } else {
            this.delta = c
        }
        if (this.options.zindex) {
            this.element.style.zIndex = this.originalZ
        }
        if (this.options.endeffect) {
            this.options.endeffect(this.element)
        }
        Draggables.deactivate(this);
        Droppables.reset()
    },
    keyPress: function (a) {
        if (a.keyCode != Event.KEY_ESC) {
            return
        }
        this.finishDrag(a, false);
        Event.stop(a)
    },
    endDrag: function (a) {
        if (!this.dragging) {
            return
        }
        this.stopScrolling();
        this.finishDrag(a, true);
        Event.stop(a)
    },
    draw: function (a) {
        var g = Position.cumulativeOffset(this.element);
        if (this.options.ghosting) {
            var c = Position.realOffset(this.element);
            g[0] += c[0] - Position.deltaX;
            g[1] += c[1] - Position.deltaY
        }
        var f = this.currentDelta();
        g[0] -= f[0];
        g[1] -= f[1];
        if (this.options.scroll && (this.options.scroll != window && this._isScrollChild)) {
            g[0] -= this.options.scroll.scrollLeft - this.originalScrollLeft;
            g[1] -= this.options.scroll.scrollTop - this.originalScrollTop
        }
        var e = [0, 1].map(function (d) {
            return (a[d] - g[d] - this.offset[d])
        }.bind(this));
        if (this.options.snap) {
            if (Object.isFunction(this.options.snap)) {
                e = this.options.snap(e[0], e[1], this)
            } else {
                if (Object.isArray(this.options.snap)) {
                    e = e.map(function (d, h) {
                        return (d / this.options.snap[h]).round() * this.options.snap[h]
                    }.bind(this))
                } else {
                    e = e.map(function (d) {
                        return (d / this.options.snap).round() * this.options.snap
                    }.bind(this))
                }
            }
        }
        var b = this.element.style;
        if ((!this.options.constraint) || (this.options.constraint == "horizontal")) {
            b.left = e[0] + "px"
        }
        if ((!this.options.constraint) || (this.options.constraint == "vertical")) {
            b.top = e[1] + "px"
        }
        if (b.visibility == "hidden") {
            b.visibility = ""
        }
    },
    stopScrolling: function () {
        if (this.scrollInterval) {
            clearInterval(this.scrollInterval);
            this.scrollInterval = null;
            Draggables._lastScrollPointer = null
        }
    },
    startScrolling: function (a) {
        if (!(a[0] || a[1])) {
            return
        }
        this.scrollSpeed = [a[0] * this.options.scrollSpeed, a[1] * this.options.scrollSpeed];
        this.lastScrolled = new Date();
        this.scrollInterval = setInterval(this.scroll.bind(this), 10)
    },
    scroll: function () {
        var current = new Date();
        var delta = current - this.lastScrolled;
        this.lastScrolled = current;
        if (this.options.scroll == window) {
            with(this._getWindowScroll(this.options.scroll)) {
                if (this.scrollSpeed[0] || this.scrollSpeed[1]) {
                    var d = delta / 1000;
                    this.options.scroll.scrollTo(left + d * this.scrollSpeed[0], top + d * this.scrollSpeed[1])
                }
            }
        } else {
            this.options.scroll.scrollLeft += this.scrollSpeed[0] * delta / 1000;
            this.options.scroll.scrollTop += this.scrollSpeed[1] * delta / 1000
        }
        Position.prepare();
        Droppables.show(Draggables._lastPointer, this.element);
        Draggables.notify("onDrag", this);
        if (this._isScrollChild) {
            Draggables._lastScrollPointer = Draggables._lastScrollPointer || $A(Draggables._lastPointer);
            Draggables._lastScrollPointer[0] += this.scrollSpeed[0] * delta / 1000;
            Draggables._lastScrollPointer[1] += this.scrollSpeed[1] * delta / 1000;
            if (Draggables._lastScrollPointer[0] < 0) {
                Draggables._lastScrollPointer[0] = 0
            }
            if (Draggables._lastScrollPointer[1] < 0) {
                Draggables._lastScrollPointer[1] = 0
            }
            this.draw(Draggables._lastScrollPointer)
        }
        if (this.options.change) {
            this.options.change(this)
        }
    },
    _getWindowScroll: function (w) {
        var T, L, W, H;
        with(w.document) {
            if (w.document.documentElement && documentElement.scrollTop) {
                T = documentElement.scrollTop;
                L = documentElement.scrollLeft
            } else {
                if (w.document.body) {
                    T = body.scrollTop;
                    L = body.scrollLeft
                }
            }
            if (w.innerWidth) {
                W = w.innerWidth;
                H = w.innerHeight
            } else {
                if (w.document.documentElement && documentElement.clientWidth) {
                    W = documentElement.clientWidth;
                    H = documentElement.clientHeight
                } else {
                    W = body.offsetWidth;
                    H = body.offsetHeight
                }
            }
        }
        return {
            top: T,
            left: L,
            width: W,
            height: H
        }
    }
});
Draggable._dragging = {};
var SortableObserver = Class.create({
    initialize: function (b, a) {
        this.element = $(b);
        this.observer = a;
        this.lastValue = Sortable.serialize(this.element)
    },
    onStart: function () {
        this.lastValue = Sortable.serialize(this.element)
    },
    onEnd: function () {
        Sortable.unmark();
        if (this.lastValue != Sortable.serialize(this.element)) {
            this.observer(this.element)
        }
    }
});
var Sortable = {
    SERIALIZE_RULE: /^[^_\-](?:[A-Za-z0-9\-\_]*)[_](.*)$/,
    sortables: {},
    _findRootElement: function (a) {
        while (a.tagName.toUpperCase() != "BODY") {
            if (a.id && Sortable.sortables[a.id]) {
                return a
            }
            a = a.parentNode
        }
    },
    options: function (a) {
        a = Sortable._findRootElement($(a));
        if (!a) {
            return
        }
        return Sortable.sortables[a.id]
    },
    destroy: function (a) {
        a = $(a);
        var b = Sortable.sortables[a.id];
        if (b) {
            Draggables.removeObserver(b.element);
            b.droppables.each(function (c) {
                Droppables.remove(c)
            });
            b.draggables.invoke("destroy");
            delete Sortable.sortables[b.element.id]
        }
    },
    create: function (c) {
        c = $(c);
        var b = Object.extend({
            element: c,
            tag: "li",
            dropOnEmpty: false,
            tree: false,
            treeTag: "ul",
            overlap: "vertical",
            constraint: "vertical",
            containment: c,
            handle: false,
            only: false,
            delay: 0,
            hoverclass: null,
            ghosting: false,
            quiet: false,
            scroll: false,
            scrollSensitivity: 20,
            scrollSpeed: 15,
            format: this.SERIALIZE_RULE,
            elements: false,
            handles: false,
            onChange: Prototype.emptyFunction,
            onUpdate: Prototype.emptyFunction
        }, arguments[1] || {});
        this.destroy(c);
        var a = {
            revert: true,
            quiet: b.quiet,
            scroll: b.scroll,
            scrollSpeed: b.scrollSpeed,
            scrollSensitivity: b.scrollSensitivity,
            delay: b.delay,
            ghosting: b.ghosting,
            constraint: b.constraint,
            handle: b.handle
        };
        if (b.starteffect) {
            a.starteffect = b.starteffect
        }
        if (b.reverteffect) {
            a.reverteffect = b.reverteffect
        } else {
            if (b.ghosting) {
                a.reverteffect = function (f) {
                    f.style.top = 0;
                    f.style.left = 0
                }
            }
        }
        if (b.endeffect) {
            a.endeffect = b.endeffect
        }
        if (b.zindex) {
            a.zindex = b.zindex
        }
        var d = {
            overlap: b.overlap,
            containment: b.containment,
            tree: b.tree,
            hoverclass: b.hoverclass,
            onHover: Sortable.onHover
        };
        var e = {
            onHover: Sortable.onEmptyHover,
            overlap: b.overlap,
            containment: b.containment,
            hoverclass: b.hoverclass
        };
        Element.cleanWhitespace(c);
        b.draggables = [];
        b.droppables = [];
        if (b.dropOnEmpty || b.tree) {
            Droppables.add(c, e);
            b.droppables.push(c)
        }(b.elements || this.findElements(c, b) || []).each(function (h, f) {
            var g = b.handles ? $(b.handles[f]) : (b.handle ? $(h).select("." + b.handle)[0] : h);
            b.draggables.push(new Draggable(h, Object.extend(a, {
                handle: g
            })));
            Droppables.add(h, d);
            if (b.tree) {
                h.treeNode = c
            }
            b.droppables.push(h)
        });
        if (b.tree) {
            (Sortable.findTreeElements(c, b) || []).each(function (f) {
                Droppables.add(f, e);
                f.treeNode = c;
                b.droppables.push(f)
            })
        }
        this.sortables[c.id] = b;
        Draggables.addObserver(new SortableObserver(c, b.onUpdate))
    },
    findElements: function (b, a) {
        return Element.findChildren(b, a.only, a.tree ? true : false, a.tag)
    },
    findTreeElements: function (b, a) {
        return Element.findChildren(b, a.only, a.tree ? true : false, a.treeTag)
    },
    onHover: function (e, d, a) {
        if (Element.isParent(d, e)) {
            return
        }
        if (a > 0.33 && a < 0.66 && Sortable.options(d).tree) {
            return
        } else {
            if (a > 0.5) {
                Sortable.mark(d, "before");
                if (d.previousSibling != e) {
                    var b = e.parentNode;
                    e.style.visibility = "hidden";
                    d.parentNode.insertBefore(e, d);
                    if (d.parentNode != b) {
                        Sortable.options(b).onChange(e)
                    }
                    Sortable.options(d.parentNode).onChange(e)
                }
            } else {
                Sortable.mark(d, "after");
                var c = d.nextSibling || null;
                if (c != e) {
                    var b = e.parentNode;
                    e.style.visibility = "hidden";
                    d.parentNode.insertBefore(e, c);
                    if (d.parentNode != b) {
                        Sortable.options(b).onChange(e)
                    }
                    Sortable.options(d.parentNode).onChange(e)
                }
            }
        }
    },
    onEmptyHover: function (e, g, h) {
        var j = e.parentNode;
        var a = Sortable.options(g);
        if (!Element.isParent(g, e)) {
            var f;
            var c = Sortable.findElements(g, {
                tag: a.tag,
                only: a.only
            });
            var b = null;
            if (c) {
                var d = Element.offsetSize(g, a.overlap) * (1 - h);
                for (f = 0; f < c.length; f += 1) {
                    if (d - Element.offsetSize(c[f], a.overlap) >= 0) {
                        d -= Element.offsetSize(c[f], a.overlap)
                    } else {
                        if (d - (Element.offsetSize(c[f], a.overlap) / 2) >= 0) {
                            b = f + 1 < c.length ? c[f + 1] : null;
                            break
                        } else {
                            b = c[f];
                            break
                        }
                    }
                }
            }
            g.insertBefore(e, b);
            Sortable.options(j).onChange(e);
            a.onChange(e)
        }
    },
    unmark: function () {
        if (Sortable._marker) {
            Sortable._marker.hide()
        }
    },
    mark: function (b, a) {
        var d = Sortable.options(b.parentNode);
        if (d && !d.ghosting) {
            return
        }
        if (!Sortable._marker) {
            Sortable._marker = ($("dropmarker") || Element.extend(document.createElement("DIV"))).hide().addClassName("dropmarker").setStyle({
                position: "absolute"
            });
            document.getElementsByTagName("body").item(0).appendChild(Sortable._marker)
        }
        var c = Position.cumulativeOffset(b);
        Sortable._marker.setStyle({
            left: c[0] + "px",
            top: c[1] + "px"
        });
        if (a == "after") {
            if (d.overlap == "horizontal") {
                Sortable._marker.setStyle({
                    left: (c[0] + b.clientWidth) + "px"
                })
            } else {
                Sortable._marker.setStyle({
                    top: (c[1] + b.clientHeight) + "px"
                })
            }
        }
        Sortable._marker.show()
    },
    _tree: function (e, b, f) {
        var d = Sortable.findElements(e, b) || [];
        for (var c = 0; c < d.length; ++c) {
            var a = d[c].id.match(b.format);
            if (!a) {
                continue
            }
            var g = {
                id: encodeURIComponent(a ? a[1] : null),
                element: e,
                parent: f,
                children: [],
                position: f.children.length,
                container: $(d[c]).down(b.treeTag)
            };
            if (g.container) {
                this._tree(g.container, b, g)
            }
            f.children.push(g)
        }
        return f
    },
    tree: function (d) {
        d = $(d);
        var c = this.options(d);
        var b = Object.extend({
            tag: c.tag,
            treeTag: c.treeTag,
            only: c.only,
            name: d.id,
            format: c.format
        }, arguments[1] || {});
        var a = {
            id: null,
            parent: null,
            children: [],
            container: d,
            position: 0
        };
        return Sortable._tree(d, b, a)
    },
    _constructIndex: function (b) {
        var a = "";
        do {
            if (b.id) {
                a = "[" + b.position + "]" + a
            }
        } while ((b = b.parent) != null);
        return a
    },
    sequence: function (b) {
        b = $(b);
        var a = Object.extend(this.options(b), arguments[1] || {});
        return $(this.findElements(b, a) || []).map(function (c) {
            return c.id.match(a.format) ? c.id.match(a.format)[1] : ""
        })
    },
    setSequence: function (b, c) {
        b = $(b);
        var a = Object.extend(this.options(b), arguments[2] || {});
        var d = {};
        this.findElements(b, a).each(function (e) {
            if (e.id.match(a.format)) {
                d[e.id.match(a.format)[1]] = [e, e.parentNode]
            }
            e.parentNode.removeChild(e)
        });
        c.each(function (e) {
            var f = d[e];
            if (f) {
                f[1].appendChild(f[0]);
                delete d[e]
            }
        })
    },
    serialize: function (c) {
        c = $(c);
        var b = Object.extend(Sortable.options(c), arguments[1] || {});
        var a = encodeURIComponent((arguments[1] && arguments[1].name) ? arguments[1].name : c.id);
        if (b.tree) {
            return Sortable.tree(c, arguments[1]).children.map(function (d) {
                return [a + Sortable._constructIndex(d) + "[id]=" + encodeURIComponent(d.id)].concat(d.children.map(arguments.callee))
            }).flatten().join("&")
        } else {
            return Sortable.sequence(c, arguments[1]).map(function (d) {
                return a + "[]=" + encodeURIComponent(d)
            }).join("&")
        }
    }
};
Element.isParent = function (b, a) {
    if (!b.parentNode || b == a) {
        return false
    }
    if (b.parentNode == a) {
        return true
    }
    return Element.isParent(b.parentNode, a)
};
Element.findChildren = function (d, b, a, c) {
    if (!d.hasChildNodes()) {
        return null
    }
    c = c.toUpperCase();
    if (b) {
        b = [b].flatten()
    }
    var e = [];
    $A(d.childNodes).each(function (g) {
        if (g.tagName && g.tagName.toUpperCase() == c && (!b || (Element.classNames(g).detect(function (h) {
            return b.include(h)
        })))) {
            e.push(g)
        }
        if (a) {
            var f = Element.findChildren(g, b, a, c);
            if (f) {
                e.push(f)
            }
        }
    });
    return (e.length > 0 ? e.flatten() : [])
};
Element.offsetSize = function (a, b) {
    return a["offset" + ((b == "vertical" || b == "height") ? "Height" : "Width")]
};
if (!Control) {
    var Control = {}
}
Control.Slider = Class.create({
    initialize: function (d, a, b) {
        var c = this;
        if (Object.isArray(d)) {
            this.handles = d.collect(function (f) {
                return $(f)
            })
        } else {
            this.handles = [$(d)]
        }
        this.track = $(a);
        this.options = b || {};
        this.axis = this.options.axis || "horizontal";
        this.increment = this.options.increment || 1;
        this.step = parseInt(this.options.step || "1");
        this.range = this.options.range || $R(0, 1);
        this.value = 0;
        this.values = this.handles.map(function () {
            return 0
        });
        this.spans = this.options.spans ? this.options.spans.map(function (e) {
            return $(e)
        }) : false;
        this.options.startSpan = $(this.options.startSpan || null);
        this.options.endSpan = $(this.options.endSpan || null);
        this.restricted = this.options.restricted || false;
        this.maximum = this.options.maximum || this.range.end;
        this.minimum = this.options.minimum || this.range.start;
        this.alignX = parseInt(this.options.alignX || "0");
        this.alignY = parseInt(this.options.alignY || "0");
        this.trackLength = this.maximumOffset() - this.minimumOffset();
        this.handleLength = this.isVertical() ? (this.handles[0].offsetHeight != 0 ? this.handles[0].offsetHeight : this.handles[0].style.height.replace(/px$/, "")) : (this.handles[0].offsetWidth != 0 ? this.handles[0].offsetWidth : this.handles[0].style.width.replace(/px$/, ""));
        this.active = false;
        this.dragging = false;
        this.disabled = false;
        if (this.options.disabled) {
            this.setDisabled()
        }
        this.allowedValues = this.options.values ? this.options.values.sortBy(Prototype.K) : false;
        if (this.allowedValues) {
            this.minimum = this.allowedValues.min();
            this.maximum = this.allowedValues.max()
        }
        this.eventMouseDown = this.startDrag.bindAsEventListener(this);
        this.eventMouseUp = this.endDrag.bindAsEventListener(this);
        this.eventMouseMove = this.update.bindAsEventListener(this);
        this.handles.each(function (f, e) {
            e = c.handles.length - 1 - e;
            c.setValue(parseFloat((Object.isArray(c.options.sliderValue) ? c.options.sliderValue[e] : c.options.sliderValue) || c.range.start), e);
            f.makePositioned().observe("mousedown", c.eventMouseDown)
        });
        this.track.observe("mousedown", this.eventMouseDown);
        document.observe("mouseup", this.eventMouseUp);
        document.observe("mousemove", this.eventMouseMove);
        this.initialized = true
    },
    dispose: function () {
        var a = this;
        Event.stopObserving(this.track, "mousedown", this.eventMouseDown);
        Event.stopObserving(document, "mouseup", this.eventMouseUp);
        Event.stopObserving(document, "mousemove", this.eventMouseMove);
        this.handles.each(function (b) {
            Event.stopObserving(b, "mousedown", a.eventMouseDown)
        })
    },
    setDisabled: function () {
        this.disabled = true
    },
    setEnabled: function () {
        this.disabled = false
    },
    getNearestValue: function (a) {
        if (this.allowedValues) {
            if (a >= this.allowedValues.max()) {
                return (this.allowedValues.max())
            }
            if (a <= this.allowedValues.min()) {
                return (this.allowedValues.min())
            }
            var c = Math.abs(this.allowedValues[0] - a);
            var b = this.allowedValues[0];
            this.allowedValues.each(function (d) {
                var e = Math.abs(d - a);
                if (e <= c) {
                    b = d;
                    c = e
                }
            });
            return b
        }
        if (a > this.range.end) {
            return this.range.end
        }
        if (a < this.range.start) {
            return this.range.start
        }
        return a
    },
    setValue: function (b, a) {
        if (!this.active) {
            this.activeHandleIdx = a || 0;
            this.activeHandle = this.handles[this.activeHandleIdx];
            this.updateStyles()
        }
        a = a || this.activeHandleIdx || 0;
        if (this.initialized && this.restricted) {
            if ((a > 0) && (b < this.values[a - 1])) {
                b = this.values[a - 1]
            }
            if ((a < (this.handles.length - 1)) && (b > this.values[a + 1])) {
                b = this.values[a + 1]
            }
        }
        b = this.getNearestValue(b);
        this.values[a] = b;
        this.value = this.values[0];
        this.handles[a].style[this.isVertical() ? "top" : "left"] = this.translateToPx(b);
        this.drawSpans();
        if (!this.dragging || !this.event) {
            this.updateFinished()
        }
    },
    setValueBy: function (b, a) {
        this.setValue(this.values[a || this.activeHandleIdx || 0] + b, a || this.activeHandleIdx || 0)
    },
    translateToPx: function (a) {
        return Math.round(((this.trackLength - this.handleLength) / (this.range.end - this.range.start)) * (a - this.range.start)) + "px"
    },
    translateToValue: function (a) {
        return ((a / (this.trackLength - this.handleLength) * (this.range.end - this.range.start)) + this.range.start)
    },
    getRange: function (b) {
        var a = this.values.sortBy(Prototype.K);
        b = b || 0;
        return $R(a[b], a[b + 1])
    },
    minimumOffset: function () {
        return (this.isVertical() ? this.alignY : this.alignX)
    },
    maximumOffset: function () {
        return (this.isVertical() ? (this.track.offsetHeight != 0 ? this.track.offsetHeight : this.track.style.height.replace(/px$/, "")) - this.alignY : (this.track.offsetWidth != 0 ? this.track.offsetWidth : this.track.style.width.replace(/px$/, "")) - this.alignX)
    },
    isVertical: function () {
        return (this.axis == "vertical")
    },
    drawSpans: function () {
        var a = this;
        if (this.spans) {
            $R(0, this.spans.length - 1).each(function (b) {
                a.setSpan(a.spans[b], a.getRange(b))
            })
        }
        if (this.options.startSpan) {
            this.setSpan(this.options.startSpan, $R(0, this.values.length > 1 ? this.getRange(0).min() : this.value))
        }
        if (this.options.endSpan) {
            this.setSpan(this.options.endSpan, $R(this.values.length > 1 ? this.getRange(this.spans.length - 1).max() : this.value, this.maximum))
        }
    },
    setSpan: function (b, a) {
        if (this.isVertical()) {
            b.style.top = this.translateToPx(a.start);
            b.style.height = this.translateToPx(a.end - a.start + this.range.start)
        } else {
            b.style.left = this.translateToPx(a.start);
            b.style.width = this.translateToPx(a.end - a.start + this.range.start)
        }
    },
    updateStyles: function () {
        this.handles.each(function (a) {
            Element.removeClassName(a, "selected")
        });
        Element.addClassName(this.activeHandle, "selected")
    },
    startDrag: function (c) {
        if (Event.isLeftClick(c)) {
            if (!this.disabled) {
                this.active = true;
                var d = Event.element(c);
                var e = [Event.pointerX(c), Event.pointerY(c)];
                var a = d;
                if (a == this.track) {
                    var b = Position.cumulativeOffset(this.track);
                    this.event = c;
                    this.setValue(this.translateToValue((this.isVertical() ? e[1] - b[1] : e[0] - b[0]) - (this.handleLength / 2)));
                    var b = Position.cumulativeOffset(this.activeHandle);
                    this.offsetX = (e[0] - b[0]);
                    this.offsetY = (e[1] - b[1])
                } else {
                    while ((this.handles.indexOf(d) == -1) && d.parentNode) {
                        d = d.parentNode
                    }
                    if (this.handles.indexOf(d) != -1) {
                        this.activeHandle = d;
                        this.activeHandleIdx = this.handles.indexOf(this.activeHandle);
                        this.updateStyles();
                        var b = Position.cumulativeOffset(this.activeHandle);
                        this.offsetX = (e[0] - b[0]);
                        this.offsetY = (e[1] - b[1])
                    }
                }
            }
            Event.stop(c)
        }
    },
    update: function (a) {
        if (this.active) {
            if (!this.dragging) {
                this.dragging = true
            }
            this.draw(a);
            if (Prototype.Browser.WebKit) {
                window.scrollBy(0, 0)
            }
            Event.stop(a)
        }
    },
    draw: function (b) {
        var c = [Event.pointerX(b), Event.pointerY(b)];
        var a = Position.cumulativeOffset(this.track);
        c[0] -= this.offsetX + a[0];
        c[1] -= this.offsetY + a[1];
        this.event = b;
        this.setValue(this.translateToValue(this.isVertical() ? c[1] : c[0]));
        if (this.initialized && this.options.onSlide) {
            this.options.onSlide(this.values.length > 1 ? this.values : this.value, this)
        }
    },
    endDrag: function (a) {
        if (this.active && this.dragging) {
            this.finishDrag(a, true);
            Event.stop(a)
        }
        this.active = false;
        this.dragging = false
    },
    finishDrag: function (a, b) {
        this.active = false;
        this.dragging = false;
        this.updateFinished()
    },
    updateFinished: function () {
        if (this.initialized && this.options.onChange) {
            this.options.onChange(this.values.length > 1 ? this.values : this.value, this)
        }
        this.event = null
    }
});
var Tooltips = Class.create();
Tooltips.prototype = {
    initialize: function (a, b) {
        var c = $$(a);
        c.each(function (d) {
            new Tooltip(d, b)
        })
    }
};
var Tooltip = Class.create();
Tooltip.prototype = {
    initialize: function (b, a) {
        this.el = $(b);
        this.initialized = false;
        this.setOptions(a);
        this.showEvent = this.show.bindAsEventListener(this);
        this.hideEvent = this.hide.bindAsEventListener(this);
        this.updateEvent = this.update.bindAsEventListener(this);
        Event.observe(this.el, "mouseover", this.showEvent);
        Event.observe(this.el, "mouseout", this.hideEvent);
        this.content = this.el.title.stripScripts().strip();
        this.el.title = "";
        this.el.descendants().each(function (c) {
            if (Element.readAttribute(c, "alt")) {
                c.alt = ""
            }
        })
    },
    setOptions: function (a) {
        this.options = {
            backgroundColor: "",
            borderColor: "",
            textColor: "",
            textShadowColor: "",
            maxWidth: 250,
            align: "left",
            delay: 250,
            mouseFollow: true,
            opacity: 0.75,
            appearDuration: 0.25,
            hideDuration: 0.25
        };
        Object.extend(this.options, a || {})
    },
    show: function (a) {
        this.xCord = Event.pointerX(a);
        this.yCord = Event.pointerY(a);
        if (!this.initialized) {
            this.timeout = window.setTimeout(this.appear.bind(this), this.options.delay)
        }
    },
    hide: function (a) {
        if (this.initialized) {
            this.appearingFX.cancel();
            if (this.options.mouseFollow) {
                Event.stopObserving(this.el, "mousemove", this.updateEvent)
            }
            new Effect.Fade(this.tooltip, {
                duration: this.options.hideDuration,
                afterFinish: function () {
                    Element.remove(this.tooltip)
                }.bind(this)
            })
        }
        this._clearTimeout(this.timeout);
        this.initialized = false
    },
    update: function (a) {
        this.xCord = Event.pointerX(a);
        this.yCord = Event.pointerY(a);
        this.setup()
    },
    appear: function () {
        this.tooltip = new Element("div", {
            className: "tooltip",
            style: "display: none"
        });
        var c = new Element("div", {
            className: "xarrow"
        }).insert('<b class="a1"></b><b class="a2"></b><b class="a3"></b><b class="a4"></b><b class="a5"></b><b class="a6"></b>');
        var d = new Element("div", {
            className: "xtop"
        }).insert(new Element("div", {
            className: "xb1",
            style: "background-color:" + this.options.borderColor + ";"
        })).insert(new Element("div", {
            className: "xb2",
            style: "background-color:" + this.options.backgroundColor + "; border-color:" + this.options.borderColor + ";"
        })).insert(new Element("div", {
            className: "xb3",
            style: "background-color:" + this.options.backgroundColor + "; border-color:" + this.options.borderColor + ";"
        })).insert(new Element("div", {
            className: "xb4",
            style: "background-color:" + this.options.backgroundColor + "; border-color:" + this.options.borderColor + ";"
        }));
        var a = new Element("div", {
            className: "xbottom"
        }).insert(new Element("div", {
            className: "xb4",
            style: "background-color:" + this.options.backgroundColor + "; border-color:" + this.options.borderColor + ";"
        })).insert(new Element("div", {
            className: "xb3",
            style: "background-color:" + this.options.backgroundColor + "; border-color:" + this.options.borderColor + ";"
        })).insert(new Element("div", {
            className: "xb2",
            style: "background-color:" + this.options.backgroundColor + "; border-color:" + this.options.borderColor + ";"
        })).insert(new Element("div", {
            className: "xb1",
            style: "background-color:" + this.options.borderColor + ";"
        }));
        var b = new Element("div", {
            className: "xboxcontent",
            style: "background-color:" + this.options.backgroundColor + "; border-color:" + this.options.borderColor + ((this.options.textColor != "") ? "; color:" + this.options.textColor : "") + ((this.options.textShadowColor != "") ? "; text-shadow:2px 2px 0" + this.options.textShadowColor + ";" : "")
        }).update(this.content);
        this.tooltip.insert(c).insert(d).insert(b).insert(a);
        $(document.body).insert({
            top: this.tooltip
        });
        this.tooltip.select(".xarrow b").each(function (e) {
            if (!e.hasClassName("a1")) {
                e.setStyle({
                    backgroundColor: this.options.backgroundColor,
                    borderColor: this.options.borderColor
                })
            } else {
                e.setStyle({
                    backgroundColor: this.options.borderColor
                })
            }
        }.bind(this));
        Element.extend(this.tooltip);
        this.options.width = this.tooltip.getWidth() + 1;
        this.tooltip.style.width = this.options.width + "px";
        this.setup();
        if (this.options.mouseFollow) {
            Event.observe(this.el, "mousemove", this.updateEvent)
        }
        this.initialized = true;
        this.appearingFX = new Effect.Appear(this.tooltip, {
            duration: this.options.appearDuration,
            to: this.options.opacity
        })
    },
    setup: function () {
        if (this.options.width > this.options.maxWidth) {
            this.options.width = this.options.maxWidth;
            this.tooltip.style.width = this.options.width + "px"
        }
        if (this.xCord + this.options.width >= Element.getWidth(document.body)) {
            this.options.align = "right";
            this.xCord = this.xCord - this.options.width + 20;
            this.tooltip.down(".xarrow").setStyle({
                left: this.options.width - 24 + "px"
            })
        } else {
            this.options.align = "left";
            this.tooltip.down(".xarrow").setStyle({
                left: 12 + "px"
            })
        }
        this.tooltip.style.left = this.xCord - 7 + "px";
        this.tooltip.style.top = this.yCord + 12 + "px"
    },
    _clearTimeout: function (a) {
        clearTimeout(a);
        clearInterval(a);
        return null
    }
};
if (!window.IEPNGFix) {
    window.IEPNGFix = {}
}
IEPNGFix.tileBG = function (g, r, o) {
    var H = this.data[g.uniqueID],
        b = Math.max(g.clientWidth, g.scrollWidth),
        h = Math.max(g.clientHeight, g.scrollHeight),
        k = g.currentStyle.backgroundPositionX,
        j = g.currentStyle.backgroundPositionY,
        p = g.currentStyle.backgroundRepeat;
    if (!H.tiles) {
        H.tiles = {
            src: "",
            cache: [],
            img: new Image(),
            old: {}
        }
    }
    var D = H.tiles,
        w = D.img.width,
        c = D.img.height;
    if (r) {
        if (!o && r != D.src) {
            D.img.onload = function () {
                this.onload = null;
                IEPNGFix.tileBG(g, r, 1)
            };
            return D.img.src = r
        }
    } else {
        if (D.src) {
            o = 1
        }
        w = c = 0
    }
    D.src = r;
    if (!o && b == D.old.w && h == D.old.h && k == D.old.x && j == D.old.y && p == D.old.r) {
        return
    }
    var e = {
        top: "0%",
        left: "0%",
        center: "50%",
        bottom: "100%",
        right: "100%"
    },
        m, l, a;
    m = e[k] || k;
    l = e[j] || j;
    if (a = m.match(/(\d+)%/)) {
        m = Math.round((b - w) * (parseInt(a[1]) / 100))
    }
    if (a = l.match(/(\d+)%/)) {
        l = Math.round((h - c) * (parseInt(a[1]) / 100))
    }
    m = parseInt(m);
    l = parseInt(l);
    var F = {
        repeat: 1,
        "repeat-x": 1
    }[p],
        C = {
            repeat: 1,
            "repeat-y": 1
        }[p];
    if (F) {
        m %= w;
        if (m > 0) {
            m -= w
        }
    }
    if (C) {
        l %= c;
        if (l > 0) {
            l -= c
        }
    }
    this.hook.enabled = 0;
    if (!({
        relative: 1,
        absolute: 1
    }[g.currentStyle.position])) {
        g.style.position = "relative"
    }
    var f = 0,
        n, B = F ? b : m + 0.1,
        u, z = C ? h : l + 0.1,
        A, q, E;
    if (w && c) {
        for (n = m; n < B; n += w) {
            for (u = l; u < z; u += c) {
                E = 0;
                if (!D.cache[f]) {
                    D.cache[f] = document.createElement("div");
                    E = 1
                }
                var v = (n + w > b ? b - n : w),
                    G = (u + c > h ? h - u : c);
                A = D.cache[f];
                q = A.style;
                q.behavior = "none";
                q.left = n + "px";
                q.top = u + "px";
                q.width = v + "px";
                q.height = G + "px";
                q.clip = "rect(" + (u < 0 ? 0 - u : 0) + "px," + v + "px," + G + "px," + (n < 0 ? 0 - n : 0) + "px)";
                q.display = "block";
                if (E) {
                    q.position = "absolute";
                    q.zIndex = -999;
                    if (g.firstChild) {
                        g.insertBefore(A, g.firstChild)
                    } else {
                        g.appendChild(A)
                    }
                }
                this.fix(A, r, 0);
                f++
            }
        }
    }
    while (f < D.cache.length) {
        this.fix(D.cache[f], "", 0);
        D.cache[f++].style.display = "none"
    }
    this.hook.enabled = 1;
    D.old = {
        w: b,
        h: h,
        x: k,
        y: j,
        r: p
    }
};

function t() {
    return "&t=" + (new Date().getTime())
}
var Engine = {
    detect: function () {
        var a = navigator.userAgent;
        this.isKHTML = /Konqueror|Safari|KHTML/.test(a);
        this.isGecko = (/Gecko/.test(a) && !this.isKHTML);
        this.isOpera = /Opera/.test(a);
        this.isMSIE = (/MSIE/.test(a) && !this.isOpera);
        this.isMSIE7 = this.isMSIE && (a.indexOf("MSIE 7") != -1);
        this.isMSIE8 = this.isMSIE && (a.indexOf("MSIE 8") != -1);
        this.isFF3 = /Firefox\/3.0/.test(a);
        this.isChrome = a.toLowerCase().indexOf("chrome") > -1
    }
};
Engine.detect();
Ajax.Responders.register({
    onCreate: function (a) {
        if (!a.url.include("poll")) {
            $(document).fire("ajax:started");
            if ($("busy") && Ajax.activeRequestCount > 0) {
                $("busy").appear({
                    duration: 0.5,
                    to: 0.8,
                    queue: "end"
                })
            }
        }
    },
    onComplete: function (a) {
        if (!a.url.include("poll")) {
            $(document).fire("ajax:completed");
            if ($("busy") && Ajax.activeRequestCount == 0) {
                $("busy").fade({
                    duration: 0.5,
                    queue: "end"
                })
            }
        }
    }
});
Position.getPageSize = function () {
    var c, a;
    if (window.innerHeight && window.scrollMaxY) {
        c = document.body.scrollWidth;
        a = window.innerHeight + window.scrollMaxY
    } else {
        if (document.body.scrollHeight > document.body.offsetHeight) {
            c = document.body.scrollWidth;
            a = document.body.scrollHeight
        } else {
            c = document.body.offsetWidth;
            a = document.body.offsetHeight
        }
    }
    var b, d;
    if (self.innerHeight) {
        b = self.innerWidth;
        d = self.innerHeight
    } else {
        if (document.documentElement && document.documentElement.clientHeight) {
            b = document.documentElement.clientWidth;
            d = document.documentElement.clientHeight
        } else {
            if (document.body) {
                b = document.body.clientWidth;
                d = document.body.clientHeight
            }
        }
    }
    pageHeight = Math.max(d, a);
    pageWidth = Math.max(b, c);
    return {
        page: {
            width: pageWidth,
            height: pageHeight
        },
        window: {
            width: b,
            height: d
        }
    }
};
var Fluxiom = {
    _resizeCallbacks: [],
    _popupId: 0,
    resize: function () {
        var a = document.viewport.getHeight();
        if ($("main-panel")) {
            var c = 79 + Element.getHeight("toolbar-container") + Element.getHeight("menu-panel") + Element.getHeight("security-panel") + Element.getHeight("filter-panel") + Element.getHeight("system_message") + Element.getHeight("stage_message");
            $("main-panel").setStyle({
                height: (a - c) + "px"
            });
            if ($("admin-panel")) {
                var b = 79 + ($("adminbar-container") ? $("adminbar-container").getHeight() : 0);
                $("admin-panel").setStyle({
                    height: (a - b) + "px"
                })
            }
        } else {
            if ($("admin-panel")) {
                var b = 79 + Element.getHeight("toolbar-container") + Element.getHeight("system_message");
                $("admin-panel").setStyle({
                    height: (a - b) + "px"
                })
            }
        }
        Fluxiom._resizeCallbacks.each(function (d) {
            d()
        })
    },
    registerResizeCallback: function (a) {
        this._resizeCallbacks.push(a)
    },
    lastPanel: null,
    hidePanels: function () {
        if (this.lastPanel != null) {
            var a = {
                duration: 0.5,
                queue: "end"
            };
            if (Engine.isMSIE) {
                Effect.BlindUp(this.lastPanel, a)
            } else {
                new Effect.Parallel([Effect.BlindUp(this.lastPanel, {
                    sync: true
                }), new Effect.Opacity(this.lastPanel, {
                    from: 0.98,
                    to: 0,
                    sync: true
                })], a)
            }
            if ($("menu-panel")) {
                $("menu-panel").getElementsBySelector(".panel").each(function (b) {
                    b.removeClassName("panel")
                })
            }
            if (!Object.isUndefined(Assets.paginator)) {
                Assets.paginator.dispatch()
            }
        }
        this.lastPanel = null
    },
    panelAt: function (b, a) {
        this.panel(a)
    },
    panel: function (a, b) {
        a = $(a);
        if (this.lastPanel && this.lastPanel == a) {
            return
        }
        this.hidePanels();
        a.setStyle({
            bottom: 52 + ($("system_message") ? $("system_message").offsetHeight : 0) + "px"
        });
        var c = {
            duration: 0.5,
            queue: "end",
            afterFinish: function () {
                if (b) {
                    b.evalScripts()
                }
            }
        };
        if (Engine.isMSIE) {
            Effect.BlindDown(a, c)
        } else {
            new Effect.Parallel([Effect.BlindDown(a, {
                sync: true
            }), new Effect.Opacity(a, {
                from: 0,
                to: 0.98,
                sync: true
            })], c)
        }
        this.lastPanel = a
    },
    toggleToolbar: function () {
        if (this.toggleToolbarInProgress) {
            return
        }
        if (Engine.isMSIE) {
            if (!$("adminbar-container").visible()) {
                $$("#content-panel, #admin-panel, #toolbar-container, #adminbar-container, #system_message").invoke("toggle");
                if ($("nav_assets")) {
                    $("nav_assets").addClassName("admin")
                }
                Event._observeShortcuts = false
            } else {
                $$("#content-panel, #admin-panel, #toolbar-container, #adminbar-container, #system_message").invoke("toggle");
                if ($("nav_assets")) {
                    $("nav_assets").removeClassName("admin")
                }
                Event._observeShortcuts = true
            }
            return
        }
        this.toggleToolbarInProgress = true;
        if (!$("adminbar-container").visible()) {
            if ($("content-panel")) {
                $("content-panel").hide()
            }
            if ($("system_message")) {
                $("system_message").hide()
            }
            if ($("admin-panel")) {
                $("admin-panel").show()
            }
            if ($("adminbar-container")) {
                $("adminbar-container").setStyle({
                    height: "0px"
                }).show()
            }
            new Effect.Parallel([new Effect.Scale("adminbar-container", 100, {
                scaleContent: false,
                scaleX: false,
                scaleMode: "contents",
                scaleFrom: 0,
                sync: true
            }), new Effect.Scale("toolbar-container", 0, {
                scaleContent: false,
                scaleX: false,
                sync: true
            })], {
                duration: 0.5,
                afterUpdate: function (a) {
                    $("toolbar-container").down().setStyle({
                        bottom: (a.effects[1].dims[0] - $("toolbar-container").clientHeight) + "px"
                    })
                },
                afterFinish: function () {
                    $("toolbar-container").hide();
                    $("nav_assets").addClassName("admin");
                    Fluxiom.resize();
                    Fluxiom.toggleToolbarInProgress = false
                }
            });
            Event._observeShortcuts = false
        } else {
            if ($("content-panel")) {
                $("content-panel").show()
            }
            if ($("system_message")) {
                $("system_message").show()
            }
            if ($("admin-panel")) {
                $("admin-panel").hide()
            }
            if ($("toolbar-container")) {
                $("toolbar-container").setStyle({
                    height: "0px"
                }).show().down().setStyle({
                    bottom: "0px"
                })
            }
            if ($("nav_assets")) {
                $("nav_assets").removeClassName("admin")
            }
            new Effect.Parallel([new Effect.Scale("toolbar-container", 100, {
                scaleContent: false,
                scaleX: false,
                scaleMode: "contents",
                scaleFrom: 0,
                sync: true
            }), new Effect.Scale("adminbar-container", 0, {
                scaleContent: false,
                scaleX: false,
                sync: true
            })], {
                duration: 0.5,
                afterUpdate: function (a) {
                    $("toolbar-container").down().setStyle({
                        bottom: (a.effects[1].dims[0] - $("toolbar-container").clientHeight) + "px"
                    })
                },
                afterFinish: function () {
                    Element.hide("adminbar-container");
                    Fluxiom.resize();
                    Fluxiom.toggleToolbarInProgress = false;
                    Element.removeClassName("main-panel", "loading")
                }
            });
            if ($("tag_tag")) {
                $("tag_tag").blur()
            }
            Event._observeShortcuts = true
        }
    },
    showWaiting: function () {
        var a = arguments[0] || "";
        this.overlay = new Element("div", {
            id: "waiting_overlay"
        }).update(new Element("p", {
            className: "message"
        }).update(a));
        $(document.body).addClassName("waiting").insert({
            top: this.overlay
        })
    },
    hideWaiting: function () {
        if (this.overlay) {
            Effect.Fade(this.overlay, {
                duration: 0.4,
                onFinish: function (a) {
                    a.element.remove();
                    $(document.body).removeClassName("waiting")
                }
            });
            this.overlay = null
        }
        if ($("main-panel")) {
            $("main-panel").removeClassName("loading")
        }
    },
    initQuickSearch: function (a, f) {
        var a = $(a);
        var d = a.up("form");
        var c = d.down("a");
        if (Prototype.Browser.WebKit) {
            a.writeAttribute("type", "search").writeAttribute("results", "10").writeAttribute("autosave", "search");
            a.observe("search", function (g) {
                if ($F(a) == "") {
                    g.stop();
                    f(a, "");
                    if ($("full-search-button")) {
                        $("full-search-button").hide()
                    }
                }
            })
        } else {
            d.addClassName("pretty");
            var b = function () {
                    if (a.value == "") {
                        d.addClassName("empty")
                    } else {
                        d.removeClassName("empty")
                    }
                    this.focused = false
                };
            b();
            a.observe("focus", function (g) {
                if (d.hasClassName("empty")) {
                    d.removeClassName("empty");
                    a.value = ""
                }
                this.focused = true
            });
            a.observe("blur", b);
            c.observe("click", function (g) {
                g.stop();
                if ($("full-search-button")) {
                    $("full-search-button").hide()
                }
                a.value = "";
                a.focus();
                f(a, "")
            })
        }
        d.observe("keyup", function (g) {
            if (g.keyCode == Event.KEY_ESC) {
                a.value = "";
                f(a, "")
            }
        });
        if ($("full-search-button") && $F(a) != "") {
            $("full-search-button").show()
        }
        function e(g) {
            if (Event._observeShortcuts && g.element() != $("search")) {
                $("search").blur()
            }
        }
        Event.observe(document, "click", e);
        Event.observe(document, "asset:clicked", e);
        Event.observe(document, "rubberband:activated", e)
    },
    initVideoSkimming: function () {
        $("content").delegate(".video", "mousemove", function (d) {
            var f = 10;
            var b = this.down("img");
            var e = this.getWidth();
            var c = e / f >> 0;

            function a(k) {
                var j = 0,
                    h, g;
                while (j < f) {
                    h = c * j;
                    g = c * (j + 1);
                    if (Math.abs(h - k) + Math.abs(g - k) == Math.abs(h - g)) {
                        return j
                    }
                    j++
                }
                return j - 1
            }
            this.newFrame = a(this.localPointer(d).x);
            if (this.activeFrame != this.newFrame) {
                this.down("img").setStyle({
                    left: -(this.newFrame * e) + "px"
                });
                this.activeFrame = this.newFrame
            }
        });
        $("content").delegate(".video", "mouseout", function (a) {
            this.down("img").setStyle({
                left: 0
            });
            this.newFrame = this.activeFrame = 0
        })
    },
    initKeyboardNavigation: function () {
        Event.registerShortcut("I", Assets.showInfoPanel);
        Event.registerShortcut(32, Assets.showInfoPanel);
        Event.registerShortcut(Event.KEY_LEFT, function (a) {
            if (Assets.options.viewType == "thumbs") {
                Assets.switchBy(-1)
            }
            if ($("metadata-panel").visible() && !Object.isUndefined(Assets.paginator)) {
                if (Assets.options.viewType == "thumbs" && Assets.getSelectedAssetsCount() > 1) {
                    Assets.paginator.switchToPrevious(a)
                } else {
                    if (Assets.options.viewType == "list" && Assets.getSelectedAssetsCount() >= 1) {
                        Assets.paginator.switchToPrevious(a)
                    }
                }
            }
            Assets.updateTagsPanel()
        });
        Event.registerShortcut(Event.KEY_RIGHT, function (a) {
            if (Assets.options.viewType == "thumbs") {
                Assets.switchBy(1)
            }
            if ($("metadata-panel").visible() && !Object.isUndefined(Assets.paginator)) {
                if (Assets.options.viewType == "thumbs" && Assets.getSelectedAssetsCount() > 1) {
                    Assets.paginator.switchToNext(a)
                } else {
                    if (Assets.options.viewType == "list" && Assets.getSelectedAssetsCount() >= 1) {
                        Assets.paginator.switchToNext(a)
                    }
                }
            }
            Assets.updateTagsPanel()
        });
        Event.registerShortcut(Event.KEY_UP, function (a) {
            if (Assets.options.viewType == "thumbs") {
                row = (Assets.mainPanel.getWidth() / Assets.documents.first().getWidth()) >> 0;
                Assets.switchBy(-row)
            } else {
                Assets.switchBy(-1);
                if ($("metadata-panel").visible() && !Object.isUndefined(Assets.paginator) && Assets.getSelectedAssetsCount() > 1) {
                    Assets.paginator.switchToPrevious(a)
                }
            }
            Assets.updateTagsPanel()
        });
        Event.registerShortcut(Event.KEY_DOWN, function (a) {
            if (Assets.options.viewType == "thumbs") {
                row = (Assets.mainPanel.getWidth() / Assets.documents.first().getWidth()) >> 0;
                Assets.switchBy(row)
            } else {
                Assets.switchBy(1);
                if ($("metadata-panel").visible() && !Object.isUndefined(Assets.paginator) && Assets.getSelectedAssetsCount() > 1) {
                    Assets.paginator.switchToNext(a)
                }
            }
            Assets.updateTagsPanel()
        });
        Event.registerShortcut(Event.KEY_ESC, function () {
            Fluxiom.hidePanels()
        })
    }
};
var Popup = {
    options: {
        height: 500,
        width: 471
    },
    open: function (b, a) {
        Object.extend(this.options, a || {});
        var g = document.viewport.getDimensions();
        var c = window.screenX || window.screenLeft || 0;
        var f = window.screenY || window.screenTop || 0;
        var e = f + (g.height / 2 - this.options.height / 2) >> 0;
        var d = c + (g.width / 2 - this.options.width / 2) >> 0;
        window.open(b, "fluxiom_popup_" + (new Date().getTime()), "toolbar=0,scrollbars=0,location=0,status=0,menubar=0,top=" + e + ",left=" + d + ",resizable=0,width=" + this.options.width + ",height=" + this.options.height)
    },
    close: function () {
        this.close()
    },
    resizeToElement: function (b) {
        var b = $(b);
        var c = b.getDimensions();
        var a = 0;
        if (Prototype.Browser.WebKit) {
            a = 69
        } else {
            if (Prototype.Browser.Gecko) {
                a = 69
            } else {
                if (Prototype.Browser.IE) {
                    a = 75
                }
            }
        }(function () {
            window.resizeTo(c.width, c.height + a)
        }).delay(0.01)
    }
};
if (!Control) {
    var Control = {}
}
Control.serializeNodes = function (a, c) {
    var e = new Array();
    var b = {
        tagName: false,
        className: false
    };
    Object.extend(b, arguments[2] || {});
    for (var d = 0; d < a.length; d++) {
        if ((!b.tagName || (a[d].tagName == b.tagName.toUpperCase())) && (!b.className || Element.hasClassName(a[d], b.className)) && (a[d].id)) {
            e.push(encodeURIComponent(c) + "[]=" + encodeURIComponent(a[d].id.split("_")[1]))
        }
    }
    return e.join("&")
};
Control.MatrixSelect = Class.create();
Control.MatrixSelect.prototype = {
    initialize: function (b) {
        this.element = $(b);
        this.options = (arguments[1] || {});
        this.nodes = [];
        if (this.element.childNodes) {
            for (var a = 0; a < this.element.childNodes.length; a++) {
                if (this.element.childNodes[a].tagName == "DIV") {
                    this.nodes.push(this.element.childNodes[a]);
                    Event.observe(this.element.childNodes[a], "click", this.toggleOption.bindAsEventListener(this))
                }
            }
        }
        if (this.options.onChange) {
            this.options.onChange(Control.serializeNodes(this.nodes, this.element.id, {
                className: "active"
            }))
        }
    },
    toggleOption: function (b) {
        var a = Event.findElement(b, "DIV");
        Element[Element.hasClassName(a, "active") ? "removeClassName" : "addClassName"](a, "active");
        if (this.options.onChange) {
            this.options.onChange(Control.serializeNodes(this.nodes, this.element.id, {
                className: "active"
            }))
        }
        Event.stop(b)
    }
};
Form.Element.DelayedObserver = Class.create();
Form.Element.DelayedObserver.prototype = {
    initialize: function (b, a, c) {
        this.delay = a || 0.5;
        this.element = $(b);
        this.callback = c;
        this.timer = null;
        this.lastValue = $F(this.element);
        Event.observe(this.element, "keyup", this.delayedListener.bindAsEventListener(this))
    },
    delayedListener: function (a) {
        if (this.lastValue == $F(this.element)) {
            return
        }
        if (this.timer) {
            clearTimeout(this.timer)
        }
        this.timer = setTimeout(this.onTimerEvent.bind(this), this.delay * 1000);
        this.lastValue = $F(this.element);
        if ($("full-search-button")) {
            $("full-search-button").style.display = this.lastValue == "" ? "none" : ""
        }
    },
    onTimerEvent: function () {
        this.timer = null;
        this.callback(this.element, $F(this.element))
    }
};
Object.extend(Event, {
    shortcuts: [],
    _observeShortcuts: true,
    localPointer: function (a, b) {
        var d = [Event.pointerX(b), Event.pointerY(b)];
        var c = Position.page($(a));
        return {
            x: d[0] - (c[0] + (window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0)),
            y: d[1] - (c[1] + (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0))
        }
    },
    registerShortcut: function (a, b) {
        this.shortcuts.push({
            key: a,
            callback: b
        })
    },
    observeShortcut: function (a) {
        if (!Event._observeShortcuts) {
            return
        }
        if (/input|textarea|select|object|option/i.test(Event.element(a).tagName)) {
            return
        }
        Event.shortcuts.map(function (b) {
            if ((Object.isString(b.key) && b.key == String.fromCharCode(a.keyCode) && (!a.ctrlKey && !a.shiftKey && !a.metaKey && !a.altKey)) || (Object.isNumber(b.key) && b.key == a.keyCode)) {
                return b.callback
            }
        }).compact().each(function (b) {
            if (Object.isFunction(b)) {
                b(a)
            }
        })
    }
});
Object.extend(Effect.Transitions, {
    cubic: function (a) {
        a /= 0.5;
        return a < 1 ? 0.5 * a * a * a : 0.5 * ((a - 2) * (a - 2) * (a - 2) + 2)
    }
});
Effect.ScrollToAsset = function (b, d) {
    var c = arguments[2] || {},
        b = $(b),
        a = b.cumulativeScrollOffset(),
        e = $(d).positionedOffset();
    if (c.offset) {
        e[1] += c.offset
    }
    return new Effect.Tween(b, a.top, e[1], c, function (f) {
        b.scrollTop = f.round()
    })
};
Element.addMethods({
    localPointer: Event.localPointer,
    scrollToAsset: function (b, a) {
        new Effect.ScrollToAsset(b, a, {
            duration: 0.25,
            transition: Effect.Transitions.cubic
        });
        return b
    },
    getHeight: function (a) {
        return ($(a) ? ($(a).visible() ? Element.getDimensions(a).height : 0) : 0)
    }
});
Function.prototype.debounce = function (a) {
    var c = this,
        d;
    return function b() {
        var g = this,
            f = arguments;

        function e() {
            c.apply(g, f);
            d = null
        }
        if (d) {
            clearTimeout(d)
        }
        d = setTimeout(e, a || 100)
    }
};
document.observe("dom:loaded", function () {
    try {
        document.execCommand("BackgroundImageCache", false, true)
    } catch (a) {}
    Event.observe(document, "keydown", Event.observeShortcut)
});
var Assets = {
    baseUrl: "/assets/documents/",
    documents: [],
    selected: [],
    previews: [],
    totalCount: 0,
    nothingHappened: true,
    viewScrolledDown: false,
    pollerId: null,
    baseFontSize: 10.3,
    thumbSize: 64,
    options: {
        viewType: "thumbs",
        zoomLevel: 1.5,
        saveSettings: true,
        pollAssets: true,
        pollerInterval: 10
    },
    initialize: function (b, a) {
        this.mainPanel = $(b);
        this.assetsList = $("assets-container");
        Object.extend(this.options, a || {});
        Assets.initZoomSlider("zoombar", this.options.zoomLevel);
        if (this.options.viewType == "list") {
            Assets.showList()
        } else {
            Assets.showThumbs()
        }
        Assets.initObservers();
        Fluxiom.initVideoSkimming();
        Assets.refresh();
        if (this.options.pollAssets) {
            this.startPoller()
        }
        this.updateTagsPanel = this.updateTagsPanel.debounce(500)
    },
    saveViewSettings: function (a) {
        if (this.options.saveSettings) {
            new Ajax.Request("/backbone/users/set_settings/", {
                parameters: {
                    view_type: a.viewType,
                    zoom_level: a.zoomValue
                },
                method: "post"
            })
        }
    },
    initZoomSlider: function (c, b) {
        var a = 1;
        var g = 5.32;
        var e = $(c + "-slider");
        var d = $(c + "-min");
        var f = $(c + "-max");
        if (!e || !d || !f) {
            return
        }
        this.zoomSlider = new Control.Slider(e.down(".handler"), e, {
            onSlide: function (h) {
                Assets.setContentZoom(h)
            },
            onChange: function (h) {
                Assets.setContentZoom(h);
                Assets.checkForResize();
                Assets.mainPanel.fire("view:changed", {
                    zoomValue: h
                })
            },
            range: $R(a, g),
            sliderValue: b || 1.5
        });
        d.observe("click", function (h) {
            h.stop();
            Assets.zoomSlider.setValue(a);
            Assets.checkForResize()
        });
        f.observe("click", function (h) {
            h.stop();
            Assets.zoomSlider.setValue(g);
            Assets.checkForResize()
        });
        this.zoomSlider.setValue(b)
    },
    initObservers: function () {
        this.mainPanel.observe("scroll", Assets.queueRender);
        this.mainPanel.observe("view:changed", function (a) {
            Fluxiom.resize();
            Assets.queueRender();
            Assets.saveViewSettings(a.memo)
        });
        $(document).observe("ajax:started", function (a) {
            this.nothingHappened = false
        }.bind(this));
        $(document).observe("ajax:completed", function (a) {
            this.nothingHappened = true
        }.bind(this));
        $("assets-container").delegate(".asset .wrapper", "click", function (a) {
            Assets.markDocument(a, this.up().id.split("_")[1])
        });
        $("assets-container").delegate(".asset .version", "click", function (a) {
            a.stop();
            Assets.showVersionsPanel(this.up().id.split("_")[1])
        });
        $("assets-container").delegate(".asset .wrapper", "dblclick", function (b) {
            b.stop();
            var a = this.up();
            var c = a.id.split("_")[1];
            if (a.hasClassName("with-preview")) {
                Assets.preview()
            } else {
                if (confirm("No preview available yet. Do you want to download this asset instead?")) {
                    Assets.download("download-form")
                }
            }
        });
        this.mainPanel.observe("click", function (a) {
            Assets.unmark();
            Assets.updateMenu();
            Fluxiom.hidePanels()
        });
        if ($("btn-managetags")) {
            $("btn-managetags").observe("click", function (a) {
                a.stop();
                Fluxiom.toggleToolbar();
                new Ajax.Updater({
                    success: "admin-panel",
                    failure: "admin-panel"
                }, "/assets/tags", {
                    mathod: "get",
                    asynchronous: true,
                    evalScripts: true,
                    onComplete: function (b) {
                        Element.addClassName("adminbar_tags", "active");
                        Event._observeShortcuts = false
                    },
                    onFailure: function (b) {
                        alert(b.responseText)
                    }
                })
            })
        }
    },
    toggleTagOnSelected: function (a) {
        Element.hasClassName("edit_multi_" + a, "active") ? Assets.removeTagFromSelected(a, Assets.serializeSelectedAsPlainText()) : Assets.addTagToSelected(a, Assets.serializeSelectedAsPlainText())
    },
    addTagToSelected: function (b, a) {
        new Ajax.Request(Assets.baseUrl + "multiple_set_tag", {
            parameters: {
                tag: b,
                ids: a
            },
            evalScript: true
        })
    },
    removeTagFromSelected: function (b, a) {
        new Ajax.Request(Assets.baseUrl + "multiple_unset_tag", {
            parameters: {
                tag: b,
                ids: a
            },
            evalScript: true
        })
    },
    showThumbs: function () {
        Element.show("zoombar");
        Element.removeClassName("view-list-button", "active");
        Element.addClassName("view-thumbs-button", "active");
        Element.removeClassName("main-panel", "view-list");
        Element.addClassName("main-panel", "view-thumbs");
        Assets.mainPanel.fire("view:changed", {
            viewType: "thumbs"
        });
        this.options.viewType = "thumbs"
    },
    showList: function () {
        Element.hide("zoombar");
        Element.addClassName("view-list-button", "active");
        Element.removeClassName("view-thumbs-button", "active");
        Element.removeClassName("main-panel", "view-thumbs");
        Element.addClassName("main-panel", "view-list");
        Assets.mainPanel.fire("view:changed", {
            viewType: "list"
        });
        this.options.viewType = "list"
    },
    toggleTagFilter: function (b, a) {
        this.stopImageLoading();
        new Ajax.Request(Assets.baseUrl + "tag_filter_toggle?tag=" + a + t())
    },
    toggleStagesTagFilter: function (b, a) {
        this.stopImageLoading();
        new Ajax.Request("/stages/tag_filter_toggle?tag=" + a + t())
    },
    toggleAutotagFilter: function (b, a) {
        this.stopImageLoading();
        new Ajax.Request(Assets.baseUrl + "autotag_filter_toggle?tag=" + a + t())
    },
    toggleStagesAutotagFilter: function (b, a) {
        this.stopImageLoading();
        new Ajax.Request("/stages/autotag_filter_toggle?tag=" + a + t())
    },
    refresh: function (a) {
        if (Assets.nothingHappened) {
            Assets.stopImageLoading();
            new Ajax.Request(Assets.baseUrl + "refresh?" + t(), {
                parameters: {
                    section: ((!Object.isUndefined(a)) ? a : "all")
                }
            })
        }
    },
    toggleSearch: function () {
        $$("#normal-search, #full-search").invoke("toggle")
    },
    getSelected: function () {
        return this.selected.findAll(function (a) {
            return a
        })
    },
    getSelectedAssetsCount: function () {
        return Assets.getSelected().length
    },
    serializeSelected: function () {
        return this.getSelected().map(function (a) {
            return "id[]=" + encodeURIComponent(a.id.split("_")[1])
        }).join("&")
    },
    serializeSelectedAsPlainText: function () {
        return this.getSelected().map(function (a) {
            return encodeURIComponent(a.id.split("_")[1])
        }).join(",")
    },
    deleteSelected: function () {
        var a = this.getSelectedAssetsCount();
        if (a == 0) {
            return
        }
        if (confirm("Do you really want to delete " + a + " asset" + ((a != 1) ? "s" : "") + "?")) {
            new Ajax.Request(Assets.baseUrl + "delete", {
                method: "post",
                parameters: {
                    ids: Assets.serializeSelectedAsPlainText()
                },
                asynchronous: true,
                evalScripts: true,
                onCreate: function () {
                    Fluxiom.showWaiting("Deleting...")
                },
                onComplete: function (b) {
                    Fluxiom.hideWaiting()
                },
                onSuccess: function (b) {
                    this.getSelected().each(function (c) {
                        c.remove();
                        Assets.documents.splice(Assets.documents.indexOf(c), 1)
                    });
                    this.selected = [];
                    this.setAssetsCount(b.responseJSON.documents_count);
                    this.render();
                    this.updateMenu()
                }.bind(this),
                onFailure: function (b) {
                    alert("Sorry, but selected assets couldn't be deleted now. Please try again and if it happens again, please contact us at support@fluxiom.com.")
                }
            })
        }
    },
    currentDocument: function () {
        return ((this.getSelectedAssetsCount() == 1) ? this.getSelected()[0].id.split("_")[1] : 0)
    },
    showDocumentPanel: function (a) {
        a = a || Assets.currentDocument() || 0;
        url = Assets.baseUrl + "edit/" + a;
        this.documentWindow = window.open(url, "fluxiom_assets_" + a, "toolbar=0,scrollbars=0,location=0,status=0,menubar=0,resizable=0,width=471,height=500")
    },
    showVersionsPanel: function (a) {
        a = a || Assets.currentDocument() || 0;
        url = Assets.baseUrl + "edit/" + a + "?panel=versions";
        this.documentWindow = window.open(url, "fluxiom_assets_" + a, "toolbar=0,scrollbars=0,location=0,status=0,menubar=0,resizable=0,width=471,height=500")
    },
    download: function (b) {
        var a = $(b);
        if (!a) {
            return
        }
        if (this.getSelected().length > 5 && !confirm("Do you really want to download " + this.getSelected().length + " assets?")) {
            return
        }
        a.down("input[name=ids]").value = Assets.serializeSelectedAsPlainText();
        a.submit()
    },
    openPreview: function (b) {
        var a = (typeof arguments[1] != "undefined" ? "?version=" + arguments[1] : "");
        window.open(Assets.baseUrl + "preview/" + b + a, "fluxiom_assets_preview_" + b, "toolbar=0,scrollbars=0,location=0,status=0,menubar=0,resizable=1,width=768,height=768")
    },
    preview: function () {
        if (this.previews.length > 3 && !confirm("Do you really want to preview " + this.previews.length + " assets?")) {
            return
        }
        this.previews.each(function (a) {
            var b = a.id.split("_")[1];
            Assets.openPreview(b)
        })
    },
    unmark: function () {
        this.getSelected()._each(function (a) {
            Element.removeClassName(a, "selected")
        });
        this.selected = this.documents.map(function () {
            return false
        });
        this.previews = []
    },
    _select: function (a) {
        this.selected[this.documents.indexOf(a)] = a;
        Element.addClassName(a, "selected");
        if (Element.hasClassName(a, "with-preview")) {
            this.previews.push(a)
        }
    },
    _unselect: function (a) {
        this.selected[this.documents.indexOf(a)] = false;
        this.previews = this.previews.reject(function (b) {
            return b == a
        });
        Element.removeClassName(a, "selected")
    },
    markDocument: function (c, a) {
        Assets.mainPanel.fire("asset:clicked");
        Fluxiom.hidePanels();
        if (!c.ctrlKey && !c.metaKey && !c.shiftKey) {
            this.unmark()
        }
        var e = $("document_" + a);
        if (!c.shiftKey && this.selected.include(e)) {
            this._unselect(e)
        } else {
            this._select(e)
        }
        if (c.shiftKey) {
            var d = this.getSelected();
            if (d.length > 0) {
                var f = d[0],
                    b = d[d.length - 1];
                var g = false;
                this.documents.each(function (j, h) {
                    if (j == f) {
                        g = true
                    }
                    if (j == b) {
                        throw $break
                    }
                    if (g && !this.selected[h]) {
                        Assets._select(j)
                    }
                }.bind(this))
            }
        }
        this.updateMenu();
        c.stop()
    },
    active: function (a) {
        return (Element.hasClassName(a, "active"))
    },
    _updateButtonsClassName: function (a, b) {
        $A(a).each(function (c) {
            Element[b + "ClassName"](c, "active")
        })
    },
    enableButtons: function (a) {
        this._updateButtonsClassName(a, "add")
    },
    disableButtons: function (a) {
        this._updateButtonsClassName(a, "remove")
    },
    updateMenu: function () {
        var a = this.getSelected().length;
        if (this.documents.length == 0) {
            this.disableButtons(["edit-button", "preview-button", "tags-button", "metadata-button", "download-button", "share-button", "delete-button"]);
            this.enableButtons(["add-button", "stage-button", "rss-button"])
        } else {
            switch (a) {
            case 0:
                this.disableButtons(["edit-button", "preview-button", "tags-button", "metadata-button", "download-button", "share-button", "delete-button"]);
                this.enableButtons(["add-button", "stage-button", "rss-button"]);
                break;
            case 1:
                this.enableButtons(["add-button", "edit-button", "tags-button", "metadata-button", "download-button", "share-button", "delete-button", "stage-button", "rss-button"]);
                break;
            default:
                this.enableButtons(["add-button", "tags-button", "metadata-button", "download-button", "share-button", "delete-button", "stage-button", "rss-button"]);
                this.disableButtons(["edit-button"])
            }
            this[(this.previews.length > 0 ? "enable" : "disable") + "Buttons"](["preview-button"])
        }
        this.updateSelectionInfo(a, this.getAssetsCount())
    },
    updateSelectionInfo: function (b, c) {
        var a = $("selection-info");
        if (b == 0) {
            a.update(c + " assets")
        } else {
            a.update(b + " of " + c + " assets")
        }
    },
    panel: function (b, a) {
        buttonName = (b == "subscribe" ? "rss" : b) + "-button";
        Fluxiom.panel(b + "-panel", a);
        $(buttonName).addClassName("panel");
        if (b == "metadata") {
            if (!Object.isUndefined(this.paginator)) {
                this.paginator.dispatch()
            }
            this.paginator = new Paginator()
        }
    },
    queueRender: function () {
        if (this._queue) {
            clearTimeout(this._queue)
        }
        this._queue = setTimeout(Assets.render.bind(Assets), 500)
    },
    stopImageLoading: function () {
        this._imageQueue = []
    },
    _imageQueue: [],
    queueImage: function (a, b) {
        this._imageQueue.push({
            element: a,
            src: b
        });
        if (!this._imageQueueInterval) {
            this._imageQueueInterval = setInterval(this.imageQueueUpdate.bind(this), 5)
        }
    },
    imageQueueUpdate: function () {
        (4).times(function (a) {
            if (a < this._imageQueue.length) {
                var b = this._imageQueue[a];
                if (b.image && !b.image.complete) {
                    return
                }
                if (b.image && b.image.complete) {
                    b.element.src = b.src;
                    this._imageQueue = (a == 0 ? this._imageQueue.slice(1) : this._imageQueue.slice(0, a).concat(this._imageQueue.slice(a + 1)))
                }
                if (a < this._imageQueue.length) {
                    b = this._imageQueue[a];
                    b.image = new Image();
                    b.image.src = b.src
                }
            }
            if (this._imageQueue.length == 0) {
                clearInterval(this._imageQueueInterval);
                this._imageQueueInterval = null
            }
        }.bind(this))
    },
    render: function () {
        var a = this.mainPanel.scrollTop;
        var b = {
            top: a,
            bottom: this.mainPanel.clientHeight + a
        };
        if (Assets.documents[0]) {
            var c = Assets.documents[0].down("img").getHeight()
        }
        Assets.documents.each(function (e) {
            var f = e.offsetTop;
            if (!e.loaded && (f + c >= b.top && f <= b.bottom)) {
                var d = e.down("img[rel]");
                if (!Object.isUndefined(d)) {
                    Assets.queueImage(d, d.readAttribute("rel"));
                    e.loaded = true
                }
            }
        })
    },
    setContentZoom: function (a) {
        this.mainPanel.setContentZoom(a * 100);
        Assets.updateLayout(a, this.viewportWidth);
        Assets.queueRender()
    },
    startPoller: function (a) {
        if (Object.isUndefined(a)) {
            a = Assets.options.pollerInterval
        }
        if (Assets.pollerId == null) {
            Assets.pollerId = Assets.pollAssets.delay(a)
        }
    },
    pollAssets: function () {
        if (!Assets.nothingHappened) {
            Assets.pollerId = Assets.pollAssets.delay(Assets.options.pollerInterval);
            return
        }
        new Ajax.Request(Assets.baseUrl + "poll?" + t(), {
            onCreate: function () {
                Assets.nothingHappened = false
            },
            onComplete: function (b) {
                Assets.nothingHappened = true;
                var a = b.responseJSON;
                Assets.options.pollerInterval = (a.assets.length == 0 && a.refresh == false) ? 10 : 2;
                Assets.pollerId = Assets.pollAssets.delay(Assets.options.pollerInterval);
                if (a.refresh == true || Assets.hasRemoteUpdates) {
                    if (Assets.getSelectedAssetsCount() == 0 && !Assets.viewScrolledDown) {
                        Assets.hasRemoteUpdates = false;
                        Assets.refresh()
                    } else {
                        Assets.hasRemoteUpdates = true
                    }
                    if (Assets.hasRemoteUpdates) {
                        new Effect.Pulsate("refresh-button")
                    }
                } else {
                    a.assets.each(function (f) {
                        var d = $("document_" + f.id);
                        var c = d.down(".a-thumb");
                        var e = {
                            width: "",
                            height: ""
                        };
                        if (f.hasPreview) {
                            d.addClassName("with-preview");
                            c.removeClassName("icon");
                            if (f.video) {
                                c.addClassName("video")
                            } else {
                                if (f.vertical) {
                                    c.addClassName("vertical");
                                    e = {
                                        width: (5 / f.aspectRatio).toFixed(2) + "em",
                                        height: ""
                                    }
                                } else {
                                    e = {
                                        height: (5 * f.aspectRatio).toFixed(2) + "em",
                                        width: ""
                                    }
                                }
                            }
                        }
                        c.down("img").writeAttribute("rel", f.url).setStyle(e);
                        d.loaded = false
                    });
                    Assets.checkForResize(true);
                    Assets.render()
                }
            }
        })
    },
    updateLayout: function (c, a) {
        if (!$("content-panel").visible()) {
            return
        }
        var a = Object.isUndefined(a) ? this.mainPanel.getWidth() : a;
        var c = Object.isUndefined(c) ? this.zoomFactor : c;
        var d = 5 * this.baseFontSize * c + 10;
        var b = (a / (d + 15)) >> 0;
        this.assetsList.className = "grid" + (b > 20 ? "20" : b);
        this.viewportWidth = a;
        this.zoomFactor = c
    },
    checkForResize: function (e) {
        var d = Assets.zoomSlider.value * 100;
        var c = 64;
        if ($R(100, 133).include(d)) {
            var c = 64
        } else {
            if ($R(134, 266).include(d)) {
                var c = 128
            } else {
                if ($R(267, 532).include(d)) {
                    var c = 256
                }
            }
        }
        if (e) {
            Assets.thumbSize = 64
        }
        if (c == Assets.thumbSize || Assets.documents.length == 0) {
            return
        }
        var a = "_" + Assets.thumbSize;
        var b = new RegExp(a);
        Assets.documents.each(function (h) {
            var g = h.down("img[rel]");
            if (!Object.isUndefined(g)) {
                var f = g.readAttribute("rel").replace(b, "_" + c);
                g.writeAttribute("rel", f);
                h.loaded = false
            }
        });
        Assets.thumbSize = c;
        Assets.render()
    },
    setAssetsCount: function (a) {
        this.totalCount = a
    },
    getAssetsCount: function () {
        return this.totalCount
    },
    resetAssets: function () {
        Assets.documents = [];
        Assets.assetsIds = [];
        Assets.previews = [];
        Assets.selected = []
    },
    initAfterLoad: function (a) {
        $("next-assets").replace(a);
        var b = $("assets-container").select(".assets").last();
        if (b) {
            b.select(".asset").each(function (c) {
                this.documents.push(c);
                this.assetsIds.push(c.id.split("_")[1]);
                if (c.hasClassName("selected")) {
                    this.selected.push(c)
                }
            }.bind(this))
        }
        this.checkForResize(true);
        this.render();
        this.updateMenu();
        this.nothingHappened = true;
        document.fire("assets:updated");
        this.mainPanel.focus()
    },
    switchBy: function (a) {
        if (this.getSelectedAssetsCount() != 1) {
            return
        }
        currentIdx = this.assetsIds.indexOf(this.currentDocument());
        nextIdx = currentIdx + a;
        if (nextIdx < 0) {
            return
        }
        if (nextIdx >= this.assetsIds.length) {
            return
        }
        nextAsset = $("document_" + this.assetsIds[nextIdx]);
        if (nextAsset) {
            this._unselect($("document_" + this.currentDocument()));
            this._select(nextAsset);
            $("main-panel").scrollToAsset(nextAsset)
        }
        $(document).fire("assets:switched", {
            currentAssetId: this.currentDocument()
        })
    },
    showInfoPanel: function (a) {
        if (!Object.isUndefined(a)) {
            a.stop()
        }
        if (Assets.active("metadata-button")) {
            if ($("metadata-panel").visible()) {
                Fluxiom.hidePanels()
            } else {
                new Ajax.Updater("metadata-panel", Assets.baseUrl + "metadata", {
                    method: "post",
                    parameters: {
                        todo: "metadata",
                        ids: Assets.serializeSelectedAsPlainText()
                    },
                    onComplete: function (b) {
                        Assets.panel("metadata")
                    },
                    asynchronous: true
                })
            }
        }
    },
    showSharePanel: function (a) {
        if (Assets.active("share-button")) {
            if ($("share-panel").visible()) {
                Fluxiom.hidePanels()
            } else {
                new Ajax.Updater("share-panel", Assets.baseUrl + "create_package", {
                    mehtod: "post",
                    parameters: {
                        ids: Assets.serializeSelectedAsPlainText()
                    },
                    evalScripts: false,
                    asynchronous: true,
                    onComplete: function (b) {
                        Assets.panel("share", b.responseText)
                    }
                })
            }
        }
    },
    updateTagsPanel: function () {
        if ($("tags-panel").visible() && Assets.getSelectedAssetsCount() == 1) {
            new Ajax.Updater("tags-panel", Assets.baseUrl + "edit_multiple", {
                asynchronous: true,
                evalScripts: true,
                parameters: {
                    ids: Assets.currentDocument()
                }
            })
        }
    }
};
var AssetsLoader = {
    initialize: function () {
        this.currentPage = 1;
        this.checkDebounced = this.check.bindAsEventListener(this).debounce(500);
        $("main-panel").observe("scroll", this.checkDebounced);
        this.checkDebounced()
    },
    check: function () {
        Assets.viewScrolledDown = (this.scrollDistanceFromTop() > 0) ? true : false;
        if (this.loading || !$("next-assets") || !$("content-panel").visible()) {
            return false
        }
        if (this.scrollDistanceFromBottom() < 80) {
            new Ajax.Request(Assets.baseUrl + "list", {
                evalScripts: true,
                method: "post",
                parameters: {
                    page: this.currentPage
                },
                onCreate: function () {
                    this.loading = true
                }.bind(this),
                onSuccess: function (a) {
                    this.currentPage++;
                    this.loading = false;
                    Assets.initAfterLoad(a.responseText);
                    if ($("next-assets")) {
                        this.checkDebounced()
                    }
                }.bind(this)
            })
        }
    },
    scrollDistanceFromTop: function () {
        return $("main-panel").cumulativeScrollOffset()[1]
    },
    scrollDistanceFromBottom: function () {
        return $("assets-container").getHeight() - ($("main-panel").cumulativeScrollOffset()[1] + $("main-panel").getHeight())
    }
};
if (!Control) {
    var Control = {}
}
Control.Selector = Class.create();
Control.Selector.prototype = {
    initialize: function (a) {
        this.element = $(a);
        this.active = false;
        this.wasactive = false;
        this.wasmoved = false;
        this.pos = Position.page(this.element);
        Event.observe(this.element.up(), "mousedown", this.setActive.bindAsEventListener(this), false);
        Event.observe(document, "mouseup", this.setInactive.bindAsEventListener(this), false);
        Event.observe(document, "mousemove", this.change.bindAsEventListener(this), false);
        Event.observe(this.element.up(), "click", this.cancelIfActive.bindAsEventListener(this), false)
    },
    setActive: function (a) {
        a.preventDefault();
        Fluxiom.hidePanels();
        if (a.metaKey || a.shiftKey || a.ctrlKey || a.altKey) {
            return
        }
        if (this.active) {
            this.setInactive()
        }
        this.active = true;
        this.wasactive = false;
        this.originalEl = Event.element(a);
        this.originalX = a.clientX;
        this.originalY = a.clientY + $("main-panel").scrollTop;
        this.selection = new Element("div", {
            className: "rubberband",
            style: ""
        });
        $("content").appendChild(this.selection);
        this.updateDocs();
        document.fire("rubberband:activated")
    },
    setInactive: function (a) {
        if (this.active) {
            this.stopScrolling();
            this.active = false;
            this.wasactive = true;
            Element.remove(this.selection);
            this.element.style.cursor = "";
            document.fire("rubberband:deactivated");
            a.preventDefault()
        }
    },
    updateDocs: function () {
        var a = this.pos[1];
        this.docs = Assets.documents.collect(function (b) {
            return ([b.offsetLeft, b.offsetTop + a, b.offsetLeft + b.offsetWidth, b.offsetTop + b.offsetHeight + a, b])
        })
    },
    cancelIfActive: function (a) {
        if ((Engine.isMSIE7 || Engine.isMSIE8) && this.wasactive && this.wasmoved) {
            this.wasactive = false;
            this.wasmoved = false;
            a.preventDefault()
        }
    },
    stopScrolling: function () {
        if (this.scrollInterval) {
            clearInterval(this.scrollInterval);
            this.scrollInterval = null
        }
    },
    startScrolling: function (a) {
        this.scrollSpeed = a * 15;
        this.lastScrolled = new Date();
        this.scrollInterval = setInterval(this.scroll.bind(this), 10)
    },
    scroll: function () {
        var b = new Date();
        var e = b - this.lastScrolled;
        this.lastScrolled = b;
        var a = $("main-panel").scrollTop;
        $("main-panel").scrollTop += (this.scrollSpeed * e / 1000);
        var c = $("main-panel").scrollTop - a;
        var d = this.lastY + $("main-panel").scrollTop;
        if (d < this.originalY) {
            this.y2 = this.originalY;
            this.y1 = d
        } else {
            this.y2 = d;
            this.y1 = this.originalY
        }
        Assets.render();
        this.mark()
    },
    change: function (c) {
        if (this.active) {
            if (!Engine.isGecko) {
                if (!Event.isLeftClick(c)) {
                    return this.setInactive(c)
                }
            }
            c.stop();
            var a = c.clientX;
            var f = c.clientY;
            if (a == this.lastX && f == this.lastY) {
                return
            }
            this.lastX = a;
            this.lastY = f;
            this.element.style.cursor = "move";
            this.scrollOffset = $("main-panel").scrollTop;
            var e = $("main-panel").offsetTop;
            var b = e + $("main-panel").offsetHeight;
            if (this.scrollInterval) {
                this.scroll()
            }
            this.stopScrolling();
            if (f < (e + 20)) {
                this.startScrolling(f - (e + 20))
            }
            if (f > (b - 20)) {
                this.startScrolling(f - (b - 20))
            }
            var d = this.pos;
            if (a > (d[0] + this.element.offsetWidth)) {
                a = d[0] + this.element.offsetWidth
            }
            if (f > (d[1] + this.element.parentNode.offsetHeight)) {
                f = d[1] + this.element.parentNode.offsetHeight
            }
            if (a < d[0]) {
                a = d[0]
            }
            if (f < d[1]) {
                f = d[1]
            }
            if (a < this.originalX) {
                this.x2 = this.originalX;
                this.x1 = a
            } else {
                this.x2 = a;
                this.x1 = this.originalX
            }
            f += this.scrollOffset;
            if (f < this.originalY) {
                this.y2 = this.originalY;
                this.y1 = f
            } else {
                this.y2 = f;
                this.y1 = this.originalY
            }
            this.mark();
            this.wasmoved = true
        }
    },
    mark: function () {
        if (this.docs.length < Assets.documents.length) {
            this.updateDocs()
        }
        this.scrollOffset = $("main-panel").scrollTop;
        var a = {
            left: this.x1 + "px",
            width: (this.x2 - this.x1) + "px"
        };
        if ((this.y1 - this.scrollOffset) < this.pos[1]) {
            a.top = this.pos[1] + "px";
            a.height = Math.min(this.y2 - this.scrollOffset - this.pos[1], this.element.parentNode.offsetHeight) + "px"
        } else {
            a.top = this.y1 - this.scrollOffset + "px";
            a.height = Math.min(this.y2 - this.y1, this.element.parentNode.offsetHeight - (this.y1 - this.scrollOffset - this.pos[1])) + "px"
        }
        Element.setStyle(this.selection, a);
        var b = Assets.selected;
        var c = false;
        this.docs.each(function (e, d) {
            if ((e[0] >= this.x1 || e[2] >= this.x1) && (e[1] >= this.y1 || e[3] >= this.y1) && (e[0] <= this.x2 || e[2] <= this.x2) && (e[1] <= this.y2 || e[3] <= this.y2)) {
                if (!b[d]) {
                    c = true;
                    Assets._select(e[4])
                }
            } else {
                if (b[d]) {
                    c = true;
                    Assets._unselect(e[4])
                }
            }
        }.bind(this));
        if (c) {
            Assets.updateMenu()
        }
    }
};
var Paginator = Class.create({
    initialize: function () {
        this.getAssetsIds();
        this.currentAsset = Assets.currentDocument();
        this.currentIdx = (Assets.getSelectedAssetsCount() > 1) ? 0 : Assets.documents.indexOf($("document_" + this.currentAsset));
        this.updatePageInfo(this.currentIdx);
        this.prevEventListener = this.switchToPrevious.bindAsEventListener(this);
        this.nextEventListener = this.switchToNext.bindAsEventListener(this);
        this.updateAssetsListener = this.getAssetsIds.bindAsEventListener(this);
        this.switchAssetListener = this.switchAsset.bindAsEventListener(this);
        this.requestDataDebounced = this.requestData.bind(this).debounce(500);
        $("paging-previous").observe("click", this.prevEventListener);
        $("paging-next").observe("click", this.nextEventListener);
        $(document).observe("assets:updated", this.updateAssetsListener);
        $(document).observe("assets:switched", this.switchAssetListener)
    },
    getAssetsIds: function () {
        selection = Assets.getSelected();
        assets = (selection.length > 1) ? selection : Assets.documents;
        this.assetsIds = assets.collect(function (a) {
            return a.id.split("_")[1]
        })
    },
    getTotalAssetsCount: function () {
        selectedCount = Assets.getSelected().length;
        return (selectedCount > 1) ? selectedCount : Assets.getAssetsCount()
    },
    switchToPrevious: function (a) {
        a.stop();
        idx = this.currentIdx - 1;
        if (idx < 0) {
            if (Assets.getSelectedAssetsCount() == 1) {
                return
            } else {
                idx = this.getTotalAssetsCount() - 1
            }
        }
        this.switchTo(idx)
    },
    switchToNext: function (a) {
        a.stop();
        idx = this.currentIdx + 1;
        if (idx > this.getTotalAssetsCount() - 1) {
            if (Assets.getSelectedAssetsCount() == 1) {
                return
            } else {
                idx = 0
            }
        }
        this.switchTo(idx)
    },
    switchAsset: function (b) {
        var a = Assets.documents.indexOf($("document_" + b.memo.currentAssetId));
        this.switchTo(a)
    },
    switchTo: function (a) {
        this.currentIdx = a;
        this.updatePageInfo(a);
        this.requestDataDebounced(a)
    },
    requestData: function (a) {
        new Ajax.Updater("metadata-panel-content", Assets.baseUrl + "metadata/" + this.assetsIds[a], {
            asynchronous: true,
            evalScripts: true,
            parameters: {
                layout: false
            },
            onSuccess: function (c) {
                if (Assets.getSelectedAssetsCount() == 1) {
                    Assets._unselect($("document_" + Assets.currentDocument()));
                    var b = $("document_" + this.assetsIds[a]);
                    Assets._select(b);
                    $("main-panel").scrollToAsset(b)
                }
            }.bind(this)
        })
    },
    updatePageInfo: function (a) {
        var b = $("paging-position");
        b.update((a + 1) + "/" + this.getTotalAssetsCount());
        if (Assets.getSelectedAssetsCount() == 1) {
            if (a == 0) {
                $("paging-previous").addClassName("disabled")
            } else {
                $("paging-previous").removeClassName("disabled")
            }
            if (a == this.getTotalAssetsCount() - 1) {
                $("paging-next").addClassName("disabled")
            } else {
                $("paging-next").removeClassName("disabled")
            }
        }
    },
    dispatch: function () {
        $("paging-previous").stopObserving("click", this.prevEventListener);
        $("paging-next").stopObserving("click", this.nextEventListener);
        $(document).stopObserving("assets:updated", this.updateAssetsListener);
        $(document).stopObserving("assets:switched", this.switchAssetListener)
    }
});
var Stages = {
    openInviteBox: function (a) {
        new Effect.SlideDown("invite-box_" + a, {
            duration: 0.6
        });
        new Effect.Opacity("invite-box_" + a, {
            duration: 0.4,
            from: 0,
            to: 1
        });
        new Effect.Fade("invite-button_" + a, {
            duration: 0.2
        });
        if (!$("invite-help_" + a).up(1).hasClassName("invite-box")) {
            new Effect.Appear("invite-help_" + a, {
                duration: 0.2,
                delay: 0.3
            })
        }
        setTimeout(function () {
            $("invite-box_" + a).down("textarea").focus()
        }, 700)
    },
    closeInviteBox: function (a) {
        new Effect.SlideUp("invite-box_" + a, {
            duration: 0.6
        });
        new Effect.Opacity("invite-box_" + a, {
            duration: 0.4,
            from: 1,
            to: 0
        });
        new Effect.Appear("invite-button_" + a, {
            duration: 0.2,
            delay: 0.3
        });
        if (!$("invite-help_" + a).up(1).hasClassName("invite-box")) {
            new Effect.Fade("invite-help_" + a, {
                duration: 0.2
            })
        }
    }
};
Fluxiom.Administration = {};
Fluxiom.Administration.Users = {
    backpanel: function (a) {
        Element.show(a + "_admin");
        new Effect.Parallel([new Effect.Opacity(a, {
            from: 1,
            to: 0,
            sync: true
        }), new Effect.Scale(a, 80, {
            scaleFromCenter: true,
            restoreAfterFinish: true,
            sync: true
        }), new Effect.Opacity(a + "_admin", {
            from: 0,
            to: 1,
            sync: true
        }), new Effect.Scale(a + "_admin", 100, {
            scaleFrom: 80,
            scaleFromCenter: true,
            sync: true
        })], {
            duration: 0.5,
            afterFinish: function () {
                Element.hide(a)
            }
        })
    },
    frontpanel: function (a) {
        Element.show(a);
        new Effect.Parallel([new Effect.Opacity(a, {
            from: 0,
            to: 1,
            sync: true
        }), new Effect.Scale(a, 100, {
            scaleFrom: 80,
            scaleFromCenter: true,
            sync: true
        }), new Effect.Opacity(a + "_admin", {
            from: 1,
            to: 0,
            sync: true
        }), new Effect.Scale(a + "_admin", 80, {
            scaleFromCenter: true,
            restoreAfterFinish: true,
            sync: true
        })], {
            duration: 0.5,
            afterFinish: function () {
                Element.hide(a + "_admin")
            }
        })
    }
};