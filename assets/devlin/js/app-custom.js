window.showSlide = e=>{
    Je(e)
}
;
window.addEventListener("hashchange", Qe);
Qe();
function Qe() {
    const e = "#slide"
      , n = window.location.hash;
    if (n.startsWith(e)) {
        const t = n.substring(e.length);
        Je(parseInt(t) - 1)
    }
}
function Je(e) {
    const n = document.querySelectorAll(".slider-viewport li");
    for (let a = 0; a < n.length; a++)
        n[a].style.display = e === a ? "block" : "none";
    const t = document.querySelectorAll(".slider-navigation li");
    for (let a = 0; a < t.length; a++)
        e === a ? t[a].classList.add("active") : t[a].classList.remove("active")
}
var Ae = {
    exports: {}
};
function Me(e) {
    return e instanceof Map ? e.clear = e.delete = e.set = function() {
        throw new Error("map is read-only")
    }
    : e instanceof Set && (e.add = e.clear = e.delete = function() {
        throw new Error("set is read-only")
    }
    ),
    Object.freeze(e),
    Object.getOwnPropertyNames(e).forEach(function(n) {
        var t = e[n];
        typeof t == "object" && !Object.isFrozen(t) && Me(t)
    }),
    e
}
Ae.exports = Me;
Ae.exports.default = Me;
class Pe {
    constructor(n) {
        n.data === void 0 && (n.data = {}),
        this.data = n.data,
        this.isMatchIgnored = !1
    }
    ignoreMatch() {
        this.isMatchIgnored = !0
    }
}
function je(e) {
    return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;")
}
function q(e, ...n) {
    const t = Object.create(null);
    for (const a in e)
        t[a] = e[a];
    return n.forEach(function(a) {
        for (const c in a)
            t[c] = a[c]
    }),
    t
}
const On = "</span>"
  , $e = e=>!!e.scope || e.sublanguage && e.language
  , Rn = (e,{prefix: n})=>{
    if (e.includes(".")) {
        const t = e.split(".");
        return [`${n}${t.shift()}`, ...t.map((a,c)=>`${a}${"_".repeat(c + 1)}`)].join(" ")
    }
    return `${n}${e}`
}
;
class vn {
    constructor(n, t) {
        this.buffer = "",
        this.classPrefix = t.classPrefix,
        n.walk(this)
    }
    addText(n) {
        this.buffer += je(n)
    }
    openNode(n) {
        if (!$e(n))
            return;
        let t = "";
        n.sublanguage ? t = `language-${n.language}` : t = Rn(n.scope, {
            prefix: this.classPrefix
        }),
        this.span(t)
    }
    closeNode(n) {
        $e(n) && (this.buffer += On)
    }
    value() {
        return this.buffer
    }
    span(n) {
        this.buffer += `<span class="${n}">`
    }
}
const Fe = (e={})=>{
    const n = {
        children: []
    };
    return Object.assign(n, e),
    n
}
;
class we {
    constructor() {
        this.rootNode = Fe(),
        this.stack = [this.rootNode]
    }
    get top() {
        return this.stack[this.stack.length - 1]
    }
    get root() {
        return this.rootNode
    }
    add(n) {
        this.top.children.push(n)
    }
    openNode(n) {
        const t = Fe({
            scope: n
        });
        this.add(t),
        this.stack.push(t)
    }
    closeNode() {
        if (this.stack.length > 1)
            return this.stack.pop()
    }
    closeAllNodes() {
        for (; this.closeNode(); )
            ;
    }
    toJSON() {
        return JSON.stringify(this.rootNode, null, 4)
    }
    walk(n) {
        return this.constructor._walk(n, this.rootNode)
    }
    static _walk(n, t) {
        return typeof t == "string" ? n.addText(t) : t.children && (n.openNode(t),
        t.children.forEach(a=>this._walk(n, a)),
        n.closeNode(t)),
        n
    }
    static _collapse(n) {
        typeof n != "string" && n.children && (n.children.every(t=>typeof t == "string") ? n.children = [n.children.join("")] : n.children.forEach(t=>{
            we._collapse(t)
        }
        ))
    }
}
class An extends we {
    constructor(n) {
        super(),
        this.options = n
    }
    addKeyword(n, t) {
        n !== "" && (this.openNode(t),
        this.addText(n),
        this.closeNode())
    }
    addText(n) {
        n !== "" && this.add(n)
    }
    addSublanguage(n, t) {
        const a = n.root;
        a.sublanguage = !0,
        a.language = t,
        this.add(a)
    }
    toHTML() {
        return new vn(this,this.options).value()
    }
    finalize() {
        return !0
    }
}
function se(e) {
    return e ? typeof e == "string" ? e : e.source : null
}
function en(e) {
    return j("(?=", e, ")")
}
function Mn(e) {
    return j("(?:", e, ")*")
}
function wn(e) {
    return j("(?:", e, ")?")
}
function j(...e) {
    return e.map(t=>se(t)).join("")
}
function In(e) {
    const n = e[e.length - 1];
    return typeof n == "object" && n.constructor === Object ? (e.splice(e.length - 1, 1),
    n) : {}
}
function Ie(...e) {
    return "(" + (In(e).capture ? "" : "?:") + e.map(a=>se(a)).join("|") + ")"
}
function nn(e) {
    return new RegExp(e.toString() + "|").exec("").length - 1
}
function Cn(e, n) {
    const t = e && e.exec(n);
    return t && t.index === 0
}
const Ln = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;
function Ce(e, {joinWith: n}) {
    let t = 0;
    return e.map(a=>{
        t += 1;
        const c = t;
        let l = se(a)
          , r = "";
        for (; l.length > 0; ) {
            const s = Ln.exec(l);
            if (!s) {
                r += l;
                break
            }
            r += l.substring(0, s.index),
            l = l.substring(s.index + s[0].length),
            s[0][0] === "\\" && s[1] ? r += "\\" + String(Number(s[1]) + c) : (r += s[0],
            s[0] === "(" && t++)
        }
        return r
    }
    ).map(a=>`(${a})`).join(n)
}
const xn = /\b\B/
  , tn = "[a-zA-Z]\\w*"
  , Le = "[a-zA-Z_]\\w*"
  , an = "\\b\\d+(\\.\\d+)?"
  , sn = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)"
  , rn = "\\b(0b[01]+)"
  , Dn = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~"
  , kn = (e={})=>{
    const n = /^#![ ]*\//;
    return e.binary && (e.begin = j(n, /.*\b/, e.binary, /\b.*/)),
    q({
        scope: "meta",
        begin: n,
        end: /$/,
        relevance: 0,
        "on:begin": (t,a)=>{
            t.index !== 0 && a.ignoreMatch()
        }
    }, e)
}
  , ie = {
    begin: "\\\\[\\s\\S]",
    relevance: 0
}
  , Bn = {
    scope: "string",
    begin: "'",
    end: "'",
    illegal: "\\n",
    contains: [ie]
}
  , Un = {
    scope: "string",
    begin: '"',
    end: '"',
    illegal: "\\n",
    contains: [ie]
}
  , Pn = {
    begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
}
  , fe = function(e, n, t={}) {
    const a = q({
        scope: "comment",
        begin: e,
        end: n,
        contains: []
    }, t);
    a.contains.push({
        scope: "doctag",
        begin: "[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",
        end: /(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,
        excludeBegin: !0,
        relevance: 0
    });
    const c = Ie("I", "a", "is", "so", "us", "to", "at", "if", "in", "it", "on", /[A-Za-z]+['](d|ve|re|ll|t|s|n)/, /[A-Za-z]+[-][a-z]+/, /[A-Za-z][a-z]{2,}/);
    return a.contains.push({
        begin: j(/[ ]+/, "(", c, /[.]?[:]?([.][ ]|[ ])/, "){3}")
    }),
    a
}
  , $n = fe("//", "$")
  , Fn = fe("/\\*", "\\*/")
  , Kn = fe("#", "$")
  , Hn = {
    scope: "number",
    begin: an,
    relevance: 0
}
  , zn = {
    scope: "number",
    begin: sn,
    relevance: 0
}
  , Gn = {
    scope: "number",
    begin: rn,
    relevance: 0
}
  , Wn = {
    begin: /(?=\/[^/\n]*\/)/,
    contains: [{
        scope: "regexp",
        begin: /\//,
        end: /\/[gimuy]*/,
        illegal: /\n/,
        contains: [ie, {
            begin: /\[/,
            end: /\]/,
            relevance: 0,
            contains: [ie]
        }]
    }]
}
  , Zn = {
    scope: "title",
    begin: tn,
    relevance: 0
}
  , Yn = {
    scope: "title",
    begin: Le,
    relevance: 0
}
  , qn = {
    begin: "\\.\\s*" + Le,
    relevance: 0
}
  , Xn = function(e) {
    return Object.assign(e, {
        "on:begin": (n,t)=>{
            t.data._beginMatch = n[1]
        }
        ,
        "on:end": (n,t)=>{
            t.data._beginMatch !== n[1] && t.ignoreMatch()
        }
    })
};
var de = Object.freeze({
    __proto__: null,
    MATCH_NOTHING_RE: xn,
    IDENT_RE: tn,
    UNDERSCORE_IDENT_RE: Le,
    NUMBER_RE: an,
    C_NUMBER_RE: sn,
    BINARY_NUMBER_RE: rn,
    RE_STARTERS_RE: Dn,
    SHEBANG: kn,
    BACKSLASH_ESCAPE: ie,
    APOS_STRING_MODE: Bn,
    QUOTE_STRING_MODE: Un,
    PHRASAL_WORDS_MODE: Pn,
    COMMENT: fe,
    C_LINE_COMMENT_MODE: $n,
    C_BLOCK_COMMENT_MODE: Fn,
    HASH_COMMENT_MODE: Kn,
    NUMBER_MODE: Hn,
    C_NUMBER_MODE: zn,
    BINARY_NUMBER_MODE: Gn,
    REGEXP_MODE: Wn,
    TITLE_MODE: Zn,
    UNDERSCORE_TITLE_MODE: Yn,
    METHOD_GUARD: qn,
    END_SAME_AS_BEGIN: Xn
});
function Vn(e, n) {
    e.input[e.index - 1] === "." && n.ignoreMatch()
}
function Qn(e, n) {
    e.className !== void 0 && (e.scope = e.className,
    delete e.className)
}
function Jn(e, n) {
    n && e.beginKeywords && (e.begin = "\\b(" + e.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)",
    e.__beforeBegin = Vn,
    e.keywords = e.keywords || e.beginKeywords,
    delete e.beginKeywords,
    e.relevance === void 0 && (e.relevance = 0))
}
function jn(e, n) {
    Array.isArray(e.illegal) && (e.illegal = Ie(...e.illegal))
}
function et(e, n) {
    if (e.match) {
        if (e.begin || e.end)
            throw new Error("begin & end are not supported with match");
        e.begin = e.match,
        delete e.match
    }
}
function nt(e, n) {
    e.relevance === void 0 && (e.relevance = 1)
}
const tt = (e,n)=>{
    if (!e.beforeMatch)
        return;
    if (e.starts)
        throw new Error("beforeMatch cannot be used with starts");
    const t = Object.assign({}, e);
    Object.keys(e).forEach(a=>{
        delete e[a]
    }
    ),
    e.keywords = t.keywords,
    e.begin = j(t.beforeMatch, en(t.begin)),
    e.starts = {
        relevance: 0,
        contains: [Object.assign(t, {
            endsParent: !0
        })]
    },
    e.relevance = 0,
    delete t.beforeMatch
}
  , at = ["of", "and", "for", "in", "not", "or", "if", "then", "parent", "list", "value"]
  , st = "keyword";
function cn(e, n, t=st) {
    const a = Object.create(null);
    return typeof e == "string" ? c(t, e.split(" ")) : Array.isArray(e) ? c(t, e) : Object.keys(e).forEach(function(l) {
        Object.assign(a, cn(e[l], n, l))
    }),
    a;
    function c(l, r) {
        n && (r = r.map(s=>s.toLowerCase())),
        r.forEach(function(s) {
            const i = s.split("|");
            a[i[0]] = [l, it(i[0], i[1])]
        })
    }
}
function it(e, n) {
    return n ? Number(n) : rt(e) ? 0 : 1
}
function rt(e) {
    return at.includes(e.toLowerCase())
}
const Ke = {}
  , J = e=>{
    console.error(e)
}
  , He = (e,...n)=>{
    console.log(`WARN: ${e}`, ...n)
}
  , ne = (e,n)=>{
    Ke[`${e}/${n}`] || (console.log(`Deprecated as of ${e}. ${n}`),
    Ke[`${e}/${n}`] = !0)
}
  , be = new Error;
function on(e, n, {key: t}) {
    let a = 0;
    const c = e[t]
      , l = {}
      , r = {};
    for (let s = 1; s <= n.length; s++)
        r[s + a] = c[s],
        l[s + a] = !0,
        a += nn(n[s - 1]);
    e[t] = r,
    e[t]._emit = l,
    e[t]._multi = !0
}
function ct(e) {
    if (Array.isArray(e.begin)) {
        if (e.skip || e.excludeBegin || e.returnBegin)
            throw J("skip, excludeBegin, returnBegin not compatible with beginScope: {}"),
            be;
        if (typeof e.beginScope != "object" || e.beginScope === null)
            throw J("beginScope must be object"),
            be;
        on(e, e.begin, {
            key: "beginScope"
        }),
        e.begin = Ce(e.begin, {
            joinWith: ""
        })
    }
}
function ot(e) {
    if (Array.isArray(e.end)) {
        if (e.skip || e.excludeEnd || e.returnEnd)
            throw J("skip, excludeEnd, returnEnd not compatible with endScope: {}"),
            be;
        if (typeof e.endScope != "object" || e.endScope === null)
            throw J("endScope must be object"),
            be;
        on(e, e.end, {
            key: "endScope"
        }),
        e.end = Ce(e.end, {
            joinWith: ""
        })
    }
}
function lt(e) {
    e.scope && typeof e.scope == "object" && e.scope !== null && (e.beginScope = e.scope,
    delete e.scope)
}
function ut(e) {
    lt(e),
    typeof e.beginScope == "string" && (e.beginScope = {
        _wrap: e.beginScope
    }),
    typeof e.endScope == "string" && (e.endScope = {
        _wrap: e.endScope
    }),
    ct(e),
    ot(e)
}
function dt(e) {
    function n(r, s) {
        return new RegExp(se(r),"m" + (e.case_insensitive ? "i" : "") + (e.unicodeRegex ? "u" : "") + (s ? "g" : ""))
    }
    class t {
        constructor() {
            this.matchIndexes = {},
            this.regexes = [],
            this.matchAt = 1,
            this.position = 0
        }
        addRule(s, i) {
            i.position = this.position++,
            this.matchIndexes[this.matchAt] = i,
            this.regexes.push([i, s]),
            this.matchAt += nn(s) + 1
        }
        compile() {
            this.regexes.length === 0 && (this.exec = ()=>null);
            const s = this.regexes.map(i=>i[1]);
            this.matcherRe = n(Ce(s, {
                joinWith: "|"
            }), !0),
            this.lastIndex = 0
        }
        exec(s) {
            this.matcherRe.lastIndex = this.lastIndex;
            const i = this.matcherRe.exec(s);
            if (!i)
                return null;
            const u = i.findIndex((h,f)=>f > 0 && h !== void 0)
              , p = this.matchIndexes[u];
            return i.splice(0, u),
            Object.assign(i, p)
        }
    }
    class a {
        constructor() {
            this.rules = [],
            this.multiRegexes = [],
            this.count = 0,
            this.lastIndex = 0,
            this.regexIndex = 0
        }
        getMatcher(s) {
            if (this.multiRegexes[s])
                return this.multiRegexes[s];
            const i = new t;
            return this.rules.slice(s).forEach(([u,p])=>i.addRule(u, p)),
            i.compile(),
            this.multiRegexes[s] = i,
            i
        }
        resumingScanAtSamePosition() {
            return this.regexIndex !== 0
        }
        considerAll() {
            this.regexIndex = 0
        }
        addRule(s, i) {
            this.rules.push([s, i]),
            i.type === "begin" && this.count++
        }
        exec(s) {
            const i = this.getMatcher(this.regexIndex);
            i.lastIndex = this.lastIndex;
            let u = i.exec(s);
            if (this.resumingScanAtSamePosition() && !(u && u.index === this.lastIndex)) {
                const p = this.getMatcher(0);
                p.lastIndex = this.lastIndex + 1,
                u = p.exec(s)
            }
            return u && (this.regexIndex += u.position + 1,
            this.regexIndex === this.count && this.considerAll()),
            u
        }
    }
    function c(r) {
        const s = new a;
        return r.contains.forEach(i=>s.addRule(i.begin, {
            rule: i,
            type: "begin"
        })),
        r.terminatorEnd && s.addRule(r.terminatorEnd, {
            type: "end"
        }),
        r.illegal && s.addRule(r.illegal, {
            type: "illegal"
        }),
        s
    }
    function l(r, s) {
        const i = r;
        if (r.isCompiled)
            return i;
        [Qn, et, ut, tt].forEach(p=>p(r, s)),
        e.compilerExtensions.forEach(p=>p(r, s)),
        r.__beforeBegin = null,
        [Jn, jn, nt].forEach(p=>p(r, s)),
        r.isCompiled = !0;
        let u = null;
        return typeof r.keywords == "object" && r.keywords.$pattern && (r.keywords = Object.assign({}, r.keywords),
        u = r.keywords.$pattern,
        delete r.keywords.$pattern),
        u = u || /\w+/,
        r.keywords && (r.keywords = cn(r.keywords, e.case_insensitive)),
        i.keywordPatternRe = n(u, !0),
        s && (r.begin || (r.begin = /\B|\b/),
        i.beginRe = n(i.begin),
        !r.end && !r.endsWithParent && (r.end = /\B|\b/),
        r.end && (i.endRe = n(i.end)),
        i.terminatorEnd = se(i.end) || "",
        r.endsWithParent && s.terminatorEnd && (i.terminatorEnd += (r.end ? "|" : "") + s.terminatorEnd)),
        r.illegal && (i.illegalRe = n(r.illegal)),
        r.contains || (r.contains = []),
        r.contains = [].concat(...r.contains.map(function(p) {
            return gt(p === "self" ? r : p)
        })),
        r.contains.forEach(function(p) {
            l(p, i)
        }),
        r.starts && l(r.starts, s),
        i.matcher = c(i),
        i
    }
    if (e.compilerExtensions || (e.compilerExtensions = []),
    e.contains && e.contains.includes("self"))
        throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
    return e.classNameAliases = q(e.classNameAliases || {}),
    l(e)
}
function ln(e) {
    return e ? e.endsWithParent || ln(e.starts) : !1
}
function gt(e) {
    return e.variants && !e.cachedVariants && (e.cachedVariants = e.variants.map(function(n) {
        return q(e, {
            variants: null
        }, n)
    })),
    e.cachedVariants ? e.cachedVariants : ln(e) ? q(e, {
        starts: e.starts ? q(e.starts) : null
    }) : Object.isFrozen(e) ? q(e) : e
}
var _t = "11.7.0";
class pt extends Error {
    constructor(n, t) {
        super(n),
        this.name = "HTMLInjectionError",
        this.html = t
    }
}
const ye = je
  , ze = q
  , Ge = Symbol("nomatch")
  , Et = 7
  , bt = function(e) {
    const n = Object.create(null)
      , t = Object.create(null)
      , a = [];
    let c = !0;
    const l = "Could not find the language '{}', did you forget to load/include a language module?"
      , r = {
        disableAutodetect: !0,
        name: "Plain text",
        contains: []
    };
    let s = {
        ignoreUnescapedHTML: !1,
        throwUnescapedHTML: !1,
        noHighlightRe: /^(no-?highlight)$/i,
        languageDetectRe: /\blang(?:uage)?-([\w-]+)\b/i,
        classPrefix: "hljs-",
        cssSelector: "pre code",
        languages: null,
        __emitter: An
    };
    function i(o) {
        return s.noHighlightRe.test(o)
    }
    function u(o) {
        let g = o.className + " ";
        g += o.parentNode ? o.parentNode.className : "";
        const b = s.languageDetectRe.exec(g);
        if (b) {
            const y = $(b[1]);
            return y || (He(l.replace("{}", b[1])),
            He("Falling back to no-highlight mode for this block.", o)),
            y ? b[1] : "no-highlight"
        }
        return g.split(/\s+/).find(y=>i(y) || $(y))
    }
    function p(o, g, b) {
        let y = ""
          , A = "";
        typeof g == "object" ? (y = o,
        b = g.ignoreIllegals,
        A = g.language) : (ne("10.7.0", "highlight(lang, code, ...args) has been deprecated."),
        ne("10.7.0", `Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`),
        A = o,
        y = g),
        b === void 0 && (b = !0);
        const U = {
            code: y,
            language: A
        };
        K("before:highlight", U);
        const H = U.result ? U.result : h(U.language, U.code, b);
        return H.code = U.code,
        K("after:highlight", H),
        H
    }
    function h(o, g, b, y) {
        const A = Object.create(null);
        function U(d, _) {
            return d.keywords[_]
        }
        function H() {
            if (!E.keywords) {
                C.addText(v);
                return
            }
            let d = 0;
            E.keywordPatternRe.lastIndex = 0;
            let _ = E.keywordPatternRe.exec(v)
              , m = "";
            for (; _; ) {
                m += v.substring(d, _.index);
                const S = Y.case_insensitive ? _[0].toLowerCase() : _[0]
                  , D = U(E, S);
                if (D) {
                    const [G,Sn] = D;
                    if (C.addText(m),
                    m = "",
                    A[S] = (A[S] || 0) + 1,
                    A[S] <= Et && (ue += Sn),
                    G.startsWith("_"))
                        m += _[0];
                    else {
                        const Tn = Y.classNameAliases[G] || G;
                        C.addKeyword(_[0], Tn)
                    }
                } else
                    m += _[0];
                d = E.keywordPatternRe.lastIndex,
                _ = E.keywordPatternRe.exec(v)
            }
            m += v.substring(d),
            C.addText(m)
        }
        function oe() {
            if (v === "")
                return;
            let d = null;
            if (typeof E.subLanguage == "string") {
                if (!n[E.subLanguage]) {
                    C.addText(v);
                    return
                }
                d = h(E.subLanguage, v, !0, Ue[E.subLanguage]),
                Ue[E.subLanguage] = d._top
            } else
                d = N(v, E.subLanguage.length ? E.subLanguage : null);
            E.relevance > 0 && (ue += d.relevance),
            C.addSublanguage(d._emitter, d.language)
        }
        function F() {
            E.subLanguage != null ? oe() : H(),
            v = ""
        }
        function Z(d, _) {
            let m = 1;
            const S = _.length - 1;
            for (; m <= S; ) {
                if (!d._emit[m]) {
                    m++;
                    continue
                }
                const D = Y.classNameAliases[d[m]] || d[m]
                  , G = _[m];
                D ? C.addKeyword(G, D) : (v = G,
                H(),
                v = ""),
                m++
            }
        }
        function De(d, _) {
            return d.scope && typeof d.scope == "string" && C.openNode(Y.classNameAliases[d.scope] || d.scope),
            d.beginScope && (d.beginScope._wrap ? (C.addKeyword(v, Y.classNameAliases[d.beginScope._wrap] || d.beginScope._wrap),
            v = "") : d.beginScope._multi && (Z(d.beginScope, _),
            v = "")),
            E = Object.create(d, {
                parent: {
                    value: E
                }
            }),
            E
        }
        function ke(d, _, m) {
            let S = Cn(d.endRe, m);
            if (S) {
                if (d["on:end"]) {
                    const D = new Pe(d);
                    d["on:end"](_, D),
                    D.isMatchIgnored && (S = !1)
                }
                if (S) {
                    for (; d.endsParent && d.parent; )
                        d = d.parent;
                    return d
                }
            }
            if (d.endsWithParent)
                return ke(d.parent, _, m)
        }
        function fn(d) {
            return E.matcher.regexIndex === 0 ? (v += d[0],
            1) : (Ne = !0,
            0)
        }
        function mn(d) {
            const _ = d[0]
              , m = d.rule
              , S = new Pe(m)
              , D = [m.__beforeBegin, m["on:begin"]];
            for (const G of D)
                if (G && (G(d, S),
                S.isMatchIgnored))
                    return fn(_);
            return m.skip ? v += _ : (m.excludeBegin && (v += _),
            F(),
            !m.returnBegin && !m.excludeBegin && (v = _)),
            De(m, d),
            m.returnBegin ? 0 : _.length
        }
        function hn(d) {
            const _ = d[0]
              , m = g.substring(d.index)
              , S = ke(E, d, m);
            if (!S)
                return Ge;
            const D = E;
            E.endScope && E.endScope._wrap ? (F(),
            C.addKeyword(_, E.endScope._wrap)) : E.endScope && E.endScope._multi ? (F(),
            Z(E.endScope, d)) : D.skip ? v += _ : (D.returnEnd || D.excludeEnd || (v += _),
            F(),
            D.excludeEnd && (v = _));
            do
                E.scope && C.closeNode(),
                !E.skip && !E.subLanguage && (ue += E.relevance),
                E = E.parent;
            while (E !== S.parent);
            return S.starts && De(S.starts, d),
            D.returnEnd ? 0 : _.length
        }
        function Nn() {
            const d = [];
            for (let _ = E; _ !== Y; _ = _.parent)
                _.scope && d.unshift(_.scope);
            d.forEach(_=>C.openNode(_))
        }
        let le = {};
        function Be(d, _) {
            const m = _ && _[0];
            if (v += d,
            m == null)
                return F(),
                0;
            if (le.type === "begin" && _.type === "end" && le.index === _.index && m === "") {
                if (v += g.slice(_.index, _.index + 1),
                !c) {
                    const S = new Error(`0 width match regex (${o})`);
                    throw S.languageName = o,
                    S.badRule = le.rule,
                    S
                }
                return 1
            }
            if (le = _,
            _.type === "begin")
                return mn(_);
            if (_.type === "illegal" && !b) {
                const S = new Error('Illegal lexeme "' + m + '" for mode "' + (E.scope || "<unnamed>") + '"');
                throw S.mode = E,
                S
            } else if (_.type === "end") {
                const S = hn(_);
                if (S !== Ge)
                    return S
            }
            if (_.type === "illegal" && m === "")
                return 1;
            if (he > 1e5 && he > _.index * 3)
                throw new Error("potential infinite loop, way more iterations than matches");
            return v += m,
            m.length
        }
        const Y = $(o);
        if (!Y)
            throw J(l.replace("{}", o)),
            new Error('Unknown language: "' + o + '"');
        const yn = dt(Y);
        let me = ""
          , E = y || yn;
        const Ue = {}
          , C = new s.__emitter(s);
        Nn();
        let v = ""
          , ue = 0
          , Q = 0
          , he = 0
          , Ne = !1;
        try {
            for (E.matcher.considerAll(); ; ) {
                he++,
                Ne ? Ne = !1 : E.matcher.considerAll(),
                E.matcher.lastIndex = Q;
                const d = E.matcher.exec(g);
                if (!d)
                    break;
                const _ = g.substring(Q, d.index)
                  , m = Be(_, d);
                Q = d.index + m
            }
            return Be(g.substring(Q)),
            C.closeAllNodes(),
            C.finalize(),
            me = C.toHTML(),
            {
                language: o,
                value: me,
                relevance: ue,
                illegal: !1,
                _emitter: C,
                _top: E
            }
        } catch (d) {
            if (d.message && d.message.includes("Illegal"))
                return {
                    language: o,
                    value: ye(g),
                    illegal: !0,
                    relevance: 0,
                    _illegalBy: {
                        message: d.message,
                        index: Q,
                        context: g.slice(Q - 100, Q + 100),
                        mode: d.mode,
                        resultSoFar: me
                    },
                    _emitter: C
                };
            if (c)
                return {
                    language: o,
                    value: ye(g),
                    illegal: !1,
                    relevance: 0,
                    errorRaised: d,
                    _emitter: C,
                    _top: E
                };
            throw d
        }
    }
    function f(o) {
        const g = {
            value: ye(o),
            illegal: !1,
            relevance: 0,
            _top: r,
            _emitter: new s.__emitter(s)
        };
        return g._emitter.addText(o),
        g
    }
    function N(o, g) {
        g = g || s.languages || Object.keys(n);
        const b = f(o)
          , y = g.filter($).filter(ee).map(F=>h(F, o, !1));
        y.unshift(b);
        const A = y.sort((F,Z)=>{
            if (F.relevance !== Z.relevance)
                return Z.relevance - F.relevance;
            if (F.language && Z.language) {
                if ($(F.language).supersetOf === Z.language)
                    return 1;
                if ($(Z.language).supersetOf === F.language)
                    return -1
            }
            return 0
        }
        )
          , [U,H] = A
          , oe = U;
        return oe.secondBest = H,
        oe
    }
    function T(o, g, b) {
        const y = g && t[g] || b;
        o.classList.add("hljs"),
        o.classList.add(`language-${y}`)
    }
    function R(o) {
        let g = null;
        const b = u(o);
        if (i(b))
            return;
        if (K("before:highlightElement", {
            el: o,
            language: b
        }),
        o.children.length > 0 && (s.ignoreUnescapedHTML || (console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."),
        console.warn("https://github.com/highlightjs/highlight.js/wiki/security"),
        console.warn("The element with unescaped HTML:"),
        console.warn(o)),
        s.throwUnescapedHTML))
            throw new pt("One of your code blocks includes unescaped HTML.",o.innerHTML);
        g = o;
        const y = g.textContent
          , A = b ? p(y, {
            language: b,
            ignoreIllegals: !0
        }) : N(y);
        o.innerHTML = A.value,
        T(o, b, A.language),
        o.result = {
            language: A.language,
            re: A.relevance,
            relevance: A.relevance
        },
        A.secondBest && (o.secondBest = {
            language: A.secondBest.language,
            relevance: A.secondBest.relevance
        }),
        K("after:highlightElement", {
            el: o,
            result: A,
            text: y
        })
    }
    function M(o) {
        s = ze(s, o)
    }
    const I = ()=>{
        O(),
        ne("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.")
    }
    ;
    function k() {
        O(),
        ne("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.")
    }
    let w = !1;
    function O() {
        if (document.readyState === "loading") {
            w = !0;
            return
        }
        document.querySelectorAll(s.cssSelector).forEach(R)
    }
    function B() {
        w && O()
    }
    typeof window < "u" && window.addEventListener && window.addEventListener("DOMContentLoaded", B, !1);
    function P(o, g) {
        let b = null;
        try {
            b = g(e)
        } catch (y) {
            if (J("Language definition for '{}' could not be registered.".replace("{}", o)),
            c)
                J(y);
            else
                throw y;
            b = r
        }
        b.name || (b.name = o),
        n[o] = b,
        b.rawDefinition = g.bind(null, e),
        b.aliases && X(b.aliases, {
            languageName: o
        })
    }
    function x(o) {
        delete n[o];
        for (const g of Object.keys(t))
            t[g] === o && delete t[g]
    }
    function W() {
        return Object.keys(n)
    }
    function $(o) {
        return o = (o || "").toLowerCase(),
        n[o] || n[t[o]]
    }
    function X(o, {languageName: g}) {
        typeof o == "string" && (o = [o]),
        o.forEach(b=>{
            t[b.toLowerCase()] = g
        }
        )
    }
    function ee(o) {
        const g = $(o);
        return g && !g.disableAutodetect
    }
    function V(o) {
        o["before:highlightBlock"] && !o["before:highlightElement"] && (o["before:highlightElement"] = g=>{
            o["before:highlightBlock"](Object.assign({
                block: g.el
            }, g))
        }
        ),
        o["after:highlightBlock"] && !o["after:highlightElement"] && (o["after:highlightElement"] = g=>{
            o["after:highlightBlock"](Object.assign({
                block: g.el
            }, g))
        }
        )
    }
    function z(o) {
        V(o),
        a.push(o)
    }
    function K(o, g) {
        const b = o;
        a.forEach(function(y) {
            y[b] && y[b](g)
        })
    }
    function ce(o) {
        return ne("10.7.0", "highlightBlock will be removed entirely in v12.0"),
        ne("10.7.0", "Please use highlightElement now."),
        R(o)
    }
    Object.assign(e, {
        highlight: p,
        highlightAuto: N,
        highlightAll: O,
        highlightElement: R,
        highlightBlock: ce,
        configure: M,
        initHighlighting: I,
        initHighlightingOnLoad: k,
        registerLanguage: P,
        unregisterLanguage: x,
        listLanguages: W,
        getLanguage: $,
        registerAliases: X,
        autoDetection: ee,
        inherit: ze,
        addPlugin: z
    }),
    e.debugMode = function() {
        c = !1
    }
    ,
    e.safeMode = function() {
        c = !0
    }
    ,
    e.versionString = _t,
    e.regex = {
        concat: j,
        lookahead: en,
        either: Ie,
        optional: wn,
        anyNumberOfTimes: Mn
    };
    for (const o in de)
        typeof de[o] == "object" && Ae.exports(de[o]);
    return Object.assign(e, de),
    e
};
var re = bt({})
  , ft = re;
re.HighlightJS = re;
re.default = re;
const L = ft;
function mt(e) {
    return {
        name: "Plain text",
        aliases: ["text", "txt"],
        disableAutodetect: !0
    }
}
function ht(e) {
    const n = e.regex
      , t = /(?![A-Za-z0-9])(?![$])/
      , a = n.concat(/[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*/, t)
      , c = n.concat(/(\\?[A-Z][a-z0-9_\x7f-\xff]+|\\?[A-Z]+(?=[A-Z][a-z0-9_\x7f-\xff])){1,}/, t)
      , l = {
        scope: "variable",
        match: "\\$+" + a
    }
      , r = {
        scope: "meta",
        variants: [{
            begin: /<\?php/,
            relevance: 10
        }, {
            begin: /<\?=/
        }, {
            begin: /<\?/,
            relevance: .1
        }, {
            begin: /\?>/
        }]
    }
      , s = {
        scope: "subst",
        variants: [{
            begin: /\$\w+/
        }, {
            begin: /\{\$/,
            end: /\}/
        }]
    }
      , i = e.inherit(e.APOS_STRING_MODE, {
        illegal: null
    })
      , u = e.inherit(e.QUOTE_STRING_MODE, {
        illegal: null,
        contains: e.QUOTE_STRING_MODE.contains.concat(s)
    })
      , p = e.END_SAME_AS_BEGIN({
        begin: /<<<[ \t]*(\w+)\n/,
        end: /[ \t]*(\w+)\b/,
        contains: e.QUOTE_STRING_MODE.contains.concat(s)
    })
      , h = `[ 	
]`
      , f = {
        scope: "string",
        variants: [u, i, p]
    }
      , N = {
        scope: "number",
        variants: [{
            begin: "\\b0[bB][01]+(?:_[01]+)*\\b"
        }, {
            begin: "\\b0[oO][0-7]+(?:_[0-7]+)*\\b"
        }, {
            begin: "\\b0[xX][\\da-fA-F]+(?:_[\\da-fA-F]+)*\\b"
        }, {
            begin: "(?:\\b\\d+(?:_\\d+)*(\\.(?:\\d+(?:_\\d+)*))?|\\B\\.\\d+)(?:[eE][+-]?\\d+)?"
        }],
        relevance: 0
    }
      , T = ["false", "null", "true"]
      , R = ["__CLASS__", "__DIR__", "__FILE__", "__FUNCTION__", "__COMPILER_HALT_OFFSET__", "__LINE__", "__METHOD__", "__NAMESPACE__", "__TRAIT__", "die", "echo", "exit", "include", "include_once", "print", "require", "require_once", "array", "abstract", "and", "as", "binary", "bool", "boolean", "break", "callable", "case", "catch", "class", "clone", "const", "continue", "declare", "default", "do", "double", "else", "elseif", "empty", "enddeclare", "endfor", "endforeach", "endif", "endswitch", "endwhile", "enum", "eval", "extends", "final", "finally", "float", "for", "foreach", "from", "global", "goto", "if", "implements", "instanceof", "insteadof", "int", "integer", "interface", "isset", "iterable", "list", "match|0", "mixed", "new", "never", "object", "or", "private", "protected", "public", "readonly", "real", "return", "string", "switch", "throw", "trait", "try", "unset", "use", "var", "void", "while", "xor", "yield"]
      , M = ["Error|0", "AppendIterator", "ArgumentCountError", "ArithmeticError", "ArrayIterator", "ArrayObject", "AssertionError", "BadFunctionCallException", "BadMethodCallException", "CachingIterator", "CallbackFilterIterator", "CompileError", "Countable", "DirectoryIterator", "DivisionByZeroError", "DomainException", "EmptyIterator", "ErrorException", "Exception", "FilesystemIterator", "FilterIterator", "GlobIterator", "InfiniteIterator", "InvalidArgumentException", "IteratorIterator", "LengthException", "LimitIterator", "LogicException", "MultipleIterator", "NoRewindIterator", "OutOfBoundsException", "OutOfRangeException", "OuterIterator", "OverflowException", "ParentIterator", "ParseError", "RangeException", "RecursiveArrayIterator", "RecursiveCachingIterator", "RecursiveCallbackFilterIterator", "RecursiveDirectoryIterator", "RecursiveFilterIterator", "RecursiveIterator", "RecursiveIteratorIterator", "RecursiveRegexIterator", "RecursiveTreeIterator", "RegexIterator", "RuntimeException", "SeekableIterator", "SplDoublyLinkedList", "SplFileInfo", "SplFileObject", "SplFixedArray", "SplHeap", "SplMaxHeap", "SplMinHeap", "SplObjectStorage", "SplObserver", "SplPriorityQueue", "SplQueue", "SplStack", "SplSubject", "SplTempFileObject", "TypeError", "UnderflowException", "UnexpectedValueException", "UnhandledMatchError", "ArrayAccess", "BackedEnum", "Closure", "Fiber", "Generator", "Iterator", "IteratorAggregate", "Serializable", "Stringable", "Throwable", "Traversable", "UnitEnum", "WeakReference", "WeakMap", "Directory", "__PHP_Incomplete_Class", "parent", "php_user_filter", "self", "static", "stdClass"]
      , k = {
        keyword: R,
        literal: (V=>{
            const z = [];
            return V.forEach(K=>{
                z.push(K),
                K.toLowerCase() === K ? z.push(K.toUpperCase()) : z.push(K.toLowerCase())
            }
            ),
            z
        }
        )(T),
        built_in: M
    }
      , w = V=>V.map(z=>z.replace(/\|\d+$/, ""))
      , O = {
        variants: [{
            match: [/new/, n.concat(h, "+"), n.concat("(?!", w(M).join("\\b|"), "\\b)"), c],
            scope: {
                1: "keyword",
                4: "title.class"
            }
        }]
    }
      , B = n.concat(a, "\\b(?!\\()")
      , P = {
        variants: [{
            match: [n.concat(/::/, n.lookahead(/(?!class\b)/)), B],
            scope: {
                2: "variable.constant"
            }
        }, {
            match: [/::/, /class/],
            scope: {
                2: "variable.language"
            }
        }, {
            match: [c, n.concat(/::/, n.lookahead(/(?!class\b)/)), B],
            scope: {
                1: "title.class",
                3: "variable.constant"
            }
        }, {
            match: [c, n.concat("::", n.lookahead(/(?!class\b)/))],
            scope: {
                1: "title.class"
            }
        }, {
            match: [c, /::/, /class/],
            scope: {
                1: "title.class",
                3: "variable.language"
            }
        }]
    }
      , x = {
        scope: "attr",
        match: n.concat(a, n.lookahead(":"), n.lookahead(/(?!::)/))
    }
      , W = {
        relevance: 0,
        begin: /\(/,
        end: /\)/,
        keywords: k,
        contains: [x, l, P, e.C_BLOCK_COMMENT_MODE, f, N, O]
    }
      , $ = {
        relevance: 0,
        match: [/\b/, n.concat("(?!fn\\b|function\\b|", w(R).join("\\b|"), "|", w(M).join("\\b|"), "\\b)"), a, n.concat(h, "*"), n.lookahead(/(?=\()/)],
        scope: {
            3: "title.function.invoke"
        },
        contains: [W]
    };
    W.contains.push($);
    const X = [x, P, e.C_BLOCK_COMMENT_MODE, f, N, O]
      , ee = {
        begin: n.concat(/#\[\s*/, c),
        beginScope: "meta",
        end: /]/,
        endScope: "meta",
        keywords: {
            literal: T,
            keyword: ["new", "array"]
        },
        contains: [{
            begin: /\[/,
            end: /]/,
            keywords: {
                literal: T,
                keyword: ["new", "array"]
            },
            contains: ["self", ...X]
        }, ...X, {
            scope: "meta",
            match: c
        }]
    };
    return {
        case_insensitive: !1,
        keywords: k,
        contains: [ee, e.HASH_COMMENT_MODE, e.COMMENT("//", "$"), e.COMMENT("/\\*", "\\*/", {
            contains: [{
                scope: "doctag",
                match: "@[A-Za-z]+"
            }]
        }), {
            match: /__halt_compiler\(\);/,
            keywords: "__halt_compiler",
            starts: {
                scope: "comment",
                end: e.MATCH_NOTHING_RE,
                contains: [{
                    match: /\?>/,
                    scope: "meta",
                    endsParent: !0
                }]
            }
        }, r, {
            scope: "variable.language",
            match: /\$this\b/
        }, l, $, P, {
            match: [/const/, /\s/, a],
            scope: {
                1: "keyword",
                3: "variable.constant"
            }
        }, O, {
            scope: "function",
            relevance: 0,
            beginKeywords: "fn function",
            end: /[;{]/,
            excludeEnd: !0,
            illegal: "[$%\\[]",
            contains: [{
                beginKeywords: "use"
            }, e.UNDERSCORE_TITLE_MODE, {
                begin: "=>",
                endsParent: !0
            }, {
                scope: "params",
                begin: "\\(",
                end: "\\)",
                excludeBegin: !0,
                excludeEnd: !0,
                keywords: k,
                contains: ["self", l, P, e.C_BLOCK_COMMENT_MODE, f, N]
            }]
        }, {
            scope: "class",
            variants: [{
                beginKeywords: "enum",
                illegal: /[($"]/
            }, {
                beginKeywords: "class interface trait",
                illegal: /[:($"]/
            }],
            relevance: 0,
            end: /\{/,
            excludeEnd: !0,
            contains: [{
                beginKeywords: "extends implements"
            }, e.UNDERSCORE_TITLE_MODE]
        }, {
            beginKeywords: "namespace",
            relevance: 0,
            end: ";",
            illegal: /[.']/,
            contains: [e.inherit(e.UNDERSCORE_TITLE_MODE, {
                scope: "title.class"
            })]
        }, {
            beginKeywords: "use",
            relevance: 0,
            end: ";",
            contains: [{
                match: /\b(as|const|function)\b/,
                scope: "keyword"
            }, e.UNDERSCORE_TITLE_MODE]
        }, f, N]
    }
}
function Nt(e) {
    const n = e.regex
      , t = /[\p{XID_Start}_]\p{XID_Continue}*/u
      , a = ["and", "as", "assert", "async", "await", "break", "case", "class", "continue", "def", "del", "elif", "else", "except", "finally", "for", "from", "global", "if", "import", "in", "is", "lambda", "match", "nonlocal|10", "not", "or", "pass", "raise", "return", "try", "while", "with", "yield"]
      , s = {
        $pattern: /[A-Za-z]\w+|__\w+__/,
        keyword: a,
        built_in: ["__import__", "abs", "all", "any", "ascii", "bin", "bool", "breakpoint", "bytearray", "bytes", "callable", "chr", "classmethod", "compile", "complex", "delattr", "dict", "dir", "divmod", "enumerate", "eval", "exec", "filter", "float", "format", "frozenset", "getattr", "globals", "hasattr", "hash", "help", "hex", "id", "input", "int", "isinstance", "issubclass", "iter", "len", "list", "locals", "map", "max", "memoryview", "min", "next", "object", "oct", "open", "ord", "pow", "print", "property", "range", "repr", "reversed", "round", "set", "setattr", "slice", "sorted", "staticmethod", "str", "sum", "super", "tuple", "type", "vars", "zip"],
        literal: ["__debug__", "Ellipsis", "False", "None", "NotImplemented", "True"],
        type: ["Any", "Callable", "Coroutine", "Dict", "List", "Literal", "Generic", "Optional", "Sequence", "Set", "Tuple", "Type", "Union"]
    }
      , i = {
        className: "meta",
        begin: /^(>>>|\.\.\.) /
    }
      , u = {
        className: "subst",
        begin: /\{/,
        end: /\}/,
        keywords: s,
        illegal: /#/
    }
      , p = {
        begin: /\{\{/,
        relevance: 0
    }
      , h = {
        className: "string",
        contains: [e.BACKSLASH_ESCAPE],
        variants: [{
            begin: /([uU]|[bB]|[rR]|[bB][rR]|[rR][bB])?'''/,
            end: /'''/,
            contains: [e.BACKSLASH_ESCAPE, i],
            relevance: 10
        }, {
            begin: /([uU]|[bB]|[rR]|[bB][rR]|[rR][bB])?"""/,
            end: /"""/,
            contains: [e.BACKSLASH_ESCAPE, i],
            relevance: 10
        }, {
            begin: /([fF][rR]|[rR][fF]|[fF])'''/,
            end: /'''/,
            contains: [e.BACKSLASH_ESCAPE, i, p, u]
        }, {
            begin: /([fF][rR]|[rR][fF]|[fF])"""/,
            end: /"""/,
            contains: [e.BACKSLASH_ESCAPE, i, p, u]
        }, {
            begin: /([uU]|[rR])'/,
            end: /'/,
            relevance: 10
        }, {
            begin: /([uU]|[rR])"/,
            end: /"/,
            relevance: 10
        }, {
            begin: /([bB]|[bB][rR]|[rR][bB])'/,
            end: /'/
        }, {
            begin: /([bB]|[bB][rR]|[rR][bB])"/,
            end: /"/
        }, {
            begin: /([fF][rR]|[rR][fF]|[fF])'/,
            end: /'/,
            contains: [e.BACKSLASH_ESCAPE, p, u]
        }, {
            begin: /([fF][rR]|[rR][fF]|[fF])"/,
            end: /"/,
            contains: [e.BACKSLASH_ESCAPE, p, u]
        }, e.APOS_STRING_MODE, e.QUOTE_STRING_MODE]
    }
      , f = "[0-9](_?[0-9])*"
      , N = `(\\b(${f}))?\\.(${f})|\\b(${f})\\.`
      , T = `\\b|${a.join("|")}`
      , R = {
        className: "number",
        relevance: 0,
        variants: [{
            begin: `(\\b(${f})|(${N}))[eE][+-]?(${f})[jJ]?(?=${T})`
        }, {
            begin: `(${N})[jJ]?`
        }, {
            begin: `\\b([1-9](_?[0-9])*|0+(_?0)*)[lLjJ]?(?=${T})`
        }, {
            begin: `\\b0[bB](_?[01])+[lL]?(?=${T})`
        }, {
            begin: `\\b0[oO](_?[0-7])+[lL]?(?=${T})`
        }, {
            begin: `\\b0[xX](_?[0-9a-fA-F])+[lL]?(?=${T})`
        }, {
            begin: `\\b(${f})[jJ](?=${T})`
        }]
    }
      , M = {
        className: "comment",
        begin: n.lookahead(/# type:/),
        end: /$/,
        keywords: s,
        contains: [{
            begin: /# type:/
        }, {
            begin: /#/,
            end: /\b\B/,
            endsWithParent: !0
        }]
    }
      , I = {
        className: "params",
        variants: [{
            className: "",
            begin: /\(\s*\)/,
            skip: !0
        }, {
            begin: /\(/,
            end: /\)/,
            excludeBegin: !0,
            excludeEnd: !0,
            keywords: s,
            contains: ["self", i, R, h, e.HASH_COMMENT_MODE]
        }]
    };
    return u.contains = [h, R, i],
    {
        name: "Python",
        aliases: ["py", "gyp", "ipython"],
        unicodeRegex: !0,
        keywords: s,
        illegal: /(<\/|->|\?)|=>/,
        contains: [i, R, {
            begin: /\bself\b/
        }, {
            beginKeywords: "if",
            relevance: 0
        }, h, M, e.HASH_COMMENT_MODE, {
            match: [/\bdef/, /\s+/, t],
            scope: {
                1: "keyword",
                3: "title.function"
            },
            contains: [I]
        }, {
            variants: [{
                match: [/\bclass/, /\s+/, t, /\s*/, /\(\s*/, t, /\s*\)/]
            }, {
                match: [/\bclass/, /\s+/, t]
            }],
            scope: {
                1: "keyword",
                3: "title.class",
                6: "title.class.inherited"
            }
        }, {
            className: "meta",
            begin: /^[\t ]*@/,
            end: /(?=#)|$/,
            contains: [R, I, h]
        }]
    }
}
const We = "[A-Za-z$_][0-9A-Za-z$_]*"
  , yt = ["as", "in", "of", "if", "for", "while", "finally", "var", "new", "function", "do", "return", "void", "else", "break", "catch", "instanceof", "with", "throw", "case", "default", "try", "switch", "continue", "typeof", "delete", "let", "yield", "const", "class", "debugger", "async", "await", "static", "import", "from", "export", "extends"]
  , St = ["true", "false", "null", "undefined", "NaN", "Infinity"]
  , un = ["Object", "Function", "Boolean", "Symbol", "Math", "Date", "Number", "BigInt", "String", "RegExp", "Array", "Float32Array", "Float64Array", "Int8Array", "Uint8Array", "Uint8ClampedArray", "Int16Array", "Int32Array", "Uint16Array", "Uint32Array", "BigInt64Array", "BigUint64Array", "Set", "Map", "WeakSet", "WeakMap", "ArrayBuffer", "SharedArrayBuffer", "Atomics", "DataView", "JSON", "Promise", "Generator", "GeneratorFunction", "AsyncFunction", "Reflect", "Proxy", "Intl", "WebAssembly"]
  , dn = ["Error", "EvalError", "InternalError", "RangeError", "ReferenceError", "SyntaxError", "TypeError", "URIError"]
  , gn = ["setInterval", "setTimeout", "clearInterval", "clearTimeout", "require", "exports", "eval", "isFinite", "isNaN", "parseFloat", "parseInt", "decodeURI", "decodeURIComponent", "encodeURI", "encodeURIComponent", "escape", "unescape"]
  , Tt = ["arguments", "this", "super", "console", "window", "document", "localStorage", "module", "global"]
  , Ot = [].concat(gn, un, dn);
function Rt(e) {
    const n = e.regex
      , t = (g,{after: b})=>{
        const y = "</" + g[0].slice(1);
        return g.input.indexOf(y, b) !== -1
    }
      , a = We
      , c = {
        begin: "<>",
        end: "</>"
    }
      , l = /<[A-Za-z0-9\\._:-]+\s*\/>/
      , r = {
        begin: /<[A-Za-z0-9\\._:-]+/,
        end: /\/[A-Za-z0-9\\._:-]+>|\/>/,
        isTrulyOpeningTag: (g,b)=>{
            const y = g[0].length + g.index
              , A = g.input[y];
            if (A === "<" || A === ",") {
                b.ignoreMatch();
                return
            }
            A === ">" && (t(g, {
                after: y
            }) || b.ignoreMatch());
            let U;
            const H = g.input.substring(y);
            if (U = H.match(/^\s*=/)) {
                b.ignoreMatch();
                return
            }
            if ((U = H.match(/^\s+extends\s+/)) && U.index === 0) {
                b.ignoreMatch();
                return
            }
        }
    }
      , s = {
        $pattern: We,
        keyword: yt,
        literal: St,
        built_in: Ot,
        "variable.language": Tt
    }
      , i = "[0-9](_?[0-9])*"
      , u = `\\.(${i})`
      , p = "0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*"
      , h = {
        className: "number",
        variants: [{
            begin: `(\\b(${p})((${u})|\\.)?|(${u}))[eE][+-]?(${i})\\b`
        }, {
            begin: `\\b(${p})\\b((${u})\\b|\\.)?|(${u})\\b`
        }, {
            begin: "\\b(0|[1-9](_?[0-9])*)n\\b"
        }, {
            begin: "\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b"
        }, {
            begin: "\\b0[bB][0-1](_?[0-1])*n?\\b"
        }, {
            begin: "\\b0[oO][0-7](_?[0-7])*n?\\b"
        }, {
            begin: "\\b0[0-7]+n?\\b"
        }],
        relevance: 0
    }
      , f = {
        className: "subst",
        begin: "\\$\\{",
        end: "\\}",
        keywords: s,
        contains: []
    }
      , N = {
        begin: "html`",
        end: "",
        starts: {
            end: "`",
            returnEnd: !1,
            contains: [e.BACKSLASH_ESCAPE, f],
            subLanguage: "xml"
        }
    }
      , T = {
        begin: "css`",
        end: "",
        starts: {
            end: "`",
            returnEnd: !1,
            contains: [e.BACKSLASH_ESCAPE, f],
            subLanguage: "css"
        }
    }
      , R = {
        className: "string",
        begin: "`",
        end: "`",
        contains: [e.BACKSLASH_ESCAPE, f]
    }
      , I = {
        className: "comment",
        variants: [e.COMMENT(/\/\*\*(?!\/)/, "\\*/", {
            relevance: 0,
            contains: [{
                begin: "(?=@[A-Za-z]+)",
                relevance: 0,
                contains: [{
                    className: "doctag",
                    begin: "@[A-Za-z]+"
                }, {
                    className: "type",
                    begin: "\\{",
                    end: "\\}",
                    excludeEnd: !0,
                    excludeBegin: !0,
                    relevance: 0
                }, {
                    className: "variable",
                    begin: a + "(?=\\s*(-)|$)",
                    endsParent: !0,
                    relevance: 0
                }, {
                    begin: /(?=[^\n])\s/,
                    relevance: 0
                }]
            }]
        }), e.C_BLOCK_COMMENT_MODE, e.C_LINE_COMMENT_MODE]
    }
      , k = [e.APOS_STRING_MODE, e.QUOTE_STRING_MODE, N, T, R, {
        match: /\$\d+/
    }, h];
    f.contains = k.concat({
        begin: /\{/,
        end: /\}/,
        keywords: s,
        contains: ["self"].concat(k)
    });
    const w = [].concat(I, f.contains)
      , O = w.concat([{
        begin: /\(/,
        end: /\)/,
        keywords: s,
        contains: ["self"].concat(w)
    }])
      , B = {
        className: "params",
        begin: /\(/,
        end: /\)/,
        excludeBegin: !0,
        excludeEnd: !0,
        keywords: s,
        contains: O
    }
      , P = {
        variants: [{
            match: [/class/, /\s+/, a, /\s+/, /extends/, /\s+/, n.concat(a, "(", n.concat(/\./, a), ")*")],
            scope: {
                1: "keyword",
                3: "title.class",
                5: "keyword",
                7: "title.class.inherited"
            }
        }, {
            match: [/class/, /\s+/, a],
            scope: {
                1: "keyword",
                3: "title.class"
            }
        }]
    }
      , x = {
        relevance: 0,
        match: n.either(/\bJSON/, /\b[A-Z][a-z]+([A-Z][a-z]*|\d)*/, /\b[A-Z]{2,}([A-Z][a-z]+|\d)+([A-Z][a-z]*)*/, /\b[A-Z]{2,}[a-z]+([A-Z][a-z]+|\d)*([A-Z][a-z]*)*/),
        className: "title.class",
        keywords: {
            _: [...un, ...dn]
        }
    }
      , W = {
        label: "use_strict",
        className: "meta",
        relevance: 10,
        begin: /^\s*['"]use (strict|asm)['"]/
    }
      , $ = {
        variants: [{
            match: [/function/, /\s+/, a, /(?=\s*\()/]
        }, {
            match: [/function/, /\s*(?=\()/]
        }],
        className: {
            1: "keyword",
            3: "title.function"
        },
        label: "func.def",
        contains: [B],
        illegal: /%/
    }
      , X = {
        relevance: 0,
        match: /\b[A-Z][A-Z_0-9]+\b/,
        className: "variable.constant"
    };
    function ee(g) {
        return n.concat("(?!", g.join("|"), ")")
    }
    const V = {
        match: n.concat(/\b/, ee([...gn, "super", "import"]), a, n.lookahead(/\(/)),
        className: "title.function",
        relevance: 0
    }
      , z = {
        begin: n.concat(/\./, n.lookahead(n.concat(a, /(?![0-9A-Za-z$_(])/))),
        end: a,
        excludeBegin: !0,
        keywords: "prototype",
        className: "property",
        relevance: 0
    }
      , K = {
        match: [/get|set/, /\s+/, a, /(?=\()/],
        className: {
            1: "keyword",
            3: "title.function"
        },
        contains: [{
            begin: /\(\)/
        }, B]
    }
      , ce = "(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|" + e.UNDERSCORE_IDENT_RE + ")\\s*=>"
      , o = {
        match: [/const|var|let/, /\s+/, a, /\s*/, /=\s*/, /(async\s*)?/, n.lookahead(ce)],
        keywords: "async",
        className: {
            1: "keyword",
            3: "title.function"
        },
        contains: [B]
    };
    return {
        name: "Javascript",
        aliases: ["js", "jsx", "mjs", "cjs"],
        keywords: s,
        exports: {
            PARAMS_CONTAINS: O,
            CLASS_REFERENCE: x
        },
        illegal: /#(?![$_A-z])/,
        contains: [e.SHEBANG({
            label: "shebang",
            binary: "node",
            relevance: 5
        }), W, e.APOS_STRING_MODE, e.QUOTE_STRING_MODE, N, T, R, I, {
            match: /\$\d+/
        }, h, x, {
            className: "attr",
            begin: a + n.lookahead(":"),
            relevance: 0
        }, o, {
            begin: "(" + e.RE_STARTERS_RE + "|\\b(case|return|throw)\\b)\\s*",
            keywords: "return throw case",
            relevance: 0,
            contains: [I, e.REGEXP_MODE, {
                className: "function",
                begin: ce,
                returnBegin: !0,
                end: "\\s*=>",
                contains: [{
                    className: "params",
                    variants: [{
                        begin: e.UNDERSCORE_IDENT_RE,
                        relevance: 0
                    }, {
                        className: null,
                        begin: /\(\s*\)/,
                        skip: !0
                    }, {
                        begin: /\(/,
                        end: /\)/,
                        excludeBegin: !0,
                        excludeEnd: !0,
                        keywords: s,
                        contains: O
                    }]
                }]
            }, {
                begin: /,/,
                relevance: 0
            }, {
                match: /\s+/,
                relevance: 0
            }, {
                variants: [{
                    begin: c.begin,
                    end: c.end
                }, {
                    match: l
                }, {
                    begin: r.begin,
                    "on:begin": r.isTrulyOpeningTag,
                    end: r.end
                }],
                subLanguage: "xml",
                contains: [{
                    begin: r.begin,
                    end: r.end,
                    skip: !0,
                    contains: ["self"]
                }]
            }]
        }, $, {
            beginKeywords: "while if switch catch for"
        }, {
            begin: "\\b(?!function)" + e.UNDERSCORE_IDENT_RE + "\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)\\s*\\{",
            returnBegin: !0,
            label: "func.def",
            contains: [B, e.inherit(e.TITLE_MODE, {
                begin: a,
                className: "title.function"
            })]
        }, {
            match: /\.\.\./,
            relevance: 0
        }, z, {
            match: "\\$" + a,
            relevance: 0
        }, {
            match: [/\bconstructor(?=\s*\()/],
            className: {
                1: "title.function"
            },
            contains: [B]
        }, V, X, P, K, {
            match: /\$[(.]/
        }]
    }
}
function vt(e) {
    const n = e.regex
      , t = e.COMMENT("//", "$", {
        contains: [{
            begin: /\\\n/
        }]
    })
      , a = "decltype\\(auto\\)"
      , c = "[a-zA-Z_]\\w*::"
      , l = "<[^<>]+>"
      , r = "(?!struct)(" + a + "|" + n.optional(c) + "[a-zA-Z_]\\w*" + n.optional(l) + ")"
      , s = {
        className: "type",
        begin: "\\b[a-z\\d_]*_t\\b"
    }
      , i = "\\\\(x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4,8}|[0-7]{3}|\\S)"
      , u = {
        className: "string",
        variants: [{
            begin: '(u8?|U|L)?"',
            end: '"',
            illegal: "\\n",
            contains: [e.BACKSLASH_ESCAPE]
        }, {
            begin: "(u8?|U|L)?'(" + i + "|.)",
            end: "'",
            illegal: "."
        }, e.END_SAME_AS_BEGIN({
            begin: /(?:u8?|U|L)?R"([^()\\ ]{0,16})\(/,
            end: /\)([^()\\ ]{0,16})"/
        })]
    }
      , p = {
        className: "number",
        variants: [{
            begin: "\\b(0b[01']+)"
        }, {
            begin: "(-?)\\b([\\d']+(\\.[\\d']*)?|\\.[\\d']+)((ll|LL|l|L)(u|U)?|(u|U)(ll|LL|l|L)?|f|F|b|B)"
        }, {
            begin: "(-?)(\\b0[xX][a-fA-F0-9']+|(\\b[\\d']+(\\.[\\d']*)?|\\.[\\d']+)([eE][-+]?[\\d']+)?)"
        }],
        relevance: 0
    }
      , h = {
        className: "meta",
        begin: /#\s*[a-z]+\b/,
        end: /$/,
        keywords: {
            keyword: "if else elif endif define undef warning error line pragma _Pragma ifdef ifndef include"
        },
        contains: [{
            begin: /\\\n/,
            relevance: 0
        }, e.inherit(u, {
            className: "string"
        }), {
            className: "string",
            begin: /<.*?>/
        }, t, e.C_BLOCK_COMMENT_MODE]
    }
      , f = {
        className: "title",
        begin: n.optional(c) + e.IDENT_RE,
        relevance: 0
    }
      , N = n.optional(c) + e.IDENT_RE + "\\s*\\("
      , T = ["alignas", "alignof", "and", "and_eq", "asm", "atomic_cancel", "atomic_commit", "atomic_noexcept", "auto", "bitand", "bitor", "break", "case", "catch", "class", "co_await", "co_return", "co_yield", "compl", "concept", "const_cast|10", "consteval", "constexpr", "constinit", "continue", "decltype", "default", "delete", "do", "dynamic_cast|10", "else", "enum", "explicit", "export", "extern", "false", "final", "for", "friend", "goto", "if", "import", "inline", "module", "mutable", "namespace", "new", "noexcept", "not", "not_eq", "nullptr", "operator", "or", "or_eq", "override", "private", "protected", "public", "reflexpr", "register", "reinterpret_cast|10", "requires", "return", "sizeof", "static_assert", "static_cast|10", "struct", "switch", "synchronized", "template", "this", "thread_local", "throw", "transaction_safe", "transaction_safe_dynamic", "true", "try", "typedef", "typeid", "typename", "union", "using", "virtual", "volatile", "while", "xor", "xor_eq"]
      , R = ["bool", "char", "char16_t", "char32_t", "char8_t", "double", "float", "int", "long", "short", "void", "wchar_t", "unsigned", "signed", "const", "static"]
      , M = ["any", "auto_ptr", "barrier", "binary_semaphore", "bitset", "complex", "condition_variable", "condition_variable_any", "counting_semaphore", "deque", "false_type", "future", "imaginary", "initializer_list", "istringstream", "jthread", "latch", "lock_guard", "multimap", "multiset", "mutex", "optional", "ostringstream", "packaged_task", "pair", "promise", "priority_queue", "queue", "recursive_mutex", "recursive_timed_mutex", "scoped_lock", "set", "shared_future", "shared_lock", "shared_mutex", "shared_timed_mutex", "shared_ptr", "stack", "string_view", "stringstream", "timed_mutex", "thread", "true_type", "tuple", "unique_lock", "unique_ptr", "unordered_map", "unordered_multimap", "unordered_multiset", "unordered_set", "variant", "vector", "weak_ptr", "wstring", "wstring_view"]
      , I = ["abort", "abs", "acos", "apply", "as_const", "asin", "atan", "atan2", "calloc", "ceil", "cerr", "cin", "clog", "cos", "cosh", "cout", "declval", "endl", "exchange", "exit", "exp", "fabs", "floor", "fmod", "forward", "fprintf", "fputs", "free", "frexp", "fscanf", "future", "invoke", "isalnum", "isalpha", "iscntrl", "isdigit", "isgraph", "islower", "isprint", "ispunct", "isspace", "isupper", "isxdigit", "labs", "launder", "ldexp", "log", "log10", "make_pair", "make_shared", "make_shared_for_overwrite", "make_tuple", "make_unique", "malloc", "memchr", "memcmp", "memcpy", "memset", "modf", "move", "pow", "printf", "putchar", "puts", "realloc", "scanf", "sin", "sinh", "snprintf", "sprintf", "sqrt", "sscanf", "std", "stderr", "stdin", "stdout", "strcat", "strchr", "strcmp", "strcpy", "strcspn", "strlen", "strncat", "strncmp", "strncpy", "strpbrk", "strrchr", "strspn", "strstr", "swap", "tan", "tanh", "terminate", "to_underlying", "tolower", "toupper", "vfprintf", "visit", "vprintf", "vsprintf"]
      , O = {
        type: R,
        keyword: T,
        literal: ["NULL", "false", "nullopt", "nullptr", "true"],
        built_in: ["_Pragma"],
        _type_hints: M
    }
      , B = {
        className: "function.dispatch",
        relevance: 0,
        keywords: {
            _hint: I
        },
        begin: n.concat(/\b/, /(?!decltype)/, /(?!if)/, /(?!for)/, /(?!switch)/, /(?!while)/, e.IDENT_RE, n.lookahead(/(<[^<>]+>|)\s*\(/))
    }
      , P = [B, h, s, t, e.C_BLOCK_COMMENT_MODE, p, u]
      , x = {
        variants: [{
            begin: /=/,
            end: /;/
        }, {
            begin: /\(/,
            end: /\)/
        }, {
            beginKeywords: "new throw return else",
            end: /;/
        }],
        keywords: O,
        contains: P.concat([{
            begin: /\(/,
            end: /\)/,
            keywords: O,
            contains: P.concat(["self"]),
            relevance: 0
        }]),
        relevance: 0
    }
      , W = {
        className: "function",
        begin: "(" + r + "[\\*&\\s]+)+" + N,
        returnBegin: !0,
        end: /[{;=]/,
        excludeEnd: !0,
        keywords: O,
        illegal: /[^\w\s\*&:<>.]/,
        contains: [{
            begin: a,
            keywords: O,
            relevance: 0
        }, {
            begin: N,
            returnBegin: !0,
            contains: [f],
            relevance: 0
        }, {
            begin: /::/,
            relevance: 0
        }, {
            begin: /:/,
            endsWithParent: !0,
            contains: [u, p]
        }, {
            relevance: 0,
            match: /,/
        }, {
            className: "params",
            begin: /\(/,
            end: /\)/,
            keywords: O,
            relevance: 0,
            contains: [t, e.C_BLOCK_COMMENT_MODE, u, p, s, {
                begin: /\(/,
                end: /\)/,
                keywords: O,
                relevance: 0,
                contains: ["self", t, e.C_BLOCK_COMMENT_MODE, u, p, s]
            }]
        }, s, t, e.C_BLOCK_COMMENT_MODE, h]
    };
    return {
        name: "C++",
        aliases: ["cc", "c++", "h++", "hpp", "hh", "hxx", "cxx"],
        keywords: O,
        illegal: "</",
        classNameAliases: {
            "function.dispatch": "built_in"
        },
        contains: [].concat(x, W, B, P, [h, {
            begin: "\\b(deque|list|queue|priority_queue|pair|stack|vector|map|set|bitset|multiset|multimap|unordered_map|unordered_set|unordered_multiset|unordered_multimap|array|tuple|optional|variant|function)\\s*<(?!<)",
            end: ">",
            keywords: O,
            contains: ["self", s]
        }, {
            begin: e.IDENT_RE + "::",
            keywords: O
        }, {
            match: [/\b(?:enum(?:\s+(?:class|struct))?|class|struct|union)/, /\s+/, /\w+/],
            className: {
                1: "keyword",
                3: "title.class"
            }
        }])
    }
}
function At(e) {
    const n = ["bool", "byte", "char", "decimal", "delegate", "double", "dynamic", "enum", "float", "int", "long", "nint", "nuint", "object", "sbyte", "short", "string", "ulong", "uint", "ushort"]
      , t = ["public", "private", "protected", "static", "internal", "protected", "abstract", "async", "extern", "override", "unsafe", "virtual", "new", "sealed", "partial"]
      , a = ["default", "false", "null", "true"]
      , c = ["abstract", "as", "base", "break", "case", "catch", "class", "const", "continue", "do", "else", "event", "explicit", "extern", "finally", "fixed", "for", "foreach", "goto", "if", "implicit", "in", "interface", "internal", "is", "lock", "namespace", "new", "operator", "out", "override", "params", "private", "protected", "public", "readonly", "record", "ref", "return", "scoped", "sealed", "sizeof", "stackalloc", "static", "struct", "switch", "this", "throw", "try", "typeof", "unchecked", "unsafe", "using", "virtual", "void", "volatile", "while"]
      , l = ["add", "alias", "and", "ascending", "async", "await", "by", "descending", "equals", "from", "get", "global", "group", "init", "into", "join", "let", "nameof", "not", "notnull", "on", "or", "orderby", "partial", "remove", "select", "set", "unmanaged", "value|0", "var", "when", "where", "with", "yield"]
      , r = {
        keyword: c.concat(l),
        built_in: n,
        literal: a
    }
      , s = e.inherit(e.TITLE_MODE, {
        begin: "[a-zA-Z](\\.?\\w)*"
    })
      , i = {
        className: "number",
        variants: [{
            begin: "\\b(0b[01']+)"
        }, {
            begin: "(-?)\\b([\\d']+(\\.[\\d']*)?|\\.[\\d']+)(u|U|l|L|ul|UL|f|F|b|B)"
        }, {
            begin: "(-?)(\\b0[xX][a-fA-F0-9']+|(\\b[\\d']+(\\.[\\d']*)?|\\.[\\d']+)([eE][-+]?[\\d']+)?)"
        }],
        relevance: 0
    }
      , u = {
        className: "string",
        begin: '@"',
        end: '"',
        contains: [{
            begin: '""'
        }]
    }
      , p = e.inherit(u, {
        illegal: /\n/
    })
      , h = {
        className: "subst",
        begin: /\{/,
        end: /\}/,
        keywords: r
    }
      , f = e.inherit(h, {
        illegal: /\n/
    })
      , N = {
        className: "string",
        begin: /\$"/,
        end: '"',
        illegal: /\n/,
        contains: [{
            begin: /\{\{/
        }, {
            begin: /\}\}/
        }, e.BACKSLASH_ESCAPE, f]
    }
      , T = {
        className: "string",
        begin: /\$@"/,
        end: '"',
        contains: [{
            begin: /\{\{/
        }, {
            begin: /\}\}/
        }, {
            begin: '""'
        }, h]
    }
      , R = e.inherit(T, {
        illegal: /\n/,
        contains: [{
            begin: /\{\{/
        }, {
            begin: /\}\}/
        }, {
            begin: '""'
        }, f]
    });
    h.contains = [T, N, u, e.APOS_STRING_MODE, e.QUOTE_STRING_MODE, i, e.C_BLOCK_COMMENT_MODE],
    f.contains = [R, N, p, e.APOS_STRING_MODE, e.QUOTE_STRING_MODE, i, e.inherit(e.C_BLOCK_COMMENT_MODE, {
        illegal: /\n/
    })];
    const M = {
        variants: [T, N, u, e.APOS_STRING_MODE, e.QUOTE_STRING_MODE]
    }
      , I = {
        begin: "<",
        end: ">",
        contains: [{
            beginKeywords: "in out"
        }, s]
    }
      , k = e.IDENT_RE + "(<" + e.IDENT_RE + "(\\s*,\\s*" + e.IDENT_RE + ")*>)?(\\[\\])?"
      , w = {
        begin: "@" + e.IDENT_RE,
        relevance: 0
    };
    return {
        name: "C#",
        aliases: ["cs", "c#"],
        keywords: r,
        illegal: /::/,
        contains: [e.COMMENT("///", "$", {
            returnBegin: !0,
            contains: [{
                className: "doctag",
                variants: [{
                    begin: "///",
                    relevance: 0
                }, {
                    begin: "<!--|-->"
                }, {
                    begin: "</?",
                    end: ">"
                }]
            }]
        }), e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE, {
            className: "meta",
            begin: "#",
            end: "$",
            keywords: {
                keyword: "if else elif endif define undef warning error line region endregion pragma checksum"
            }
        }, M, i, {
            beginKeywords: "class interface",
            relevance: 0,
            end: /[{;=]/,
            illegal: /[^\s:,]/,
            contains: [{
                beginKeywords: "where class"
            }, s, I, e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE]
        }, {
            beginKeywords: "namespace",
            relevance: 0,
            end: /[{;=]/,
            illegal: /[^\s:]/,
            contains: [s, e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE]
        }, {
            beginKeywords: "record",
            relevance: 0,
            end: /[{;=]/,
            illegal: /[^\s:]/,
            contains: [s, I, e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE]
        }, {
            className: "meta",
            begin: "^\\s*\\[(?=[\\w])",
            excludeBegin: !0,
            end: "\\]",
            excludeEnd: !0,
            contains: [{
                className: "string",
                begin: /"/,
                end: /"/
            }]
        }, {
            beginKeywords: "new return throw await else",
            relevance: 0
        }, {
            className: "function",
            begin: "(" + k + "\\s+)+" + e.IDENT_RE + "\\s*(<[^=]+>\\s*)?\\(",
            returnBegin: !0,
            end: /\s*[{;=]/,
            excludeEnd: !0,
            keywords: r,
            contains: [{
                beginKeywords: t.join(" "),
                relevance: 0
            }, {
                begin: e.IDENT_RE + "\\s*(<[^=]+>\\s*)?\\(",
                returnBegin: !0,
                contains: [e.TITLE_MODE, I],
                relevance: 0
            }, {
                match: /\(\)/
            }, {
                className: "params",
                begin: /\(/,
                end: /\)/,
                excludeBegin: !0,
                excludeEnd: !0,
                keywords: r,
                relevance: 0,
                contains: [M, i, e.C_BLOCK_COMMENT_MODE]
            }, e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE]
        }, w]
    }
}
function Mt(e) {
    const n = {
        className: "built_in",
        begin: "\\b(AV|CA|CF|CG|CI|CL|CM|CN|CT|MK|MP|MTK|MTL|NS|SCN|SK|UI|WK|XC)\\w+"
    }
      , t = /[a-zA-Z@][a-zA-Z0-9_]*/
      , s = {
        "variable.language": ["this", "super"],
        $pattern: t,
        keyword: ["while", "export", "sizeof", "typedef", "const", "struct", "for", "union", "volatile", "static", "mutable", "if", "do", "return", "goto", "enum", "else", "break", "extern", "asm", "case", "default", "register", "explicit", "typename", "switch", "continue", "inline", "readonly", "assign", "readwrite", "self", "@synchronized", "id", "typeof", "nonatomic", "IBOutlet", "IBAction", "strong", "weak", "copy", "in", "out", "inout", "bycopy", "byref", "oneway", "__strong", "__weak", "__block", "__autoreleasing", "@private", "@protected", "@public", "@try", "@property", "@end", "@throw", "@catch", "@finally", "@autoreleasepool", "@synthesize", "@dynamic", "@selector", "@optional", "@required", "@encode", "@package", "@import", "@defs", "@compatibility_alias", "__bridge", "__bridge_transfer", "__bridge_retained", "__bridge_retain", "__covariant", "__contravariant", "__kindof", "_Nonnull", "_Nullable", "_Null_unspecified", "__FUNCTION__", "__PRETTY_FUNCTION__", "__attribute__", "getter", "setter", "retain", "unsafe_unretained", "nonnull", "nullable", "null_unspecified", "null_resettable", "class", "instancetype", "NS_DESIGNATED_INITIALIZER", "NS_UNAVAILABLE", "NS_REQUIRES_SUPER", "NS_RETURNS_INNER_POINTER", "NS_INLINE", "NS_AVAILABLE", "NS_DEPRECATED", "NS_ENUM", "NS_OPTIONS", "NS_SWIFT_UNAVAILABLE", "NS_ASSUME_NONNULL_BEGIN", "NS_ASSUME_NONNULL_END", "NS_REFINED_FOR_SWIFT", "NS_SWIFT_NAME", "NS_SWIFT_NOTHROW", "NS_DURING", "NS_HANDLER", "NS_ENDHANDLER", "NS_VALUERETURN", "NS_VOIDRETURN"],
        literal: ["false", "true", "FALSE", "TRUE", "nil", "YES", "NO", "NULL"],
        built_in: ["dispatch_once_t", "dispatch_queue_t", "dispatch_sync", "dispatch_async", "dispatch_once"],
        type: ["int", "float", "char", "unsigned", "signed", "short", "long", "double", "wchar_t", "unichar", "void", "bool", "BOOL", "id|0", "_Bool"]
    }
      , i = {
        $pattern: t,
        keyword: ["@interface", "@class", "@protocol", "@implementation"]
    };
    return {
        name: "Objective-C",
        aliases: ["mm", "objc", "obj-c", "obj-c++", "objective-c++"],
        keywords: s,
        illegal: "</",
        contains: [n, e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE, e.C_NUMBER_MODE, e.QUOTE_STRING_MODE, e.APOS_STRING_MODE, {
            className: "string",
            variants: [{
                begin: '@"',
                end: '"',
                illegal: "\\n",
                contains: [e.BACKSLASH_ESCAPE]
            }]
        }, {
            className: "meta",
            begin: /#\s*[a-z]+\b/,
            end: /$/,
            keywords: {
                keyword: "if else elif endif define undef warning error line pragma ifdef ifndef include"
            },
            contains: [{
                begin: /\\\n/,
                relevance: 0
            }, e.inherit(e.QUOTE_STRING_MODE, {
                className: "string"
            }), {
                className: "string",
                begin: /<.*?>/,
                end: /$/,
                illegal: "\\n"
            }, e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE]
        }, {
            className: "class",
            begin: "(" + i.keyword.join("|") + ")\\b",
            end: /(\{|$)/,
            excludeEnd: !0,
            keywords: i,
            contains: [e.UNDERSCORE_TITLE_MODE]
        }, {
            begin: "\\." + e.UNDERSCORE_IDENT_RE,
            relevance: 0
        }]
    }
}
var te = "[0-9](_*[0-9])*"
  , ge = `\\.(${te})`
  , _e = "[0-9a-fA-F](_*[0-9a-fA-F])*"
  , Ze = {
    className: "number",
    variants: [{
        begin: `(\\b(${te})((${ge})|\\.)?|(${ge}))[eE][+-]?(${te})[fFdD]?\\b`
    }, {
        begin: `\\b(${te})((${ge})[fFdD]?\\b|\\.([fFdD]\\b)?)`
    }, {
        begin: `(${ge})[fFdD]?\\b`
    }, {
        begin: `\\b(${te})[fFdD]\\b`
    }, {
        begin: `\\b0[xX]((${_e})\\.?|(${_e})?\\.(${_e}))[pP][+-]?(${te})[fFdD]?\\b`
    }, {
        begin: "\\b(0|[1-9](_*[0-9])*)[lL]?\\b"
    }, {
        begin: `\\b0[xX](${_e})[lL]?\\b`
    }, {
        begin: "\\b0(_*[0-7])*[lL]?\\b"
    }, {
        begin: "\\b0[bB][01](_*[01])*[lL]?\\b"
    }],
    relevance: 0
};
function _n(e, n, t) {
    return t === -1 ? "" : e.replace(n, a=>_n(e, n, t - 1))
}
function wt(e) {
    const n = e.regex
      , t = "[À-ʸa-zA-Z_$][À-ʸa-zA-Z_$0-9]*"
      , a = t + _n("(?:<" + t + "~~~(?:\\s*,\\s*" + t + "~~~)*>)?", /~~~/g, 2)
      , i = {
        keyword: ["synchronized", "abstract", "private", "var", "static", "if", "const ", "for", "while", "strictfp", "finally", "protected", "import", "native", "final", "void", "enum", "else", "break", "transient", "catch", "instanceof", "volatile", "case", "assert", "package", "default", "public", "try", "switch", "continue", "throws", "protected", "public", "private", "module", "requires", "exports", "do", "sealed", "yield", "permits"],
        literal: ["false", "true", "null"],
        type: ["char", "boolean", "long", "float", "int", "byte", "short", "double"],
        built_in: ["super", "this"]
    }
      , u = {
        className: "meta",
        begin: "@" + t,
        contains: [{
            begin: /\(/,
            end: /\)/,
            contains: ["self"]
        }]
    }
      , p = {
        className: "params",
        begin: /\(/,
        end: /\)/,
        keywords: i,
        relevance: 0,
        contains: [e.C_BLOCK_COMMENT_MODE],
        endsParent: !0
    };
    return {
        name: "Java",
        aliases: ["jsp"],
        keywords: i,
        illegal: /<\/|#/,
        contains: [e.COMMENT("/\\*\\*", "\\*/", {
            relevance: 0,
            contains: [{
                begin: /\w+@/,
                relevance: 0
            }, {
                className: "doctag",
                begin: "@[A-Za-z]+"
            }]
        }), {
            begin: /import java\.[a-z]+\./,
            keywords: "import",
            relevance: 2
        }, e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE, {
            begin: /"""/,
            end: /"""/,
            className: "string",
            contains: [e.BACKSLASH_ESCAPE]
        }, e.APOS_STRING_MODE, e.QUOTE_STRING_MODE, {
            match: [/\b(?:class|interface|enum|extends|implements|new)/, /\s+/, t],
            className: {
                1: "keyword",
                3: "title.class"
            }
        }, {
            match: /non-sealed/,
            scope: "keyword"
        }, {
            begin: [n.concat(/(?!else)/, t), /\s+/, t, /\s+/, /=(?!=)/],
            className: {
                1: "type",
                3: "variable",
                5: "operator"
            }
        }, {
            begin: [/record/, /\s+/, t],
            className: {
                1: "keyword",
                3: "title.class"
            },
            contains: [p, e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE]
        }, {
            beginKeywords: "new throw return else",
            relevance: 0
        }, {
            begin: ["(?:" + a + "\\s+)", e.UNDERSCORE_IDENT_RE, /\s*(?=\()/],
            className: {
                2: "title.function"
            },
            keywords: i,
            contains: [{
                className: "params",
                begin: /\(/,
                end: /\)/,
                keywords: i,
                relevance: 0,
                contains: [u, e.APOS_STRING_MODE, e.QUOTE_STRING_MODE, Ze, e.C_BLOCK_COMMENT_MODE]
            }, e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE]
        }, Ze, u]
    }
}
function It(e) {
    const n = e.regex
      , t = {}
      , a = {
        begin: /\$\{/,
        end: /\}/,
        contains: ["self", {
            begin: /:-/,
            contains: [t]
        }]
    };
    Object.assign(t, {
        className: "variable",
        variants: [{
            begin: n.concat(/\$[\w\d#@][\w\d_]*/, "(?![\\w\\d])(?![$])")
        }, a]
    });
    const c = {
        className: "subst",
        begin: /\$\(/,
        end: /\)/,
        contains: [e.BACKSLASH_ESCAPE]
    }
      , l = {
        begin: /<<-?\s*(?=\w+)/,
        starts: {
            contains: [e.END_SAME_AS_BEGIN({
                begin: /(\w+)/,
                end: /(\w+)/,
                className: "string"
            })]
        }
    }
      , r = {
        className: "string",
        begin: /"/,
        end: /"/,
        contains: [e.BACKSLASH_ESCAPE, t, c]
    };
    c.contains.push(r);
    const s = {
        className: "",
        begin: /\\"/
    }
      , i = {
        className: "string",
        begin: /'/,
        end: /'/
    }
      , u = {
        begin: /\$?\(\(/,
        end: /\)\)/,
        contains: [{
            begin: /\d+#[0-9a-f]+/,
            className: "number"
        }, e.NUMBER_MODE, t]
    }
      , p = ["fish", "bash", "zsh", "sh", "csh", "ksh", "tcsh", "dash", "scsh"]
      , h = e.SHEBANG({
        binary: `(${p.join("|")})`,
        relevance: 10
    })
      , f = {
        className: "function",
        begin: /\w[\w\d_]*\s*\(\s*\)\s*\{/,
        returnBegin: !0,
        contains: [e.inherit(e.TITLE_MODE, {
            begin: /\w[\w\d_]*/
        })],
        relevance: 0
    }
      , N = ["if", "then", "else", "elif", "fi", "for", "while", "in", "do", "done", "case", "esac", "function"]
      , T = ["true", "false"]
      , R = {
        match: /(\/[a-z._-]+)+/
    }
      , M = ["break", "cd", "continue", "eval", "exec", "exit", "export", "getopts", "hash", "pwd", "readonly", "return", "shift", "test", "times", "trap", "umask", "unset"]
      , I = ["alias", "bind", "builtin", "caller", "command", "declare", "echo", "enable", "help", "let", "local", "logout", "mapfile", "printf", "read", "readarray", "source", "type", "typeset", "ulimit", "unalias"]
      , k = ["autoload", "bg", "bindkey", "bye", "cap", "chdir", "clone", "comparguments", "compcall", "compctl", "compdescribe", "compfiles", "compgroups", "compquote", "comptags", "comptry", "compvalues", "dirs", "disable", "disown", "echotc", "echoti", "emulate", "fc", "fg", "float", "functions", "getcap", "getln", "history", "integer", "jobs", "kill", "limit", "log", "noglob", "popd", "print", "pushd", "pushln", "rehash", "sched", "setcap", "setopt", "stat", "suspend", "ttyctl", "unfunction", "unhash", "unlimit", "unsetopt", "vared", "wait", "whence", "where", "which", "zcompile", "zformat", "zftp", "zle", "zmodload", "zparseopts", "zprof", "zpty", "zregexparse", "zsocket", "zstyle", "ztcp"]
      , w = ["chcon", "chgrp", "chown", "chmod", "cp", "dd", "df", "dir", "dircolors", "ln", "ls", "mkdir", "mkfifo", "mknod", "mktemp", "mv", "realpath", "rm", "rmdir", "shred", "sync", "touch", "truncate", "vdir", "b2sum", "base32", "base64", "cat", "cksum", "comm", "csplit", "cut", "expand", "fmt", "fold", "head", "join", "md5sum", "nl", "numfmt", "od", "paste", "ptx", "pr", "sha1sum", "sha224sum", "sha256sum", "sha384sum", "sha512sum", "shuf", "sort", "split", "sum", "tac", "tail", "tr", "tsort", "unexpand", "uniq", "wc", "arch", "basename", "chroot", "date", "dirname", "du", "echo", "env", "expr", "factor", "groups", "hostid", "id", "link", "logname", "nice", "nohup", "nproc", "pathchk", "pinky", "printenv", "printf", "pwd", "readlink", "runcon", "seq", "sleep", "stat", "stdbuf", "stty", "tee", "test", "timeout", "tty", "uname", "unlink", "uptime", "users", "who", "whoami", "yes"];
    return {
        name: "Bash",
        aliases: ["sh"],
        keywords: {
            $pattern: /\b[a-z][a-z0-9._-]+\b/,
            keyword: N,
            literal: T,
            built_in: [...M, ...I, "set", "shopt", ...k, ...w]
        },
        contains: [h, e.SHEBANG(), f, u, e.HASH_COMMENT_MODE, l, R, r, s, i, t]
    }
}
function Ct(e) {
    const n = e.regex
      , t = n.concat(/[\p{L}_]/u, n.optional(/[\p{L}0-9_.-]*:/u), /[\p{L}0-9_.-]*/u)
      , a = /[\p{L}0-9._:-]+/u
      , c = {
        className: "symbol",
        begin: /&[a-z]+;|&#[0-9]+;|&#x[a-f0-9]+;/
    }
      , l = {
        begin: /\s/,
        contains: [{
            className: "keyword",
            begin: /#?[a-z_][a-z1-9_-]+/,
            illegal: /\n/
        }]
    }
      , r = e.inherit(l, {
        begin: /\(/,
        end: /\)/
    })
      , s = e.inherit(e.APOS_STRING_MODE, {
        className: "string"
    })
      , i = e.inherit(e.QUOTE_STRING_MODE, {
        className: "string"
    })
      , u = {
        endsWithParent: !0,
        illegal: /</,
        relevance: 0,
        contains: [{
            className: "attr",
            begin: a,
            relevance: 0
        }, {
            begin: /=\s*/,
            relevance: 0,
            contains: [{
                className: "string",
                endsParent: !0,
                variants: [{
                    begin: /"/,
                    end: /"/,
                    contains: [c]
                }, {
                    begin: /'/,
                    end: /'/,
                    contains: [c]
                }, {
                    begin: /[^\s"'=<>`]+/
                }]
            }]
        }]
    };
    return {
        name: "HTML, XML",
        aliases: ["html", "xhtml", "rss", "atom", "xjb", "xsd", "xsl", "plist", "wsf", "svg"],
        case_insensitive: !0,
        unicodeRegex: !0,
        contains: [{
            className: "meta",
            begin: /<![a-z]/,
            end: />/,
            relevance: 10,
            contains: [l, i, s, r, {
                begin: /\[/,
                end: /\]/,
                contains: [{
                    className: "meta",
                    begin: /<![a-z]/,
                    end: />/,
                    contains: [l, r, i, s]
                }]
            }]
        }, e.COMMENT(/<!--/, /-->/, {
            relevance: 10
        }), {
            begin: /<!\[CDATA\[/,
            end: /\]\]>/,
            relevance: 10
        }, c, {
            className: "meta",
            end: /\?>/,
            variants: [{
                begin: /<\?xml/,
                relevance: 10,
                contains: [i]
            }, {
                begin: /<\?[a-z][a-z0-9]+/
            }]
        }, {
            className: "tag",
            begin: /<style(?=\s|>)/,
            end: />/,
            keywords: {
                name: "style"
            },
            contains: [u],
            starts: {
                end: /<\/style>/,
                returnEnd: !0,
                subLanguage: ["css", "xml"]
            }
        }, {
            className: "tag",
            begin: /<script(?=\s|>)/,
            end: />/,
            keywords: {
                name: "script"
            },
            contains: [u],
            starts: {
                end: /<\/script>/,
                returnEnd: !0,
                subLanguage: ["javascript", "handlebars", "xml"]
            }
        }, {
            className: "tag",
            begin: /<>|<\/>/
        }, {
            className: "tag",
            begin: n.concat(/</, n.lookahead(n.concat(t, n.either(/\/>/, />/, /\s/)))),
            end: /\/?>/,
            contains: [{
                className: "name",
                begin: t,
                relevance: 0,
                starts: u
            }]
        }, {
            className: "tag",
            begin: n.concat(/<\//, n.lookahead(n.concat(t, />/))),
            contains: [{
                className: "name",
                begin: t,
                relevance: 0
            }, {
                begin: />/,
                relevance: 0,
                endsParent: !0
            }]
        }]
    }
}
function Lt(e) {
    const n = "true false yes no null"
      , t = "[\\w#;/?:@&=+$,.~*'()[\\]]+"
      , a = {
        className: "attr",
        variants: [{
            begin: "\\w[\\w :\\/.-]*:(?=[ 	]|$)"
        }, {
            begin: '"\\w[\\w :\\/.-]*":(?=[ 	]|$)'
        }, {
            begin: "'\\w[\\w :\\/.-]*':(?=[ 	]|$)"
        }]
    }
      , c = {
        className: "template-variable",
        variants: [{
            begin: /\{\{/,
            end: /\}\}/
        }, {
            begin: /%\{/,
            end: /\}/
        }]
    }
      , l = {
        className: "string",
        relevance: 0,
        variants: [{
            begin: /'/,
            end: /'/
        }, {
            begin: /"/,
            end: /"/
        }, {
            begin: /\S+/
        }],
        contains: [e.BACKSLASH_ESCAPE, c]
    }
      , r = e.inherit(l, {
        variants: [{
            begin: /'/,
            end: /'/
        }, {
            begin: /"/,
            end: /"/
        }, {
            begin: /[^\s,{}[\]]+/
        }]
    })
      , s = "[0-9]{4}(-[0-9][0-9]){0,2}"
      , i = "([Tt \\t][0-9][0-9]?(:[0-9][0-9]){2})?"
      , u = "(\\.[0-9]*)?"
      , p = "([ \\t])*(Z|[-+][0-9][0-9]?(:[0-9][0-9])?)?"
      , h = {
        className: "number",
        begin: "\\b" + s + i + u + p + "\\b"
    }
      , f = {
        end: ",",
        endsWithParent: !0,
        excludeEnd: !0,
        keywords: n,
        relevance: 0
    }
      , N = {
        begin: /\{/,
        end: /\}/,
        contains: [f],
        illegal: "\\n",
        relevance: 0
    }
      , T = {
        begin: "\\[",
        end: "\\]",
        contains: [f],
        illegal: "\\n",
        relevance: 0
    }
      , R = [a, {
        className: "meta",
        begin: "^---\\s*$",
        relevance: 10
    }, {
        className: "string",
        begin: "[\\|>]([1-9]?[+-])?[ ]*\\n( +)[^ ][^\\n]*\\n(\\2[^\\n]+\\n?)*"
    }, {
        begin: "<%[%=-]?",
        end: "[%-]?%>",
        subLanguage: "ruby",
        excludeBegin: !0,
        excludeEnd: !0,
        relevance: 0
    }, {
        className: "type",
        begin: "!\\w+!" + t
    }, {
        className: "type",
        begin: "!<" + t + ">"
    }, {
        className: "type",
        begin: "!" + t
    }, {
        className: "type",
        begin: "!!" + t
    }, {
        className: "meta",
        begin: "&" + e.UNDERSCORE_IDENT_RE + "$"
    }, {
        className: "meta",
        begin: "\\*" + e.UNDERSCORE_IDENT_RE + "$"
    }, {
        className: "bullet",
        begin: "-(?=[ ]|$)",
        relevance: 0
    }, e.HASH_COMMENT_MODE, {
        beginKeywords: n,
        keywords: {
            literal: n
        }
    }, h, {
        className: "number",
        begin: e.C_NUMBER_RE + "\\b",
        relevance: 0
    }, N, T, l]
      , M = [...R];
    return M.pop(),
    M.push(r),
    f.contains = M,
    {
        name: "YAML",
        case_insensitive: !0,
        aliases: ["yml"],
        contains: R
    }
}
function xt(e) {
    const n = ["exports", "register", "file", "shl", "array", "record", "property", "for", "mod", "while", "set", "ally", "label", "uses", "raise", "not", "stored", "class", "safecall", "var", "interface", "or", "private", "static", "exit", "index", "inherited", "to", "else", "stdcall", "override", "shr", "asm", "far", "resourcestring", "finalization", "packed", "virtual", "out", "and", "protected", "library", "do", "xorwrite", "goto", "near", "function", "end", "div", "overload", "object", "unit", "begin", "string", "on", "inline", "repeat", "until", "destructor", "write", "message", "program", "with", "read", "initialization", "except", "default", "nil", "if", "case", "cdecl", "in", "downto", "threadvar", "of", "try", "pascal", "const", "external", "constructor", "type", "public", "then", "implementation", "finally", "published", "procedure", "absolute", "reintroduce", "operator", "as", "is", "abstract", "alias", "assembler", "bitpacked", "break", "continue", "cppdecl", "cvar", "enumerator", "experimental", "platform", "deprecated", "unimplemented", "dynamic", "export", "far16", "forward", "generic", "helper", "implements", "interrupt", "iochecks", "local", "name", "nodefault", "noreturn", "nostackframe", "oldfpccall", "otherwise", "saveregisters", "softfloat", "specialize", "strict", "unaligned", "varargs"]
      , t = [e.C_LINE_COMMENT_MODE, e.COMMENT(/\{/, /\}/, {
        relevance: 0
    }), e.COMMENT(/\(\*/, /\*\)/, {
        relevance: 10
    })]
      , a = {
        className: "meta",
        variants: [{
            begin: /\{\$/,
            end: /\}/
        }, {
            begin: /\(\*\$/,
            end: /\*\)/
        }]
    }
      , c = {
        className: "string",
        begin: /'/,
        end: /'/,
        contains: [{
            begin: /''/
        }]
    }
      , l = {
        className: "number",
        relevance: 0,
        variants: [{
            begin: "\\$[0-9A-Fa-f]+"
        }, {
            begin: "&[0-7]+"
        }, {
            begin: "%[01]+"
        }]
    }
      , r = {
        className: "string",
        begin: /(#\d+)+/
    }
      , s = {
        begin: e.IDENT_RE + "\\s*=\\s*class\\s*\\(",
        returnBegin: !0,
        contains: [e.TITLE_MODE]
    }
      , i = {
        className: "function",
        beginKeywords: "function constructor destructor procedure",
        end: /[:;]/,
        keywords: "function constructor|10 destructor|10 procedure|10",
        contains: [e.TITLE_MODE, {
            className: "params",
            begin: /\(/,
            end: /\)/,
            keywords: n,
            contains: [c, r, a].concat(t)
        }, a].concat(t)
    };
    return {
        name: "Delphi",
        aliases: ["dpr", "dfm", "pas", "pascal"],
        case_insensitive: !0,
        keywords: n,
        illegal: /"|\$[G-Zg-z]|\/\*|<\/|\|/,
        contains: [c, r, e.NUMBER_MODE, l, s, i, a].concat(t)
    }
}
function Dt(e) {
    const n = e.regex
      , t = /(?:(?:[a-zA-Z]|\.[._a-zA-Z])[._a-zA-Z0-9]*)|\.(?!\d)/
      , a = n.either(/0[xX][0-9a-fA-F]+\.[0-9a-fA-F]*[pP][+-]?\d+i?/, /0[xX][0-9a-fA-F]+(?:[pP][+-]?\d+)?[Li]?/, /(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?[Li]?/)
      , c = /[=!<>:]=|\|\||&&|:::?|<-|<<-|->>|->|\|>|[-+*\/?!$&|:<=>@^~]|\*\*/
      , l = n.either(/[()]/, /[{}]/, /\[\[/, /[[\]]/, /\\/, /,/);
    return {
        name: "R",
        keywords: {
            $pattern: t,
            keyword: "function if in break next repeat else for while",
            literal: "NULL NA TRUE FALSE Inf NaN NA_integer_|10 NA_real_|10 NA_character_|10 NA_complex_|10",
            built_in: "LETTERS letters month.abb month.name pi T F abs acos acosh all any anyNA Arg as.call as.character as.complex as.double as.environment as.integer as.logical as.null.default as.numeric as.raw asin asinh atan atanh attr attributes baseenv browser c call ceiling class Conj cos cosh cospi cummax cummin cumprod cumsum digamma dim dimnames emptyenv exp expression floor forceAndCall gamma gc.time globalenv Im interactive invisible is.array is.atomic is.call is.character is.complex is.double is.environment is.expression is.finite is.function is.infinite is.integer is.language is.list is.logical is.matrix is.na is.name is.nan is.null is.numeric is.object is.pairlist is.raw is.recursive is.single is.symbol lazyLoadDBfetch length lgamma list log max min missing Mod names nargs nzchar oldClass on.exit pos.to.env proc.time prod quote range Re rep retracemem return round seq_along seq_len seq.int sign signif sin sinh sinpi sqrt standardGeneric substitute sum switch tan tanh tanpi tracemem trigamma trunc unclass untracemem UseMethod xtfrm"
        },
        contains: [e.COMMENT(/#'/, /$/, {
            contains: [{
                scope: "doctag",
                match: /@examples/,
                starts: {
                    end: n.lookahead(n.either(/\n^#'\s*(?=@[a-zA-Z]+)/, /\n^(?!#')/)),
                    endsParent: !0
                }
            }, {
                scope: "doctag",
                begin: "@param",
                end: /$/,
                contains: [{
                    scope: "variable",
                    variants: [{
                        match: t
                    }, {
                        match: /`(?:\\.|[^`\\])+`/
                    }],
                    endsParent: !0
                }]
            }, {
                scope: "doctag",
                match: /@[a-zA-Z]+/
            }, {
                scope: "keyword",
                match: /\\[a-zA-Z]+/
            }]
        }), e.HASH_COMMENT_MODE, {
            scope: "string",
            contains: [e.BACKSLASH_ESCAPE],
            variants: [e.END_SAME_AS_BEGIN({
                begin: /[rR]"(-*)\(/,
                end: /\)(-*)"/
            }), e.END_SAME_AS_BEGIN({
                begin: /[rR]"(-*)\{/,
                end: /\}(-*)"/
            }), e.END_SAME_AS_BEGIN({
                begin: /[rR]"(-*)\[/,
                end: /\](-*)"/
            }), e.END_SAME_AS_BEGIN({
                begin: /[rR]'(-*)\(/,
                end: /\)(-*)'/
            }), e.END_SAME_AS_BEGIN({
                begin: /[rR]'(-*)\{/,
                end: /\}(-*)'/
            }), e.END_SAME_AS_BEGIN({
                begin: /[rR]'(-*)\[/,
                end: /\](-*)'/
            }), {
                begin: '"',
                end: '"',
                relevance: 0
            }, {
                begin: "'",
                end: "'",
                relevance: 0
            }]
        }, {
            relevance: 0,
            variants: [{
                scope: {
                    1: "operator",
                    2: "number"
                },
                match: [c, a]
            }, {
                scope: {
                    1: "operator",
                    2: "number"
                },
                match: [/%[^%]*%/, a]
            }, {
                scope: {
                    1: "punctuation",
                    2: "number"
                },
                match: [l, a]
            }, {
                scope: {
                    2: "number"
                },
                match: [/[^a-zA-Z0-9._]|^/, a]
            }]
        }, {
            scope: {
                3: "operator"
            },
            match: [t, /\s+/, /<-/, /\s+/]
        }, {
            scope: "operator",
            relevance: 0,
            variants: [{
                match: c
            }, {
                match: /%[^%]*%/
            }]
        }, {
            scope: "punctuation",
            relevance: 0,
            match: l
        }, {
            begin: "`",
            end: "`",
            contains: [{
                begin: /\\./
            }]
        }]
    }
}
function kt(e) {
    const n = e.regex
      , t = e.COMMENT("--", "$")
      , a = {
        className: "string",
        variants: [{
            begin: /'/,
            end: /'/,
            contains: [{
                begin: /''/
            }]
        }]
    }
      , c = {
        begin: /"/,
        end: /"/,
        contains: [{
            begin: /""/
        }]
    }
      , l = ["true", "false", "unknown"]
      , r = ["double precision", "large object", "with timezone", "without timezone"]
      , s = ["bigint", "binary", "blob", "boolean", "char", "character", "clob", "date", "dec", "decfloat", "decimal", "float", "int", "integer", "interval", "nchar", "nclob", "national", "numeric", "real", "row", "smallint", "time", "timestamp", "varchar", "varying", "varbinary"]
      , i = ["add", "asc", "collation", "desc", "final", "first", "last", "view"]
      , u = ["abs", "acos", "all", "allocate", "alter", "and", "any", "are", "array", "array_agg", "array_max_cardinality", "as", "asensitive", "asin", "asymmetric", "at", "atan", "atomic", "authorization", "avg", "begin", "begin_frame", "begin_partition", "between", "bigint", "binary", "blob", "boolean", "both", "by", "call", "called", "cardinality", "cascaded", "case", "cast", "ceil", "ceiling", "char", "char_length", "character", "character_length", "check", "classifier", "clob", "close", "coalesce", "collate", "collect", "column", "commit", "condition", "connect", "constraint", "contains", "convert", "copy", "corr", "corresponding", "cos", "cosh", "count", "covar_pop", "covar_samp", "create", "cross", "cube", "cume_dist", "current", "current_catalog", "current_date", "current_default_transform_group", "current_path", "current_role", "current_row", "current_schema", "current_time", "current_timestamp", "current_path", "current_role", "current_transform_group_for_type", "current_user", "cursor", "cycle", "date", "day", "deallocate", "dec", "decimal", "decfloat", "declare", "default", "define", "delete", "dense_rank", "deref", "describe", "deterministic", "disconnect", "distinct", "double", "drop", "dynamic", "each", "element", "else", "empty", "end", "end_frame", "end_partition", "end-exec", "equals", "escape", "every", "except", "exec", "execute", "exists", "exp", "external", "extract", "false", "fetch", "filter", "first_value", "float", "floor", "for", "foreign", "frame_row", "free", "from", "full", "function", "fusion", "get", "global", "grant", "group", "grouping", "groups", "having", "hold", "hour", "identity", "in", "indicator", "initial", "inner", "inout", "insensitive", "insert", "int", "integer", "intersect", "intersection", "interval", "into", "is", "join", "json_array", "json_arrayagg", "json_exists", "json_object", "json_objectagg", "json_query", "json_table", "json_table_primitive", "json_value", "lag", "language", "large", "last_value", "lateral", "lead", "leading", "left", "like", "like_regex", "listagg", "ln", "local", "localtime", "localtimestamp", "log", "log10", "lower", "match", "match_number", "match_recognize", "matches", "max", "member", "merge", "method", "min", "minute", "mod", "modifies", "module", "month", "multiset", "national", "natural", "nchar", "nclob", "new", "no", "none", "normalize", "not", "nth_value", "ntile", "null", "nullif", "numeric", "octet_length", "occurrences_regex", "of", "offset", "old", "omit", "on", "one", "only", "open", "or", "order", "out", "outer", "over", "overlaps", "overlay", "parameter", "partition", "pattern", "per", "percent", "percent_rank", "percentile_cont", "percentile_disc", "period", "portion", "position", "position_regex", "power", "precedes", "precision", "prepare", "primary", "procedure", "ptf", "range", "rank", "reads", "real", "recursive", "ref", "references", "referencing", "regr_avgx", "regr_avgy", "regr_count", "regr_intercept", "regr_r2", "regr_slope", "regr_sxx", "regr_sxy", "regr_syy", "release", "result", "return", "returns", "revoke", "right", "rollback", "rollup", "row", "row_number", "rows", "running", "savepoint", "scope", "scroll", "search", "second", "seek", "select", "sensitive", "session_user", "set", "show", "similar", "sin", "sinh", "skip", "smallint", "some", "specific", "specifictype", "sql", "sqlexception", "sqlstate", "sqlwarning", "sqrt", "start", "static", "stddev_pop", "stddev_samp", "submultiset", "subset", "substring", "substring_regex", "succeeds", "sum", "symmetric", "system", "system_time", "system_user", "table", "tablesample", "tan", "tanh", "then", "time", "timestamp", "timezone_hour", "timezone_minute", "to", "trailing", "translate", "translate_regex", "translation", "treat", "trigger", "trim", "trim_array", "true", "truncate", "uescape", "union", "unique", "unknown", "unnest", "update", "upper", "user", "using", "value", "values", "value_of", "var_pop", "var_samp", "varbinary", "varchar", "varying", "versioning", "when", "whenever", "where", "width_bucket", "window", "with", "within", "without", "year"]
      , p = ["abs", "acos", "array_agg", "asin", "atan", "avg", "cast", "ceil", "ceiling", "coalesce", "corr", "cos", "cosh", "count", "covar_pop", "covar_samp", "cume_dist", "dense_rank", "deref", "element", "exp", "extract", "first_value", "floor", "json_array", "json_arrayagg", "json_exists", "json_object", "json_objectagg", "json_query", "json_table", "json_table_primitive", "json_value", "lag", "last_value", "lead", "listagg", "ln", "log", "log10", "lower", "max", "min", "mod", "nth_value", "ntile", "nullif", "percent_rank", "percentile_cont", "percentile_disc", "position", "position_regex", "power", "rank", "regr_avgx", "regr_avgy", "regr_count", "regr_intercept", "regr_r2", "regr_slope", "regr_sxx", "regr_sxy", "regr_syy", "row_number", "sin", "sinh", "sqrt", "stddev_pop", "stddev_samp", "substring", "substring_regex", "sum", "tan", "tanh", "translate", "translate_regex", "treat", "trim", "trim_array", "unnest", "upper", "value_of", "var_pop", "var_samp", "width_bucket"]
      , h = ["current_catalog", "current_date", "current_default_transform_group", "current_path", "current_role", "current_schema", "current_transform_group_for_type", "current_user", "session_user", "system_time", "system_user", "current_time", "localtime", "current_timestamp", "localtimestamp"]
      , f = ["create table", "insert into", "primary key", "foreign key", "not null", "alter table", "add constraint", "grouping sets", "on overflow", "character set", "respect nulls", "ignore nulls", "nulls first", "nulls last", "depth first", "breadth first"]
      , N = p
      , T = [...u, ...i].filter(w=>!p.includes(w))
      , R = {
        className: "variable",
        begin: /@[a-z0-9]+/
    }
      , M = {
        className: "operator",
        begin: /[-+*/=%^~]|&&?|\|\|?|!=?|<(?:=>?|<|>)?|>[>=]?/,
        relevance: 0
    }
      , I = {
        begin: n.concat(/\b/, n.either(...N), /\s*\(/),
        relevance: 0,
        keywords: {
            built_in: N
        }
    };
    function k(w, {exceptions: O, when: B}={}) {
        const P = B;
        return O = O || [],
        w.map(x=>x.match(/\|\d+$/) || O.includes(x) ? x : P(x) ? `${x}|0` : x)
    }
    return {
        name: "SQL",
        case_insensitive: !0,
        illegal: /[{}]|<\//,
        keywords: {
            $pattern: /\b[\w\.]+/,
            keyword: k(T, {
                when: w=>w.length < 3
            }),
            literal: l,
            type: s,
            built_in: h
        },
        contains: [{
            begin: n.either(...f),
            relevance: 0,
            keywords: {
                $pattern: /[\w\.]+/,
                keyword: T.concat(f),
                literal: l,
                type: s
            }
        }, {
            className: "type",
            begin: n.either(...r)
        }, I, R, a, c, e.C_NUMBER_MODE, e.C_BLOCK_COMMENT_MODE, t, M]
    }
}
class Bt {
    "after:highlightElement"({el: n, text: t}) {
        const a = document.createElement("div");
        a.className = "hljs-copy-button",
        a.title = "Copy to clipboard";
        const c = document.createElement("i");
        c.className = "fa fa-copy",
        a.appendChild(c),
        n.appendChild(a),
        a.addEventListener("click", ()=>{
            this.copyToClipboard(t),
            c.classList.remove("fa-copy"),
            c.classList.add("fa-check"),
            setTimeout(()=>{
                c.classList.remove("fa-check"),
                c.classList.add("fa-copy")
            }
            , 2e3)
        }
        )
    }
    copyToClipboard(n) {
        const t = document.createElement("textarea");
        t.value = n.trim(),
        t.style.position = "fixed",
        t.style.left = "0",
        t.style.top = "0",
        document.body.appendChild(t),
        t.focus(),
        t.select(),
        document.execCommand("copy"),
        t.remove()
    }
}
class Ut {
    "after:highlightElement"({el: n}) {
        if (n.classList.contains("no-line-numbers"))
            return;
        const t = this.getHighlightedLines(n)
          , a = document.createElement("div");
        a.className = "hljs-line-numbers",
        a.ariaHidden = "true";
        const c = n.innerHTML.split(/\r\n|\r|\n/g).length;
        for (let r = 0; r < c; r++) {
            const s = r + 1
              , i = document.createElement("div");
            i.innerText = s.toString(),
            t[s] && (i.className = "highlighted"),
            a.appendChild(i)
        }
        if (n.innerHTML = '<div class="hljs-code">' + n.innerHTML + "</div>",
        n.insertBefore(a, n.firstChild),
        t.length === 0)
            return;
        const l = document.createElement("table");
        l.className = "hljs-highlighted-lines",
        l.ariaHidden = "true";
        for (let r = 0; r < c; r++) {
            const s = document.createElement("tr")
              , i = document.createElement("td");
            i.innerText = " ",
            t[r + 1] && (i.className = "highlighted"),
            s.appendChild(i),
            l.appendChild(s)
        }
        n.appendChild(l)
    }
    getHighlightedLines(n) {
        const t = n.dataset.highlightedLines;
        if (!t)
            return [];
        const a = []
          , c = t.split(",");
        for (let l = 0; l < c.length; l++) {
            const r = c[l].indexOf("-");
            if (r === -1) {
                a[c[l]] = !0;
                continue
            }
            const s = c[l].substring(0, r)
              , i = c[l].substring(r + 1);
            for (let u = s; u <= i; u++)
                a[u] = !0
        }
        return a
    }
}
L.registerLanguage("plaintext", mt);
L.registerLanguage("php", ht);
L.registerLanguage("python", Nt);
L.registerLanguage("javascript", Rt);
L.registerLanguage("cpp", vt);
L.registerLanguage("csharp", At);
L.registerLanguage("objectivec", Mt);
L.registerLanguage("java", wt);
L.registerLanguage("bash", It);
L.registerLanguage("xml", Ct);
L.registerLanguage("yaml", Lt);
L.registerLanguage("delphi", xt);
L.registerLanguage("r", Dt);
L.registerLanguage("sql", kt);
L.addPlugin(new Ut);
L.addPlugin(new Bt);
const Ye = document.querySelectorAll("pre.highlighter code");
for (let e = 0; e < Ye.length; e++)
    L.highlightElement(Ye[e]);
const Pt = {
    python: "Python",
    cpp: "C++",
    cpp_c_api: "C++ (C API)",
    cpp_cuda: "C++ (CUDA)",
    java: "Java",
    kotlin: "Kotlin",
    php: "PHP",
    windows: "Windows",
    linux: "Linux",
    attributes: "Attributes",
    annotations: "Annotations",
    yaml: "YAML",
    "32bit": "32-bit",
    "64bit": "64-bit"
}
  , qe = document.getElementsByClassName("code-tab-content");
qe.length > 0 && Ft(qe);
function $t(e) {
    const n = [];
    for (let t = 0; t < e.length; t++) {
        const a = e[t].className.match(/code-tab-group-(\d+)/)
          , c = a ? a[1] - 1 : 0;
        n[c] || (n[c] = []),
        n[c].push(e[t])
    }
    return n
}
function Ft(e) {
    const n = $t(e)
      , t = localStorage.getItem("code_tab");
    let a = 0;
    for (let c = 0; c < n.length; c++) {
        const l = n[c]
          , r = document.createElement("div");
        r.classList.add("code-tab");
        for (let u = 0; u < l.length; u++) {
            const p = l[u]
              , h = p.className.match(/code-tab-label-(\S+)/)
              , f = h ? h[1] : "";
            p.dataset.label = f,
            t === f && (a = u);
            const N = document.createElement("div");
            N.innerText = Pt[f],
            N.dataset.label = f,
            N.addEventListener("click", ()=>{
                Xe(n, u)
            }
            ),
            r.appendChild(N)
        }
        const s = Re(l[0])
          , i = s || l[0];
        i.parentNode.insertBefore(r, i)
    }
    Xe(n, a)
}
function Xe(e, n) {
    let t = null;
    for (let a = 0; a < e.length; a++) {
        const c = e[a];
        for (let i = 0; i < c.length; i++) {
            const u = c[i];
            u.style.display = n === i ? "block" : "none";
            const p = Re(u);
            p && (p.style.display = n === i ? "block" : "none")
        }
        const l = Re(c[0])
          , s = (l || c[0]).previousElementSibling.children;
        for (let i = 0; i < s.length; i++) {
            const u = s[i];
            n === i ? (t = u.dataset.label,
            u.classList.add("active")) : u.classList.remove("active")
        }
    }
    localStorage.setItem("code_tab", t)
}
function Re(e) {
    const n = e.previousElementSibling;
    return n && n.classList.contains("code-block-caption") ? n : null
}
const Se = document.getElementsByTagName("form");
for (let e = 0; e < Se.length; e++)
    Se[e].addEventListener("submit", ()=>{
        Se[e].querySelector("input[type=submit]").disabled = !0
    }
    );
const Ve = document.getElementById("comment-form")
  , Kt = document.getElementById("comments")
  , pn = document.getElementById("write-comment")
  , xe = document.getElementById("cancel-comment-reply")
  , Te = document.getElementsByClassName("comment-reply-link")
  , En = document.getElementById("comment_parent_id")
  , pe = document.getElementById("comment_author_name")
  , Ee = document.getElementById("comment_author_email")
  , ve = document.getElementById("save_comment_author");
if (Ve) {
    Ht(),
    Ve.addEventListener("submit", ()=>zt()),
    xe.addEventListener("click", ()=>Wt());
    for (let e = 0; e < Te.length; e++)
        Te[e].addEventListener("click", ()=>Gt(Te[e]))
}
function Ht() {
    if (!pe || !Ee || pe.value || Ee.value)
        return;
    const e = localStorage.getItem("comment_author_name")
      , n = localStorage.getItem("comment_author_email");
    e && n && (pe.value = e,
    Ee.value = n,
    ve.checked = !0)
}
function zt() {
    ve && (ve.checked ? (localStorage.setItem("comment_author_name", pe.value),
    localStorage.setItem("comment_author_email", Ee.value)) : (localStorage.removeItem("comment_author_name"),
    localStorage.removeItem("comment_author_email")))
}
function Gt(e) {
    const n = e.parentElement.parentElement.parentElement;
    n.parentNode.insertBefore(pn, n.nextSibling),
    xe.style.display = "block",
    En.value = e.dataset.id
}
function Wt() {
    Kt.appendChild(pn),
    xe.style.display = "none",
    En.value = ""
}
const Oe = document.getElementsByClassName("no-copy");
for (let e = 0; e < Oe.length; e++) {
    Oe[e].style.userSelect = "none";
    const n = ["contextmenu", "copy", "dragstart", "selectstart", "mousedown", "mouseup"];
    for (let t = 0; t < n.length; t++)
        Oe[e].addEventListener(n[t], a=>{
            a.preventDefault()
        }
        )
}
const bn = document.getElementById("sidebar-navigation")
  , Zt = document.getElementById("sidebar-navigation-dismiss")
  , Yt = document.getElementById("navigation-toggle") //
//  , ae = document.getElementById("account-menu");
Yt.addEventListener("click", ()=>{
    bn.style.display = "block"
}
);
Zt.addEventListener("click", ()=>{
    bn.style.display = "none"
}
);
// ae.addEventListener("click", e=>{
//     ae.classList.contains("show") ? ae.classList.remove("show") : ae.classList.add("show")
// }
// );
// document.addEventListener("click", e=>{
//     ae.contains(e.target) || ae.classList.remove("show")
// }
// );
