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
}), define("src/modules", [ "src/extendedjquery", "lib/mustache", "src/logging" ], function(e, t, n) {
    var r = function(e) {
        return {
            resolver: "string",
            arg: e || ""
        };
    }, i = function(e) {
        return {
            resolver: "find",
            arg: [ r(e || ":self") ]
        };
    }, s = function(e) {
        return {
            resolver: "obj",
            arg: e || "{}"
        };
    }, o = {
        effect: {
            properties: [ "name", "target", "duration", "easing", "relative" ],
            defaults: {
                target: i(),
                duration: r("slow"),
                easing: r("swing"),
                relative: i()
            },
            apply: function(t, n) {
                var r, i = t.target.length, s = t.name.split(","), o = function(e, t, n, r) {
                    return function() {
                        e && --e === 0 && n.target.trigger("post-" + r);
                    };
                };
                i === 0 && n.dequeue("pseudo"), n.queue("pseudo").unshift(e.noop);
                for (var u = 0; u < s.length; u++) r = e.trim(s[u]), t.target[r](t.duration, t.easing, o(i, n, t, r), t.relative);
            }
        },
        "class": {
            properties: [ "op", "name", "target" ],
            defaults: {
                op: "toggle",
                target: i()
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
                target: i(),
                source: {
                    resolver: "html",
                    arg: i()
                },
                op: {
                    resolver: "string",
                    arg: "replaceContent"
                }
            },
            apply: function(n, r) {
                var i, s, o, a;
                i = [ "append", "replaceContent", "prepend", "replaceWith", "wrapInner", "wrap" ], s = n.id || n.source, o = -1 < e.inArray(n.op, i) ? s : null, s ? (r.queue("pseudo").unshift(e.noop), a = t.to_html(o, n.data, {}), u(n.op, a, n.target), r.dequeue("pseudo")) : u(n.op, o, n.target);
            }
        }
    }, u = function(e, t, r, i) {
        n.debug("Default Modifier called within Modules."), i && i();
    }, a = function(e) {
        return o[e];
    };
    return a.resolvers = {
        str: r,
        find: i,
        obj: s
    }, a.setModifier = function(e) {
        u = e;
    }, a.cache = o, a;
}), define("src/dommod", [ "src/extendedjquery", "src/logging" ], function(e, t) {
    var n = function(n) {
        var r, i, s;
        s = n.find("*").filter(Bess.engine.domInsertRules.join(","));
        for (r = 0; r < s.length; r++) i = new e.Event("html-inserted"), i.preventDefault(), t.debug("Triggering html-inserted."), e(s[r]).trigger(i);
        t.debug("Triggering html-modified."), n.trigger("html-modified");
    };
    return mod = function(r, s, o, u) {
        var a, f, l, c;
        if (r == "replaceContent" || r === "remove" || r === "empty") {
            a = e("*", o), l = a.filter('[bess_parsed="true"]');
            for (i = 0; i < l.length; i++) {
                f = l[i];
                for (c = bessRules.length - 1; c >= 0; c--) bessRules[c].selector.boundFrom === f && bessRules.splice(c, 1);
            }
            if (r === "replaceContent") o.empty(), r = "append"; else if (r === "remove" || r === "empty") {
                o[r](), t.debug("Triggering html-modified..."), o.trigger("html-modified");
                return;
            }
        }
        e.browser.msie ? (id = e.now(), d = document.createElement("div"), d.id = "temp" + id, d.style.display = "none", document.body.appendChild(d), d = document.getElementById("temp" + id), d.innerHTML = s, o[r](e(d.childNodes)), document.body.removeChild(d)) : o[r](s), Bess.engine.init(o, !0), n(o);
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
            return e.when(l(t.create(n), r)).then(function() {
                i = h(t.create(n), r), r && e(r).attr("bess_parsed", "true"), s.resolve(i);
            }), s.promise();
        }, a = function(e) {
            i.debug("resolved " + e.type + '"' + e.name + '" at ' + (new Date).getTime()), e.type === "module" ? n.cache[e.name] = e : e.type === "type" && (r[e.typeName] = e);
        }, f = function(t, n) {
            var r = e.Deferred(), s;
            return require([ n ], function(e) {
                if (e) if (t === "package") for (s = 0; s < e.length; s++) a(e[s]); else e.type = t, a(e); else i.error("Unable to find " + t + " at " + n);
                r.resolve();
            }), r.promise();
        }, l = function(t, n) {
            var r = e.Deferred(), i = [], o;
            t.skipWhitespace(), t.isDone() && r.resolve(), c(t);
            if (t.current !== "@") r.resolve(); else {
                while (t.current === "@") t.advance(), t.sniff("import") && (t.skipWhitespace(), o = T(t), i.push(f(o, S(t))), t.advance().readUntil(s.isAtSymbol));
                e.when.apply(e, i).then(function() {
                    r.resolve();
                });
            }
            return r.promise();
        }, c = function(e) {
            if (e.current === "/" && e.peek() === "*") return e.setIndex(e.nextIndexOf("*/")).advance(2), e.skipWhitespace(), !0;
        }, h = function(e, t) {
            var n = [], r = null, s;
            e = p(e), e.skipWhitespace();
            if (e.isDone()) return n;
            c(e), s = d(v(e), t);
            while (s) s ? n = n.concat(s) : i.debug("No rule returned during parseRules loop."), s = d(v(e), t);
            return n;
        }, p = function(e) {
            return e.skipWhitespace(), e.sniff("@") ? (e.readUntil(s.isSemi).advance(), p(e)) : e;
        }, d = function(t, r) {
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
                    parsedRule = y(t.declarations, e, r.properties), f.push({
                        selector: a,
                        declaration: parsedRule,
                        module: e
                    });
                }));
            }), f;
        }, v = function(e, t) {
            var n, r = t || {
                selectors: [],
                pid: e.index
            };
            e.skipWhitespace(), c(e), n = e.skipWhitespace().index, e.readUntil([ s.isComma, s.isOpenBrace ]);
            if (e.current === ",") return m(r, e.capture(n, e.index)), e.advance(), v(e, r);
            if (e.current === "{") return m(r, e.capture(n, e.index)), e.advance(), r.declarations = g(e, {}), r;
            return;
        }, m = function(t, n) {
            n.match(/\)/g) && !n.match(/\(/g) ? t.selectors[t.selectors.length - 1] += ", " + n : t.selectors.push(e.trim(n));
        }, g = function(e, t) {
            var n, r = e.skipWhitespace().index;
            return c(e) ? g(e, t) : (e.current !== "}" ? (e.readUntil(s.isColon), n = e.capture(r, e.index), r = e.advance().skipWhitespace().index, e.readUntil(s.isSemi), t[n] = e.capture(r, e.index), e.advance(), g(e, t)) : e.advance(), t);
        }, y = function(n, r, i) {
            var s = {}, o = n, u = n[r];
            u && (o = e.extend({}, b(u, r, i), n));
            var a = function(n) {
                var i = r + "-" + n, u = o[i];
                u && (s[n] = e.isPlainObject(u) ? u : w(t.create(u))[0]);
            };
            return e.each(i, function(e, t) {
                a(t);
            }), s;
        }, b = function(e, n, r) {
            var i = w(t.create(e), !0), s = 0, o = 0, u = {};
            for (var a = 0; a < i.length; a++) a < r.length && (u[n + "-" + r[o]] = {}), i[a].x && (o = 0, s++), u[n + "-" + r[o]][s + ""] = i[a], o++;
            return u;
        }, w = function(e, t) {
            var n, r = [], i = 0, s = {};
            for (i; ; i++) {
                n = E(e);
                if (!n) return r;
                s[i] = n, r.push(t ? n : s);
            }
        }, E = function(e) {
            var t;
            if (!e.skipWhitespace().isDone()) {
                if (e.current === "'") return {
                    resolver: "string",
                    arg: S(e)
                };
                if (s.isNumeric.test(e.current)) return {
                    resolver: "number",
                    arg: x(e)
                };
                if (s.isComma.test(e.current)) return t = E(e.advance()), t.x = !0, t;
                var n = {
                    resolver: T(e),
                    arg: []
                };
                if (s.isCloseParen.test(e.current)) return e.advance(), n;
                t = E(e, !0);
                while (t) {
                    n.arg.push(t), e.skipWhitespace().advance();
                    if (!s.isComma.test(e.peek(-1))) break;
                    t = E(e, !0);
                }
                return n;
            }
        }, S = function(e) {
            var t = e.capture(e.advance().index, e.readUntil(s.isQuote).index);
            return e.advance(), t;
        }, x = function(e) {
            var t = e.capture(e.index, e.readUntil([ s.whiteSpace, s.isSemi ]).index);
            return e.advance(), t;
        }, T = function(e) {
            var t = e.capture(e.index, e.readUntil([ s.isOpenParen ]).index);
            return e.advance(), t;
        }, N = {}, C = function(t, n, r) {
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
            return N = r || {}, n ? (o += n.length, e.each(n, function(t, n) {
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
            if (t in N) return N[t];
            var n = e('<style media="' + t + '">body {position: relative; z-index: 1;}</style>').appendTo("head");
            return N[t] = [ e("body").css("z-index") == 1, n.remove() ][0];
        };
        var k = function(e, t) {
            var n = [];
            return u(e, t).done(function(e) {
                n = e;
            }), n;
        };
        return {
            parse: k,
            loadAndParse: C
        };
    }(e);
}), define("src/behavior", [ "src/extendedjquery", "src/modules", "src/dommod", "src/typeresolvers", "src/typeresolverengine", "src/bessvalueparser", "src/logging" ], function(e, t, n, r, i, s, o) {
    t.setModifier(n);
    var u = [], a = function(t, n) {
        s.loadAndParse(function(r) {
            e.each(r, function(e) {
                u.push(e.selector.select);
            }), window.bessRules = window.bessRules.concat(r), w(t, window.bessRules, !n);
        });
    }, f = r, l = function(e) {
        return e.sort(function(e, t) {
            return e.selector.score > t.selector.score ? 1 : e.selector.score < t.selector.score ? -1 : 0;
        });
    }, c = function(e, t, n) {
        n.queue("pseudo", [ function() {
            n.trigger("pre-" + e).dequeue("pseudo");
        }, function() {
            t(), n.dequeue("pseudo");
        }, function() {
            n.trigger("post-" + e).dequeue("pseudo");
        } ]), n.dequeue("pseudo");
    };
    window.localStorage || (window.localStorage = {});
    var h = {
        clicked: "click",
        changed: "change",
        blurred: "focusout",
        validated: "submit"
    }, p = function(t) {
        var n = h[t] ? h[t] : t;
        return t == "transitioned" && (e.browser.webkit ? n = "webkitTransitionEnd" : e.browser.opera ? n = "oTransitionEnd" : e.browser.mozilla ? n = "transitionend" : n = "transitionend"), n;
    }, d = function(t, n) {
        t.preventDefault(), t.actionable || (t.actionable = [], t.actionableIds = [], t.target = t.currentTarget || t.target), e.inArray(t.data.module + ":" + t.data.selector.ruleId, t.actionableIds) === -1 && (t.message = n, t.actionable.push(t.data), t.actionableIds.push(t.data.module + ":" + t.data.selector.ruleId));
    }, v = {}, m = {}, g = function(e) {
        var t = {}, n = null, r = null;
        for (n in e) {
            var i = e[n];
            for (r in i) t[r] = !0;
        }
        return t;
    }, y = function(e) {
        var t = [], n, r = g(e), i = null;
        for (i in r) {
            n = {};
            for (var s in e) {
                if (!e[s][i]) return t;
                n[s] = e[s][i];
            }
            t.push(n);
        }
        return t;
    }, b = function(n) {
        var r = n.selector.pseudo, s = n.selector, u = p(r);
        e(n.selector.select).live(u, n, d), v[u] || (e(document).bind(u, function(n) {
            var u = {}, a, f = {};
            if (n.actionable) {
                if (n.type === "html-inserted") {
                    if (n.target.bess_dom_inserted) return !1;
                    n.target.bess_dom_inserted = !0;
                }
                if (n.type === "html-modified" && n.currentTarget !== n.target) {
                    o.debug("bailing... html-modified current target:" + n.currentTarget.tagName + " - target:" + n.target.tagName);
                    return;
                }
                n.type.indexOf("post-") !== -1 ? n.currentTarget = n.target : n.type === "html-inserted" && n.currentTarget !== n.target ? (o.debug("switching... html-inserted current target:" + n.currentTarget + " - target:" + n.target), n.currentTarget = n.target) : n.type === "submit" && n.target.tagName && n.target.tagName === "BUTTON" && (n.target = n.currentTarget);
                for (var l = 0; l < n.actionable.length; l++) a = n.actionable[l], o.debug("handling " + a.selector.select + " " + s.pseudo), u[a.module] = u[a.module] || {}, a.selector.pseudo == r && (e(n.target).is(a.selector.select) || e(n.currentTarget).is(a.selector.select)) && e.extend(u[a.module], a.declaration), f[a.selector.select] = !0;
                o.debug("merged:" + JSON.stringify(u, null, 4));
                var h = e(n.currentTarget);
                c(r, function() {
                    for (var r in u) {
                        var a = new t(r);
                        if (a) {
                            o.debug("resolving module..." + r);
                            var f = y(u[r]);
                            for (l = 0; l < f.length; l++) {
                                var c = e.extend({}, a.defaults, f[l]);
                                i.properties(c, h, a.apply, n.message, function(e, t) {
                                    o.error("Problem resolving: " + t[0] + "\n\n- " + t[1].message + "\n\n- in " + JSON.stringify(c)), e.topic ? h.trigger("error") : e.target && e.target.trigger("error");
                                });
                            }
                        } else o.error('Ignoring unknown module "' + r + '" in "' + s.select + ":" + s.pseudo + '"');
                    }
                }, h);
            }
        }), v[u] = !0);
    }, w = function(t, n, r) {
        t || (t = e(document)), l(n), e.each(n, function(e, n) {
            b(n, t), r && /html-inserted$/.test(n.selector.pseudo) && u.push(n.selector.select);
        });
        if (r) {
            o.debug("triggering html-inserted globally...");
            var i = function() {
                setTimeout(function() {
                    e(u.join(",")).trigger("html-inserted");
                }, 1);
            };
            e.isReady ? i() : e.ready(i);
        }
    };
    return {
        domInsertRules: u,
        "::": f,
        ":": t.cache,
        process: w,
        init: a
    };
}), define("src/bess.js", [ "src/extendedjquery", "src/behavior", "src/bessvalueparser", "src/modules", "src/logging" ], function(e, t, n, r, i) {
    var s = function() {
        n.loadAndParse(function(e) {
            i.debug("BESS go parse found " + e.length + " rules."), window.bessRules = bessRules.concat(e), t.init();
        });
    };
    return n.loadAndParse(function(t) {
        i.debug("BESS early parse found " + t.length + " rules."), window.bessRules = t, e.isReady ? s() : e(document).ready(s);
    }), Bess = {
        parser: n,
        engine: t,
        resolvers: r.resolvers
    }, Bess;
});;