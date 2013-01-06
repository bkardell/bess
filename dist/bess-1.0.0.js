/**
 * TIBCO PageBus(TM) version 2.0.0
 *
 * Copyright (c) 2006-2009, TIBCO Software Inc.
 * All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0 . Unless
 * required by applicable law or agreed to in writing, software distributed
 * under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 *
 *
 * Includes code from the official reference implementation of the OpenAjax
 * Hub that is provided by OpenAjax Alliance. Specification is available at:
 *
 *  http://www.openajax.org/member/wiki/OpenAjax_Hub_Specification
 *
 * Copyright 2006-2009 OpenAjax Alliance
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0 . Unless
 * required by applicable law or agreed to in writing, software distributed
 * under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 *
 ******************************************************************************/

/*!
 * mustache.js - Logic-less {{mustache}} templates with JavaScript
 * http://github.com/janl/mustache.js
 */

define("src/extendedjquery", [], function() {
    var e, t, n = jQuery;
    return n.easing.bounce = function(e, t, n, r, i) {
        return (t /= i) < 1 / 2.75 ? r * 7.5625 * t * t + n : t < 2 / 2.75 ? r * (7.5625 * (t -= 1.5 / 2.75) * t + .75) + n : t < 2.5 / 2.75 ? r * (7.5625 * (t -= 2.25 / 2.75) * t + .9375) + n : r * (7.5625 * (t -= 2.625 / 2.75) * t + .984375) + n;
    }, n.expr[":"].matches = function(e, t, r, i) {
        return n(e).is(r[3]);
    }, n.expr[":"].closest = function(e, t, r, i) {
        var s = n(i).has(r[3]);
        return e === s[s.length - 1];
    }, n.expr[":"].notNth = function(e, t, r, i) {
        return r[3] != n(e).index();
    }, n.expr[":"].notEq = n.expr[":"].notNth, n.expr[":"].siblings = function(e, t, r, i) {
        var s = n(r[3]).get(0);
        return s !== undefined && s !== e && s.parentNode == e.parentNode;
    }, n.expr[":"]["nth-match"] = function(e, t, r, i) {
        var s, o = 0, u, a, f, l = 1, c = 0, h;
        u = r[3].split(","), s = e.parentNode, f = u[1].split("n"), base = parseInt(f[0], 10), h = u[0], c = f.length > 1 && f[1] !== "" ? parseInt(f[1], 10) : c, s.xcache || (s.xcache = {}), s.xcache[h] || (s.xcache[h] = n(e).siblings().andSelf().filter(h));
        for (o = 0; o < s.xcache[h].length; o++) if (s.xcache[h].get(base * o + c - 1) === e) return !0;
        return !1;
    }, e = function(e, t, r, i, s) {
        n.each(e, function(e, i) {
            n(i).animate(s, {
                queue: !1,
                duration: t,
                easing: r
            });
        });
    }, n.fn.attract = function(t, n, r, i) {
        e(this, t, n, i, {
            top: -i.position().top,
            left: -i.position().left
        });
    }, n.fn.repel = function(t, n, r, i) {
        e(this, t, n, i, {
            top: i.position().top,
            left: i.position().left
        });
    }, n.fn.attractY = function(t, n, r, i) {
        e(this, t, n, i, {
            top: i.position().top
        });
    }, n.fn.repelY = function(t, n, r, i) {
        e(this, t, n, i, {
            top: -i.position().top
        });
    }, n.fn.attractX = function(t, n, r, i) {
        e(this, t, n, i, {
            left: i.position().left
        });
    }, n.fn.repelX = function(t, n, r, i) {
        e(this, t, n, i, {
            left: -i.position().left
        });
    }, t = function(e, t, r, i, s) {
        n.each(e, function(e, i) {
            n(i).animate(s, {
                queue: !1,
                duration: t,
                easing: r
            });
        });
    }, n.fn.scaleXY = function(e, n, r, i) {
        t(this, e, n, i, {
            height: i.height(),
            width: i.width()
        });
    }, n.fn.scaleX = function(e, n, r, i) {
        t(this, e, n, i, {
            width: i.width()
        });
    }, n.fn.scaleY = function(e, n, r, i) {
        t(this, e, n, i, {
            height: i.height()
        });
    }, n.fn.slideLeft = function(e, t) {
        n.each(this, function(r, i) {
            i.origStyle = n(i).css("display"), i.style.display = "block", n(i).animate({
                width: "hide"
            }, {
                queue: !1,
                duration: e,
                easing: t
            });
        });
    }, n.fn.slideRight = function(e, t) {
        n.each(this, function(r, i) {
            n(i).animate({
                width: "show"
            }, {
                queue: !1,
                duration: e,
                easing: t
            });
        });
    }, n;
}), define("lib/pagebus", [], function() {
    window.OpenAjax || (OpenAjax = new function() {
        var e = !0, t = !1, n = window, r = "org.openajax.hub.", i = {};
        this.hub = i, i.implementer = "http://openajax.org", i.implVersion = "2.0", i.specVersion = "2.0", i.implExtraData = {};
        var s = {};
        i.libraries = s, i.registerLibrary = function(e, t, n, i) {
            s[e] = {
                prefix: e,
                namespaceURI: t,
                version: n,
                extraData: i
            }, this.publish(r + "registerLibrary", s[e]);
        }, i.unregisterLibrary = function(e) {
            this.publish(r + "unregisterLibrary", s[e]), delete s[e];
        }, i._subscriptions = {
            c: {},
            s: []
        }, i._cleanup = [], i._subIndex = 0, i._pubDepth = 0, i.subscribe = function(e, t, n, r, i) {
            n || (n = window);
            var s = e + "." + this._subIndex, o = {
                scope: n,
                cb: t,
                fcb: i,
                data: r,
                sid: this._subIndex++,
                hdl: s
            }, u = e.split(".");
            return this._subscribe(this._subscriptions, u, 0, o), s;
        }, i.publish = function(e, t) {
            var n = e.split(".");
            this._pubDepth++, this._publish(this._subscriptions, n, 0, e, t), this._pubDepth--;
            if (this._cleanup.length > 0 && this._pubDepth == 0) {
                for (var r = 0; r < this._cleanup.length; r++) this.unsubscribe(this._cleanup[r].hdl);
                delete this._cleanup, this._cleanup = [];
            }
        }, i.unsubscribe = function(e) {
            var t = e.split("."), n = t.pop();
            this._unsubscribe(this._subscriptions, t, 0, n);
        }, i._subscribe = function(e, t, n, r) {
            var i = t[n];
            n == t.length ? e.s.push(r) : (typeof e.c == "undefined" && (e.c = {}), typeof e.c[i] == "undefined" ? (e.c[i] = {
                c: {},
                s: []
            }, this._subscribe(e.c[i], t, n + 1, r)) : this._subscribe(e.c[i], t, n + 1, r));
        }, i._publish = function(e, t, n, r, i, s) {
            if (typeof e != "undefined") {
                var o;
                n == t.length ? o = e : (this._publish(e.c[t[n]], t, n + 1, r, i, s), this._publish(e.c["*"], t, n + 1, r, i, s), o = e.c["**"]);
                if (typeof o != "undefined") {
                    var u = o.s, a = u.length;
                    for (var f = 0; f < a; f++) if (u[f].cb) {
                        var l = u[f].scope, c = u[f].cb, h = u[f].fcb, p = u[f].data;
                        typeof c == "string" && (c = l[c]), typeof h == "string" && (h = l[h]), (!h || h.call(l, r, i, p)) && c.call(l, r, i, p, s);
                    }
                }
            }
        }, i._unsubscribe = function(e, t, n, r) {
            if (typeof e != "undefined") {
                if (n < t.length) {
                    var i = e.c[t[n]];
                    this._unsubscribe(i, t, n + 1, r);
                    if (i.s.length == 0) {
                        for (var s in i.c) return;
                        delete e.c[t[n]];
                    }
                    return;
                }
                var o = e.s, u = o.length;
                for (var a = 0; a < u; a++) if (r == o[a].sid) {
                    this._pubDepth > 0 ? (o[a].cb = null, this._cleanup.push(o[a])) : o.splice(a, 1);
                    return;
                }
            }
        };
    }, OpenAjax.hub.registerLibrary("OpenAjax", "http://openajax.org/hub", "1.0", {})), window.PageBus || (PageBus = new function() {
        var e = 0, t = [], n = this;
        this.version = "2.0.0", this._debug = function() {
            window["debugger"];
        }, _badParm = function() {
            throw new Error("OpenAjax.hub.Errors.BadParameters");
        }, _valPub = function(e) {
            (e == null || e.indexOf("*") != -1 || e.indexOf("..") != -1 || e.charAt(0) == "." || e.charAt(e.length - 1) == ".") && _badParm();
        }, _valSub = function(e) {
            var t = e.split("."), n = t.length;
            for (var r = 0; r < n; r++) (t[r] == "" || t[r].indexOf("*") != -1 && t[r] != "*" && t[r] != "**") && _badParm(), t[r] == "**" && r < n - 1 && _badParm();
            return t;
        }, _cacheIt = function(e) {
            return e && typeof e == "object" && e.PageBus && e.PageBus.cache;
        }, _TopicMatcher = function() {
            this._items = {};
        }, _TopicMatcher.prototype.store = function(e, t) {
            var n = e.split("."), r = n.length;
            _recurse = function(i, s) {
                if (s == r) i["."] = {
                    topic: e,
                    value: t
                }; else {
                    var o = n[s];
                    i[o] || (i[o] = {}), _recurse(i[o], s + 1);
                }
            }, _recurse(this._items, 0);
        }, _TopicMatcher.prototype.match = function(e, t) {
            var n = e.split("."), r = n.length, i = [];
            return _recurse = function(e, s) {
                if (!e) return;
                var o;
                if (s == r) o = e; else {
                    _recurse(e[n[s]], s + 1);
                    if (t) return;
                    n[s] != "**" && _recurse(e["*"], s + 1), o = e["**"];
                }
                if (!o || !o["."]) return;
                i.push(o["."]);
            }, _recurse(this._items, 0), i;
        }, _TopicMatcher.prototype.exists = function(e, t) {
            var n = e.split("."), r = n.length, i = !1;
            return _recurse = function(e, s) {
                if (!e) return;
                var o;
                if (s == r) o = e; else {
                    _recurse(e[n[s]], s + 1);
                    if (i || t) return;
                    if (n[s] != "**") {
                        _recurse(e["*"], s + 1);
                        if (i) return;
                    }
                    o = e["**"];
                }
                if (!o || !o["."]) return;
                i = !0;
            }, _recurse(this._items, 0), i;
        }, _TopicMatcher.prototype.clear = function(e) {
            var t = e.split("."), n = t.length;
            _recurse = function(e, r) {
                if (!e) return;
                if (r == n) e["."] && delete e["."]; else {
                    _recurse(e[t[r]], r + 1);
                    for (var i in e[t[r]]) return;
                    delete e[t[r]];
                }
            }, _recurse(this._items, 0);
        }, _TopicMatcher.prototype.wildcardMatch = function(e) {
            var t = e.split("."), n = t.length, r = [];
            return _recurse = function(e, i) {
                var s = t[i], o;
                if (!e || i == n) return;
                if (s == "**") for (var u in e) u != "." && (o = e[u], o["."] && r.push(o["."]), _recurse(o, i)); else if (s == "*") for (var u in e) u != "." && u != "**" && (o = e[u], i == n - 1 ? o["."] && r.push(o["."]) : _recurse(o, i + 1)); else {
                    o = e[s];
                    if (!o) return;
                    i == n - 1 ? o["."] && r.push(o["."]) : _recurse(o, i + 1);
                }
            }, _recurse(this._items, 0), r;
        }, this._refs = {}, this._doCache = new _TopicMatcher, this._caches = new _TopicMatcher, _isCaching = function(e) {
            return n._doCache.exists(e, !1);
        }, _copy = function(e) {
            var t;
            if (typeof e == "object") {
                if (e == null) return null;
                if (e.constructor == Array) {
                    t = [];
                    for (var n = 0; n < e.length; n++) t[n] = _copy(e[n]);
                    return t;
                }
                if (e.constructor == Date) return t = new Date, t.setDate(e.getDate()), t;
                t = {};
                for (var r in e) t[r] = _copy(e[r]);
                return t;
            }
            return e;
        }, this._add = function(e, t) {
            var n, r = this._doCache.match(e, !0);
            r.length > 0 ? n = r[0].value : (n = {
                rc: 0
            }, this._doCache.store(e, n)), n.rc++, this._refs[t] = e;
        }, this._remove = function(e) {
            var t = this._refs[e];
            if (!t) return;
            delete this._refs[e];
            var n = this._doCache.match(t, !0);
            if (n.length == 0) return;
            n[0].value.rc--;
            if (n[0].value.rc == 0) {
                this._doCache.clear(t);
                var r = this._caches.wildcardMatch(t);
                for (var i = 0; i < r.length; i++) this._doCache.exists(r[i].topic, !1) || this._caches.clear(r[i].topic);
            }
        }, this.subscribe = function(e, t, n, r) {
            r || (r = null);
            var i = OpenAjax.hub.subscribe(e, n, t, r);
            if (_cacheIt(r)) {
                this._add(e, i);
                var s = this.query(e);
                for (var o = 0; o < s.length; o++) try {
                    n.call(t ? t : window, s[o].topic, s[o].value, r);
                } catch (u) {
                    PageBus._debug();
                }
            }
            return i;
        }, this.publish = function(n, r) {
            _valPub(n), t.push({
                n: n,
                m: r,
                d: e + 1
            });
            if (_isCaching(n)) try {
                this._caches.store(n, r);
            } catch (i) {
                _badParm();
            }
            if (e == 0) while (t.length > 0) {
                var s = t.shift(), o = s.n.split(".");
                try {
                    e = s.d, OpenAjax.hub.publish(s.n, s.m), e = 0;
                } catch (u) {
                    throw e = 0, u;
                }
            }
        }, this.unsubscribe = function(e) {
            try {
                this._remove(e), OpenAjax.hub.unsubscribe(e);
            } catch (t) {
                _badParm();
            }
        }, this.store = function(e, t) {
            if (!_isCaching(e)) throw new Error("PageBus.cache.NoCache");
            this.publish(e, t);
        }, this.query = function(e) {
            try {
                return _valSub(e), this._caches.wildcardMatch(e);
            } catch (t) {
                _badParm();
            }
        };
    }, OpenAjax.hub.registerLibrary("PageBus", "http://tibco.com/PageBus", "1.2.0", {}));
    var e = PageBus.publish;
    PageBus.publish = function() {
        var t = arguments;
        setTimeout(function() {
            e.apply(PageBus, t);
        }, 1);
    };
    var t = function(e) {
        return function(t) {
            PageBus.publish("logger." + e, {
                body: t
            });
        };
    };
    return window.Logger = {
        trace: t("trace"),
        debug: t("debug"),
        info: t("info"),
        warn: t("warn"),
        error: t("error"),
        fatal: t("fatal")
    }, PageBus;
}), function(e, t) {
    typeof exports == "object" && exports ? module.exports = t : typeof define == "function" && define.amd ? define("lib/mustache", t) : e.Mustache = t;
}(this, function() {
    function u(e, t) {
        return RegExp.prototype.test.call(e, t);
    }
    function a(e) {
        return !u(r, e);
    }
    function l(e) {
        return e.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
    }
    function h(e) {
        return String(e).replace(/[&<>"'\/]/g, function(e) {
            return c[e];
        });
    }
    function p(e) {
        this.string = e, this.tail = e, this.pos = 0;
    }
    function d(e, t) {
        this.view = e, this.parent = t, this._cache = {};
    }
    function v() {
        this.clearCache();
    }
    function m(t, n, r, i) {
        var s = "", o, u, a;
        for (var l = 0, c = t.length; l < c; ++l) {
            o = t[l], u = o[1];
            switch (o[0]) {
              case "#":
                a = r.lookup(u);
                if (typeof a == "object") if (f(a)) for (var h = 0, p = a.length; h < p; ++h) s += m(o[4], n, r.push(a[h]), i); else a && (s += m(o[4], n, r.push(a), i)); else if (typeof a == "function") {
                    var d = i == null ? null : i.slice(o[3], o[5]);
                    a = a.call(r.view, d, function(e) {
                        return n.render(e, r);
                    }), a != null && (s += a);
                } else a && (s += m(o[4], n, r, i));
                break;
              case "^":
                a = r.lookup(u);
                if (!a || f(a) && a.length === 0) s += m(o[4], n, r, i);
                break;
              case ">":
                a = n.getPartial(u), typeof a == "function" && (s += a(r));
                break;
              case "&":
                a = r.lookup(u), a != null && (s += a);
                break;
              case "name":
                a = r.lookup(u), a != null && (s += e.escape(a));
                break;
              case "text":
                s += u;
            }
        }
        return s;
    }
    function g(e) {
        var t = [], n = t, r = [], i;
        for (var s = 0, o = e.length; s < o; ++s) {
            i = e[s];
            switch (i[0]) {
              case "#":
              case "^":
                r.push(i), n.push(i), n = i[4] = [];
                break;
              case "/":
                var u = r.pop();
                u[5] = i[2], n = r.length > 0 ? r[r.length - 1][4] : t;
                break;
              default:
                n.push(i);
            }
        }
        return t;
    }
    function y(e) {
        var t = [], n, r;
        for (var i = 0, s = e.length; i < s; ++i) n = e[i], n && (n[0] === "text" && r && r[0] === "text" ? (r[1] += n[1], r[3] = n[3]) : (r = n, t.push(n)));
        return t;
    }
    function b(e) {
        return [ new RegExp(l(e[0]) + "\\s*"), new RegExp("\\s*" + l(e[1])) ];
    }
    var e = {};
    e.name = "mustache.js", e.version = "0.7.2", e.tags = [ "{{", "}}" ], e.Scanner = p, e.Context = d, e.Writer = v;
    var t = /\s*/, n = /\s+/, r = /\S/, i = /\s*=/, s = /\s*\}/, o = /#|\^|\/|>|\{|&|=|!/, f = Array.isArray || function(e) {
        return Object.prototype.toString.call(e) === "[object Array]";
    }, c = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
        "/": "&#x2F;"
    };
    e.escape = h, p.prototype.eos = function() {
        return this.tail === "";
    }, p.prototype.scan = function(e) {
        var t = this.tail.match(e);
        return t && t.index === 0 ? (this.tail = this.tail.substring(t[0].length), this.pos += t[0].length, t[0]) : "";
    }, p.prototype.scanUntil = function(e) {
        var t, n = this.tail.search(e);
        switch (n) {
          case -1:
            t = this.tail, this.pos += this.tail.length, this.tail = "";
            break;
          case 0:
            t = "";
            break;
          default:
            t = this.tail.substring(0, n), this.tail = this.tail.substring(n), this.pos += n;
        }
        return t;
    }, d.make = function(e) {
        return e instanceof d ? e : new d(e);
    }, d.prototype.push = function(e) {
        return new d(e, this);
    }, d.prototype.lookup = function(e) {
        var t = this._cache[e];
        if (!t) {
            if (e == ".") t = this.view; else {
                var n = this;
                while (n) {
                    if (e.indexOf(".") > 0) {
                        t = n.view;
                        var r = e.split("."), i = 0;
                        while (t && i < r.length) t = t[r[i++]];
                    } else t = n.view[e];
                    if (t != null) break;
                    n = n.parent;
                }
            }
            this._cache[e] = t;
        }
        return typeof t == "function" && (t = t.call(this.view)), t;
    }, v.prototype.clearCache = function() {
        this._cache = {}, this._partialCache = {};
    }, v.prototype.compile = function(t, n) {
        var r = this._cache[t];
        if (!r) {
            var i = e.parse(t, n);
            r = this._cache[t] = this.compileTokens(i, t);
        }
        return r;
    }, v.prototype.compilePartial = function(e, t, n) {
        var r = this.compile(t, n);
        return this._partialCache[e] = r, r;
    }, v.prototype.getPartial = function(e) {
        return !(e in this._partialCache) && this._loadPartial && this.compilePartial(e, this._loadPartial(e)), this._partialCache[e];
    }, v.prototype.compileTokens = function(e, t) {
        var n = this;
        return function(r, i) {
            if (i) if (typeof i == "function") n._loadPartial = i; else for (var s in i) n.compilePartial(s, i[s]);
            return m(e, n, d.make(r), t);
        };
    }, v.prototype.render = function(e, t, n) {
        return this.compile(e)(t, n);
    }, e.parse = function(r, u) {
        function E() {
            if (m && !w) while (v.length) delete d[v.pop()]; else v = [];
            m = !1, w = !1;
        }
        r = r || "", u = u || e.tags, typeof u == "string" && (u = u.split(n));
        if (u.length !== 2) throw new Error("Invalid tags: " + u.join(", "));
        var f = b(u), c = new p(r), h = [], d = [], v = [], m = !1, w = !1, S, x, T, N, C;
        while (!c.eos()) {
            S = c.pos, T = c.scanUntil(f[0]);
            if (T) for (var k = 0, L = T.length; k < L; ++k) N = T.charAt(k), a(N) ? v.push(d.length) : w = !0, d.push([ "text", N, S, S + 1 ]), S += 1, N == "\n" && E();
            if (!c.scan(f[0])) break;
            m = !0, x = c.scan(o) || "name", c.scan(t), x === "=" ? (T = c.scanUntil(i), c.scan(i), c.scanUntil(f[1])) : x === "{" ? (T = c.scanUntil(new RegExp("\\s*" + l("}" + u[1]))), c.scan(s), c.scanUntil(f[1]), x = "&") : T = c.scanUntil(f[1]);
            if (!c.scan(f[1])) throw new Error("Unclosed tag at " + c.pos);
            C = [ x, T, S, c.pos ], d.push(C);
            if (x === "#" || x === "^") h.push(C); else if (x === "/") {
                if (h.length === 0) throw new Error('Unopened section "' + T + '" at ' + S);
                var A = h.pop();
                if (A[1] !== T) throw new Error('Unclosed section "' + A[1] + '" at ' + S);
            } else if (x === "name" || x === "{" || x === "&") w = !0; else if (x === "=") {
                u = T.split(n);
                if (u.length !== 2) throw new Error("Invalid tags at " + S + ": " + u.join(", "));
                f = b(u);
            }
        }
        var A = h.pop();
        if (A) throw new Error('Unclosed section "' + A[1] + '" at ' + c.pos);
        return d = y(d), g(d);
    };
    var w = new v;
    return e.clearCache = function() {
        return w.clearCache();
    }, e.compile = function(e, t) {
        return w.compile(e, t);
    }, e.compilePartial = function(e, t, n) {
        return w.compilePartial(e, t, n);
    }, e.compileTokens = function(e, t) {
        return w.compileTokens(e, t);
    }, e.render = function(e, t, n) {
        return w.render(e, t, n);
    }, e.to_html = function(t, n, r, i) {
        var s = e.render(t, n, r);
        if (typeof i != "function") return s;
        i(s);
    }, e;
}()), define("src/logging", [], function() {
    var e = window.console, t = function() {};
    return e || (e = {
        trace: t,
        debug: t,
        info: t,
        warn: t,
        error: t,
        fatal: t
    }), e.debug || (e.debug = e.log), e;
}), define("src/modules", [ "src/extendedjquery", "lib/pagebus", "lib/mustache", "src/logging" ], function(e, t, n, r) {
    var i = function(e) {
        return {
            resolver: "string",
            arg: e || ""
        };
    }, s = function(e) {
        return {
            resolver: "find",
            arg: [ i(e || ":self") ]
        };
    }, o = function(e) {
        return {
            resolver: "obj",
            arg: e || "{}"
        };
    }, u = {
        effect: {
            properties: [ "name", "target", "duration", "easing", "relative" ],
            defaults: {
                target: s(),
                duration: i("slow"),
                easing: i("swing"),
                relative: s()
            },
            apply: function(t, n) {
                var r, i = t.target.length, s = t.name.split(","), o = function(e, t, n, r) {
                    return function(e, t, n, r) {
                        --e === 0 && (t.dequeue("pseudo"), n.target.trigger("post-" + r));
                    };
                };
                i === 0 && n.dequeue("pseudo"), n.queue("pseudo").unshift(e.noop);
                for (var u = 0; u < s.length; u++) r = e.trim(s[u]), t.target[r](t.duration, t.easing, o(i, n, t, r), t.relative);
            }
        },
        publish: {
            properties: [ "topic", "data", "timer", "repeat" ],
            defaults: {
                data: o(),
                timer: i(0),
                repeat: i(1)
            },
            apply: function(n, r) {
                var i, s, o, u;
                i = n.repeat || 1, s = n.repeat == "infinity", o = setInterval(function() {
                    !s && i <= 0 ? u() : (i--, t.publish(e.isArray(n.topic) ? n.topic[0] : n.topic, n.data || {}));
                }, n.timer), u = function() {
                    clearInterval(o);
                };
            }
        },
        "class": {
            properties: [ "op", "name", "target" ],
            defaults: {
                op: "toggle",
                target: s()
            },
            apply: function(t, n) {
                t.name = e.isArray(t.name) ? t.name.join(" ") : t.name, t.name && t.target[t.op + "Class"](t.name);
            }
        },
        redirect: {
            properties: [ "uri" ],
            defaults: {},
            apply: function(e, t) {
                window.location.href = e.uri;
            }
        },
        form: {
            properties: [ "target", "data" ],
            defaults: {},
            apply: function(t, n) {
                var r, i, s = t.target[0], o;
                t.data = t.data || "";
                if (t.target) {
                    t.target = s.tagName.toLowerCase() === "form" ? t.target.find(":file,:hidden,:input,:radio,:checkbox") : t.target, i = typeof t.data == "string" || e.isArray(t.data);
                    for (r = 0; r < t.target.length; r++) o = i ? t.data : t.data[t.target[r].name], e(t.target[r]).val(o);
                }
            }
        },
        html: {
            properties: [ "op", "source", "target" ],
            defaults: {
                target: s(),
                source: {
                    resolver: "html",
                    arg: s()
                },
                op: {
                    resolver: "string",
                    arg: "replaceContent"
                }
            },
            apply: function(t, r) {
                var i, s, o;
                i = [ "append", "replaceContent", "prepend", "replaceWith", "wrapInner", "wrap" ], s = t.id || t.source, o = -1 < e.inArray(t.op, i) ? s : null, s ? (r.queue("pseudo").unshift(e.noop), str = n.to_html(o, t.data, {}), a(t.op, str, t.target), r.dequeue("pseudo")) : a(t.op, o, t.target);
            }
        }
    }, a = function(e, t, n, i) {
        r.debug("Default Modifier called within Modules."), i && i();
    }, f = function(e) {
        return u[e];
    };
    return f.resolvers = {
        str: i,
        find: s,
        obj: o
    }, f.setModifier = function(e) {
        a = e;
    }, f.cache = u, f;
}), define("src/dommod", [ "src/extendedjquery", "lib/pagebus", "src/logging" ], function(e, t, n) {
    return mod = function(r, s, o, u) {
        var a, f, l, c;
        if (r == "replaceContent" || r === "remove" || r === "empty") {
            a = e("*", o), l = a.filter('[bess_parsed="true"]');
            for (i = 0; i < l.length; i++) {
                f = l[i];
                for (c = bessRules.length - 1; c >= 0; c--) bessRules[c].selector.boundFrom === f && bessRules.splice(c, 1);
            }
            if (r === "replaceContent") o.empty(), r = "append"; else if (r === "remove" || r === "empty") {
                o[r](), n.debug("Triggering html-modified..."), o.trigger("html-modified");
                return;
            }
        }
        e.browser.msie ? (id = e.now(), d = document.createElement("div"), d.id = "temp" + id, d.style.display = "none", document.body.appendChild(d), d = document.getElementById("temp" + id), d.innerHTML = s, o[r](e(d.childNodes)), document.body.removeChild(d)) : o[r](s), t.publish("document.scan", {
            context: o,
            isLocal: !0
        }), t.publish("document.inserted.children", {
            context: o
        });
    }, mod;
}), define("src/jpath", [ "src/extendedjquery" ], function(e) {
    var t = function(n, r, i, s) {
        var o, u = 0, a, f = !0, l;
        if (n && i.length < s) if (e.isArray(n)) for (; u < n.length; u++) t(n[u], r, i, s); else {
            for (u = 0; f && u < r.length; u++) l = n[r[u].prop], typeof l != "undefined" ? r[u].re && (f = r[u].re.test(l)) : f = !1;
            f && i.push(n);
            for (o in n) typeof n[o] == "object" && t(n[o], r, i, s);
        }
    }, n = function(n, r, i) {
        var s = 0, o, u = r.split(/(\[|\])/), a, f, l, c = [], h = [];
        for (; s < u.length; s++) a = e.trim(u[s]), !/\[|\]/.test(a) && a !== "" && (a = u[s].split(/\W?=/), o = r.match(/(\W?=)/), l = {
            prop: e.trim(a[0])
        }, a.length > 1 && o && o.length > 0 && (o = o[0].charAt(0), a[1] = a[1].replace(/\'/g, ""), o === "^" ? a[1] = "^" + a[1] : o === "$" ? a[1] = a[1] + "$" : o !== "*" && (a[1] = "^" + a[1] + "$"), l.re = new RegExp(a[1])), c.push(l));
        return t(n, c, h, i || Number.MAX_VALUE), h;
    };
    return n;
}), define("src/typeresolvers", [ "src/extendedjquery", "lib/mustache", "src/jpath" ], function(e, t, n) {
    var r = function(t, n) {
        var r, i, s, o, u, a;
        return r = (n[0] + " ").split("<"), s = r[0] === "", i = s ? "#" + t.attr("id") + r[1] : r[0], r.length > 1 && !s ? (o = r[0] == "*", u = o ? "*:not(#" + t.attr("id") + ")" : r[0], t = t.closest(u), r[1] != " " && (t = t.find(r[1])), a = t) : a = e(i), a;
    }, i = function(e, t) {
        var n, r, i = 0, s, o, u = [], a = e.length % t;
        o = Math.floor(e.length / t);
        for (r = 0; r < t; r++) {
            s = [], o = u.length === 0 ? o + a : Math.round(e.length / t);
            for (n = 0; n < o; n++) e[i] && (s.push(e[i]), i++);
            u.push(s);
        }
        return u;
    }, s = {
        message: function(t, n, r, i, s) {
            var o = s || {};
            n = e.isArray(n) ? n[0] : n, r.setVal(i, !n || n === "" ? o : o[n]);
        },
        capture: function(t, n, i, s) {
            var o = [], u;
            t = r(t, n);
            for (u = 0; u < t.length; u++) o.push(e(t[u]).val());
            i.setVal(s, o);
        },
        collect: function(t, n, r, i) {
            var s, o = n[0], u = t, a = [], f, l = "";
            n.length === 2 ? typeof n[1] == "string" ? l = n[1] : u = n[1] : n.length === 3 && typeof n[2] == "string" && (u = n[1], l = n[2]), u.jquery && (u = e.makeArray(u)), u = e.isArray(u) ? u : [ u ];
            for (var c = 0; c < u.length; c++) f = e(u[c]), f.attr(o) ? a.push(f.attr(o)) : l && a.push(l);
            r.setVal(i, a);
        },
        cut: function(t, n, r, i) {
            var s = e("<div></div>");
            s.append(n[0][0]), r.setVal(i, s.html());
        },
        markup: function(t, n, r, i) {
            r.setVal(i, e(n[0][0]).html());
        },
        number: function(e, t, n, r) {
            n.setVal(r, parseInt(t[0], 10));
        },
        string: function(e, t, n, r) {
            n.setVal(r, t[0].toString());
        },
        find: function(e, t, n, i) {
            n.setVal(i, r(e, t));
        },
        request: function(t, n, r, i) {
            var s = n[0], o, u = {
                success: function(e) {
                    r.setVal(i, e);
                },
                error: function(e) {
                    var t = i + " (" + this.url + "):" + arguments[2];
                    r.setError(t, arguments[0]);
                },
                type: "GET",
                dataType: "text"
            };
            typeof s == "string" ? u.url = s : typeof s[0] == "string" ? u.url = s[0] : s[0].tagName && s[0].tagName.toLowerCase() === "form" ? (u.url = s[0].getAttribute("action"), u.data = s.serialize(), u.type = s[0].getAttribute("method") || "GET", u.contentType = s[0].getAttribute("enctype") || "application/x-www-form-urlencoded", s[0].getAttribute("accept") && (u.accepts = s[0].getAttribute("accept"))) : u.data = e.param(s), n.length >= 2 && (u.type = n[1]), n.length === 3 && (u.url = n[2]), u.url.indexOf("#") === 0 ? r.setVal(i, t) : u.url === "" ? r.setVal(i, "") : e.ajax(u);
        },
        obj: function(t, n, r, i, s) {
            var o, u = {};
            n[0].match(/\S/)[0] === "{" ? r.setVal(i, JSON.parse(n[0])) : (o = n[0].split("&"), e.each(o, function(t, n) {
                var r, i = n.split("=");
                u[i[0]] ? (r = u[i[0]], e.isArray(u[i[0]]) || (u[i[0]] = [ u[i[0]] ]), u[i[0]].push(i[1])) : u[i[0]] = i[1];
            }), r.setVal(i, u));
        },
        cookie: function(e, t, n, r) {
            s.obj(e, document.cookie, n, r, ",");
        },
        combine: function(t, n, r, i) {
            var s = {}, o = 0, u = n.length;
            for (; o < u; o++) e.extend(s, n[o]);
            r.setVal(i, s);
        },
        mash: function(t, n, r, s) {
            var o = n[1], u, a, f, l = 0, c, h;
            u = e.isArray(n[0]) ? n[0][0] : n[0];
            if (typeof n[1] == "string") try {
                o = JSON.parse(o);
            } catch (p) {
                o = [ o ];
            }
            h = function(e, t, n, i) {
                e.apply(t, function(o, u) {
                    l++, o ? (c = !0, r.setError(e, o)) : (i[n] = u, l >= t.length && r.setVal(s, i.join("")));
                });
            };
            if (e.isArray(o) && n.length > 2) {
                o = i(o, n[2]), a = new Array(o.length);
                for (f = 0; f < o.length && !c; f++) h(u, o[f], f, a);
            } else u.apply(o, function(e, t) {
                e ? r.setError(u, e) : r.setVal(s, t);
            });
        },
        template: function(t, n, r, i) {
            var s = r, o = window.bess_templates ? window.bess_templates : {}, u = o[n[0]];
            u ? s.setVal(i, u) : e.get(n[0], function(e) {
                s.setVal(i, e);
            }, "html").error(function() {
                s.setError(i, "unable to load " + n[0]);
            });
        },
        subset: function(t, r, i, s) {
            var o = typeof r[1] == "string" ? JSON.parse(r[1]) : r[1];
            path = e.isArray(r[0]) ? r[0][0] : r[0], o = n(o, path, r[2]), i.setVal(s, o);
        },
        fromQuery: function(e, t, n, r) {
            var i = "", s = 0, o = window.location.search.substring(1).split("&");
            for (s = 0; s < o.length; s++) o[s].indexOf(t[0]) === 0 && (i = o[s].split("=")[1]);
            n.setVal(r, i);
        },
        range: function(e, t, n, r) {
            var i = 0, s = t[0] || "0", o = t[1] || "0", u = t[2] || "1", a = [];
            for (i = parseInt(s, 10); i < parseInt(o, 10); i += parseInt(u, 10)) a.push(i);
            n.setVal(r, a);
        }
    };
    return s.to = s.find, s.from = s.find, s.where = s.find, s;
}), define("src/typeresolverengine", [ "src/extendedjquery", "src/typeresolvers", "src/logging" ], function(e, t, n) {
    var r = t, i = function(e, t, n, r, i) {
        setTimeout(function() {
            s.property(e, t, n, r, i);
        }, 1);
    }, s = {
        properties: function(e, t, r, s, o) {
            var u = {}, a, f = {
                ct: 0,
                setVal: function(e, i) {
                    u[e] = i, this.ct--, n.debug("resolved " + e + "..." + this.ct + " remaining"), this.ct === 0 && r(u, t);
                },
                setError: function() {
                    o(u, arguments);
                }
            };
            for (a in e) e[a].resolver && (e[a].arg === "none" ? delete e[a] : f.ct++);
            try {
                for (a in e) e[a].resolver && i(e[a], t, f, a, s);
            } catch (l) {
                f.setError(u, l);
            }
        },
        property: function(t, i, o, a, f) {
            var l = o, c = [ t ], h = t.arg;
            e.isArray(h) || s.buildStack(t, c);
            var p = function(e, t) {
                return typeof e == "string" && u(i, e.replace(/th\(index\)/g, "th(" + i.index() + ")")) || t;
            }, d = function(e, t, n) {
                return function(r, i) {
                    e--, t[this.i] = p(i, i), e === 0 && n(t);
                };
            }, v = function(e, t) {
                var n, r = e.length, o = [], u = 0;
                while (e.length > 0) n = e.shift(), s.property(n, i, {
                    i: u++,
                    setVal: d(r, o, t),
                    setError: l.setError
                }, a, f);
            }, m = function(t) {
                if (!t || !t.pop) return;
                var s = t.pop();
                if (e.isArray(s.arg)) v(s.arg.slice(0), function(e) {
                    if (r[s.resolver]) try {
                        r[s.resolver](i, e, l, a, f);
                    } catch (t) {
                        l.setError(s.resolver, t);
                    } else n.error("unknown type resolver: '" + s.resolver + "'");
                }); else {
                    h = p(s.arg, h), l = t.length === 0 ? o : {
                        setVal: function(e, t) {
                            h = p(t, t), m();
                        },
                        setError: l.setError
                    };
                    if (r[s.resolver]) try {
                        r[s.resolver](i, [ h ], l, a, f);
                    } catch (u) {
                        l.setError(s.resolver, u);
                    } else n.error("unknown type resolver: '" + s.resolver + "' should it be in an array?");
                }
            };
            m(c);
        },
        buildStack: function(e, t) {
            e.arg.resolver && (t.push(e.arg), s.buildStack(e.arg, t));
        }
    }, o = e.now(), u = function(e, t) {
        return e.attr("id") || e.attr("id", "bess_" + o++), t.replace(":self", "#" + e.attr("id"));
    };
    return s;
}), define("src/stringscanner", [], function() {
    var e = {
        create: function(e) {
            var t = e;
            return {
                toString: function() {
                    return t;
                },
                current: "BEGIN",
                test: null,
                index: 0,
                tailIndex: t.length - 1,
                setIndex: function(e) {
                    return this.current = t[e], this.index = e, this;
                },
                readUntil: function(e) {
                    var n, r = 0, i = e.length ? e : [ e ];
                    for (this.index; this.index <= this.tailIndex; this.index++) {
                        n = t.charAt(this.index);
                        for (r = 0; r < i.length; r++) if (i[r] && i[r].test(n)) return this.current = n, this.test = i[r], this;
                    }
                    return this;
                },
                sniff: function(e) {
                    var n = t.substr(this.index, e.length);
                    return n === e ? (this.index += e.length, this.current = t.charAt(this.index), !0) : !1;
                },
                capture: function(e, n) {
                    return t.substring(e, n);
                },
                nextIndexOf: function(e) {
                    return t.indexOf(e, this.index);
                },
                tailIndexOf: function(e) {
                    return t.lastIndexOf(e, this.tailIndex);
                },
                peek: function(e) {
                    return t.charAt(this.index + (e || 1));
                },
                isDone: function(e) {
                    return this.index >= (e || this.tailIndex);
                },
                advance: function(e) {
                    return this.index = this.index + (e || 1), this.current = t.charAt(this.index), this;
                },
                skipWhitespace: function() {
                    return this.readUntil([ /\S/ ]), this;
                }
            };
        }
    };
    return e;
}()), define("src/bessvalueparser", [ "src/extendedjquery", "src/stringscanner", "src/modules", "src/typeresolvers", "src/logging" ], function(e, t, n, r, i) {
    var s = 0;
    return function(e) {
        var s = {
            isQuote: /\'/,
            isNumeric: /\d/,
            isSemi: /\;/,
            isOpenParen: /\(/,
            isCloseParen: /\)/,
            isOpenBrace: /\{/,
            isComma: /\,/,
            isColon: /\:/,
            isAtSymbol: /\@/,
            whiteSpace: /\s/,
            behavior: /^\-be\-([^\-]*)|^([a-z]*[A-z]*)/,
            pseudo: /\:/,
            pre: /\([^\)]+\)/,
            ids: /#[\d\w\-_]+/g,
            cls: /[\.:\[][^\.:\[+>]+/g,
            tag: /(^|[\s\+>])\w+/g
        };
        s.chop = [ s.ids, s.cls, s.tag ], "map" in Array.prototype || (Array.prototype.map = function(e, t) {
            var n = new Array(this.length);
            for (var r = 0, i = this.length; r < i; r++) r in this && (n[r] = e.call(t, this[r], r, this));
            return n;
        });
        var o = {
            calc: function(e) {
                return e = e.replace(s.pre, ""), parseInt(s.chop.map(function(t) {
                    var n = e.match(t);
                    return n ? n.length.toString(16) : 0;
                }).join(""), 16);
            }
        }, u = function(n, r) {
            var i = [], s = e.Deferred();
            return e.when(f(t.create(n), r)).then(function() {
                i = c(t.create(n), r), r && r.attr("bess_parsed", "true"), s.resolve(i);
            }), s.promise();
        }, a = function(t, s) {
            var o = e.Deferred();
            return require([ s ], function(e) {
                e ? t === "module" ? (i.debug("resolved module " + e.name + " at " + (new Date).getTime()), n.cache[e.name] = e) : t === "type" && (r[e.typeName] = e) : i.error("Unable to find " + t + " at " + s), o.resolve();
            }), o.promise();
        }, f = function(t, n) {
            var r = e.Deferred(), i = [], o;
            t.skipWhitespace(), t.isDone() && r.resolve(), l(t);
            if (t.current !== "@") r.resolve(); else {
                while (t.current === "@") t.advance(), t.sniff("import") && (t.skipWhitespace(), o = x(t), i.push(a(o, E(t))), t.advance().readUntil(s.isAtSymbol));
                e.when.apply(e, i).then(function() {
                    r.resolve();
                });
            }
            return r.promise();
        }, l = function(e) {
            if (e.current === "/" && e.peek() === "*") return e.setIndex(e.nextIndexOf("*/")).advance(2), e.skipWhitespace(), !0;
        }, c = function(e, t) {
            var n = [], r = null, s;
            e = h(e), e.skipWhitespace();
            if (e.isDone()) return n;
            l(e), s = p(d(e), t);
            while (s) s ? n = n.concat(s) : i.debug("No rule returned during parseRules loop."), s = p(d(e), t);
            return n;
        }, h = function(e) {
            return e.skipWhitespace(), e.sniff("@") ? (e.readUntil(s.isSemi).advance(), h(e)) : e;
        }, p = function(t, r) {
            if (!t) return;
            var i = {}, u, a, f = [];
            return e.each(t.declarations, function(e, t) {
                var n = e.match(s.behavior);
                if (n) {
                    var r = n[2] ? n[2] : n[1];
                    r && (i[r] = !0);
                }
            }), e.each(t.selectors, function(l) {
                var c = t.selectors[l];
                e.isEmptyObject(i) || (u = c.split(s.pseudo), a = {
                    pseudo: u.pop(),
                    select: u.join(":"),
                    boundFrom: r,
                    ruleId: t.pid
                }, a.score = o.calc(a.select), e.each(i, function(e) {
                    var r = n(e);
                    parsedRule = g(t.declarations, e, r.properties), f.push({
                        selector: a,
                        declaration: parsedRule,
                        module: e
                    });
                }));
            }), f;
        }, d = function(e, t) {
            var n, r = t || {
                selectors: [],
                pid: e.index
            };
            e.skipWhitespace(), l(e), n = e.skipWhitespace().index, e.readUntil([ s.isComma, s.isOpenBrace ]);
            if (e.current === ",") return v(r, e.capture(n, e.index)), e.advance(), d(e, r);
            if (e.current === "{") return v(r, e.capture(n, e.index)), e.advance(), r.declarations = m(e, {}), r;
            return;
        }, v = function(t, n) {
            n.match(/\)/g) && !n.match(/\(/g) ? t.selectors[t.selectors.length - 1] += ", " + n : t.selectors.push(e.trim(n));
        }, m = function(e, t) {
            var n, r = e.skipWhitespace().index;
            return l(e) ? m(e, t) : (e.current !== "}" ? (e.readUntil(s.isColon), n = e.capture(r, e.index), r = e.advance().skipWhitespace().index, e.readUntil(s.isSemi), t[n] = e.capture(r, e.index), e.advance(), m(e, t)) : e.advance(), t);
        }, g = function(n, r, i) {
            var s = {}, o = n, u = n[r];
            u && (o = e.extend({}, y(u, r, i), n));
            var a = function(n) {
                var i = r + "-" + n, u = o[i];
                u && (s[n] = e.isPlainObject(u) ? u : b(t.create(u))[0]);
            };
            return e.each(i, function(e, t) {
                a(t);
            }), s;
        }, y = function(e, n, r) {
            var i = b(t.create(e), !0), s = 0, o = 0, u = {};
            for (var a = 0; a < i.length; a++) a < r.length && (u[n + "-" + r[o]] = {}), i[a].x && (o = 0, s++), u[n + "-" + r[o]][s + ""] = i[a], o++;
            return u;
        }, b = function(e, t) {
            var n, r = [], i = 0, s = {};
            for (i; ; i++) {
                n = w(e);
                if (!n) return r;
                s[i] = n, r.push(t ? n : s);
            }
        }, w = function(e) {
            var t;
            if (!e.skipWhitespace().isDone()) {
                if (e.current === "'") return {
                    resolver: "string",
                    arg: E(e)
                };
                if (s.isNumeric.test(e.current)) return {
                    resolver: "number",
                    arg: S(e)
                };
                if (s.isComma.test(e.current)) return t = w(e.advance()), t.x = !0, t;
                var n = {
                    resolver: x(e),
                    arg: []
                };
                if (s.isCloseParen.test(e.current)) return e.advance(), n;
                t = w(e, !0);
                while (t) {
                    n.arg.push(t), e.skipWhitespace().advance();
                    if (!s.isComma.test(e.peek(-1))) break;
                    t = w(e, !0);
                }
                return n;
            }
        }, E = function(e) {
            var t = e.capture(e.advance().index, e.readUntil(s.isQuote).index);
            return e.advance(), t;
        }, S = function(e) {
            var t = e.capture(e.index, e.readUntil([ s.whiteSpace, s.isSemi ]).index);
            return e.advance(), t;
        }, x = function(e) {
            var t = e.capture(e.index, e.readUntil([ s.isOpenParen ]).index);
            return e.advance(), t;
        }, T = {}, N = function(t, n, r) {
            var s = [], o = 0, a = 0, f, l, c;
            window.localStorage || (window.localStorage = {});
            var h = function(t, n) {
                var r = e.Deferred();
                return o--, !n || !e(n).attr("bess_parsed") ? u(t, n).done(function(e) {
                    s = s.concat(e), r.resolve();
                }) : r.resolve(), r.promise();
            }, p = function(e, t) {
                h(e, t).done(d);
            }, d = function() {
                o === 0 && t && t(s);
            };
            return T = r || {}, n ? (o += n.length, e.each(n, function(t, n) {
                e.get(n, p, "text");
            })) : (f = e('link[type="text/bess"]'), o += f.length, l = e('style[type="text/bess"]'), o += l.length, i.debug("BESS found " + o + " sheets to parse."), f.each(function() {
                var t = this;
                i.debug("BESS parsing link tag."), !this.disabled && !/^\w+:/.test(e(this).attr("href")) && mediumApplies(this.media) && !e(this).attr("bess_loaded") ? (e(this).attr("bess_loaded", "true"), e.get(this.href, function(e) {
                    p(e, t);
                }, "text")) : e(this).attr("bess_loaded") && (i.debug("Link tag found bess_loaded already."), p("", t));
            }), l.each(function() {
                i.debug("BESS parsing style tag."), p(this.innerHTML, this);
            })), this;
        };
        mediumApplies = window.media && window.media.query || function(t) {
            if (!t) return !0;
            if (t in T) return T[t];
            var n = e('<style media="' + t + '">body {position: relative; z-index: 1;}</style>').appendTo("head");
            return T[t] = [ e("body").css("z-index") == 1, n.remove() ][0];
        };
        var C = function(e, t) {
            var n = [];
            return u(e, t).done(function(e) {
                n = e;
            }), n;
        };
        return {
            parse: C,
            loadAndParse: N
        };
    }(e);
}), define("src/behavior", [ "src/extendedjquery", "lib/pagebus", "src/modules", "src/dommod", "src/typeresolvers", "src/typeresolverengine", "src/bessvalueparser", "src/logging" ], function(e, t, n, r, i, s, o, u) {
    n.setModifier(r);
    var a = [], f = function(t, n) {
        o.loadAndParse(function(r) {
            e.each(r, function(e) {
                a.push(e.selector.select);
            }), window.bessRules = window.bessRules.concat(r), E(t, window.bessRules, !n);
        });
    }, l = i, c = function(e) {
        return e.sort(function(e, t) {
            return e.selector.score > t.selector.score ? 1 : e.selector.score < t.selector.score ? -1 : 0;
        });
    }, h = function(e, t, n) {
        n.queue("pseudo", [ function() {
            n.trigger("pre-" + e).dequeue("pseudo");
        }, function() {
            t(), n.dequeue("pseudo");
        }, function() {
            n.trigger("post-" + e).dequeue("pseudo");
        } ]), n.dequeue("pseudo");
    };
    window.localStorage || (window.localStorage = {}), t.subscribe("document.scan", null, function(e, t) {
        f(t.context, t.isLocal);
    }), t.subscribe("document.inserted.children", null, function(t, n) {
        var r, i, s, o = n.context;
        s = o.find("*").filter(a.join(","));
        for (r = 0; r < s.length; r++) i = new e.Event("html-inserted"), i.preventDefault(), u.debug("Triggering html-inserted."), e(s[r]).trigger(i);
        u.debug("Triggering html-modified."), o.trigger("html-modified");
    });
    var p = {
        clicked: "click",
        changed: "change",
        blurred: "focusout",
        validated: "submit"
    }, d = function(t) {
        var n = p[t] ? p[t] : t;
        return t == "transitioned" && (e.browser.webkit ? n = "webkitTransitionEnd" : e.browser.opera ? n = "oTransitionEnd" : e.browser.mozilla ? n = "transitionend" : n = "transitionend"), n;
    }, v = function(t, n) {
        t.preventDefault(), t.actionable || (t.actionable = [], t.actionableIds = [], t.target = t.currentTarget || t.target), e.inArray(t.data.module + ":" + t.data.selector.ruleId, t.actionableIds) === -1 && (t.message = n, t.actionable.push(t.data), t.actionableIds.push(t.data.module + ":" + t.data.selector.ruleId));
    }, m = {}, g = {}, y = function(e) {
        var t = {}, n = null, r = null;
        for (n in e) {
            var i = e[n];
            for (r in i) t[r] = !0;
        }
        return t;
    }, b = function(e) {
        var t = [], n, r = y(e), i = null;
        for (i in r) {
            n = {};
            for (var s in e) {
                if (!e[s][i]) return t;
                n[s] = e[s][i];
            }
            t.push(n);
        }
        return t;
    }, w = function(r) {
        var i = r.selector.pseudo, o = r.selector;
        i.split(/\./).length > 1 && (g[i] ? g[i][o.select] || g[i].push(o.select) : (g[i] = [ o.select ], t.subscribe(i, null, function(t, n) {
            var r = e(g[i].join(",")).toArray(), s = [], o = 0;
            u.debug("triggering " + i + " from subscription...");
            for (; o < r.length; o++) e(r[o]).has(r.slice(o + 1)).length === 0 && s.push(r[o]);
            e(s).trigger(i, n);
        })));
        var a = d(i);
        e(r.selector.select).live(a, r, v), m[a] || (e(document).bind(a, function(t) {
            var r = {}, a, f = {};
            if (t.actionable) {
                if (t.type === "html-inserted") {
                    if (t.target.bess_dom_inserted) return !1;
                    t.target.bess_dom_inserted = !0;
                }
                if (t.type === "html-modified" && t.currentTarget !== t.target) {
                    u.debug("bailing... html-modified current target:" + t.currentTarget.tagName + " - target:" + t.target.tagName);
                    return;
                }
                t.type === "html-inserted" && t.currentTarget !== t.target ? (u.debug("switching... html-inserted current target:" + t.currentTarget + " - target:" + t.target), t.currentTarget = t.target) : t.type === "submit" && t.target.tagName && t.target.tagName === "BUTTON" && (t.target = t.currentTarget);
                for (var l = 0; l < t.actionable.length; l++) a = t.actionable[l], u.debug("handling " + a.selector.select + " " + o.pseudo), r[a.module] = r[a.module] || {}, a.selector.pseudo == i && (e(t.target).is(a.selector.select) || e(t.currentTarget).is(a.selector.select)) && e.extend(r[a.module], a.declaration), f[a.selector.select] = !0;
                u.debug("merged:" + JSON.stringify(r, null, 4));
                var c = e(t.currentTarget);
                h(i, function() {
                    for (var i in r) {
                        var a = new n(i);
                        if (a) {
                            u.debug("resolving module..." + i);
                            var f = b(r[i]);
                            for (l = 0; l < f.length; l++) {
                                var h = e.extend({}, a.defaults, f[l]);
                                s.properties(h, c, a.apply, t.message, function(e, t) {
                                    u.error("Problem resolving: " + t[0] + "\n\n- " + t[1].message + "\n\n- in " + JSON.stringify(h)), e.topic ? c.trigger("error") : e.target && e.target.trigger("error");
                                });
                            }
                        } else u.error('Ignoring unknown module "' + i + '" in "' + o.select + ":" + o.pseudo + '"');
                    }
                }, c);
            }
        }), m[a] = !0);
    }, E = function(t, n, r) {
        t || (t = e(document)), c(n), e.each(n, function(e, n) {
            w(n, t), r && /html-inserted$/.test(n.selector.pseudo) && a.push(n.selector.select);
        });
        if (r) {
            u.debug("triggering html-inserted globally...");
            var i = function() {
                setTimeout(function() {
                    e(a.join(",")).trigger("html-inserted");
                }, 1);
            };
            e.isReady ? i() : e.ready(i);
        }
    };
    return {
        "::": l,
        ":": n.cache,
        process: E,
        init: f
    };
}), define("src/bess.js", [ "src/extendedjquery", "src/behavior", "src/bessvalueparser", "src/modules", "src/logging" ], function(e, t, n, r, i) {
    var s = function() {
        n.loadAndParse(function(e) {
            i.debug("BESS go parse found " + e.length + " rules."), window.bessRules = bessRules.concat(e), t.init();
        });
    };
    return n.loadAndParse(function(t) {
        i.debug("BESS early parse found " + t.length + " rules."), window.bessRules = t, e.isReady ? s() : e(document).ready(s);
    }), {
        parser: n,
        engine: t,
        resolvers: r.resolvers
    };
});;