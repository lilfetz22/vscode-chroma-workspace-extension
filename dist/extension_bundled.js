var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// node_modules/compromise/builds/three/compromise-three.cjs
var require_compromise_three = __commonJS({
  "node_modules/compromise/builds/three/compromise-three.cjs"(exports2, module2) {
    var e;
    var t;
    e = exports2, t = function() {
      var e2 = { methods: { one: {}, two: {}, three: {}, four: {} }, model: { one: {}, two: {}, three: {} }, compute: {}, hooks: [] };
      const t2 = { compute: function(e3) {
        const { world: t3 } = this, n2 = t3.compute;
        return "string" == typeof e3 && n2.hasOwnProperty(e3) ? n2[e3](this) : ((e4) => "[object Array]" === Object.prototype.toString.call(e4))(e3) ? e3.forEach((r2) => {
          t3.compute.hasOwnProperty(r2) ? n2[r2](this) : console.warn("no compute:", e3);
        }) : "function" == typeof e3 ? e3(this) : console.warn("no compute:", e3), this;
      } };
      var n = { forEach: function(e3) {
        return this.fullPointer.forEach((t3, n2) => {
          let r2 = this.update([t3]);
          e3(r2, n2);
        }), this;
      }, map: function(e3, t3) {
        let n2 = this.fullPointer.map((t4, n3) => {
          let r3 = this.update([t4]), a2 = e3(r3, n3);
          return void 0 === a2 ? this.none() : a2;
        });
        if (0 === n2.length) return t3 || this.update([]);
        if (void 0 !== n2[0]) {
          if ("string" == typeof n2[0]) return n2;
          if ("object" == typeof n2[0] && (null === n2[0] || !n2[0].isView)) return n2;
        }
        let r2 = [];
        return n2.forEach((e4) => {
          r2 = r2.concat(e4.fullPointer);
        }), this.toView(r2);
      }, filter: function(e3) {
        let t3 = this.fullPointer;
        return t3 = t3.filter((t4, n2) => {
          let r2 = this.update([t4]);
          return e3(r2, n2);
        }), this.update(t3);
      }, find: function(e3) {
        let t3 = this.fullPointer.find((t4, n2) => {
          let r2 = this.update([t4]);
          return e3(r2, n2);
        });
        return this.update([t3]);
      }, some: function(e3) {
        return this.fullPointer.some((t3, n2) => {
          let r2 = this.update([t3]);
          return e3(r2, n2);
        });
      }, random: function(e3 = 1) {
        let t3 = this.fullPointer, n2 = Math.floor(Math.random() * t3.length);
        return n2 + e3 > this.length && (n2 = this.length - e3, n2 = n2 < 0 ? 0 : n2), t3 = t3.slice(n2, n2 + e3), this.update(t3);
      } };
      const r = { termList: function() {
        return this.methods.one.termList(this.docs);
      }, terms: function(e3) {
        let t3 = this.match(".");
        return "number" == typeof e3 ? t3.eq(e3) : t3;
      }, groups: function(e3) {
        if (e3 || 0 === e3) return this.update(this._groups[e3] || []);
        let t3 = {};
        return Object.keys(this._groups).forEach((e4) => {
          t3[e4] = this.update(this._groups[e4]);
        }), t3;
      }, eq: function(e3) {
        let t3 = this.pointer;
        return t3 || (t3 = this.docs.map((e4, t4) => [t4])), t3[e3] ? this.update([t3[e3]]) : this.none();
      }, first: function() {
        return this.eq(0);
      }, last: function() {
        let e3 = this.fullPointer.length - 1;
        return this.eq(e3);
      }, firstTerms: function() {
        return this.match("^.");
      }, lastTerms: function() {
        return this.match(".$");
      }, slice: function(e3, t3) {
        let n2 = this.pointer || this.docs.map((e4, t4) => [t4]);
        return n2 = n2.slice(e3, t3), this.update(n2);
      }, all: function() {
        return this.update().toView();
      }, fullSentences: function() {
        let e3 = this.fullPointer.map((e4) => [e4[0]]);
        return this.update(e3).toView();
      }, none: function() {
        return this.update([]);
      }, isDoc: function(e3) {
        if (!e3 || !e3.isView) return false;
        let t3 = this.fullPointer, n2 = e3.fullPointer;
        return !t3.length !== n2.length && t3.every((e4, t4) => !!n2[t4] && e4[0] === n2[t4][0] && e4[1] === n2[t4][1] && e4[2] === n2[t4][2]);
      }, wordCount: function() {
        return this.docs.reduce((e3, t3) => (e3 += t3.filter((e4) => "" !== e4.text).length, e3), 0);
      }, isFull: function() {
        let e3 = this.pointer;
        if (!e3) return true;
        if (0 === e3.length || 0 !== e3[0][0]) return false;
        let t3 = 0, n2 = 0;
        return this.document.forEach((e4) => t3 += e4.length), this.docs.forEach((e4) => n2 += e4.length), t3 === n2;
      }, getNth: function(e3) {
        return "number" == typeof e3 ? this.eq(e3) : "string" == typeof e3 ? this.if(e3) : this;
      } };
      r.group = r.groups, r.fullSentence = r.fullSentences, r.sentence = r.fullSentences, r.lastTerm = r.lastTerms, r.firstTerm = r.firstTerms;
      const a = Object.assign({}, r, t2, n);
      a.get = a.eq;
      class View {
        constructor(t3, n2, r2 = {}) {
          [["document", t3], ["world", e2], ["_groups", r2], ["_cache", null], ["viewType", "View"]].forEach((e3) => {
            Object.defineProperty(this, e3[0], { value: e3[1], writable: true });
          }), this.ptrs = n2;
        }
        get docs() {
          let t3 = this.document;
          return this.ptrs && (t3 = e2.methods.one.getDoc(this.ptrs, this.document)), t3;
        }
        get pointer() {
          return this.ptrs;
        }
        get methods() {
          return this.world.methods;
        }
        get model() {
          return this.world.model;
        }
        get hooks() {
          return this.world.hooks;
        }
        get isView() {
          return true;
        }
        get found() {
          return this.docs.length > 0;
        }
        get length() {
          return this.docs.length;
        }
        get fullPointer() {
          let { docs: e3, ptrs: t3, document: n2 } = this, r2 = t3 || e3.map((e4, t4) => [t4]);
          return r2.map((e4) => {
            let [t4, r3, a2, o2, i2] = e4;
            return r3 = r3 || 0, a2 = a2 || (n2[t4] || []).length, n2[t4] && n2[t4][r3] && (o2 = o2 || n2[t4][r3].id, n2[t4][a2 - 1] && (i2 = i2 || n2[t4][a2 - 1].id)), [t4, r3, a2, o2, i2];
          });
        }
        update(e3) {
          let t3 = new View(this.document, e3);
          if (this._cache && e3 && e3.length > 0) {
            let n2 = [];
            e3.forEach((e4, t4) => {
              let [r2, a2, o2] = e4;
              (1 === e4.length || 0 === a2 && this.document[r2].length === o2) && (n2[t4] = this._cache[r2]);
            }), n2.length > 0 && (t3._cache = n2);
          }
          return t3.world = this.world, t3;
        }
        toView(e3) {
          return new View(this.document, e3 || this.pointer);
        }
        fromText(e3) {
          const { methods: t3 } = this;
          let n2 = t3.one.tokenize.fromString(e3, this.world), r2 = new View(n2);
          return r2.world = this.world, r2.compute(["normal", "freeze", "lexicon"]), this.world.compute.preTagger && r2.compute("preTagger"), r2.compute("unfreeze"), r2;
        }
        clone() {
          let e3 = this.document.slice(0);
          e3 = e3.map((e4) => e4.map((e5) => ((e5 = Object.assign({}, e5)).tags = new Set(e5.tags), e5)));
          let t3 = this.update(this.pointer);
          return t3.document = e3, t3._cache = this._cache, t3;
        }
      }
      Object.assign(View.prototype, a);
      const o = function(e3) {
        return e3 && "object" == typeof e3 && !Array.isArray(e3);
      };
      function i(e3, t3) {
        if (o(t3)) for (const n2 in t3) o(t3[n2]) ? (e3[n2] || Object.assign(e3, { [n2]: {} }), i(e3[n2], t3[n2])) : Object.assign(e3, { [n2]: t3[n2] });
        return e3;
      }
      const s = function(e3, t3, n2, r2) {
        const { methods: a2, model: o2, compute: s2, hooks: l2 } = t3;
        e3.methods && function(e4, t4) {
          for (const n3 in t4) e4[n3] = e4[n3] || {}, Object.assign(e4[n3], t4[n3]);
        }(a2, e3.methods), e3.model && i(o2, e3.model), e3.irregulars && function(e4, t4) {
          let n3 = e4.two.models || {};
          Object.keys(t4).forEach((e5) => {
            t4[e5].pastTense && (n3.toPast && (n3.toPast.ex[e5] = t4[e5].pastTense), n3.fromPast && (n3.fromPast.ex[t4[e5].pastTense] = e5)), t4[e5].presentTense && (n3.toPresent && (n3.toPresent.ex[e5] = t4[e5].presentTense), n3.fromPresent && (n3.fromPresent.ex[t4[e5].presentTense] = e5)), t4[e5].gerund && (n3.toGerund && (n3.toGerund.ex[e5] = t4[e5].gerund), n3.fromGerund && (n3.fromGerund.ex[t4[e5].gerund] = e5)), t4[e5].comparative && (n3.toComparative && (n3.toComparative.ex[e5] = t4[e5].comparative), n3.fromComparative && (n3.fromComparative.ex[t4[e5].comparative] = e5)), t4[e5].superlative && (n3.toSuperlative && (n3.toSuperlative.ex[e5] = t4[e5].superlative), n3.fromSuperlative && (n3.fromSuperlative.ex[t4[e5].superlative] = e5));
          });
        }(o2, e3.irregulars), e3.compute && Object.assign(s2, e3.compute), l2 && (t3.hooks = l2.concat(e3.hooks || [])), e3.api && e3.api(n2), e3.lib && Object.keys(e3.lib).forEach((t4) => r2[t4] = e3.lib[t4]), e3.tags && r2.addTags(e3.tags), e3.words && r2.addWords(e3.words), e3.frozen && r2.addWords(e3.frozen, true), e3.mutate && e3.mutate(t3, r2);
      }, l = function(e3) {
        return "[object Array]" === Object.prototype.toString.call(e3);
      }, u = function(e3, t3, n2) {
        const { methods: r2 } = n2;
        let a2 = new t3([]);
        if (a2.world = n2, "number" == typeof e3 && (e3 = String(e3)), !e3) return a2;
        if ("string" == typeof e3) return new t3(r2.one.tokenize.fromString(e3, n2));
        if (o2 = e3, "[object Object]" === Object.prototype.toString.call(o2) && e3.isView) return new t3(e3.document, e3.ptrs);
        var o2;
        if (l(e3)) {
          if (l(e3[0])) {
            let n4 = e3.map((e4) => e4.map((e5) => ({ text: e5, normal: e5, pre: "", post: " ", tags: /* @__PURE__ */ new Set() })));
            return new t3(n4);
          }
          let n3 = e3.map((e4) => e4.terms.map((e5) => (l(e5.tags) && (e5.tags = new Set(e5.tags)), e5)));
          return new t3(n3);
        }
        return a2;
      };
      let c = Object.assign({}, e2);
      const h = function(e3, t3) {
        t3 && h.addWords(t3);
        let n2 = u(e3, View, c);
        return e3 && n2.compute(c.hooks), n2;
      };
      Object.defineProperty(h, "_world", { value: c, writable: true }), h.tokenize = function(e3, t3) {
        const { compute: n2 } = this._world;
        t3 && h.addWords(t3);
        let r2 = u(e3, View, c);
        return n2.contractions && r2.compute(["alias", "normal", "machine", "contractions"]), r2;
      }, h.plugin = function(e3) {
        return s(e3, this._world, View, this), this;
      }, h.extend = h.plugin, h.world = function() {
        return this._world;
      }, h.model = function() {
        return this._world.model;
      }, h.methods = function() {
        return this._world.methods;
      }, h.hooks = function() {
        return this._world.hooks;
      }, h.verbose = function(e3) {
        const t3 = "undefined" != typeof process && process.env ? process.env : self.env || {};
        return t3.DEBUG_TAGS = "tagger" === e3 || true === e3 || "", t3.DEBUG_MATCH = "match" === e3 || true === e3 || "", t3.DEBUG_CHUNKS = "chunker" === e3 || true === e3 || "", this;
      }, h.version = "14.14.0";
      var d = { one: { cacheDoc: function(e3) {
        let t3 = e3.map((e4) => {
          let t4 = /* @__PURE__ */ new Set();
          return e4.forEach((e5) => {
            "" !== e5.normal && t4.add(e5.normal), e5.switch && t4.add(`%${e5.switch}%`), e5.implicit && t4.add(e5.implicit), e5.machine && t4.add(e5.machine), e5.root && t4.add(e5.root), e5.alias && e5.alias.forEach((e6) => t4.add(e6));
            let n2 = Array.from(e5.tags);
            for (let e6 = 0; e6 < n2.length; e6 += 1) t4.add("#" + n2[e6]);
          }), t4;
        });
        return t3;
      } } };
      const m = { cache: function() {
        return this._cache = this.methods.one.cacheDoc(this.document), this;
      }, uncache: function() {
        return this._cache = null, this;
      } };
      var p = { api: function(e3) {
        Object.assign(e3.prototype, m);
      }, compute: { cache: function(e3) {
        e3._cache = e3.methods.one.cacheDoc(e3.document);
      } }, methods: d };
      const f = (e3) => /^\p{Lu}[\p{Ll}'’]/u.test(e3) || /^\p{Lu}$/u.test(e3), b = (e3, t3, n2) => {
        if (n2.forEach((e4) => e4.dirty = true), e3) {
          let r2 = [t3, 0].concat(n2);
          Array.prototype.splice.apply(e3, r2);
        }
        return e3;
      }, v = function(e3) {
        let t3 = e3[e3.length - 1];
        !t3 || / $/.test(t3.post) || /[-–—]/.test(t3.post) || (t3.post += " ");
      }, y = (e3, t3, n2) => {
        const r2 = /[-.?!,;:)–—'"]/g;
        let a2 = e3[t3 - 1];
        if (!a2) return;
        let o2 = a2.post;
        if (r2.test(o2)) {
          let e4 = o2.match(r2).join(""), t4 = n2[n2.length - 1];
          t4.post = e4 + t4.post, a2.post = a2.post.replace(r2, "");
        }
      }, w = function(e3, t3, n2, r2) {
        let [a2, o2, i2] = t3;
        0 === o2 || i2 === r2[a2].length ? v(n2) : (v(n2), v([e3[t3[1]]])), function(e4, t4, n3) {
          let r3 = e4[t4];
          if (0 !== t4 || !f(r3.text)) return;
          n3[0].text = n3[0].text.replace(/^\p{Ll}/u, (e5) => e5.toUpperCase());
          let a3 = e4[t4];
          a3.tags.has("ProperNoun") || a3.tags.has("Acronym") || f(a3.text) && a3.text.length > 1 && (a3.text = a3.text.replace(/^\p{Lu}/u, (e5) => e5.toLowerCase()));
        }(e3, o2, n2), b(e3, o2, n2);
      };
      let k = 0;
      const P = (e3) => (e3 = e3.length < 3 ? "0" + e3 : e3).length < 3 ? "0" + e3 : e3, A = function(e3) {
        let [t3, n2] = e3.index || [0, 0];
        k += 1, k = k > 46655 ? 0 : k, t3 = t3 > 46655 ? 0 : t3, n2 = n2 > 1294 ? 0 : n2;
        let r2 = P(k.toString(36));
        r2 += P(t3.toString(36));
        let a2 = n2.toString(36);
        return a2 = a2.length < 2 ? "0" + a2 : a2, r2 += a2, r2 += parseInt(36 * Math.random(), 10).toString(36), e3.normal + "|" + r2.toUpperCase();
      }, C = function(e3) {
        e3.has("@hasContraction") && "function" == typeof e3.contractions && e3.grow("@hasContraction").contractions().expand();
      }, N = (e3) => "[object Array]" === Object.prototype.toString.call(e3), j = function(e3, t3, n2) {
        const { document: r2, world: a2 } = t3;
        t3.uncache();
        let o2 = t3.fullPointer, i2 = t3.fullPointer;
        t3.forEach((s3, l2) => {
          let u2 = s3.fullPointer[0], [c2] = u2, h2 = r2[c2], d2 = function(e4, t4) {
            const { methods: n3 } = t4;
            return "string" == typeof e4 ? n3.one.tokenize.fromString(e4, t4)[0] : "object" == typeof e4 && e4.isView ? e4.clone().docs[0] || [] : N(e4) ? N(e4[0]) ? e4[0] : e4 : [];
          }(e3, a2);
          0 !== d2.length && (d2 = function(e4) {
            return e4.map((e5) => (e5.id = A(e5), e5));
          }(d2), n2 ? (C(t3.update([u2]).firstTerm()), w(h2, u2, d2, r2)) : (C(t3.update([u2]).lastTerm()), function(e4, t4, n3, r3) {
            let [a3, , o3] = t4, i3 = (r3[a3] || []).length;
            o3 < i3 ? (y(e4, o3, n3), v(n3)) : i3 === o3 && (v(e4), y(e4, o3, n3), r3[a3 + 1] && (n3[n3.length - 1].post += " ")), b(e4, t4[2], n3), t4[4] = n3[n3.length - 1].id;
          }(h2, u2, d2, r2)), r2[c2] && r2[c2][u2[1]] && (u2[3] = r2[c2][u2[1]].id), i2[l2] = u2, u2[2] += d2.length, o2[l2] = u2);
        });
        let s2 = t3.toView(o2);
        return t3.ptrs = i2, s2.compute(["id", "index", "freeze", "lexicon"]), s2.world.compute.preTagger && s2.compute("preTagger"), s2.compute("unfreeze"), s2;
      }, x = { insertAfter: function(e3) {
        return j(e3, this, false);
      }, insertBefore: function(e3) {
        return j(e3, this, true);
      } };
      x.append = x.insertAfter, x.prepend = x.insertBefore, x.insert = x.insertAfter;
      const I = /\$[0-9a-z]+/g, T = { replaceWith: function(e3, t3 = {}) {
        let n2 = this.fullPointer, r2 = this;
        if (this.uncache(), "function" == typeof e3) return function(e4, t4) {
          return e4.forEach((e5) => {
            let n3 = t4(e5);
            e5.replaceWith(n3);
          }), e4;
        }(r2, e3);
        let a2 = r2.docs[0], o2 = t3.possessives && a2[a2.length - 1].tags.has("Possessive");
        e3 = function(e4, t4) {
          if ("string" != typeof e4) return e4;
          let n3 = t4.groups();
          return e4 = e4.replace(I, (e5) => {
            let t5 = e5.replace(/\$/, "");
            return n3.hasOwnProperty(t5) ? n3[t5].text() : e5;
          }), e4;
        }(e3, r2);
        let i2 = this.update(n2);
        n2 = n2.map((e4) => e4.slice(0, 3));
        let s2 = (i2.docs[0] || []).map((e4) => Array.from(e4.tags));
        if ("string" == typeof e3 && (e3 = this.fromText(e3).compute("id")), r2.insertAfter(e3), i2.has("@hasContraction") && r2.contractions && r2.grow("@hasContraction+").contractions().expand(), r2.delete(i2), o2) {
          let e4 = r2.docs[0], t4 = e4[e4.length - 1];
          t4.tags.has("Possessive") || (t4.text += "'s", t4.normal += "'s", t4.tags.add("Possessive"));
        }
        let l2 = r2.toView(n2).compute(["index", "freeze", "lexicon"]);
        return l2.world.compute.preTagger && l2.compute("preTagger"), l2.compute("unfreeze"), t3.tags && l2.terms().forEach((e4, t4) => {
          e4.tagSafe(s2[t4]);
        }), t3.case && l2.docs[0] && l2.docs[0][0] && 0 === l2.docs[0][0].index[1] && (l2.docs[0][0].text = l2.docs[0][0].text.replace(/\w\S*/g, (e4) => e4.charAt(0).toUpperCase() + e4.substring(1).toLowerCase())), l2;
      }, replace: function(e3, t3, n2) {
        if (e3 && !t3) return this.replaceWith(e3, n2);
        let r2 = this.match(e3);
        return r2.found ? (this.soften(), r2.replaceWith(t3, n2)) : this;
      } }, D = { remove: function(e3) {
        const { indexN: t3 } = this.methods.one.pointer;
        this.uncache();
        let n2 = this.all(), r2 = this;
        e3 && (n2 = this, r2 = this.match(e3));
        let a2 = !n2.ptrs;
        r2.has("@hasContraction") && r2.contractions && r2.grow("@hasContraction").contractions().expand();
        let o2 = n2.fullPointer, i2 = r2.fullPointer.reverse(), s2 = function(e4, t4) {
          t4.forEach((t5) => {
            let [n3, r3, a3] = t5, o3 = a3 - r3;
            e4[n3] && (a3 === e4[n3].length && a3 > 1 && function(e5, t6) {
              let n4 = e5.length - 1, r4 = e5[n4], a4 = e5[n4 - t6];
              a4 && r4 && (a4.post += r4.post, a4.post = a4.post.replace(/ +([.?!,;:])/, "$1"), a4.post = a4.post.replace(/[,;:]+([.?!])/, "$1"));
            }(e4[n3], o3), e4[n3].splice(r3, o3));
          });
          for (let t5 = e4.length - 1; t5 >= 0; t5 -= 1) if (0 === e4[t5].length && (e4.splice(t5, 1), t5 === e4.length && e4[t5 - 1])) {
            let n3 = e4[t5 - 1], r3 = n3[n3.length - 1];
            r3 && (r3.post = r3.post.trimEnd());
          }
          return e4;
        }(this.document, i2);
        return o2 = function(e4, t4) {
          return e4 = e4.map((e5) => {
            let [n3] = e5;
            return t4[n3] ? (t4[n3].forEach((t5) => {
              let n4 = t5[2] - t5[1];
              e5[1] <= t5[1] && e5[2] >= t5[2] && (e5[2] -= n4);
            }), e5) : e5;
          }), e4.forEach((t5, n3) => {
            if (0 === t5[1] && 0 == t5[2]) for (let t6 = n3 + 1; t6 < e4.length; t6 += 1) e4[t6][0] -= 1, e4[t6][0] < 0 && (e4[t6][0] = 0);
          }), e4 = (e4 = e4.filter((e5) => e5[2] - e5[1] > 0)).map((e5) => (e5[3] = null, e5[4] = null, e5));
        }(o2, t3(i2)), n2.ptrs = o2, n2.document = s2, n2.compute("index"), a2 && (n2.ptrs = void 0), e3 ? n2.toView(o2) : (this.ptrs = [], n2.none());
      } };
      D.delete = D.remove;
      const H = { pre: function(e3, t3) {
        return void 0 === e3 && this.found ? this.docs[0][0].pre : (this.docs.forEach((n2) => {
          let r2 = n2[0];
          true === t3 ? r2.pre += e3 : r2.pre = e3;
        }), this);
      }, post: function(e3, t3) {
        if (void 0 === e3) {
          let e4 = this.docs[this.docs.length - 1];
          return e4[e4.length - 1].post;
        }
        return this.docs.forEach((n2) => {
          let r2 = n2[n2.length - 1];
          true === t3 ? r2.post += e3 : r2.post = e3;
        }), this;
      }, trim: function() {
        if (!this.found) return this;
        let e3 = this.docs, t3 = e3[0][0];
        t3.pre = t3.pre.trimStart();
        let n2 = e3[e3.length - 1], r2 = n2[n2.length - 1];
        return r2.post = r2.post.trimEnd(), this;
      }, hyphenate: function() {
        return this.docs.forEach((e3) => {
          e3.forEach((t3, n2) => {
            0 !== n2 && (t3.pre = ""), e3[n2 + 1] && (t3.post = "-");
          });
        }), this;
      }, dehyphenate: function() {
        const e3 = /[-–—]/;
        return this.docs.forEach((t3) => {
          t3.forEach((t4) => {
            e3.test(t4.post) && (t4.post = " ");
          });
        }), this;
      }, toQuotations: function(e3, t3) {
        return e3 = e3 || '"', t3 = t3 || '"', this.docs.forEach((n2) => {
          n2[0].pre = e3 + n2[0].pre;
          let r2 = n2[n2.length - 1];
          r2.post = t3 + r2.post;
        }), this;
      }, toParentheses: function(e3, t3) {
        return e3 = e3 || "(", t3 = t3 || ")", this.docs.forEach((n2) => {
          n2[0].pre = e3 + n2[0].pre;
          let r2 = n2[n2.length - 1];
          r2.post = t3 + r2.post;
        }), this;
      } };
      H.deHyphenate = H.dehyphenate, H.toQuotation = H.toQuotations;
      var E = { alpha: (e3, t3) => e3.normal < t3.normal ? -1 : e3.normal > t3.normal ? 1 : 0, length: (e3, t3) => {
        let n2 = e3.normal.trim().length, r2 = t3.normal.trim().length;
        return n2 < r2 ? 1 : n2 > r2 ? -1 : 0;
      }, wordCount: (e3, t3) => e3.words < t3.words ? 1 : e3.words > t3.words ? -1 : 0, sequential: (e3, t3) => e3[0] < t3[0] ? 1 : e3[0] > t3[0] ? -1 : e3[1] > t3[1] ? 1 : -1, byFreq: function(e3) {
        let t3 = {};
        return e3.forEach((e4) => {
          t3[e4.normal] = t3[e4.normal] || 0, t3[e4.normal] += 1;
        }), e3.sort((e4, n2) => {
          let r2 = t3[e4.normal], a2 = t3[n2.normal];
          return r2 < a2 ? 1 : r2 > a2 ? -1 : 0;
        }), e3;
      } };
      const G = /* @__PURE__ */ new Set(["index", "sequence", "seq", "sequential", "chron", "chronological"]), O = /* @__PURE__ */ new Set(["freq", "frequency", "topk", "repeats"]), F = /* @__PURE__ */ new Set(["alpha", "alphabetical"]);
      var V = { unique: function() {
        let e3 = /* @__PURE__ */ new Set(), t3 = this.filter((t4) => {
          let n2 = t4.text("machine");
          return !e3.has(n2) && (e3.add(n2), true);
        });
        return t3;
      }, reverse: function() {
        let e3 = this.pointer || this.docs.map((e4, t3) => [t3]);
        return e3 = [].concat(e3), e3 = e3.reverse(), this._cache && (this._cache = this._cache.reverse()), this.update(e3);
      }, sort: function(e3) {
        let { docs: t3, pointer: n2 } = this;
        if (this.uncache(), "function" == typeof e3) return function(e4, t4) {
          let n3 = e4.fullPointer;
          return n3 = n3.sort((n4, r3) => (n4 = e4.update([n4]), r3 = e4.update([r3]), t4(n4, r3))), e4.ptrs = n3, e4;
        }(this, e3);
        e3 = e3 || "alpha";
        let r2 = n2 || t3.map((e4, t4) => [t4]), a2 = t3.map((e4, t4) => ({ index: t4, words: e4.length, normal: e4.map((e5) => e5.machine || e5.normal || "").join(" "), pointer: r2[t4] }));
        return G.has(e3) && (e3 = "sequential"), F.has(e3) && (e3 = "alpha"), O.has(e3) ? (a2 = E.byFreq(a2), this.update(a2.map((e4) => e4.pointer))) : "function" == typeof E[e3] ? (a2 = a2.sort(E[e3]), this.update(a2.map((e4) => e4.pointer))) : this;
      } };
      const z = function(e3, t3) {
        if (e3.length > 0) {
          let t4 = e3[e3.length - 1], n2 = t4[t4.length - 1];
          false === / /.test(n2.post) && (n2.post += " ");
        }
        return e3 = e3.concat(t3);
      };
      var B = { concat: function(e3) {
        if ("string" == typeof e3) {
          let t4 = this.fromText(e3);
          if (this.found && this.ptrs) {
            let e4 = this.fullPointer, n2 = e4[e4.length - 1][0];
            this.document.splice(n2, 0, ...t4.document);
          } else this.document = this.document.concat(t4.document);
          return this.all().compute("index");
        }
        if ("object" == typeof e3 && e3.isView) return function(e4, t4) {
          if (e4.document === t4.document) {
            let n2 = e4.fullPointer.concat(t4.fullPointer);
            return e4.toView(n2).compute("index");
          }
          return t4.fullPointer.forEach((t5) => {
            t5[0] += e4.document.length;
          }), e4.document = z(e4.document, t4.docs), e4.all();
        }(this, e3);
        if (t3 = e3, "[object Array]" === Object.prototype.toString.call(t3)) {
          let t4 = z(this.document, e3);
          return this.document = t4, this.all();
        }
        var t3;
        return this;
      } }, S = { harden: function() {
        return this.ptrs = this.fullPointer, this;
      }, soften: function() {
        let e3 = this.ptrs;
        return !e3 || e3.length < 1 || (e3 = e3.map((e4) => e4.slice(0, 3)), this.ptrs = e3), this;
      } };
      const $ = Object.assign({}, { toLowerCase: function() {
        return this.termList().forEach((e3) => {
          e3.text = e3.text.toLowerCase();
        }), this;
      }, toUpperCase: function() {
        return this.termList().forEach((e3) => {
          e3.text = e3.text.toUpperCase();
        }), this;
      }, toTitleCase: function() {
        return this.termList().forEach((e3) => {
          e3.text = e3.text.replace(/^ *[a-z\u00C0-\u00FF]/, (e4) => e4.toUpperCase());
        }), this;
      }, toCamelCase: function() {
        return this.docs.forEach((e3) => {
          e3.forEach((t3, n2) => {
            0 !== n2 && (t3.text = t3.text.replace(/^ *[a-z\u00C0-\u00FF]/, (e4) => e4.toUpperCase())), n2 !== e3.length - 1 && (t3.post = "");
          });
        }), this;
      } }, x, T, D, H, V, B, S), M = { id: function(e3) {
        let t3 = e3.docs;
        for (let e4 = 0; e4 < t3.length; e4 += 1) for (let n2 = 0; n2 < t3[e4].length; n2 += 1) {
          let r2 = t3[e4][n2];
          r2.id = r2.id || A(r2);
        }
      } };
      var K = { api: function(e3) {
        Object.assign(e3.prototype, $);
      }, compute: M };
      const L = true;
      var J = { one: { contractions: [{ word: "@", out: ["at"] }, { word: "arent", out: ["are", "not"] }, { word: "alot", out: ["a", "lot"] }, { word: "brb", out: ["be", "right", "back"] }, { word: "cannot", out: ["can", "not"] }, { word: "dun", out: ["do", "not"] }, { word: "can't", out: ["can", "not"] }, { word: "shan't", out: ["should", "not"] }, { word: "won't", out: ["will", "not"] }, { word: "that's", out: ["that", "is"] }, { word: "what's", out: ["what", "is"] }, { word: "let's", out: ["let", "us"] }, { word: "dunno", out: ["do", "not", "know"] }, { word: "gonna", out: ["going", "to"] }, { word: "gotta", out: ["have", "got", "to"] }, { word: "gimme", out: ["give", "me"] }, { word: "outta", out: ["out", "of"] }, { word: "tryna", out: ["trying", "to"] }, { word: "gtg", out: ["got", "to", "go"] }, { word: "im", out: ["i", "am"] }, { word: "imma", out: ["I", "will"] }, { word: "imo", out: ["in", "my", "opinion"] }, { word: "irl", out: ["in", "real", "life"] }, { word: "ive", out: ["i", "have"] }, { word: "rn", out: ["right", "now"] }, { word: "tbh", out: ["to", "be", "honest"] }, { word: "wanna", out: ["want", "to"] }, { word: "c'mere", out: ["come", "here"] }, { word: "c'mon", out: ["come", "on"] }, { word: "shoulda", out: ["should", "have"] }, { word: "coulda", out: ["coulda", "have"] }, { word: "woulda", out: ["woulda", "have"] }, { word: "musta", out: ["must", "have"] }, { word: "tis", out: ["it", "is"] }, { word: "twas", out: ["it", "was"] }, { word: "y'know", out: ["you", "know"] }, { word: "ne'er", out: ["never"] }, { word: "o'er", out: ["over"] }, { after: "ll", out: ["will"] }, { after: "ve", out: ["have"] }, { after: "re", out: ["are"] }, { after: "m", out: ["am"] }, { before: "c", out: ["ce"] }, { before: "m", out: ["me"] }, { before: "n", out: ["ne"] }, { before: "qu", out: ["que"] }, { before: "s", out: ["se"] }, { before: "t", out: ["tu"] }, { word: "shouldnt", out: ["should", "not"] }, { word: "couldnt", out: ["could", "not"] }, { word: "wouldnt", out: ["would", "not"] }, { word: "hasnt", out: ["has", "not"] }, { word: "wasnt", out: ["was", "not"] }, { word: "isnt", out: ["is", "not"] }, { word: "cant", out: ["can", "not"] }, { word: "dont", out: ["do", "not"] }, { word: "wont", out: ["will", "not"] }, { word: "howd", out: ["how", "did"] }, { word: "whatd", out: ["what", "did"] }, { word: "whend", out: ["when", "did"] }, { word: "whered", out: ["where", "did"] }], numberSuffixes: { st: L, nd: L, rd: L, th: L, am: L, pm: L, max: L, "\xB0": L, s: L, e: L, er: L, "\xE8re": L, "\xE8me": L } } };
      const W = function(e3, t3, n2) {
        let [r2, a2] = t3;
        n2 && 0 !== n2.length && (n2 = n2.map((e4, t4) => (e4.implicit = e4.text, e4.machine = e4.text, e4.pre = "", e4.post = "", e4.text = "", e4.normal = "", e4.index = [r2, a2 + t4], e4)), n2[0] && (n2[0].pre = e3[r2][a2].pre, n2[n2.length - 1].post = e3[r2][a2].post, n2[0].text = e3[r2][a2].text, n2[0].normal = e3[r2][a2].normal), e3[r2].splice(a2, 1, ...n2));
      }, q = /'/, U = /* @__PURE__ */ new Set(["what", "how", "when", "where", "why"]), R = /* @__PURE__ */ new Set(["be", "go", "start", "think", "need"]), Q = /* @__PURE__ */ new Set(["been", "gone"]), Z = /'/, _ = /(e|é|aison|sion|tion)$/, X = /(age|isme|acle|ege|oire)$/;
      var Y = (e3, t3) => ["je", e3[t3].normal.split(Z)[1]], ee = (e3, t3) => {
        let n2 = e3[t3].normal.split(Z)[1];
        return n2 && n2.endsWith("e") ? ["la", n2] : ["le", n2];
      }, te = (e3, t3) => {
        let n2 = e3[t3].normal.split(Z)[1];
        return n2 && _.test(n2) && !X.test(n2) ? ["du", n2] : n2 && n2.endsWith("s") ? ["des", n2] : ["de", n2];
      };
      const ne = /^([0-9.]{1,4}[a-z]{0,2}) ?[-–—] ?([0-9]{1,4}[a-z]{0,2})$/i, re = /^([0-9]{1,2}(:[0-9][0-9])?(am|pm)?) ?[-–—] ?([0-9]{1,2}(:[0-9][0-9])?(am|pm)?)$/i, ae = /^[0-9]{3}-[0-9]{4}$/, oe = function(e3, t3) {
        let n2 = e3[t3], r2 = n2.text.match(ne);
        return null !== r2 ? true === n2.tags.has("PhoneNumber") || ae.test(n2.text) ? null : [r2[1], "to", r2[2]] : (r2 = n2.text.match(re), null !== r2 ? [r2[1], "to", r2[4]] : null);
      }, ie = /^([+-]?[0-9][.,0-9]*)([a-z°²³µ/]+)$/, se = function(e3, t3, n2) {
        const r2 = n2.model.one.numberSuffixes || {};
        let a2 = e3[t3].text.match(ie);
        if (null !== a2) {
          let e4 = a2[2].toLowerCase().trim();
          return r2.hasOwnProperty(e4) ? null : [a2[1], e4];
        }
        return null;
      }, le = /'/, ue = /^[0-9][^-–—]*[-–—].*?[0-9]/, ce = function(e3, t3, n2, r2) {
        let a2 = t3.update();
        a2.document = [e3];
        let o2 = n2 + r2;
        n2 > 0 && (n2 -= 1), e3[o2] && (o2 += 1), a2.ptrs = [[0, n2, o2]];
      }, he = { t: (e3, t3) => function(e4, t4) {
        return "ain't" === e4[t4].normal || "aint" === e4[t4].normal ? null : [e4[t4].normal.replace(/n't/, ""), "not"];
      }(e3, t3), d: (e3, t3) => function(e4, t4) {
        let n2 = e4[t4].normal.split(q)[0];
        if (U.has(n2)) return [n2, "did"];
        if (e4[t4 + 1]) {
          if (Q.has(e4[t4 + 1].normal)) return [n2, "had"];
          if (R.has(e4[t4 + 1].normal)) return [n2, "would"];
        }
        return null;
      }(e3, t3) }, de = { j: (e3, t3) => Y(e3, t3), l: (e3, t3) => ee(e3, t3), d: (e3, t3) => te(e3, t3) }, ge = function(e3, t3, n2, r2) {
        for (let a2 = 0; a2 < e3.length; a2 += 1) {
          let o2 = e3[a2];
          if (o2.word === t3.normal) return o2.out;
          if (null !== r2 && r2 === o2.after) return [n2].concat(o2.out);
          if (null !== n2 && n2 === o2.before && r2 && r2.length > 2) return o2.out.concat(r2);
        }
        return null;
      }, me = function(e3, t3) {
        let n2 = t3.fromText(e3.join(" "));
        return n2.compute(["id", "alias"]), n2.docs[0];
      }, pe = function(e3, t3) {
        for (let n2 = t3 + 1; n2 < 5 && e3[n2]; n2 += 1) if ("been" === e3[n2].normal) return ["there", "has"];
        return ["there", "is"];
      };
      var fe = { contractions: (e3) => {
        let { world: t3, document: n2 } = e3;
        const { model: r2, methods: a2 } = t3;
        let o2 = r2.one.contractions || [];
        n2.forEach((r3, i2) => {
          for (let s2 = r3.length - 1; s2 >= 0; s2 -= 1) {
            let l2 = null, u2 = null;
            if (true === le.test(r3[s2].normal)) {
              let e4 = r3[s2].normal.split(le);
              l2 = e4[0], u2 = e4[1];
            }
            let c2 = ge(o2, r3[s2], l2, u2);
            !c2 && he.hasOwnProperty(u2) && (c2 = he[u2](r3, s2, t3)), !c2 && de.hasOwnProperty(l2) && (c2 = de[l2](r3, s2)), "there" === l2 && "s" === u2 && (c2 = pe(r3, s2)), c2 ? (c2 = me(c2, e3), W(n2, [i2, s2], c2), ce(n2[i2], e3, s2, c2.length)) : ue.test(r3[s2].normal) ? (c2 = oe(r3, s2), c2 && (c2 = me(c2, e3), W(n2, [i2, s2], c2), a2.one.setTag(c2, "NumberRange", t3), c2[2] && c2[2].tags.has("Time") && a2.one.setTag([c2[0]], "Time", t3, null, "time-range"), ce(n2[i2], e3, s2, c2.length))) : (c2 = se(r3, s2, t3), c2 && (c2 = me(c2, e3), W(n2, [i2, s2], c2), a2.one.setTag([c2[1]], "Unit", t3, null, "contraction-unit")));
          }
        });
      } };
      const be = { model: J, compute: fe, hooks: ["contractions"] }, ve = function(e3) {
        const t3 = e3.world, { model: n2, methods: r2 } = e3.world, a2 = r2.one.setTag, { frozenLex: o2 } = n2.one, i2 = n2.one._multiCache || {};
        e3.docs.forEach((e4) => {
          for (let n3 = 0; n3 < e4.length; n3 += 1) {
            let r3 = e4[n3], s2 = r3.machine || r3.normal;
            if (void 0 !== i2[s2] && e4[n3 + 1]) for (let r4 = n3 + i2[s2] - 1; r4 > n3; r4 -= 1) {
              let i3 = e4.slice(n3, r4 + 1), s3 = i3.map((e5) => e5.machine || e5.normal).join(" ");
              true !== o2.hasOwnProperty(s3) || (a2(i3, o2[s3], t3, false, "1-frozen-multi-lexicon"), i3.forEach((e5) => e5.frozen = true));
            }
            void 0 !== o2[s2] && o2.hasOwnProperty(s2) && (a2([r3], o2[s2], t3, false, "1-freeze-lexicon"), r3.frozen = true);
          }
        });
      }, ye = (e3) => "\x1B[34m" + e3 + "\x1B[0m", we = (e3) => "\x1B[3m\x1B[2m" + e3 + "\x1B[0m", ke = function(e3) {
        e3.docs.forEach((e4) => {
          console.log(ye("\n  \u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500")), e4.forEach((e5) => {
            let t3 = `  ${we("\u2502")}  `, n2 = e5.implicit || e5.text || "-";
            true === e5.frozen ? t3 += `${ye(n2)} \u2744\uFE0F` : t3 += we(n2), console.log(t3);
          });
        });
      };
      var Pe = { compute: { frozen: ve, freeze: ve, unfreeze: function(e3) {
        return e3.docs.forEach((e4) => {
          e4.forEach((e5) => {
            delete e5.frozen;
          });
        }), e3;
      } }, mutate: (e3) => {
        const t3 = e3.methods.one;
        t3.termMethods.isFrozen = (e4) => true === e4.frozen, t3.debug.freeze = ke, t3.debug.frozen = ke;
      }, api: function(e3) {
        e3.prototype.freeze = function() {
          return this.docs.forEach((e4) => {
            e4.forEach((e5) => {
              e5.frozen = true;
            });
          }), this;
        }, e3.prototype.unfreeze = function() {
          this.compute("unfreeze");
        }, e3.prototype.isFrozen = function() {
          return this.match("@isFrozen+");
        };
      }, hooks: ["freeze"] };
      const Ae = function(e3, t3, n2) {
        const { model: r2, methods: a2 } = n2, o2 = a2.one.setTag, i2 = r2.one._multiCache || {}, { lexicon: s2 } = r2.one || {};
        let l2 = e3[t3], u2 = l2.machine || l2.normal;
        if (void 0 !== i2[u2] && e3[t3 + 1]) {
          for (let r3 = t3 + i2[u2] - 1; r3 > t3; r3 -= 1) {
            let a3 = e3.slice(t3, r3 + 1);
            if (a3.length <= 1) return false;
            let i3 = a3.map((e4) => e4.machine || e4.normal).join(" ");
            if (true === s2.hasOwnProperty(i3)) {
              let e4 = s2[i3];
              return o2(a3, e4, n2, false, "1-multi-lexicon"), !e4 || 2 !== e4.length || "PhrasalVerb" !== e4[0] && "PhrasalVerb" !== e4[1] || o2([a3[1]], "Particle", n2, false, "1-phrasal-particle"), true;
            }
          }
          return false;
        }
        return null;
      }, Ce = /^(under|over|mis|re|un|dis|semi|pre|post)-?/, Ne = /* @__PURE__ */ new Set(["Verb", "Infinitive", "PastTense", "Gerund", "PresentTense", "Adjective", "Participle"]), je = function(e3, t3, n2) {
        const { model: r2, methods: a2 } = n2, o2 = a2.one.setTag, { lexicon: i2 } = r2.one;
        let s2 = e3[t3], l2 = s2.machine || s2.normal;
        if (void 0 !== i2[l2] && i2.hasOwnProperty(l2)) return o2([s2], i2[l2], n2, false, "1-lexicon"), true;
        if (s2.alias) {
          let e4 = s2.alias.find((e5) => i2.hasOwnProperty(e5));
          if (e4) return o2([s2], i2[e4], n2, false, "1-lexicon-alias"), true;
        }
        if (true === Ce.test(l2)) {
          let e4 = l2.replace(Ce, "");
          if (i2.hasOwnProperty(e4) && e4.length > 3 && Ne.has(i2[e4])) return o2([s2], i2[e4], n2, false, "1-lexicon-prefix"), true;
        }
        return null;
      };
      var xe = { lexicon: function(e3) {
        const t3 = e3.world;
        e3.docs.forEach((e4) => {
          for (let n2 = 0; n2 < e4.length; n2 += 1) if (0 === e4[n2].tags.size) {
            let r2 = null;
            r2 = r2 || Ae(e4, n2, t3), r2 = r2 || je(e4, n2, t3);
          }
        });
      } }, Ie = { one: { expandLexicon: function(e3) {
        let t3 = {}, n2 = {};
        return Object.keys(e3).forEach((r2) => {
          let a2 = e3[r2], o2 = (r2 = (r2 = r2.toLowerCase().trim()).replace(/'s\b/, "")).split(/ /);
          o2.length > 1 && (void 0 === n2[o2[0]] || o2.length > n2[o2[0]]) && (n2[o2[0]] = o2.length), t3[r2] = t3[r2] || a2;
        }), delete t3[""], delete t3.null, delete t3[" "], { lex: t3, _multi: n2 };
      } } }, Te = { addWords: function(e3, t3 = false) {
        const n2 = this.world(), { methods: r2, model: a2 } = n2;
        if (!e3) return;
        if (Object.keys(e3).forEach((t4) => {
          "string" == typeof e3[t4] && e3[t4].startsWith("#") && (e3[t4] = e3[t4].replace(/^#/, ""));
        }), true === t3) {
          let { lex: t4, _multi: o3 } = r2.one.expandLexicon(e3, n2);
          return Object.assign(a2.one._multiCache, o3), void Object.assign(a2.one.frozenLex, t4);
        }
        if (r2.two.expandLexicon) {
          let { lex: t4, _multi: o3 } = r2.two.expandLexicon(e3, n2);
          Object.assign(a2.one.lexicon, t4), Object.assign(a2.one._multiCache, o3);
        }
        let { lex: o2, _multi: i2 } = r2.one.expandLexicon(e3, n2);
        Object.assign(a2.one.lexicon, o2), Object.assign(a2.one._multiCache, i2);
      } }, De = { model: { one: { lexicon: {}, _multiCache: {}, frozenLex: {} } }, methods: Ie, compute: xe, lib: Te, hooks: ["lexicon"] };
      const He = function(e3, t3) {
        let n2 = [{}], r2 = [null], a2 = [0], o2 = [], i2 = 0;
        e3.forEach(function(e4) {
          let a3 = 0, o3 = function(e5, t4) {
            const { methods: n3, model: r3 } = t4;
            let a4 = n3.one.tokenize.splitTerms(e5, r3).map((e6) => n3.one.tokenize.splitWhitespace(e6, r3));
            return a4.map((e6) => e6.text.toLowerCase());
          }(e4, t3);
          for (let e5 = 0; e5 < o3.length; e5++) {
            let t4 = o3[e5];
            n2[a3] && n2[a3].hasOwnProperty(t4) ? a3 = n2[a3][t4] : (i2++, n2[a3][t4] = i2, n2[i2] = {}, a3 = i2, r2[i2] = null);
          }
          r2[a3] = [o3.length];
        });
        for (let e4 in n2[0]) i2 = n2[0][e4], a2[i2] = 0, o2.push(i2);
        for (; o2.length; ) {
          let e4 = o2.shift(), t4 = Object.keys(n2[e4]);
          for (let s2 = 0; s2 < t4.length; s2 += 1) {
            let l2 = t4[s2], u2 = n2[e4][l2];
            for (o2.push(u2), i2 = a2[e4]; i2 > 0 && !n2[i2].hasOwnProperty(l2); ) i2 = a2[i2];
            if (n2.hasOwnProperty(i2)) {
              let e5 = n2[i2][l2];
              a2[u2] = e5, r2[e5] && (r2[u2] = r2[u2] || [], r2[u2] = r2[u2].concat(r2[e5]));
            } else a2[u2] = 0;
          }
        }
        return { goNext: n2, endAs: r2, failTo: a2 };
      }, Ee = function(e3, t3, n2) {
        let r2 = 0, a2 = [];
        for (let o2 = 0; o2 < e3.length; o2++) {
          let i2 = e3[o2][n2.form] || e3[o2].normal;
          for (; r2 > 0 && (void 0 === t3.goNext[r2] || !t3.goNext[r2].hasOwnProperty(i2)); ) r2 = t3.failTo[r2] || 0;
          if (t3.goNext[r2].hasOwnProperty(i2) && (r2 = t3.goNext[r2][i2], t3.endAs[r2])) {
            let n3 = t3.endAs[r2];
            for (let t4 = 0; t4 < n3.length; t4++) {
              let r3 = n3[t4], i3 = e3[o2 - r3 + 1], [s2, l2] = i3.index;
              a2.push([s2, l2, l2 + r3, i3.id]);
            }
          }
        }
        return a2;
      }, Ge = function(e3, t3) {
        for (let n2 = 0; n2 < e3.length; n2 += 1) if (true === t3.has(e3[n2])) return false;
        return true;
      }, Oe = (e3, t3) => {
        for (let n2 = e3.length - 1; n2 >= 0; n2 -= 1) if (e3[n2] !== t3) return e3 = e3.slice(0, n2 + 1);
        return e3;
      }, Fe = { buildTrie: function(e3) {
        return function(e4) {
          return e4.goNext = e4.goNext.map((e5) => {
            if (0 !== Object.keys(e5).length) return e5;
          }), e4.goNext = Oe(e4.goNext, void 0), e4.failTo = Oe(e4.failTo, 0), e4.endAs = Oe(e4.endAs, null), e4;
        }(He(e3, this.world()));
      } };
      Fe.compile = Fe.buildTrie;
      var Ve = { api: function(e3) {
        e3.prototype.lookup = function(e4, t3 = {}) {
          if (!e4) return this.none();
          var n2;
          "string" == typeof e4 && (e4 = [e4]);
          let r2 = function(e5, t4, n3) {
            let r3 = [];
            n3.form = n3.form || "normal";
            let a2 = e5.docs;
            if (!t4.goNext || !t4.goNext[0]) return console.error("Compromise invalid lookup trie"), e5.none();
            let o2 = Object.keys(t4.goNext[0]);
            for (let i2 = 0; i2 < a2.length; i2++) {
              if (e5._cache && e5._cache[i2] && true === Ge(o2, e5._cache[i2])) continue;
              let s2 = a2[i2], l2 = Ee(s2, t4, n3);
              l2.length > 0 && (r3 = r3.concat(l2));
            }
            return e5.update(r3);
          }(this, (n2 = e4, "[object Object]" === Object.prototype.toString.call(n2) ? e4 : He(e4, this.world)), t3);
          return r2 = r2.settle(), r2;
        };
      }, lib: Fe };
      const ze = function(e3, t3) {
        return t3 ? (e3.forEach((e4) => {
          let n2 = e4[0];
          t3[n2] && (e4[0] = t3[n2][0], e4[1] += t3[n2][1], e4[2] += t3[n2][1]);
        }), e3) : e3;
      }, Be = function(e3, t3) {
        let { ptrs: n2, byGroup: r2 } = e3;
        return n2 = ze(n2, t3), Object.keys(r2).forEach((e4) => {
          r2[e4] = ze(r2[e4], t3);
        }), { ptrs: n2, byGroup: r2 };
      }, Se = function(e3, t3, n2) {
        const r2 = n2.methods.one;
        return "number" == typeof e3 && (e3 = String(e3)), "string" == typeof e3 && (e3 = r2.killUnicode(e3, n2), e3 = r2.parseMatch(e3, t3, n2)), e3;
      }, $e = (e3) => "[object Object]" === Object.prototype.toString.call(e3), Me = (e3) => e3 && $e(e3) && true === e3.isView, Ke = (e3) => e3 && $e(e3) && true === e3.isNet;
      var Le = { matchOne: function(e3, t3, n2) {
        const r2 = this.methods.one;
        if (Me(e3)) return this.intersection(e3).eq(0);
        if (Ke(e3)) return this.sweep(e3, { tagger: false, matchOne: true }).view;
        let a2 = { regs: e3 = Se(e3, n2, this.world), group: t3, justOne: true }, o2 = r2.match(this.docs, a2, this._cache), { ptrs: i2, byGroup: s2 } = Be(o2, this.fullPointer), l2 = this.toView(i2);
        return l2._groups = s2, l2;
      }, match: function(e3, t3, n2) {
        const r2 = this.methods.one;
        if (Me(e3)) return this.intersection(e3);
        if (Ke(e3)) return this.sweep(e3, { tagger: false }).view.settle();
        let a2 = { regs: e3 = Se(e3, n2, this.world), group: t3 }, o2 = r2.match(this.docs, a2, this._cache), { ptrs: i2, byGroup: s2 } = Be(o2, this.fullPointer), l2 = this.toView(i2);
        return l2._groups = s2, l2;
      }, has: function(e3, t3, n2) {
        const r2 = this.methods.one;
        if (Me(e3)) return this.intersection(e3).fullPointer.length > 0;
        if (Ke(e3)) return this.sweep(e3, { tagger: false }).view.found;
        let a2 = { regs: e3 = Se(e3, n2, this.world), group: t3, justOne: true };
        return r2.match(this.docs, a2, this._cache).ptrs.length > 0;
      }, if: function(e3, t3, n2) {
        const r2 = this.methods.one;
        if (Me(e3)) return this.filter((t4) => t4.intersection(e3).found);
        if (Ke(e3)) {
          let t4 = this.sweep(e3, { tagger: false }).view.settle();
          return this.if(t4);
        }
        let a2 = { regs: e3 = Se(e3, n2, this.world), group: t3, justOne: true }, o2 = this.fullPointer, i2 = this._cache || [];
        o2 = o2.filter((e4, t4) => {
          let n3 = this.update([e4]);
          return r2.match(n3.docs, a2, i2[t4]).ptrs.length > 0;
        });
        let s2 = this.update(o2);
        return this._cache && (s2._cache = o2.map((e4) => i2[e4[0]])), s2;
      }, ifNo: function(e3, t3, n2) {
        const { methods: r2 } = this, a2 = r2.one;
        if (Me(e3)) return this.filter((t4) => !t4.intersection(e3).found);
        if (Ke(e3)) {
          let t4 = this.sweep(e3, { tagger: false }).view.settle();
          return this.ifNo(t4);
        }
        e3 = Se(e3, n2, this.world);
        let o2 = this._cache || [], i2 = this.filter((n3, r3) => {
          let i3 = { regs: e3, group: t3, justOne: true };
          return 0 === a2.match(n3.docs, i3, o2[r3]).ptrs.length;
        });
        return this._cache && (i2._cache = i2.ptrs.map((e4) => o2[e4[0]])), i2;
      } }, Je = { before: function(e3, t3, n2) {
        const { indexN: r2 } = this.methods.one.pointer;
        let a2 = [], o2 = r2(this.fullPointer);
        Object.keys(o2).forEach((e4) => {
          let t4 = o2[e4].sort((e5, t5) => e5[1] > t5[1] ? 1 : -1)[0];
          t4[1] > 0 && a2.push([t4[0], 0, t4[1]]);
        });
        let i2 = this.toView(a2);
        return e3 ? i2.match(e3, t3, n2) : i2;
      }, after: function(e3, t3, n2) {
        const { indexN: r2 } = this.methods.one.pointer;
        let a2 = [], o2 = r2(this.fullPointer), i2 = this.document;
        Object.keys(o2).forEach((e4) => {
          let t4 = o2[e4].sort((e5, t5) => e5[1] > t5[1] ? -1 : 1)[0], [n3, , r3] = t4;
          r3 < i2[n3].length && a2.push([n3, r3, i2[n3].length]);
        });
        let s2 = this.toView(a2);
        return e3 ? s2.match(e3, t3, n2) : s2;
      }, growLeft: function(e3, t3, n2) {
        "string" == typeof e3 && (e3 = this.world.methods.one.parseMatch(e3, n2, this.world)), e3[e3.length - 1].end = true;
        let r2 = this.fullPointer;
        return this.forEach((n3, a2) => {
          let o2 = n3.before(e3, t3);
          if (o2.found) {
            let e4 = o2.terms();
            r2[a2][1] -= e4.length, r2[a2][3] = e4.docs[0][0].id;
          }
        }), this.update(r2);
      }, growRight: function(e3, t3, n2) {
        "string" == typeof e3 && (e3 = this.world.methods.one.parseMatch(e3, n2, this.world)), e3[0].start = true;
        let r2 = this.fullPointer;
        return this.forEach((n3, a2) => {
          let o2 = n3.after(e3, t3);
          if (o2.found) {
            let e4 = o2.terms();
            r2[a2][2] += e4.length, r2[a2][4] = null;
          }
        }), this.update(r2);
      }, grow: function(e3, t3, n2) {
        return this.growRight(e3, t3, n2).growLeft(e3, t3, n2);
      } };
      const We = function(e3, t3) {
        return [e3[0], e3[1], t3[2]];
      }, qe = (e3, t3, n2) => {
        return "string" == typeof e3 || (r2 = e3, "[object Array]" === Object.prototype.toString.call(r2)) ? t3.match(e3, n2) : e3 || t3.none();
        var r2;
      }, Ue = function(e3, t3) {
        let [n2, r2, a2] = e3;
        return t3.document[n2] && t3.document[n2][r2] && (e3[3] = e3[3] || t3.document[n2][r2].id, t3.document[n2][a2 - 1] && (e3[4] = e3[4] || t3.document[n2][a2 - 1].id)), e3;
      }, Re = { splitOn: function(e3, t3) {
        const { splitAll: n2 } = this.methods.one.pointer;
        let r2 = qe(e3, this, t3).fullPointer, a2 = n2(this.fullPointer, r2), o2 = [];
        return a2.forEach((e4) => {
          o2.push(e4.passthrough), o2.push(e4.before), o2.push(e4.match), o2.push(e4.after);
        }), o2 = o2.filter((e4) => e4), o2 = o2.map((e4) => Ue(e4, this)), this.update(o2);
      }, splitBefore: function(e3, t3) {
        const { splitAll: n2 } = this.methods.one.pointer;
        let r2 = qe(e3, this, t3).fullPointer, a2 = n2(this.fullPointer, r2);
        for (let e4 = 0; e4 < a2.length; e4 += 1) !a2[e4].after && a2[e4 + 1] && a2[e4 + 1].before && a2[e4].match && a2[e4].match[0] === a2[e4 + 1].before[0] && (a2[e4].after = a2[e4 + 1].before, delete a2[e4 + 1].before);
        let o2 = [];
        return a2.forEach((e4) => {
          o2.push(e4.passthrough), o2.push(e4.before), e4.match && e4.after ? o2.push(We(e4.match, e4.after)) : o2.push(e4.match);
        }), o2 = o2.filter((e4) => e4), o2 = o2.map((e4) => Ue(e4, this)), this.update(o2);
      }, splitAfter: function(e3, t3) {
        const { splitAll: n2 } = this.methods.one.pointer;
        let r2 = qe(e3, this, t3).fullPointer, a2 = n2(this.fullPointer, r2), o2 = [];
        return a2.forEach((e4) => {
          o2.push(e4.passthrough), e4.before && e4.match ? o2.push(We(e4.before, e4.match)) : (o2.push(e4.before), o2.push(e4.match)), o2.push(e4.after);
        }), o2 = o2.filter((e4) => e4), o2 = o2.map((e4) => Ue(e4, this)), this.update(o2);
      } };
      Re.split = Re.splitAfter;
      const Qe = function(e3, t3) {
        return !(!e3 || !t3) && e3[0] === t3[0] && e3[2] === t3[1];
      }, Ze = function(e3, t3, n2) {
        const r2 = e3.world, a2 = r2.methods.one.parseMatch;
        n2 = n2 || "^.";
        let o2 = a2(t3 = t3 || ".$", {}, r2), i2 = a2(n2, {}, r2);
        o2[o2.length - 1].end = true, i2[0].start = true;
        let s2 = e3.fullPointer, l2 = [s2[0]];
        for (let t4 = 1; t4 < s2.length; t4 += 1) {
          let n3 = l2[l2.length - 1], r3 = s2[t4], a3 = e3.update([n3]), u2 = e3.update([r3]);
          Qe(n3, r3) && a3.has(o2) && u2.has(i2) ? l2[l2.length - 1] = [n3[0], n3[1], r3[2], n3[3], r3[4]] : l2.push(r3);
        }
        return e3.update(l2);
      }, _e = { joinIf: function(e3, t3) {
        return Ze(this, e3, t3);
      }, join: function() {
        return Ze(this);
      } }, Xe = Object.assign({}, Le, Je, Re, _e);
      Xe.lookBehind = Xe.before, Xe.lookBefore = Xe.before, Xe.lookAhead = Xe.after, Xe.lookAfter = Xe.after, Xe.notIf = Xe.ifNo;
      const Ye = /(?:^|\s)([![^]*(?:<[^<]*>)?\/.*?[^\\/]\/[?\]+*$~]*)(?:\s|$)/, et = /([!~[^]*(?:<[^<]*>)?\([^)]+[^\\)]\)[?\]+*$~]*)(?:\s|$)/, tt = / /g, nt = (e3) => /^[![^]*(<[^<]*>)?\//.test(e3) && /\/[?\]+*$~]*$/.test(e3), rt = function(e3) {
        return e3 = (e3 = e3.map((e4) => e4.trim())).filter((e4) => e4);
      }, at = /\{([0-9]+)?(, *[0-9]*)?\}/, ot = /&&/, it = new RegExp(/^<\s*(\S+)\s*>/), st = (e3) => e3.charAt(0).toUpperCase() + e3.substring(1), lt = (e3) => e3.charAt(e3.length - 1), ut = (e3) => e3.charAt(0), ct = (e3) => e3.substring(1), ht = (e3) => e3.substring(0, e3.length - 1), dt = function(e3) {
        return e3 = ct(e3), e3 = ht(e3);
      }, gt = function(e3, t3) {
        let n2 = {};
        for (let r2 = 0; r2 < 2; r2 += 1) {
          if ("$" === lt(e3) && (n2.end = true, e3 = ht(e3)), "^" === ut(e3) && (n2.start = true, e3 = ct(e3)), "?" === lt(e3) && (n2.optional = true, e3 = ht(e3)), ("[" === ut(e3) || "]" === lt(e3)) && (n2.group = null, "[" === ut(e3) && (n2.groupStart = true), "]" === lt(e3) && (n2.groupEnd = true), e3 = (e3 = e3.replace(/^\[/, "")).replace(/\]$/, ""), "<" === ut(e3))) {
            const t4 = it.exec(e3);
            t4.length >= 2 && (n2.group = t4[1], e3 = e3.replace(t4[0], ""));
          }
          if ("+" === lt(e3) && (n2.greedy = true, e3 = ht(e3)), "*" !== e3 && "*" === lt(e3) && "\\*" !== e3 && (n2.greedy = true, e3 = ht(e3)), "!" === ut(e3) && (n2.negative = true, e3 = ct(e3)), "~" === ut(e3) && "~" === lt(e3) && e3.length > 2 && (e3 = dt(e3), n2.fuzzy = true, n2.min = t3.fuzzy || 0.85, false === /\(/.test(e3))) return n2.word = e3, n2;
          if ("/" === ut(e3) && "/" === lt(e3)) return e3 = dt(e3), t3.caseSensitive && (n2.use = "text"), n2.regex = new RegExp(e3), n2;
          if (true === at.test(e3) && (e3 = e3.replace(at, (e4, t4, r3) => (void 0 === r3 ? (n2.min = Number(t4), n2.max = Number(t4)) : (r3 = r3.replace(/, */, ""), void 0 === t4 ? (n2.min = 0, n2.max = Number(r3)) : (n2.min = Number(t4), n2.max = Number(r3 || 999))), n2.greedy = true, n2.min || (n2.optional = true), ""))), "(" === ut(e3) && ")" === lt(e3)) {
            ot.test(e3) ? (n2.choices = e3.split(ot), n2.operator = "and") : (n2.choices = e3.split("|"), n2.operator = "or"), n2.choices[0] = ct(n2.choices[0]);
            let r3 = n2.choices.length - 1;
            n2.choices[r3] = ht(n2.choices[r3]), n2.choices = n2.choices.map((e4) => e4.trim()), n2.choices = n2.choices.filter((e4) => e4), n2.choices = n2.choices.map((e4) => e4.split(/ /g).map((e5) => gt(e5, t3))), e3 = "";
          }
          if ("{" === ut(e3) && "}" === lt(e3)) {
            if (e3 = dt(e3), n2.root = e3, /\//.test(e3)) {
              let e4 = n2.root.split(/\//);
              n2.root = e4[0], n2.pos = e4[1], "adj" === n2.pos && (n2.pos = "Adjective"), n2.pos = n2.pos.charAt(0).toUpperCase() + n2.pos.substr(1).toLowerCase(), void 0 !== e4[2] && (n2.sense = e4[2]);
            }
            return n2;
          }
          if ("<" === ut(e3) && ">" === lt(e3)) return e3 = dt(e3), n2.chunk = st(e3), n2.greedy = true, n2;
          if ("%" === ut(e3) && "%" === lt(e3)) return e3 = dt(e3), n2.switch = e3, n2;
        }
        return "#" === ut(e3) ? (n2.tag = ct(e3), n2.tag = st(n2.tag), n2) : "@" === ut(e3) ? (n2.method = ct(e3), n2) : "." === e3 ? (n2.anything = true, n2) : "*" === e3 ? (n2.anything = true, n2.greedy = true, n2.optional = true, n2) : (e3 && (e3 = (e3 = e3.replace("\\*", "*")).replace("\\.", "."), t3.caseSensitive ? n2.use = "text" : e3 = e3.toLowerCase(), n2.word = e3), n2);
      }, mt = /[a-z0-9][-–—][a-z]/i, pt = function(e3, t3) {
        let { all: n2 } = t3.methods.two.transform.verb || {}, r2 = e3.root;
        return n2 ? n2(r2, t3.model) : [];
      }, ft = function(e3, t3) {
        let { all: n2 } = t3.methods.two.transform.noun || {};
        return n2 ? n2(e3.root, t3.model) : [e3.root];
      }, bt = function(e3, t3) {
        let { all: n2 } = t3.methods.two.transform.adjective || {};
        return n2 ? n2(e3.root, t3.model) : [e3.root];
      }, vt = function(e3) {
        return e3 = function(e4) {
          let t3 = 0, n2 = null;
          for (let r2 = 0; r2 < e4.length; r2++) {
            const a2 = e4[r2];
            true === a2.groupStart && (n2 = a2.group, null === n2 && (n2 = String(t3), t3 += 1)), null !== n2 && (a2.group = n2), true === a2.groupEnd && (n2 = null);
          }
          return e4;
        }(e3), e3 = function(e4) {
          return e4.map((e5) => (e5.fuzzy && e5.choices && e5.choices.forEach((t3) => {
            1 === t3.length && t3[0].word && (t3[0].fuzzy = true, t3[0].min = e5.min);
          }), e5));
        }(e3 = e3.map((e4) => {
          if (void 0 !== e4.choices) {
            if ("or" !== e4.operator) return e4;
            if (true === e4.fuzzy) return e4;
            true === e4.choices.every((e5) => {
              if (1 !== e5.length) return false;
              let t3 = e5[0];
              return true !== t3.fuzzy && !t3.start && !t3.end && void 0 !== t3.word && true !== t3.negative && true !== t3.optional && true !== t3.method;
            }) && (e4.fastOr = /* @__PURE__ */ new Set(), e4.choices.forEach((t3) => {
              e4.fastOr.add(t3[0].word);
            }), delete e4.choices);
          }
          return e4;
        })), e3;
      }, yt = function(e3, t3) {
        for (let n2 of t3) if (e3.has(n2)) return true;
        return false;
      }, wt = function(e3, t3) {
        for (let n2 = 0; n2 < e3.length; n2 += 1) {
          let r2 = e3[n2];
          if (true !== r2.optional && true !== r2.negative && true !== r2.fuzzy) {
            if (void 0 !== r2.word && false === t3.has(r2.word)) return true;
            if (void 0 !== r2.tag && false === t3.has("#" + r2.tag)) return true;
            if (r2.fastOr && false === yt(r2.fastOr, t3)) return false;
          }
        }
        return false;
      }, kt = function(e3, t3, n2 = 3) {
        if (e3 === t3) return 1;
        if (e3.length < n2 || t3.length < n2) return 0;
        const r2 = function(e4, t4) {
          let n3 = e4.length, r3 = t4.length;
          if (0 === n3) return r3;
          if (0 === r3) return n3;
          let a3 = (r3 > n3 ? r3 : n3) + 1;
          if (Math.abs(n3 - r3) > (a3 || 100)) return a3 || 100;
          let o2, i2, s2, l2, u2, c2, h2 = [];
          for (let e5 = 0; e5 < a3; e5++) h2[e5] = [e5], h2[e5].length = a3;
          for (let e5 = 0; e5 < a3; e5++) h2[0][e5] = e5;
          for (let a4 = 1; a4 <= n3; ++a4) for (i2 = e4[a4 - 1], o2 = 1; o2 <= r3; ++o2) {
            if (a4 === o2 && h2[a4][o2] > 4) return n3;
            s2 = t4[o2 - 1], l2 = i2 === s2 ? 0 : 1, u2 = h2[a4 - 1][o2] + 1, (c2 = h2[a4][o2 - 1] + 1) < u2 && (u2 = c2), (c2 = h2[a4 - 1][o2 - 1] + l2) < u2 && (u2 = c2);
            let r4 = a4 > 1 && o2 > 1 && i2 === t4[o2 - 2] && e4[a4 - 2] === s2 && (c2 = h2[a4 - 2][o2 - 2] + l2) < u2;
            h2[a4][o2] = r4 ? c2 : u2;
          }
          return h2[n3][r3];
        }(e3, t3);
        let a2 = Math.max(e3.length, t3.length);
        return 1 - (0 === a2 ? 0 : r2 / a2);
      }, Pt = /([\u0022\uFF02\u0027\u201C\u2018\u201F\u201B\u201E\u2E42\u201A\u00AB\u2039\u2035\u2036\u2037\u301D\u0060\u301F])/, At = /([\u0022\uFF02\u0027\u201D\u2019\u00BB\u203A\u2032\u2033\u2034\u301E\u00B4])/, Ct = /^[-–—]$/, Nt = / [-–—]{1,3} /, jt = (e3, t3) => -1 !== e3.post.indexOf(t3), xt = { hasQuote: (e3) => Pt.test(e3.pre) || At.test(e3.post), hasComma: (e3) => jt(e3, ","), hasPeriod: (e3) => true === jt(e3, ".") && false === jt(e3, "..."), hasExclamation: (e3) => jt(e3, "!"), hasQuestionMark: (e3) => jt(e3, "?") || jt(e3, "\xBF"), hasEllipses: (e3) => jt(e3, "..") || jt(e3, "\u2026"), hasSemicolon: (e3) => jt(e3, ";"), hasColon: (e3) => jt(e3, ":"), hasSlash: (e3) => /\//.test(e3.text), hasHyphen: (e3) => Ct.test(e3.post) || Ct.test(e3.pre), hasDash: (e3) => Nt.test(e3.post) || Nt.test(e3.pre), hasContraction: (e3) => Boolean(e3.implicit), isAcronym: (e3) => e3.tags.has("Acronym"), isKnown: (e3) => e3.tags.size > 0, isTitleCase: (e3) => /^\p{Lu}[a-z'\u00C0-\u00FF]/u.test(e3.text), isUpperCase: (e3) => /^\p{Lu}+$/u.test(e3.text) };
      xt.hasQuotation = xt.hasQuote;
      let It = function() {
      };
      It = function(e3, t3, n2, r2) {
        let a2 = function(e4, t4, n3, r3) {
          if (true === t4.anything) return true;
          if (true === t4.start && 0 !== n3) return false;
          if (true === t4.end && n3 !== r3 - 1) return false;
          if (void 0 !== t4.id && t4.id === e4.id) return true;
          if (void 0 !== t4.word) {
            if (t4.use) return t4.word === e4[t4.use];
            if (null !== e4.machine && e4.machine === t4.word) return true;
            if (void 0 !== e4.alias && e4.alias.hasOwnProperty(t4.word)) return true;
            if (true === t4.fuzzy) {
              if (t4.word === e4.root) return true;
              if (kt(t4.word, e4.normal) >= t4.min) return true;
            }
            return !(!e4.alias || !e4.alias.some((e5) => e5 === t4.word)) || t4.word === e4.text || t4.word === e4.normal;
          }
          if (void 0 !== t4.tag) return true === e4.tags.has(t4.tag);
          if (void 0 !== t4.method) return "function" == typeof xt[t4.method] && true === xt[t4.method](e4);
          if (void 0 !== t4.pre) return e4.pre && e4.pre.includes(t4.pre);
          if (void 0 !== t4.post) return e4.post && e4.post.includes(t4.post);
          if (void 0 !== t4.regex) {
            let n4 = e4.normal;
            return t4.use && (n4 = e4[t4.use]), t4.regex.test(n4);
          }
          if (void 0 !== t4.chunk) return e4.chunk === t4.chunk;
          if (void 0 !== t4.switch) return e4.switch === t4.switch;
          if (void 0 !== t4.machine) return e4.normal === t4.machine || e4.machine === t4.machine || e4.root === t4.machine;
          if (void 0 !== t4.sense) return e4.sense === t4.sense;
          if (void 0 !== t4.fastOr) {
            if (t4.pos && !e4.tags.has(t4.pos)) return null;
            let n4 = e4.root || e4.implicit || e4.machine || e4.normal;
            return t4.fastOr.has(n4) || t4.fastOr.has(e4.text);
          }
          return void 0 !== t4.choices && ("and" === t4.operator ? t4.choices.every((t5) => It(e4, t5, n3, r3)) : t4.choices.some((t5) => It(e4, t5, n3, r3)));
        }(e3, t3, n2, r2);
        return true === t3.negative ? !a2 : a2;
      };
      const Tt = function(e3, t3) {
        if (true === e3.end && true === e3.greedy && t3.start_i + t3.t < t3.phrase_length - 1) {
          let n2 = Object.assign({}, e3, { end: false });
          if (true === It(t3.terms[t3.t], n2, t3.start_i + t3.t, t3.phrase_length)) return true;
        }
        return false;
      }, Dt = function(e3, t3) {
        return e3.groups[e3.inGroup] || (e3.groups[e3.inGroup] = { start: t3, length: 0 }), e3.groups[e3.inGroup];
      }, Ht = function(e3) {
        let { regs: t3 } = e3, n2 = t3[e3.r], r2 = function(e4, t4) {
          let n3 = e4.t;
          if (!t4) return e4.terms.length;
          for (; n3 < e4.terms.length; n3 += 1) if (true === It(e4.terms[n3], t4, e4.start_i + n3, e4.phrase_length)) return n3;
          return null;
        }(e3, t3[e3.r + 1]);
        return null === r2 || 0 === r2 || void 0 !== n2.min && r2 - e3.t < n2.min ? null : void 0 !== n2.max && r2 - e3.t > n2.max ? (e3.t = e3.t + n2.max, true) : (true === e3.hasGroup && (Dt(e3, e3.t).length = r2 - e3.t), e3.t = r2, true);
      }, Et = function(e3, t3 = 0) {
        let n2 = e3.regs[e3.r], r2 = false;
        for (let o2 = 0; o2 < n2.choices.length; o2 += 1) {
          let i2 = n2.choices[o2];
          if (a2 = i2, "[object Array]" !== Object.prototype.toString.call(a2)) return false;
          if (r2 = i2.every((n3, r3) => {
            let a3 = 0, o3 = e3.t + r3 + t3 + a3;
            if (void 0 === e3.terms[o3]) return false;
            let i3 = It(e3.terms[o3], n3, o3 + e3.start_i, e3.phrase_length);
            if (true === i3 && true === n3.greedy) for (let t4 = 1; t4 < e3.terms.length; t4 += 1) {
              let r4 = e3.terms[o3 + t4];
              if (r4) {
                if (true !== It(r4, n3, e3.start_i + t4, e3.phrase_length)) break;
                a3 += 1;
              }
            }
            return t3 += a3, i3;
          }), r2) {
            t3 += i2.length;
            break;
          }
        }
        var a2;
        return r2 && true === n2.greedy ? Et(e3, t3) : t3;
      }, Gt = function(e3) {
        const { regs: t3 } = e3;
        let n2 = t3[e3.r], r2 = Et(e3);
        if (r2) {
          if (true === n2.negative) return null;
          if (true === e3.hasGroup && (Dt(e3, e3.t).length += r2), true === n2.end) {
            let t4 = e3.phrase_length;
            if (e3.t + e3.start_i + r2 !== t4) return null;
          }
          return e3.t += r2, true;
        }
        return !!n2.optional || null;
      }, Ot = function(e3) {
        const { regs: t3 } = e3;
        let n2 = t3[e3.r], r2 = function(e4) {
          let t4 = 0;
          return true === e4.regs[e4.r].choices.every((n3) => {
            let r3 = n3.every((t5, n4) => {
              let r4 = e4.t + n4;
              return void 0 !== e4.terms[r4] && It(e4.terms[r4], t5, r4, e4.phrase_length);
            });
            return true === r3 && n3.length > t4 && (t4 = n3.length), r3;
          }) && t4;
        }(e3);
        if (r2) {
          if (true === n2.negative) return null;
          if (true === e3.hasGroup && (Dt(e3, e3.t).length += r2), true === n2.end) {
            let t4 = e3.phrase_length - 1;
            if (e3.t + e3.start_i !== t4) return null;
          }
          return e3.t += r2, true;
        }
        return !!n2.optional || null;
      }, Ft = function(e3) {
        const { regs: t3 } = e3;
        let n2 = t3[e3.r], r2 = Object.assign({}, n2);
        if (r2.negative = false, It(e3.terms[e3.t], r2, e3.start_i + e3.t, e3.phrase_length)) return false;
        if (n2.optional) {
          let n3 = t3[e3.r + 1];
          n3 && (It(e3.terms[e3.t], n3, e3.start_i + e3.t, e3.phrase_length) ? e3.r += 1 : n3.optional && t3[e3.r + 2] && It(e3.terms[e3.t], t3[e3.r + 2], e3.start_i + e3.t, e3.phrase_length) && (e3.r += 2));
        }
        return n2.greedy ? function(e4, t4, n3) {
          let r3 = 0;
          for (let a2 = e4.t; a2 < e4.terms.length; a2 += 1) {
            let o2 = It(e4.terms[a2], t4, e4.start_i + e4.t, e4.phrase_length);
            if (o2) break;
            if (n3 && (o2 = It(e4.terms[a2], n3, e4.start_i + e4.t, e4.phrase_length), o2)) break;
            if (r3 += 1, void 0 !== t4.max && r3 === t4.max) break;
          }
          return !(0 === r3 || t4.min && t4.min > r3 || (e4.t += r3, 0));
        }(e3, r2, t3[e3.r + 1]) : (e3.t += 1, true);
      }, Vt = function(e3) {
        const { regs: t3, phrase_length: n2 } = e3;
        let r2 = t3[e3.r];
        return e3.t = function(e4, t4) {
          let n3 = Object.assign({}, e4.regs[e4.r], { start: false, end: false }), r3 = e4.t;
          for (; e4.t < e4.terms.length; e4.t += 1) {
            if (t4 && It(e4.terms[e4.t], t4, e4.start_i + e4.t, e4.phrase_length)) return e4.t;
            let a2 = e4.t - r3 + 1;
            if (void 0 !== n3.max && a2 === n3.max) return e4.t;
            if (false === It(e4.terms[e4.t], n3, e4.start_i + e4.t, e4.phrase_length)) return void 0 !== n3.min && a2 < n3.min ? null : e4.t;
          }
          return e4.t;
        }(e3, t3[e3.r + 1]), null === e3.t || r2.min && r2.min > e3.t ? null : true !== r2.end || e3.start_i + e3.t === n2 || null;
      }, zt = function(e3) {
        const { regs: t3 } = e3;
        let n2 = t3[e3.r], r2 = e3.terms[e3.t], a2 = e3.t;
        return !!(n2.optional && t3[e3.r + 1] && n2.negative) || (n2.optional && t3[e3.r + 1] && function(e4) {
          const { regs: t4 } = e4;
          let n3 = t4[e4.r], r3 = e4.terms[e4.t], a3 = It(r3, t4[e4.r + 1], e4.start_i + e4.t, e4.phrase_length);
          if (n3.negative || a3) {
            let n4 = e4.terms[e4.t + 1];
            n4 && It(n4, t4[e4.r + 1], e4.start_i + e4.t, e4.phrase_length) || (e4.r += 1);
          }
        }(e3), r2.implicit && e3.terms[e3.t + 1] && function(e4) {
          let t4 = e4.terms[e4.t], n3 = e4.regs[e4.r];
          if (t4.implicit && e4.terms[e4.t + 1]) {
            if (!e4.terms[e4.t + 1].implicit) return;
            n3.word === t4.normal && (e4.t += 1), "hasContraction" === n3.method && (e4.t += 1);
          }
        }(e3), e3.t += 1, true === n2.end && e3.t !== e3.terms.length && true !== n2.greedy ? null : true !== n2.greedy || Vt(e3) ? (true === e3.hasGroup && function(e4, t4) {
          let n3 = e4.regs[e4.r];
          const r3 = Dt(e4, t4);
          e4.t > 1 && n3.greedy ? r3.length += e4.t - t4 : r3.length++;
        }(e3, a2), true) : null);
      }, Bt = function(e3, t3, n2, r2) {
        if (0 === e3.length || 0 === t3.length) return null;
        let a2 = { t: 0, terms: e3, r: 0, regs: t3, groups: {}, start_i: n2, phrase_length: r2, inGroup: null };
        for (; a2.r < t3.length; a2.r += 1) {
          let e4 = t3[a2.r];
          if (a2.hasGroup = Boolean(e4.group), true === a2.hasGroup ? a2.inGroup = e4.group : a2.inGroup = null, !a2.terms[a2.t]) {
            if (false === t3.slice(a2.r).some((e5) => !e5.optional)) break;
            return null;
          }
          if (true !== e4.anything || true !== e4.greedy) {
            if (void 0 === e4.choices || "or" !== e4.operator) {
              if (void 0 === e4.choices || "and" !== e4.operator) if (true !== e4.anything) {
                if (true !== Tt(e4, a2)) {
                  if (e4.negative) {
                    if (!Ft(a2)) return null;
                  } else if (true !== It(a2.terms[a2.t], e4, a2.start_i + a2.t, a2.phrase_length)) {
                    if (true !== e4.optional) return null;
                  } else if (!zt(a2)) return null;
                } else if (!zt(a2)) return null;
              } else {
                if (e4.negative && e4.anything) return null;
                if (!zt(a2)) return null;
              }
              else if (!Ot(a2)) return null;
            } else if (!Gt(a2)) return null;
          } else if (!Ht(a2)) return null;
        }
        let o2 = [null, n2, a2.t + n2];
        if (o2[1] === o2[2]) return null;
        let i2 = {};
        return Object.keys(a2.groups).forEach((e4) => {
          let t4 = a2.groups[e4], r3 = n2 + t4.start;
          i2[e4] = [null, r3, r3 + t4.length];
        }), { pointer: o2, groups: i2 };
      }, St = function(e3, t3) {
        return e3.pointer[0] = t3, Object.keys(e3.groups).forEach((n2) => {
          e3.groups[n2][0] = t3;
        }), e3;
      }, $t = function(e3, t3, n2) {
        let r2 = Bt(e3, t3, 0, e3.length);
        return r2 ? (r2 = St(r2, n2), r2) : null;
      }, Mt = { one: { termMethods: xt, parseMatch: function(e3, t3, n2) {
        if (null == e3 || "" === e3) return [];
        t3 = t3 || {}, "number" == typeof e3 && (e3 = String(e3));
        let r2 = function(e4) {
          let t4 = e4.split(Ye), n3 = [];
          t4.forEach((e5) => {
            nt(e5) ? n3.push(e5) : n3 = n3.concat(e5.split(et));
          }), n3 = rt(n3);
          let r3 = [];
          return n3.forEach((e5) => {
            ((e6) => /^[![^]*(<[^<]*>)?\(/.test(e6) && /\)[?\]+*$~]*$/.test(e6))(e5) || nt(e5) ? r3.push(e5) : r3 = r3.concat(e5.split(tt));
          }), r3 = rt(r3), r3;
        }(e3);
        return r2 = r2.map((e4) => gt(e4, t3)), r2 = function(e4, t4) {
          let n3 = t4.model.one.prefixes;
          for (let t5 = e4.length - 1; t5 >= 0; t5 -= 1) {
            let r3 = e4[t5];
            if (r3.word && mt.test(r3.word)) {
              let a2 = r3.word.split(/[-–—]/g);
              if (n3.hasOwnProperty(a2[0])) continue;
              a2 = a2.filter((e5) => e5).reverse(), e4.splice(t5, 1), a2.forEach((n4) => {
                let a3 = Object.assign({}, r3);
                a3.word = n4, e4.splice(t5, 0, a3);
              });
            }
          }
          return e4;
        }(r2, n2), r2 = function(e4, t4) {
          return e4.map((e5) => {
            if (e5.root) if (t4.methods.two && t4.methods.two.transform) {
              let n3 = [];
              e5.pos ? "Verb" === e5.pos ? n3 = n3.concat(pt(e5, t4)) : "Noun" === e5.pos ? n3 = n3.concat(ft(e5, t4)) : "Adjective" === e5.pos && (n3 = n3.concat(bt(e5, t4))) : (n3 = n3.concat(pt(e5, t4)), n3 = n3.concat(ft(e5, t4)), n3 = n3.concat(bt(e5, t4))), n3 = n3.filter((e6) => e6), n3.length > 0 && (e5.operator = "or", e5.fastOr = new Set(n3));
            } else e5.machine = e5.root, delete e5.id, delete e5.root;
            return e5;
          });
        }(r2, n2), r2 = vt(r2), r2;
      }, match: function(e3, t3, n2) {
        n2 = n2 || [];
        let { regs: r2, group: a2, justOne: o2 } = t3, i2 = [];
        if (!r2 || 0 === r2.length) return { ptrs: [], byGroup: {} };
        const s2 = r2.filter((e4) => true !== e4.optional && true !== e4.negative).length;
        e: for (let t4 = 0; t4 < e3.length; t4 += 1) {
          let a3 = e3[t4];
          if (!n2[t4] || !wt(r2, n2[t4])) if (true !== r2[0].start) for (let e4 = 0; e4 < a3.length; e4 += 1) {
            let n3 = a3.slice(e4);
            if (n3.length < s2) break;
            let l2 = Bt(n3, r2, e4, a3.length);
            if (l2) {
              if (l2 = St(l2, t4), i2.push(l2), true === o2) break e;
              let n4 = l2.pointer[2];
              Math.abs(n4 - 1) > e4 && (e4 = Math.abs(n4 - 1));
            }
          }
          else {
            let e4 = $t(a3, r2, t4);
            e4 && i2.push(e4);
          }
        }
        return true === r2[r2.length - 1].end && (i2 = i2.filter((t4) => {
          let n3 = t4.pointer[0];
          return e3[n3].length === t4.pointer[2];
        })), t3.notIf && (i2 = function(e4, t4, n3) {
          return e4 = e4.filter((e5) => {
            let [r3, a3, o3] = e5.pointer, i3 = n3[r3].slice(a3, o3);
            for (let e6 = 0; e6 < i3.length; e6 += 1) {
              let n4 = i3.slice(e6);
              if (null !== Bt(n4, t4, e6, i3.length)) return false;
            }
            return true;
          }), e4;
        }(i2, t3.notIf, e3)), i2 = function(e4, t4) {
          let n3 = [], r3 = {};
          return 0 === e4.length || ("number" == typeof t4 && (t4 = String(t4)), t4 ? e4.forEach((e5) => {
            e5.groups[t4] && n3.push(e5.groups[t4]);
          }) : e4.forEach((e5) => {
            n3.push(e5.pointer), Object.keys(e5.groups).forEach((t5) => {
              r3[t5] = r3[t5] || [], r3[t5].push(e5.groups[t5]);
            });
          })), { ptrs: n3, byGroup: r3 };
        }(i2, a2), i2.ptrs.forEach((t4) => {
          let [n3, r3, a3] = t4;
          t4[3] = e3[n3][r3].id, t4[4] = e3[n3][a3 - 1].id;
        }), i2;
      } } };
      var Kt = { api: function(e3) {
        Object.assign(e3.prototype, Xe);
      }, methods: Mt, lib: { parseMatch: function(e3, t3) {
        const n2 = this.world();
        let r2 = n2.methods.one.killUnicode;
        return r2 && (e3 = r2(e3, n2)), n2.methods.one.parseMatch(e3, t3, n2);
      } } };
      const Lt = /^\../, Jt = /^#./, Wt = function(e3, t3) {
        let n2 = {}, r2 = {};
        return Object.keys(t3).forEach((a2) => {
          let o2 = t3[a2], i2 = function(e4) {
            let t4 = "", n3 = "</span>";
            return e4 = e4.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;"), Lt.test(e4) ? t4 = `<span class="${e4.replace(/^\./, "")}"` : Jt.test(e4) ? t4 = `<span id="${e4.replace(/^#/, "")}"` : (t4 = `<${e4}`, n3 = `</${e4}>`), t4 += ">", { start: t4, end: n3 };
          }(a2);
          "string" == typeof o2 && (o2 = e3.match(o2)), o2.docs.forEach((e4) => {
            if (e4.every((e5) => e5.implicit)) return;
            let t4 = e4[0].id;
            n2[t4] = n2[t4] || [], n2[t4].push(i2.start);
            let a3 = e4[e4.length - 1].id;
            r2[a3] = r2[a3] || [], r2[a3].push(i2.end);
          });
        }), { starts: n2, ends: r2 };
      };
      var qt = { html: function(e3) {
        let { starts: t3, ends: n2 } = Wt(this, e3), r2 = "";
        return this.docs.forEach((e4) => {
          for (let a2 = 0; a2 < e4.length; a2 += 1) {
            let o2 = e4[a2];
            t3.hasOwnProperty(o2.id) && (r2 += t3[o2.id].join("")), r2 += o2.pre || "", r2 += o2.text || "", n2.hasOwnProperty(o2.id) && (r2 += n2[o2.id].join("")), r2 += o2.post || "";
          }
        }), r2;
      } };
      const Ut = /[,:;)\]*.?~!\u0022\uFF02\u201D\u2019\u00BB\u203A\u2032\u2033\u2034\u301E\u00B4—-]+$/, Rt = /^[(['"*~\uFF02\u201C\u2018\u201F\u201B\u201E\u2E42\u201A\u00AB\u2039\u2035\u2036\u2037\u301D\u0060\u301F]+/, Qt = /[,:;)('"\u201D\]]/, Zt = /^[-–—]$/, _t = / /, Xt = function(e3, t3, n2 = true) {
        let r2 = "";
        return e3.forEach((e4) => {
          let n3 = e4.pre || "", a2 = e4.post || "";
          "some" === t3.punctuation && (n3 = n3.replace(Rt, ""), Zt.test(a2) && (a2 = " "), a2 = a2.replace(Qt, ""), a2 = a2.replace(/\?!+/, "?"), a2 = a2.replace(/!+/, "!"), a2 = a2.replace(/\?+/, "?"), a2 = a2.replace(/\.{2,}/, ""), e4.tags.has("Abbreviation") && (a2 = a2.replace(/\./, ""))), "some" === t3.whitespace && (n3 = n3.replace(/\s/, ""), a2 = a2.replace(/\s+/, " ")), t3.keepPunct || (n3 = n3.replace(Rt, ""), a2 = "-" === a2 ? " " : a2.replace(Ut, ""));
          let o2 = e4[t3.form || "text"] || e4.normal || "";
          "implicit" === t3.form && (o2 = e4.implicit || e4.text), "root" === t3.form && e4.implicit && (o2 = e4.root || e4.implicit || e4.normal), "machine" !== t3.form && "implicit" !== t3.form && "root" !== t3.form || !e4.implicit || a2 && _t.test(a2) || (a2 += " "), r2 += n3 + o2 + a2;
        }), false === n2 && (r2 = r2.trim()), true === t3.lowerCase && (r2 = r2.toLowerCase()), r2;
      }, Yt = { text: { form: "text" }, normal: { whitespace: "some", punctuation: "some", case: "some", unicode: "some", form: "normal" }, machine: { keepSpace: false, whitespace: "some", punctuation: "some", case: "none", unicode: "some", form: "machine" }, root: { keepSpace: false, whitespace: "some", punctuation: "some", case: "some", unicode: "some", form: "root" }, implicit: { form: "implicit" } };
      Yt.clean = Yt.normal, Yt.reduced = Yt.root;
      let en = [], tn = 0;
      for (; tn < 64; ) en[tn] = 0 | 4294967296 * Math.sin(++tn % Math.PI);
      const nn = function(e3) {
        let t3, n2, r2, a2 = [t3 = 1732584193, n2 = 4023233417, ~t3, ~n2], o2 = [], i2 = decodeURI(encodeURI(e3)) + "\x80", s2 = i2.length;
        for (e3 = --s2 / 4 + 2 | 15, o2[--e3] = 8 * s2; ~s2; ) o2[s2 >> 2] |= i2.charCodeAt(s2) << 8 * s2--;
        for (tn = i2 = 0; tn < e3; tn += 16) {
          for (s2 = a2; i2 < 64; s2 = [r2 = s2[3], t3 + ((r2 = s2[0] + [t3 & n2 | ~t3 & r2, r2 & t3 | ~r2 & n2, t3 ^ n2 ^ r2, n2 ^ (t3 | ~r2)][s2 = i2 >> 4] + en[i2] + ~~o2[tn | 15 & [i2, 5 * i2 + 1, 3 * i2 + 5, 7 * i2][s2]]) << (s2 = [7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10, 15, 21][4 * s2 + i2++ % 4]) | r2 >>> -s2), t3, n2]) t3 = 0 | s2[1], n2 = s2[2];
          for (i2 = 4; i2; ) a2[--i2] += s2[i2];
        }
        for (e3 = ""; i2 < 32; ) e3 += (a2[i2 >> 3] >> 4 * (1 ^ i2++) & 15).toString(16);
        return e3;
      }, rn = { text: true, terms: true };
      let an = { case: "none", unicode: "some", form: "machine", punctuation: "some" };
      const on = function(e3, t3) {
        return Object.assign({}, e3, t3);
      }, sn = { text: (e3) => Xt(e3, { keepPunct: true }, false), normal: (e3) => Xt(e3, on(Yt.normal, { keepPunct: true }), false), implicit: (e3) => Xt(e3, on(Yt.implicit, { keepPunct: true }), false), machine: (e3) => Xt(e3, an, false), root: (e3) => Xt(e3, on(an, { form: "root" }), false), hash: (e3) => nn(Xt(e3, { keepPunct: true }, false)), offset: (e3) => {
        let t3 = sn.text(e3).length;
        return { index: e3[0].offset.index, start: e3[0].offset.start, length: t3 };
      }, terms: (e3) => e3.map((e4) => {
        let t3 = Object.assign({}, e4);
        return t3.tags = Array.from(e4.tags), t3;
      }), confidence: (e3, t3, n2) => t3.eq(n2).confidence(), syllables: (e3, t3, n2) => t3.eq(n2).syllables(), sentence: (e3, t3, n2) => t3.eq(n2).fullSentence().text(), dirty: (e3) => e3.some((e4) => true === e4.dirty) };
      sn.sentences = sn.sentence, sn.clean = sn.normal, sn.reduced = sn.root;
      const ln = { json: function(e3) {
        let t3 = (n2 = this, "string" == typeof (r2 = (r2 = e3) || {}) && (r2 = {}), (r2 = Object.assign({}, rn, r2)).offset && n2.compute("offset"), n2.docs.map((e4, t4) => {
          let a2 = {};
          return Object.keys(r2).forEach((o2) => {
            r2[o2] && sn[o2] && (a2[o2] = sn[o2](e4, n2, t4));
          }), a2;
        }));
        var n2, r2;
        return "number" == typeof e3 ? t3[e3] : t3;
      } };
      ln.data = ln.json;
      const un = function(e3) {
        let t3 = e3.pre || "", n2 = e3.post || "";
        return t3 + e3.text + n2;
      }, cn = function(e3, t3) {
        let n2 = function(e4, t4) {
          let n3 = {};
          return Object.keys(t4).forEach((r3) => {
            e4.match(r3).fullPointer.forEach((e5) => {
              n3[e5[3]] = { fn: t4[r3], end: e5[2] };
            });
          }), n3;
        }(e3, t3), r2 = "";
        return e3.docs.forEach((t4, a2) => {
          for (let o2 = 0; o2 < t4.length; o2 += 1) {
            let i2 = t4[o2];
            if (n2.hasOwnProperty(i2.id)) {
              let { fn: s2, end: l2 } = n2[i2.id], u2 = e3.update([[a2, o2, l2]]);
              r2 += t4[o2].pre || "", r2 += s2(u2), o2 = l2 - 1, r2 += t4[o2].post || "";
            } else r2 += un(i2);
          }
        }), r2;
      }, hn = { debug: function(e3) {
        let t3 = this.methods.one.debug || {};
        return e3 && t3.hasOwnProperty(e3) ? (t3[e3](this), this) : "undefined" != typeof window && window.document ? (t3.clientSide(this), this) : (t3.tags(this), this);
      }, out: function(e3) {
        if (t3 = e3, "[object Object]" === Object.prototype.toString.call(t3)) return cn(this, e3);
        var t3;
        if ("text" === e3) return this.text();
        if ("normal" === e3) return this.text("normal");
        if ("root" === e3) return this.text("root");
        if ("machine" === e3 || "reduced" === e3) return this.text("machine");
        if ("hash" === e3 || "md5" === e3) return nn(this.text());
        if ("json" === e3) return this.json();
        if ("offset" === e3 || "offsets" === e3) return this.compute("offset"), this.json({ offset: true });
        if ("array" === e3) {
          let e4 = this.docs.map((e5) => e5.reduce((e6, t4) => e6 + t4.pre + t4.text + t4.post, "").trim());
          return e4.filter((e5) => e5);
        }
        if ("freq" === e3 || "frequency" === e3 || "topk" === e3) return function(e4) {
          let t4 = {};
          e4.forEach((e5) => {
            t4[e5] = t4[e5] || 0, t4[e5] += 1;
          });
          let n2 = Object.keys(t4).map((e5) => ({ normal: e5, count: t4[e5] }));
          return n2.sort((e5, t5) => e5.count > t5.count ? -1 : 0);
        }(this.json({ normal: true }).map((e4) => e4.normal));
        if ("terms" === e3) {
          let e4 = [];
          return this.docs.forEach((t4) => {
            let n2 = t4.map((e5) => e5.text);
            n2 = n2.filter((e5) => e5), e4 = e4.concat(n2);
          }), e4;
        }
        return "tags" === e3 ? this.docs.map((e4) => e4.reduce((e5, t4) => (e5[t4.implicit || t4.normal] = Array.from(t4.tags), e5), {})) : "debug" === e3 ? this.debug() : this.text();
      }, wrap: function(e3) {
        return cn(this, e3);
      } };
      var dn = { text: function(e3) {
        let t3 = {};
        var n2;
        if (e3 && "string" == typeof e3 && Yt.hasOwnProperty(e3) ? t3 = Object.assign({}, Yt[e3]) : e3 && (n2 = e3, "[object Object]" === Object.prototype.toString.call(n2)) && (t3 = Object.assign({}, e3)), void 0 !== t3.keepSpace || this.isFull() || (t3.keepSpace = false), void 0 === t3.keepEndPunct && this.pointer) {
          let e4 = this.pointer[0];
          e4 && e4[1] ? t3.keepEndPunct = false : t3.keepEndPunct = true;
        }
        return void 0 === t3.keepPunct && (t3.keepPunct = true), void 0 === t3.keepSpace && (t3.keepSpace = true), function(e4, t4) {
          let n3 = "";
          if (!e4 || !e4[0] || !e4[0][0]) return n3;
          for (let r2 = 0; r2 < e4.length; r2 += 1) n3 += Xt(e4[r2], t4, true);
          if (t4.keepSpace || (n3 = n3.trim()), false === t4.keepEndPunct) {
            e4[0][0].tags.has("Emoticon") || (n3 = n3.replace(Rt, ""));
            let t5 = e4[e4.length - 1];
            t5[t5.length - 1].tags.has("Emoticon") || (n3 = n3.replace(Ut, "")), n3.endsWith("'") && !n3.endsWith("s'") && (n3 = n3.replace(/'/, ""));
          }
          return true === t4.cleanWhitespace && (n3 = n3.trim()), n3;
        }(this.docs, t3);
      } };
      const gn = Object.assign({}, hn, dn, ln, qt), mn = "\x1B[0m", pn = { green: (e3) => "\x1B[32m" + e3 + mn, red: (e3) => "\x1B[31m" + e3 + mn, blue: (e3) => "\x1B[34m" + e3 + mn, magenta: (e3) => "\x1B[35m" + e3 + mn, cyan: (e3) => "\x1B[36m" + e3 + mn, yellow: (e3) => "\x1B[33m" + e3 + mn, black: (e3) => "\x1B[30m" + e3 + mn, dim: (e3) => "\x1B[2m" + e3 + mn, i: (e3) => "\x1B[3m" + e3 + mn }, fn = { tags: function(e3) {
        let { docs: t3, model: n2 } = e3;
        0 === t3.length && console.log(pn.blue("\n     \u2500\u2500\u2500\u2500\u2500\u2500")), t3.forEach((t4) => {
          console.log(pn.blue("\n  \u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500")), t4.forEach((t5) => {
            let r2 = [...t5.tags || []], a2 = t5.text || "-";
            t5.sense && (a2 = `{${t5.normal}/${t5.sense}}`), t5.implicit && (a2 = "[" + t5.implicit + "]"), a2 = pn.yellow(a2);
            let o2 = "'" + a2 + "'";
            if (t5.reference) {
              let n3 = e3.update([t5.reference]).text("normal");
              o2 += ` - ${pn.dim(pn.i("[" + n3 + "]"))}`;
            }
            o2 = o2.padEnd(18);
            let i2 = pn.blue("  \u2502 ") + pn.i(o2) + "  - " + function(e4, t6) {
              return t6.one.tagSet && (e4 = e4.map((e5) => {
                if (!t6.one.tagSet.hasOwnProperty(e5)) return e5;
                const n3 = t6.one.tagSet[e5].color || "blue";
                return pn[n3](e5);
              })), e4.join(", ");
            }(r2, n2);
            console.log(i2);
          });
        }), console.log("\n");
      }, clientSide: function(e3) {
        console.log("%c -=-=- ", "background-color:#6699cc;"), e3.forEach((e4) => {
          console.groupCollapsed(e4.text());
          let t3 = e4.docs[0].map((e5) => {
            let t4 = e5.text || "-";
            return e5.implicit && (t4 = "[" + e5.implicit + "]"), { text: t4, tags: "[" + Array.from(e5.tags).join(", ") + "]" };
          });
          console.table(t3, ["text", "tags"]), console.groupEnd();
        });
      }, chunks: function(e3) {
        let { docs: t3 } = e3;
        console.log(""), t3.forEach((e4) => {
          let t4 = [];
          e4.forEach((e5) => {
            "Noun" === e5.chunk ? t4.push(pn.blue(e5.implicit || e5.normal)) : "Verb" === e5.chunk ? t4.push(pn.green(e5.implicit || e5.normal)) : "Adjective" === e5.chunk ? t4.push(pn.yellow(e5.implicit || e5.normal)) : "Pivot" === e5.chunk ? t4.push(pn.red(e5.implicit || e5.normal)) : t4.push(e5.implicit || e5.normal);
          }), console.log(t4.join(" "), "\n");
        }), console.log("\n");
      }, highlight: function(e3) {
        if (!e3.found) return;
        let t3 = {};
        e3.fullPointer.forEach((e4) => {
          t3[e4[0]] = t3[e4[0]] || [], t3[e4[0]].push(e4);
        }), Object.keys(t3).forEach((n2) => {
          let r2 = e3.update([[Number(n2)]]).text();
          e3.update(t3[n2]).json({ offset: true }).forEach((e4, t4) => {
            r2 = function(e5, t5, n3) {
              let r3 = ((e6, t6, n4) => {
                let r4 = 9 * n4, a2 = t6.start + r4, o2 = a2 + t6.length;
                return [e6.substring(0, a2), e6.substring(a2, o2), e6.substring(o2, e6.length)];
              })(e5, t5, n3);
              return `${r3[0]}${pn.blue(r3[1])}${r3[2]}`;
            }(r2, e4.offset, t4);
          }), console.log(r2);
        }), console.log("\n");
      } };
      var bn = { api: function(e3) {
        Object.assign(e3.prototype, gn);
      }, methods: { one: { hash: nn, debug: fn } } };
      const vn = function(e3, t3) {
        if (e3[0] !== t3[0]) return false;
        let [, n2, r2] = e3, [, a2, o2] = t3;
        return n2 <= a2 && r2 > a2 || a2 <= n2 && o2 > n2;
      }, yn = function(e3) {
        let t3 = {};
        return e3.forEach((e4) => {
          t3[e4[0]] = t3[e4[0]] || [], t3[e4[0]].push(e4);
        }), t3;
      }, wn = function(e3, t3) {
        let n2 = yn(t3), r2 = [];
        return e3.forEach((e4) => {
          let [t4] = e4, a2 = n2[t4] || [];
          if (a2 = a2.filter((t5) => function(e5, t6) {
            return e5[1] <= t6[1] && t6[2] <= e5[2];
          }(e4, t5)), 0 === a2.length) return void r2.push({ passthrough: e4 });
          a2 = a2.sort((e5, t5) => e5[1] - t5[1]);
          let o2 = e4;
          a2.forEach((e5, t5) => {
            let n3 = function(e6, t6) {
              let [n4, r3] = e6, a3 = t6[1], o3 = t6[2], i2 = {};
              if (r3 < a3) {
                let t7 = a3 < e6[2] ? a3 : e6[2];
                i2.before = [n4, r3, t7];
              }
              return i2.match = t6, e6[2] > o3 && (i2.after = [n4, o3, e6[2]]), i2;
            }(o2, e5);
            a2[t5 + 1] ? (r2.push({ before: n3.before, match: n3.match }), n3.after && (o2 = n3.after)) : r2.push(n3);
          });
        }), r2;
      };
      var kn = { one: { termList: function(e3) {
        let t3 = [];
        for (let n2 = 0; n2 < e3.length; n2 += 1) for (let r2 = 0; r2 < e3[n2].length; r2 += 1) t3.push(e3[n2][r2]);
        return t3;
      }, getDoc: function(e3, t3) {
        let n2 = [];
        return e3.forEach((r2, a2) => {
          if (!r2) return;
          let [o2, i2, s2, l2, u2] = r2, c2 = t3[o2] || [];
          if (void 0 === i2 && (i2 = 0), void 0 === s2 && (s2 = c2.length), !l2 || c2[i2] && c2[i2].id === l2) c2 = c2.slice(i2, s2);
          else {
            let n3 = function(e4, t4, n4) {
              for (let r3 = 0; r3 < 20; r3 += 1) {
                if (t4[n4 - r3]) {
                  let a3 = t4[n4 - r3].findIndex((t5) => t5.id === e4);
                  if (-1 !== a3) return [n4 - r3, a3];
                }
                if (t4[n4 + r3]) {
                  let a3 = t4[n4 + r3].findIndex((t5) => t5.id === e4);
                  if (-1 !== a3) return [n4 + r3, a3];
                }
              }
              return null;
            }(l2, t3, o2);
            if (null !== n3) {
              let r3 = s2 - i2;
              c2 = t3[n3[0]].slice(n3[1], n3[1] + r3);
              let o3 = c2[0] ? c2[0].id : null;
              e3[a2] = [n3[0], n3[1], n3[1] + r3, o3];
            }
          }
          0 !== c2.length && i2 !== s2 && (u2 && c2[c2.length - 1].id !== u2 && (c2 = function(e4, t4) {
            let [n3, r3, , , a3] = e4, o3 = t4[n3], i3 = o3.findIndex((e5) => e5.id === a3);
            return -1 === i3 ? (e4[2] = t4[n3].length, e4[4] = o3.length ? o3[o3.length - 1].id : null) : e4[2] = i3, t4[n3].slice(r3, e4[2] + 1);
          }(r2, t3)), n2.push(c2));
        }), n2 = n2.filter((e4) => e4.length > 0), n2;
      }, pointer: { indexN: yn, splitAll: wn } } };
      const Pn = function(e3, t3) {
        let n2 = e3.concat(t3), r2 = yn(n2), a2 = [];
        return n2.forEach((e4) => {
          let [t4] = e4;
          if (1 === r2[t4].length) return void a2.push(e4);
          let n3 = r2[t4].filter((t5) => vn(e4, t5));
          n3.push(e4);
          let o2 = function(e5) {
            let t5 = e5[0][1], n4 = e5[0][2];
            return e5.forEach((e6) => {
              e6[1] < t5 && (t5 = e6[1]), e6[2] > n4 && (n4 = e6[2]);
            }), [e5[0][0], t5, n4];
          }(n3);
          a2.push(o2);
        }), a2 = function(e4) {
          let t4 = {};
          for (let n3 = 0; n3 < e4.length; n3 += 1) t4[e4[n3].join(",")] = e4[n3];
          return Object.values(t4);
        }(a2), a2;
      }, An = function(e3, t3) {
        let n2 = [];
        return wn(e3, t3).forEach((e4) => {
          e4.passthrough && n2.push(e4.passthrough), e4.before && n2.push(e4.before), e4.after && n2.push(e4.after);
        }), n2;
      }, Cn = (e3, t3) => {
        return "string" == typeof e3 || (n2 = e3, "[object Array]" === Object.prototype.toString.call(n2)) ? t3.match(e3) : e3 || t3.none();
        var n2;
      }, Nn = function(e3, t3) {
        return e3.map((e4) => {
          let [n2, r2] = e4;
          return t3[n2] && t3[n2][r2] && (e4[3] = t3[n2][r2].id), e4;
        });
      }, jn = { union: function(e3) {
        e3 = Cn(e3, this);
        let t3 = Pn(this.fullPointer, e3.fullPointer);
        return t3 = Nn(t3, this.document), this.toView(t3);
      } };
      jn.and = jn.union, jn.intersection = function(e3) {
        e3 = Cn(e3, this);
        let t3 = function(e4, t4) {
          let n2 = yn(t4), r2 = [];
          return e4.forEach((e5) => {
            let t5 = n2[e5[0]] || [];
            t5 = t5.filter((t6) => vn(e5, t6)), 0 !== t5.length && t5.forEach((t6) => {
              let n3 = function(e6, t7) {
                let n4 = e6[1] < t7[1] ? t7[1] : e6[1], r3 = e6[2] > t7[2] ? t7[2] : e6[2];
                return n4 < r3 ? [e6[0], n4, r3] : null;
              }(e5, t6);
              n3 && r2.push(n3);
            });
          }), r2;
        }(this.fullPointer, e3.fullPointer);
        return t3 = Nn(t3, this.document), this.toView(t3);
      }, jn.not = function(e3) {
        e3 = Cn(e3, this);
        let t3 = An(this.fullPointer, e3.fullPointer);
        return t3 = Nn(t3, this.document), this.toView(t3);
      }, jn.difference = jn.not, jn.complement = function() {
        let e3 = this.all(), t3 = An(e3.fullPointer, this.fullPointer);
        return t3 = Nn(t3, this.document), this.toView(t3);
      }, jn.settle = function() {
        let e3 = this.fullPointer;
        return e3.forEach((t3) => {
          e3 = Pn(e3, [t3]);
        }), e3 = Nn(e3, this.document), this.update(e3);
      };
      var xn = { methods: kn, api: function(e3) {
        Object.assign(e3.prototype, jn);
      } };
      const In = function(e3) {
        return true === e3.optional || true === e3.negative ? null : e3.tag ? "#" + e3.tag : e3.word ? e3.word : e3.switch ? `%${e3.switch}%` : null;
      }, Tn = function(e3, t3) {
        const n2 = t3.methods.one.parseMatch;
        return e3.forEach((e4) => {
          e4.regs = n2(e4.match, {}, t3), "string" == typeof e4.ifNo && (e4.ifNo = [e4.ifNo]), e4.notIf && (e4.notIf = n2(e4.notIf, {}, t3)), e4.needs = function(e5) {
            let t4 = [];
            return e5.forEach((e6) => {
              t4.push(In(e6)), "and" === e6.operator && e6.choices && e6.choices.forEach((e7) => {
                e7.forEach((e8) => {
                  t4.push(In(e8));
                });
              });
            }), t4.filter((e6) => e6);
          }(e4.regs);
          let { wants: r2, count: a2 } = function(e5) {
            let t4 = [], n3 = 0;
            return e5.forEach((e6) => {
              "or" !== e6.operator || e6.optional || e6.negative || (e6.fastOr && Array.from(e6.fastOr).forEach((e7) => {
                t4.push(e7);
              }), e6.choices && e6.choices.forEach((e7) => {
                e7.forEach((e8) => {
                  let n4 = In(e8);
                  n4 && t4.push(n4);
                });
              }), n3 += 1);
            }), { wants: t4, count: n3 };
          }(e4.regs);
          e4.wants = r2, e4.minWant = a2, e4.minWords = e4.regs.filter((e5) => !e5.optional).length;
        }), e3;
      };
      var Dn = { buildNet: function(e3, t3) {
        e3 = Tn(e3, t3);
        let n2 = {};
        e3.forEach((e4) => {
          e4.needs.forEach((t4) => {
            n2[t4] = Array.isArray(n2[t4]) ? n2[t4] : [], n2[t4].push(e4);
          }), e4.wants.forEach((t4) => {
            n2[t4] = Array.isArray(n2[t4]) ? n2[t4] : [], n2[t4].push(e4);
          });
        }), Object.keys(n2).forEach((e4) => {
          let t4 = {};
          n2[e4] = n2[e4].filter((e5) => "boolean" != typeof t4[e5.match] && (t4[e5.match] = true, true));
        });
        let r2 = e3.filter((e4) => 0 === e4.needs.length && 0 === e4.wants.length);
        return { hooks: n2, always: r2 };
      }, bulkMatch: function(e3, t3, n2, r2 = {}) {
        let a2 = n2.one.cacheDoc(e3), o2 = function(e4, t4) {
          return e4.map((n3, r3) => {
            let a3 = [];
            Object.keys(t4).forEach((n4) => {
              e4[r3].has(n4) && (a3 = a3.concat(t4[n4]));
            });
            let o3 = {};
            return a3 = a3.filter((e5) => "boolean" != typeof o3[e5.match] && (o3[e5.match] = true, true)), a3;
          });
        }(a2, t3.hooks);
        o2 = function(e4, t4) {
          return e4.map((e5, n3) => {
            let r3 = t4[n3];
            return (e5 = (e5 = e5.filter((e6) => e6.needs.every((e7) => r3.has(e7)))).filter((e6) => void 0 === e6.ifNo || true !== e6.ifNo.some((e7) => r3.has(e7)))).filter((e6) => 0 === e6.wants.length || e6.wants.filter((e7) => r3.has(e7)).length >= e6.minWant);
          });
        }(o2, a2), t3.always.length > 0 && (o2 = o2.map((e4) => e4.concat(t3.always))), o2 = function(e4, t4) {
          return e4.map((e5, n3) => {
            let r3 = t4[n3].length;
            return e5 = e5.filter((e6) => r3 >= e6.minWords), e5;
          });
        }(o2, e3);
        let i2 = function(e4, t4, n3, r3, a3) {
          let o3 = [];
          for (let n4 = 0; n4 < e4.length; n4 += 1) for (let i3 = 0; i3 < e4[n4].length; i3 += 1) {
            let s2 = e4[n4][i3], l2 = r3.one.match([t4[n4]], s2);
            if (l2.ptrs.length > 0 && (l2.ptrs.forEach((e5) => {
              e5[0] = n4;
              let t5 = Object.assign({}, s2, { pointer: e5 });
              void 0 !== s2.unTag && (t5.unTag = s2.unTag), o3.push(t5);
            }), true === a3.matchOne)) return [o3[0]];
          }
          return o3;
        }(o2, e3, 0, n2, r2);
        return i2;
      }, bulkTagger: function(e3, t3, n2) {
        const { model: r2, methods: a2 } = n2, { getDoc: o2, setTag: i2, unTag: s2 } = a2.one, l2 = a2.two.looksPlural;
        return 0 === e3.length ? e3 : (("undefined" != typeof process && process.env ? process.env : self.env || {}).DEBUG_TAGS && console.log(`

  \x1B[32m\u2192 ${e3.length} post-tagger:\x1B[0m`), e3.map((e4) => {
          if (!e4.tag && !e4.chunk && !e4.unTag) return;
          let a3 = e4.reason || e4.match, u2 = o2([e4.pointer], t3)[0];
          if (true === e4.safe) {
            if (false === function(e5, t4, n3) {
              let r3 = n3.one.tagSet;
              if (!r3.hasOwnProperty(t4)) return true;
              let a4 = r3[t4].not || [];
              for (let t5 = 0; t5 < e5.length; t5 += 1) {
                let n4 = e5[t5];
                for (let e6 = 0; e6 < a4.length; e6 += 1) if (true === n4.tags.has(a4[e6])) return false;
              }
              return true;
            }(u2, e4.tag, r2)) return;
            if ("-" === u2[u2.length - 1].post) return;
          }
          if (void 0 !== e4.tag) {
            if (i2(u2, e4.tag, n2, e4.safe, `[post] '${a3}'`), "Noun" === e4.tag && l2) {
              let t4 = u2[u2.length - 1];
              l2(t4.text) ? i2([t4], "Plural", n2, e4.safe, "quick-plural") : i2([t4], "Singular", n2, e4.safe, "quick-singular");
            }
            true === e4.freeze && u2.forEach((e5) => e5.frozen = true);
          }
          void 0 !== e4.unTag && s2(u2, e4.unTag, n2, e4.safe, a3), e4.chunk && u2.forEach((t4) => t4.chunk = e4.chunk);
        }));
      } }, Hn = { lib: { buildNet: function(e3) {
        let t3 = this.methods().one.buildNet(e3, this.world());
        return t3.isNet = true, t3;
      } }, api: function(e3) {
        e3.prototype.sweep = function(e4, t3 = {}) {
          const { world: n2, docs: r2 } = this, { methods: a2 } = n2;
          let o2 = a2.one.bulkMatch(r2, e4, this.methods, t3);
          false !== t3.tagger && a2.one.bulkTagger(o2, r2, this.world), o2 = o2.map((e5) => {
            let t4 = e5.pointer, n3 = r2[t4[0]][t4[1]], a3 = t4[2] - t4[1];
            return n3.index && (e5.pointer = [n3.index[0], n3.index[1], t4[1] + a3]), e5;
          });
          let i2 = o2.map((e5) => e5.pointer);
          return o2 = o2.map((e5) => (e5.view = this.update([e5.pointer]), delete e5.regs, delete e5.needs, delete e5.pointer, delete e5._expanded, e5)), { view: this.update(i2), found: o2 };
        };
      }, methods: { one: Dn } };
      const En = / /, Gn = function(e3, t3) {
        "Noun" === t3 && (e3.chunk = t3), "Verb" === t3 && (e3.chunk = t3);
      }, On = function(e3, t3, n2, r2) {
        if (true === e3.tags.has(t3)) return null;
        if ("." === t3) return null;
        true === e3.frozen && (r2 = true);
        let a2 = n2[t3];
        if (a2) {
          if (a2.not && a2.not.length > 0) for (let t4 = 0; t4 < a2.not.length; t4 += 1) {
            if (true === r2 && e3.tags.has(a2.not[t4])) return null;
            e3.tags.delete(a2.not[t4]);
          }
          if (a2.parents && a2.parents.length > 0) for (let t4 = 0; t4 < a2.parents.length; t4 += 1) e3.tags.add(a2.parents[t4]), Gn(e3, a2.parents[t4]);
        }
        return e3.tags.add(t3), e3.dirty = true, Gn(e3, t3), true;
      }, Fn = function(e3, t3, n2 = {}, r2, a2) {
        const o2 = n2.model.one.tagSet || {};
        if (!t3) return;
        const i2 = "undefined" != typeof process && process.env ? process.env : self.env || {};
        var s2;
        if (i2 && i2.DEBUG_TAGS && ((e4, t4, n3 = "") => {
          let r3 = e4.map((e5) => e5.text || "[" + e5.implicit + "]").join(" ");
          var a3;
          "string" != typeof t4 && t4.length > 2 && (t4 = t4.slice(0, 2).join(", #") + " +"), t4 = "string" != typeof t4 ? t4.join(", #") : t4, console.log(` ${(a3 = r3, "\x1B[33m\x1B[3m" + a3 + "\x1B[0m").padEnd(24)} \x1B[32m\u2192\x1B[0m #${t4.padEnd(22)}  ${((e5) => "\x1B[3m" + e5 + "\x1B[0m")(n3)}`);
        })(e3, t3, a2), 1 != (s2 = t3, "[object Array]" === Object.prototype.toString.call(s2))) if ("string" == typeof t3) if (t3 = t3.trim(), En.test(t3)) !function(e4, t4, n3, r3) {
          let a3 = t4.split(En);
          e4.forEach((e5, t5) => {
            let o3 = a3[t5];
            o3 && (o3 = o3.replace(/^#/, ""), On(e5, o3, n3, r3));
          });
        }(e3, t3, o2, r2);
        else {
          t3 = t3.replace(/^#/, "");
          for (let n3 = 0; n3 < e3.length; n3 += 1) On(e3[n3], t3, o2, r2);
        }
        else console.warn(`compromise: Invalid tag '${t3}'`);
        else t3.forEach((t4) => Fn(e3, t4, n2, r2));
      }, Vn = function(e3) {
        return e3.children = e3.children || [], e3._cache = e3._cache || {}, e3.props = e3.props || {}, e3._cache.parents = e3._cache.parents || [], e3._cache.children = e3._cache.children || [], e3;
      }, zn = /^ *(#|\/\/)/, Bn = function(e3) {
        let t3 = e3.trim().split(/->/), n2 = [];
        t3.forEach((e4) => {
          n2 = n2.concat(function(e5) {
            if (!(e5 = e5.trim())) return null;
            if (/^\[/.test(e5) && /\]$/.test(e5)) {
              let t4 = (e5 = (e5 = e5.replace(/^\[/, "")).replace(/\]$/, "")).split(/,/);
              return t4 = t4.map((e6) => e6.trim()).filter((e6) => e6), t4 = t4.map((e6) => Vn({ id: e6 })), t4;
            }
            return [Vn({ id: e5 })];
          }(e4));
        }), n2 = n2.filter((e4) => e4);
        let r2 = n2[0];
        for (let e4 = 1; e4 < n2.length; e4 += 1) r2.children.push(n2[e4]), r2 = n2[e4];
        return n2[0];
      }, Sn = (e3, t3) => {
        let n2 = [], r2 = [e3];
        for (; r2.length > 0; ) {
          let e4 = r2.pop();
          n2.push(e4), e4.children && e4.children.forEach((n3) => {
            t3 && t3(e4, n3), r2.push(n3);
          });
        }
        return n2;
      }, $n = (e3) => "[object Array]" === Object.prototype.toString.call(e3), Mn = (e3) => (e3 = e3 || "").trim(), Kn = function(e3 = []) {
        return "string" == typeof e3 ? function(e4) {
          let t4 = e4.split(/\r?\n/), n2 = [];
          t4.forEach((e5) => {
            if (!e5.trim() || zn.test(e5)) return;
            let t5 = ((e6) => {
              const t6 = /^( {2}|\t)/;
              let n3 = 0;
              for (; t6.test(e6); ) e6 = e6.replace(t6, ""), n3 += 1;
              return n3;
            })(e5);
            n2.push({ indent: t5, node: Bn(e5) });
          });
          let r2 = function(e5) {
            let t5 = { children: [] };
            return e5.forEach((n3, r3) => {
              0 === n3.indent ? t5.children = t5.children.concat(n3.node) : e5[r3 - 1] && function(e6, t6) {
                let n4 = e6[t6].indent;
                for (; t6 >= 0; t6 -= 1) if (e6[t6].indent < n4) return e6[t6];
                return e6[0];
              }(e5, r3).node.children.push(n3.node);
            }), t5;
          }(n2);
          return r2 = Vn(r2), r2;
        }(e3) : $n(e3) ? function(e4) {
          let t4 = {};
          e4.forEach((e5) => {
            t4[e5.id] = e5;
          });
          let n2 = Vn({});
          return e4.forEach((e5) => {
            if ((e5 = Vn(e5)).parent) if (t4.hasOwnProperty(e5.parent)) {
              let n3 = t4[e5.parent];
              delete e5.parent, n3.children.push(e5);
            } else console.warn(`[Grad] - missing node '${e5.parent}'`);
            else n2.children.push(e5);
          }), n2;
        }(e3) : (Sn(t3 = e3).forEach(Vn), t3);
        var t3;
      }, Ln = function(e3, t3) {
        let n2 = "-> ";
        t3 && (n2 = ((e4) => "\x1B[2m" + e4 + "\x1B[0m")("\u2192 "));
        let r2 = "";
        return Sn(e3).forEach((e4, a2) => {
          let o2 = e4.id || "";
          if (t3 && (o2 = ((e5) => "\x1B[31m" + e5 + "\x1B[0m")(o2)), 0 === a2 && !e4.id) return;
          let i2 = e4._cache.parents.length;
          r2 += "    ".repeat(i2) + n2 + o2 + "\n";
        }), r2;
      }, Jn = function(e3) {
        let t3 = Sn(e3);
        t3.forEach((e4) => {
          delete (e4 = Object.assign({}, e4)).children;
        });
        let n2 = t3[0];
        return n2 && !n2.id && 0 === Object.keys(n2.props).length && t3.shift(), t3;
      }, Wn = { text: Ln, txt: Ln, array: Jn, flat: Jn }, qn = function(e3, t3) {
        return "nested" === t3 || "json" === t3 ? e3 : "debug" === t3 ? (console.log(Ln(e3, true)), null) : Wn.hasOwnProperty(t3) ? Wn[t3](e3) : e3;
      }, Un = (e3) => {
        Sn(e3, (e4, t3) => {
          e4.id && (e4._cache.parents = e4._cache.parents || [], t3._cache.parents = e4._cache.parents.concat([e4.id]));
        });
      }, Rn = /\//;
      let Qn = class g {
        constructor(e3 = {}) {
          Object.defineProperty(this, "json", { enumerable: false, value: e3, writable: true });
        }
        get children() {
          return this.json.children;
        }
        get id() {
          return this.json.id;
        }
        get found() {
          return this.json.id || this.json.children.length > 0;
        }
        props(e3 = {}) {
          let t3 = this.json.props || {};
          return "string" == typeof e3 && (t3[e3] = true), this.json.props = Object.assign(t3, e3), this;
        }
        get(e3) {
          if (e3 = Mn(e3), !Rn.test(e3)) {
            let t4 = this.json.children.find((t5) => t5.id === e3);
            return new g(t4);
          }
          let t3 = ((e4, t4) => {
            let n2 = ((e5) => "string" != typeof e5 ? e5 : (e5 = e5.replace(/^\//, "")).split(/\//))(t4 = t4 || "");
            for (let t5 = 0; t5 < n2.length; t5 += 1) {
              let r2 = e4.children.find((e5) => e5.id === n2[t5]);
              if (!r2) return null;
              e4 = r2;
            }
            return e4;
          })(this.json, e3) || Vn({});
          return new g(t3);
        }
        add(e3, t3 = {}) {
          if ($n(e3)) return e3.forEach((e4) => this.add(Mn(e4), t3)), this;
          e3 = Mn(e3);
          let n2 = Vn({ id: e3, props: t3 });
          return this.json.children.push(n2), new g(n2);
        }
        remove(e3) {
          return e3 = Mn(e3), this.json.children = this.json.children.filter((t3) => t3.id !== e3), this;
        }
        nodes() {
          return Sn(this.json).map((e3) => (delete (e3 = Object.assign({}, e3)).children, e3));
        }
        cache() {
          return ((e3) => {
            let t3 = Sn(e3, (e4, t4) => {
              e4.id && (e4._cache.parents = e4._cache.parents || [], e4._cache.children = e4._cache.children || [], t4._cache.parents = e4._cache.parents.concat([e4.id]));
            }), n2 = {};
            t3.forEach((e4) => {
              e4.id && (n2[e4.id] = e4);
            }), t3.forEach((e4) => {
              e4._cache.parents.forEach((t4) => {
                n2.hasOwnProperty(t4) && n2[t4]._cache.children.push(e4.id);
              });
            }), e3._cache.children = Object.keys(n2);
          })(this.json), this;
        }
        list() {
          return Sn(this.json);
        }
        fillDown() {
          var e3;
          return e3 = this.json, Sn(e3, (e4, t3) => {
            t3.props = ((e5, t4) => (Object.keys(t4).forEach((n2) => {
              if (t4[n2] instanceof Set) {
                let r2 = e5[n2] || /* @__PURE__ */ new Set();
                e5[n2] = /* @__PURE__ */ new Set([...r2, ...t4[n2]]);
              } else if (((e6) => e6 && "object" == typeof e6 && !Array.isArray(e6))(t4[n2])) {
                let r2 = e5[n2] || {};
                e5[n2] = Object.assign({}, t4[n2], r2);
              } else $n(t4[n2]) ? e5[n2] = t4[n2].concat(e5[n2] || []) : void 0 === e5[n2] && (e5[n2] = t4[n2]);
            }), e5))(t3.props, e4.props);
          }), this;
        }
        depth() {
          Un(this.json);
          let e3 = Sn(this.json), t3 = e3.length > 1 ? 1 : 0;
          return e3.forEach((e4) => {
            if (0 === e4._cache.parents.length) return;
            let n2 = e4._cache.parents.length + 1;
            n2 > t3 && (t3 = n2);
          }), t3;
        }
        out(e3) {
          return Un(this.json), qn(this.json, e3);
        }
        debug() {
          return Un(this.json), qn(this.json, "debug"), this;
        }
      };
      const Zn = function(e3) {
        let t3 = Kn(e3);
        return new Qn(t3);
      };
      Zn.prototype.plugin = function(e3) {
        e3(this);
      };
      const _n = { Noun: "blue", Verb: "green", Negative: "green", Date: "red", Value: "red", Adjective: "magenta", Preposition: "cyan", Conjunction: "cyan", Determiner: "cyan", Hyphenated: "cyan", Adverb: "cyan" }, Xn = function(e3) {
        if (_n.hasOwnProperty(e3.id)) return _n[e3.id];
        if (_n.hasOwnProperty(e3.is)) return _n[e3.is];
        let t3 = e3._cache.parents.find((e4) => _n[e4]);
        return _n[t3];
      }, Yn = function(e3) {
        return e3 ? "string" == typeof e3 ? [e3] : e3 : [];
      }, er = function(e3, t3) {
        return e3 = function(e4, t4) {
          return Object.keys(e4).forEach((n2) => {
            e4[n2].isA && (e4[n2].is = e4[n2].isA), e4[n2].notA && (e4[n2].not = e4[n2].notA), e4[n2].is && "string" == typeof e4[n2].is && (t4.hasOwnProperty(e4[n2].is) || e4.hasOwnProperty(e4[n2].is) || (e4[e4[n2].is] = {})), e4[n2].not && "string" == typeof e4[n2].not && !e4.hasOwnProperty(e4[n2].not) && (t4.hasOwnProperty(e4[n2].not) || e4.hasOwnProperty(e4[n2].not) || (e4[e4[n2].not] = {}));
          }), e4;
        }(e3, t3), Object.keys(e3).forEach((t4) => {
          e3[t4].children = Yn(e3[t4].children), e3[t4].not = Yn(e3[t4].not);
        }), Object.keys(e3).forEach((t4) => {
          (e3[t4].not || []).forEach((n2) => {
            e3[n2] && e3[n2].not && e3[n2].not.push(t4);
          });
        }), e3;
      };
      var tr = { one: { setTag: Fn, unTag: function(e3, t3, n2) {
        t3 = t3.trim().replace(/^#/, "");
        for (let r2 = 0; r2 < e3.length; r2 += 1) {
          let a2 = e3[r2];
          if (true === a2.frozen) continue;
          if ("*" === t3) {
            a2.tags.clear();
            continue;
          }
          let o2 = n2[t3];
          if (o2 && o2.children.length > 0) for (let e4 = 0; e4 < o2.children.length; e4 += 1) a2.tags.delete(o2.children[e4]);
          a2.tags.delete(t3);
        }
      }, addTags: function(e3, t3) {
        Object.keys(t3).length > 0 && (e3 = function(e4) {
          return Object.keys(e4).forEach((t4) => {
            e4[t4] = Object.assign({}, e4[t4]), e4[t4].novel = true;
          }), e4;
        }(e3)), e3 = er(e3, t3);
        const n2 = function(e4) {
          const t4 = Object.keys(e4).map((t5) => {
            let n3 = e4[t5];
            const r3 = { not: new Set(n3.not), also: n3.also, is: n3.is, novel: n3.novel };
            return { id: t5, parent: n3.is, props: r3, children: [] };
          });
          return Zn(t4).cache().fillDown().out("array");
        }(Object.assign({}, t3, e3)), r2 = function(e4) {
          const t4 = {};
          return e4.forEach((e5) => {
            let { not: n3, also: r3, is: a2, novel: o2 } = e5.props, i2 = e5._cache.parents;
            r3 && (i2 = i2.concat(r3)), t4[e5.id] = { is: a2, not: n3, novel: o2, also: r3, parents: i2, children: e5._cache.children, color: Xn(e5) };
          }), Object.keys(t4).forEach((e5) => {
            let n3 = new Set(t4[e5].not);
            t4[e5].not.forEach((e6) => {
              t4[e6] && t4[e6].children.forEach((e7) => n3.add(e7));
            }), t4[e5].not = Array.from(n3);
          }), t4;
        }(n2);
        return r2;
      }, canBe: function(e3, t3, n2) {
        if (!n2.hasOwnProperty(t3)) return true;
        let r2 = n2[t3].not || [];
        for (let t4 = 0; t4 < r2.length; t4 += 1) if (e3.tags.has(r2[t4])) return false;
        return true;
      } } };
      const nr = function(e3) {
        return "[object Array]" === Object.prototype.toString.call(e3);
      }, rr = { tag: function(e3, t3 = "", n2) {
        if (!this.found || !e3) return this;
        let r2 = this.termList();
        if (0 === r2.length) return this;
        const { methods: a2, verbose: o2, world: i2 } = this;
        return true === o2 && console.log(" +  ", e3, t3 || ""), nr(e3) ? e3.forEach((e4) => a2.one.setTag(r2, e4, i2, n2, t3)) : a2.one.setTag(r2, e3, i2, n2, t3), this.uncache(), this;
      }, tagSafe: function(e3, t3 = "") {
        return this.tag(e3, t3, true);
      }, unTag: function(e3, t3) {
        if (!this.found || !e3) return this;
        let n2 = this.termList();
        if (0 === n2.length) return this;
        const { methods: r2, verbose: a2, model: o2 } = this;
        true === a2 && console.log(" -  ", e3, t3 || "");
        let i2 = o2.one.tagSet;
        return nr(e3) ? e3.forEach((e4) => r2.one.unTag(n2, e4, i2)) : r2.one.unTag(n2, e3, i2), this.uncache(), this;
      }, canBe: function(e3) {
        e3 = e3.replace(/^#/, "");
        let t3 = this.model.one.tagSet, n2 = this.methods.one.canBe, r2 = [];
        this.document.forEach((a3, o2) => {
          a3.forEach((a4, i2) => {
            n2(a4, e3, t3) || r2.push([o2, i2, i2 + 1]);
          });
        });
        let a2 = this.update(r2);
        return this.difference(a2);
      } };
      var ar = { addTags: function(e3) {
        const { model: t3, methods: n2 } = this.world(), r2 = t3.one.tagSet;
        let a2 = (0, n2.one.addTags)(e3, r2);
        return t3.one.tagSet = a2, this;
      } };
      const or = /* @__PURE__ */ new Set(["Auxiliary", "Possessive"]);
      var ir = { model: { one: { tagSet: {} } }, compute: { tagRank: function(e3) {
        const { document: t3, world: n2 } = e3, r2 = n2.model.one.tagSet;
        t3.forEach((e4) => {
          e4.forEach((e5) => {
            let t4 = Array.from(e5.tags);
            e5.tagRank = function(e6, t5) {
              return e6 = e6.sort((e7, n3) => {
                if (or.has(e7) || !t5.hasOwnProperty(n3)) return 1;
                if (or.has(n3) || !t5.hasOwnProperty(e7)) return -1;
                let r3 = t5[e7].children || [], a2 = r3.length;
                return r3 = t5[n3].children || [], a2 - r3.length;
              }), e6;
            }(t4, r2);
          });
        });
      } }, methods: tr, api: function(e3) {
        Object.assign(e3.prototype, rr);
      }, lib: ar };
      const sr = /([.!?\u203D\u2E18\u203C\u2047-\u2049\u3002]+\s)/g, lr = /^[.!?\u203D\u2E18\u203C\u2047-\u2049\u3002]+\s$/, ur = /((?:\r?\n|\r)+)/, cr = /[a-z0-9\u00C0-\u00FF\u00a9\u00ae\u2000-\u3300\ud000-\udfff]/i, hr = /\S/, dr = { '"': '"', "\uFF02": "\uFF02", "\u201C": "\u201D", "\u201F": "\u201D", "\u201E": "\u201D", "\u2E42": "\u201D", "\u201A": "\u2019", "\xAB": "\xBB", "\u2039": "\u203A", "\u2035": "\u2032", "\u2036": "\u2033", "\u2037": "\u2034", "\u301D": "\u301E", "\u301F": "\u301E" }, gr = RegExp("[" + Object.keys(dr).join("") + "]", "g"), mr = RegExp("[" + Object.values(dr).join("") + "]", "g"), pr = function(e3) {
        if (!e3) return false;
        let t3 = e3.match(mr);
        return null !== t3 && 1 === t3.length;
      }, fr = /\(/g, br = /\)/g, vr = /\S/, yr = /^\s+/, wr = function(e3, t3) {
        let n2 = e3.split(/[-–—]/);
        if (n2.length <= 1) return false;
        const { prefixes: r2, suffixes: a2 } = t3.one;
        return (1 !== n2[0].length || !/[a-z]/i.test(n2[0])) && (!r2.hasOwnProperty(n2[0]) && (n2[1] = n2[1].trim().replace(/[.?!]$/, ""), !a2.hasOwnProperty(n2[1]) && (true === /^([a-z\u00C0-\u00FF`"'/]+)[-–—]([a-z0-9\u00C0-\u00FF].*)/i.test(e3) || true === /^[('"]?([0-9]{1,4})[-–—]([a-z\u00C0-\u00FF`"'/-]+[)'"]?$)/i.test(e3))));
      }, kr = function(e3) {
        let t3 = [];
        const n2 = e3.split(/[-–—]/);
        let r2 = "-", a2 = e3.match(/[-–—]/);
        a2 && a2[0] && (r2 = a2);
        for (let e4 = 0; e4 < n2.length; e4++) e4 === n2.length - 1 ? t3.push(n2[e4]) : t3.push(n2[e4] + r2);
        return t3;
      }, Pr = /\p{L} ?\/ ?\p{L}+$/u, Ar = /\S/, Cr = /^[!?.]+$/, Nr = /(\S+)/;
      let jr = [".", "?", "!", ":", ";", "-", "\u2013", "\u2014", "--", "...", "(", ")", "[", "]", '"', "'", "`", "\xAB", "\xBB", "*", "\u2022"];
      jr = jr.reduce((e3, t3) => (e3[t3] = true, e3), {});
      const xr = /\p{Letter}/u, Ir = /[\p{Number}\p{Currency_Symbol}]/u, Tr = /^[a-z]\.([a-z]\.)+/i, Dr = /[sn]['’]$/, Hr = /([A-Z]\.)+[A-Z]?,?$/, Er = /^[A-Z]\.,?$/, Gr = /[A-Z]{2,}('s|,)?$/, Or = /([a-z]\.)+[a-z]\.?$/, Fr = function(e3) {
        return function(e4) {
          return true === Hr.test(e4) || true === Or.test(e4) || true === Er.test(e4) || true === Gr.test(e4);
        }(e3) && (e3 = e3.replace(/\./g, "")), e3;
      }, Vr = function(e3, t3) {
        const n2 = t3.methods.one.killUnicode;
        let r2 = e3.text || "";
        r2 = function(e4) {
          let t4 = e4 = (e4 = (e4 = e4 || "").toLowerCase()).trim();
          return e4 = (e4 = (e4 = e4.replace(/[,;.!?]+$/, "")).replace(/\u2026/g, "...")).replace(/\u2013/g, "-"), false === /^[:;]/.test(e4) && (e4 = (e4 = (e4 = e4.replace(/\.{3,}$/g, "")).replace(/[",.!:;?)]+$/g, "")).replace(/^['"(]+/g, "")), "" === (e4 = (e4 = e4.replace(/[\u200B-\u200D\uFEFF]/g, "")).trim()) && (e4 = t4), e4.replace(/([0-9]),([0-9])/g, "$1$2");
        }(r2), r2 = n2(r2, t3), r2 = Fr(r2), e3.normal = r2;
      }, zr = /[ .][A-Z]\.? *$/i, Br = /(?:\u2026|\.{2,}) *$/, Sr = /\p{L}/u, $r = /\. *$/, Mr = /^[A-Z]\. $/;
      var Kr = { one: { killUnicode: function(e3, t3) {
        const n2 = t3.model.one.unicode || {};
        let r2 = (e3 = e3 || "").split("");
        return r2.forEach((e4, t4) => {
          n2[e4] && (r2[t4] = n2[e4]);
        }), r2.join("");
      }, tokenize: { splitSentences: function(e3, t3) {
        if (e3 = e3 || "", !(e3 = String(e3)) || "string" != typeof e3 || false === vr.test(e3)) return [];
        let n2 = function(e4) {
          let t4 = [], n3 = e4.split(ur);
          for (let e5 = 0; e5 < n3.length; e5++) {
            let r3 = n3[e5].split(sr);
            for (let e6 = 0; e6 < r3.length; e6++) r3[e6 + 1] && true === lr.test(r3[e6 + 1]) && (r3[e6] += r3[e6 + 1], r3[e6 + 1] = ""), "" !== r3[e6] && t4.push(r3[e6]);
          }
          return t4;
        }(e3 = e3.replace("\xA0", " ")), r2 = function(e4) {
          let t4 = [];
          for (let n3 = 0; n3 < e4.length; n3++) {
            let r3 = e4[n3];
            if (void 0 !== r3 && "" !== r3) {
              if (false === hr.test(r3) || false === cr.test(r3)) {
                if (t4[t4.length - 1]) {
                  t4[t4.length - 1] += r3;
                  continue;
                }
                if (e4[n3 + 1]) {
                  e4[n3 + 1] = r3 + e4[n3 + 1];
                  continue;
                }
              }
              t4.push(r3);
            }
          }
          return t4;
        }(n2);
        if (r2 = function(e4, t4) {
          const n3 = t4.methods.one.tokenize.isSentence, r3 = t4.model.one.abbreviations || /* @__PURE__ */ new Set();
          let a2 = [];
          for (let t5 = 0; t5 < e4.length; t5++) {
            let o2 = e4[t5];
            e4[t5 + 1] && false === n3(o2, r3) ? e4[t5 + 1] = o2 + (e4[t5 + 1] || "") : o2 && o2.length > 0 && (a2.push(o2), e4[t5] = "");
          }
          return a2;
        }(r2, t3), r2 = function(e4) {
          let t4 = [];
          for (let n3 = 0; n3 < e4.length; n3 += 1) {
            let r3 = e4[n3].match(gr);
            if (null !== r3 && 1 === r3.length) {
              if (pr(e4[n3 + 1]) && e4[n3 + 1].length < 280) {
                e4[n3] += e4[n3 + 1], t4.push(e4[n3]), e4[n3 + 1] = "", n3 += 1;
                continue;
              }
              if (pr(e4[n3 + 2])) {
                let r4 = e4[n3 + 1] + e4[n3 + 2];
                if (r4.length < 280) {
                  e4[n3] += r4, t4.push(e4[n3]), e4[n3 + 1] = "", e4[n3 + 2] = "", n3 += 2;
                  continue;
                }
              }
            }
            t4.push(e4[n3]);
          }
          return t4;
        }(r2), r2 = function(e4) {
          let t4 = [];
          for (let n3 = 0; n3 < e4.length; n3 += 1) {
            let r3 = e4[n3].match(fr);
            null !== r3 && 1 === r3.length && e4[n3 + 1] && e4[n3 + 1].length < 250 && null !== e4[n3 + 1].match(br) && 1 === r3.length && !fr.test(e4[n3 + 1]) ? (e4[n3] += e4[n3 + 1], t4.push(e4[n3]), e4[n3 + 1] = "", n3 += 1) : t4.push(e4[n3]);
          }
          return t4;
        }(r2), 0 === r2.length) return [e3];
        for (let e4 = 1; e4 < r2.length; e4 += 1) {
          let t4 = r2[e4].match(yr);
          null !== t4 && (r2[e4 - 1] += t4[0], r2[e4] = r2[e4].replace(yr, ""));
        }
        return r2;
      }, isSentence: function(e3, t3) {
        if (false === Sr.test(e3)) return false;
        if (true === zr.test(e3)) return false;
        if (3 === e3.length && Mr.test(e3)) return false;
        if (true === Br.test(e3)) return false;
        let n2 = e3.replace(/[.!?\u203D\u2E18\u203C\u2047-\u2049] *$/, "").split(" "), r2 = n2[n2.length - 1].toLowerCase();
        return true !== t3.hasOwnProperty(r2) || true !== $r.test(e3);
      }, splitTerms: function(e3, t3) {
        let n2 = [], r2 = [];
        if ("number" == typeof (e3 = e3 || "") && (e3 = String(e3)), function(e4) {
          return "[object Array]" === Object.prototype.toString.call(e4);
        }(e3)) return e3;
        const a2 = e3.split(Nr);
        for (let e4 = 0; e4 < a2.length; e4++) true !== wr(a2[e4], t3) ? r2.push(a2[e4]) : r2 = r2.concat(kr(a2[e4]));
        let o2 = "";
        for (let e4 = 0; e4 < r2.length; e4++) {
          let t4 = r2[e4];
          true === Ar.test(t4) && false === jr.hasOwnProperty(t4) && false === Cr.test(t4) ? (n2.length > 0 ? (n2[n2.length - 1] += o2, n2.push(t4)) : n2.push(o2 + t4), o2 = "") : o2 += t4;
        }
        return o2 && (0 === n2.length && (n2[0] = ""), n2[n2.length - 1] += o2), n2 = function(e4) {
          for (let t4 = 1; t4 < e4.length - 1; t4++) Pr.test(e4[t4]) && (e4[t4 - 1] += e4[t4] + e4[t4 + 1], e4[t4] = null, e4[t4 + 1] = null);
          return e4;
        }(n2), n2 = function(e4) {
          const t4 = /^[0-9]{1,4}(:[0-9][0-9])?([a-z]{1,2})? ?[-–—] ?$/, n3 = /^[0-9]{1,4}([a-z]{1,2})? ?$/;
          for (let r3 = 0; r3 < e4.length - 1; r3 += 1) e4[r3 + 1] && t4.test(e4[r3]) && n3.test(e4[r3 + 1]) && (e4[r3] = e4[r3] + e4[r3 + 1], e4[r3 + 1] = null);
          return e4;
        }(n2), n2 = n2.filter((e4) => e4), n2;
      }, splitWhitespace: (e3, t3) => {
        let { str: n2, pre: r2, post: a2 } = function(e4, t4) {
          let { prePunctuation: n3, postPunctuation: r3, emoticons: a3 } = t4.one, o2 = e4, i2 = "", s2 = "", l2 = Array.from(e4);
          if (a3.hasOwnProperty(e4.trim())) return { str: e4.trim(), pre: i2, post: " " };
          let u2 = l2.length;
          for (let e5 = 0; e5 < u2; e5 += 1) {
            let e6 = l2[0];
            if (true !== n3[e6]) {
              if (("+" === e6 || "-" === e6) && Ir.test(l2[1])) break;
              if ("'" === e6 && 3 === e6.length && Ir.test(l2[1])) break;
              if (xr.test(e6) || Ir.test(e6)) break;
              i2 += l2.shift();
            }
          }
          u2 = l2.length;
          for (let e5 = 0; e5 < u2; e5 += 1) {
            let e6 = l2[l2.length - 1];
            if (true !== r3[e6]) {
              if (xr.test(e6) || Ir.test(e6)) break;
              "." === e6 && true === Tr.test(o2) || "'" === e6 && true === Dr.test(o2) || (s2 = l2.pop() + s2);
            }
          }
          return "" === (e4 = l2.join("")) && (o2 = o2.replace(/ *$/, (e5) => (s2 = e5 || "", "")), e4 = o2, i2 = ""), { str: e4, pre: i2, post: s2 };
        }(e3, t3);
        return { text: n2, pre: r2, post: a2, tags: /* @__PURE__ */ new Set() };
      }, fromString: function(e3, t3) {
        const { methods: n2, model: r2 } = t3, { splitSentences: a2, splitTerms: o2, splitWhitespace: i2 } = n2.one.tokenize;
        return e3 = a2(e3 = e3 || "", t3).map((e4) => {
          let n3 = o2(e4, r2);
          return n3 = n3.map((e5) => i2(e5, r2)), n3.forEach((e5) => {
            Vr(e5, t3);
          }), n3;
        }), e3;
      } } } };
      let Lr = {}, Jr = {};
      [[["approx", "apt", "bc", "cyn", "eg", "esp", "est", "etc", "ex", "exp", "prob", "pron", "gal", "min", "pseud", "fig", "jd", "lat", "lng", "vol", "fm", "def", "misc", "plz", "ea", "ps", "sec", "pt", "pref", "pl", "pp", "qt", "fr", "sq", "nee", "ss", "tel", "temp", "vet", "ver", "fem", "masc", "eng", "adj", "vb", "rb", "inf", "situ", "vivo", "vitro", "wr"]], [["dl", "ml", "gal", "qt", "pt", "tbl", "tsp", "tbsp", "km", "dm", "cm", "mm", "mi", "td", "hr", "hrs", "kg", "hg", "dg", "cg", "mg", "\xB5g", "lb", "oz", "sq ft", "hz", "mps", "mph", "kmph", "kb", "mb", "tb", "lx", "lm", "fl oz", "yb"], "Unit"], [["ad", "al", "arc", "ba", "bl", "ca", "cca", "col", "corp", "ft", "fy", "ie", "lit", "ma", "md", "pd", "tce"], "Noun"], [["adj", "adm", "adv", "asst", "atty", "bldg", "brig", "capt", "cmdr", "comdr", "cpl", "det", "dr", "esq", "gen", "gov", "hon", "jr", "llb", "lt", "maj", "messrs", "mlle", "mme", "mr", "mrs", "ms", "mstr", "phd", "prof", "pvt", "rep", "reps", "res", "rev", "sen", "sens", "sfc", "sgt", "sir", "sr", "supt", "surg"], "Honorific"], [["jan", "feb", "mar", "apr", "jun", "jul", "aug", "sep", "sept", "oct", "nov", "dec"], "Month"], [["dept", "univ", "assn", "bros", "inc", "ltd", "co"], "Organization"], [["rd", "st", "dist", "mt", "ave", "blvd", "cl", "cres", "hwy", "ariz", "cal", "calif", "colo", "conn", "fla", "fl", "ga", "ida", "ia", "kan", "kans", "minn", "neb", "nebr", "okla", "penna", "penn", "pa", "dak", "tenn", "tex", "ut", "vt", "va", "wis", "wisc", "wy", "wyo", "usafa", "alta", "ont", "que", "sask"], "Place"]].forEach((e3) => {
        e3[0].forEach((t3) => {
          Lr[t3] = true, Jr[t3] = "Abbreviation", void 0 !== e3[1] && (Jr[t3] = [Jr[t3], e3[1]]);
        });
      });
      var Wr = ["anti", "bi", "co", "contra", "de", "extra", "infra", "inter", "intra", "macro", "micro", "mis", "mono", "multi", "peri", "pre", "pro", "proto", "pseudo", "re", "sub", "supra", "trans", "tri", "un", "out", "ex"].reduce((e3, t3) => (e3[t3] = true, e3), {});
      let qr = { "!": "\xA1", "?": "\xBF\u0241", '"': '\u201C\u201D"\u275D\u275E', "'": "\u2018\u201B\u275B\u275C\u2019", "-": "\u2014\u2013", a: "\xAA\xC0\xC1\xC2\xC3\xC4\xC5\xE0\xE1\xE2\xE3\xE4\xE5\u0100\u0101\u0102\u0103\u0104\u0105\u01CD\u01CE\u01DE\u01DF\u01E0\u01E1\u01FA\u01FB\u0200\u0201\u0202\u0203\u0226\u0227\u023A\u0386\u0391\u0394\u039B\u03AC\u03B1\u03BB\u0410\u0430\u0466\u0467\u04D0\u04D1\u04D2\u04D3\u019B\xE6", b: "\xDF\xFE\u0180\u0181\u0182\u0183\u0184\u0185\u0243\u0392\u03B2\u03D0\u03E6\u0411\u0412\u042A\u042C\u0432\u044A\u044C\u0462\u0463\u048C\u048D", c: "\xA2\xA9\xC7\xE7\u0106\u0107\u0108\u0109\u010A\u010B\u010C\u010D\u0186\u0187\u0188\u023B\u023C\u037B\u037C\u03F2\u03F9\u03FD\u03FE\u0421\u0441\u0454\u0480\u0481\u04AA\u04AB", d: "\xD0\u010E\u010F\u0110\u0111\u0189\u018A\u0221\u018B\u018C", e: "\xC8\xC9\xCA\xCB\xE8\xE9\xEA\xEB\u0112\u0113\u0114\u0115\u0116\u0117\u0118\u0119\u011A\u011B\u0190\u0204\u0205\u0206\u0207\u0228\u0229\u0246\u0247\u0388\u0395\u039E\u03A3\u03AD\u03B5\u03BE\u03F5\u0400\u0401\u0415\u0435\u0450\u0451\u04BC\u04BD\u04BE\u04BF\u04D6\u04D7\u1EC5", f: "\u0191\u0192\u03DC\u03DD\u04FA\u04FB\u0492\u0493\u017F", g: "\u011C\u011D\u011E\u011F\u0120\u0121\u0122\u0123\u0193\u01E4\u01E5\u01E6\u01E7\u01F4\u01F5", h: "\u0124\u0125\u0126\u0127\u0195\u01F6\u021E\u021F\u0389\u0397\u0402\u040A\u040B\u041D\u043D\u0452\u045B\u04A2\u04A3\u04A4\u04A5\u04BA\u04BB\u04C9\u04CA", I: "\xCC\xCD\xCE\xCF", i: "\xEC\xED\xEE\xEF\u0128\u0129\u012A\u012B\u012C\u012D\u012E\u012F\u0130\u0131\u0196\u0197\u0208\u0209\u020A\u020B\u038A\u0390\u03AA\u03AF\u03B9\u03CA\u0406\u0407\u0456\u0457i\u0307", j: "\u0134\u0135\u01F0\u0237\u0248\u0249\u03F3\u0408\u0458", k: "\u0136\u0137\u0138\u0198\u0199\u01E8\u01E9\u039A\u03BA\u040C\u0416\u041A\u0436\u043A\u045C\u049A\u049B\u049C\u049D\u049E\u049F\u04A0\u04A1", l: "\u0139\u013A\u013B\u013C\u013D\u013E\u013F\u0140\u0141\u0142\u019A\u01AA\u01C0\u01CF\u01D0\u0234\u023D\u0399\u04C0\u04CF", m: "\u039C\u03FA\u03FB\u041C\u043C\u04CD\u04CE", n: "\xD1\xF1\u0143\u0144\u0145\u0146\u0147\u0148\u0149\u014A\u014B\u019D\u019E\u01F8\u01F9\u0220\u0235\u039D\u03A0\u03AE\u03B7\u03DE\u040D\u0418\u0419\u041B\u041F\u0438\u0439\u043B\u043F\u045D\u048A\u048B\u04C5\u04C6\u04E2\u04E3\u04E4\u04E5\u03C0", o: "\xD2\xD3\xD4\xD5\xD6\xD8\xF0\xF2\xF3\xF4\xF5\xF6\xF8\u014C\u014D\u014E\u014F\u0150\u0151\u019F\u01A0\u01A1\u01D1\u01D2\u01EA\u01EB\u01EC\u01ED\u01FE\u01FF\u020C\u020D\u020E\u020F\u022A\u022B\u022C\u022D\u022E\u022F\u0230\u0231\u038C\u0398\u039F\u03B8\u03BF\u03C3\u03CC\u03D5\u03D8\u03D9\u03EC\u03F4\u041E\u0424\u043E\u0472\u0473\u04E6\u04E7\u04E8\u04E9\u04EA\u04EB", p: "\u01A4\u03A1\u03C1\u03F7\u03F8\u03FC\u0420\u0440\u048E\u048F\xDE", q: "\u024A\u024B", r: "\u0154\u0155\u0156\u0157\u0158\u0159\u01A6\u0210\u0211\u0212\u0213\u024C\u024D\u0403\u0413\u042F\u0433\u044F\u0453\u0490\u0491", s: "\u015A\u015B\u015C\u015D\u015E\u015F\u0160\u0161\u01A7\u01A8\u0218\u0219\u023F\u0405\u0455", t: "\u0162\u0163\u0164\u0165\u0166\u0167\u01AB\u01AC\u01AD\u01AE\u021A\u021B\u0236\u023E\u0393\u03A4\u03C4\u03EE\u0422\u0442", u: "\xD9\xDA\xDB\xDC\xF9\xFA\xFB\xFC\u0168\u0169\u016A\u016B\u016C\u016D\u016E\u016F\u0170\u0171\u0172\u0173\u01AF\u01B0\u01B1\u01B2\u01D3\u01D4\u01D5\u01D6\u01D7\u01D8\u01D9\u01DA\u01DB\u01DC\u0214\u0215\u0216\u0217\u0244\u03B0\u03C5\u03CB\u03CD", v: "\u03BD\u0474\u0475\u0476\u0477", w: "\u0174\u0175\u019C\u03C9\u03CE\u03D6\u03E2\u03E3\u0428\u0429\u0448\u0449\u0461\u047F", x: "\xD7\u03A7\u03C7\u03D7\u03F0\u0425\u0445\u04B2\u04B3\u04FC\u04FD\u04FE\u04FF", y: "\xDD\xFD\xFF\u0176\u0177\u0178\u01B3\u01B4\u0232\u0233\u024E\u024F\u038E\u03A5\u03AB\u03B3\u03C8\u03D2\u03D3\u03D4\u040E\u0423\u0443\u0447\u045E\u0470\u0471\u04AE\u04AF\u04B0\u04B1\u04EE\u04EF\u04F0\u04F1\u04F2\u04F3", z: "\u0179\u017A\u017B\u017C\u017D\u017E\u01B5\u01B6\u0224\u0225\u0240\u0396" }, Ur = {};
      Object.keys(qr).forEach(function(e3) {
        qr[e3].split("").forEach(function(t3) {
          Ur[t3] = e3;
        });
      });
      const Rr = /\//, Qr = /[a-z]\.[a-z]/i, Zr = /[0-9]/, _r = function(e3, t3) {
        let n2 = e3.normal || e3.text || e3.machine;
        const r2 = t3.model.one.aliases;
        if (r2.hasOwnProperty(n2) && (e3.alias = e3.alias || [], e3.alias.push(r2[n2])), Rr.test(n2) && !Qr.test(n2) && !Zr.test(n2)) {
          let t4 = n2.split(Rr);
          t4.length <= 3 && t4.forEach((t5) => {
            "" !== (t5 = t5.trim()) && (e3.alias = e3.alias || [], e3.alias.push(t5));
          });
        }
        return e3;
      }, Xr = /^\p{Letter}+-\p{Letter}+$/u, Yr = function(e3) {
        let t3 = e3.implicit || e3.normal || e3.text;
        t3 = t3.replace(/['’]s$/, ""), t3 = t3.replace(/s['’]$/, "s"), t3 = t3.replace(/([aeiou][ktrp])in'$/, "$1ing"), Xr.test(t3) && (t3 = t3.replace(/-/g, "")), t3 = t3.replace(/^[#@]/, ""), t3 !== e3.normal && (e3.machine = t3);
      }, ea = function(e3, t3) {
        let n2 = e3.docs;
        for (let r2 = 0; r2 < n2.length; r2 += 1) for (let a2 = 0; a2 < n2[r2].length; a2 += 1) t3(n2[r2][a2], e3.world);
      }, ta = { alias: (e3) => ea(e3, _r), machine: (e3) => ea(e3, Yr), normal: (e3) => ea(e3, Vr), freq: function(e3) {
        let t3 = e3.docs, n2 = {};
        for (let e4 = 0; e4 < t3.length; e4 += 1) for (let r2 = 0; r2 < t3[e4].length; r2 += 1) {
          let a2 = t3[e4][r2], o2 = a2.machine || a2.normal;
          n2[o2] = n2[o2] || 0, n2[o2] += 1;
        }
        for (let e4 = 0; e4 < t3.length; e4 += 1) for (let r2 = 0; r2 < t3[e4].length; r2 += 1) {
          let a2 = t3[e4][r2], o2 = a2.machine || a2.normal;
          a2.freq = n2[o2];
        }
      }, offset: function(e3) {
        let t3 = 0, n2 = 0, r2 = e3.document;
        for (let e4 = 0; e4 < r2.length; e4 += 1) for (let a2 = 0; a2 < r2[e4].length; a2 += 1) {
          let o2 = r2[e4][a2];
          o2.offset = { index: n2, start: t3 + o2.pre.length, length: o2.text.length }, t3 += o2.pre.length + o2.text.length + o2.post.length, n2 += 1;
        }
      }, index: function(e3) {
        let t3 = e3.document;
        for (let e4 = 0; e4 < t3.length; e4 += 1) for (let n2 = 0; n2 < t3[e4].length; n2 += 1) t3[e4][n2].index = [e4, n2];
      }, wordCount: function(e3) {
        let t3 = 0, n2 = e3.docs;
        for (let e4 = 0; e4 < n2.length; e4 += 1) for (let r2 = 0; r2 < n2[e4].length; r2 += 1) "" !== n2[e4][r2].normal && (t3 += 1, n2[e4][r2].wordCount = t3);
      } };
      var na = { compute: ta, methods: Kr, model: { one: { aliases: { "&": "and", "@": "at", "%": "percent", plz: "please", bein: "being" }, abbreviations: Lr, prefixes: Wr, suffixes: { like: true, ish: true, less: true, able: true, elect: true, type: true, designate: true }, prePunctuation: { "#": true, "@": true, _: true, "\xB0": true, "\u200B": true, "\u200C": true, "\u200D": true, "\uFEFF": true }, postPunctuation: { "%": true, _: true, "\xB0": true, "\u200B": true, "\u200C": true, "\u200D": true, "\uFEFF": true }, lexicon: Jr, unicode: Ur, emoticons: { "<3": true, "</3": true, "<\\3": true, ":^P": true, ":^p": true, ":^O": true, ":^3": true } } }, hooks: ["alias", "machine", "index", "id"] }, ra = { typeahead: function(e3) {
        const t3 = e3.model.one.typeahead, n2 = e3.docs;
        if (0 === n2.length || 0 === Object.keys(t3).length) return;
        let r2 = n2[n2.length - 1] || [], a2 = r2[r2.length - 1];
        if (!a2.post && t3.hasOwnProperty(a2.normal)) {
          let n3 = t3[a2.normal];
          a2.implicit = n3, a2.machine = n3, a2.typeahead = true, e3.compute.preTagger && e3.last().unTag("*").compute(["lexicon", "preTagger"]);
        }
      } };
      const aa = function() {
        const e3 = this.docs;
        if (0 === e3.length) return this;
        let t3 = e3[e3.length - 1] || [], n2 = t3[t3.length - 1];
        return true === n2.typeahead && n2.machine && (n2.text = n2.machine, n2.normal = n2.machine), this;
      }, oa = { safe: true, min: 3 };
      var ia = { typeahead: function(e3 = [], t3 = {}) {
        let n2 = this.model();
        var r2;
        t3 = Object.assign({}, oa, t3), r2 = e3, "[object Object]" === Object.prototype.toString.call(r2) && (Object.assign(n2.one.lexicon, e3), e3 = Object.keys(e3));
        let a2 = function(e4, t4, n3) {
          let r3 = {}, a3 = [], o2 = n3.prefixes || {};
          return e4.forEach((e5) => {
            let i2 = (e5 = e5.toLowerCase().trim()).length;
            t4.max && i2 > t4.max && (i2 = t4.max);
            for (let s2 = t4.min; s2 < i2; s2 += 1) {
              let i3 = e5.substring(0, s2);
              t4.safe && n3.model.one.lexicon.hasOwnProperty(i3) || (true !== o2.hasOwnProperty(i3) && true !== r3.hasOwnProperty(i3) ? r3[i3] = e5 : a3.push(i3));
            }
          }), r3 = Object.assign({}, o2, r3), a3.forEach((e5) => {
            delete r3[e5];
          }), r3;
        }(e3, t3, this.world());
        return Object.keys(a2).forEach((e4) => {
          n2.one.typeahead.hasOwnProperty(e4) ? delete n2.one.typeahead[e4] : n2.one.typeahead[e4] = a2[e4];
        }), this;
      } }, sa = { model: { one: { typeahead: {} } }, api: function(e3) {
        e3.prototype.autoFill = aa;
      }, lib: ia, compute: ra, hooks: ["typeahead"] };
      h.extend(K), h.extend(bn), h.extend(Kt), h.extend(xn), h.extend(ir), h.plugin(be), h.extend(na), h.extend(Pe), h.plugin(p), h.extend(Ve), h.extend(sa), h.extend(De), h.extend(Hn);
      var la = { addendum: "addenda", corpus: "corpora", criterion: "criteria", curriculum: "curricula", genus: "genera", memorandum: "memoranda", opus: "opera", ovum: "ova", phenomenon: "phenomena", referendum: "referenda", alga: "algae", alumna: "alumnae", antenna: "antennae", formula: "formulae", larva: "larvae", nebula: "nebulae", vertebra: "vertebrae", analysis: "analyses", axis: "axes", diagnosis: "diagnoses", parenthesis: "parentheses", prognosis: "prognoses", synopsis: "synopses", thesis: "theses", neurosis: "neuroses", appendix: "appendices", index: "indices", matrix: "matrices", ox: "oxen", sex: "sexes", alumnus: "alumni", bacillus: "bacilli", cactus: "cacti", fungus: "fungi", hippopotamus: "hippopotami", libretto: "libretti", modulus: "moduli", nucleus: "nuclei", octopus: "octopi", radius: "radii", stimulus: "stimuli", syllabus: "syllabi", cookie: "cookies", calorie: "calories", auntie: "aunties", movie: "movies", pie: "pies", rookie: "rookies", tie: "ties", zombie: "zombies", leaf: "leaves", loaf: "loaves", thief: "thieves", foot: "feet", goose: "geese", tooth: "teeth", beau: "beaux", chateau: "chateaux", tableau: "tableaux", bus: "buses", gas: "gases", circus: "circuses", crisis: "crises", virus: "viruses", database: "databases", excuse: "excuses", abuse: "abuses", avocado: "avocados", barracks: "barracks", child: "children", clothes: "clothes", echo: "echoes", embargo: "embargoes", epoch: "epochs", deer: "deer", halo: "halos", man: "men", woman: "women", mosquito: "mosquitoes", mouse: "mice", person: "people", quiz: "quizzes", rodeo: "rodeos", shoe: "shoes", sombrero: "sombreros", stomach: "stomachs", tornado: "tornados", tuxedo: "tuxedos", volcano: "volcanoes" }, ua = { Comparative: "true\xA6bett1f0;arth0ew0in0;er", Superlative: "true\xA6earlier", PresentTense: "true\xA6bests,sounds", Condition: "true\xA6lest,unless", PastTense: "true\xA6began,came,d4had,kneel3l2m0sa4we1;ea0sg2;nt;eap0i0;ed;id", Participle: "true\xA60:09;a06b01cZdXeat0fSgQhPoJprov0rHs7t6u4w1;ak0ithdra02o2r1;i02uY;k0v0;nd1pr04;ergoJoJ;ak0hHo3;e9h7lain,o6p5t4un3w1;o1um;rn;g,k;ol0reS;iQok0;ught,wn;ak0o1runk;ne,wn;en,wn;ewriNi1uJ;dd0s0;ut3ver1;do4se0t1;ak0h2;do2g1;roG;ne;ast0i7;iv0o1;ne,tt0;all0loBor1;bi3g2s1;ak0e0;iv0o9;dd0;ove,r1;a5eamt,iv0;hos0lu1;ng;e4i3lo2ui1;lt;wn;tt0;at0en,gun;r2w1;ak0ok0;is0;en", Gerund: "true\xA6accord0be0doin,go0result0stain0;ing", Expression: "true\xA6a0Yb0Uc0Sd0Oe0Mfarew0Lg0FhZjeez,lWmVnToOpLsJtIuFvEw7y0;a5e3i1u0;ck,p;k04p0;ee,pee;a0p,s;!h;!a,h,y;a5h2o1t0;af,f;rd up,w;atsoever,e1o0;a,ops;e,w;hoo,t;ery w06oi0L;gh,h0;! 0h,m;huh,oh;here nPsk,ut tut;h0ic;eesh,hh,it,oo;ff,h1l0ow,sst;ease,s,z;ew,ooey;h1i,mg,o0uch,w,y;h,o,ps;! 0h;hTmy go0wT;d,sh;a7evertheless,o0;!pe;eh,mm;ah,eh,m1ol0;!s;ao,fao;aCeBi9o2u0;h,mph,rra0zzC;h,y;l1o0;r6y9;la,y0;! 0;c1moCsmok0;es;ow;!p hip hoor0;ay;ck,e,llo,y;ha1i,lleluj0;ah;!ha;ah,ee4o1r0;eat scott,r;l1od0sh; grief,bye;ly;! whiz;ell;e0h,t cetera,ureka,ww,xcuse me;k,p;'oh,a0rat,uh;m0ng;mit,n0;!it;mon,o0;ngratulations,wabunga;a2oo1r0tw,ye;avo,r;!ya;h,m; 1h0ka,las,men,rgh,ye;!a,em,h,oy;la", Negative: "true\xA6n0;ever,o0;n,t", QuestionWord: "true\xA6how3wh0;at,e1ich,o0y;!m,se;n,re; come,'s", Reflexive: "true\xA6h4it5my5o1the0your2;ir1m1;ne3ur0;sel0;f,ves;er0im0;self", Plural: "true\xA6dick0gre0ones,records;ens", "Unit|Noun": "true\xA6cEfDgChBinchAk9lb,m6newt5oz,p4qt,t1y0;ardEd;able1b0ea1sp;!l,sp;spo1;a,t,x;on9;!b,g,i1l,m,p0;h,s;!les;!b,elvin,g,m;!es;g,z;al,b;eet,oot,t;m,up0;!s", Value: "true\xA6a few", Imperative: "true\xA6bewa0come he0;re", "Plural|Verb": "true\xA6leaves", Demonym: "true\xA60:15;1:12;a0Vb0Oc0Dd0Ce08f07g04h02iYjVkTlPmLnIomHpEqatari,rCs7t5u4v3welAz2;am0Gimbabwe0;enezuel0ietnam0I;gAkrai1;aiwTex0hai,rinida0Ju2;ni0Prkmen;a5cotti4e3ingapoOlovak,oma0Spaniard,udRw2y0W;ede,iss;negal0Cr09;sh;mo0uT;o5us0Jw2;and0;a2eru0Fhilippi0Nortugu07uerto r0S;kist3lesti1na2raguay0;ma1;ani;ami00i2orweP;caragu0geri2;an,en;a3ex0Lo2;ngo0Drocc0;cedo1la2;gasy,y07;a4eb9i2;b2thua1;e0Cy0;o,t01;azakh,eny0o2uwaiI;re0;a2orda1;ma0Ap2;anO;celandic,nd4r2sraeli,ta01vo05;a2iB;ni0qi;i0oneU;aiAin2ondur0unO;di;amEe2hanai0reek,uatemal0;or2rm0;gi0;ilipino,ren8;cuadoVgyp4mira3ngli2sto1thiopi0urope0;shm0;ti;ti0;aPominUut3;a9h6o4roat3ub0ze2;ch;!i0;lom2ngol5;bi0;a6i2;le0n2;ese;lifor1m2na3;bo2eroo1;di0;angladeshi,el6o4r3ul2;gaE;azi9it;li2s1;vi0;aru2gi0;si0;fAl7merBngol0r5si0us2;sie,tr2;a2i0;li0;genti2me1;ne;ba1ge2;ri0;ni0;gh0r2;ic0;an", Organization: "true\xA60:4Q;a3Tb3Bc2Od2He2Df27g1Zh1Ti1Pj1Nk1Ll1Gm12n0Po0Mp0Cqu0Br02sTtHuCv9w3xiaomi,y1;amaha,m1Bou1w1B;gov,tu3C;a4e2iki1orld trade organizati33;leaRped0O;lls fargo,st1;fie2Hinghou2R;l1rner br3U;gree3Jl street journ2Im1E;an halOeriz2Xisa,o1;dafo2Yl1;kswagMvo;b4kip,n2ps,s1;a tod3Aps;es3Mi1;lev3Fted natio3C;er,s; mobi32aco beRd bOe9gi frida3Lh3im horto3Amz,o1witt3D;shi49y1;ota,s r 05;e 1in lizzy;b3carpen3Jdaily ma3Dguess w2holli0s1w2;mashing pumpki35uprem0;ho;ea1lack eyed pe3Xyr0Q;ch bo3Dtl0;l2n3Qs1xas instrumen1U;co,la m1F;efoni0Kus;a8cientology,e5ieme2Ymirnoff,np,o3pice gir6quare0Ata1ubaru;rbuc1to34;ks;ny,undgard1;en;a2x pisto1;ls;g1Wrs;few2Minsbur31lesfor03msu2E;adiohead,b8e4o1yana3C;man empi1Xyal 1;b1dutch she4;ank;a3d 1max,vl20;bu1c2Ahot chili peppe2Ylobst2N;ll;ders dige1Ll madrid;c,s;ant3Aizn2Q;a8bs,e5fiz2Ihilip4i3r1;emier 1udenti1D;leagTo2K;nk floyd,zza hut; morrBs;psi2tro1uge0E;br33chi0Tn33;!co;lant2Un1yp16; 2ason27da2P;ld navy,pec,range juli2xf1;am;us;aAb9e6fl,h5i4o1sa,vid3wa;k2tre dame,vart1;is;ia;ke,ntendo,ss0QvZ;l,s;c,st1Otflix,w1; 1sweek;kids on the block,york0D;a,c;nd22s2t1;ional aca2Po,we0U;a,c02d0S;aDcdonalCe9i6lb,o3tv,y1;spa1;ce;b1Tnsanto,ody blu0t1;ley cr1or0T;ue;c2t1;as,subisO;helin,rosoft;dica2rcedes benz,talli1;ca;id,re;ds;cs milk,tt19z24;a3e1g,ittle caesa1P; ore09novo,x1;is,mark,us; 1bour party;pres0Dz boy;atv,fc,kk,lm,m1od1O;art;iffy lu0Roy divisi0Jpmorgan1sa;! cha09;bm,hop,k3n1tv;g,te1;l,rpol;ea;a5ewlett pack1Vi3o1sbc,yundai;me dep1n1P;ot;tac1zbollah;hi;lliburt08sbro;eneral 6hq,ithub,l5mb,o2reen d0Ou1;cci,ns n ros0;ldman sachs,o1;dye1g0H;ar;axo smith kli04encoW;electr0Nm1;oto0Z;a5bi,c barcelo4da,edex,i2leetwood m03o1rito l0G;rd,xcY;at,fa,nancial1restoZ; tim0;na;cebook,nnie mae;b0Asa,u3xxon1; m1m1;ob0J;!rosceptics;aiml0De5isney,o4u1;nkin donu2po0Zran dur1;an;ts;j,w jon0;a,f lepp12ll,peche mode,r spieg02stiny's chi1;ld;aJbc,hFiDloudflaCnn,o3r1;aigsli5eedence clearwater reviv1ossra09;al;c7inba6l4m1o0Est09;ca2p1;aq;st;dplSg1;ate;se;a c1o chanQ;ola;re;a,sco1tigroup;! systems;ev2i1;ck fil a,na daily;r1y;on;d2pital o1rls jr;ne;bury,ill1;ac;aEbc,eBf9l5mw,ni,o1p,rexiteeU;ei3mbardiIston 1;glo1pizza;be;ng;o2ue c1;roV;ckbuster video,omingda1;le; g1g1;oodriL;cht2e ge0rkshire hathaw1;ay;el;cardi,idu,nana republ3s1xt5y5;f,kin robbi1;ns;ic;bYcTdidSerosmith,iRlKmEnheuser busDol,ppleAr6s4u3v2y1;er;is,on;di,todesk;hland o1sociated E;il;b3g2m1;co;os;ys; compu1be0;te1;rs;ch;c,d,erican3t1;!r1;ak; ex1;pre1;ss; 5catel2ta1;ir;! lu1;ce1;nt;jazeera,qae1;da;g,rbnb;as;/dc,a3er,tivision1;! blizz1;ard;demy of scienc0;es;ba", Possessive: "true\xA6its,my,our0thy;!s", "Noun|Verb": "true\xA60:9W;1:AA;2:96;3:A3;4:9R;5:A2;6:9K;7:8N;8:7L;9:A8;A:93;B:8D;C:8X;a9Ob8Qc7Id6Re6Gf5Sg5Hh55i4Xj4Uk4Rl4Em40n3Vo3Sp2Squ2Rr21s0Jt02u00vVwGyFzD;ip,oD;ne,om;awn,e6Fie68;aOeMhJiHoErD;ap,e9Oink2;nd0rDuC;kDry,sh5Hth;!shop;ck,nDpe,re,sh;!d,g;e86iD;p,sD;k,p0t2;aDed,lco8W;r,th0;it,lk,rEsDt4ve,x;h,te;!ehou1ra9;aGen5FiFoD;iDmAte,w;ce,d;be,ew,sA;cuum,l4B;pDr7;da5gra6Elo6A;aReQhrPiOoMrGuEwiDy5Z;n,st;nDrn;e,n7O;aGeFiEoDu6;t,ub2;bu5ck4Jgg0m,p;at,k,nd;ck,de,in,nsDp,v7J;f0i8R;ll,ne,p,r4Yss,t94uD;ch,r;ck,de,e,le,me,p,re;e5Wow,u6;ar,e,ll,mp0st,xt;g,lDng2rg7Ps5x;k,ly;a0Sc0Ne0Kh0Fi0Dk0Cl0Am08n06o05pXquaBtKuFwD;ea88iD;ng,pe,t4;bGit,m,ppErD;fa3ge,pri1v2U;lDo6S;e6Py;!je8;aMeLiKoHrEuDy2;dy,ff,mb2;a85eEiDo5Pugg2;ke,ng;am,ss,t4;ckEop,p,rD;e,m;ing,pi2;ck,nk,t4;er,m,p;ck,ff,ge,in,ke,lEmp,nd,p2rDte,y;!e,t;k,l;aJeIiHlGoFrDur,y;ay,e56inDu3;g,k2;ns8Bt;a5Qit;ll,n,r87te;ed,ll;m,n,rk;b,uC;aDee1Tow;ke,p;a5Je4FiDo53;le,rk;eep,iDou4;ce,p,t;ateboa7Ii;de,gnDl2Vnk,p,ze;!al;aGeFiEoDuff2;ck,p,re,w;ft,p,v0;d,i3Ylt0;ck,de,pe,re,ve;aEed,nDrv1It;se,t2N;l,r4t;aGhedu2oBrD;aEeDibb2o3Z;en,w;pe,t4;le,n,r2M;cDfegua72il,mp2;k,rifi3;aZeHhy6LiGoEuD;b,in,le,n,s5X;a6ck,ll,oDpe,u5;f,t;de,ng,ot,p,s1W;aTcSdo,el,fQgPje8lOmMnLo17pJque6sFturn,vDwa6V;eDi27;al,r1;er74oFpe8tEuD;lt,me;!a55;l71rt;air,eaDly,o53;l,t;dezvo2Zt;aDedy;ke,rk;ea1i4G;a6Iist0r5N;act6Yer1Vo71uD;nd,se;a38o6F;ch,s6G;c1Dge,iEke,lly,nDp1Wt1W;ge,k,t;n,se;es6Biv0;a04e00hYiXlToNrEsy4uD;mp,n4rcha1sh;aKeIiHoDu4O;be,ceFdu3fi2grDje8mi1p,te6;amDe6W;!me;ed,ss;ce,de,nt;sDy;er6Cs;cti3i1;iHlFoEp,re,sDuCw0;e,i5Yt;l,p;iDl;ce,sh;nt,s5V;aEce,e32uD;g,mp,n7;ce,nDy;!t;ck,le,n17pe,tNvot;a1oD;ne,tograph;ak,eFnErDt;fu55mA;!c32;!l,r;ckJiInHrFsEtDu1y;ch,e9;s,te;k,tD;!y;!ic;nt,r,se;!a7;bje8ff0il,oErDutli3Qver4B;bAd0ie9;ze;a4ReFoDur1;d,tD;e,i3;ed,gle8tD;!work;aMeKiIoEuD;rd0;ck,d3Rld,nEp,uDve;nt,th;it5EkD;ey;lk,n4Brr5CsDx;s,ta2B;asuBn4UrDss;ge,it;il,nFp,rk3WsEtD;ch,t0;h,k,t0;da5n0oeuvB;aLeJiHoEuD;mp,st;aEbby,ck,g,oDve;k,t;d,n;cDe,ft,mAnIst;en1k;aDc0Pe4vK;ch,d,k,p,se;bFcEnd,p,t4uD;gh,n4;e,k;el,o2U;eEiDno4E;ck,d,ll,ss;el,y;aEo1OuD;i3mp;m,zz;mpJnEr46ssD;ue;c1Rdex,fluGha2k,se2HteDvoi3;nt,rD;e6fa3viD;ew;en3;a8le2A;aJeHiGoEuD;g,nt;l3Ano2Dok,pDr1u1;!e;ghli1Fke,nt,re,t;aDd7lp;d,t;ck,mGndFrEsh,tDu9;ch,e;bo3Xm,ne4Eve6;!le;!m0;aMear,ift,lKossJrFuD;arDe4Alp,n;antee,d;aFiEoDumb2;uCwth;ll,nd,p;de,sp;ip;aBoDue;ss,w;g,in,me,ng,s,te,ze;aZeWiRlNoJrFuD;ck,el,nDss,zz;c38d;aEoDy;st,wn;cDgme,me,nchi1;tuB;cFg,il,ld,rD;ce,e29mDwa31;!at;us;aFe0Vip,oDy;at,ck,od,wD;!er;g,ke,me,re,sh,vo1E;eGgFlEnDre,sh,t,x;an3i0Q;e,m,t0;ht,uB;ld;aEeDn3;d,l;r,tuB;ce,il,ll,rm,vo2W;cho,d7ffe8nMsKxFyeD;!baD;ll;cGerci1hFpDtra8;eriDo0W;en3me9;au6ibA;el,han7u1;caDtima5;pe;count0d,vy;a01eSiMoJrEuDye;b,el,mp,pli2X;aGeFiEoD;ne,p;ft,ll,nk,p,ve;am,ss;ft,g,in;cEd7ubt,wnloD;ad;k,u0E;ge6p,sFt4vD;e,iDor3;de;char7gui1h,liEpD;at4lay,u5;ke;al,bKcJfeIlGmaCposAsEtaD;il;e07iD;gn,re;ay,ega5iD;ght;at,ct;li04rea1;a5ut;b,ma7n3rDte;e,t;a0Eent0Dh06irc2l03oKrFuD;be,e,rDt;b,e,l,ve;aGeFoEuDy;sh;p,ss,wd;dAep;ck,ft,sh;at,de,in,lTmMnFordina5py,re,st,uDv0;gh,nDp2rt;s01t;ceHdu8fli8glomeIsFtDveN;a8rD;a6ol;e9tru8;ct;ntDrn;ra5;bHfoGmFpD;leDouCromi1;me9;aCe9it,u5;rt;at,iD;ne;lap1oD;r,ur;aEiDoud,ub;ck,p;im,w;aEeDip;at,ck,er;iGllen7nErD;ge,m,t;ge,nD;el;n,r;er,re;ke,ll,mp,noe,pGrXsFtEuDve;se,ti0I;alog,ch;h,t;!tuB;re;a03eZiXlToPrHuEyD;pa11;bb2ck2dgEff0mp,rDst,zz;den,n;et;anJeHiFoadEuD;i1sh;ca6;be,d7;ge;aDed;ch,k;ch,d;aFg,mb,nEoDrd0tt2x,ycott;k,st,t;d,e;rd,st;aFeCiDoYur;nk,tz;nd;me;as,d,ke,nd,opsy,tD;!ch,e;aFef,lt,nDt;d,efA;it;r,t;ck,il,lan3nIrFsEtt2;le;e,h;!gDk;aDe;in;!d,g,k;bu1c05dZge,iYlVnTppQrLsIttGucEwaD;rd;tiD;on;aDempt;ck;k,sD;i6ocia5;st;chFmD;!oD;ur;!iD;ve;eEroa4;ch;al;chDg0sw0;or;aEt0;er;rm;d,m,r;dreHvD;an3oD;ca5;te;ce;ss;cDe,he,t;eFoD;rd,u9;nt;nt,ss;se", Actor: "true\xA60:7B;1:7G;2:6A;3:7F;4:7O;5:7K;a6Nb62c4Ud4Be41f3Sg3Bh30i2Uj2Qkin2Pl2Km26n1Zo1Sp0Vqu0Tr0JsQtJuHvEw8yo6;gi,ut6;h,ub0;aAe9i8o7r6;estl0it0;m2rk0;fe,nn0t2Bza2H;atherm2ld0;ge earn0it0nder0rri1;eter7i6oyF;ll5Qp,s3Z;an,ina2U;n6s0;c6Uder03;aoisea23e9herapi5iktok0o8r6ut1yco6S;a6endseLo43;d0mp,nscri0Bvel0;ddl0u1G;a0Qchn7en6na4st0;ag0;i3Oo0D;aiXcUeRhPiMki0mu26oJpGquaFtBu7wee6;p0theart;lt2per7r6;f0ge6Iviv1;h6inten0Ist5Ivis1;ero,um2;a8ep7r6;ang0eam0;bro2Nc2Ofa2Nmo2Nsi20;ff0tesm2;tt0;ec7ir2Do6;kesp59u0M;ia5Jt3;l7me6An,rcere6ul;r,ss;di0oi5;n7s6;sy,t0;g0n0;am2ephe1Iow6;girl,m2r2Q;cretInior cit3Fr6;gea4v6;a4it1;hol4Xi7reen6ulpt1;wr2C;e01on;l1nt;aEe9o8u6;l0nn6;er up,ingE;g40le mod3Zof0;a4Zc8fug2Ppo32searQv6;ere4Uolution6;ary;e6luYru22;ptio3T;bbi,dic5Vpp0;arter6e2Z;back;aYeWhSiRlOoKr8sycho7u6;nk,p31;logi5;aGeDiBo6;d9fess1g7ph47s6;pe2Ktitu51;en6ramm0;it1y;igy,uc0;est4Nme mini0Unce6s3E;!ss;a7si6;de4;ch0;ctiti39nk0P;dca0Oet,li6pula50rnst42;c2Itic6;al scie6i2;nti5;a6umb0;nn0y6;er,ma4Lwright;lgrim,one0;a8iloso7otogra7ra6ysi1V;se;ph0;ntom,rmaci5;r6ssi1T;form0s4O;i3El,nel3Yr8st1tr6wn;i6on;arWot;ent4Wi42tn0;ccupa4ffBp8r7ut6;ca5l0B;ac4Iganiz0ig2Fph2;er3t6;i1Jomet6;ri5;ic0spring;aBe9ie4Xo7u6;n,rser3J;b6mad,vi4V;le2Vo4D;i6mesis,phew;ce,ghb1;nny,rr3t1X;aEeDiAo7u6yst1Y;m8si16;der3gul,m7n6th0;arDk;!my;ni7s6;f02s0Jt0;on,st0;chan1Qnt1rcha4;gi9k0n8rtyr,t6y1;e,riar6;ch;ag0iac;ci2stra3I;a7e2Aieutena4o6;rd,s0v0;bor0d7ndlo6ss,urea3Fwy0ym2;rd;!y;!s28;e8o7u6;ggl0;gg0urna2U;st0;c3Hdol,llu3Ummigra4n6; l9c1Qfa4habi42nov3s7ve6;nt1stig3;pe0Nt6;a1Fig3ru0M;aw;airFeBistoAo8u6ygie1K;man6sba2H;!ita8;bo,st6usekN;age,e3P;ri2;ir,r6;m7o6;!ine;it;dress0sty2C;aLeIhostGirl26ladi3oCrand7u6;e5ru;c9daug0Jfa8m7pa6s2Y;!re4;a,o6;th0;hi1B;al7d6lf0;!de3A;ie,k6te26;eep0;!wr6;it0;isha,n6;i6tl04;us;mbl0rden0;aDella,iAo7r6;eela2Nie1P;e,re6ster pare4;be1Hm2r6st0;unn0;an2ZgZlmm17nanci0r6tt0;e6st la2H; marsh2OfigXm2;rm0th0;conoEdDlectriCm8n7x6;amin0cellency,i2A;emy,trepreneur,vironmenta1J;c8p6;er1loye6;e,r;ee;ci2;it1;mi5;aKeBi8ork,ri7u6we02;de,tche2H;ft0v0;ct3eti7plom2Hre6va;ct1;ci2ti2;aDcor3fencCi0InAput9s7tectLvel6;op0;ce1Ge6ign0;rt0;ee,y;iz6;en;em2;c1Ml0;d8nc0redev7ug6;ht0;il;!dy;a06e04fo,hXitizenWlToBr9u6;r3stomer6;! representat6;ive;e3it6;ic;lJmGnAord9rpor1Nu7w6;boy,ork0;n6ri0;ciTte1Q;in3;fidantAgressSs9t6;e0Kr6;ibut1o6;ll0;tab13ul1O;!e;edi2m6pos0rade;a0EeQissi6;on0;leag8on7um6;ni5;el;ue;e6own;an0r6;ic,k;!s;a9e7i6um;ld;erle6f;ad0;ir7nce6plFract0;ll1;m2wI;lebri6o;ty;dBptAr6shi0;e7pe6;nt0;r,t6;ak0;ain;et;aMeLiJlogg0oErBu6;dd0Fild0rgl9siness6;m2p7w6;om2;ers05;ar;i7o6;!k0th0;cklay0de,gadi0;hemi2oge8y6;!frie6;nd;ym2;an;cyc6sR;li5;atbox0ings;by,nk0r6;b0on7te6;nd0;!e07;c04dWge4nQpLrHsFtAu7yatull6;ah;nt7t6;h1oG;!ie;h8t6;e6orney;nda4;ie5le6;te;sis00tron6;aut,om0;chbis8isto7tis6;an,t;crU;hop;ost9p6;ari6rentiS;ti6;on;le;a9cest1im3nou8y6;bo6;dy;nc0;ly5rc6;hi5;mi8v6;entur0is1;er;ni7r6;al;str3;at1;or;counBquaintanArob9t6;ivi5or,re6;ss;st;at;ce;ta4;nt", "Adj|Noun": "true\xA60:16;a1Db17c0Ud0Re0Mf0Dg0Ah08i06ju05l02mWnUoSpNrIsBt7u4v1watershed;a1ision0Z;gabo4nilla,ria1;b0Vnt;ndergr1pstairs;adua14ou1;nd;a3e1oken,ri0;en,r1;min0rori13;boo,n;age,e5ilv0Flack,o3quat,ta2u1well;bordina0Xper5;b0Lndard;ciali0Yl1vereign;e,ve16;cret,n1ri0;ior;a4e2ou1ubbiL;nd,tiY;ar,bBl0Wnt0p1side11;resent0Vublican;ci0Qsh;a4eriodic0last0Zotenti0r1;emi2incip0o1;!fession0;er,um;rall4st,tie0U;ff1pposi0Hv0;ens0Oi0C;agg01ov1uts;el;a5e3iniatJo1;bi01der07r1;al,t0;di1tr0N;an,um;le,riG;attOi2u1;sh;ber0ght,qC;stice,veniT;de0mpressioYn1;cumbe0Edividu0no0Dsta0Eterim;alf,o1umdrum;bby,melF;en2old,ra1;ph0Bve;er0ious;a7e5i4l3u1;git03t1;ure;uid;ne;llow,m1;aFiL;ir,t,vo1;riOuriO;l3p00x1;c1ecutUpeV;ess;d1iK;er;ar2e1;mographUrivO;k,l2;hiGlassSo2rude,unn1;ing;m5n1operK;creCstitueOte2vertab1;le;mpor1nt;ary;ic,m2p1;anion,lex;er2u1;ni8;ci0;al;e5lank,o4r1;i2u1;te;ef;ttom,urgeois;st;cadem9d6l2ntarct9r1;ab,ct8;e3tern1;at1;ive;rt;oles1ult;ce1;nt;ic", "Adj|Past": "true\xA60:4Q;1:4C;2:4H;3:4E;a44b3Tc36d2Je29f20g1Wh1Si1Jj1Gkno1Fl1Am15n12o0Xp0Mqu0Kr08sLtEuAv9w4yellow0;a7ea6o4rinkl0;r4u3Y;n,ri0;k31th3;rp0sh0tZ;ari0e1O;n5p4s0;d1li1Rset;cov3derstood,i4;fi0t0;a8e3Rhr7i6ouTr4urn0wi4C;a4imm0ou2G;ck0in0pp0;ed,r0;eat2Qi37;m0nn0r4;get0ni2T;aOcKeIhGimFm0Hoak0pDt7u4;bsid3Ogge44s4;pe4ta2Y;ct0nd0;a8e7i2Eok0r5u4;ff0mp0nn0;ength2Hip4;ed,p0;am0reotyp0;in0t0;eci4ik0oH;al3Efi0;pRul1;a4ock0ut;d0r0;a4c1Jle2t31;l0s3Ut0;a6or5r4;at4e25;ch0;r0tt3;t4ut0;is2Mur1;aEe5o4;tt0;cAdJf2Bg9je2l8m0Knew0p7qu6s4;eTpe2t4;or0ri2;e3Dir0;e1lac0;at0e2Q;i0Rul1;eiv0o4ycl0;mme2Lrd0v3;in0lli0ti2A;a4ot0;li28;aCer30iBlAo9r5u4;mp0zzl0;e6i2Oo4;ce2Fd4lo1Anou30pos0te2v0;uc0;fe1CocCp0Iss0;i2Kli1L;ann0e2CuS;ck0erc0ss0;ck0i2Hr4st0;allLk0;bse7c6pp13rgan2Dver4;lo4whelm0;ok0;cupi0;rv0;aJe5o4;t0uri1A;ed0gle2;a6e5ix0o4ut0ys1N;di1Nt15u26;as0Clt0;n4rk0;ag0ufact0A;e6i5o4;ad0ck0st,v0;cens0m04st0;ft,v4;el0;tt0wn;a5o15u4;dg0s1B;gg0;llumSmpAn4sol1;br0cre1Ldebt0f8jZspir0t5v4;it0olv0;e4ox0Y;gr1n4re23;d0si15;e2l1o1Wuri1;li0o01r4;ov0;a6e1o4um03;ok0r4;ri0Z;mm3rm0;i6r5u4;a1Bid0;a0Ui0Rown;ft0;aAe9i8l6oc0Ir4;a4i0oz0Y;ctHg19m0;avo0Ju4;st3;ni08tt0x0;ar0;d0il0sc4;in1;dCl1mBn9quipp0s8x4;agger1c6p4te0T;a0Se4os0;ct0rie1D;it0;cap0tabliZ;cha0XgFha1As4;ur0;a0Zbarra0N;i0Buc1;aMeDi5r4;a01i0;gni08miniSre2s4;a9c6grun0Ft4;o4re0Hu17;rt0;iplWou4;nt0r4;ag0;bl0;cBdRf9l8p7ra6t5v4;elop0ot0;ail0ermQ;ng0;re07;ay0ight0;e4in0o0M;rr0;ay0enTor1;m5t0z4;ed,zl0;ag0p4;en0;aPeLhIlHo9r6u4;lt4r0stom03;iv1;a5owd0u4;sh0;ck0mp0;d0loAm7n4ok0v3;centr1f5s4troC;id3olid1;us0;b5pl4;ic1;in0;r0ur0;assi9os0utt3;ar5i4;ll0;g0m0;lebr1n6r4;ti4;fi0;tralJ;g0lcul1;aDewild3iCl9o7r5urn4;ed,t;ok4uis0;en;il0r0t4und;tl0;e5i4;nd0;ss0;as0;ffl0k0laMs0tt3;bPcNdKfIg0lFmaz0nDppBrm0ss9u5wa4;rd0;g5thor4;iz0;me4;nt0;o6u4;m0r0;li0re4;ci1;im1ticip1;at0;a5leg0t3;er0;rm0;fe2;ct0;ju5o7va4;nc0;st0;ce4knowledg0;pt0;and5so4;rb0;on0;ed", Singular: "true\xA60:5J;1:5H;2:4W;3:4S;4:52;5:57;6:5L;7:56;8:5B;a52b4Lc3Nd35e2Xf2Og2Jh28in24j23k22l1Um1Ln1Ho1Bp0Rqu0Qr0FsZtMuHvCw9x r58yo yo;a9ha3Po3Q;f3i4Rt0Gy9;! arou39;arCeAideo ga2Qo9;cabu4Jl5C;gOr9t;di4Zt1Y;iety,ni4P;nBp30rAs 9;do43s5E;bani1in0;coordinat3Ader9;estima1to24we41; rex,aKeJhHiFoErBuAv9;! show;m2On2rntLto1D;agedy,ib9o4E;e,u9;n0ta46;ni1p2rq3L;c,er,m9;etF;ing9ree26;!y;am,mp3F;ct2le6x return;aNcMeKhor4QiJkHoGpin off,tDuBy9;ll9ner7st4T;ab2X;b9i1n28per bowl,rro1X;st3Ltot0;atAipe2Go1Lrate7udent9;! lo0I;i39u1;ft ser4Lmeo1I;elet5i9;ll,r3V;b38gn2Tte;ab2Jc9min3B;t,urity gua2N;e6ho2Y;bbatic0la3Jndwi0Qpi5;av5eDhetor2iAo9;de6om,w;tAv9;erb2C;e,u0;bDcBf9publ2r10spi1;er9orm3;e6r0;i9ord label;p2Ht0;a1u46;estion mark,ot2F;aPeMhoLiIlGoErAu9yram1F;ddi3HpErpo1Js3J;eBo9;bl3Zs9;pe3Jta1;dic1Rmi1Fp1Qroga8ss relea1F;p9rt0;py;a9ebisci1;q2Dte;cn2eAg9;!gy;!r;ne call,tocoK;anut,dAr9t0yo1;cen3Jsp3K;al,est0;nop4rAt9;e,hog5;adi11i2V;atme0bj3FcBpia1rde0thers,utspok5ve9wn3;n,r9;ti0Pview;cuAe9;an;pi3;arBitAot9umb3;a2Fhi2R;e,ra1;cot2ra8;aFeCiAo9ur0;nopo4p18rni2Nsq1Rti36uld;c,li11n0As9tt5;chief,si34;dAnu,t9;al,i3;al,ic;gna1mm0nd15rsupi0te9yf4;ri0;aDegCiBu9;ddi1n9;ch;me,p09; Be0M;bor14y9; 9er;up;eyno1itt5;el4ourn0;cBdices,itia8ni25sAtel0Lvert9;eb1J;e28titu1;en8i2T;aIeEighDoAu9;man right,s22;me9rmoFsp1Ftb0K;! r9;un; scho0YriY;a9i1N;d9v5; start,pho9;ne;ndful,sh brown,v5ze;aBelat0Ilaci3r9ul4yp1S;an9enadi3id;a1Cd slam,ny;df4r9;l2ni1I;aGeti1HiFlu1oCrAun9;er0;ee market,i9onti3;ga1;l4ur9;so9;me;ePref4;br2mi4;conoFffi7gg,lecto0Rmbas1EnCpidem2s1Zth2venBxAyel9;id;ampZempl0Nte6;i19t;er7terp9;ri9;se;my;eLiEoBr9ump tru0U;agonf4i9;er,ve thru;cAg7i4or,ssi3wn9;side;to0EumenE;aEgniDnn3sAvide9;nd;conte6incen8p9tri11;osi9;ti0C;ta0H;le0X;athBcAf9ni0terre6;ault 05err0;al,im0;!b9;ed;aWeThMiLlJoDr9;edit caBuc9;ib9;le;rd;efficDke,lCmmuniqLnsApi3rr0t0Xus9yo1;in;erv9uI;ato02;ic,lQ;ie6;er7i9oth;e6n2;ty,vil wM;aDeqCick5ocoBr9;istmas car9ysanthemum;ol;la1;ue;ndeli3racteri9;st2;iAllEr9;e0tifica1;liZ;hi3nFpErCt9ucus;erpi9hedr0;ll9;ar;!bohyd9ri3;ra1;it0;aAe,nib0t9;on;l,ry;aMeLiop2leJoHrDu9;nny,r9tterf4;g9i0;la9;ry;eakAi9;ck;fa9throB;st;dy,ro9wl;ugh;mi9;sh;an,l4;nkiArri3;er;ng;cSdMlInFppeti1rDsBtt2utop9;sy;ic;ce6pe9;ct;r9sen0;ay;ecAoma4tiA;ly;do1;i5l9;er7y;gy;en; hominDjAvan9;tage;ec8;ti9;ve;em;cCeAqui9;tt0;ta1;te;iAru0;al;de6;nt", "Person|Noun": "true\xA6a0Eb07c03dWeUfQgOhLjHkiGlFmCnBolive,p7r4s3trini06v1wa0;ng,rd,tts;an,enus,iol0;a,et;ky,onPumm09;ay,e1o0uby;bin,d,se;ed,x;a2e1o0;l,tt04;aLnJ;dYge,tR;at,orm;a0eloW;t0x,ya;!s;a9eo,iH;ng,tP;a2e1o0;lGy;an,w3;de,smi4y;a0erb,iOolBuntR;ll,z0;el;ail,e0iLuy;ne;a1ern,i0lo;elds,nn;ith,n0;ny;a0dEmir,ula,ve;rl;a4e3i1j,ol0;ly;ck,x0;ie;an,ja;i0wn;sy;am,h0liff,rystal;a0in,ristian;mbers,ri0;ty;a4e3i2o,r0ud;an0ook;dy;ll;nedict,rg;k0nks;er;l0rt;fredo,ma", "Actor|Verb": "true\xA6aCb8c5doctor,engineAfool,g3host,judge,m2nerd,p1recruit,scout,ushAvolunteAwi0;mp,tneA;arent,ilot;an,ime;eek,oof,r0uide;adu8oom;ha1o0;ach,nscript,ok;mpion,uffeur;o2u0;lly,tch0;er;ss;ddi1ffili0rchite1;ate;ct", MaleName: "true\xA60:H6;1:FZ;2:DS;3:GQ;4:CZ;5:FV;6:GM;7:FP;8:GW;9:ET;A:C2;B:GD;aF8bE1cCQdBMeASfA1g8Yh88i7Uj6Sk6Bl5Mm48n3So3Ip33qu31r26s1Et0Ru0Ov0CwTxSyHzC;aCor0;cChC1karia,nAT;!hDkC;!aF6;!ar7CeF5;aJevgenBSoEuC;en,rFVsCu3FvEF;if,uf;nDs6OusC;ouf,s6N;aCg;s,tC;an,h0;hli,nCrosE1ss09;is,nC;!iBU;avi2ho5;aPeNiDoCyaEL;jcieBJlfgang,odrFutR;lFnC;f8TsC;lCt1;ow;bGey,frEhe4QlC;aE5iCy;am,e,s;ed8iC;d,ed;eAur;i,ndeD2rn2sC;!l9t1;lDyC;l1ne;lDtC;!er;aCHy;aKernDAiFladDoC;jteB0lodymyr;!iC;mFQsDB;cFha0ktBZnceDrgCOvC;a0ek;!nC;t,zo;!e4StBV;lCnC7sily;!entC;in9J;ghE2lCm70nax,ri,sm0;riCyss87;ch,k;aWeRhNiLoGrEuDyC;!l2roEDs1;n6r6E;avD0eCist0oy,um0;ntCRvBKy;bFdAWmCny;!asDmCoharu;aFFie,y;!z;iA6y;mCt4;!my,othy;adEeoDia0SomC;!as;!dor91;!de4;dFrC;enBKrC;anBJeCy;ll,nBI;!dy;dgh,ha,iCnn2req,tsu5V;cDAka;aYcotWeThPiMlobod0oKpenc2tEurDvenAEyCzym1;ed,lvest2;aj,e9V;anFeDuC;!aA;fan17phEQvCwaA;e77ie;!islaCl9;v,w;lom1rBuC;leymaDHta;dDgmu9UlCm1yabonga;as,v8B;!dhart8Yn9;aEeClo75;lCrm0;d1t1;h9Jne,qu1Jun,wn,yne;aDbastiEDk2Yl5Mpp,rgCth,ymoCU;e1Dio;m4n;!tC;!ie,y;eDPlFmEnCq67tosCMul;dCj2UtiA5;e01ro;!iATkeB6mC4u5;!ik,vato9K;aZeUheC8iRoGuDyC;an,ou;b99dDf4peAssC;!elEG;ol00y;an,bLc7MdJel,geIh0lHmGnEry,sDyC;!ce;ar7Ocoe,s;!aCnBU;ld,n;an,eo;a7Ef;l7Jr;e3Eg2n9olfo,riC;go;bBNeDH;cCl9;ar87c86h54kCo;!ey,ie,y;cFeA3gDid,ubByCza;an8Ln06;g85iC;naC6s;ep;ch8Kfa5hHin2je8HlGmFndEoHpha5sDul,wi36yC;an,mo8O;h9Im4;alDSol3O;iD0on;f,ph;ul;e9CinC;cy,t1;aOeLhilJiFrCyoG;aDeC;m,st1;ka85v2O;eDoC;tr;r8GtC;er,ro;!ipCl6H;!p6U;dCLrcy,tC;ar,e9JrC;!o7;b9Udra8So9UscAHtri62ulCv8I;!ie,o7;ctav6Ji2lImHndrBRrGsDtCum6wB;is,to;aDc6k6m0vCwaBE;al79;ma;i,vR;ar,er;aDeksandr,ivC;er,i2;f,v;aNeLguyBiFoCu3O;aDel,j4l0ma0rC;beAm0;h,m;cFels,g5i9EkDlC;es,s;!au,h96l78olaC;!i,y;hCkCol76;ol75;al,d,il,ls1vC;ilAF;hom,tC;e,hC;anCy;!a5i5;aYeViLoGuDyC;l4Nr1;hamDr84staC;fa,p6E;ed,mG;di10e,hamEis4JntDritz,sCussa;es,he;e,y;ad,ed,mC;ad,ed;cGgu5hai,kFlEnDtchC;!e8O;a9Pik;house,o7t1;ae73eC3ha8Iolaj;ah,hDkC;!ey,y;aDeC;al,l;el,l;hDlv3rC;le,ri8Ev4T;di,met;ay0c00gn4hWjd,ks2NlTmadZnSrKsXtDuric7VxC;imilBKwe8B;eHhEi69tCus,y69;!eo,hCia7;ew,i67;eDiC;as,eu,s;us,w;j,o;cHiGkFlEqu8Qsha83tCv3;iCy;!m,n;in,on;el,o7us;a6Yo7us;!elCin,o7us;!l8o;frAEi5Zny,u5;achDcoCik;lm;ai,y;amDdi,e5VmC;oud;adCm6W;ou;aulCi9P;ay;aWeOiMloyd,oJuDyC;le,nd1;cFdEiDkCth2uk;a7e;gi,s,z;ov7Cv6Hw6H;!as,iC;a6Een;g0nn52renDuCvA4we7D;!iS;!zo;am,n4oC;n5r;a9Yevi,la5KnHoFst2thaEvC;eCi;nte;bo;nCpo8V;!a82el,id;!nC;aAy;mEnd1rDsz73urenCwr6K;ce,t;ry,s;ar,beAont;aOeIhalHiFla4onr63rDu5SylC;e,s;istCzysztof;i0oph2;er0ngsl9p,rC;ilA9k,ollos;ed,id;en0iGnDrmCv4Z;it;!dDnCt1;e2Ny;ri4Z;r,th;cp2j4mEna8BrDsp6them,uC;ri;im,l;al,il;a03eXiVoFuC;an,lCst3;en,iC;an,en,o,us;aQeOhKkub4AnIrGsDzC;ef;eDhCi9Wue;!ua;!f,ph;dCge;i,on;!aCny;h,s,th6J;anDnC;!ath6Hie,n72;!nC;!es;!l,sCy;ph;o,qu3;an,mC;!i,m6V;d,ffFns,rCs4;a7JemDmai7QoCry;me,ni1H;i9Dy;!e73rC;ey,y;cKdBkImHrEsDvi2yC;dBs1;on,p2;ed,oDrCv67;e6Qod;d,s61;al,es5Wis1;a,e,oCub;b,v;ob,qu13;aTbNchiMgLke53lija,nuKonut,rIsEtCv0;ai,suC;ki;aDha0i8XmaCsac;el,il;ac,iaC;h,s;a,vinCw3;!g;k,nngu6X;nac1Xor;ka;ai,rahC;im;aReLoIuCyd6;beAgGmFsC;eyDsC;a3e3;in,n;ber5W;h,o;m2raDsse3wC;a5Pie;c49t1K;a0Qct3XiGnDrC;beAman08;dr7VrC;iCy2N;!k,q1R;n0Tt3S;bKlJmza,nIo,rEsDyC;a5KdB;an,s0;lEo67r2IuCv9;hi5Hki,tC;a,o;an,ey;k,s;!im;ib;a08e00iUlenToQrMuCyorgy;iHnFsC;!taC;f,vC;!e,o;n6tC;er,h2;do,lC;herDlC;auCerQ;me;aEegCov2;!g,orC;!io,y;dy,h7C;dfr9nza3XrDttfC;ri6C;an,d47;!n;acoGlEno,oCuseppe;rgiCvan6O;!o,s;be6Ies,lC;es;mo;oFrC;aDha4HrC;it,y;ld,rd8;ffErgC;!e7iCy;!os;!r9;bElBrCv3;eCla1Nr4Hth,y;th;e,rC;e3YielC;!i4;aXeSiQlOorrest,rCyod2E;aHedFiC;edDtC;s,z;ri18;!d42eri11riC;ck,k;nCs2;cEkC;ie,lC;in,yn;esLisC;!co,z3M;etch2oC;ri0yd;d5lConn;ip;deriFliEng,rC;dinaCg4nan0B;nd8;pe,x;co;bCdi,hd;iEriC;ce,zC;io;an,en,o;benez2dZfrYit0lTmMnJo3rFsteb0th0ugenEvCymBzra;an,eCge4D;ns,re3K;!e;gi,iDnCrol,v3w3;est8ie,st;cCk;!h,k;o0DriCzo;co,qC;ue;aHerGiDmC;aGe3A;lCrh0;!iC;a10o,s;s1y;nu5;beAd1iEliDm2t1viCwood;n,s;ot28s;!as,j5Hot,sC;ha;a3en;!dGg6mFoDua2QwC;a2Pin;arC;do;oZuZ;ie;a04eTiOmitrNoFrag0uEwDylC;an,l0;ay3Hig4D;a3Gdl9nc0st3;minFnDri0ugCvydGy2S;!lF;!a36nCov0;e1Eie,y;go,iDykC;as;cCk;!k;i,y;armuFetDll1mitri7neCon,rk;sh;er,m6riC;ch;id;andLepak,j0lbeAmetri4nIon,rGsEvDwCxt2;ay30ey;en,in;hawn,moC;nd;ek,riC;ck;is,nC;is,y;rt;re;an,le,mKnIrEvC;e,iC;!d;en,iEne0PrCyl;eCin,yl;l45n;n,o,us;!iCny;el,lo;iCon;an,en,on;a0Fe0Ch03iar0lRoJrFuDyrC;il,us;rtC;!is;aEistC;iaCob12;no;ig;dy,lInErC;ey,neliCy;s,us;nEor,rDstaC;nt3;ad;or;by,e,in,l3t1;aHeEiCyde;fCnt,ve;fo0Xt1;menDt4;us;s,t;rFuDyC;!t1;dCs;e,io;enC;ce;aHeGrisC;!toC;phCs;!eC;!r;st2t;d,rCs;b5leC;s,y;cDdrCs6;ic;il;lHmFrC;ey,lDroCy;ll;!o7t1;er1iC;lo;!eb,v3;a09eZiVjorn,laUoSrEuCyr1;ddy,rtKst2;er;aKeFiEuDyC;an,ce,on;ce,no;an,ce;nDtC;!t;dDtC;!on;an,on;dFnC;dDisC;lav;en,on;!foOl9y;bby,gd0rCyd;is;i0Lke;bElDshC;al;al,lL;ek;nIrCshoi;at,nEtC;!raC;m,nd;aDhaCie;rd;rd8;!iDjam3nCs1;ie,y;to;kaMlazs,nHrC;n9rDtC;!holomew;eCy;tt;ey;dCeD;ar,iC;le;ar1Nb1Dd16fon15gust3hm12i0Zja0Yl0Bm07nTputsiSrGsaFugustEveDyCziz;a0kh0;ry;o,us;hi;aMchiKiJjun,mHnEon,tCy0;em,hCie,ur8;ur;aDoC;!ld;ud,v;aCin;an,nd8;!el,ki;baCe;ld;ta;aq;aMdHgel8tCw6;hoFoC;iDnC;!i8y;ne;ny;er7rCy;eDzC;ej;!as,i,j,s,w;!s;s,tolC;iCy;!y;ar,iEmaCos;nu5r;el;ne,r,t;aVbSdBeJfHiGl01onFphonsEt1vC;aPin;on;e,o;so,zo;!sR;!onZrC;ed;c,jaHksFssaHxC;!andC;er,rC;e,os,u;andCei;ar,er,r;ndC;ro;en;eDrecC;ht;rt8;dd3in,n,sC;taC;ir;ni;dDm6;ar;an,en;ad,eC;d,t;in;so;aGi,olErDvC;ik;ian8;f8ph;!o;mCn;!a;dGeFraDuC;!bakr,lfazl;hCm;am;!l;allFel,oulaye,ulC;!lDrahm0;an;ah,o;ah;av,on", Uncountable: "true\xA60:2E;1:2L;2:33;a2Ub2Lc29d22e1Rf1Ng1Eh16i11j0Yk0Wl0Rm0Hn0Do0Cp03rZsLt9uran2Jv7w3you gu0E;a5his17i4oo3;d,l;ldlife,ne;rm8t1;apor,ernacul29i3;neg28ol1Otae;eDhBiAo8r4un3yranny;a,gst1B;aff2Oea1Ko4ue nor3;th;o08u3;bleshoot2Ose1Tt;night,othpas1Vwn3;foEsfoE;me off,n;er3und1;e,mod2S;a,nnis;aDcCeBhAi9ki8o7p6t4u3weepstak0;g1Unshi2Hshi;ati08e3;am,el;ace2Keci0;ap,cc1meth2C;n,ttl0;lk;eep,ingl0or1C;lf,na1Gri0;ene1Kisso1C;d0Wfe2l4nd,t3;i0Iurn;m1Ut;abi0e4ic3;e,ke15;c3i01laxa11search;ogni10rea10;a9e8hys7luto,o5re3ut2;amble,mis0s3ten20;en1Zs0L;l3rk;i28l0EyH; 16i28;a24tr0F;nt3ti0M;i0s;bstetri24vercrowd1Qxyg09;a5e4owada3utella;ys;ptu1Ows;il poliZtional securi2;aAe8o5u3;m3s1H;ps;n3o1K;ey,o3;gamy;a3cha0Elancholy,rchandi1Htallurgy;sl0t;chine3g1Aj1Hrs,thema1Q; learn1Cry;aught1e6i5ogi4u3;ck,g12;c,s1M;ce,ghtn18nguis1LteratWv1;ath1isVss;ara0EindergartPn3;icke0Aowled0Y;e3upit1;a3llyfiGwel0G;ns;ce,gnor6mp5n3;forma00ter3;net,sta07;atiSort3rov;an18;a7e6isto09o3ung1;ckey,mework,ne4o3rseradi8spitali2use arrest;ky;s2y;adquarteXre;ir,libut,ppiHs3;hi3te;sh;ene8l6o5r3um,ymnas11;a3eZ;niUss;lf,re;ut3yce0F;en; 3ti0W;edit0Hpo3;ol;aNicFlour,o4urnit3;ure;od,rgive3uri1wl;ness;arCcono0LducaBlectr9n7quip8thi0Pvery6x3;ist4per3;ti0B;en0J;body,o08th07;joy3tertain3;ment;ici2o3;ni0H;tiS;nings,th;emi02i6o4raugh3ynas2;ts;pe,wnstai3;rs;abet0ce,s3;honZrepu3;te;aDelciChAivi07l8o3urrency;al,ld w6mmenta5n3ral,ttIuscoB;fusiHt 3;ed;ry;ar;assi01oth0;es;aos,e3;eMwK;us;d,rO;a8i6lood,owlHread5u3;ntGtt1;er;!th;lliarJs3;on;g3ss;ga3;ge;cKdviJeroGirFmBn6ppeal court,r4spi3thleL;rin;ithmet3sen3;ic;i6y3;o4th3;ing;ne;se;en5n3;es2;ty;ds;craft;bi8d3nau7;yna3;mi6;ce;id,ous3;ti3;cs", Infinitive: "true\xA60:9G;1:9T;2:AD;3:90;4:9Z;5:84;6:AH;7:A9;8:92;9:A0;A:AG;B:AI;C:9V;D:8R;E:8O;F:97;G:6H;H:7D;a94b8Hc7Jd68e4Zf4Mg4Gh4Ai3Qj3Nk3Kl3Bm34nou48o2Vp2Equ2Dr1Es0CtZuTvRwI;aOeNiLors5rI;eJiI;ng,te;ak,st3;d5e8TthI;draw,er;a2d,ep;i2ke,nIrn;d1t;aIie;liADniAry;nJpI;ho8Llift;cov1dJear8Hfound8DlIplug,rav82tie,ve94;eaAo3X;erIo;cut,go,staAFvalA3w2G;aSeQhNoMrIu73;aIe72;ffi3Smp3nsI;aBfo7CpI;i8oD;pp3ugh5;aJiJrIwaD;eat5i2;nk;aImA0;ch,se;ck3ilor,keImp1r8L;! paD;a0Ic0He0Fh0Bi0Al08mugg3n07o05p02qu01tUuLwI;aJeeIim;p,t5;ll7Wy;bNccMffLggeCmmKppJrI;mouFpa6Zvi2;o0re6Y;ari0on;er,i4;e7Numb;li9KmJsiIveD;de,st;er9it;aMe8MiKrI;ang3eIi2;ng27w;fIng;f5le;b,gg1rI;t3ve;a4AiA;a4UeJit,l7DoI;il,of;ak,nd;lIot7Kw;icEve;atGeak,i0O;aIi6;m,y;ft,ng,t;aKi6CoJriIun;nk,v6Q;ot,rt5;ke,rp5tt1;eIll,nd,que8Gv1w;!k,m;aven9ul8W;dd5tis1Iy;a0FeKiJoI;am,t,ut;d,p5;a0Ab08c06d05f01group,hea00iZjoi4lXmWnVpTq3MsOtMup,vI;amp,eJiIo3B;sEve;l,rI;e,t;i8rI;ie2ofE;eLiKpo8PtIurfa4;o24rI;aHiBuctu8;de,gn,st;mb3nt;el,hra0lIreseF;a4e71;d1ew,o07;aHe3Fo2;a7eFiIo6Jy;e2nq41ve;mbur0nf38;r0t;inKleBocus,rJuI;el,rbiA;aBeA;an4e;aBu4;ei2k8Bla43oIyc3;gni39nci3up,v1;oot,uI;ff;ct,d,liIp;se,ze;tt3viA;aAenGit,o7;aWerUinpoiFlumm1LoTrLuI;b47ke,niArIt;poDsuI;aFe;eMoI;cKd,fe4XhibEmo7noJpo0sp1tru6vI;e,i6o5L;un4;la3Nu8;aGclu6dJf1occupy,sup0JvI;a6BeF;etermi4TiB;aGllu7rtr5Ksse4Q;cei2fo4NiAmea7plex,sIva6;eve8iCua6;mp1rItrol,ve;a6It6E;bOccuNmEpMutLverIwe;l07sJtu6Yu0wI;helm;ee,h1F;gr5Cnu2Cpa4;era7i4Ipo0;py,r;ey,seItaH;r2ss;aMe0ViJoIultiply;leCu6Pw;micJnIspla4;ce,g3us;!k;iIke,na9;m,ntaH;aPeLiIo0u3N;ke,ng1quIv5;eIi6S;fy;aKnIss5;d,gI;th5;rn,ve;ng2Gu1N;eep,idnJnI;e4Cow;ap;oHuI;gg3xtaI;po0;gno8mVnIrk;cTdRfQgeChPitia7ju8q1CsNtKun6EvI;a6eIo11;nt,rt,st;erJimi6BoxiPrI;odu4u6;aBn,pr03ru6C;iCpi8tIu8;all,il,ruB;abEibE;eCo3Eu0;iIul9;ca7;i7lu6;b5Xmer0pI;aLer4Uin9ly,oJrI;e3Ais6Bo2;rt,se,veI;riA;le,rt;aLeKiIoiCuD;de,jaInd1;ck;ar,iT;mp1ng,pp5raIve;ng5Mss;ath1et,iMle27oLrI;aJeIow;et;b,pp3ze;!ve5A;gg3ve;aTer45i5RlSorMrJuI;lf4Cndrai0r48;eJiIolic;ght5;e0Qsh5;b3XeLfeEgJsI;a3Dee;eIi2;!t;clo0go,shIwa4Z;ad3F;att1ee,i36;lt1st5;a0OdEl0Mm0FnXquip,rWsVtGvTxI;aRcPeDhOiNpJtIu6;ing0Yol;eKi8lIo0un9;aHoI;it,re;ct,di7l;st,t;a3oDu3B;e30lI;a10u6;lt,mi28;alua7oI;ke,l2;chew,pou0tab19;a0u4U;aYcVdTfSgQhan4joy,lPqOrNsuMtKvI;e0YisI;a9i50;er,i4rI;aHenGuC;e,re;iGol0F;ui8;ar9iC;a9eIra2ulf;nd1;or4;ang1oIu8;r0w;irc3lo0ou0ErJuI;mb1;oaGy4D;b3ct;bKer9pI;hasiIow1;ze;aKody,rI;a4oiI;d1l;lm,rk;ap0eBuI;ci40de;rIt;ma0Rn;a0Re04iKo,rIwind3;aw,ed9oI;wn;agno0e,ff1g,mi2Kne,sLvI;eIul9;rIst;ge,t;aWbVcQlod9mant3pNru3TsMtI;iIoDu37;lJngI;uiA;!l;ol2ua6;eJlIo0ro2;a4ea0;n0r0;a2Xe36lKoIu0S;uIv1;ra9;aIo0;im;a3Kur0;b3rm;af5b01cVduBep5fUliTmQnOpMrLsiCtaGvI;eIol2;lop;ch;a20i2;aDiBloIoD;re,y;oIy;te,un4;eJoI;liA;an;mEv1;a4i0Ao06raud,y;ei2iMla8oKrI;ee,yI;!pt;de,mIup3;missi34po0;de,ma7ph1;aJrief,uI;g,nk;rk;mp5rk5uF;a0Dea0h0Ai09l08oKrIurta1G;a2ea7ipp3uI;mb3;ales4e04habEinci6ll03m00nIrro6;cXdUfQju8no7qu1sLtKvI;eIin4;ne,r9y;aHin2Bribu7;er2iLoli2Epi8tJuI;lt,me;itu7raH;in;d1st;eKiJoIroFu0;rm;de,gu8rm;ss;eJoI;ne;mn,n0;eIlu6ur;al,i2;buCe,men4pI;eIi3ly;l,te;eBi6u6;r4xiC;ean0iT;rcumveFte;eJirp,oI;o0p;riAw;ncIre5t1ulk;el;a02eSi6lQoPrKuI;iXrIy;st,y;aLeaKiJoad5;en;ng;stfeLtX;ke;il,l11mba0WrrMth1;eIow;ed;!coQfrie1LgPhMliLqueaKstJtrIwild1;ay;ow;th;e2tt3;a2eJoI;ld;ad;!in,ui3;me;bysEckfi8ff3tI;he;b15c0Rd0Iff0Ggree,l0Cm09n03ppZrXsQttOuMvJwaE;it;eDoI;id;rt;gIto0X;meF;aIeCraB;ch,in;pi8sJtoI;niA;aKeIi04u8;mb3rt,ss;le;il;re;g0Hi0ou0rI;an9i2;eaKly,oiFrI;ai0o2;nt;r,se;aMi0GnJtI;icipa7;eJoIul;un4y;al;ly0;aJu0;se;lga08ze;iKlI;e9oIu6;t,w;gn;ix,oI;rd;a03jNmiKoJsoI;rb;pt,rn;niIt;st1;er;ouJuC;st;rn;cLhie2knowled9quiItiva7;es4re;ce;ge;eQliOoKrJusI;e,tom;ue;mIst;moJpI;any,liA;da7;ma7;te;pt;andPduBet,i6oKsI;coKol2;ve;liArt,uI;nd;sh;de;ct;on", Person: "true\xA60:1Q;a29b1Zc1Md1Ee18f15g13h0Ri0Qj0Nk0Jl0Gm09n06o05p00rPsItCusain bolt,v9w4xzibit,y1;anni,oko on2uji,v1;an,es;en,o;a3ednesday adams,i2o1;lfram,o0Q;ll ferrell,z khalifa;lt disn1Qr1;hol,r0G;a2i1oltai06;n dies0Zrginia wo17;lentino rossi,n goG;a4h3i2ripp,u1yra banks;lZpac shakur;ger woods,mba07;eresa may,or;kashi,t1ylor;um,ya1B;a5carlett johanss0h4i3lobodan milosevic,no2ocr1Lpider1uperm0Fwami; m0Em0E;op dogg,w whi1H;egfried,nbad;akespeaTerlock holm1Sia labeouf;ddam hussa16nt1;a cla11ig9;aAe6i5o3u1za;mi,n dmc,paul,sh limbau1;gh;bin hood,d stew16nald1thko;in0Mo;han0Yngo starr,valdo;ese witherspo0i1mbrandt;ll2nh1;old;ey,y;chmaninoff,ffi,iJshid,y roma1H;a4e3i2la16o1uff daddy;cahont0Ie;lar,p19;le,rZ;lm17ris hilt0;leg,prah winfr0Sra;a2e1iles cra1Bostradam0J; yo,l5tt06wmQ;pole0s;a5e4i2o1ubar03;by,lie5net,rriss0N;randa ju1tt romn0M;ly;rl0GssiaB;cklemo1rkov,s0ta hari,ya angelou;re;ady gaga,e1ibera0Pu;bron jam0Xch wale1e;sa;anye west,e3i1obe bryant;d cudi,efer suther1;la0P;ats,sha;a2effers0fk,k rowling,rr tolki1;en;ck the ripp0Mwaharlal nehru,y z;liTnez,ron m7;a7e5i3u1;lk hog5mphrey1sa01;! bog05;l1tl0H;de; m1dwig,nry 4;an;ile selassFlle ber4m3rrison1;! 1;ford;id,mo09;ry;ast0iannis,o1;odwPtye;ergus0lorence nightinga08r1;an1ederic chopN;s,z;ff5m2nya,ustaXzeki1;el;eril lagasse,i1;le zatop1nem;ek;ie;a6e4i2octor w1rake;ho;ck w1ego maradoC;olf;g1mi lovaOnzel washingt0;as;l1nHrth vadR;ai lNt0;a8h5lint0o1thulhu;n1olio;an,fuci1;us;on;aucKop2ristian baMy1;na;in;millo,ptain beefhe4r1;dinal wols2son1;! palmF;ey;art;a8e5hatt,i3oHro1;ck,n1;te;ll g1ng crosby;atB;ck,nazir bhut2rtil,yon1;ce;to;nksy,rack ob1;ama;l 6r3shton kutch2vril lavig8yn ra1;nd;er;chimed2istot1;le;es;capo2paci1;no;ne", Adjective: "true\xA60:AI;1:BS;2:BI;3:BA;4:A8;5:84;6:AV;7:AN;8:AF;9:7H;A:BQ;B:AY;C:BC;D:BH;E:9Y;aA2b9Ec8Fd7We79f6Ng6Eh61i4Xj4Wk4Tl4Im41n3Po36p2Oquart7Pr2Ds1Dt14uSvOwFye29;aMeKhIiHoF;man5oFrth7G;dADzy;despreB1n w97s86;acked1UoleF;!sa6;ather1PeFll o70ste1D;!k5;nt1Ist6Ate4;aHeGiFola5T;bBUce versa,gi3Lle;ng67rsa5R;ca1gBSluAV;lt0PnLpHrGsFttermoBL;ef9Ku3;b96ge1; Hb32pGsFtiAH;ca6ide d4R;er,i85;f52to da2;a0Fbeco0Hc0Bd04e02f01gu1XheaBGiXkn4OmUnTopp06pRrNsJtHus0wF;aFiel3K;nt0rra0P;app0eXoF;ld,uS;eHi37o5ApGuF;perv06spec39;e1ok9O;en,ttl0;eFu5;cogn06gul2RlGqu84sF;erv0olv0;at0en33;aFrecede0E;id,rallel0;am0otic0;aFet;rri0tF;ch0;nFq26vers3;sur0terFv7U;eFrupt0;st0;air,inish0orese98;mploy0n7Ov97xpF;ect0lain0;eHisFocume01ue;clFput0;os0;cid0rF;!a8Scov9ha8Jlyi8nea8Gprivileg0sMwF;aFei9I;t9y;hGircumcFonvin2U;is0;aFeck0;lleng0rt0;b20ppea85ssuGttend0uthorF;iz0;mi8;i4Ara;aLeIhoHip 25oGrF;anspare1encha1i2;geth9leADp notch,rpB;rny,ugh6H;ena8DmpGrFs6U;r49tia4;eCo8P;leFst4M;nt0;a0Dc09e07h06i04ki03l01mug,nobbi4XoVpRqueami4XtKuFymb94;bHccinAi generis,pFr5;erFre7N;! dup9b,vi70;du0li7Lp6IsFurb7J;eq9Atanda9X;aKeJi16o2QrGubboFy4Q;rn;aightFin5GungS; fFfF;or7V;adfa9Pri6;lwa6Ftu82;arHeGir6NlendBot Fry;on;c3Qe1S;k5se; call0lImb9phistic16rHuFviV;ndFth1B;proof;dBry;dFub6; o2A;e60ipF;pe4shod;ll0n d7R;g2HnF;ceEg6ist9;am3Se9;co1Zem5lfFn6Are7; suf4Xi43;aGholFient3A;ar5;rlFt4A;et;cr0me,tisfac7F;aOeIheumatoBiGoF;bu8Ztt7Gy3;ghtFv3; 1Sf6X;cJdu8PlInown0pro69sGtF;ard0;is47oF;lu2na1;e1Suc45;alcit8Xe1ondi2;bBci3mpa1;aSePicayu7laOoNrGuF;bl7Tnjabi;eKiIoF;b7VfGmi49pFxi2M;er,ort81;a7uD;maFor,sti7va2;!ry;ciDexis0Ima2CpaB;in55puli8G;cBid;ac2Ynt 3IrFti2;ma40tFv7W;!i3Z;i2YrFss7R;anoBtF; 5XiF;al,s5V;bSffQkPld OnMrLth9utKverF;!aIbMdHhGni75seas,t,wF;ei74rou74;a63e7A;ue;ll;do1Ger,si6A;d3Qg2Aotu5Z; bFbFe on o7g3Uli7;oa80;fashion0school;!ay; gua7XbFha5Uli7;eat;eHligGsF;ce7er0So1C;at0;diFse;a1e1;aOeNiMoGuF;anc0de; moEnHrthFt6V;!eFwe7L;a7Krn;chaGdescri7Iprof30sF;top;la1;ght5;arby,cessa4ighbor5wlyw0xt;k0usiaFv3;ti8;aQeNiLoHuF;dIltiF;facet0p6;deHlGnFot,rbBst;ochro4Xth5;dy;rn,st;ddle ag0nF;dbloZi,or;ag9diocEga,naGrFtropolit4Q;e,ry;ci8;cIgenta,inHj0Fkeshift,mmGnFri4Oscu61ver18;da5Dy;ali4Lo4U;!stream;abEho;aOeLiIoFumberi8;ngFuti1R;stan3RtF;erm,i4H;ghtGteraF;l,ry,te;heart0wei5O;ft JgFss9th3;al,eFi0M;nda4;nguBps0te5;apGind5noF;wi8;ut;ad0itte4uniW;ce co0Hgno6Mll0Cm04nHpso 2UrF;a2releF;va1; ZaYcoWdReQfOgrNhibi4Ri05nMoLsHtFvalu5M;aAeF;nDrdepe2K;a7iGolFuboI;ub6ve1;de,gF;nifica1;rdi5N;a2er;own;eriIiLluenVrF;ar0eq5H;pt,rt;eHiGoFul1O;or;e,reA;fiFpe26termi5E;ni2;mpFnsideCrreA;le2;ccuCdeq5Ene,ppr4J;fFsitu,vitro;ro1;mJpF;arHeGl15oFrop9;li2r11;n2LrfeA;ti3;aGeFi18;d4BnD;tuE;egGiF;c0YteC;al,iF;tiF;ma2;ld;aOelNiLoFuma7;a4meInHrrGsFur5;ti6;if4E;e58o3U; ma3GsF;ick;ghfalut2HspF;an49;li00pf33;i4llow0ndGrdFtM; 05coEworki8;sy,y;aLener44iga3Blob3oKrGuF;il1Nng ho;aFea1Fizzl0;cGtF;ef2Vis;ef2U;ld3Aod;iFuc2D;nf2R;aVeSiQlOoJrF;aGeFil5ug3;q43tf2O;gFnt3S;i6ra1;lk13oHrF; keeps,eFge0Vm9tu41;g0Ei2Ds3R;liF;sh;ag4Mowe4uF;e1or45;e4nF;al,i2;d Gmini7rF;ti6ve1;up;bl0lDmIr Fst pac0ux;oGreacF;hi8;ff;ed,ili0R;aXfVlTmQnOqu3rMthere3veryday,xF;aApIquisi2traHuF;be48lF;ta1;!va2L;edRlF;icF;it;eAstF;whi6; Famor0ough,tiE;rou2sui2;erGiF;ne1;ge1;dFe2Aoq34;er5;ficF;ie1;g9sF;t,ygF;oi8;er;aWeMiHoGrFue;ea4owY;ci6mina1ne,r31ti8ubQ;dact2Jfficult,m,sGverF;ge1se;creGePjoi1paCtF;a1inA;et,te; Nadp0WceMfiLgeneCliJmuEpeIreliAsGvoF;id,ut;pFtitu2ul1L;eCoF;nde1;ca2ghF;tf13;a1ni2;as0;facto;i5ngero0I;ar0Ce09h07i06l05oOrIuF;rmudgeon5stoma4teF;sy;ly;aIeHu1EystalF; cleFli7;ar;epy;fFv17z0;ty;erUgTloSmPnGrpoCunterclVveFy;rt;cLdJgr21jIsHtrF;aFi2;dic0Yry;eq1Yta1;oi1ug3;escenFuN;di8;a1QeFiD;it0;atoDmensuCpF;ass1SulF;so4;ni3ss3;e1niza1;ci1J;ockwiD;rcumspeAvil;eFintzy;e4wy;leGrtaF;in;ba2;diac,ef00;a00ePiLliJoGrFuck nak0;and new,isk,on22;gGldface,naF; fi05fi05;us;nd,tF;he;gGpartisFzarE;an;tiF;me;autifOhiNlLnHsFyoN;iWtselF;li8;eGiFt;gn;aFfi03;th;at0oF;v0w;nd;ul;ckwards,rF;e,rT; priori,b13c0Zd0Tf0Ng0Ihe0Hl09mp6nt06pZrTsQttracti0MuLvIwF;aGkF;wa1B;ke,re;ant garGeraF;ge;de;diIsteEtF;heFoimmu7;nt07;re;to4;hGlFtu2;eep;en;bitIchiv3roHtF;ifiFsy;ci3;ga1;ra4;ry;pFt;aHetizi8rF;oprF;ia2;llFre1;ed,i8;ng;iquFsy;at0e;ed;cohKiJkaHl,oGriFterX;ght;ne,of;li7;ne;ke,ve;olF;ic;ad;ain07gressiIi6rF;eeF;ab6;le;ve;fGraB;id;ectGlF;ue1;ioF;na2; JaIeGvF;erD;pt,qF;ua2;ma1;hoc,infinitum;cuCquiGtu3u2;al;esce1;ra2;erSjeAlPoNrKsGuF;nda1;e1olu2trF;aAuD;se;te;eaGuF;pt;st;aFve;rd;aFe;ze;ct;ra1;nt", Pronoun: "true\xA6elle,h3i2me,she,th0us,we,you;e0ou;e,m,y;!l,t;e,im", Preposition: "true\xA6aPbMcLdKexcept,fIinGmid,notwithstandiWoDpXqua,sCt7u4v2w0;/o,hereSith0;! whHin,oW;ersus,i0;a,s a vis;n1p0;!on;like,til;h1ill,oward0;!s;an,ereby,r0;ough0u;!oM;ans,ince,o that,uch G;f1n0ut;!to;!f;! 0to;effect,part;or,r0;om;espite,own,u3;hez,irca;ar1e0oBy;sides,tween;ri7;bo8cross,ft7lo6m4propos,round,s1t0;!op;! 0;a whole,long 0;as;id0ong0;!st;ng;er;ut", SportsTeam: "true\xA60:18;1:1E;2:1D;3:14;a1Db15c0Sd0Kfc dallas,g0Ihouston 0Hindiana0Gjacksonville jagua0k0El0Am01new UoRpKqueens parkJreal salt lake,sBt6utah jazz,vancouver whitecaps,w4yW;ashington 4h10;natio1Mredski2wizar0W;ampa bay 7e6o4;ronto 4ttenham hotspur;blue ja0Mrapto0;nnessee tita2xasD;buccanee0ra0K;a8eattle 6porting kansas0Wt4; louis 4oke0V;c1Drams;marine0s4;eah13ounH;cramento Rn 4;antonio spu0diego 4francisco gJjose earthquak1;char08paB; ran07;a9h6ittsburgh 5ortland t4;imbe0rail blaze0;pirat1steele0;il4oenix su2;adelphia 4li1;eagl1philNunE;dr1;akland 4klahoma city thunder,rlando magic;athle0Lrai4;de0;england 8orleans 7york 4;g5je3knYme3red bul0Xy4;anke1;ian3;pelica2sain3;patrio3revolut4;ion;anchEeAi4ontreal impact;ami 8lwaukee b7nnesota 4;t5vi4;kings;imberwolv1wi2;rewe0uc0J;dolphi2heat,marli2;mphis grizz4ts;li1;a6eic5os angeles 4;clippe0dodFlaB;esterV; galaxy,ke0;ansas city 4nF;chiefs,roya0D; pace0polis col3;astr05dynamo,rocke3texa2;olden state warrio0reen bay pac4;ke0;allas 8e4i04od6;nver 6troit 4;lio2pisto2ti4;ge0;broncYnugge3;cowbo5maver4;icZ;ys;arEelLhAincinnati 8leveland 6ol4;orado r4umbus crew sc;api7ocki1;brow2cavalie0guar4in4;dia2;bengaVre4;ds;arlotte horAicago 4;b5cubs,fire,wh4;iteB;ea0ulQ;diff4olina panthe0; city;altimore Alackburn rove0oston 6rooklyn 4uffalo bilN;ne3;ts;cel5red4; sox;tics;rs;oriol1rave2;rizona Ast8tlanta 4;brav1falco2h4;awA;ns;es;on villa,r4;os;c6di4;amondbac4;ks;ardi4;na4;ls", Unit: "true\xA6a07b04cXdWexVfTgRhePinYjoule0BkMlJmDnan08oCp9quart0Bsq ft,t7volts,w6y2ze3\xB01\xB50;g,s;c,f,n;dVear1o0;ttR; 0s 0;old;att,b;erNon0;!ne02;ascals,e1i0;cXnt00;rcent,tJ;hms,unceY;/s,e4i0m\xB2,\xB2,\xB3;/h,cro2l0;e0liK;!\xB2;grLsR;gCtJ;it1u0;menQx;erPreP;b5elvins,ilo1m0notO;/h,ph,\xB2;!byGgrEmCs;ct0rtzL;aJogrC;allonJb0ig3rB;ps;a0emtEl oz,t4;hrenheit,radG;aby9;eci3m1;aratDe1m0oulombD;\xB2,\xB3;lsius,nti0;gr2lit1m0;et0;er8;am7;b1y0;te5;l,ps;c2tt0;os0;econd1;re0;!s", "Noun|Gerund": "true\xA60:3O;1:3M;2:3N;3:3D;4:32;5:2V;6:3E;7:3K;8:36;9:3J;A:3B;a3Pb37c2Jd27e23f1Vg1Sh1Mi1Ij1Gk1Dl18m13n11o0Wp0Pques0Sr0EsTtNunderMvKwFyDzB;eroi0oB;ni0o3P;aw2eB;ar2l3;aEed4hispe5i5oCrB;ap8est3i1;n0ErB;ki0r31;i1r2s9tc9;isualizi0oB;lunt1Vti0;stan4ta6;aFeDhin6iCraBy8;c6di0i2vel1M;mi0p8;aBs1;c9si0;l6n2s1;aUcReQhOiMkatKl2Wmo6nowJpeItFuCwB;ea5im37;b35f0FrB;fi0vB;e2Mi2J;aAoryt1KrCuB;d2KfS;etc9ugg3;l3n4;bCi0;ebBi0;oar4;gnBnAt1;a3i0;ip8oB;p8rte2u1;a1r27t1;hCo5reBulp1;a2Qe2;edu3oo3;i3yi0;aKeEi4oCuB;li0n2;oBwi0;fi0;aFcEhear7laxi0nDpor1sB;pon4tructB;r2Iu5;de5;or4yc3;di0so2;p8ti0;aFeacek20laEoCrBublis9;a1Teten4in1oces7;iso2siB;tio2;n2yi0;ckaAin1rB;ki0t1O;fEpeDrganiCvB;erco24ula1;si0zi0;ni0ra1;fe5;avi0QeBur7;gotia1twor6;aDeCi2oB;de3nito5;a2dita1e1ssaA;int0XnBrke1;ifUufactu5;aEeaDiBodAyi0;cen7f1mi1stB;e2i0;r2si0;n4ug9;iCnB;ea4it1;c6l3;ogAuB;dAgg3stif12;ci0llust0VmDnBro2;nova1sp0NterBven1;ac1vie02;agi2plo4;aDea1iCoBun1;l4w3;ki0ri0;nd3rB;roWvB;es1;aCene0Lli4rBui4;ee1ie0N;rde2the5;aHeGiDlCorBros1un4;e0Pmat1;ir1oo4;gh1lCnBs9;anZdi0;i0li0;e3nX;r0Zscina1;a1du01nCxB;erci7plo5;chan1di0ginB;ee5;aLeHiGoub1rCum8wB;el3;aDeCiB;bb3n6vi0;a0Qs7;wi0;rTscoDvi0;ba1coZlBvelo8;eCiB;ve5;ga1;nGti0;aVelebUhSlPoDrBur3yc3;aBos7yi0;f1w3;aLdi0lJmFnBo6pi0ve5;dDsCvinB;ci0;trBul1;uc1;muniDpB;lBo7;ai2;ca1;lBo5;ec1;c9ti0;ap8eaCimToBubT;ni0t9;ni0ri0;aBee5;n1t1;ra1;m8rCs1te5;ri0;vi0;aPeNitMlLoGrDuB;dge1il4llBr8;yi0;an4eat9oadB;cas1;di0;a1mEokB;i0kB;ee8;pi0;bi0;es7oa1;c9i0;gin2lonAt1;gi0;bysit1c6ki0tt3;li0;ki0;bando2cGdverti7gi0pproac9rgDssuCtB;trac1;mi0;ui0;hi0;si0;coun1ti0;ti0;ni0;ng", PhrasalVerb: "true\xA60:92;1:96;2:8H;3:8V;4:8A;5:83;6:85;7:98;8:90;9:8G;A:8X;B:8R;C:8U;D:8S;E:70;F:97;G:8Y;H:81;I:7H;J:79;a9Fb7Uc6Rd6Le6Jf5Ig50h4Biron0j47k40l3Em31n2Yo2Wp2Cquiet Hr1Xs0KtZuXvacuu6QwNyammerBzK;ero Dip LonK;e0k0;by,ov9up;aQeMhLiKor0Mrit19;mp0n3Fpe0r5s5;ackAeel Di0S;aLiKn33;gh 3Wrd0;n Dr K;do1in,oJ;it 79k5lk Lrm 69sh Kt83v60;aw3do1o7up;aw3in,oC;rgeBsK;e 2herE;a00eYhViRoQrMuKypP;ckErn K;do1in,oJup;aLiKot0y 30;ckl7Zp F;ck HdK;e 5Y;n7Wp 3Es5K;ck MdLe Kghten 6me0p o0Rre0;aw3ba4do1in,up;e Iy 2;by,oG;ink Lrow K;aw3ba4in,up;ba4ov9up;aKe 77ll62;m 2r 5M;ckBke Llk K;ov9shit,u47;aKba4do1in,leave,o4Dup;ba4ft9pa69w3;a0Vc0Te0Mh0Ii0Fl09m08n07o06p01quar5GtQuOwK;earMiK;ngLtch K;aw3ba4o8K; by;cKi6Bm 2ss0;k 64;aReQiPoNrKud35;aigh2Det75iK;ke 7Sng K;al6Yup;p Krm2F;by,in,oG;c3Ln3Lr 2tc4O;p F;c3Jmp0nd LrKveAy 2O;e Ht 2L;ba4do1up;ar3GeNiMlLrKurB;ead0ingBuc5;a49it 6H;c5ll o3Cn 2;ak Fe1Xll0;a3Bber 2rt0und like;ap 5Vow Duggl5;ash 6Noke0;eep NiKow 6;cLp K;o6Dup;e 68;in,oK;ff,v9;de19gn 4NnKt 6Gz5;gKkE; al6Ale0;aMoKu5W;ot Kut0w 7M;aw3ba4f48oC;c2WdeEk6EveA;e Pll1Nnd Orv5tK; Ktl5J;do1foLin,o7upK;!on;ot,r5Z;aw3ba4do1in,o33up;oCto;al66out0rK;ap65ew 6J;ilAv5;aXeUiSoOuK;b 5Yle0n Kstl5;aLba4do1inKo2Ith4Nu5P;!to;c2Xr8w3;ll Mot LpeAuK;g3Ind17;a2Wf3Po7;ar8in,o7up;ng 68p oKs5;ff,p18;aKelAinEnt0;c6Hd K;o4Dup;c27t0;aZeYiWlToQrOsyc35uK;ll Mn5Kt K;aKba4do1in,oJto47up;pa4Dw3;a3Jdo1in,o21to45up;attleBess KiNop 2;ah2Fon;iLp Kr4Zu1Gwer 6N;do1in,o6Nup;nt0;aLuK;gEmp 6;ce u20y 6D;ck Kg0le 4An 6p5B;oJup;el 5NncilE;c53ir 39n0ss MtLy K;ba4oG; Hc2R;aw3ba4in,oJ;pKw4Y;e4Xt D;aLerd0oK;dAt53;il Hrrow H;aTeQiPoLuK;ddl5ll I;c1FnkeyMp 6uthAve K;aKdo1in,o4Lup;l4Nw3; wi4K;ss0x 2;asur5e3SlLss K;a21up;t 6;ke Ln 6rKs2Ax0;k 6ryA;do,fun,oCsure,up;a02eViQoLuK;ck0st I;aNc4Fg MoKse0;k Kse4D;aft9ba4do1forw37in56o0Zu46;in,oJ;d 6;e NghtMnLsKve 00;ten F;e 2k 2; 2e46;ar8do1in;aMt LvelK; oC;do1go,in,o7up;nEve K;in,oK;pKut;en;c5p 2sh LtchBughAy K;do1o59;in4Po7;eMick Lnock K;do1oCup;oCup;eLy K;in,up;l Ip K;aw3ba4do1f04in,oJto,up;aMoLuK;ic5mpE;ke3St H;c43zz 2;a01eWiToPuK;nLrrKsh 6;y 2;keLt K;ar8do1;r H;lKneErse3K;d Ke 2;ba4dKfast,o0Cup;ear,o1;de Lt K;ba4on,up;aw3o7;aKlp0;d Ml Ir Kt 2;fKof;rom;f11in,o03uW;cPm 2nLsh0ve Kz2P;at,it,to;d Lg KkerP;do1in,o2Tup;do1in,oK;ut,v9;k 2;aZeTive Rloss IoMrLunK; f0S;ab hold,in43ow 2U; Kof 2I;aMb1Mit,oLr8th1IuK;nd9;ff,n,v9;bo7ft9hQw3;aw3bKdo1in,oJrise,up,w3;a4ir2H;ar 6ek0t K;aLb1Fdo1in,oKr8up;ff,n,ut,v9;cLhKl2Fr8t,w3;ead;ross;d aKng 2;bo7;a0Ee07iYlUoQrMuK;ck Ke2N;ar8up;eLighten KownBy 2;aw3oG;eKshe27; 2z5;g 2lMol Krk I;aKwi20;bo7r8;d 6low 2;aLeKip0;sh0;g 6ke0mKrKtten H;e F;gRlPnNrLsKzzle0;h F;e Km 2;aw3ba4up;d0isK;h 2;e Kl 1T;aw3fPin,o7;ht ba4ure0;ePnLsK;s 2;cMd K;fKoG;or;e D;d04l 2;cNll Krm0t1G;aLbKdo1in,o09sho0Eth08victim;a4ehi2O;pa0C;e K;do1oGup;at Kdge0nd 12y5;in,o7up;aOi1HoNrK;aLess 6op KuN;aw3b03in,oC;gBwB; Ile0ubl1B;m 2;a0Ah05l02oOrLut K;aw3ba4do1oCup;ackBeep LoKy0;ss Dwd0;by,do1in,o0Uup;me NoLuntK; o2A;k 6l K;do1oG;aRbQforOin,oNtKu0O;hLoKrue;geth9;rough;ff,ut,v9;th,wK;ard;a4y;paKr8w3;rt;eaLose K;in,oCup;n 6r F;aNeLiK;ll0pE;ck Der Kw F;on,up;t 2;lRncel0rOsMtch LveE; in;o1Nup;h Dt K;doubt,oG;ry LvK;e 08;aw3oJ;l Km H;aLba4do1oJup;ff,n,ut;r8w3;a0Ve0MiteAl0Fo04rQuK;bblNckl05il0Dlk 6ndl05rLsKtMy FzzA;t 00;n 0HsK;t D;e I;ov9;anWeaUiLush K;oGup;ghQng K;aNba4do1forMin,oLuK;nd9p;n,ut;th;bo7lKr8w3;ong;teK;n 2;k K;do1in,o7up;ch0;arTg 6iRn5oPrNssMttlLunce Kx D;aw3ba4;e 6; ar8;e H;do1;k Dt 2;e 2;l 6;do1up;d 2;aPeed0oKurt0;cMw K;aw3ba4do1o7up;ck;k K;in,oC;ck0nk0stA; oQaNef 2lt0nd K;do1ov9up;er;up;r Lt K;do1in,oCup;do1o7;ff,nK;to;ck Pil0nMrgLsK;h D;ainBe D;g DkB; on;in,o7;aw3do1in,oCup;ff,ut;ay;ct FdQir0sk MuctionA; oG;ff;ar8o7;ouK;nd; o7;d K;do1oKup;ff,n;wn;o7up;ut", ProperNoun: "true\xA6aIbDc8dalhousHe7f5gosford,h4iron maiden,kirby,landsdowne,m2nis,r1s0wembF;herwood,paldiB;iel,othwe1;cgi0ercedes,issy;ll;intBudsB;airview,lorence,ra0;mpt9nco;lmo,uro;a1h0;arlt6es5risti;rl0talina;et4i0;ng;arb3e0;et1nt0rke0;ley;on;ie;bid,jax", "Person|Place": "true\xA6a8d6h4jordan,k3orlando,s1vi0;ctor9rgin9;a0ydney;lvador,mara,ntia4;ent,obe;amil0ous0;ton;arw2ie0;go;lexandr1ust0;in;ia", LastName: "true\xA60:BR;1:BF;2:B5;3:BH;4:AX;5:9Y;6:B6;7:BK;8:B0;9:AV;A:AL;B:8Q;C:8G;D:7K;E:BM;F:AH;aBDb9Zc8Wd88e81f7Kg6Wh64i60j5Lk4Vl4Dm39n2Wo2Op25quispe,r1Ls0Pt0Ev03wTxSyKzG;aIhGimmerm6A;aGou,u;ng,o;khar5ytsE;aKeun9BiHoGun;koya32shiBU;!lG;diGmaz;rim,z;maGng;da,g52mo83sGzaC;aChiBV;iao,u;aLeJiHoGright,u;jcA5lff,ng;lGmm0nkl0sniewsC;kiB1liams33s3;bGiss,lt0;b,er,st0;a6Vgn0lHtG;anabe,s3;k0sh,tG;e2Non;aLeKiHoGukD;gt,lk5roby5;dHllalGnogr3Kr1Css0val3S;ba,ob1W;al,ov4;lasHsel8W;lJn dIrgBEsHzG;qu7;ilyEqu7siljE;en b6Aijk,yk;enzueAIverde;aPeix1VhKi2j8ka43oJrIsui,uG;om5UrG;c2n0un1;an,emblA7ynisC;dorAMlst3Km4rrAth;atch0i8UoG;mHrG;are84laci79;ps3sG;en,on;hirDkah9Mnaka,te,varA;a06ch01eYhUiRmOoMtIuHvGzabo;en9Jobod3N;ar7bot4lliv2zuC;aIeHoG;i7Bj4AyanAB;ele,in2FpheBvens25;l8rm0;kol5lovy5re7Tsa,to,uG;ng,sa;iGy72;rn5tG;!h;l71mHnGrbu;at9cla9Egh;moBo7M;aIeGimizu;hu,vchG;en8Luk;la,r1G;gu9infe5YmGoh,pulveA7rra5P;jGyG;on5;evi6iltz,miHneid0roed0uGwarz;be3Elz;dHtG;!t,z;!t;ar4Th8ito,ka4OlJnGr4saCto,unde19v4;ch7dHtGz;a5Le,os;b53e16;as,ihDm4Po0Y;aVeSiPoJuHyG;a6oo,u;bio,iz,sG;so,u;bKc8Fdrigue67ge10j9YmJosevelt,sItHux,wG;e,li6;a9Ch;enb4Usi;a54e4L;erts15i93;bei4JcHes,vGzzo;as,e9;ci,hards12;ag2es,iHut0yG;es,nol5N;s,t0;dImHnGsmu97v6C;tan1;ir7os;ic,u;aUeOhMiJoHrGut8;asad,if6Zochazk27;lishc2GpGrti72u10we76;e3Aov51;cHe45nG;as,to;as70hl0;aGillips;k,m,n6I;a3Hde3Wete0Bna,rJtG;ersHrovGters54;!a,ic;!en,on;eGic,kiBss3;i9ra,tz,z;h86k,padopoulIrk0tHvG;ic,l4N;el,te39;os;bMconn2Ag2TlJnei6PrHsbor6XweBzG;dem7Rturk;ella4DtGwe6N;ega,iz;iGof7Hs8I;vGyn1R;ei9;aSri1;aPeNiJoGune50ym2;rHvGwak;ak4Qik5otn66;odahl,r4S;cholsZeHkolGls4Jx3;ic,ov84;ls1miG;!n1;ils3mG;co4Xec;gy,kaGray2sh,var38;jiGmu9shiG;ma;a07c04eZiWoMuHyeG;rs;lJnIrGssoli6S;atGp03r7C;i,ov4;oz,te58;d0l0;h2lOnNo0RrHsGza1A;er,s;aKeJiIoz5risHtG;e56on;!on;!n7K;au,i9no,t5J;!lA;r1Btgome59;i3El0;cracFhhail5kkeHlG;l0os64;ls1;hmeJiIj30lHn3Krci0ssiGyer2N;!er;n0Po;er,j0;dDti;cartHlG;aughl8e2;hy;dQe7Egnu68i0jer3TkPmNnMrItHyG;er,r;ei,ic,su21thews;iHkDquAroqu8tinG;ez,s;a5Xc,nG;!o;ci5Vn;a5UmG;ad5;ar5e6Kin1;rig77s1;aVeOiLoJuHyG;!nch;k4nGo;d,gu;mbarGpe3Fvr4we;di;!nGu,yana2B;coln,dG;b21holm,strom;bedEfeKhIitn0kaHn8rGw35;oy;!j;m11tG;in1on1;bvGvG;re;iGmmy,ng,rs2Qu,voie,ws3;ne,t1F;aZeYh2iWlUnez50oNrJuHvar2woG;k,n;cerGmar68znets5;a,o34;aHem0isGyeziu;h23t3O;m0sni4Fus3KvG;ch4O;bay57ch,rh0Usk16vaIwalGzl5;czGsC;yk;cIlG;!cGen4K;huk;!ev4ic,s;e8uiveG;rt;eff0kGl4mu9nnun1;ucF;ll0nnedy;hn,llKminsCne,pIrHstra3Qto,ur,yGzl5;a,s0;j0Rls22;l2oG;or;oe;aPenOha6im14oHuG;ng,r4;e32hInHrge32u6vG;anD;es,ss3;anHnsG;en,on,t3;nesGs1R;en,s1;kiBnings,s1;cJkob4EnGrv0E;kDsG;en,sG;en0Ion;ks3obs2A;brahimDglesi5Nke5Fl0Qno07oneIshikHto,vanoG;u,v54;awa;scu;aVeOiNjaltal8oIrist50uG;!aGb0ghAynh;m2ng;a6dz4fIjgaa3Hk,lHpUrGwe,x3X;ak1Gvat;mAt;er,fm3WmG;ann;ggiBtchcock;iJmingw4BnHrGss;nand7re9;deGriks1;rs3;kkiHnG;on1;la,n1;dz4g1lvoQmOns0ZqNrMsJuIwHyG;asFes;kiB;g1ng;anHhiG;mo14;i,ov0J;di6p0r10t;ue;alaG;in1;rs1;aVeorgUheorghe,iSjonRoLrJuGw3;errGnnar3Co,staf3Ctierr7zm2;a,eG;ro;ayli6ee2Lg4iffithGub0;!s;lIme0UnHodGrbachE;e,m2;calvAzale0S;dGubE;bGs0E;erg;aj,i;bs3l,mGordaO;en7;iev3U;gnMlJmaIndFo,rGsFuthi0;cGdn0za;ia;ge;eaHlG;agh0i,o;no;e,on;aVerQiLjeldsted,lKoIrHuG;chs,entAji41ll0;eem2iedm2;ntaGrt8urni0wl0;na;emi6orA;lipIsHtzgeraG;ld;ch0h0;ovG;!ic;hatDnanIrG;arGei9;a,i;deY;ov4;b0rre1D;dKinsJriksIsGvaB;cob3GpGtra3D;inoza,osiQ;en,s3;te8;er,is3warG;ds;aXePiNjurhuMoKrisco15uHvorakG;!oT;arte,boHmitru,nn,rGt3C;and,ic;is;g2he0Omingu7nErd1ItG;to;us;aGcki2Hmitr2Ossanayake,x3;s,z; JbnaIlHmirGrvisFvi,w2;!ov4;gado,ic;th;bo0groot,jo6lHsilGvriA;va;a cruz,e3uG;ca;hl,mcevsCnIt2WviG;dGes,s;ov,s3;ielsGku22;!en;ki;a0Be06hRiobQlarkPoIrGunningh1H;awfo0RivGuz;elli;h1lKntJoIrGs2Nx;byn,reG;a,ia;ke,p0;i,rer2K;em2liB;ns;!e;anu;aOeMiu,oIristGu6we;eGiaG;ns1;i,ng,p9uHwGy;!dH;dGng;huJ;!n,onGu6;!g;kJnIpm2ttHudhGv7;ry;erjee,o14;!d,g;ma,raboG;rty;bJl0Cng4rG;eghetHnG;a,y;ti;an,ota1C;cerAlder3mpbeLrIstGvadi0B;iGro;llo;doHl0Er,t0uGvalho;so;so,zo;ll;a0Fe01hYiXlUoNrKuIyG;rLtyG;qi;chan2rG;ke,ns;ank5iem,oGyant;oks,wG;ne;gdan5nIruya,su,uchaHyKziG;c,n5;rd;darGik;enG;ko;ov;aGond15;nco,zG;ev4;ancFshw16;a08oGuiy2;umGwmG;ik;ckRethov1gu,ktPnNrG;gJisInG;ascoGds1;ni;ha;er,mG;anG;!n;gtGit7nP;ss3;asF;hi;er,hG;am;b4ch,ez,hRiley,kk0ldw8nMrIshHtAu0;es;ir;bInHtlGua;ett;es,i0;ieYosa;dGik;a9yoG;padhyG;ay;ra;k,ng;ic;bb0Acos09d07g04kht05lZnPrLsl2tJyG;aHd8;in;la;chis3kiG;ns3;aImstro6sl2;an;ng;ujo,ya;dJgelHsaG;ri;ovG;!a;ersJov,reG;aGjEws;ss1;en;en,on,s3;on;eksejEiyEmeiIvG;ar7es;ez;da;ev;arwHuilG;ar;al;ams,l0;er;ta;as", Ordinal: "true\xA6eBf7nin5s3t0zeroE;enDhir1we0;lfCn7;d,t3;e0ixt8;cond,vent7;et0th;e6ie7;i2o0;r0urt3;tie4;ft1rst;ight0lev1;e0h,ie1;en0;th", Cardinal: "true\xA6bEeBf5mEnine7one,s4t0zero;en,h2rDw0;e0o;lve,n5;irt6ousands,ree;even2ix2;i3o0;r1ur0;!t2;ty;ft0ve;e2y;ight0lev1;!e0y;en;illions", Multiple: "true\xA6b3hundred,m3qu2se1t0;housand,r2;pt1xt1;adr0int0;illion", City: "true\xA60:74;1:61;2:6G;3:6J;4:5S;a68b53c4Id48e44f3Wg3Hh39i31j2Wk2Fl23m1Mn1Co19p0Wq0Ur0Os05tRuQvLwDxiBy9z5;a7h5i4Muri4O;a5e5ongsh0;ng3H;greb,nzib5G;ang2e5okoha3Sunfu;katerin3Hrev0;a5n0Q;m5Hn;arsBeAi6roclBu5;h0xi,zh5P;c7n5;d5nipeg,terth4;hoek,s1L;hi5Zkl3A;l63xford;aw;a8e6i5ladivost5Molgogr6L;en3lni6S;ni22r5;o3saill4N;lenc4Wncouv3Sr3ughn;lan bat1Crumqi,trecht;aFbilisi,eEheDiBo9r7u5;l21n63r5;in,ku;i5ondh62;es51poli;kyo,m2Zron1Pulo5;n,uS;an5jua3l2Tmisoa6Bra3;j4Tshui; hag62ssaloni2H;gucigal26hr0l av1U;briz,i6llinn,mpe56ng5rtu,shk2R;i3Esh0;an,chu1n0p2Eyu0;aEeDh8kopje,owe1Gt7u5;ra5zh4X;ba0Ht;aten is55ockholm,rasbou67uttga2V;an8e6i5;jiazhua1llo1m5Xy0;f50n5;ya1zh4H;gh3Kt4Q;att45o1Vv44;cramen16int ClBn5o paulo,ppo3Rrajevo; 7aa,t5;a 5o domin3E;a3fe,m1M;antonio,die3Cfrancisco,j5ped3Nsalvad0J;o5u0;se;em,t lake ci5Fz25;lou58peters24;a9e8i6o5;me,t59;ga,o5yadh;! de janei3F;cife,ims,nn3Jykjavik;b4Sip4lei2Inc2Pwalpindi;ingdao,u5;ez2i0Q;aFeEhDiCo9r7u6yong5;ya1;eb59ya1;a5etor3M;g52to;rt5zn0; 5la4Co;au prin0Melizabe24sa03;ls3Prae5Atts26;iladelph3Gnom pe1Aoenix;ki1tah tik3E;dua,lerYnaji,r4Ot5;na,r32;ak44des0Km1Mr6s5ttawa;a3Vlo;an,d06;a7ew5ing2Fovosibir1Jyc; 5cast36;del24orlea44taip14;g8iro4Wn5pl2Wshv33v0;ch6ji1t5;es,o1;a1o1;a6o5p4;ya;no,sa0W;aEeCi9o6u5;mb2Ani26sc3Y;gadishu,nt6s5;c13ul;evideo,pelli1Rre2Z;ami,l6n14s5;kolc,sissauga;an,waukee;cca,d5lbour2Mmph41ndo1Cssi3;an,ell2Xi3;cau,drAkass2Sl9n8r5shh4A;aca6ib5rakesh,se2L;or;i1Sy;a4EchFdal0Zi47;mo;id;aDeAi8o6u5vSy2;anMckn0Odhia3;n5s angel26;d2g bea1N;brev2Be3Lma5nz,sb2verpo28;!ss27; ma39i5;c5pzig;est16; p6g5ho2Wn0Cusan24;os;az,la33;aHharFiClaipeBo9rak0Du7y5;iv,o5;to;ala lump4n5;mi1sh0;hi0Hlka2Xpavog4si5wlo2;ce;da;ev,n5rkuk;gst2sha5;sa;k5toum;iv;bHdu3llakuric0Qmpa3Fn6ohsiu1ra5un1Iwaguc0Q;c0Pj;d5o,p4;ah1Ty;a7e6i5ohannesV;l1Vn0;dd36rusalem;ip4k5;ar2H;bad0mph1OnArkutUs7taXz5;mir,tapala5;pa;fah0l6tanb5;ul;am2Zi2H;che2d5;ianap2Mo20;aAe7o5yder2W; chi mi5ms,nolulu;nh;f6lsin5rakli2;ki;ei;ifa,lifax,mCn5rb1Dva3;g8nov01oi;aFdanEenDhCiPlasgBo9raz,u5;a5jr23;dal6ng5yaquil;zh1J;aja2Oupe;ld coa1Bthen5;bu2S;ow;ent;e0Uoa;sk;lw7n5za;dhi5gt1E;nag0U;ay;aisal29es,o8r6ukuya5;ma;ankfu5esno;rt;rt5sh0; wor6ale5;za;th;d5indhov0Pl paso;in5mont2;bur5;gh;aBe8ha0Xisp4o7resd0Lu5;b5esseldorf,nkirk,rb0shanbe;ai,l0I;ha,nggu0rtmu13;hradSl6nv5troit;er;hi;donghIe6k09l5masc1Zr es sala1KugavpiY;i0lU;gu,je2;aJebu,hAleve0Vo5raio02uriti1Q;lo7n6penhag0Ar5;do1Ok;akKst0V;gUm5;bo;aBen8i6ongqi1ristchur5;ch;ang m7ca5ttago1;go;g6n5;ai;du,zho1;ng5ttogr14;ch8sha,zh07;gliari,i9lga8mayenJn6pe town,r5tanO;acCdiff;ber1Ac5;un;ry;ro;aWeNhKirmingh0WoJr9u5;chareTdapeTenos air7r5s0tu0;g5sa;as;es;a9is6usse5;ls;ba6t5;ol;ne;sil8tisla7zzav5;il5;le;va;ia;goZst2;op6ubaneshw5;ar;al;iCl9ng8r5;g6l5n;in;en;aluru,hazi;fa6grade,o horizon5;te;st;ji1rut;ghd0BkFn9ot8r7s6yan n4;ur;el,r07;celo3i,ranquil09;ou;du1g6ja lu5;ka;alo6k5;ok;re;ng;ers5u;field;a05b02cc01ddis aba00gartaZhmedXizawl,lSmPnHqa00rEsBt7uck5;la5;nd;he7l5;an5;ta;ns;h5unci2;dod,gab5;at;li5;ngt2;on;a8c5kaOtwerp;hora6o3;na;ge;h7p5;ol5;is;eim;aravati,m0s5;terd5;am; 7buquerq6eppo,giers,ma5;ty;ue;basrah al qadim5mawsil al jadid5;ah;ab5;ad;la;ba;ra;idj0u dha5;bi;an;lbo6rh5;us;rg", Region: "true\xA60:2O;1:2L;2:2U;3:2F;a2Sb2Fc21d1Wes1Vf1Tg1Oh1Ki1Fj1Bk16l13m0Sn09o07pYqVrSsJtEuBverAw6y4zacatec2W;akut0o0Fu4;cat1k09;a5est 4isconsin,yomi1O;bengal,virgin0;rwick3shington4;! dc;acruz,mont;dmurt0t4;ah,tar4; 2Pa12;a6e5laxca1Vripu21u4;scaEva;langa2nnessee,x2J;bas10m4smQtar29;aulip2Hil nadu;a9elang07i7o5taf16u4ylh1J;ff02rr09s1E;me1Gno1Uuth 4;cZdY;ber0c4kkim,naloa;hu1ily;n5rawak,skatchew1xo4;ny; luis potosi,ta catari2;a4hodeA;j4ngp0C;asth1shahi;ingh29u4;e4intana roo;bec,en6retaro;aAe6rince edward4unjab; i4;sl0G;i,n5r4;ak,nambu0F;a0Rnsylv4;an0;ha0Pra4;!na;axa0Zdisha,h4klaho21ntar4reg7ss0Dx0I;io;aLeEo6u4;evo le4nav0X;on;r4tt18va scot0;f9mandy,th4; 4ampton3;c6d5yo4;rk3;ako1O;aroli2;olk;bras1Nva0Dw4; 6foundland4;! and labrad4;or;brunswick,hamp3jers5mexiTyork4;! state;ey;galPyarit;aAeghala0Mi6o4;nta2r4;dov0elos;ch6dlanDn5ss4zor11;issippi,ouri;as geraPneso18;ig1oac1;dhy12harasht0Gine,lac07ni5r4ssachusetts;anhao,i el,ylG;p4toba;ur;anca3e4incoln3ouisI;e4iR;ds;a6e5h4omi;aka06ul2;dah,lant1ntucky,ra01;bardino,lmyk0ns0Qr4;achay,el0nata0X;alis6har4iangxi;kh4;and;co;daho,llino7n4owa;d5gush4;et0;ia2;is;a6ert5i4un1;dalFm0D;ford3;mp3rya2waii;ansu,eorg0lou7oa,u4;an4izhou,jarat;ajuato,gdo4;ng;cester3;lori4uji1;da;sex;ageUe7o5uran4;go;rs4;et;lawaMrby3;aFeaEh9o4rim08umbr0;ahui7l6nnectic5rsi4ventry;ca;ut;i03orado;la;e5hattisgarh,i4uvash0;apRhuahua;chn5rke4;ss0;ya;ra;lGm4;bridge3peche;a9ihar,r8u4;ck4ryat0;ingham3;shi4;re;emen,itish columb0;h0ja cal8lk7s4v7;hkorto4que;st1;an;ar0;iforn0;ia;dygHguascalientes,lBndhr9r5ss4;am;izo2kans5un4;achal 7;as;na;a 4;pradesh;a6ber5t4;ai;ta;ba5s4;ka;ma;ea", Place: "true\xA60:4T;1:4V;2:44;3:4B;4:3I;a4Eb3Gc2Td2Ge26f25g1Vh1Ji1Fk1Cl14m0Vn0No0Jp08r04sTtNuLvJw7y5;a5o0Syz;kut1Bngtze;aDeChitBi9o5upatki,ycom2P;ki26o5;d5l1B;b3Ps5;i4to3Y;c0SllowbroCn5;c2Qgh2;by,chur1P;ed0ntw3Gs22;ke6r3St5;erf1f1; is0Gf3V;auxha3Mirgin is0Jost5;ok;laanbaatar,pto5xb3E;n,wn;a9eotihuac43h7ive49o6ru2Nsarskoe selo,u5;l2Dzigo47;nto,rquay,tt2J;am3e 5orn3E;bronx,hamptons;hiti,j mah0Iu1N;aEcotts bluff,eCfo,herbroQoApring9t7u5yd2F;dbu1Wn5;der03set3B;aff1ock2Nr5;atf1oud;hi37w24;ho,uth5; 1Iam1Zwo3E;a5i2O;f2Tt0;int lawrence riv3Pkhal2D;ayleigh,ed7i5oc1Z;chmo1Eo gran4ver5;be1Dfr09si4; s39cliffe,hi2Y;aCe9h8i5ompeii,utn2;c6ne5tcai2T; 2Pc0G;keri13t0;l,x;k,lh2mbr6n5r2J;n1Hzance;oke;cif38pahanaumokuak30r5;k5then0;si4w1K;ak7r6x5;f1l2X;ange county,d,f1inoco;mTw1G;e8i1Uo5;r5tt2N;th5wi0E; 0Sam19;uschwanste1Pw5; eng6a5h2market,po36;rk;la0P;a8co,e6i5uc;dt1Yll0Z;adow5ko0H;lands;chu picchu,gad2Ridsto1Ql8n7ple6r5;kh2; g1Cw11;hatt2Osf2B;ibu,t0ve1Z;a8e7gw,hr,in5owlOynd02;coln memori5dl2C;al;asi4w3;kefr7mbe1On5s,x;ca2Ig5si05;f1l27t0;ont;azan kreml14e6itchen2Gosrae,rasnoyar5ul;sk;ns0Hs1U;ax,cn,lf1n6ps5st;wiN;d5glew0Lverness;ian27ochina;aDeBi6kg,nd,ov5unti2H;d,enweep;gh6llc5;reL;bu03l5;and5;!s;r5yw0C;ef1tf1;libu24mp6r5stings;f1lem,row;stead,t0;aDodavari,r5uelph;avenAe5imsS;at 8en5; 6f1Fwi5;ch;acr3vall1H;brita0Flak3;hur5;st;ng3y villa0W;airhavHco,ra;aAgli9nf17ppi8u7ver6x5;et1Lf1;glad3t0;rope,st0;ng;nt0;rls1Ls5;t 5;e5si4;nd;aCe9fw,ig8o7ryd6u5xb;mfri3nstab00rh2tt0;en;nca18rcKv19wnt0B;by;n6r5vonpo1D;ry;!h2;nu8r5;l6t5;f1moor;ingt0;be;aLdg,eIgk,hClBo5royd0;l6m5rnwa0B;pt0;c7lingw6osse5;um;ood;he0S;earwat0St;a8el6i5uuk;chen itza,mney ro07natSricahua;m0Zt5;enh2;mor5rlottetPth2;ro;dar 5ntervilA;breaks,faZg5;rove;ld9m8r5versh2;lis6rizo pla5;in;le;bLpbellf1;weQ;aZcn,eNingl01kk,lackLolt0r5uckV;aGiAo5;ckt0ok5wns cany0;lyn,s5;i4to5;ne;de;dge6gh5;am,t0;n6t5;own;or5;th;ceb6m5;lNpt0;rid5;ge;bu5pool,wa8;rn;aconsfEdf1lBr9verly7x5;hi5;ll; hi5;lls;wi5;ck; air,l5;ingh2;am;ie5;ld;ltimore,rnsl6tters5;ea;ey;bLct0driadic,frica,ginJlGmFn9rc8s7tl6yleOzor3;es;!ant8;hcroft,ia; de triomphe,t6;adyr,ca8dov9tarct5;ic5; oce5;an;st5;er;ericas,s;be6dersh5hambra,list0;ot;rt0;cou5;rt;bot7i5;ngd0;on;sf1;ord", Country: "true\xA60:38;1:2L;2:3B;a2Xb2Ec22d1Ye1Sf1Mg1Ch1Ai14j12k0Zl0Um0Gn05om2pZqat1KrXsKtCu7v5wal4yemTz3;a25imbabwe;es,lis and futu2Y;a3enezue32ietnam;nuatu,tican city;gTk6nited 4ruXs3zbeE; 2Ca,sr;arab emirat0Kkingdom,states3;! of am2Y;!raiV;a8haCimor les0Co7rinidad 5u3;nis0rk3valu;ey,me2Zs and caic1V;and t3t3;oba1L;go,kel10nga;iw2ji3nz2T;ki2V;aDcotl1eCi9lov8o6pa2Dri lanka,u5w3yr0;az3edAitzerl1;il1;d2riname;lomon1Xmal0uth 3;afr2KkMsud2;ak0en0;erra leoFn3;gapo1Yt maart3;en;negLrb0ychellZ;int 3moa,n marino,udi arab0;hele26luc0mart21;epublic of ir0Eom2Euss0w3;an27;a4eIhilippinUitcairn1Mo3uerto riN;l1rtugF;ki2Dl4nama,pua new0Vra3;gu7;au,esti3;ne;aBe9i7or3;folk1Ith4w3;ay; k3ern mariana1D;or0O;caragua,ger3ue;!ia;p3ther1Aw zeal1;al;mib0u3;ru;a7exi6icro0Bo3yanm06;ldova,n3roc5zambA;a4gol0t3;enegro,serrat;co;cAdagasc01l7r5urit4yot3;te;an0i16;shall0Xtin3;ique;a4div3i,ta;es;wi,ys0;ao,ed02;a6e5i3uxembourg;b3echtenste12thu1G;er0ya;ban0Isotho;os,tv0;azakh1Fe4iriba04o3uwait,yrgyz1F;rXsovo;eling0Knya;a3erG;ma16p2;c7nd6r4s3taly,vory coast;le of m2rael;a3el1;n,q;ia,oJ;el1;aiTon3ungary;dur0Ng kong;aBermany,ha0QibraltAre8u3;a6ern5inea3ya0P;! biss3;au;sey;deloupe,m,tema0Q;e3na0N;ce,nl1;ar;bUmb0;a7i6r3;ance,ench 3;guia0Epoly3;nes0;ji,nl1;lklandUroeU;ast tim7cu6gypt,l salv6ngl1quatorial4ritr5st3thiop0;on0; guin3;ea;ad3;or;enmark,jibou5ominica4r con3;go;!n C;ti;aBentral african Ah8o5roat0u4yprRzech3; 9ia;ba,racao;c4lo3morQngo brazzaville,okGsta r04te de ivoiL;mb0;osE;i3ristmasG;le,na;republic;m3naUpe verde,ymanA;bod0ero3;on;aGeDhut2o9r5u3;lgar0r3;kina faso,ma,undi;azil,itish 3unei;virgin3; is3;lands;liv0nai5snia and herzegoviHtswaHuvet3; isl1;and;re;l3n8rmuG;ar3gium,ize;us;h4ngladesh,rbad3;os;am4ra3;in;as;fghaGlDmBn6r4ustr3zerbaij2;al0ia;genti3men0uba;na;dorra,g5t3;arct7igua and barbu3;da;o3uil3;la;er3;ica;b3ger0;an0;ia;ni3;st2;an", FirstName: "true\xA6aTblair,cQdOfrancoZgabMhinaLilya,jHkClBm6ni4quinn,re3s0;h0umit,yd;ay,e0iloh;a,lby;g9ne;co,ko0;!s;a1el0ina,org6;!okuhF;ds,naia,r1tt0xiB;i,y;ion,lo;ashawn,eif,uca;a3e1ir0rM;an;lsFn0rry;dall,yat5;i,sD;a0essIie,ude;i1m0;ie,mG;me;ta;rie0y;le;arcy,ev0;an,on;as1h0;arl8eyenne;ey,sidy;drien,kira,l4nd1ubr0vi;ey;i,r0;a,e0;a,y;ex2f1o0;is;ie;ei,is", WeekDay: "true\xA6fri2mon2s1t0wednesd3;hurs1ues1;aturd1und1;!d0;ay0;!s", Month: "true\xA6dec0february,july,nov0octo1sept0;em0;ber", Date: "true\xA6ago,on4som4t1week0yesterd5; end,ends;mr1o0;d2morrow;!w;ed0;ay", Duration: "true\xA6centurAd8h7m5q4se3w1y0;ear8r8;eek0k7;!end,s;ason,c5;tr,uarter;i0onth3;llisecond2nute2;our1r1;ay0ecade0;!s;ies,y", FemaleName: "true\xA60:J7;1:JB;2:IJ;3:IK;4:J1;5:IO;6:JS;7:JO;8:HB;9:JK;A:H4;B:I2;C:IT;D:JH;E:IX;F:BA;G:I4;aGTbFLcDRdD0eBMfB4gADh9Ti9Gj8Dk7Cl5Wm48n3Lo3Hp33qu32r29s15t0Eu0Cv02wVxiTyOzH;aLeIineb,oHsof3;e3Sf3la,ra;h2iKlIna,ynH;ab,ep;da,ma;da,h2iHra;nab;aKeJi0FolB7uIvH;et8onDP;i0na;le0sen3;el,gm3Hn,rGLs8W;aoHme0nyi;m5XyAD;aMendDZhiDGiH;dele9lJnH;if48niHo0;e,f47;a,helmi0lHma;a,ow;ka0nB;aNeKiHusa5;ck84kIl8oleAviH;anFenJ4;ky,toriBK;da,lA8rHs0;a,nHoniH9;a,iFR;leHnesH9;nILrH;i1y;g9rHs6xHA;su5te;aYeUhRiNoLrIuHy2;i,la;acJ3iHu0J;c3na,sH;hFta;nHr0F;iFya;aJffaEOnHs6;a,gtiH;ng;!nFSra;aIeHomasi0;a,l9Oo8Ares1;l3ndolwethu;g9Fo88rIssH;!a,ie;eHi,ri7;sa,za;bOlMmKnIrHs6tia0wa0;a60yn;iHya;a,ka,s6;arFe2iHm77ra;!ka;a,iH;a,t6;at6it6;a0Ecarlett,e0AhWiSkye,neza0oQri,tNuIyH;bIGlvi1;ha,mayIJniAsIzH;an3Net8ie,y;anHi7;!a,e,nH;aCe;aIeH;fan4l5Dphan6E;cI5r5;b3fiAAm0LnHphi1;d2ia,ja,ya;er2lJmon1nIobh8QtH;a,i;dy;lETv3;aMeIirHo0risFDy5;a,lDM;ba,e0i5lJrH;iHr6Jyl;!d8Ifa;ia,lDZ;hd,iMki2nJrIu0w0yH;la,ma,na;i,le9on,ron,yn;aIda,ia,nHon;a,on;!ya;k6mH;!aa;lJrItaye82vH;da,inj;e0ife;en1i0ma;anA9bLd5Oh1SiBkKlJmInd2rHs6vannaC;aCi0;ant6i2;lDOma,ome;ee0in8Tu2;in1ri0;a05eZhXiUoHuthDM;bScRghQl8LnPsJwIxH;anB3ie,y;an,e0;aIeHie,lD;ann7ll1marDGtA;!lHnn1;iHyn;e,nH;a,dF;da,i,na;ayy8G;hel67io;bDRerAyn;a,cIkHmas,nFta,ya;ki,o;h8Xki;ea,iannGMoH;da,n1P;an0bJemFgi0iInHta,y0;a8Bee;han86na;a,eH;cHkaC;a,ca;bi0chIe,i0mo0nHquETy0;di,ia;aERelHiB;!e,le;een4ia0;aPeOhMiLoJrHute6A;iHudenCV;scil3LyamvaB;lHrt3;i0ly;a,paluk;ilome0oebe,ylH;is,lis;ggy,nelope,r5t2;ige,m0VnKo5rvaDMtIulH;a,et8in1;ricHt4T;a,e,ia;do2i07;ctav3dIfD3is6ksa0lHphD3umC5yunbileg;a,ga,iv3;eHvAF;l3t8;aWeUiMoIurHy5;!ay,ul;a,eJor,rIuH;f,r;aCeEma;ll1mi;aNcLhariBQkKlaJna,sHta,vi;anHha;ur;!y;a,iDZki;hoGk9YolH;a,e4P;!mh;hir,lHna,risDEsreE;!a,lBV;asuMdLh3i6Dl5nKomi7rgEVtH;aHhal4;lHs6;i1ya;cy,et8;e9iF0ya;nngu2X;a0Ackenz4e02iMoJrignayani,uriDJyH;a,rH;a,iOlNna,tG;bi0i2llBJnH;a,iH;ca,ka,qD9;a,cUdo4ZkaTlOmi,nMrItzi,yH;ar;aJiIlH;anET;am;!l,nB;dy,eHh,n4;nhGrva;aKdJe0iCUlH;iHy;cent,e;red;!gros;!e5;ae5hH;ae5el3Z;ag5DgNi,lKrH;edi7AiIjem,on,yH;em,l;em,sCG;an4iHliCF;nHsCJ;a,da;!an,han;b09cASd07e,g05ha,i04ja,l02n00rLsoum5YtKuIv84xBKyHz4;bell,ra,soBB;d7rH;a,eE;h8Gild1t4;a,cUgQiKjor4l7Un4s6tJwa,yH;!aHbe6Xja9lAE;m,nBL;a,ha,in1;!aJbCGeIja,lDna,sHt63;!a,ol,sa;!l1D;!h,mInH;!a,e,n1;!awit,i;arJeIie,oHr48ueri8;!t;!ry;et46i3B;el4Xi7Cy;dHon,ue5;akranAy;ak,en,iHlo3S;a,ka,nB;a,re,s4te;daHg4;!l3E;alDd4elHge,isDJon0;ei9in1yn;el,le;a0Ne0CiXoQuLyH;d3la,nH;!a,dIe2OnHsCT;!a,e2N;a,sCR;aD4cJel0Pis1lIna,pHz;e,iA;a,u,wa;iHy;a0Se,ja,l2NnB;is,l1UrItt1LuHvel4;el5is1;aKeIi7na,rH;aADi7;lHn1tA;ei;!in1;aTbb9HdSepa,lNnKsJvIzH;!a,be5Ret8z4;!ia;a,et8;!a,dH;a,sHy;ay,ey,i,y;a,iJja,lH;iHy;aA8e;!aH;!nF;ia,ya;!nH;!a,ne;aPda,e0iNjYla,nMoKsJtHx93y5;iHt4;c3t3;e2PlCO;la,nHra;a,ie,o2;a,or1;a,gh,laH;!ni;!h,nH;a,d2e,n5V;cOdon9DiNkes6mi9Gna,rMtJurIvHxmi,y5;ern1in3;a,e5Aie,yn;as6iIoH;nya,ya;fa,s6;a,isA9;a,la;ey,ie,y;a04eZhXiOlASoNrJyH;lHra;a,ee,ie;istHy6I;a,en,iIyH;!na;!e,n5F;nul,ri,urtnB8;aOerNlB7mJrHzzy;a,stH;en,in;!berlImernH;aq;eHi,y;e,y;a,stE;!na,ra;aHei2ongordzol;dij1w5;el7UiKjsi,lJnIrH;a,i,ri;d2na,za;ey,i,lBLs4y;ra,s6;biAcARdiat7MeBAiSlQmPnyakuma1DrNss6NtKviAyH;!e,lH;a,eH;e,i8T;!a6HeIhHi4TlDri0y;ar8Her8Hie,leErBAy;!lyn8Ori0;a,en,iHl5Xoli0yn;!ma,nFs95;a5il1;ei8Mi,lH;e,ie;a,tl6O;a0AeZiWoOuH;anMdLlHst88;es,iH;a8NeHs8X;!n9tH;!a,te;e5Mi3My;a,iA;!anNcelDdMelGhan7VleLni,sIva0yH;a,ce;eHie;fHlDph7Y;a,in1;en,n1;i7y;!a,e,n45;lHng;!i1DlH;!i1C;anNle0nKrJsH;i8JsH;!e,i8I;i,ri;!a,elGif2CnH;a,et8iHy;!e,f2A;a,eJiInH;a,eIiH;e,n1;!t8;cMda,mi,nIque4YsminFvie2y9zH;min7;a7eIiH;ce,e,n1s;!lHs82t0F;e,le;inIk6HlDquelH;in1yn;da,ta;da,lRmPnOo0rNsIvaHwo0zaro;!a0lu,na;aJiIlaHob89;!n9R;do2;belHdo2;!a,e,l3B;a7Ben1i0ma;di2es,gr72ji;a9elBogH;en1;a,e9iHo0se;a0na;aSeOiJoHus7Kyacin2C;da,ll4rten24snH;a,i9U;lImaH;ri;aIdHlaI;a,egard;ry;ath1BiJlInrietArmi9sH;sa,t1A;en2Uga,mi;di;bi2Fil8MlNnMrJsItHwa,yl8M;i5Tt4;n60ti;iHmo51ri53;etH;!te;aCnaC;a,ey,l4;a02eWiRlPoNrKunJwH;enHyne1R;!dolD;ay,el;acieIetHiselB;a,chE;!la;ld1CogooH;sh;adys,enHor3yn2K;a,da,na;aKgi,lIna,ov8EselHta;a,e,le;da,liH;an;!n0;mLnJorgIrH;ald5Si,m3Etrud7;et8i4X;a,eHna;s29vieve;ma;bIle,mHrnet,yG;al5Si5;iIrielH;a,l1;!ja;aTeQiPlorOoz3rH;anJeIiH;da,eB;da,ja;!cH;esIiHoi0P;n1s66;!ca;a,enc3;en,o0;lIn0rnH;anB;ec3ic3;jr,nArKtHy7;emIiHma,oumaA;ha,ma,n;eh;ah,iBrah,za0;cr4Rd0Re0Qi0Pk0Ol07mXn54rUsOtNuMvHwa;aKelIiH;!e,ta;inFyn;!a;!ngel4V;geni1ni47;h5Yien9ta;mLperanKtH;eIhHrel5;er;l31r7;za;a,eralB;iHma,ne4Lyn;cHka,n;a,ka;aPeNiKmH;aHe21ie,y;!li9nuH;elG;lHn1;e7iHy;a,e,ja;lHrald;da,y;!nue5;aWeUiNlMma,no2oKsJvH;a,iH;na,ra;a,ie;iHuiH;se;a,en,ie,y;a0c3da,e,f,nMsJzaH;!betHveA;e,h;aHe,ka;!beH;th;!a,or;anor,nH;!a,i;!in1na;ate1Rta;leEs6;vi;eIiHna,wi0;e,th;l,n;aYeMh3iLjeneKoH;lor5Vminiq4Ln3FrHtt4;a,eEis,la,othHthy;ea,y;ba;an09naCon9ya;anQbPde,eOiMlJmetr3nHsir5M;a,iH;ce,se;a,iIla,orHphi9;es,is;a,l6F;dHrdH;re;!d5Ena;!b2ForaCraC;a,d2nH;!a,e;hl3i0l0GmNnLphn1rIvi1WyH;le,na;a,by,cIia,lH;a,en1;ey,ie;a,et8iH;!ca,el1Aka,z;arHia;is;a0Re0Nh04i02lUoJristIynH;di,th3;al,i0;lPnMrIurH;tn1D;aJd2OiHn2Ori9;!nH;a,e,n1;!l4;cepci5Cn4sH;tanHuelo;ce,za;eHleE;en,t8;aJeoIotH;il54;!pat2;ir7rJudH;et8iH;a,ne;a,e,iH;ce,sZ;a2er2ndH;i,y;aReNloe,rH;isJyH;stH;al;sy,tH;a1Sen,iHy;an1e,n1;deJlseIrH;!i7yl;a,y;li9;nMrH;isKlImH;ai9;a,eHot8;n1t8;!sa;d2elGtH;al,elG;cIlH;es8i47;el3ilH;e,ia,y;itlYlXmilWndVrMsKtHy5;aIeIhHri0;er1IleErDy;ri0;a38sH;a37ie;a,iOlLmeJolIrH;ie,ol;!e,in1yn;lHn;!a,la;a,eIie,otHy;a,ta;ne,y;na,s1X;a0Ii0I;a,e,l1;isAl4;in,yn;a0Ke02iZlXoUrH;andi7eRiJoIyH;an0nn;nwDoke;an3HdgMgiLtH;n31tH;!aInH;ey,i,y;ny;d,t8;etH;!t7;an0e,nH;da,na;bbi7glarIlo07nH;iAn4;ka;ancHythe;a,he;an1Clja0nHsm3M;iAtH;ou;aWcVlinUniArPssOtJulaCvH;!erlH;ey,y;hJsy,tH;e,iHy7;e,na;!anH;ie,y;!ie;nItHyl;ha,ie;adIiH;ce;et8i9;ay,da;ca,ky;!triH;ce,z;rbJyaH;rmH;aa;a2o2ra;a2Ub2Od25g21i1Sj5l18m0Zn0Boi,r06sWtVuPvOwa,yIzH;ra,u0;aKes6gJlIn,seH;!l;in;un;!nH;a,na;a,i2K;drLguJrIsteH;ja;el3;stH;in1;a,ey,i,y;aahua,he0;hIi2Gja,miAs2DtrH;id;aMlIraqHt21;at;eIi7yH;!n;e,iHy;gh;!nH;ti;iJleIo6piA;ta;en,n1t8;aHelG;!n1J;a01dje5eZgViTjRnKohito,toHya;inet8nH;el5ia;te;!aKeIiHmJ;e,ka;!mHtt7;ar4;!belIliHmU;sa;!l1;a,eliH;ca;ka,sHta;a,sa;elHie;a,iH;a,ca,n1qH;ue;!tH;a,te;!bImHstasiMya;ar3;el;aLberKeliJiHy;e,l3naH;!ta;a,ja;!ly;hGiIl3nB;da;a,ra;le;aWba,ePiMlKthJyH;a,c3sH;a,on,sa;ea;iHys0N;e,s0M;a,cIn1sHza;a,e,ha,on,sa;e,ia,ja;c3is6jaKksaKna,sJxH;aHia;!nd2;ia,saH;nd2;ra;ia;i0nIyH;ah,na;a,is,naCoud;la;c6da,leEmNnLsH;haClH;inHyY;g,n;!h;a,o,slH;ey;ee;en;at6g4nIusH;ti0;es;ie;aWdiTelMrH;eJiH;anMenH;a,e,ne;an0;na;!aLeKiIyH;nn;a,n1;a,e;!ne;!iH;de;e,lDsH;on;yn;!lH;i9yn;ne;aKbIiHrL;!e,gaK;ey,i7y;!e;gaH;il;dKliyJradhIs6;ha;ya;ah;a,ya", Honorific: "true\xA6director1field marsh2lieutenant1rear0sergeant major,vice0; admir1; gener0;al", "Adj|Gerund": "true\xA60:3F;1:3H;2:31;3:2X;4:35;5:33;6:3C;7:2Z;8:36;9:29;a33b2Tc2Bd1Te1If19g12h0Zi0Rl0Nm0Gnu0Fo0Ap04rYsKtEuBvAw1Ayiel3;ar6e08;nBpA;l1Rs0B;fol3n1Zsett2;aEeDhrBi4ouc7rAwis0;e0Bif2oub2us0yi1;ea1SiA;l2vi1;l2mp0rr1J;nt1Vxi1;aMcreec7enten2NhLkyrocke0lo0Vmi2oJpHtDuBweA;e0Ul2;pp2ArA;gi1pri5roun3;aBea8iAri2Hun9;mula0r4;gge4rA;t2vi1;ark2eAraw2;e3llb2F;aAot7;ki1ri1;i9oc29;dYtisf6;aEeBive0oAus7;a4l2;assu4defi9fres7ig9juve07mai9s0vAwar3;ea2italiAol1G;si1zi1;gi1ll6mb2vi1;a6eDier23lun1VrAun2C;eBoA;mi5vo1Z;ce3s5vai2;n3rpleA;xi1;ffCpWutBverAwi1;arc7lap04p0Pri3whel8;goi1l6st1J;en3sA;et0;m2Jrtu4;aEeDiCoBuAyst0L;mb2;t1Jvi1;s5tiga0;an1Rl0n3smeri26;dAtu4;de9;aCeaBiAo0U;fesa0Tvi1;di1ni1;c1Fg19s0;llumiGmFnArri0R;cDfurHsCtBviA;go23ti1;e1Oimi21oxica0rig0V;pi4ul0;orpo20r0K;po5;na0;eaBorr02umilA;ia0;li1rtwar8;lFrA;atiDipCoBuelA;i1li1;undbrea10wi1;pi1;f6ng;a4ea8;a3etc7it0lEoCrBulfA;il2;ee1FighXust1L;rAun3;ebo3thco8;aCoA;a0wA;e4i1;mi1tte4;lectrJmHnExA;aCci0hBis0pA;an3lo3;aOila1B;c0spe1A;ab2coura0CdBergi13ga0Clive9ric7s02tA;hral2i0J;ea4u4;barras5er09pA;owe4;if6;aQeIiBrA;if0;sAzz6;aEgDhearCsen0tA;rAur11;ac0es5;te9;us0;ppoin0r8;biliGcDfi9gra3ligh0mBpres5sAvasG;erE;an3ea9orA;ali0L;a6eiBli9rA;ea5;vi1;ta0;maPri1s7un0zz2;aPhMlo5oAripp2ut0;mGnArrespon3;cer9fDspi4tA;inBrA;as0ibu0ol2;ui1;lic0u5;ni1;fDmCpA;eAromi5;l2ti1;an3;or0;aAil2;llenAnAr8;gi1;l8ptAri1;iva0;aff2eGin3lFoDrBuA;d3st2;eathtaAui5;ki1;gg2i2o8ri1unA;ci1;in3;co8wiA;lAtc7;de4;bsorVcOgonMlJmHnno6ppea2rFsA;pi4su4toA;nBun3;di1;is7;hi1;res0;li1;aFu5;si1;ar8lu4;ri1;mi1;iAzi1;zi1;cAhi1;eleDomA;moBpan6;yi1;da0;ra0;ti1;bi1;ng", Comparable: "true\xA60:3C;1:3Q;2:3F;a3Tb3Cc33d2Te2Mf2Ag1Wh1Li1Fj1Ek1Bl13m0Xn0So0Rp0Iqu0Gr07sHtCug0vAw4y3za0Q;el10ouN;ary,e6hi5i3ry;ck0Cde,l3n1ry,se;d,y;ny,te;a3i3R;k,ry;a3erda2ulgar;gue,in,st;a6en2Xhi5i4ouZr3;anqu2Cen1ue;dy,g36me0ny;ck,rs28;ll,me,rt,wd3I;aRcaPeOhMiLkin0BlImGoEpDt6u4w3;eet,ift;b3dd0Wperfi21rre28;sta26t21;a8e7iff,r4u3;pUr1;a4ict,o3;ng;ig2Vn0N;a1ep,rn;le,rk,te0;e1Si2Vright0;ci1Yft,l3on,re;emn,id;a3el0;ll,rt;e4i3y;g2Mm0Z;ek,nd2T;ck24l0mp1L;a3iRrill,y;dy,l01rp;ve0Jxy;n1Jr3;ce,y;d,fe,int0l1Hv0V;a8e6i5o3ude;mantic,o19sy,u3;gh;pe,t1P;a3d,mo0A;dy,l;gg4iFndom,p3re,w;id;ed;ai2i3;ck,et;hoAi1Fl9o8r5u3;ny,r3;e,p11;egna2ic4o3;fouSud;ey,k0;liXor;ain,easa2;ny;dd,i0ld,ranL;aive,e5i4o3u14;b0Sisy,rm0Ysy;bb0ce,mb0R;a3r1w;r,t;ad,e5ild,o4u3;nda12te;ist,o1;a4ek,l3;low;s0ty;a8e7i6o3ucky;f0Jn4o15u3ve0w10y0N;d,sy;e0g;ke0l,mp,tt0Eve0;e1Qwd;me,r3te;ge;e4i3;nd;en;ol0ui19;cy,ll,n3;secu6t3;e3ima4;llege2rmedia3;te;re;aAe7i6o5u3;ge,m3ng1C;bYid;me0t;gh,l0;a3fXsita2;dy,rWv3;en0y;nd13ppy,r3;d3sh;!y;aFenEhCiBlAoofy,r3;a8e6i5o3ue0Z;o3ss;vy;m,s0;at,e3y;dy,n;nd,y;ad,ib,ooD;a2d1;a3o3;st0;tDuiS;u1y;aCeebBi9l8o6r5u3;ll,n3r0N;!ny;aCesh,iend0;a3nd,rmD;my;at,ir7;erce,nan3;ci9;le;r,ul3;ty;a6erie,sse4v3xtre0B;il;nti3;al;r4s3;tern,y;ly,th0;appZe9i5ru4u3;mb;nk;r5vi4z3;zy;ne;e,ty;a3ep,n9;d3f,r;!ly;agey,h8l7o5r4u3;dd0r0te;isp,uel;ar3ld,mmon,st0ward0zy;se;evKou1;e3il0;ap,e3;sy;aHiFlCoAr5u3;ff,r0sy;ly;a6i3oad;g4llia2;nt;ht;sh,ve;ld,un3;cy;a4o3ue;nd,o1;ck,nd;g,tt3;er;d,ld,w1;dy;bsu6ng5we3;so3;me;ry;rd", Adverb: "true\xA6a08b05d00eYfSheQinPjustOkinda,likewiZmMnJoEpCquite,r9s5t2u0very,well;ltima01p0; to,wards5;h1iny bit,o0wiO;o,t6;en,us;eldom,o0uch;!me1rt0; of;how,times,w0C;a1e0;alS;ndomRth05;ar excellenEer0oint blank; Lhaps;f3n0utright;ce0ly;! 0;ag05moX; courGten;ewJo0; longWt 0;onHwithstand9;aybe,eanwhiNore0;!ovT;! aboX;deed,steY;lla,n0;ce;or3u0;ck1l9rther0;!moK;ing; 0evK;exampCgood,suH;n mas0vI;se;e0irect2; 2fini0;te0;ly;juAtrop;ackward,y 0;far,no0; means,w; GbroFd nauseam,gEl7ny5part,s4t 2w0;ay,hi0;le;be7l0mo7wor7;arge,ea6; soon,i4;mo0way;re;l 3mo2ongsi1ready,so,togeth0ways;er;de;st;b1t0;hat;ut;ain;ad;lot,posteriori", Conjunction: "true\xA6aXbTcReNhowMiEjust00noBo9p8supposing,t5wh0yet;e1il0o3;e,st;n1re0thN; if,by,vM;evL;h0il,o;erefOo0;!uU;lus,rovided th9;r0therwiM;! not; mattEr,w0;! 0;since,th4w7;f4n0; 0asmuch;as mIcaForder t0;h0o;at;! 0;only,t0w0;hen;!ev3;ith2ven0;! 0;if,tB;er;o0uz;s,z;e0ut,y the time;cau1f0;ore;se;lt3nd,s 0;far1if,m0soon1t2;uch0; as;hou0;gh", Currency: "true\xA6$,aud,bQcOdJeurIfHgbp,hkd,iGjpy,kElDp8r7s3usd,x2y1z0\xA2,\xA3,\xA5,\u0434\u0435\u043D,\u043B\u0432,\u0440\u0443\u0431,\u0E3F,\u20A1,\u20A8,\u20AC,\u20AD,\uFDFC;lotyQ\u0142;en,uanP;af,of;h0t5;e0il5;k0q0;elK;oubleJp,upeeJ;e2ound st0;er0;lingG;n0soF;ceEnies;empi7i7;n,r0wanzaCyatC;!onaBw;ls,nr;ori7ranc9;!os;en3i2kk,o0;b0ll2;ra5;me4n0rham4;ar3;e0ny;nt1;aht,itcoin0;!s", Determiner: "true\xA6aBboth,d9e6few,le5mu8neiDplenty,s4th2various,wh0;at0ich0;evC;a0e4is,ose;!t;everal,ome;!ast,s;a1l0very;!se;ch;e0u;!s;!n0;!o0y;th0;er", "Adj|Present": "true\xA6a07b04cVdQeNfJhollIidRlEmCnarrIoBp9qua8r7s3t2uttFw0;aKet,ro0;ng,u08;endChin;e2hort,l1mooth,our,pa9tray,u0;re,speU;i2ow;cu6da02leSpaN;eplica01i02;ck;aHerfePr0;eseUime,omV;bscu1pen,wn;atu0e3odeH;re;a2e1ive,ow0;er;an;st,y;ow;a2i1oul,r0;ee,inge;rm;iIke,ncy,st;l1mpty,x0;emHpress;abo4ic7;amp,e2i1oub0ry,ull;le;ffu9re6;fu8libe0;raE;alm,l5o0;mpleCn3ol,rr1unterfe0;it;e0u7;ct;juga8sum7;ea1o0;se;n,r;ankru1lu0;nt;pt;li2pproxi0rticula1;ma0;te;ght", "Person|Adj": "true\xA6b3du2earnest,frank,mi2r0san1woo1;an0ich,u1;dy;sty;ella,rown", Modal: "true\xA6c5lets,m4ought3sh1w0;ill,o5;a0o4;ll,nt;! to,a;ight,ust;an,o0;uld", Verb: "true\xA6born,cannot,gonna,has,keep tabs,msg", "Person|Verb": "true\xA6b8ch7dr6foster,gra5ja9lan4ma2ni9ollie,p1rob,s0wade;kip,pike,t5ue;at,eg,ier2;ck,r0;k,shal;ce;ce,nt;ew;ase,u1;iff,l1ob,u0;ck;aze,ossom", "Person|Date": "true\xA6a2j0sep;an0une;!uary;p0ugust,v0;ril" };
      const ca = 36, ha = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ", da = ha.split("").reduce(function(e3, t3, n2) {
        return e3[t3] = n2, e3;
      }, {});
      var ga = function(e3) {
        if (void 0 !== da[e3]) return da[e3];
        let t3 = 0, n2 = 1, r2 = ca, a2 = 1;
        for (; n2 < e3.length; t3 += r2, n2++, r2 *= ca) ;
        for (let n3 = e3.length - 1; n3 >= 0; n3--, a2 *= ca) {
          let r3 = e3.charCodeAt(n3) - 48;
          r3 > 10 && (r3 -= 7), t3 += r3 * a2;
        }
        return t3;
      };
      const ma = function(e3, t3, n2) {
        const r2 = ga(t3);
        return r2 < e3.symCount ? e3.syms[r2] : n2 + r2 + 1 - e3.symCount;
      }, pa = function(e3) {
        const t3 = { nodes: e3.split(";"), syms: [], symCount: 0 };
        return e3.match(":") && function(e4) {
          const t4 = new RegExp("([0-9A-Z]+):([0-9A-Z]+)");
          for (let n2 = 0; n2 < e4.nodes.length; n2++) {
            const r2 = t4.exec(e4.nodes[n2]);
            if (!r2) {
              e4.symCount = n2;
              break;
            }
            e4.syms[ga(r2[1])] = ga(r2[2]);
          }
          e4.nodes = e4.nodes.slice(e4.symCount, e4.nodes.length);
        }(t3), function(e4) {
          const t4 = [], n2 = (r2, a2) => {
            let o2 = e4.nodes[r2];
            "!" === o2[0] && (t4.push(a2), o2 = o2.slice(1));
            const i2 = o2.split(/([A-Z0-9,]+)/g);
            for (let o3 = 0; o3 < i2.length; o3 += 2) {
              const s2 = i2[o3], l2 = i2[o3 + 1];
              if (!s2) continue;
              const u2 = a2 + s2;
              if ("," === l2 || void 0 === l2) {
                t4.push(u2);
                continue;
              }
              const c2 = ma(e4, l2, r2);
              n2(c2, u2);
            }
          };
          return n2(0, ""), t4;
        }(t3);
      }, fa = ["Possessive", "Pronoun"], ba = { a: [[/(antenn|formul|nebul|vertebr|vit)a$/i, "$1ae"], [/ia$/i, "ia"]], e: [[/(kn|l|w)ife$/i, "$1ives"], [/(hive)$/i, "$1s"], [/([m|l])ouse$/i, "$1ice"], [/([m|l])ice$/i, "$1ice"]], f: [[/^(dwar|handkerchie|hoo|scar|whar)f$/i, "$1ves"], [/^((?:ca|e|ha|(?:our|them|your)?se|she|wo)l|lea|loa|shea|thie)f$/i, "$1ves"]], i: [[/(octop|vir)i$/i, "$1i"]], m: [[/([ti])um$/i, "$1a"]], n: [[/^(oxen)$/i, "$1"]], o: [[/(al|ad|at|er|et|ed)o$/i, "$1oes"]], s: [[/(ax|test)is$/i, "$1es"], [/(alias|status)$/i, "$1es"], [/sis$/i, "ses"], [/(bu)s$/i, "$1ses"], [/(sis)$/i, "ses"], [/^(?!talis|.*hu)(.*)man$/i, "$1men"], [/(octop|vir|radi|nucle|fung|cact|stimul)us$/i, "$1i"]], x: [[/(matr|vert|ind|cort)(ix|ex)$/i, "$1ices"], [/^(ox)$/i, "$1en"]], y: [[/([^aeiouy]|qu)y$/i, "$1ies"]], z: [[/(quiz)$/i, "$1zes"]] }, va = /([xsz]|ch|sh)$/, ya = function(e3 = "", t3) {
        let { irregularPlurals: n2, uncountable: r2 } = t3.two;
        if (r2.hasOwnProperty(e3)) return e3;
        if (n2.hasOwnProperty(e3)) return n2[e3];
        let a2 = function(e4) {
          let t4 = e4[e4.length - 1];
          if (true === ba.hasOwnProperty(t4)) for (let n3 = 0; n3 < ba[t4].length; n3 += 1) {
            let r3 = ba[t4][n3][0];
            if (true === r3.test(e4)) return e4.replace(r3, ba[t4][n3][1]);
          }
          return null;
        }(e3);
        return null !== a2 ? a2 : va.test(e3) ? e3 + "es" : e3 + "s";
      }, wa = /\|/;
      let ka = { "20th century fox": "Organization", "7 eleven": "Organization", "motel 6": "Organization", g8: "Organization", vh1: "Organization", "76ers": "SportsTeam", "49ers": "SportsTeam", q1: "Date", q2: "Date", q3: "Date", q4: "Date", km2: "Unit", m2: "Unit", dm2: "Unit", cm2: "Unit", mm2: "Unit", mile2: "Unit", in2: "Unit", yd2: "Unit", ft2: "Unit", m3: "Unit", dm3: "Unit", cm3: "Unit", in3: "Unit", ft3: "Unit", yd3: "Unit", "at&t": "Organization", "black & decker": "Organization", "h & m": "Organization", "johnson & johnson": "Organization", "procter & gamble": "Organization", "ben & jerry's": "Organization", "&": "Conjunction", i: ["Pronoun", "Singular"], he: ["Pronoun", "Singular"], she: ["Pronoun", "Singular"], it: ["Pronoun", "Singular"], they: ["Pronoun", "Plural"], we: ["Pronoun", "Plural"], was: ["Copula", "PastTense"], is: ["Copula", "PresentTense"], are: ["Copula", "PresentTense"], am: ["Copula", "PresentTense"], were: ["Copula", "PastTense"], her: fa, his: fa, hers: fa, their: fa, theirs: fa, themselves: fa, your: fa, our: fa, ours: fa, my: fa, its: fa, vs: ["Conjunction", "Abbreviation"], if: ["Condition", "Preposition"], closer: "Comparative", closest: "Superlative", much: "Adverb", may: "Modal", babysat: "PastTense", blew: "PastTense", drank: "PastTense", drove: "PastTense", forgave: "PastTense", skiied: "PastTense", spilt: "PastTense", stung: "PastTense", swam: "PastTense", swung: "PastTense", guaranteed: "PastTense", shrunk: "PastTense", nears: "PresentTense", nearing: "Gerund", neared: "PastTense", no: ["Negative", "Expression"] }, Pa = {};
      const Aa = { two: { irregularPlurals: la, uncountable: {} } };
      Object.keys(ua).forEach((e3) => {
        let t3 = function(e4) {
          if (!e4) return {};
          const t4 = e4.split("|").reduce((e5, t5) => {
            const n3 = t5.split("\xA6");
            return e5[n3[0]] = n3[1], e5;
          }, {}), n2 = {};
          return Object.keys(t4).forEach(function(e5) {
            const r2 = pa(t4[e5]);
            "true" === e5 && (e5 = true);
            for (let t5 = 0; t5 < r2.length; t5++) {
              const a2 = r2[t5];
              true === n2.hasOwnProperty(a2) ? false === Array.isArray(n2[a2]) ? n2[a2] = [n2[a2], e5] : n2[a2].push(e5) : n2[a2] = e5;
            }
          }), n2;
        }(ua[e3]);
        wa.test(e3) ? Object.keys(t3).forEach((t4) => {
          if (Pa[t4] = e3, "Noun|Verb" === e3) {
            let e4 = ya(t4, Aa);
            Pa[e4] = "Plural|Verb";
          }
        }) : Object.keys(t3).forEach((t4) => {
          ka[t4] = e3;
        });
      }), [":(", ":)", ":P", ":p", ":O", ";(", ";)", ";P", ";p", ";O", ":3", ":|", ":/", ":\\", ":$", ":*", ":@", ":-(", ":-)", ":-P", ":-p", ":-O", ":-3", ":-|", ":-/", ":-\\", ":-$", ":-*", ":-@", ":^(", ":^)", ":^P", ":^p", ":^O", ":^3", ":^|", ":^/", ":^\\", ":^$", ":^*", ":^@", "):", "(:", "$:", "*:", ")-:", "(-:", "$-:", "*-:", ")^:", "(^:", "$^:", "*^:", "<3", "</3", "<\\3", "=("].forEach((e3) => ka[e3] = "Emoticon"), delete ka[""], delete ka.null, delete ka[" "];
      const Ca = "Singular";
      var Na = { beforeTags: { Determiner: Ca, Possessive: Ca, Acronym: Ca, Noun: Ca, Adjective: Ca, PresentTense: Ca, Gerund: Ca, PastTense: Ca, Infinitive: Ca, Date: Ca, Ordinal: Ca, Demonym: Ca }, afterTags: { Value: Ca, Modal: Ca, Copula: Ca, PresentTense: Ca, PastTense: Ca, Demonym: Ca, Actor: Ca }, beforeWords: { the: Ca, with: Ca, without: Ca, of: Ca, for: Ca, any: Ca, all: Ca, on: Ca, cut: Ca, cuts: Ca, increase: Ca, decrease: Ca, raise: Ca, drop: Ca, save: Ca, saved: Ca, saves: Ca, make: Ca, makes: Ca, made: Ca, minus: Ca, plus: Ca, than: Ca, another: Ca, versus: Ca, neither: Ca, about: Ca, favorite: Ca, best: Ca, daily: Ca, weekly: Ca, linear: Ca, binary: Ca, mobile: Ca, lexical: Ca, technical: Ca, computer: Ca, scientific: Ca, security: Ca, government: Ca, popular: Ca, formal: Ca, no: Ca, more: Ca, one: Ca, let: Ca, her: Ca, his: Ca, their: Ca, our: Ca, us: Ca, sheer: Ca, monthly: Ca, yearly: Ca, current: Ca, previous: Ca, upcoming: Ca, last: Ca, next: Ca, main: Ca, initial: Ca, final: Ca, beginning: Ca, end: Ca, top: Ca, bottom: Ca, future: Ca, past: Ca, major: Ca, minor: Ca, side: Ca, central: Ca, peripheral: Ca, public: Ca, private: Ca }, afterWords: { of: Ca, system: Ca, aid: Ca, method: Ca, utility: Ca, tool: Ca, reform: Ca, therapy: Ca, philosophy: Ca, room: Ca, authority: Ca, says: Ca, said: Ca, wants: Ca, wanted: Ca, is: Ca, did: Ca, do: Ca, can: Ca, wise: Ca } };
      const ja = "Infinitive";
      var xa = { beforeTags: { Modal: ja, Adverb: ja, Negative: ja, Plural: ja }, afterTags: { Determiner: ja, Adverb: ja, Possessive: ja, Reflexive: ja, Preposition: ja, Cardinal: ja, Comparative: ja, Superlative: ja }, beforeWords: { i: ja, we: ja, you: ja, they: ja, to: ja, please: ja, will: ja, have: ja, had: ja, would: ja, could: ja, should: ja, do: ja, did: ja, does: ja, can: ja, must: ja, us: ja, me: ja, let: ja, even: ja, when: ja, help: ja, he: ja, she: ja, it: ja, being: ja, bi: ja, co: ja, contra: ja, de: ja, inter: ja, intra: ja, mis: ja, pre: ja, out: ja, counter: ja, nobody: ja, somebody: ja, anybody: ja, everybody: ja }, afterWords: { the: ja, me: ja, you: ja, him: ja, us: ja, her: ja, his: ja, them: ja, they: ja, it: ja, himself: ja, herself: ja, itself: ja, myself: ja, ourselves: ja, themselves: ja, something: ja, anything: ja, a: ja, an: ja, up: ja, down: ja, by: ja, out: ja, off: ja, under: ja, what: ja, all: ja, to: ja, because: ja, although: ja, how: ja, otherwise: ja, together: ja, though: ja, into: ja, yet: ja, more: ja, here: ja, there: ja, away: ja } };
      const Ia = { beforeTags: Object.assign({}, xa.beforeTags, Na.beforeTags, {}), afterTags: Object.assign({}, xa.afterTags, Na.afterTags, {}), beforeWords: Object.assign({}, xa.beforeWords, Na.beforeWords, {}), afterWords: Object.assign({}, xa.afterWords, Na.afterWords, {}) }, Ta = "Adjective";
      var Da = { beforeTags: { Determiner: Ta, Possessive: Ta, Hyphenated: Ta }, afterTags: { Adjective: Ta }, beforeWords: { seem: Ta, seemed: Ta, seems: Ta, feel: Ta, feels: Ta, felt: Ta, stay: Ta, appear: Ta, appears: Ta, appeared: Ta, also: Ta, over: Ta, under: Ta, too: Ta, it: Ta, but: Ta, still: Ta, really: Ta, quite: Ta, well: Ta, very: Ta, truly: Ta, how: Ta, deeply: Ta, hella: Ta, profoundly: Ta, extremely: Ta, so: Ta, badly: Ta, mostly: Ta, totally: Ta, awfully: Ta, rather: Ta, nothing: Ta, something: Ta, anything: Ta, not: Ta, me: Ta, is: Ta, face: Ta, faces: Ta, faced: Ta, look: Ta, looks: Ta, looked: Ta, reveal: Ta, reveals: Ta, revealed: Ta, sound: Ta, sounded: Ta, sounds: Ta, remains: Ta, remained: Ta, prove: Ta, proves: Ta, proved: Ta, becomes: Ta, stays: Ta, tastes: Ta, taste: Ta, smells: Ta, smell: Ta, gets: Ta, grows: Ta, as: Ta, rings: Ta, radiates: Ta, conveys: Ta, convey: Ta, conveyed: Ta, of: Ta }, afterWords: { too: Ta, also: Ta, or: Ta, enough: Ta, as: Ta } };
      const Ha = "Gerund";
      var Ea = { beforeTags: { Adverb: Ha, Preposition: Ha, Conjunction: Ha }, afterTags: { Adverb: Ha, Possessive: Ha, Person: Ha, Pronoun: Ha, Determiner: Ha, Copula: Ha, Preposition: Ha, Conjunction: Ha, Comparative: Ha }, beforeWords: { been: Ha, keep: Ha, continue: Ha, stop: Ha, am: Ha, be: Ha, me: Ha, began: Ha, start: Ha, starts: Ha, started: Ha, stops: Ha, stopped: Ha, help: Ha, helps: Ha, avoid: Ha, avoids: Ha, love: Ha, loves: Ha, loved: Ha, hate: Ha, hates: Ha, hated: Ha }, afterWords: { you: Ha, me: Ha, her: Ha, him: Ha, his: Ha, them: Ha, their: Ha, it: Ha, this: Ha, there: Ha, on: Ha, about: Ha, for: Ha, up: Ha, down: Ha } };
      const Ga = "Gerund", Oa = "Adjective", Fa = { beforeTags: Object.assign({}, Da.beforeTags, Ea.beforeTags, { Imperative: Ga, Infinitive: Oa, Plural: Ga }), afterTags: Object.assign({}, Da.afterTags, Ea.afterTags, { Noun: Oa }), beforeWords: Object.assign({}, Da.beforeWords, Ea.beforeWords, { is: Oa, are: Ga, was: Oa, of: Oa, suggest: Ga, suggests: Ga, suggested: Ga, recommend: Ga, recommends: Ga, recommended: Ga, imagine: Ga, imagines: Ga, imagined: Ga, consider: Ga, considered: Ga, considering: Ga, resist: Ga, resists: Ga, resisted: Ga, avoid: Ga, avoided: Ga, avoiding: Ga, except: Oa, accept: Oa, assess: Ga, explore: Ga, fear: Ga, fears: Ga, appreciate: Ga, question: Ga, help: Ga, embrace: Ga, with: Oa }), afterWords: Object.assign({}, Da.afterWords, Ea.afterWords, { to: Ga, not: Ga, the: Ga }) }, Va = { beforeTags: { Determiner: void 0, Cardinal: "Noun", PhrasalVerb: "Adjective" }, afterTags: {} }, za = { beforeTags: Object.assign({}, Da.beforeTags, Na.beforeTags, Va.beforeTags), afterTags: Object.assign({}, Da.afterTags, Na.afterTags, Va.afterTags), beforeWords: Object.assign({}, Da.beforeWords, Na.beforeWords, { are: "Adjective", is: "Adjective", was: "Adjective", be: "Adjective", off: "Adjective", out: "Adjective" }), afterWords: Object.assign({}, Da.afterWords, Na.afterWords) };
      let Ba = "PastTense", Sa = "Adjective";
      const $a = { beforeTags: { Adverb: Ba, Pronoun: Ba, ProperNoun: Ba, Auxiliary: Ba, Noun: Ba }, afterTags: { Possessive: Ba, Pronoun: Ba, Determiner: Ba, Adverb: Ba, Comparative: Ba, Date: Ba, Gerund: Ba }, beforeWords: { be: Ba, who: Ba, get: Sa, had: Ba, has: Ba, have: Ba, been: Ba, it: Ba, as: Ba, for: Sa, more: Sa, always: Sa }, afterWords: { by: Ba, back: Ba, out: Ba, in: Ba, up: Ba, down: Ba, before: Ba, after: Ba, for: Ba, the: Ba, with: Ba, as: Ba, on: Ba, at: Ba, between: Ba, to: Ba, into: Ba, us: Ba, them: Ba, his: Ba, her: Ba, their: Ba, our: Ba, me: Ba, about: Sa } };
      var Ma = { beforeTags: Object.assign({}, Da.beforeTags, $a.beforeTags), afterTags: Object.assign({}, Da.afterTags, $a.afterTags), beforeWords: Object.assign({}, Da.beforeWords, $a.beforeWords), afterWords: Object.assign({}, Da.afterWords, $a.afterWords) };
      const Ka = { afterTags: { Noun: "Adjective", Conjunction: void 0 } }, La = { beforeTags: Object.assign({}, Da.beforeTags, xa.beforeTags, { Adverb: void 0, Negative: void 0 }), afterTags: Object.assign({}, Da.afterTags, xa.afterTags, Ka.afterTags), beforeWords: Object.assign({}, Da.beforeWords, xa.beforeWords, { have: void 0, had: void 0, not: void 0, went: "Adjective", goes: "Adjective", got: "Adjective", be: "Adjective" }), afterWords: Object.assign({}, Da.afterWords, xa.afterWords, { to: void 0, as: "Adjective" }) }, Ja = { Copula: "Gerund", PastTense: "Gerund", PresentTense: "Gerund", Infinitive: "Gerund" }, Wa = { Value: "Gerund" }, qa = { are: "Gerund", were: "Gerund", be: "Gerund", no: "Gerund", without: "Gerund", you: "Gerund", we: "Gerund", they: "Gerund", he: "Gerund", she: "Gerund", us: "Gerund", them: "Gerund" }, Ua = { the: "Gerund", this: "Gerund", that: "Gerund", me: "Gerund", us: "Gerund", them: "Gerund" }, Ra = { beforeTags: Object.assign({}, Ea.beforeTags, Na.beforeTags, Ja), afterTags: Object.assign({}, Ea.afterTags, Na.afterTags, Wa), beforeWords: Object.assign({}, Ea.beforeWords, Na.beforeWords, qa), afterWords: Object.assign({}, Ea.afterWords, Na.afterWords, Ua) }, Qa = "Singular", Za = "Infinitive", _a = { beforeTags: Object.assign({}, xa.beforeTags, Na.beforeTags, { Adjective: Qa, Particle: Qa }), afterTags: Object.assign({}, xa.afterTags, Na.afterTags, { ProperNoun: Za, Gerund: Za, Adjective: Za, Copula: Qa }), beforeWords: Object.assign({}, xa.beforeWords, Na.beforeWords, { is: Qa, was: Qa, of: Qa, have: null }), afterWords: Object.assign({}, xa.afterWords, Na.afterWords, { instead: Za, about: Za, his: Za, her: Za, to: null, by: null, in: null }) }, Xa = "Person";
      var Ya = { beforeTags: { Honorific: Xa, Person: Xa }, afterTags: { Person: Xa, ProperNoun: Xa, Verb: Xa }, ownTags: { ProperNoun: Xa }, beforeWords: { hi: Xa, hey: Xa, yo: Xa, dear: Xa, hello: Xa }, afterWords: { said: Xa, says: Xa, told: Xa, tells: Xa, feels: Xa, felt: Xa, seems: Xa, thinks: Xa, thought: Xa, spends: Xa, spendt: Xa, plays: Xa, played: Xa, sing: Xa, sang: Xa, learn: Xa, learned: Xa, wants: Xa, wanted: Xa } };
      const eo = "Month", to = { beforeTags: { Date: eo, Value: eo }, afterTags: { Date: eo, Value: eo }, beforeWords: { by: eo, in: eo, on: eo, during: eo, after: eo, before: eo, between: eo, until: eo, til: eo, sometime: eo, of: eo, this: eo, next: eo, last: eo, previous: eo, following: eo, with: "Person" }, afterWords: { sometime: eo, in: eo, of: eo, until: eo, the: eo } };
      var no = { beforeTags: Object.assign({}, Ya.beforeTags, to.beforeTags), afterTags: Object.assign({}, Ya.afterTags, to.afterTags), beforeWords: Object.assign({}, Ya.beforeWords, to.beforeWords), afterWords: Object.assign({}, Ya.afterWords, to.afterWords) };
      const ro = "Place", ao = { beforeTags: { Place: ro }, afterTags: { Place: ro, Abbreviation: ro }, beforeWords: { in: ro, by: ro, near: ro, from: ro, to: ro }, afterWords: { in: ro, by: ro, near: ro, from: ro, to: ro, government: ro, council: ro, region: ro, city: ro } };
      let oo = "Unit";
      const io = { "Actor|Verb": Ia, "Adj|Gerund": Fa, "Adj|Noun": za, "Adj|Past": Ma, "Adj|Present": La, "Noun|Verb": _a, "Noun|Gerund": Ra, "Person|Noun": { beforeTags: Object.assign({}, Na.beforeTags, Ya.beforeTags), afterTags: Object.assign({}, Na.afterTags, Ya.afterTags), beforeWords: Object.assign({}, Na.beforeWords, Ya.beforeWords, { i: "Infinitive", we: "Infinitive" }), afterWords: Object.assign({}, Na.afterWords, Ya.afterWords) }, "Person|Date": no, "Person|Verb": { beforeTags: Object.assign({}, Na.beforeTags, Ya.beforeTags, xa.beforeTags), afterTags: Object.assign({}, Na.afterTags, Ya.afterTags, xa.afterTags), beforeWords: Object.assign({}, Na.beforeWords, Ya.beforeWords, xa.beforeWords), afterWords: Object.assign({}, Na.afterWords, Ya.afterWords, xa.afterWords) }, "Person|Place": { beforeTags: Object.assign({}, ao.beforeTags, Ya.beforeTags), afterTags: Object.assign({}, ao.afterTags, Ya.afterTags), beforeWords: Object.assign({}, ao.beforeWords, Ya.beforeWords), afterWords: Object.assign({}, ao.afterWords, Ya.afterWords) }, "Person|Adj": { beforeTags: Object.assign({}, Ya.beforeTags, Da.beforeTags), afterTags: Object.assign({}, Ya.afterTags, Da.afterTags), beforeWords: Object.assign({}, Ya.beforeWords, Da.beforeWords), afterWords: Object.assign({}, Ya.afterWords, Da.afterWords) }, "Unit|Noun": { beforeTags: { Value: oo }, afterTags: {}, beforeWords: { per: oo, every: oo, each: oo, square: oo, cubic: oo, sq: oo, metric: oo }, afterWords: { per: oo, squared: oo, cubed: oo, long: oo } } }, so = (e3, t3) => {
        let n2 = Object.keys(e3).reduce((t4, n3) => (t4[n3] = "Infinitive" === e3[n3] ? "PresentTense" : "Plural", t4), {});
        return Object.assign(n2, t3);
      };
      io["Plural|Verb"] = { beforeWords: so(io["Noun|Verb"].beforeWords, { had: "Plural", have: "Plural" }), afterWords: so(io["Noun|Verb"].afterWords, { his: "PresentTense", her: "PresentTense", its: "PresentTense", in: null, to: null, is: "PresentTense", by: "PresentTense" }), beforeTags: so(io["Noun|Verb"].beforeTags, { Conjunction: "PresentTense", Noun: void 0, ProperNoun: "PresentTense" }), afterTags: so(io["Noun|Verb"].afterTags, { Gerund: "Plural", Noun: "PresentTense", Value: "PresentTense" }) };
      const lo = "Adjective", uo = "Infinitive", co = "PresentTense", ho = "Singular", go = "PastTense", mo = "Adverb", po = "Plural", fo = "Actor", bo = "Verb", vo = "Noun", yo = "LastName", wo = "Modal", ko = "Place", Po = "Participle";
      var Ao = [null, null, { ea: ho, ia: vo, ic: lo, ly: mo, "'n": bo, "'t": bo }, { oed: go, ued: go, xed: go, " so": mo, "'ll": wo, "'re": "Copula", azy: lo, eer: vo, end: bo, ped: go, ffy: lo, ify: uo, ing: "Gerund", ize: uo, ibe: uo, lar: lo, mum: lo, nes: co, nny: lo, ous: lo, que: lo, ger: vo, ber: vo, rol: ho, sis: ho, ogy: ho, oid: ho, ian: ho, zes: co, eld: go, ken: Po, ven: Po, ten: Po, ect: uo, ict: uo, ign: uo, oze: uo, ful: lo, bal: lo, ton: vo, pur: ko }, { amed: go, aped: go, ched: go, lked: go, rked: go, reed: go, nded: go, mned: lo, cted: go, dged: go, ield: ho, akis: yo, cede: uo, chuk: yo, czyk: yo, ects: co, iend: ho, ends: bo, enko: yo, ette: ho, iary: ho, wner: ho, fies: co, fore: mo, gate: uo, gone: lo, ices: po, ints: po, ruct: uo, ines: po, ions: po, ners: po, pers: po, lers: po, less: lo, llen: lo, made: lo, nsen: yo, oses: co, ould: wo, some: lo, sson: yo, ians: po, tion: ho, tage: vo, ique: ho, tive: lo, tors: vo, vice: ho, lier: ho, fier: ho, wned: go, gent: ho, tist: fo, pist: fo, rist: fo, mist: fo, yist: fo, vist: fo, ists: fo, lite: ho, site: ho, rite: ho, mite: ho, bite: ho, mate: ho, date: ho, ndal: ho, vent: ho, uist: fo, gist: fo, note: ho, cide: ho, ence: ho, wide: lo, vide: uo, ract: uo, duce: uo, pose: uo, eive: uo, lyze: uo, lyse: uo, iant: lo, nary: lo, ghty: lo, uent: lo, erer: fo, bury: ko, dorf: vo, esty: vo, wych: ko, dale: ko, folk: ko, vale: ko, abad: ko, sham: ko, wick: ko, view: ko }, { elist: fo, holic: ho, phite: ho, tized: go, urned: go, eased: go, ances: po, bound: lo, ettes: po, fully: mo, ishes: co, ities: po, marek: yo, nssen: yo, ology: vo, osome: ho, tment: ho, ports: po, rough: lo, tches: co, tieth: "Ordinal", tures: po, wards: mo, where: mo, archy: vo, pathy: vo, opoly: vo, embly: vo, phate: vo, ndent: ho, scent: ho, onist: fo, anist: fo, alist: fo, olist: fo, icist: fo, ounce: uo, iable: lo, borne: lo, gnant: lo, inant: lo, igent: lo, atory: lo, rient: ho, dient: ho, maker: fo, burgh: ko, mouth: ko, ceter: ko, ville: ko, hurst: ko, stead: ko, endon: ko, brook: ko, shire: ko, worth: vo, field: "ProperNoun", ridge: ko }, { auskas: yo, parent: ho, cedent: ho, ionary: ho, cklist: ho, brooke: ko, keeper: fo, logist: fo, teenth: "Value", worker: fo, master: fo, writer: fo, brough: ko, cester: ko, ington: ko, cliffe: ko, ingham: ko }, { chester: ko, logists: fo, opoulos: yo, borough: ko, sdottir: yo }];
      const Co = "Adjective", No = "Noun", jo = "Verb";
      var xo = [null, null, {}, { neo: No, bio: No, "de-": jo, "re-": jo, "un-": jo, "ex-": No }, { anti: No, auto: No, faux: Co, hexa: No, kilo: No, mono: No, nano: No, octa: No, poly: No, semi: Co, tele: No, "pro-": Co, "mis-": jo, "dis-": jo, "pre-": Co }, { anglo: No, centi: No, ethno: No, ferro: No, grand: No, hepta: No, hydro: No, intro: No, macro: No, micro: No, milli: No, nitro: No, penta: No, quasi: Co, radio: No, tetra: No, "omni-": Co, "post-": Co }, { pseudo: Co, "extra-": Co, "hyper-": Co, "inter-": Co, "intra-": Co, "deca-": Co }, { electro: No }];
      const Io = "Adjective", To = "Infinitive", Do = "PresentTense", Ho = "Singular", Eo = "PastTense", Go = "Adverb", Oo = "Expression", Fo = "Actor", Vo = "Verb", zo = "Noun", Bo = "LastName";
      var So = { a: [[/.[aeiou]na$/, zo, "tuna"], [/.[oau][wvl]ska$/, Bo], [/.[^aeiou]ica$/, Ho, "harmonica"], [/^([hyj]a+)+$/, Oo, "haha"]], c: [[/.[^aeiou]ic$/, Io]], d: [[/[aeiou](pp|ll|ss|ff|gg|tt|rr|bb|nn|mm)ed$/, Eo, "popped"], [/.[aeo]{2}[bdgmnprvz]ed$/, Eo, "rammed"], [/.[aeiou][sg]hed$/, Eo, "gushed"], [/.[aeiou]red$/, Eo, "hired"], [/.[aeiou]r?ried$/, Eo, "hurried"], [/[^aeiou]ard$/, Ho, "steward"], [/[aeiou][^aeiou]id$/, Io, ""], [/.[vrl]id$/, Io, "livid"], [/..led$/, Eo, "hurled"], [/.[iao]sed$/, Eo, ""], [/[aeiou]n?[cs]ed$/, Eo, ""], [/[aeiou][rl]?[mnf]ed$/, Eo, ""], [/[aeiou][ns]?c?ked$/, Eo, "bunked"], [/[aeiou]gned$/, Eo], [/[aeiou][nl]?ged$/, Eo], [/.[tdbwxyz]ed$/, Eo], [/[^aeiou][aeiou][tvx]ed$/, Eo], [/.[cdflmnprstv]ied$/, Eo, "emptied"]], e: [[/.[lnr]ize$/, To, "antagonize"], [/.[^aeiou]ise$/, To, "antagonise"], [/.[aeiou]te$/, To, "bite"], [/.[^aeiou][ai]ble$/, Io, "fixable"], [/.[^aeiou]eable$/, Io, "maleable"], [/.[ts]ive$/, Io, "festive"], [/[a-z]-like$/, Io, "woman-like"]], h: [[/.[^aeiouf]ish$/, Io, "cornish"], [/.v[iy]ch$/, Bo, "..ovich"], [/^ug?h+$/, Oo, "ughh"], [/^uh[ -]?oh$/, Oo, "uhoh"], [/[a-z]-ish$/, Io, "cartoon-ish"]], i: [[/.[oau][wvl]ski$/, Bo, "polish-male"]], k: [[/^(k){2}$/, Oo, "kkkk"]], l: [[/.[gl]ial$/, Io, "familial"], [/.[^aeiou]ful$/, Io, "fitful"], [/.[nrtumcd]al$/, Io, "natal"], [/.[^aeiou][ei]al$/, Io, "familial"]], m: [[/.[^aeiou]ium$/, Ho, "magnesium"], [/[^aeiou]ism$/, Ho, "schism"], [/^[hu]m+$/, Oo, "hmm"], [/^\d+ ?[ap]m$/, "Date", "3am"]], n: [[/.[lsrnpb]ian$/, Io, "republican"], [/[^aeiou]ician$/, Fo, "musician"], [/[aeiou][ktrp]in'$/, "Gerund", "cookin'"]], o: [[/^no+$/, Oo, "noooo"], [/^(yo)+$/, Oo, "yoo"], [/^wo{2,}[pt]?$/, Oo, "woop"]], r: [[/.[bdfklmst]ler$/, "Noun"], [/[aeiou][pns]er$/, Ho], [/[^i]fer$/, To], [/.[^aeiou][ao]pher$/, Fo], [/.[lk]er$/, "Noun"], [/.ier$/, "Comparative"]], t: [[/.[di]est$/, "Superlative"], [/.[icldtgrv]ent$/, Io], [/[aeiou].*ist$/, Io], [/^[a-z]et$/, Vo]], s: [[/.[^aeiou]ises$/, Do], [/.[rln]ates$/, Do], [/.[^z]ens$/, Vo], [/.[lstrn]us$/, Ho], [/.[aeiou]sks$/, Do], [/.[aeiou]kes$/, Do], [/[aeiou][^aeiou]is$/, Ho], [/[a-z]'s$/, zo], [/^yes+$/, Oo]], v: [[/.[^aeiou][ai][kln]ov$/, Bo]], y: [[/.[cts]hy$/, Io], [/.[st]ty$/, Io], [/.[tnl]ary$/, Io], [/.[oe]ry$/, Ho], [/[rdntkbhs]ly$/, Go], [/.(gg|bb|zz)ly$/, Io], [/...lly$/, Go], [/.[gk]y$/, Io], [/[bszmp]{2}y$/, Io], [/.[ai]my$/, Io], [/[ea]{2}zy$/, Io], [/.[^aeiou]ity$/, Ho]] };
      const $o = "Verb", Mo = "Noun";
      var Ko = { leftTags: [["Adjective", Mo], ["Possessive", Mo], ["Determiner", Mo], ["Adverb", $o], ["Pronoun", $o], ["Value", Mo], ["Ordinal", Mo], ["Modal", $o], ["Superlative", Mo], ["Demonym", Mo], ["Honorific", "Person"]], leftWords: [["i", $o], ["first", Mo], ["it", $o], ["there", $o], ["not", $o], ["because", Mo], ["if", Mo], ["but", Mo], ["who", $o], ["this", Mo], ["his", Mo], ["when", Mo], ["you", $o], ["very", "Adjective"], ["old", Mo], ["never", $o], ["before", Mo], ["a", Mo], ["the", Mo], ["been", $o]], rightTags: [["Copula", Mo], ["PastTense", Mo], ["Conjunction", Mo], ["Modal", Mo]], rightWords: [["there", $o], ["me", $o], ["man", "Adjective"], ["him", $o], ["it", $o], ["were", Mo], ["took", Mo], ["himself", $o], ["went", Mo], ["who", Mo], ["jr", "Person"]] }, Lo = { fwd: "3:ser,ier\xA61er:h,t,f,l,n\xA61r:e\xA62er:ss,or,om", both: "3er:ver,ear,alm\xA63ner:hin\xA63ter:lat\xA62mer:im\xA62er:ng,rm,mb\xA62ber:ib\xA62ger:ig\xA61er:w,p,k,d\xA6ier:y", rev: "1:tter,yer\xA62:uer,ver,ffer,oner,eler,ller,iler,ster,cer,uler,sher,ener,gher,aner,adder,nter,eter,rter,hter,rner,fter\xA63:oser,ooler,eafer,user,airer,bler,maler,tler,eater,uger,rger,ainer,urer,ealer,icher,pler,emner,icter,nser,iser\xA64:arser,viner,ucher,rosser,somer,ndomer,moter,oother,uarer,hiter\xA65:nuiner,esser,emier\xA6ar:urther", ex: "worse:bad\xA6better:good\xA64er:fair,gray,poor\xA61urther:far\xA63ter:fat,hot,wet\xA63der:mad,sad\xA63er:shy,fun\xA64der:glad\xA6:\xA64r:cute,dire,fake,fine,free,lame,late,pale,rare,ripe,rude,safe,sore,tame,wide\xA65r:eerie,stale" }, Jo = { fwd: "1:nning,tting,rring,pping,eing,mming,gging,dding,bbing,kking\xA62:eking,oling,eling,eming\xA63:velling,siting,uiting,fiting,loting,geting,ialing,celling\xA64:graming", both: "1:aing,iing,fing,xing,ying,oing,hing,wing\xA62:tzing,rping,izzing,bting,mning,sping,wling,rling,wding,rbing,uping,lming,wning,mping,oning,lting,mbing,lking,fting,hting,sking,gning,pting,cking,ening,nking,iling,eping,ering,rting,rming,cting,lping,ssing,nting,nding,lding,sting,rning,rding,rking\xA63:belling,siping,toming,yaking,uaking,oaning,auling,ooping,aiding,naping,euring,tolling,uzzing,ganing,haning,ualing,halling,iasing,auding,ieting,ceting,ouling,voring,ralling,garing,joring,oaming,oaking,roring,nelling,ooring,uelling,eaming,ooding,eaping,eeting,ooting,ooming,xiting,keting,ooking,ulling,airing,oaring,biting,outing,oiting,earing,naling,oading,eeding,ouring,eaking,aiming,illing,oining,eaning,onging,ealing,aining,eading\xA64:thoming,melling,aboring,ivoting,weating,dfilling,onoring,eriting,imiting,tialling,rgining,otoring,linging,winging,lleting,louding,spelling,mpelling,heating,feating,opelling,choring,welling,ymaking,ctoring,calling,peating,iloring,laiting,utoring,uditing,mmaking,loating,iciting,waiting,mbating,voiding,otalling,nsoring,nselling,ocusing,itoring,eloping\xA65:rselling,umpeting,atrolling,treating,tselling,rpreting,pringing,ummeting,ossoming,elmaking,eselling,rediting,totyping,onmaking,rfeiting,ntrolling\xA65e:chmaking,dkeeping,severing,erouting,ecreting,ephoning,uthoring,ravening,reathing,pediting,erfering,eotyping,fringing,entoring,ombining,ompeting\xA64e:emaking,eething,twining,rruling,chuting,xciting,rseding,scoping,edoring,pinging,lunging,agining,craping,pleting,eleting,nciting,nfining,ncoding,tponing,ecoding,writing,esaling,nvening,gnoring,evoting,mpeding,rvening,dhering,mpiling,storing,nviting,ploring\xA63e:tining,nuring,saking,miring,haling,ceding,xuding,rining,nuting,laring,caring,miling,riding,hoking,piring,lading,curing,uading,noting,taping,futing,paring,hading,loding,siring,guring,vading,voking,during,niting,laning,caping,luting,muting,ruding,ciding,juring,laming,caling,hining,uoting,liding,ciling,duling,tuting,puting,cuting,coring,uiding,tiring,turing,siding,rading,enging,haping,buting,lining,taking,anging,haring,uiring,coming,mining,moting,suring,viding,luding\xA62e:tring,zling,uging,oging,gling,iging,vring,fling,lging,obing,psing,pling,ubing,cling,dling,wsing,iking,rsing,dging,kling,ysing,tling,rging,eging,nsing,uning,osing,uming,using,ibing,bling,aging,ising,asing,ating\xA62ie:rlying\xA61e:zing,uing,cing,ving", rev: "ying:ie\xA61ing:se,ke,te,we,ne,re,de,pe,me,le,c,he\xA62ing:ll,ng,dd,ee,ye,oe,rg,us\xA62ning:un\xA62ging:og,ag,ug,ig,eg\xA62ming:um\xA62bing:ub,ab,eb,ob\xA63ning:lan,can,hin,pin,win\xA63ring:cur,lur,tir,tar,pur,car\xA63ing:ait,del,eel,fin,eat,oat,eem,lel,ool,ein,uin\xA63ping:rop,rap,top,uip,wap,hip,hop,lap,rip,cap\xA63ming:tem,wim,rim,kim,lim\xA63ting:mat,cut,pot,lit,lot,hat,set,pit,put\xA63ding:hed,bed,bid\xA63king:rek\xA63ling:cil,pel\xA63bing:rib\xA64ning:egin\xA64ing:isit,ruit,ilot,nsit,dget,rkel,ival,rcel\xA64ring:efer,nfer\xA64ting:rmit,mmit,ysit,dmit,emit,bmit,tfit,gret\xA64ling:evel,xcel,ivel\xA64ding:hred\xA65ing:arget,posit,rofit\xA65ring:nsfer\xA65ting:nsmit,orget,cquit\xA65ling:ancel,istil", ex: "3:adding,eating,aiming,aiding,airing,outing,gassing,setting,getting,putting,cutting,winning,sitting,betting,mapping,tapping,letting,bidding,hitting,tanning,netting,popping,fitting,capping,lapping,barring,banning,vetting,topping,rotting,tipping,potting,wetting,pitting,dipping,budding,hemming,pinning,jetting,kidding,padding,podding,sipping,wedding,bedding,donning,warring,penning,gutting,cueing,wadding,petting,ripping,napping,matting,tinning,binning,dimming,hopping,mopping,nodding,panning,rapping,ridding,sinning\xA64:selling,falling,calling,waiting,editing,telling,rolling,heating,boating,hanging,beating,coating,singing,tolling,felling,polling,discing,seating,voiding,gelling,yelling,baiting,reining,ruining,seeking,spanning,stepping,knitting,emitting,slipping,quitting,dialing,omitting,clipping,shutting,skinning,abutting,flipping,trotting,cramming,fretting,suiting\xA65:bringing,treating,spelling,stalling,trolling,expelling,rivaling,wringing,deterring,singeing,befitting,refitting\xA66:enrolling,distilling,scrolling,strolling,caucusing,travelling\xA67:installing,redefining,stencilling,recharging,overeating,benefiting,unraveling,programing\xA69:reprogramming\xA6is:being\xA62e:using,aging,owing\xA63e:making,taking,coming,noting,hiring,filing,coding,citing,doping,baking,coping,hoping,lading,caring,naming,voting,riding,mining,curing,lining,ruling,typing,boring,dining,firing,hiding,piling,taping,waning,baling,boning,faring,honing,wiping,luring,timing,wading,piping,fading,biting,zoning,daring,waking,gaming,raking,ceding,tiring,coking,wining,joking,paring,gaping,poking,pining,coring,liming,toting,roping,wiring,aching\xA64e:writing,storing,eroding,framing,smoking,tasting,wasting,phoning,shaking,abiding,braking,flaking,pasting,priming,shoring,sloping,withing,hinging\xA65e:defining,refining,renaming,swathing,fringing,reciting\xA61ie:dying,tying,lying,vying\xA67e:sunbathing" }, Wo = { fwd: "1:mt\xA62:llen\xA63:iven,aken\xA6:ne\xA6y:in", both: "1:wn\xA62:me,aten\xA63:seen,bidden,isen\xA64:roven,asten\xA63l:pilt\xA63d:uilt\xA62e:itten\xA61im:wum\xA61eak:poken\xA61ine:hone\xA61ose:osen\xA61in:gun\xA61ake:woken\xA6ear:orn\xA6eal:olen\xA6eeze:ozen\xA6et:otten\xA6ink:unk\xA6ing:ung", rev: "2:un\xA6oken:eak\xA6ought:eek\xA6oven:eave\xA61ne:o\xA61own:ly\xA61den:de\xA61in:ay\xA62t:am\xA62n:ee\xA63en:all\xA64n:rive,sake,take\xA65n:rgive", ex: "2:been\xA63:seen,run\xA64:given,taken\xA65:shaken\xA62eak:broken\xA61ive:dove\xA62y:flown\xA63e:hidden,ridden\xA61eek:sought\xA61ake:woken\xA61eave:woven" }, qo = { fwd: "1:oes\xA61ve:as", both: "1:xes\xA62:zzes,ches,shes,sses\xA63:iases\xA62y:llies,plies\xA61y:cies,bies,ties,vies,nies,pies,dies,ries,fies\xA6:s", rev: "1ies:ly\xA62es:us,go,do\xA63es:cho,eto", ex: "2:does,goes\xA63:gasses\xA65:focuses\xA6is:are\xA63y:relies\xA62y:flies\xA62ve:has" }, Uo = { fwd: "1st:e\xA61est:l,m,f,s\xA61iest:cey\xA62est:or,ir\xA63est:ver", both: "4:east\xA65:hwest\xA65lest:erful\xA64est:weet,lgar,tter,oung\xA64most:uter\xA63est:ger,der,rey,iet,ong,ear\xA63test:lat\xA63most:ner\xA62est:pt,ft,nt,ct,rt,ht\xA62test:it\xA62gest:ig\xA61est:b,k,n,p,h,d,w\xA6iest:y", rev: "1:ttest,nnest,yest\xA62:sest,stest,rmest,cest,vest,lmest,olest,ilest,ulest,ssest,imest,uest\xA63:rgest,eatest,oorest,plest,allest,urest,iefest,uelest,blest,ugest,amest,yalest,ealest,illest,tlest,itest\xA64:cerest,eriest,somest,rmalest,ndomest,motest,uarest,tiffest\xA65:leverest,rangest\xA6ar:urthest\xA63ey:riciest", ex: "best:good\xA6worst:bad\xA65est:great\xA64est:fast,full,fair,dull\xA63test:hot,wet,fat\xA64nest:thin\xA61urthest:far\xA63est:gay,shy,ill\xA64test:neat\xA64st:late,wide,fine,safe,cute,fake,pale,rare,rude,sore,ripe,dire\xA66st:severe" }, Ro = { fwd: "1:tistic,eable,lful,sful,ting,tty\xA62:onate,rtable,geous,ced,seful,ctful\xA63:ortive,ented\xA6arity:ear\xA6y:etic\xA6fulness:begone\xA61ity:re\xA61y:tiful,gic\xA62ity:ile,imous,ilous,ime\xA62ion:ated\xA62eness:iving\xA62y:trious\xA62ation:iring\xA62tion:vant\xA63ion:ect\xA63ce:mant,mantic\xA63tion:irable\xA63y:est,estic\xA63m:mistic,listic\xA63ess:ning\xA64n:utious\xA64on:rative,native,vative,ective\xA64ce:erant", both: "1:king,wing\xA62:alous,ltuous,oyful,rdous\xA63:gorous,ectable,werful,amatic\xA64:oised,usical,agical,raceful,ocused,lined,ightful\xA65ness:stful,lding,itous,nuous,ulous,otous,nable,gious,ayful,rvous,ntous,lsive,peful,entle,ciful,osive,leful,isive,ncise,reful,mious\xA65ty:ivacious\xA65ties:ubtle\xA65ce:ilient,adiant,atient\xA65cy:icient\xA65sm:gmatic\xA65on:sessive,dictive\xA65ity:pular,sonal,eative,entic\xA65sity:uminous\xA65ism:conic\xA65nce:mperate\xA65ility:mitable\xA65ment:xcited\xA65n:bitious\xA64cy:brant,etent,curate\xA64ility:erable,acable,icable,ptable\xA64ty:nacious,aive,oyal,dacious\xA64n:icious\xA64ce:vient,erent,stent,ndent,dient,quent,ident\xA64ness:adic,ound,hing,pant,sant,oing,oist,tute\xA64icity:imple\xA64ment:fined,mused\xA64ism:otic\xA64ry:dantic\xA64ity:tund,eral\xA64edness:hand\xA64on:uitive\xA64lity:pitable\xA64sm:eroic,namic\xA64sity:nerous\xA63th:arm\xA63ility:pable,bable,dable,iable\xA63cy:hant,nant,icate\xA63ness:red,hin,nse,ict,iet,ite,oud,ind,ied,rce\xA63ion:lute\xA63ity:ual,gal,volous,ial\xA63ce:sent,fensive,lant,gant,gent,lent,dant\xA63on:asive\xA63m:fist,sistic,iastic\xA63y:terious,xurious,ronic,tastic\xA63ur:amorous\xA63e:tunate\xA63ation:mined\xA63sy:rteous\xA63ty:ain\xA63ry:ave\xA63ment:azed\xA62ness:de,on,ue,rn,ur,ft,rp,pe,om,ge,rd,od,ay,ss,er,ll,oy,ap,ht,ld,ad,rt\xA62inousness:umous\xA62ity:neous,ene,id,ane\xA62cy:bate,late\xA62ation:ized\xA62ility:oble,ible\xA62y:odic\xA62e:oving,aring\xA62s:ost\xA62itude:pt\xA62dom:ee\xA62ance:uring\xA62tion:reet\xA62ion:oted\xA62sion:ending\xA62liness:an\xA62or:rdent\xA61th:ung\xA61e:uable\xA61ness:w,h,k,f\xA61ility:mble\xA61or:vent\xA61ement:ging\xA61tiquity:ncient\xA61ment:hed\xA6verty:or\xA6ength:ong\xA6eat:ot\xA6pth:ep\xA6iness:y", rev: "", ex: "5:forceful,humorous\xA68:charismatic\xA613:understanding\xA65ity:active\xA611ness:adventurous,inquisitive,resourceful\xA68on:aggressive,automatic,perceptive\xA67ness:amorous,fatuous,furtive,ominous,serious\xA65ness:ample,sweet\xA612ness:apprehensive,cantankerous,contemptuous,ostentatious\xA613ness:argumentative,conscientious\xA69ness:assertive,facetious,imperious,inventive,oblivious,rapacious,receptive,seditious,whimsical\xA610ness:attractive,expressive,impressive,loquacious,salubrious,thoughtful\xA63edom:boring\xA64ness:calm,fast,keen,tame\xA68ness:cheerful,gracious,specious,spurious,timorous,unctuous\xA65sity:curious\xA69ion:deliberate\xA68ion:desperate\xA66e:expensive\xA67ce:fragrant\xA63y:furious\xA69ility:ineluctable\xA66ism:mystical\xA68ity:physical,proactive,sensitive,vertical\xA65cy:pliant\xA67ity:positive\xA69ity:practical\xA612ism:professional\xA66ce:prudent\xA63ness:red\xA66cy:vagrant\xA63dom:wise" };
      const Qo = function(e3 = "", t3 = {}) {
        let n2 = function(e4, t4 = {}) {
          return t4.hasOwnProperty(e4) ? t4[e4] : null;
        }(e3, t3.ex);
        return n2 = n2 || function(e4, t4 = []) {
          for (let n3 = 0; n3 < t4.length; n3 += 1) if (e4.endsWith(t4[n3])) return e4;
          return null;
        }(e3, t3.same), n2 = n2 || function(e4, t4, n3 = {}) {
          t4 = t4 || {};
          for (let r2 = e4.length - 1; r2 >= 1; r2 -= 1) {
            let a2 = e4.length - r2, o2 = e4.substring(a2, e4.length);
            if (true === t4.hasOwnProperty(o2)) return e4.slice(0, a2) + t4[o2];
            if (true === n3.hasOwnProperty(o2)) return e4.slice(0, a2) + n3[o2];
          }
          return t4.hasOwnProperty("") ? e4 + t4[""] : n3.hasOwnProperty("") ? e4 + n3[""] : null;
        }(e3, t3.fwd, t3.both), n2 = n2 || e3, n2;
      }, Zo = function(e3) {
        return Object.entries(e3).reduce((e4, t3) => (e4[t3[1]] = t3[0], e4), {});
      }, _o = function(e3 = {}) {
        return { reversed: true, both: Zo(e3.both), ex: Zo(e3.ex), fwd: e3.rev || {} };
      }, Xo = /^([0-9]+)/, Yo = function(e3) {
        let t3 = function(e4) {
          let t4 = {};
          return e4.split("\xA6").forEach((e5) => {
            let [n2, r2] = e5.split(":");
            r2 = (r2 || "").split(","), r2.forEach((e6) => {
              t4[e6] = n2;
            });
          }), t4;
        }(e3);
        return Object.keys(t3).reduce((e4, n2) => (e4[n2] = function(e5 = "", t4 = "") {
          let n3 = (t4 = String(t4)).match(Xo);
          if (null === n3) return t4;
          let r2 = Number(n3[1]) || 0;
          return e5.substring(0, r2) + t4.replace(Xo, "");
        }(n2, t3[n2]), e4), {});
      }, ei = function(e3 = {}) {
        return "string" == typeof e3 && (e3 = JSON.parse(e3)), e3.fwd = Yo(e3.fwd || ""), e3.both = Yo(e3.both || ""), e3.rev = Yo(e3.rev || ""), e3.ex = Yo(e3.ex || ""), e3;
      }, ti = ei({ fwd: "1:tted,wed,gged,nned,een,rred,pped,yed,bbed,oed,dded,rd,wn,mmed\xA62:eed,nded,et,hted,st,oled,ut,emed,eled,lded,ken,rt,nked,apt,ant,eped,eked\xA63:eared,eat,eaded,nelled,ealt,eeded,ooted,eaked,eaned,eeted,mited,bid,uit,ead,uited,ealed,geted,velled,ialed,belled\xA64:ebuted,hined,comed\xA6y:ied\xA6ome:ame\xA6ear:ore\xA6ind:ound\xA6ing:ung,ang\xA6ep:pt\xA6ink:ank,unk\xA6ig:ug\xA6all:ell\xA6ee:aw\xA6ive:ave\xA6eeze:oze\xA6old:eld\xA6ave:ft\xA6ake:ook\xA6ell:old\xA6ite:ote\xA6ide:ode\xA6ine:one\xA6in:un,on\xA6eal:ole\xA6im:am\xA6ie:ay\xA6and:ood\xA61ise:rose\xA61eak:roke\xA61ing:rought\xA61ive:rove\xA61el:elt\xA61id:bade\xA61et:got\xA61y:aid\xA61it:sat\xA63e:lid\xA63d:pent", both: "1:aed,fed,xed,hed\xA62:sged,xted,wled,rped,lked,kied,lmed,lped,uped,bted,rbed,rked,wned,rled,mped,fted,mned,mbed,zzed,omed,ened,cked,gned,lted,sked,ued,zed,nted,ered,rted,rmed,ced,sted,rned,ssed,rded,pted,ved,cted\xA63:cled,eined,siped,ooned,uked,ymed,jored,ouded,ioted,oaned,lged,asped,iged,mured,oided,eiled,yped,taled,moned,yled,lit,kled,oaked,gled,naled,fled,uined,oared,valled,koned,soned,aided,obed,ibed,meted,nicked,rored,micked,keted,vred,ooped,oaded,rited,aired,auled,filled,ouled,ooded,ceted,tolled,oited,bited,aped,tled,vored,dled,eamed,nsed,rsed,sited,owded,pled,sored,rged,osed,pelled,oured,psed,oated,loned,aimed,illed,eured,tred,ioned,celled,bled,wsed,ooked,oiled,itzed,iked,iased,onged,ased,ailed,uned,umed,ained,auded,nulled,ysed,eged,ised,aged,oined,ated,used,dged,doned\xA64:ntied,efited,uaked,caded,fired,roped,halled,roked,himed,culed,tared,lared,tuted,uared,routed,pited,naked,miled,houted,helled,hared,cored,caled,tired,peated,futed,ciled,called,tined,moted,filed,sided,poned,iloted,honed,lleted,huted,ruled,cured,named,preted,vaded,sured,talled,haled,peded,gined,nited,uided,ramed,feited,laked,gured,ctored,unged,pired,cuted,voked,eloped,ralled,rined,coded,icited,vided,uaded,voted,mined,sired,noted,lined,nselled,luted,jured,fided,puted,piled,pared,olored,cided,hoked,enged,tured,geoned,cotted,lamed,uiled,waited,udited,anged,luded,mired,uired,raded\xA65:modelled,izzled,eleted,umpeted,ailored,rseded,treated,eduled,ecited,rammed,eceded,atrolled,nitored,basted,twined,itialled,ncited,gnored,ploded,xcited,nrolled,namelled,plored,efeated,redited,ntrolled,nfined,pleted,llided,lcined,eathed,ibuted,lloted,dhered,cceded\xA63ad:sled\xA62aw:drew\xA62ot:hot\xA62ke:made\xA62ow:hrew,grew\xA62ose:hose\xA62d:ilt\xA62in:egan\xA61un:ran\xA61ink:hought\xA61ick:tuck\xA61ike:ruck\xA61eak:poke,nuck\xA61it:pat\xA61o:did\xA61ow:new\xA61ake:woke\xA6go:went", rev: "3:rst,hed,hut,cut,set\xA64:tbid\xA65:dcast,eread,pread,erbid\xA6ought:uy,eek\xA61ied:ny,ly,dy,ry,fy,py,vy,by,ty,cy\xA61ung:ling,ting,wing\xA61pt:eep\xA61ank:rink\xA61ore:bear,wear\xA61ave:give\xA61oze:reeze\xA61ound:rind,wind\xA61ook:take,hake\xA61aw:see\xA61old:sell\xA61ote:rite\xA61ole:teal\xA61unk:tink\xA61am:wim\xA61ay:lie\xA61ood:tand\xA61eld:hold\xA62d:he,ge,re,le,leed,ne,reed,be,ye,lee,pe,we\xA62ed:dd,oy,or,ey,gg,rr,us,ew,to\xA62ame:ecome,rcome\xA62ped:ap\xA62ged:ag,og,ug,eg\xA62bed:ub,ab,ib,ob\xA62lt:neel\xA62id:pay\xA62ang:pring\xA62ove:trive\xA62med:um\xA62ode:rride\xA62at:ysit\xA63ted:mit,hat,mat,lat,pot,rot,bat\xA63ed:low,end,tow,und,ond,eem,lay,cho,dow,xit,eld,ald,uld,law,lel,eat,oll,ray,ank,fin,oam,out,how,iek,tay,haw,ait,vet,say,cay,bow\xA63d:ste,ede,ode,ete,ree,ude,ame,oke,ote,ime,ute,ade\xA63red:lur,cur,pur,car\xA63ped:hop,rop,uip,rip,lip,tep,top\xA63ded:bed,rod,kid\xA63ade:orbid\xA63led:uel\xA63ned:lan,can,kin,pan,tun\xA63med:rim,lim\xA64ted:quit,llot\xA64ed:pear,rrow,rand,lean,mand,anel,pand,reet,link,abel,evel,imit,ceed,ruit,mind,peal,veal,hool,head,pell,well,mell,uell,band,hear,weak\xA64led:nnel,qual,ebel,ivel\xA64red:nfer,efer,sfer\xA64n:sake,trew\xA64d:ntee\xA64ded:hred\xA64ned:rpin\xA65ed:light,nceal,right,ndear,arget,hread,eight,rtial,eboot\xA65d:edite,nvite\xA65ted:egret\xA65led:ravel", ex: "2:been,upped\xA63:added,aged,aided,aimed,aired,bid,died,dyed,egged,erred,eyed,fit,gassed,hit,lied,owed,pent,pied,tied,used,vied,oiled,outed,banned,barred,bet,canned,cut,dipped,donned,ended,feed,inked,jarred,let,manned,mowed,netted,padded,panned,pitted,popped,potted,put,set,sewn,sowed,tanned,tipped,topped,vowed,weed,bowed,jammed,binned,dimmed,hopped,mopped,nodded,pinned,rigged,sinned,towed,vetted\xA64:ached,baked,baled,boned,bored,called,caned,cared,ceded,cited,coded,cored,cubed,cured,dared,dined,edited,exited,faked,fared,filed,fined,fired,fuelled,gamed,gelled,hired,hoped,joked,lined,mined,named,noted,piled,poked,polled,pored,pulled,reaped,roamed,rolled,ruled,seated,shed,sided,timed,tolled,toned,voted,waited,walled,waned,winged,wiped,wired,zoned,yelled,tamed,lubed,roped,faded,mired,caked,honed,banged,culled,heated,raked,welled,banded,beat,cast,cooled,cost,dealt,feared,folded,footed,handed,headed,heard,hurt,knitted,landed,leaked,leapt,linked,meant,minded,molded,neared,needed,peaked,plodded,plotted,pooled,quit,read,rooted,sealed,seeded,seeped,shipped,shunned,skimmed,slammed,sparred,stemmed,stirred,suited,thinned,twinned,swayed,winked,dialed,abutted,blotted,fretted,healed,heeded,peeled,reeled\xA65:basted,cheated,equalled,eroded,exiled,focused,opined,pleated,primed,quoted,scouted,shored,sloped,smoked,sniped,spelled,spouted,routed,staked,stored,swelled,tasted,treated,wasted,smelled,dwelled,honored,prided,quelled,eloped,scared,coveted,sweated,breaded,cleared,debuted,deterred,freaked,modeled,pleaded,rebutted,speeded\xA66:anchored,defined,endured,impaled,invited,refined,revered,strolled,cringed,recast,thrust,unfolded\xA67:authored,combined,competed,conceded,convened,excreted,extruded,redefined,restored,secreted,rescinded,welcomed\xA68:expedited,infringed\xA69:interfered,intervened,persevered\xA610:contravened\xA6eat:ate\xA6is:was\xA6go:went\xA6are:were\xA63d:bent,lent,rent,sent\xA63e:bit,fled,hid,lost\xA63ed:bled,bred\xA62ow:blew,grew\xA61uy:bought\xA62tch:caught\xA61o:did\xA61ive:dove,gave\xA62aw:drew\xA62ed:fed\xA62y:flew,laid,paid,said\xA61ight:fought\xA61et:got\xA62ve:had\xA61ang:hung\xA62ad:led\xA62ght:lit\xA62ke:made\xA62et:met\xA61un:ran\xA61ise:rose\xA61it:sat\xA61eek:sought\xA61each:taught\xA61ake:woke,took\xA61eave:wove\xA62ise:arose\xA61ear:bore,tore,wore\xA61ind:bound,found,wound\xA62eak:broke\xA62ing:brought,wrung\xA61ome:came\xA62ive:drove\xA61ig:dug\xA61all:fell\xA62el:felt\xA64et:forgot\xA61old:held\xA62ave:left\xA61ing:rang,sang\xA61ide:rode\xA61ink:sank\xA61ee:saw\xA62ine:shone\xA64e:slid\xA61ell:sold,told\xA64d:spent\xA62in:spun\xA61in:won" }), ni = ei(qo), ri = ei(Jo), ai = ei(Wo), oi = _o(ti), ii = _o(ni), si = _o(ri), li = _o(ai), ui = ei(Lo), ci = ei(Uo);
      var hi = { fromPast: ti, fromPresent: ni, fromGerund: ri, fromParticiple: ai, toPast: oi, toPresent: ii, toGerund: si, toParticiple: li, toComparative: ui, toSuperlative: ci, fromComparative: _o(ui), fromSuperlative: _o(ci), adjToNoun: ei(Ro) }, di = ["academy", "administration", "agence", "agences", "agencies", "agency", "airlines", "airways", "army", "assoc", "associates", "association", "assurance", "authority", "autorite", "aviation", "bank", "banque", "board", "boys", "brands", "brewery", "brotherhood", "brothers", "bureau", "cafe", "co", "caisse", "capital", "care", "cathedral", "center", "centre", "chemicals", "choir", "chronicle", "church", "circus", "clinic", "clinique", "club", "co", "coalition", "coffee", "collective", "college", "commission", "committee", "communications", "community", "company", "comprehensive", "computers", "confederation", "conference", "conseil", "consulting", "containers", "corporation", "corps", "corp", "council", "crew", "data", "departement", "department", "departments", "design", "development", "directorate", "division", "drilling", "education", "eglise", "electric", "electricity", "energy", "ensemble", "enterprise", "enterprises", "entertainment", "estate", "etat", "faculty", "faction", "federation", "financial", "fm", "foundation", "fund", "gas", "gazette", "girls", "government", "group", "guild", "herald", "holdings", "hospital", "hotel", "hotels", "inc", "industries", "institut", "institute", "institutes", "insurance", "international", "interstate", "investment", "investments", "investors", "journal", "laboratory", "labs", "llc", "ltd", "limited", "machines", "magazine", "management", "marine", "marketing", "markets", "media", "memorial", "ministere", "ministry", "military", "mobile", "motor", "motors", "musee", "museum", "news", "observatory", "office", "oil", "optical", "orchestra", "organization", "partners", "partnership", "petrol", "petroleum", "pharmacare", "pharmaceutical", "pharmaceuticals", "pizza", "plc", "police", "politburo", "polytechnic", "post", "power", "press", "productions", "quartet", "radio", "reserve", "resources", "restaurant", "restaurants", "savings", "school", "securities", "service", "services", "societe", "subsidiary", "society", "sons", "subcommittee", "syndicat", "systems", "telecommunications", "telegraph", "television", "times", "tribunal", "tv", "union", "university", "utilities", "workers"].reduce((e3, t3) => (e3[t3] = true, e3), {}), gi = ["atoll", "basin", "bay", "beach", "bluff", "bog", "camp", "canyon", "canyons", "cape", "cave", "caves", "cliffs", "coast", "cove", "coves", "crater", "crossing", "creek", "desert", "dune", "dunes", "downs", "estates", "escarpment", "estuary", "falls", "fjord", "fjords", "forest", "forests", "glacier", "gorge", "gorges", "grove", "gulf", "gully", "highland", "heights", "hollow", "hill", "hills", "inlet", "island", "islands", "isthmus", "junction", "knoll", "lagoon", "lake", "lakeshore", "marsh", "marshes", "mount", "mountain", "mountains", "narrows", "peninsula", "plains", "plateau", "pond", "rapids", "ravine", "reef", "reefs", "ridge", "river", "rivers", "sandhill", "shoal", "shore", "shoreline", "shores", "strait", "straits", "springs", "stream", "swamp", "tombolo", "trail", "trails", "trench", "valley", "vallies", "village", "volcano", "waterfall", "watershed", "wetland", "woods", "acres", "burough", "county", "district", "municipality", "prefecture", "province", "region", "reservation", "state", "territory", "borough", "metropolis", "downtown", "uptown", "midtown", "city", "town", "township", "hamlet", "country", "kingdom", "enclave", "neighbourhood", "neighborhood", "kingdom", "ward", "zone", "airport", "amphitheater", "arch", "arena", "auditorium", "bar", "barn", "basilica", "battlefield", "bridge", "building", "castle", "centre", "coliseum", "cineplex", "complex", "dam", "farm", "field", "fort", "garden", "gardens", "gymnasium", "hall", "house", "levee", "library", "manor", "memorial", "monument", "museum", "gallery", "palace", "pillar", "pits", "plantation", "playhouse", "quarry", "sportsfield", "sportsplex", "stadium", "terrace", "terraces", "theater", "tower", "park", "parks", "site", "ranch", "raceway", "sportsplex", "ave", "st", "street", "rd", "road", "lane", "landing", "crescent", "cr", "way", "tr", "terrace", "avenue"].reduce((e3, t3) => (e3[t3] = true, e3), {}), mi = [[/([^v])ies$/i, "$1y"], [/(ise)s$/i, "$1"], [/(kn|[^o]l|w)ives$/i, "$1ife"], [/^((?:ca|e|ha|(?:our|them|your)?se|she|wo)l|lea|loa|shea|thie)ves$/i, "$1f"], [/^(dwar|handkerchie|hoo|scar|whar)ves$/i, "$1f"], [/(antenn|formul|nebul|vertebr|vit)ae$/i, "$1a"], [/(octop|vir|radi|nucle|fung|cact|stimul)(i)$/i, "$1us"], [/(buffal|tomat|tornad)(oes)$/i, "$1o"], [/(ause)s$/i, "$1"], [/(ease)s$/i, "$1"], [/(ious)es$/i, "$1"], [/(ouse)s$/i, "$1"], [/(ose)s$/i, "$1"], [/(..ase)s$/i, "$1"], [/(..[aeiu]s)es$/i, "$1"], [/(vert|ind|cort)(ices)$/i, "$1ex"], [/(matr|append)(ices)$/i, "$1ix"], [/([xo]|ch|ss|sh)es$/i, "$1"], [/men$/i, "man"], [/(n)ews$/i, "$1ews"], [/([ti])a$/i, "$1um"], [/([^aeiouy]|qu)ies$/i, "$1y"], [/(s)eries$/i, "$1eries"], [/(m)ovies$/i, "$1ovie"], [/(cris|ax|test)es$/i, "$1is"], [/(alias|status)es$/i, "$1"], [/(ss)$/i, "$1"], [/(ic)s$/i, "$1"], [/s$/i, ""]];
      const pi = function(e3, t3) {
        const { irregularPlurals: n2 } = t3.two;
        let r2 = (a2 = n2, Object.keys(a2).reduce((e4, t4) => (e4[a2[t4]] = t4, e4), {}));
        var a2;
        if (r2.hasOwnProperty(e3)) return r2[e3];
        for (let t4 = 0; t4 < mi.length; t4++) if (true === mi[t4][0].test(e3)) return e3 = e3.replace(mi[t4][0], mi[t4][1]);
        return e3;
      };
      var fi = { toPlural: ya, toSingular: pi, all: function(e3, t3) {
        let n2 = [e3], r2 = ya(e3, t3);
        r2 !== e3 && n2.push(r2);
        let a2 = pi(e3, t3);
        return a2 !== e3 && n2.push(a2), n2;
      } };
      let bi = { Gerund: ["ing"], Actor: ["erer"], Infinitive: ["ate", "ize", "tion", "rify", "then", "ress", "ify", "age", "nce", "ect", "ise", "ine", "ish", "ace", "ash", "ure", "tch", "end", "ack", "and", "ute", "ade", "ock", "ite", "ase", "ose", "use", "ive", "int", "nge", "lay", "est", "ain", "ant", "ent", "eed", "er", "le", "unk", "ung", "upt", "en"], PastTense: ["ept", "ed", "lt", "nt", "ew", "ld"], PresentTense: ["rks", "cks", "nks", "ngs", "mps", "tes", "zes", "ers", "les", "acks", "ends", "ands", "ocks", "lays", "eads", "lls", "els", "ils", "ows", "nds", "ays", "ams", "ars", "ops", "ffs", "als", "urs", "lds", "ews", "ips", "es", "ts", "ns"], Participle: ["ken", "wn"] };
      bi = Object.keys(bi).reduce((e3, t3) => (bi[t3].forEach((n2) => e3[n2] = t3), e3), {});
      const vi = function(e3) {
        let t3 = e3.substring(e3.length - 3);
        if (true === bi.hasOwnProperty(t3)) return bi[t3];
        let n2 = e3.substring(e3.length - 2);
        return true === bi.hasOwnProperty(n2) ? bi[n2] : "s" === e3.substring(e3.length - 1) ? "PresentTense" : null;
      }, yi = { are: "be", were: "be", been: "be", is: "be", am: "be", was: "be", be: "be", being: "be" }, wi = function(e3, t3, n2) {
        const { fromPast: r2, fromPresent: a2, fromGerund: o2, fromParticiple: i2 } = t3.two.models;
        let { prefix: s2, verb: l2, particle: u2 } = function(e4, t4) {
          let n3 = "", r3 = {};
          t4.one && t4.one.prefixes && (r3 = t4.one.prefixes);
          let [a3, o3] = e4.split(/ /);
          return o3 && true === r3[a3] && (n3 = a3, a3 = o3, o3 = ""), { prefix: n3, verb: a3, particle: o3 };
        }(e3, t3), c2 = "";
        if (n2 || (n2 = vi(e3)), yi.hasOwnProperty(e3)) c2 = yi[e3];
        else if ("Participle" === n2) c2 = Qo(l2, i2);
        else if ("PastTense" === n2) c2 = Qo(l2, r2);
        else if ("PresentTense" === n2) c2 = Qo(l2, a2);
        else {
          if ("Gerund" !== n2) return e3;
          c2 = Qo(l2, o2);
        }
        return u2 && (c2 += " " + u2), s2 && (c2 = s2 + " " + c2), c2;
      }, ki = function(e3, t3) {
        const { toPast: n2, toPresent: r2, toGerund: a2, toParticiple: o2 } = t3.two.models;
        if ("be" === e3) return { Infinitive: e3, Gerund: "being", PastTense: "was", PresentTense: "is" };
        let [i2, s2] = ((e4) => / /.test(e4) ? e4.split(/ /) : [e4, ""])(e3), l2 = { Infinitive: i2, PastTense: Qo(i2, n2), PresentTense: Qo(i2, r2), Gerund: Qo(i2, a2), FutureTense: "will " + i2 }, u2 = Qo(i2, o2);
        if (u2 !== e3 && u2 !== l2.PastTense) {
          let n3 = t3.one.lexicon || {};
          "Participle" !== n3[u2] && "Adjective" !== n3[u2] || ("play" === e3 && (u2 = "played"), l2.Participle = u2);
        }
        return s2 && Object.keys(l2).forEach((e4) => {
          l2[e4] += " " + s2;
        }), l2;
      };
      var Pi = { toInfinitive: wi, conjugate: ki, all: function(e3, t3) {
        let n2 = ki(e3, t3);
        return delete n2.FutureTense, Object.values(n2).filter((e4) => e4);
      } };
      const Ai = function(e3, t3) {
        const n2 = t3.two.models.toSuperlative;
        return Qo(e3, n2);
      }, Ci = function(e3, t3) {
        const n2 = t3.two.models.toComparative;
        return Qo(e3, n2);
      }, Ni = function(e3 = "", t3 = []) {
        const n2 = e3.length;
        for (let r2 = n2 <= 6 ? n2 - 1 : 6; r2 >= 1; r2 -= 1) {
          let a2 = e3.substring(n2 - r2, e3.length);
          if (true === t3[a2.length].hasOwnProperty(a2)) return e3.slice(0, n2 - r2) + t3[a2.length][a2];
        }
        return null;
      }, ji = "ically", xi = /* @__PURE__ */ new Set(["analyt" + ji, "chem" + ji, "class" + ji, "clin" + ji, "crit" + ji, "ecolog" + ji, "electr" + ji, "empir" + ji, "frant" + ji, "grammat" + ji, "ident" + ji, "ideolog" + ji, "log" + ji, "mag" + ji, "mathemat" + ji, "mechan" + ji, "med" + ji, "method" + ji, "method" + ji, "mus" + ji, "phys" + ji, "phys" + ji, "polit" + ji, "pract" + ji, "rad" + ji, "satir" + ji, "statist" + ji, "techn" + ji, "technolog" + ji, "theoret" + ji, "typ" + ji, "vert" + ji, "whims" + ji]), Ii = [null, {}, { ly: "" }, { ily: "y", bly: "ble", ply: "ple" }, { ally: "al", rply: "rp" }, { ually: "ual", ially: "ial", cally: "cal", eally: "eal", rally: "ral", nally: "nal", mally: "mal", eeply: "eep", eaply: "eap" }, { ically: "ic" }], Ti = /* @__PURE__ */ new Set(["early", "only", "hourly", "daily", "weekly", "monthly", "yearly", "mostly", "duly", "unduly", "especially", "undoubtedly", "conversely", "namely", "exceedingly", "presumably", "accordingly", "overly", "best", "latter", "little", "long", "low"]), Di = { wholly: "whole", fully: "full", truly: "true", gently: "gentle", singly: "single", customarily: "customary", idly: "idle", publically: "public", quickly: "quick", superbly: "superb", cynically: "cynical", well: "good" }, Hi = [null, { y: "ily" }, { ly: "ly", ic: "ically" }, { ial: "ially", ual: "ually", tle: "tly", ble: "bly", ple: "ply", ary: "arily" }, {}, {}, {}], Ei = { cool: "cooly", whole: "wholly", full: "fully", good: "well", idle: "idly", public: "publicly", single: "singly", special: "especially" }, Gi = function(e3) {
        if (Ei.hasOwnProperty(e3)) return Ei[e3];
        let t3 = Ni(e3, Hi);
        return t3 || (t3 = e3 + "ly"), t3;
      };
      var Oi = { toSuperlative: Ai, toComparative: Ci, toAdverb: Gi, toNoun: function(e3, t3) {
        const n2 = t3.two.models.adjToNoun;
        return Qo(e3, n2);
      }, fromAdverb: function(e3) {
        return e3.endsWith("ly") ? xi.has(e3) ? e3.replace(/ically/, "ical") : Ti.has(e3) ? null : Di.hasOwnProperty(e3) ? Di[e3] : Ni(e3, Ii) || e3 : null;
      }, fromSuperlative: function(e3, t3) {
        const n2 = t3.two.models.fromSuperlative;
        return Qo(e3, n2);
      }, fromComparative: function(e3, t3) {
        const n2 = t3.two.models.fromComparative;
        return Qo(e3, n2);
      }, all: function(e3, t3) {
        let n2 = [e3];
        return n2.push(Ai(e3, t3)), n2.push(Ci(e3, t3)), n2.push(Gi(e3)), n2 = n2.filter((e4) => e4), n2 = new Set(n2), Array.from(n2);
      } }, Fi = { noun: fi, verb: Pi, adjective: Oi }, Vi = { Singular: (e3, t3, n2, r2) => {
        let a2 = r2.one.lexicon, o2 = n2.two.transform.noun.toPlural(e3, r2);
        a2[o2] || (t3[o2] = t3[o2] || "Plural");
      }, Actor: (e3, t3, n2, r2) => {
        let a2 = r2.one.lexicon, o2 = n2.two.transform.noun.toPlural(e3, r2);
        a2[o2] || (t3[o2] = t3[o2] || ["Plural", "Actor"]);
      }, Comparable: (e3, t3, n2, r2) => {
        let a2 = r2.one.lexicon, { toSuperlative: o2, toComparative: i2 } = n2.two.transform.adjective, s2 = o2(e3, r2);
        a2[s2] || (t3[s2] = t3[s2] || "Superlative");
        let l2 = i2(e3, r2);
        a2[l2] || (t3[l2] = t3[l2] || "Comparative"), t3[e3] = "Adjective";
      }, Demonym: (e3, t3, n2, r2) => {
        let a2 = n2.two.transform.noun.toPlural(e3, r2);
        t3[a2] = t3[a2] || ["Demonym", "Plural"];
      }, Infinitive: (e3, t3, n2, r2) => {
        let a2 = r2.one.lexicon, o2 = n2.two.transform.verb.conjugate(e3, r2);
        Object.entries(o2).forEach((e4) => {
          a2[e4[1]] || t3[e4[1]] || "FutureTense" === e4[0] || (t3[e4[1]] = e4[0]);
        });
      }, PhrasalVerb: (e3, t3, n2, r2) => {
        let a2 = r2.one.lexicon;
        t3[e3] = ["PhrasalVerb", "Infinitive"];
        let o2 = r2.one._multiCache, [i2, s2] = e3.split(" ");
        a2[i2] || (t3[i2] = t3[i2] || "Infinitive");
        let l2 = n2.two.transform.verb.conjugate(i2, r2);
        delete l2.FutureTense, Object.entries(l2).forEach((e4) => {
          if ("Actor" === e4[0] || "" === e4[1]) return;
          t3[e4[1]] || a2[e4[1]] || (t3[e4[1]] = e4[0]), o2[e4[1]] = 2;
          let n3 = e4[1] + " " + s2;
          t3[n3] = t3[n3] || [e4[0], "PhrasalVerb"];
        });
      }, Multiple: (e3, t3) => {
        t3[e3] = ["Multiple", "Cardinal"], t3[e3 + "th"] = ["Multiple", "Ordinal"], t3[e3 + "ths"] = ["Multiple", "Fraction"];
      }, Cardinal: (e3, t3) => {
        t3[e3] = ["TextValue", "Cardinal"];
      }, Ordinal: (e3, t3) => {
        t3[e3] = ["TextValue", "Ordinal"], t3[e3 + "s"] = ["TextValue", "Fraction"];
      }, Place: (e3, t3) => {
        t3[e3] = ["Place", "ProperNoun"];
      }, Region: (e3, t3) => {
        t3[e3] = ["Region", "ProperNoun"];
      } };
      const zi = { e: ["mice", "louse", "antennae", "formulae", "nebulae", "vertebrae", "vitae"], i: ["tia", "octopi", "viri", "radii", "nuclei", "fungi", "cacti", "stimuli"], n: ["men"], t: ["feet"] }, Bi = /* @__PURE__ */ new Set(["israelis", "menus", "logos"]), Si = ["bus", "mas", "was", "ias", "xas", "vas", "cis", "lis", "nis", "ois", "ris", "sis", "tis", "xis", "aus", "cus", "eus", "fus", "gus", "ius", "lus", "nus", "das", "ous", "pus", "rus", "sus", "tus", "xus", "aos", "igos", "ados", "ogos", "'s", "ss"], $i = function(e3) {
        if (!e3 || e3.length <= 3) return false;
        if (Bi.has(e3)) return true;
        let t3 = e3[e3.length - 1];
        return zi.hasOwnProperty(t3) ? zi[t3].find((t4) => e3.endsWith(t4)) : "s" === t3 && !Si.find((t4) => e3.endsWith(t4));
      };
      var Mi = { two: { quickSplit: function(e3) {
        const t3 = /[,:;]/;
        let n2 = [];
        return e3.forEach((e4) => {
          let r2 = 0;
          e4.forEach((a2, o2) => {
            t3.test(a2.post) && function(e5, t4) {
              const n3 = /^[0-9]+$/;
              let r3 = e5[t4];
              if (!r3) return false;
              const a3 = /* @__PURE__ */ new Set(["may", "april", "august", "jan"]);
              if ("like" === r3.normal || a3.has(r3.normal)) return false;
              if (r3.tags.has("Place") || r3.tags.has("Date")) return false;
              if (e5[t4 - 1]) {
                let n4 = e5[t4 - 1];
                if (n4.tags.has("Date") || a3.has(n4.normal)) return false;
                if (n4.tags.has("Adjective") || r3.tags.has("Adjective")) return false;
              }
              let o3 = r3.normal;
              return 1 !== o3.length && 2 !== o3.length && 4 !== o3.length || !n3.test(o3);
            }(e4, o2 + 1) && (n2.push(e4.slice(r2, o2 + 1)), r2 = o2 + 1);
          }), r2 < e4.length && n2.push(e4.slice(r2, e4.length));
        }), n2;
      }, expandLexicon: function(e3, t3) {
        const { methods: n2, model: r2 } = t3;
        let a2 = {}, o2 = {};
        return Object.keys(e3).forEach((t4) => {
          let i2 = e3[t4], s2 = (t4 = (t4 = t4.toLowerCase().trim()).replace(/'s\b/, "")).split(/ /);
          s2.length > 1 && (void 0 === o2[s2[0]] || s2.length > o2[s2[0]]) && (o2[s2[0]] = s2.length), true === Vi.hasOwnProperty(i2) && Vi[i2](t4, a2, n2, r2), a2[t4] = a2[t4] || i2;
        }), delete a2[""], delete a2.null, delete a2[" "], { lex: a2, _multi: o2 };
      }, transform: Fi, looksPlural: $i } };
      let Ki = { one: { lexicon: {} }, two: { models: hi } };
      const Li = { "Actor|Verb": "Actor", "Adj|Gerund": "Adjective", "Adj|Noun": "Adjective", "Adj|Past": "Adjective", "Adj|Present": "Adjective", "Noun|Verb": "Singular", "Noun|Gerund": "Gerund", "Person|Noun": "Noun", "Person|Date": "Month", "Person|Verb": "FirstName", "Person|Place": "Person", "Person|Adj": "Comparative", "Plural|Verb": "Plural", "Unit|Noun": "Noun" }, Ji = function(e3, t3) {
        const n2 = { model: t3, methods: Mi };
        let { lex: r2, _multi: a2 } = Mi.two.expandLexicon(e3, n2);
        return Object.assign(t3.one.lexicon, r2), Object.assign(t3.one._multiCache, a2), t3;
      }, Wi = function(e3, t3, n2) {
        let r2 = ki(e3, Ki);
        t3[r2.PastTense] = t3[r2.PastTense] || "PastTense", t3[r2.Gerund] = t3[r2.Gerund] || "Gerund", true === n2 && (t3[r2.PresentTense] = t3[r2.PresentTense] || "PresentTense");
      }, qi = function(e3, t3, n2) {
        let r2 = Ai(e3, n2);
        t3[r2] = t3[r2] || "Superlative";
        let a2 = Ci(e3, n2);
        t3[a2] = t3[a2] || "Comparative";
      }, Ui = function(e3, t3) {
        let n2 = {};
        const r2 = t3.one.lexicon;
        return Object.keys(e3).forEach((a2) => {
          const o2 = e3[a2];
          if (n2[a2] = Li[o2], "Noun|Verb" !== o2 && "Person|Verb" !== o2 && "Actor|Verb" !== o2 || Wi(a2, r2, false), "Adj|Present" === o2 && (Wi(a2, r2, true), qi(a2, r2, t3)), "Person|Adj" === o2 && qi(a2, r2, t3), "Adj|Gerund" === o2 || "Noun|Gerund" === o2) {
            let e4 = wi(a2, Ki, "Gerund");
            r2[e4] || (n2[e4] = "Infinitive");
          }
          if ("Noun|Gerund" !== o2 && "Adj|Noun" !== o2 && "Person|Noun" !== o2 || function(e4, t4, n3) {
            let r3 = ya(e4, n3);
            t4[r3] = t4[r3] || "Plural";
          }(a2, r2, t3), "Adj|Past" === o2) {
            let e4 = wi(a2, Ki, "PastTense");
            r2[e4] || (n2[e4] = "Infinitive");
          }
        }), t3 = Ji(n2, t3);
      };
      let Ri = { one: { _multiCache: {}, lexicon: ka, frozenLex: { "20th century fox": "Organization", "7 eleven": "Organization", "motel 6": "Organization", "excuse me": "Expression", "financial times": "Organization", "guns n roses": "Organization", "la z boy": "Organization", "labour party": "Organization", "new kids on the block": "Organization", "new york times": "Organization", "the guess who": "Organization", "thin lizzy": "Organization", "prime minister": "Actor", "free market": "Singular", "lay up": "Singular", "living room": "Singular", "living rooms": "Plural", "spin off": "Singular", "appeal court": "Uncountable", "cold war": "Uncountable", "gene pool": "Uncountable", "machine learning": "Uncountable", "nail polish": "Uncountable", "time off": "Uncountable", "take part": "Infinitive", "bill gates": "Person", "doctor who": "Person", "dr who": "Person", "he man": "Person", "iron man": "Person", "kid cudi": "Person", "run dmc": "Person", "rush limbaugh": "Person", "snow white": "Person", "tiger woods": "Person", "brand new": "Adjective", "en route": "Adjective", "left wing": "Adjective", "off guard": "Adjective", "on board": "Adjective", "part time": "Adjective", "right wing": "Adjective", "so called": "Adjective", "spot on": "Adjective", "straight forward": "Adjective", "super duper": "Adjective", "tip top": "Adjective", "top notch": "Adjective", "up to date": "Adjective", "win win": "Adjective", "brooklyn nets": "SportsTeam", "chicago bears": "SportsTeam", "houston astros": "SportsTeam", "houston dynamo": "SportsTeam", "houston rockets": "SportsTeam", "houston texans": "SportsTeam", "minnesota twins": "SportsTeam", "orlando magic": "SportsTeam", "san antonio spurs": "SportsTeam", "san diego chargers": "SportsTeam", "san diego padres": "SportsTeam", "iron maiden": "ProperNoun", "isle of man": "Country", "united states": "Country", "united states of america": "Country", "prince edward island": "Region", "cedar breaks": "Place", "cedar falls": "Place", "point blank": "Adverb", "tiny bit": "Adverb", "by the time": "Conjunction", "no matter": "Conjunction", "civil wars": "Plural", "credit cards": "Plural", "default rates": "Plural", "free markets": "Plural", "head starts": "Plural", "home runs": "Plural", "lay ups": "Plural", "phone calls": "Plural", "press releases": "Plural", "record labels": "Plural", "soft serves": "Plural", "student loans": "Plural", "tax returns": "Plural", "tv shows": "Plural", "video games": "Plural", "took part": "PastTense", "takes part": "PresentTense", "taking part": "Gerund", "taken part": "Participle", "light bulb": "Noun", "rush hour": "Noun", "fluid ounce": "Unit", "the rolling stones": "Organization" } }, two: { irregularPlurals: la, models: hi, suffixPatterns: Ao, prefixPatterns: xo, endsWith: So, neighbours: Ko, regexNormal: [[/^[\w.]+@[\w.]+\.[a-z]{2,3}$/, "Email"], [/^(https?:\/\/|www\.)+\w+\.[a-z]{2,3}/, "Url", "http.."], [/^[a-z0-9./].+\.(com|net|gov|org|ly|edu|info|biz|dev|ru|jp|de|in|uk|br|io|ai)/, "Url", ".com"], [/^[PMCE]ST$/, "Timezone", "EST"], [/^ma?c'[a-z]{3}/, "LastName", "mc'neil"], [/^o'[a-z]{3}/, "LastName", "o'connor"], [/^ma?cd[aeiou][a-z]{3}/, "LastName", "mcdonald"], [/^(lol)+[sz]$/, "Expression", "lol"], [/^wo{2,}a*h?$/, "Expression", "wooah"], [/^(hee?){2,}h?$/, "Expression", "hehe"], [/^(un|de|re)\\-[a-z\u00C0-\u00FF]{2}/, "Verb", "un-vite"], [/^(m|k|cm|km)\/(s|h|hr)$/, "Unit", "5 k/m"], [/^(ug|ng|mg)\/(l|m3|ft3)$/, "Unit", "ug/L"], [/[^:/]\/\p{Letter}/u, "SlashedTerm", "love/hate"]], regexText: [[/^#[\p{Number}_]*\p{Letter}/u, "HashTag"], [/^@\w{2,}$/, "AtMention"], [/^([A-Z]\.){2}[A-Z]?/i, ["Acronym", "Noun"], "F.B.I"], [/.{3}[lkmnp]in['‘’‛‵′`´]$/, "Gerund", "chillin'"], [/.{4}s['‘’‛‵′`´]$/, "Possessive", "flanders'"], [/^[\p{Emoji_Presentation}\p{Extended_Pictographic}]/u, "Emoji", "emoji-class"]], regexNumbers: [[/^@1?[0-9](am|pm)$/i, "Time", "3pm"], [/^@1?[0-9]:[0-9]{2}(am|pm)?$/i, "Time", "3:30pm"], [/^'[0-9]{2}$/, "Year"], [/^[012]?[0-9](:[0-5][0-9])(:[0-5][0-9])$/, "Time", "3:12:31"], [/^[012]?[0-9](:[0-5][0-9])?(:[0-5][0-9])? ?(am|pm)$/i, "Time", "1:12pm"], [/^[012]?[0-9](:[0-5][0-9])(:[0-5][0-9])? ?(am|pm)?$/i, "Time", "1:12:31pm"], [/^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}/i, "Date", "iso-date"], [/^[0-9]{1,4}-[0-9]{1,2}-[0-9]{1,4}$/, "Date", "iso-dash"], [/^[0-9]{1,4}\/[0-9]{1,2}\/([0-9]{4}|[0-9]{2})$/, "Date", "iso-slash"], [/^[0-9]{1,4}\.[0-9]{1,2}\.[0-9]{1,4}$/, "Date", "iso-dot"], [/^[0-9]{1,4}-[a-z]{2,9}-[0-9]{1,4}$/i, "Date", "12-dec-2019"], [/^utc ?[+-]?[0-9]+$/, "Timezone", "utc-9"], [/^(gmt|utc)[+-][0-9]{1,2}$/i, "Timezone", "gmt-3"], [/^[0-9]{3}-[0-9]{4}$/, "PhoneNumber", "421-0029"], [/^(\+?[0-9][ -])?[0-9]{3}[ -]?[0-9]{3}-[0-9]{4}$/, "PhoneNumber", "1-800-"], [/^[-+]?\p{Currency_Symbol}[-+]?[0-9]+(,[0-9]{3})*(\.[0-9]+)?([kmb]|bn)?\+?$/u, ["Money", "Value"], "$5.30"], [/^[-+]?[0-9]+(,[0-9]{3})*(\.[0-9]+)?\p{Currency_Symbol}\+?$/u, ["Money", "Value"], "5.30\xA3"], [/^[-+]?[$£]?[0-9]([0-9,.])+(usd|eur|jpy|gbp|cad|aud|chf|cny|hkd|nzd|kr|rub)$/i, ["Money", "Value"], "$400usd"], [/^[-+]?[0-9]+(,[0-9]{3})*(\.[0-9]+)?\+?$/, ["Cardinal", "NumericValue"], "5,999"], [/^[-+]?[0-9]+(,[0-9]{3})*(\.[0-9]+)?(st|nd|rd|r?th)$/, ["Ordinal", "NumericValue"], "53rd"], [/^\.[0-9]+\+?$/, ["Cardinal", "NumericValue"], ".73th"], [/^[-+]?[0-9]+(,[0-9]{3})*(\.[0-9]+)?%\+?$/, ["Percent", "Cardinal", "NumericValue"], "-4%"], [/^\.[0-9]+%$/, ["Percent", "Cardinal", "NumericValue"], ".3%"], [/^[0-9]{1,4}\/[0-9]{1,4}(st|nd|rd|th)?s?$/, ["Fraction", "NumericValue"], "2/3rds"], [/^[0-9.]{1,3}[a-z]{0,2}[-–—][0-9]{1,3}[a-z]{0,2}$/, ["Value", "NumberRange"], "3-4"], [/^[0-9]{1,2}(:[0-9][0-9])?(am|pm)? ?[-–—] ?[0-9]{1,2}(:[0-9][0-9])?(am|pm)$/, ["Time", "NumberRange"], "3-4pm"], [/^[0-9.]+([a-z°]{1,4})$/, "NumericValue", "9km"]], switches: Pa, clues: io, uncountable: {}, orgWords: di, placeWords: gi } };
      Ri = function(e3) {
        return e3 = function(e4, t3) {
          return Object.keys(e4).forEach((n2) => {
            "Uncountable" === e4[n2] && (t3.two.uncountable[n2] = true, e4[n2] = "Uncountable");
          }), t3;
        }((e3 = Ji(e3.one.lexicon, e3)).one.lexicon, e3), e3 = function(e4) {
          const { irregularPlurals: t3 } = e4.two, { lexicon: n2 } = e4.one;
          return Object.entries(t3).forEach((e5) => {
            n2[e5[0]] = n2[e5[0]] || "Singular", n2[e5[1]] = n2[e5[1]] || "Plural";
          }), e4;
        }(e3 = Ui(e3.two.switches, e3)), e3;
      }(Ri);
      const Qi = function(e3, t3, n2, r2) {
        const a2 = r2.methods.one.setTag;
        "-" === e3[t3].post && e3[t3 + 1] && a2([e3[t3], e3[t3 + 1]], "Hyphenated", r2, null, "1-punct-hyphen''");
      }, Zi = /^(under|over|mis|re|un|dis|semi)-?/, _i = function(e3, t3, n2) {
        const r2 = n2.two.switches;
        let a2 = e3[t3];
        if (r2.hasOwnProperty(a2.normal)) a2.switch = r2[a2.normal];
        else if (Zi.test(a2.normal)) {
          let e4 = a2.normal.replace(Zi, "");
          e4.length > 3 && r2.hasOwnProperty(e4) && (a2.switch = r2[e4]);
        }
      }, Xi = function(e3, t3, n2) {
        if (!t3 || 0 === t3.length) return;
        if (true === e3.frozen) return;
        const r2 = "undefined" != typeof process && process.env ? process.env : self.env || {};
        r2 && r2.DEBUG_TAGS && ((e4, t4, n3 = "") => {
          let r3 = e4.text || "[" + e4.implicit + "]";
          var a2;
          "string" != typeof t4 && t4.length > 2 && (t4 = t4.slice(0, 2).join(", #") + " +"), t4 = "string" != typeof t4 ? t4.join(", #") : t4, console.log(` ${(a2 = r3, "\x1B[33m\x1B[3m" + a2 + "\x1B[0m").padEnd(24)} \x1B[32m\u2192\x1B[0m #${t4.padEnd(22)}  ${((e5) => "\x1B[3m" + e5 + "\x1B[0m")(n3)}`);
        })(e3, t3, n2), e3.tags = e3.tags || /* @__PURE__ */ new Set(), "string" == typeof t3 ? e3.tags.add(t3) : t3.forEach((t4) => e3.tags.add(t4));
      }, Yi = ["Acronym", "Abbreviation", "ProperNoun", "Uncountable", "Possessive", "Pronoun", "Activity", "Honorific", "Month"], es = function(e3, t3, n2) {
        let r2 = e3[t3], a2 = Array.from(r2.tags);
        for (let e4 = 0; e4 < a2.length; e4 += 1) if (n2.one.tagSet[a2[e4]]) {
          let t4 = n2.one.tagSet[a2[e4]].parents;
          Xi(r2, t4, ` -inferred by #${a2[e4]}`);
        }
        !function(e4) {
          !e4.tags.has("Noun") || e4.tags.has("Plural") || e4.tags.has("Singular") || Yi.find((t4) => e4.tags.has(t4)) || ($i(e4.normal) ? Xi(e4, "Plural", "3-plural-guess") : Xi(e4, "Singular", "3-singular-guess"));
        }(r2), function(e4) {
          let t4 = e4.tags;
          if (t4.has("Verb") && 1 === t4.size) {
            let t5 = vi(e4.normal);
            t5 && Xi(e4, t5, "3-verb-tense-guess");
          }
        }(r2);
      }, ts = /^\p{Lu}[\p{Ll}'’]/u, ns = /[0-9]/, rs = ["Date", "Month", "WeekDay", "Unit", "Expression"], as = /[IVX]/, os2 = /^[IVXLCDM]{2,}$/, is = /^M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/, ss = { li: true, dc: true, md: true, dm: true, ml: true }, ls = function(e3, t3, n2) {
        let r2 = e3[t3];
        r2.index = r2.index || [0, 0];
        let a2 = r2.index[1], o2 = r2.text || "";
        return 0 !== a2 && true === ts.test(o2) && false === ns.test(o2) ? rs.find((e4) => r2.tags.has(e4)) || r2.pre.match(/["']$/) || "the" === r2.normal ? null : (es(e3, t3, n2), r2.tags.has("Noun") || r2.frozen || r2.tags.clear(), Xi(r2, "ProperNoun", "2-titlecase"), true) : o2.length >= 2 && os2.test(o2) && as.test(o2) && is.test(o2) && !ss[r2.normal] ? (Xi(r2, "RomanNumeral", "2-xvii"), true) : null;
      }, us = function(e3 = "", t3 = []) {
        const n2 = e3.length;
        let r2 = 7;
        n2 <= r2 && (r2 = n2 - 1);
        for (let a2 = r2; a2 > 1; a2 -= 1) {
          let r3 = e3.substring(n2 - a2, n2);
          if (true === t3[r3.length].hasOwnProperty(r3)) return t3[r3.length][r3];
        }
        return null;
      }, cs = function(e3, t3, n2) {
        let r2 = e3[t3];
        if (0 === r2.tags.size) {
          let e4 = us(r2.normal, n2.two.suffixPatterns);
          if (null !== e4) return Xi(r2, e4, "2-suffix"), r2.confidence = 0.7, true;
          if (r2.implicit && (e4 = us(r2.implicit, n2.two.suffixPatterns), null !== e4)) return Xi(r2, e4, "2-implicit-suffix"), r2.confidence = 0.7, true;
        }
        return null;
      }, hs = /['‘’‛‵′`´]/, ds = function(e3, t3) {
        for (let n2 = 0; n2 < t3.length; n2 += 1) if (true === t3[n2][0].test(e3)) return t3[n2];
        return null;
      }, gs = function(e3, t3, n2, r2) {
        const a2 = r2.methods.one.setTag;
        let { regexText: o2, regexNormal: i2, regexNumbers: s2, endsWith: l2 } = n2.two, u2 = e3[t3], c2 = u2.machine || u2.normal, h2 = u2.text;
        hs.test(u2.post) && !hs.test(u2.pre) && (h2 += u2.post.trim());
        let d2 = ds(h2, o2) || ds(c2, i2);
        return !d2 && /[0-9]/.test(c2) && (d2 = ds(c2, s2)), d2 || 0 !== u2.tags.size || (d2 = function(e4 = "", t4) {
          let n3 = e4[e4.length - 1];
          if (true === t4.hasOwnProperty(n3)) {
            let r3 = t4[n3] || [];
            for (let t5 = 0; t5 < r3.length; t5 += 1) if (true === r3[t5][0].test(e4)) return r3[t5];
          }
          return null;
        }(c2, l2)), d2 ? (a2([u2], d2[1], r2, null, `2-regex-'${d2[2] || d2[0]}'`), u2.confidence = 0.6, true) : null;
      }, ms = function(e3, t3, n2) {
        let r2 = e3[t3];
        if (0 === r2.tags.size) {
          let e4 = function(e5 = "", t4 = []) {
            const n3 = e5.length;
            let r3 = 7;
            r3 > n3 - 3 && (r3 = n3 - 3);
            for (let n4 = r3; n4 > 2; n4 -= 1) {
              let r4 = e5.substring(0, n4);
              if (true === t4[r4.length].hasOwnProperty(r4)) return t4[r4.length][r4];
            }
            return null;
          }(r2.normal, n2.two.prefixPatterns);
          if (null !== e4) return Xi(r2, e4, "2-prefix"), r2.confidence = 0.5, true;
        }
        return null;
      }, ps = /* @__PURE__ */ new Set(["in", "on", "by", "until", "for", "to", "during", "throughout", "through", "within", "before", "after", "of", "this", "next", "last", "circa", "around", "post", "pre", "budget", "classic", "plan", "may"]), fs2 = function(e3) {
        if (!e3) return false;
        let t3 = e3.normal || e3.implicit;
        return !!ps.has(t3) || !!(e3.tags.has("Date") || e3.tags.has("Month") || e3.tags.has("WeekDay") || e3.tags.has("Year")) || !!e3.tags.has("ProperNoun");
      }, bs = function(e3) {
        return !(!e3 || !e3.tags.has("Ordinal") && !(e3.tags.has("Cardinal") && e3.normal.length < 3) && "is" !== e3.normal && "was" !== e3.normal);
      }, vs = function(e3) {
        return e3 && (e3.tags.has("Date") || e3.tags.has("Month") || e3.tags.has("WeekDay") || e3.tags.has("Year"));
      }, ys = function(e3, t3) {
        const n2 = e3[t3];
        if (n2.tags.has("NumericValue") && n2.tags.has("Cardinal") && 4 === n2.normal.length) {
          let r2 = Number(n2.normal);
          if (r2 && !isNaN(r2) && r2 > 1400 && r2 < 2100) {
            let a2 = e3[t3 - 1], o2 = e3[t3 + 1];
            if (fs2(a2) || fs2(o2)) return Xi(n2, "Year", "2-tagYear");
            if (r2 >= 1920 && r2 < 2025) {
              if (bs(a2) || bs(o2)) return Xi(n2, "Year", "2-tagYear-close");
              if (vs(e3[t3 - 2]) || vs(e3[t3 + 2])) return Xi(n2, "Year", "2-tagYear-far");
              if (a2 && (a2.tags.has("Determiner") || a2.tags.has("Possessive")) && o2 && o2.tags.has("Noun") && !o2.tags.has("Plural")) return Xi(n2, "Year", "2-tagYear-noun");
            }
          }
        }
        return null;
      }, ws = function(e3, t3, n2, r2) {
        const a2 = r2.methods.one.setTag, o2 = e3[t3], i2 = ["PastTense", "PresentTense", "Auxiliary", "Modal", "Particle"];
        o2.tags.has("Verb") && (i2.find((e4) => o2.tags.has(e4)) || a2([o2], "Infinitive", r2, null, "2-verb-type''"));
      }, ks = /^[A-Z]('s|,)?$/, Ps = /^[A-Z-]+$/, As = /^[A-Z]+s$/, Cs = /([A-Z]\.)+[A-Z]?,?$/, Ns = /[A-Z]{2,}('s|,)?$/, js = /([a-z]\.)+[a-z]\.?$/, xs = { I: true, A: true }, Is = { la: true, ny: true, us: true, dc: true, gb: true }, Ts = function(e3, t3, n2) {
        let r2 = e3[t3];
        return r2.tags.has("RomanNumeral") || r2.tags.has("Acronym") || r2.frozen ? null : function(e4, t4) {
          let n3 = e4.text;
          if (false === Ps.test(n3)) {
            if (!(n3.length > 3 && true === As.test(n3))) return false;
            n3 = n3.replace(/s$/, "");
          }
          return !(n3.length > 5 || xs.hasOwnProperty(n3) || t4.one.lexicon.hasOwnProperty(e4.normal) || true !== Cs.test(n3) && true !== js.test(n3) && true !== ks.test(n3) && true !== Ns.test(n3));
        }(r2, n2) ? (r2.tags.clear(), Xi(r2, ["Acronym", "Noun"], "3-no-period-acronym"), true === Is[r2.normal] && Xi(r2, "Place", "3-place-acronym"), true === As.test(r2.text) && Xi(r2, "Plural", "3-plural-acronym"), true) : !xs.hasOwnProperty(r2.text) && ks.test(r2.text) ? (r2.tags.clear(), Xi(r2, ["Acronym", "Noun"], "3-one-letter-acronym"), true) : r2.tags.has("Organization") && r2.text.length <= 3 ? (Xi(r2, "Acronym", "3-org-acronym"), true) : r2.tags.has("Organization") && Ps.test(r2.text) && r2.text.length <= 6 ? (Xi(r2, "Acronym", "3-titlecase-acronym"), true) : null;
      }, Ds = function(e3, t3) {
        if (!e3) return null;
        let n2 = t3.find((t4) => e3.normal === t4[0]);
        return n2 ? n2[1] : null;
      }, Hs = function(e3, t3) {
        if (!e3) return null;
        let n2 = t3.find((t4) => e3.tags.has(t4[0]));
        return n2 ? n2[1] : null;
      }, Es = function(e3, t3, n2) {
        const { leftTags: r2, leftWords: a2, rightWords: o2, rightTags: i2 } = n2.two.neighbours;
        let s2 = e3[t3];
        if (0 === s2.tags.size) {
          let l2 = null;
          if (l2 = l2 || Ds(e3[t3 - 1], a2), l2 = l2 || Ds(e3[t3 + 1], o2), l2 = l2 || Hs(e3[t3 - 1], r2), l2 = l2 || Hs(e3[t3 + 1], i2), l2) return Xi(s2, l2, "3-[neighbour]"), es(e3, t3, n2), e3[t3].confidence = 0.2, true;
        }
        return null;
      }, Gs = function(e3, t3, n2) {
        return !!e3 && !e3.tags.has("FirstName") && !e3.tags.has("Place") && (!!(e3.tags.has("ProperNoun") || e3.tags.has("Organization") || e3.tags.has("Acronym")) || !(n2 || (r2 = e3.text, !/^\p{Lu}[\p{Ll}'’]/u.test(r2))) && (0 !== t3 || e3.tags.has("Singular")));
        var r2;
      }, Os = function(e3, t3, n2, r2) {
        const a2 = n2.model.two.orgWords, o2 = n2.methods.one.setTag;
        let i2 = e3[t3];
        if (true === a2[i2.machine || i2.normal] && Gs(e3[t3 - 1], t3 - 1, r2)) {
          o2([e3[t3]], "Organization", n2, null, "3-[org-word]");
          for (let a3 = t3; a3 >= 0 && Gs(e3[a3], a3, r2); a3 -= 1) o2([e3[a3]], "Organization", n2, null, "3-[org-word]");
        }
        return null;
      }, Fs = /'s$/, Vs = /* @__PURE__ */ new Set(["athletic", "city", "community", "eastern", "federal", "financial", "great", "historic", "historical", "local", "memorial", "municipal", "national", "northern", "provincial", "southern", "state", "western", "spring", "pine", "sunset", "view", "oak", "maple", "spruce", "cedar", "willow"]), zs = /* @__PURE__ */ new Set(["center", "centre", "way", "range", "bar", "bridge", "field", "pit"]), Bs = function(e3, t3, n2) {
        if (!e3) return false;
        let r2 = e3.tags;
        return !(r2.has("Organization") || r2.has("Possessive") || Fs.test(e3.normal)) && (!(!r2.has("ProperNoun") && !r2.has("Place")) || !(n2 || (a2 = e3.text, !/^\p{Lu}[\p{Ll}'’]/u.test(a2))) && (0 !== t3 || r2.has("Singular")));
        var a2;
      }, Ss = function(e3, t3, n2, r2) {
        const a2 = n2.model.two.placeWords, o2 = n2.methods.one.setTag;
        let i2 = e3[t3], s2 = i2.machine || i2.normal;
        if (true === a2[s2]) {
          for (let a3 = t3 - 1; a3 >= 0; a3 -= 1) if (!Vs.has(e3[a3].normal)) {
            if (!Bs(e3[a3], a3, r2)) break;
            o2(e3.slice(a3, t3 + 1), "Place", n2, null, "3-[place-of-foo]");
          }
          if (zs.has(s2)) return false;
          for (let a3 = t3 + 1; a3 < e3.length; a3 += 1) {
            if (Bs(e3[a3], a3, r2)) return o2(e3.slice(t3, a3 + 1), "Place", n2, null, "3-[foo-place]"), true;
            if ("of" !== e3[a3].normal && !Vs.has(e3[a3].normal)) break;
          }
        }
        return null;
      }, $s = function(e3, t3, n2) {
        let r2 = false, a2 = e3[t3].tags;
        (0 === a2.size || 1 === a2.size && (a2.has("Hyphenated") || a2.has("HashTag") || a2.has("Prefix") || a2.has("SlashedTerm"))) && (r2 = true), r2 && (Xi(e3[t3], "Noun", "3-[fallback]"), es(e3, t3, n2), e3[t3].confidence = 0.1);
      }, Ms = /^[A-Z][a-z]/, Ks = (e3, t3) => e3[t3].tags.has("ProperNoun") && Ms.test(e3[t3].text) ? "Noun" : null, Ls = (e3, t3, n2) => 0 !== t3 || e3[1] ? null : n2, Js = { "Adj|Gerund": (e3, t3) => Ks(e3, t3), "Adj|Noun": (e3, t3) => Ks(e3, t3) || function(e4, t4) {
        return !e4[t4 + 1] && e4[t4 - 1] && e4[t4 - 1].tags.has("Determiner") ? "Noun" : null;
      }(e3, t3), "Actor|Verb": (e3, t3) => Ks(e3, t3), "Adj|Past": (e3, t3) => Ks(e3, t3), "Adj|Present": (e3, t3) => Ks(e3, t3), "Noun|Gerund": (e3, t3) => Ks(e3, t3), "Noun|Verb": (e3, t3) => t3 > 0 && Ks(e3, t3) || Ls(e3, t3, "Infinitive"), "Plural|Verb": (e3, t3) => Ks(e3, t3) || Ls(e3, t3, "PresentTense") || function(e4, t4, n2) {
        return 0 === t4 && e4.length > 3 ? n2 : null;
      }(e3, t3, "Plural"), "Person|Noun": (e3, t3) => Ks(e3, t3), "Person|Verb": (e3, t3) => 0 !== t3 ? Ks(e3, t3) : null, "Person|Adj": (e3, t3) => 0 === t3 && e3.length > 1 || Ks(e3, t3) ? "Person" : null }, Ws = "undefined" != typeof process && process.env ? process.env : self.env || {}, qs = /^(under|over|mis|re|un|dis|semi)-?/, Us = (e3, t3) => {
        if (!e3 || !t3) return null;
        let n2 = e3.normal || e3.implicit, r2 = null;
        return t3.hasOwnProperty(n2) && (r2 = t3[n2]), r2 && Ws.DEBUG_TAGS && console.log(`
  \x1B[2m\x1B[3m     \u2193 - '${n2}' \x1B[0m`), r2;
      }, Rs = (e3, t3 = {}, n2) => {
        if (!e3 || !t3) return null;
        let r2 = Array.from(e3.tags).sort((e4, t4) => (n2[e4] ? n2[e4].parents.length : 0) > (n2[t4] ? n2[t4].parents.length : 0) ? -1 : 1), a2 = r2.find((e4) => t3[e4]);
        return a2 && Ws.DEBUG_TAGS && console.log(`  \x1B[2m\x1B[3m      \u2193 - '${e3.normal || e3.implicit}' (#${a2})  \x1B[0m`), a2 = t3[a2], a2;
      }, Qs = function(e3, t3, n2) {
        const r2 = n2.model, a2 = n2.methods.one.setTag, { switches: o2, clues: i2 } = r2.two, s2 = e3[t3];
        let l2 = s2.normal || s2.implicit || "";
        if (qs.test(l2) && !o2[l2] && (l2 = l2.replace(qs, "")), s2.switch) {
          let o3 = s2.switch;
          if (s2.tags.has("Acronym") || s2.tags.has("PhrasalVerb")) return;
          let u2 = function(e4, t4, n3, r3) {
            if (!n3) return null;
            const a3 = "also" !== e4[t4 - 1]?.text ? t4 - 1 : Math.max(0, t4 - 2), o4 = r3.one.tagSet;
            let i3 = Us(e4[t4 + 1], n3.afterWords);
            return i3 = i3 || Us(e4[a3], n3.beforeWords), i3 = i3 || Rs(e4[a3], n3.beforeTags, o4), i3 = i3 || Rs(e4[t4 + 1], n3.afterTags, o4), i3;
          }(e3, t3, i2[o3], r2);
          Js[o3] && (u2 = Js[o3](e3, t3) || u2), u2 ? (a2([s2], u2, n2, null, `3-[switch] (${o3})`), es(e3, t3, r2)) : Ws.DEBUG_TAGS && console.log(`
 -> X  - '${l2}'  : (${o3})  `);
        }
      }, Zs = { there: true, this: true, it: true, him: true, her: true, us: true }, _s = function(e3) {
        if (e3.filter((e4) => !e4.tags.has("ProperNoun")).length <= 3) return false;
        const t3 = /^[a-z]/;
        return e3.every((e4) => !t3.test(e4.text));
      }, Xs = function(e3, t3, n2, r2) {
        for (let a2 = 0; a2 < e3.length; a2 += 1) true !== e3[a2].frozen && (_i(e3, a2, t3), false === r2 && ls(e3, a2, t3), cs(e3, a2, t3), gs(e3, a2, t3, n2), ms(e3, a2, t3), ys(e3, a2));
      }, Ys = function(e3, t3, n2, r2) {
        for (let n3 = 0; n3 < e3.length; n3 += 1) {
          let r3 = Ts(e3, n3, t3);
          es(e3, n3, t3), r3 = r3 || Es(e3, n3, t3), r3 = r3 || $s(e3, n3, t3);
        }
        for (let t4 = 0; t4 < e3.length; t4 += 1) true !== e3[t4].frozen && (Os(e3, t4, n2, r2), Ss(e3, t4, n2, r2), Qs(e3, t4, n2), ws(e3, t4, 0, n2), Qi(e3, t4, 0, n2));
        !function(e4, t4) {
          const n3 = t4.methods.one.setTag, r3 = t4.model.one._multiCache || {};
          let a2 = e4[0];
          if (("Noun|Verb" === a2.switch || a2.tags.has("Infinitive")) && e4.length >= 2) {
            if (e4.length < 4 && !Zs[e4[1].normal]) return;
            if (!a2.tags.has("PhrasalVerb") && r3.hasOwnProperty(a2.normal)) return;
            (e4[1].tags.has("Noun") || e4[1].tags.has("Determiner")) && (e4.slice(1, 3).some((e5) => e5.tags.has("Verb")) && !a2.tags.has("#PhrasalVerb") || n3([a2], "Imperative", t4, null, "3-[imperative]"));
          }
        }(e3, n2);
      }, el = { Possessive: (e3) => {
        let t3 = e3.machine || e3.normal || e3.text;
        return t3 = t3.replace(/'s$/, ""), t3;
      }, Plural: (e3, t3) => {
        let n2 = e3.machine || e3.normal || e3.text;
        return t3.methods.two.transform.noun.toSingular(n2, t3.model);
      }, Copula: () => "is", PastTense: (e3, t3) => {
        let n2 = e3.machine || e3.normal || e3.text;
        return t3.methods.two.transform.verb.toInfinitive(n2, t3.model, "PastTense");
      }, Gerund: (e3, t3) => {
        let n2 = e3.machine || e3.normal || e3.text;
        return t3.methods.two.transform.verb.toInfinitive(n2, t3.model, "Gerund");
      }, PresentTense: (e3, t3) => {
        let n2 = e3.machine || e3.normal || e3.text;
        return e3.tags.has("Infinitive") ? n2 : t3.methods.two.transform.verb.toInfinitive(n2, t3.model, "PresentTense");
      }, Comparative: (e3, t3) => {
        let n2 = e3.machine || e3.normal || e3.text;
        return t3.methods.two.transform.adjective.fromComparative(n2, t3.model);
      }, Superlative: (e3, t3) => {
        let n2 = e3.machine || e3.normal || e3.text;
        return t3.methods.two.transform.adjective.fromSuperlative(n2, t3.model);
      }, Adverb: (e3, t3) => {
        const { fromAdverb: n2 } = t3.methods.two.transform.adjective;
        return n2(e3.machine || e3.normal || e3.text);
      } }, tl = { Adverb: "RB", Comparative: "JJR", Superlative: "JJS", Adjective: "JJ", TO: "Conjunction", Modal: "MD", Auxiliary: "MD", Gerund: "VBG", PastTense: "VBD", Participle: "VBN", PresentTense: "VBZ", Infinitive: "VB", Particle: "RP", Verb: "VB", Pronoun: "PRP", Cardinal: "CD", Conjunction: "CC", Determiner: "DT", Preposition: "IN", QuestionWord: "WP", Expression: "UH", Possessive: "POS", ProperNoun: "NNP", Person: "NNP", Place: "NNP", Organization: "NNP", Singular: "NN", Plural: "NNS", Noun: "NN", There: "EX" };
      var nl = { preTagger: function(e3) {
        const { methods: t3, model: n2, world: r2 } = e3;
        let a2 = e3.docs;
        !function(e4, t4, n3) {
          e4.forEach((e5) => {
            !function(e6, t5, n4, r3) {
              const a3 = r3.methods.one.setTag;
              if (e6.length >= 3) {
                const t6 = /:/;
                if (e6[0].post.match(t6)) {
                  let t7 = e6[1];
                  if (t7.tags.has("Value") || t7.tags.has("Email") || t7.tags.has("PhoneNumber")) return;
                  a3([e6[0]], "Expression", r3, null, "2-punct-colon''");
                }
              }
            }(e5, 0, 0, n3);
          });
        }(a2, 0, r2);
        let o2 = t3.two.quickSplit(a2);
        for (let e4 = 0; e4 < o2.length; e4 += 1) {
          let t4 = o2[e4];
          const a3 = _s(t4);
          Xs(t4, n2, r2, a3), Ys(t4, n2, r2, a3);
        }
        return o2;
      }, root: function(e3) {
        const t3 = e3.world, n2 = Object.keys(el);
        e3.docs.forEach((e4) => {
          for (let r2 = 0; r2 < e4.length; r2 += 1) {
            const a2 = e4[r2];
            for (let e5 = 0; e5 < n2.length; e5 += 1) if (a2.tags.has(n2[e5])) {
              let r3 = (0, el[n2[e5]])(a2, t3);
              a2.normal !== r3 && (a2.root = r3);
              break;
            }
          }
        });
      }, penn: function(e3) {
        e3.compute("tagRank"), e3.docs.forEach((e4) => {
          e4.forEach((e5) => {
            e5.penn = function(e6) {
              if (e6.tags.has("ProperNoun") && e6.tags.has("Plural")) return "NNPS";
              if (e6.tags.has("Possessive") && e6.tags.has("Pronoun")) return "PRP$";
              if ("there" === e6.normal) return "EX";
              if ("to" === e6.normal) return "TO";
              let t3 = e6.tagRank || [];
              for (let e7 = 0; e7 < t3.length; e7 += 1) if (tl.hasOwnProperty(t3[e7])) return tl[t3[e7]];
              return null;
            }(e5);
          });
        });
      } };
      const rl = ["Person", "Place", "Organization"];
      var al = { Noun: { not: ["Verb", "Adjective", "Adverb", "Value", "Determiner"] }, Singular: { is: "Noun", not: ["Plural", "Uncountable"] }, ProperNoun: { is: "Noun" }, Person: { is: "Singular", also: ["ProperNoun"], not: ["Place", "Organization", "Date"] }, FirstName: { is: "Person" }, MaleName: { is: "FirstName", not: ["FemaleName", "LastName"] }, FemaleName: { is: "FirstName", not: ["MaleName", "LastName"] }, LastName: { is: "Person", not: ["FirstName"] }, Honorific: { is: "Person", not: ["FirstName", "LastName", "Value"] }, Place: { is: "Singular", not: ["Person", "Organization"] }, Country: { is: "Place", also: ["ProperNoun"], not: ["City"] }, City: { is: "Place", also: ["ProperNoun"], not: ["Country"] }, Region: { is: "Place", also: ["ProperNoun"] }, Address: {}, Organization: { is: "ProperNoun", not: ["Person", "Place"] }, SportsTeam: { is: "Organization" }, School: { is: "Organization" }, Company: { is: "Organization" }, Plural: { is: "Noun", not: ["Singular", "Uncountable"] }, Uncountable: { is: "Noun" }, Pronoun: { is: "Noun", not: rl }, Actor: { is: "Noun", not: ["Place", "Organization"] }, Activity: { is: "Noun", not: ["Person", "Place"] }, Unit: { is: "Noun", not: rl }, Demonym: { is: "Noun", also: ["ProperNoun"], not: rl }, Possessive: { is: "Noun" }, Reflexive: { is: "Pronoun" } }, ol = { Adjective: { not: ["Noun", "Verb", "Adverb", "Value"] }, Comparable: { is: "Adjective" }, Comparative: { is: "Adjective" }, Superlative: { is: "Adjective", not: ["Comparative"] }, NumberRange: {}, Adverb: { not: ["Noun", "Verb", "Adjective", "Value"] }, Determiner: { not: ["Noun", "Verb", "Adjective", "Adverb", "QuestionWord", "Conjunction"] }, Conjunction: { not: ["Noun", "Verb", "Adjective", "Adverb", "Value", "QuestionWord"] }, Preposition: { not: ["Noun", "Verb", "Adjective", "Adverb", "QuestionWord", "Determiner"] }, QuestionWord: { not: ["Determiner"] }, Currency: { is: "Noun" }, Expression: { not: ["Noun", "Adjective", "Verb", "Adverb"] }, Abbreviation: {}, Url: { not: ["HashTag", "PhoneNumber", "Verb", "Adjective", "Value", "AtMention", "Email", "SlashedTerm"] }, PhoneNumber: { not: ["HashTag", "Verb", "Adjective", "Value", "AtMention", "Email"] }, HashTag: {}, AtMention: { is: "Noun", not: ["HashTag", "Email"] }, Emoji: { not: ["HashTag", "Verb", "Adjective", "Value", "AtMention"] }, Emoticon: { not: ["HashTag", "Verb", "Adjective", "Value", "AtMention", "SlashedTerm"] }, SlashedTerm: { not: ["Emoticon", "Url", "Value"] }, Email: { not: ["HashTag", "Verb", "Adjective", "Value", "AtMention"] }, Acronym: { not: ["Plural", "RomanNumeral", "Pronoun", "Date"] }, Negative: { not: ["Noun", "Adjective", "Value", "Expression"] }, Condition: { not: ["Verb", "Adjective", "Noun", "Value"] }, There: { not: ["Verb", "Adjective", "Noun", "Value", "Conjunction", "Preposition"] }, Prefix: { not: ["Abbreviation", "Acronym", "ProperNoun"] }, Hyphenated: {} };
      let il = Object.assign({}, al, { Verb: { not: ["Noun", "Adjective", "Adverb", "Value", "Expression"] }, PresentTense: { is: "Verb", not: ["PastTense", "FutureTense"] }, Infinitive: { is: "PresentTense", not: ["Gerund"] }, Imperative: { is: "Verb", not: ["PastTense", "Gerund", "Copula"] }, Gerund: { is: "PresentTense", not: ["Copula"] }, PastTense: { is: "Verb", not: ["PresentTense", "Gerund", "FutureTense"] }, FutureTense: { is: "Verb", not: ["PresentTense", "PastTense"] }, Copula: { is: "Verb" }, Modal: { is: "Verb", not: ["Infinitive"] }, Participle: { is: "PastTense" }, Auxiliary: { is: "Verb", not: ["PastTense", "PresentTense", "Gerund", "Conjunction"] }, PhrasalVerb: { is: "Verb" }, Particle: { is: "PhrasalVerb", not: ["PastTense", "PresentTense", "Copula", "Gerund"] }, Passive: { is: "Verb" } }, { Value: { not: ["Verb", "Adjective", "Adverb"] }, Ordinal: { is: "Value", not: ["Cardinal"] }, Cardinal: { is: "Value", not: ["Ordinal"] }, Fraction: { is: "Value", not: ["Noun"] }, Multiple: { is: "TextValue" }, RomanNumeral: { is: "Cardinal", not: ["TextValue"] }, TextValue: { is: "Value", not: ["NumericValue"] }, NumericValue: { is: "Value", not: ["TextValue"] }, Money: { is: "Cardinal" }, Percent: { is: "Value" } }, { Date: { not: ["Verb", "Adverb", "Adjective"] }, Month: { is: "Date", also: ["Noun"], not: ["Year", "WeekDay", "Time"] }, WeekDay: { is: "Date", also: ["Noun"] }, Year: { is: "Date", not: ["RomanNumeral"] }, FinancialQuarter: { is: "Date", not: "Fraction" }, Holiday: { is: "Date", also: ["Noun"] }, Season: { is: "Date" }, Timezone: { is: "Date", also: ["Noun"], not: ["ProperNoun"] }, Time: { is: "Date", not: ["AtMention"] }, Duration: { is: "Date", also: ["Noun"] } }, ol);
      var sl = { compute: nl, methods: Mi, model: Ri, tags: il, hooks: ["preTagger"] };
      const ll = /[,)"';:\-–—.…]/, ul = function(e3, t3) {
        if (!e3.found) return;
        let n2 = e3.termList();
        for (let e4 = 0; e4 < n2.length - 1; e4++) {
          const t4 = n2[e4];
          if (ll.test(t4.post)) return;
        }
        n2[0].implicit = n2[0].normal, n2[0].text += t3, n2[0].normal += t3, n2.slice(1).forEach((e4) => {
          e4.implicit = e4.normal, e4.text = "", e4.normal = "";
        });
        for (let e4 = 0; e4 < n2.length - 1; e4++) n2[e4].post = n2[e4].post.replace(/ /, "");
      }, cl = function() {
        let e3 = this.not("@hasContraction"), t3 = e3.match("(we|they|you) are");
        return ul(t3, "'re"), t3 = e3.match("(he|she|they|it|we|you) will"), ul(t3, "'ll"), t3 = e3.match("(he|she|they|it|we) is"), ul(t3, "'s"), t3 = e3.match("#Person is"), ul(t3, "'s"), t3 = e3.match("#Person would"), ul(t3, "'d"), t3 = e3.match("(is|was|had|would|should|could|do|does|have|has|can) not"), ul(t3, "n't"), t3 = e3.match("(i|we|they) have"), ul(t3, "'ve"), t3 = e3.match("(would|should|could) have"), ul(t3, "'ve"), t3 = e3.match("i am"), ul(t3, "'m"), t3 = e3.match("going to"), this;
      }, hl = /^\p{Lu}[\p{Ll}'’]/u, dl = function(e3, t3, n2) {
        let [r2, a2] = t3;
        n2 && 0 !== n2.length && (n2 = n2.map((e4, t4) => (e4.implicit = e4.text, e4.machine = e4.text, e4.pre = "", e4.post = "", e4.text = "", e4.normal = "", e4.index = [r2, a2 + t4], e4)), n2[0] && (n2[0].pre = e3[r2][a2].pre, n2[n2.length - 1].post = e3[r2][a2].post, n2[0].text = e3[r2][a2].text, n2[0].normal = e3[r2][a2].normal), e3[r2].splice(a2, 1, ...n2));
      }, gl = /'/, ml = /* @__PURE__ */ new Set(["been", "become"]), pl = /* @__PURE__ */ new Set(["what", "how", "when", "if", "too"]);
      let fl = /* @__PURE__ */ new Set(["too", "also", "enough"]);
      const bl = function(e3, t3) {
        let n2 = e3[t3].normal.split(gl)[0];
        if ("let" === n2) return [n2, "us"];
        if ("there" === n2) {
          let r2 = e3[t3 + 1];
          if (r2 && r2.tags.has("Plural")) return [n2, "are"];
        }
        return "has" === ((e4, t4) => {
          for (let n3 = t4 + 1; n3 < e4.length; n3 += 1) {
            let t5 = e4[n3];
            if (ml.has(t5.normal)) return "has";
            if (pl.has(t5.normal)) return "is";
            if (t5.tags.has("Gerund")) return "is";
            if (t5.tags.has("Determiner")) return "is";
            if (t5.tags.has("Adjective")) return "is";
            if ("Adj|Past" === t5.switch && e4[n3 + 1]) {
              if (fl.has(e4[n3 + 1].normal)) return "is";
              if (e4[n3 + 1].tags.has("Preposition")) return "is";
            }
            if (t5.tags.has("PastTense")) return e4[n3 + 1] && "for" === e4[n3 + 1].normal ? "is" : "has";
          }
          return "is";
        })(e3, t3) ? [n2, "has"] : [n2, "is"];
      }, vl = /'/, yl = /* @__PURE__ */ new Set(["better", "done", "before", "it", "had"]), wl = /* @__PURE__ */ new Set(["have", "be"]), kl = function(e3, t3) {
        let n2 = e3[t3].normal.split(vl)[0];
        return "how" === n2 || "what" === n2 ? [n2, "did"] : "had" === ((e4, t4) => {
          for (let n3 = t4 + 1; n3 < e4.length; n3 += 1) {
            let t5 = e4[n3];
            if (yl.has(t5.normal)) return "had";
            if (wl.has(t5.normal)) return "would";
            if (t5.tags.has("PastTense") || "Adj|Past" === t5.switch) return "had";
            if (t5.tags.has("PresentTense") || t5.tags.has("Infinitive")) return "would";
            if (t5.tags.has("#Determiner")) return "had";
            if (t5.tags.has("Adjective")) return "would";
          }
          return false;
        })(e3, t3) ? [n2, "had"] : [n2, "would"];
      }, Pl = { that: true, there: true, let: true, here: true, everywhere: true }, Al = { in: true, by: true, for: true };
      let Cl = /* @__PURE__ */ new Set(["too", "also", "enough", "about"]), Nl = /* @__PURE__ */ new Set(["is", "are", "did", "were", "could", "should", "must", "had", "have"]);
      const jl = /'/, xl = function(e3, t3, n2, r2) {
        let a2 = t3.update();
        a2.document = [e3];
        let o2 = n2 + r2;
        n2 > 0 && (n2 -= 1), e3[o2] && (o2 += 1), a2.ptrs = [[0, n2, o2]], a2.compute(["freeze", "lexicon", "preTagger", "unfreeze"]), function(e4) {
          e4.forEach((e5, t4) => {
            e5.index && (e5.index[1] = t4);
          });
        }(e3);
      }, Il = { d: (e3, t3) => kl(e3, t3), t: (e3, t3) => function(e4, t4) {
        if ("ain't" === e4[t4].normal || "aint" === e4[t4].normal) {
          if (e4[t4 + 1] && "never" === e4[t4 + 1].normal) return ["have"];
          let n2 = function(e5, t5) {
            for (let n3 = t5 - 1; n3 >= 0; n3 -= 1) if (e5[n3].tags.has("Noun") || e5[n3].tags.has("Pronoun") || e5[n3].tags.has("Plural") || e5[n3].tags.has("Singular")) return e5[n3];
            return null;
          }(e4, t4);
          if (n2) {
            if ("we" === n2.normal || "they" === n2.normal) return ["are", "not"];
            if ("i" === n2.normal) return ["am", "not"];
            if (n2.tags && n2.tags.has("Plural")) return ["are", "not"];
          }
          return ["is", "not"];
        }
        return [e4[t4].normal.replace(/n't/, ""), "not"];
      }(e3, t3), s: (e3, t3, n2) => ((e4, t4) => {
        let n3 = e4[t4];
        if (Pl.hasOwnProperty(n3.machine || n3.normal)) return false;
        if (n3.tags.has("Possessive")) return true;
        if (n3.tags.has("QuestionWord")) return false;
        if ("he's" === n3.normal || "she's" === n3.normal) return false;
        let r2 = e4[t4 + 1];
        if (!r2) return true;
        if ("it's" === n3.normal) return !!r2.tags.has("#Noun");
        if ("Noun|Gerund" == r2.switch) {
          let r3 = e4[t4 + 2];
          return r3 ? !!r3.tags.has("Copula") || ("on" === r3.normal || r3.normal, false) : !(!n3.tags.has("Actor") && !n3.tags.has("ProperNoun"));
        }
        if (r2.tags.has("Verb")) return !!r2.tags.has("Infinitive") || !r2.tags.has("Gerund") && !!r2.tags.has("PresentTense");
        if ("Adj|Noun" === r2.switch) {
          let n4 = e4[t4 + 2];
          if (!n4) return false;
          if (Nl.has(n4.normal)) return true;
          if (Cl.has(n4.normal)) return false;
        }
        if (r2.tags.has("Noun")) {
          let e5 = r2.machine || r2.normal;
          return !("here" === e5 || "there" === e5 || "everywhere" === e5 || r2.tags.has("Possessive") || r2.tags.has("ProperNoun") && !n3.tags.has("ProperNoun"));
        }
        if (e4[t4 - 1] && true === Al[e4[t4 - 1].normal]) return true;
        if (r2.tags.has("Adjective")) {
          let n4 = e4[t4 + 2];
          if (!n4) return false;
          if (n4.tags.has("Noun") && !n4.tags.has("Pronoun")) {
            let e5 = r2.normal;
            return "above" !== e5 && "below" !== e5 && "behind" !== e5;
          }
          return "Noun|Verb" === n4.switch;
        }
        return !!r2.tags.has("Value");
      })(e3, t3) ? n2.methods.one.setTag([e3[t3]], "Possessive", n2, null, "2-contraction") : bl(e3, t3) }, Tl = function(e3, t3) {
        let n2 = t3.fromText(e3.join(" "));
        return n2.compute("id"), n2.docs[0];
      };
      var Dl = { contractionTwo: (e3) => {
        let { world: t3, document: n2 } = e3;
        n2.forEach((r2, a2) => {
          for (let o2 = r2.length - 1; o2 >= 0; o2 -= 1) {
            if (r2[o2].implicit) continue;
            let i2 = null;
            true === jl.test(r2[o2].normal) && (i2 = r2[o2].normal.split(jl)[1]);
            let s2 = null;
            Il.hasOwnProperty(i2) && (s2 = Il[i2](r2, o2, t3)), s2 && (s2 = Tl(s2, e3), dl(n2, [a2, o2], s2), xl(n2[a2], e3, o2, s2.length));
          }
        });
      } }, Hl = { compute: Dl, api: function(e3) {
        class Contractions extends e3 {
          constructor(e4, t3, n2) {
            super(e4, t3, n2), this.viewType = "Contraction";
          }
          expand() {
            return this.docs.forEach((e4) => {
              let t3 = hl.test(e4[0].text);
              e4.forEach((t4, n2) => {
                t4.text = t4.implicit || "", delete t4.implicit, n2 < e4.length - 1 && "" === t4.post && (t4.post += " "), t4.dirty = true;
              }), t3 && (e4[0].text = function(e5 = "") {
                return e5.replace(/^ *[a-z\u00C0-\u00FF]/, (e6) => e6.toUpperCase());
              }(e4[0].text));
            }), this.compute("normal"), this;
          }
        }
        e3.prototype.contractions = function() {
          let e4 = this.match("@hasContraction+");
          return new Contractions(this.document, e4.pointer);
        }, e3.prototype.contract = cl;
      }, hooks: ["contractionTwo"] };
      const El = "(hard|fast|late|early|high|right|deep|close|direct)", Gl = "(i|we|they)";
      let Ol = [].concat([{ match: "(got|were|was|is|are|am) (#PastTense|#Participle)", tag: "Passive", reason: "got-walked" }, { match: "(was|were|is|are|am) being (#PastTense|#Participle)", tag: "Passive", reason: "was-being" }, { match: "(had|have|has) been (#PastTense|#Participle)", tag: "Passive", reason: "had-been" }, { match: "will be being? (#PastTense|#Participle)", tag: "Passive", reason: "will-be-cleaned" }, { match: "#Noun [(#PastTense|#Participle)] by (the|a) #Noun", group: 0, tag: "Passive", reason: "suffered-by" }], [{ match: "[(all|both)] #Determiner #Noun", group: 0, tag: "Noun", reason: "all-noun" }, { match: "#Copula [(just|alone)]$", group: 0, tag: "Adjective", reason: "not-adverb" }, { match: "#Singular is #Adverb? [#PastTense$]", group: 0, tag: "Adjective", reason: "is-filled" }, { match: "[#PastTense] #Singular is", group: 0, tag: "Adjective", reason: "smoked-poutine" }, { match: "[#PastTense] #Plural are", group: 0, tag: "Adjective", reason: "baked-onions" }, { match: "well [#PastTense]", group: 0, tag: "Adjective", reason: "well-made" }, { match: "#Copula [fucked up?]", group: 0, tag: "Adjective", reason: "swears-adjective" }, { match: "#Singular (seems|appears) #Adverb? [#PastTense$]", group: 0, tag: "Adjective", reason: "seems-filled" }, { match: "#Copula #Adjective? [(out|in|through)]$", group: 0, tag: "Adjective", reason: "still-out" }, { match: "^[#Adjective] (the|your) #Noun", group: 0, notIf: "(all|even)", tag: "Infinitive", reason: "shut-the" }, { match: "the [said] #Noun", group: 0, tag: "Adjective", reason: "the-said-card" }, { match: "[#Hyphenated (#Hyphenated && #PastTense)] (#Noun|#Conjunction)", group: 0, tag: "Adjective", notIf: "#Adverb", reason: "faith-based" }, { match: "[#Hyphenated (#Hyphenated && #Gerund)] (#Noun|#Conjunction)", group: 0, tag: "Adjective", notIf: "#Adverb", reason: "self-driving" }, { match: "[#PastTense (#Hyphenated && #PhrasalVerb)] (#Noun|#Conjunction)", group: 0, tag: "Adjective", reason: "dammed-up" }, { match: "(#Hyphenated && #Value) fold", tag: "Adjective", reason: "two-fold" }, { match: "must (#Hyphenated && #Infinitive)", tag: "Adjective", reason: "must-win" }, { match: "(#Hyphenated && #Infinitive) #Hyphenated", tag: "Adjective", notIf: "#PhrasalVerb", reason: "vacuum-sealed" }, { match: "too much", tag: "Adverb Adjective", reason: "bit-4" }, { match: "a bit much", tag: "Determiner Adverb Adjective", reason: "bit-3" }, { match: "[(un|contra|extra|inter|intra|macro|micro|mid|mis|mono|multi|pre|sub|tri|ex)] #Adjective", group: 0, tag: ["Adjective", "Prefix"], reason: "un-skilled" }], [{ match: "#Adverb [#Adverb] (and|or|then)", group: 0, tag: "Adjective", reason: "kinda-sparkly-and" }, { match: "[(dark|bright|flat|light|soft|pale|dead|dim|faux|little|wee|sheer|most|near|good|extra|all)] #Adjective", group: 0, tag: "Adverb", reason: "dark-green" }, { match: "#Copula [far too] #Adjective", group: 0, tag: "Adverb", reason: "far-too" }, { match: "#Copula [still] (in|#Gerund|#Adjective)", group: 0, tag: "Adverb", reason: "was-still-walking" }, { match: `#Plural ${El}`, tag: "#PresentTense #Adverb", reason: "studies-hard" }, { match: `#Verb [${El}] !#Noun?`, group: 0, notIf: "(#Copula|get|got|getting|become|became|becoming|feel|feels|feeling|#Determiner|#Preposition)", tag: "Adverb", reason: "shops-direct" }, { match: "[#Plural] a lot", tag: "PresentTense", reason: "studies-a-lot" }], [{ match: "as [#Gerund] as", group: 0, tag: "Adjective", reason: "as-gerund-as" }, { match: "more [#Gerund] than", group: 0, tag: "Adjective", reason: "more-gerund-than" }, { match: "(so|very|extremely) [#Gerund]", group: 0, tag: "Adjective", reason: "so-gerund" }, { match: "(found|found) it #Adverb? [#Gerund]", group: 0, tag: "Adjective", reason: "found-it-gerund" }, { match: "a (little|bit|wee) bit? [#Gerund]", group: 0, tag: "Adjective", reason: "a-bit-gerund" }, { match: "#Gerund [#Gerund]", group: 0, tag: "Adjective", notIf: "(impersonating|practicing|considering|assuming)", reason: "looking-annoying" }, { match: "(looked|look|looks) #Adverb? [%Adj|Gerund%]", group: 0, tag: "Adjective", notIf: "(impersonating|practicing|considering|assuming)", reason: "looked-amazing" }, { match: "[%Adj|Gerund%] #Determiner", group: 0, tag: "Gerund", reason: "developing-a" }, { match: "#Possessive [%Adj|Gerund%] #Noun", group: 0, tag: "Adjective", reason: "leading-manufacturer" }, { match: "%Noun|Gerund% %Adj|Gerund%", tag: "Gerund #Adjective", reason: "meaning-alluring" }, { match: "(face|embrace|reveal|stop|start|resume) %Adj|Gerund%", tag: "#PresentTense #Adjective", reason: "face-shocking" }, { match: "(are|were) [%Adj|Gerund%] #Plural", group: 0, tag: "Adjective", reason: "are-enduring-symbols" }], [{ match: "#Determiner [#Adjective] #Copula", group: 0, tag: "Noun", reason: "the-adj-is" }, { match: "#Adjective [#Adjective] #Copula", group: 0, tag: "Noun", reason: "adj-adj-is" }, { match: "(his|its) [%Adj|Noun%]", group: 0, tag: "Noun", notIf: "#Hyphenated", reason: "his-fine" }, { match: "#Copula #Adverb? [all]", group: 0, tag: "Noun", reason: "is-all" }, { match: "(have|had) [#Adjective] #Preposition .", group: 0, tag: "Noun", reason: "have-fun" }, { match: "#Gerund (giant|capital|center|zone|application)", tag: "Noun", reason: "brewing-giant" }, { match: "#Preposition (a|an) [#Adjective]$", group: 0, tag: "Noun", reason: "an-instant" }, { match: "no [#Adjective] #Modal", group: 0, tag: "Noun", reason: "no-golden" }, { match: "[brand #Gerund?] new", group: 0, tag: "Adverb", reason: "brand-new" }, { match: "(#Determiner|#Comparative|new|different) [kind]", group: 0, tag: "Noun", reason: "some-kind" }, { match: "#Possessive [%Adj|Noun%] #Noun", group: 0, tag: "Adjective", reason: "her-favourite" }, { match: "must && #Hyphenated .", tag: "Adjective", reason: "must-win" }, { match: "#Determiner [#Adjective]$", tag: "Noun", notIf: "(this|that|#Comparative|#Superlative)", reason: "the-south" }, { match: "(#Noun && #Hyphenated) (#Adjective && #Hyphenated)", tag: "Adjective", notIf: "(this|that|#Comparative|#Superlative)", reason: "company-wide" }, { match: "#Determiner [#Adjective] (#Copula|#Determiner)", notIf: "(#Comparative|#Superlative)", group: 0, tag: "Noun", reason: "the-poor" }, { match: "[%Adj|Noun%] #Noun", notIf: "(#Pronoun|#ProperNoun)", group: 0, tag: "Adjective", reason: "stable-foundations" }], [{ match: "[still] #Adjective", group: 0, tag: "Adverb", reason: "still-advb" }, { match: "[still] #Verb", group: 0, tag: "Adverb", reason: "still-verb" }, { match: "[so] #Adjective", group: 0, tag: "Adverb", reason: "so-adv" }, { match: "[way] #Comparative", group: 0, tag: "Adverb", reason: "way-adj" }, { match: "[way] #Adverb #Adjective", group: 0, tag: "Adverb", reason: "way-too-adj" }, { match: "[all] #Verb", group: 0, tag: "Adverb", reason: "all-verb" }, { match: "#Verb  [like]", group: 0, notIf: "(#Modal|#PhrasalVerb)", tag: "Adverb", reason: "verb-like" }, { match: "(barely|hardly) even", tag: "Adverb", reason: "barely-even" }, { match: "[even] #Verb", group: 0, tag: "Adverb", reason: "even-walk" }, { match: "[even] #Comparative", group: 0, tag: "Adverb", reason: "even-worse" }, { match: "[even] (#Determiner|#Possessive)", group: 0, tag: "#Adverb", reason: "even-the" }, { match: "even left", tag: "#Adverb #Verb", reason: "even-left" }, { match: "[way] #Adjective", group: 0, tag: "#Adverb", reason: "way-over" }, { match: "#PresentTense [(hard|quick|bright|slow|fast|backwards|forwards)]", notIf: "#Copula", group: 0, tag: "Adverb", reason: "lazy-ly" }, { match: "[much] #Adjective", group: 0, tag: "Adverb", reason: "bit-1" }, { match: "#Copula [#Adverb]$", group: 0, tag: "Adjective", reason: "is-well" }, { match: "a [(little|bit|wee) bit?] #Adjective", group: 0, tag: "Adverb", reason: "a-bit-cold" }, { match: "[(super|pretty)] #Adjective", group: 0, tag: "Adverb", reason: "super-strong" }, { match: "(become|fall|grow) #Adverb? [#PastTense]", group: 0, tag: "Adjective", reason: "overly-weakened" }, { match: "(a|an) #Adverb [#Participle] #Noun", group: 0, tag: "Adjective", reason: "completely-beaten" }, { match: "#Determiner #Adverb? [close]", group: 0, tag: "Adjective", reason: "a-close" }, { match: "#Gerund #Adverb? [close]", group: 0, tag: "Adverb", notIf: "(getting|becoming|feeling)", reason: "being-close" }, { match: "(the|those|these|a|an) [#Participle] #Noun", group: 0, tag: "Adjective", reason: "blown-motor" }, { match: "(#PresentTense|#PastTense) [back]", group: 0, tag: "Adverb", notIf: "(#PhrasalVerb|#Copula)", reason: "charge-back" }, { match: "#Verb [around]", group: 0, tag: "Adverb", notIf: "#PhrasalVerb", reason: "send-around" }, { match: "[later] #PresentTense", group: 0, tag: "Adverb", reason: "later-say" }, { match: "#Determiner [well] !#PastTense?", group: 0, tag: "Noun", reason: "the-well" }, { match: "#Adjective [enough]", group: 0, tag: "Adverb", reason: "high-enough" }], [{ match: "[sun] the #Ordinal", tag: "WeekDay", reason: "sun-the-5th" }, { match: "[sun] #Date", group: 0, tag: "WeekDay", reason: "sun-feb" }, { match: "#Date (on|this|next|last|during)? [sun]", group: 0, tag: "WeekDay", reason: "1pm-sun" }, { match: "(in|by|before|during|on|until|after|of|within|all) [sat]", group: 0, tag: "WeekDay", reason: "sat" }, { match: "(in|by|before|during|on|until|after|of|within|all) [wed]", group: 0, tag: "WeekDay", reason: "wed" }, { match: "(in|by|before|during|on|until|after|of|within|all) [march]", group: 0, tag: "Month", reason: "march" }, { match: "[sat] #Date", group: 0, tag: "WeekDay", reason: "sat-feb" }, { match: "#Preposition [(march|may)]", group: 0, tag: "Month", reason: "in-month" }, { match: "(this|next|last) (march|may) !#Infinitive?", tag: "#Date #Month", reason: "this-month" }, { match: "(march|may) the? #Value", tag: "#Month #Date #Date", reason: "march-5th" }, { match: "#Value of? (march|may)", tag: "#Date #Date #Month", reason: "5th-of-march" }, { match: "[(march|may)] .? #Date", group: 0, tag: "Month", reason: "march-and-feb" }, { match: "#Date .? [(march|may)]", group: 0, tag: "Month", reason: "feb-and-march" }, { match: "#Adverb [(march|may)]", group: 0, tag: "Verb", reason: "quickly-march" }, { match: "[(march|may)] #Adverb", group: 0, tag: "Verb", reason: "march-quickly" }, { match: "#Value (am|pm)", tag: "Time", reason: "2-am" }], [{ match: "#Holiday (day|eve)", tag: "Holiday", reason: "holiday-day" }, { match: "#Value of #Month", tag: "Date", reason: "value-of-month" }, { match: "#Cardinal #Month", tag: "Date", reason: "cardinal-month" }, { match: "#Month #Value to #Value", tag: "Date", reason: "value-to-value" }, { match: "#Month the #Value", tag: "Date", reason: "month-the-value" }, { match: "(#WeekDay|#Month) #Value", tag: "Date", reason: "date-value" }, { match: "#Value (#WeekDay|#Month)", tag: "Date", reason: "value-date" }, { match: "(#TextValue && #Date) #TextValue", tag: "Date", reason: "textvalue-date" }, { match: "#Month #NumberRange", tag: "Date", reason: "aug 20-21" }, { match: "#WeekDay #Month #Ordinal", tag: "Date", reason: "week mm-dd" }, { match: "#Month #Ordinal #Cardinal", tag: "Date", reason: "mm-dd-yyy" }, { match: "(#Place|#Demonmym|#Time) (standard|daylight|central|mountain)? time", tag: "Timezone", reason: "std-time" }, { match: "(eastern|mountain|pacific|central|atlantic) (standard|daylight|summer)? time", tag: "Timezone", reason: "eastern-time" }, { match: "#Time [(eastern|mountain|pacific|central|est|pst|gmt)]", group: 0, tag: "Timezone", reason: "5pm-central" }, { match: "(central|western|eastern) european time", tag: "Timezone", reason: "cet" }], [{ match: "(the|any) [more]", group: 0, tag: "Singular", reason: "more-noun" }, { match: "[more] #Noun", group: 0, tag: "Adjective", reason: "more-noun" }, { match: "(right|rights) of .", tag: "Noun", reason: "right-of" }, { match: "a [bit]", group: 0, tag: "Singular", reason: "bit-2" }, { match: "a [must]", group: 0, tag: "Singular", reason: "must-2" }, { match: "(we|us) [all]", group: 0, tag: "Noun", reason: "we all" }, { match: "due to [#Verb]", group: 0, tag: "Noun", reason: "due-to" }, { match: "some [#Verb] #Plural", group: 0, tag: "Noun", reason: "determiner6" }, { match: "#Possessive #Ordinal [#PastTense]", group: 0, tag: "Noun", reason: "first-thought" }, { match: "(the|this|those|these) #Adjective [%Verb|Noun%]", group: 0, tag: "Noun", notIf: "#Copula", reason: "the-adj-verb" }, { match: "(the|this|those|these) #Adverb #Adjective [#Verb]", group: 0, tag: "Noun", reason: "determiner4" }, { match: "the [#Verb] #Preposition .", group: 0, tag: "Noun", reason: "determiner1" }, { match: "(a|an|the) [#Verb] of", group: 0, tag: "Noun", reason: "the-verb-of" }, { match: "#Determiner #Noun of [#Verb]", group: 0, tag: "Noun", notIf: "#Gerund", reason: "noun-of-noun" }, { match: "#PastTense #Preposition [#PresentTense]", group: 0, notIf: "#Gerund", tag: "Noun", reason: "ended-in-ruins" }, { match: "#Conjunction [u]", group: 0, tag: "Pronoun", reason: "u-pronoun-2" }, { match: "[u] #Verb", group: 0, tag: "Pronoun", reason: "u-pronoun-1" }, { match: "#Determiner [(western|eastern|northern|southern|central)] #Noun", group: 0, tag: "Noun", reason: "western-line" }, { match: "(#Singular && @hasHyphen) #PresentTense", tag: "Noun", reason: "hyphen-verb" }, { match: "is no [#Verb]", group: 0, tag: "Noun", reason: "is-no-verb" }, { match: "do [so]", group: 0, tag: "Noun", reason: "so-noun" }, { match: "#Determiner [(shit|damn|hell)]", group: 0, tag: "Noun", reason: "swears-noun" }, { match: "to [(shit|hell)]", group: 0, tag: "Noun", reason: "to-swears" }, { match: "(the|these) [#Singular] (were|are)", group: 0, tag: "Plural", reason: "singular-were" }, { match: "a #Noun+ or #Adverb+? [#Verb]", group: 0, tag: "Noun", reason: "noun-or-noun" }, { match: "(the|those|these|a|an) #Adjective? [#PresentTense #Particle?]", group: 0, tag: "Noun", notIf: "(seem|appear|include|#Gerund|#Copula)", reason: "det-inf" }, { match: "#Noun #Actor", tag: "Actor", notIf: "(#Person|#Pronoun)", reason: "thing-doer" }, { match: "#Gerund #Actor", tag: "Actor", reason: "gerund-doer" }, { match: "co #Singular", tag: "Actor", reason: "co-noun" }, { match: "[#Noun+] #Actor", group: 0, tag: "Actor", notIf: "(#Honorific|#Pronoun|#Possessive)", reason: "air-traffic-controller" }, { match: "(urban|cardiac|cardiovascular|respiratory|medical|clinical|visual|graphic|creative|dental|exotic|fine|certified|registered|technical|virtual|professional|amateur|junior|senior|special|pharmaceutical|theoretical)+ #Noun? #Actor", tag: "Actor", reason: "fine-artist" }, { match: "#Noun+ (coach|chef|king|engineer|fellow|personality|boy|girl|man|woman|master)", tag: "Actor", reason: "dance-coach" }, { match: "chief . officer", tag: "Actor", reason: "chief-x-officer" }, { match: "chief of #Noun+", tag: "Actor", reason: "chief-of-police" }, { match: "senior? vice? president of #Noun+", tag: "Actor", reason: "president-of" }, { match: "#Determiner [sun]", group: 0, tag: "Singular", reason: "the-sun" }, { match: "#Verb (a|an) [#Value]$", group: 0, tag: "Singular", reason: "did-a-value" }, { match: "the [(can|will|may)]", group: 0, tag: "Singular", reason: "the can" }, { match: "#FirstName #Acronym? (#Possessive && #LastName)", tag: "Possessive", reason: "name-poss" }, { match: "#Organization+ #Possessive", tag: "Possessive", reason: "org-possessive" }, { match: "#Place+ #Possessive", tag: "Possessive", reason: "place-possessive" }, { match: "#Possessive #PresentTense #Particle?", notIf: "(#Gerund|her)", tag: "Noun", reason: "possessive-verb" }, { match: "(my|our|their|her|his|its) [(#Plural && #Actor)] #Noun", tag: "Possessive", reason: "my-dads" }, { match: "#Value of a [second]", group: 0, unTag: "Value", tag: "Singular", reason: "10th-of-a-second" }, { match: "#Value [seconds]", group: 0, unTag: "Value", tag: "Plural", reason: "10-seconds" }, { match: "in [#Infinitive]", group: 0, tag: "Singular", reason: "in-age" }, { match: "a [#Adjective] #Preposition", group: 0, tag: "Noun", reason: "a-minor-in" }, { match: "#Determiner [#Singular] said", group: 0, tag: "Actor", reason: "the-actor-said" }, { match: "#Determiner #Noun [(feel|sense|process|rush|side|bomb|bully|challenge|cover|crush|dump|exchange|flow|function|issue|lecture|limit|march|process)] !(#Preposition|to|#Adverb)?", group: 0, tag: "Noun", reason: "the-noun-sense" }, { match: "[#PresentTense] (of|by|for) (a|an|the) #Noun #Copula", group: 0, tag: "Plural", reason: "photographs-of" }, { match: "#Infinitive and [%Noun|Verb%]", group: 0, tag: "Infinitive", reason: "fight and win" }, { match: "#Noun and [#Verb] and #Noun", group: 0, tag: "Noun", reason: "peace-and-flowers" }, { match: "the #Cardinal [%Adj|Noun%]", group: 0, tag: "Noun", reason: "the-1992-classic" }, { match: "#Copula the [%Adj|Noun%] #Noun", group: 0, tag: "Adjective", reason: "the-premier-university" }, { match: "i #Verb [me] #Noun", group: 0, tag: "Possessive", reason: "scottish-me" }, { match: "[#PresentTense] (music|class|lesson|night|party|festival|league|ceremony)", group: 0, tag: "Noun", reason: "dance-music" }, { match: "[wit] (me|it)", group: 0, tag: "Presposition", reason: "wit-me" }, { match: "#PastTense #Possessive [#Verb]", group: 0, tag: "Noun", notIf: "(saw|made)", reason: "left-her-boots" }, { match: "#Value [%Plural|Verb%]", group: 0, tag: "Plural", notIf: "(one|1|a|an)", reason: "35-signs" }, { match: "had [#PresentTense]", group: 0, tag: "Noun", notIf: "(#Gerund|come|become)", reason: "had-time" }, { match: "%Adj|Noun% %Noun|Verb%", tag: "#Adjective #Noun", notIf: "#ProperNoun #Noun", reason: "instant-access" }, { match: "#Determiner [%Adj|Noun%] #Conjunction", group: 0, tag: "Noun", reason: "a-rep-to" }, { match: "#Adjective #Noun [%Plural|Verb%]$", group: 0, tag: "Plural", notIf: "#Pronoun", reason: "near-death-experiences" }, { match: "#Possessive #Noun [%Plural|Verb%]$", group: 0, tag: "Plural", reason: "your-guild-colors" }], [{ match: "(this|that|the|a|an) [#Gerund #Infinitive]", group: 0, tag: "Singular", reason: "the-planning-process" }, { match: "(that|the) [#Gerund #PresentTense]", group: 0, ifNo: "#Copula", tag: "Plural", reason: "the-paving-stones" }, { match: "#Determiner [#Gerund] #Noun", group: 0, tag: "Adjective", reason: "the-gerund-noun" }, { match: "#Pronoun #Infinitive [#Gerund] #PresentTense", group: 0, tag: "Noun", reason: "tipping-sucks" }, { match: "#Adjective [#Gerund]", group: 0, tag: "Noun", notIf: "(still|even|just)", reason: "early-warning" }, { match: "[#Gerund] #Adverb? not? #Copula", group: 0, tag: "Activity", reason: "gerund-copula" }, { match: "#Copula [(#Gerund|#Activity)] #Copula", group: 0, tag: "Gerund", reason: "are-doing-is" }, { match: "[#Gerund] #Modal", group: 0, tag: "Activity", reason: "gerund-modal" }, { match: "#Singular for [%Noun|Gerund%]", group: 0, tag: "Gerund", reason: "noun-for-gerund" }, { match: "#Comparative (for|at) [%Noun|Gerund%]", group: 0, tag: "Gerund", reason: "better-for-gerund" }, { match: "#PresentTense the [#Gerund]", group: 0, tag: "Noun", reason: "keep-the-touching" }], [{ match: "#Infinitive (this|that|the) [#Infinitive]", group: 0, tag: "Noun", reason: "do-this-dance" }, { match: "#Gerund #Determiner [#Infinitive]", group: 0, tag: "Noun", reason: "running-a-show" }, { match: "#Determiner (only|further|just|more|backward) [#Infinitive]", group: 0, tag: "Noun", reason: "the-only-reason" }, { match: "(the|this|a|an) [#Infinitive] #Adverb? #Verb", group: 0, tag: "Noun", reason: "determiner5" }, { match: "#Determiner #Adjective #Adjective? [#Infinitive]", group: 0, tag: "Noun", reason: "a-nice-inf" }, { match: "#Determiner #Demonym [#PresentTense]", group: 0, tag: "Noun", reason: "mexican-train" }, { match: "#Adjective #Noun+ [#Infinitive] #Copula", group: 0, tag: "Noun", reason: "career-move" }, { match: "at some [#Infinitive]", group: 0, tag: "Noun", reason: "at-some-inf" }, { match: "(go|goes|went) to [#Infinitive]", group: 0, tag: "Noun", reason: "goes-to-verb" }, { match: "(a|an) #Adjective? #Noun [#Infinitive] (#Preposition|#Noun)", group: 0, notIf: "from", tag: "Noun", reason: "a-noun-inf" }, { match: "(a|an) #Noun [#Infinitive]$", group: 0, tag: "Noun", reason: "a-noun-inf2" }, { match: "#Gerund #Adjective? for [#Infinitive]", group: 0, tag: "Noun", reason: "running-for" }, { match: "about [#Infinitive]", group: 0, tag: "Singular", reason: "about-love" }, { match: "#Plural on [#Infinitive]", group: 0, tag: "Noun", reason: "on-stage" }, { match: "any [#Infinitive]", group: 0, tag: "Noun", reason: "any-charge" }, { match: "no [#Infinitive]", group: 0, tag: "Noun", reason: "no-doubt" }, { match: "number of [#PresentTense]", group: 0, tag: "Noun", reason: "number-of-x" }, { match: "(taught|teaches|learns|learned) [#PresentTense]", group: 0, tag: "Noun", reason: "teaches-x" }, { match: "(try|use|attempt|build|make) [#Verb #Particle?]", notIf: "(#Copula|#Noun|sure|fun|up)", group: 0, tag: "Noun", reason: "do-verb" }, { match: "^[#Infinitive] (is|was)", group: 0, tag: "Noun", reason: "checkmate-is" }, { match: "#Infinitive much [#Infinitive]", group: 0, tag: "Noun", reason: "get-much" }, { match: "[cause] #Pronoun #Verb", group: 0, tag: "Conjunction", reason: "cause-cuz" }, { match: "the #Singular [#Infinitive] #Noun", group: 0, tag: "Noun", notIf: "#Pronoun", reason: "cardio-dance" }, { match: "#Determiner #Modal [#Noun]", group: 0, tag: "PresentTense", reason: "should-smoke" }, { match: "this [#Plural]", group: 0, tag: "PresentTense", notIf: "(#Preposition|#Date)", reason: "this-verbs" }, { match: "#Noun that [#Plural]", group: 0, tag: "PresentTense", notIf: "(#Preposition|#Pronoun|way)", reason: "voice-that-rocks" }, { match: "that [#Plural] to", group: 0, tag: "PresentTense", notIf: "#Preposition", reason: "that-leads-to" }, { match: "(let|make|made) (him|her|it|#Person|#Place|#Organization)+ [#Singular] (a|an|the|it)", group: 0, tag: "Infinitive", reason: "let-him-glue" }, { match: "#Verb (all|every|each|most|some|no) [#PresentTense]", notIf: "#Modal", group: 0, tag: "Noun", reason: "all-presentTense" }, { match: "(had|have|#PastTense) #Adjective [#PresentTense]", group: 0, tag: "Noun", notIf: "better", reason: "adj-presentTense" }, { match: "#Value #Adjective [#PresentTense]", group: 0, tag: "Noun", notIf: "#Copula", reason: "one-big-reason" }, { match: "#PastTense #Adjective+ [#PresentTense]", group: 0, tag: "Noun", notIf: "(#Copula|better)", reason: "won-wide-support" }, { match: "(many|few|several|couple) [#PresentTense]", group: 0, tag: "Noun", notIf: "#Copula", reason: "many-poses" }, { match: "#Determiner #Adverb #Adjective [%Noun|Verb%]", group: 0, tag: "Noun", notIf: "#Copula", reason: "very-big-dream" }, { match: "from #Noun to [%Noun|Verb%]", group: 0, tag: "Noun", reason: "start-to-finish" }, { match: "(for|with|of) #Noun (and|or|not) [%Noun|Verb%]", group: 0, tag: "Noun", notIf: "#Pronoun", reason: "for-food-and-gas" }, { match: "#Adjective #Adjective [#PresentTense]", group: 0, tag: "Noun", notIf: "#Copula", reason: "adorable-little-store" }, { match: "#Gerund #Adverb? #Comparative [#PresentTense]", group: 0, tag: "Noun", notIf: "#Copula", reason: "higher-costs" }, { match: "(#Noun && @hasComma) #Noun (and|or) [#PresentTense]", group: 0, tag: "Noun", notIf: "#Copula", reason: "noun-list" }, { match: "(many|any|some|several) [#PresentTense] for", group: 0, tag: "Noun", reason: "any-verbs-for" }, { match: "to #PresentTense #Noun [#PresentTense] #Preposition", group: 0, tag: "Noun", reason: "gas-exchange" }, { match: "#PastTense (until|as|through|without) [#PresentTense]", group: 0, tag: "Noun", reason: "waited-until-release" }, { match: "#Gerund like #Adjective? [#PresentTense]", group: 0, tag: "Plural", reason: "like-hot-cakes" }, { match: "some #Adjective [#PresentTense]", group: 0, tag: "Noun", reason: "some-reason" }, { match: "for some [#PresentTense]", group: 0, tag: "Noun", reason: "for-some-reason" }, { match: "(same|some|the|that|a) kind of [#PresentTense]", group: 0, tag: "Noun", reason: "some-kind-of" }, { match: "(same|some|the|that|a) type of [#PresentTense]", group: 0, tag: "Noun", reason: "some-type-of" }, { match: "#Gerund #Adjective #Preposition [#PresentTense]", group: 0, tag: "Noun", reason: "doing-better-for-x" }, { match: "(get|got|have) #Comparative [#PresentTense]", group: 0, tag: "Noun", reason: "got-better-aim" }, { match: "whose [#PresentTense] #Copula", group: 0, tag: "Noun", reason: "whos-name-was" }, { match: "#PhrasalVerb #Particle #Preposition [#PresentTense]", group: 0, tag: "Noun", reason: "given-up-on-x" }, { match: "there (are|were) #Adjective? [#PresentTense]", group: 0, tag: "Plural", reason: "there-are" }, { match: "#Value [#PresentTense] of", group: 0, notIf: "(one|1|#Copula|#Infinitive)", tag: "Plural", reason: "2-trains" }, { match: "[#PresentTense] (are|were) #Adjective", group: 0, tag: "Plural", reason: "compromises-are-possible" }, { match: "^[(hope|guess|thought|think)] #Pronoun #Verb", group: 0, tag: "Infinitive", reason: "suppose-i" }, { match: "#Possessive #Adjective [#Verb]", group: 0, tag: "Noun", notIf: "#Copula", reason: "our-full-support" }, { match: "[(tastes|smells)] #Adverb? #Adjective", group: 0, tag: "PresentTense", reason: "tastes-good" }, { match: "#Copula #Gerund [#PresentTense] !by?", group: 0, tag: "Noun", notIf: "going", reason: "ignoring-commute" }, { match: "#Determiner #Adjective? [(shed|thought|rose|bid|saw|spelt)]", group: 0, tag: "Noun", reason: "noun-past" }, { match: "how to [%Noun|Verb%]", group: 0, tag: "Infinitive", reason: "how-to-noun" }, { match: "which [%Noun|Verb%] #Noun", group: 0, tag: "Infinitive", reason: "which-boost-it" }, { match: "#Gerund [%Plural|Verb%]", group: 0, tag: "Plural", reason: "asking-questions" }, { match: "(ready|available|difficult|hard|easy|made|attempt|try) to [%Noun|Verb%]", group: 0, tag: "Infinitive", reason: "ready-to-noun" }, { match: "(bring|went|go|drive|run|bike) to [%Noun|Verb%]", group: 0, tag: "Noun", reason: "bring-to-noun" }, { match: "#Modal #Noun [%Noun|Verb%]", group: 0, tag: "Infinitive", reason: "would-you-look" }, { match: "#Copula just [#Infinitive]", group: 0, tag: "Noun", reason: "is-just-spam" }, { match: "^%Noun|Verb% %Plural|Verb%", tag: "Imperative #Plural", reason: "request-copies" }, { match: "#Adjective #Plural and [%Plural|Verb%]", group: 0, tag: "#Plural", reason: "pickles-and-drinks" }, { match: "#Determiner #Year [#Verb]", group: 0, tag: "Noun", reason: "the-1968-film" }, { match: "#Determiner [#PhrasalVerb #Particle]", group: 0, tag: "Noun", reason: "the-break-up" }, { match: "#Determiner [%Adj|Noun%] #Noun", group: 0, tag: "Adjective", notIf: "(#Pronoun|#Possessive|#ProperNoun)", reason: "the-individual-goals" }, { match: "[%Noun|Verb%] or #Infinitive", group: 0, tag: "Infinitive", reason: "work-or-prepare" }, { match: "to #Infinitive [#PresentTense]", group: 0, tag: "Noun", notIf: "(#Gerund|#Copula|help)", reason: "to-give-thanks" }, { match: "[#Noun] me", group: 0, tag: "Verb", reason: "kills-me" }, { match: "%Plural|Verb% %Plural|Verb%", tag: "#PresentTense #Plural", reason: "removes-wrinkles" }], [{ match: "#Money and #Money #Currency?", tag: "Money", reason: "money-and-money" }, { match: "#Value #Currency [and] #Value (cents|ore|centavos|sens)", group: 0, tag: "money", reason: "and-5-cents" }, { match: "#Value (mark|rand|won|rub|ore)", tag: "#Money #Currency", reason: "4-mark" }, { match: "a pound", tag: "#Money #Unit", reason: "a-pound" }, { match: "#Value (pound|pounds)", tag: "#Money #Unit", reason: "4-pounds" }], [{ match: "[(half|quarter)] of? (a|an)", group: 0, tag: "Fraction", reason: "millionth" }, { match: "#Adverb [half]", group: 0, tag: "Fraction", reason: "nearly-half" }, { match: "[half] the", group: 0, tag: "Fraction", reason: "half-the" }, { match: "#Cardinal and a half", tag: "Fraction", reason: "and-a-half" }, { match: "#Value (halves|halfs|quarters)", tag: "Fraction", reason: "two-halves" }, { match: "a #Ordinal", tag: "Fraction", reason: "a-quarter" }, { match: "[#Cardinal+] (#Fraction && /s$/)", tag: "Fraction", reason: "seven-fifths" }, { match: "[#Cardinal+ #Ordinal] of .", group: 0, tag: "Fraction", reason: "ordinal-of" }, { match: "[(#NumericValue && #Ordinal)] of .", group: 0, tag: "Fraction", reason: "num-ordinal-of" }, { match: "(a|one) #Cardinal?+ #Ordinal", tag: "Fraction", reason: "a-ordinal" }, { match: "#Cardinal+ out? of every? #Cardinal", tag: "Fraction", reason: "out-of" }], [{ match: "#Cardinal [second]", tag: "Unit", reason: "one-second" }, { match: "!once? [(a|an)] (#Duration|hundred|thousand|million|billion|trillion)", group: 0, tag: "Value", reason: "a-is-one" }, { match: "1 #Value #PhoneNumber", tag: "PhoneNumber", reason: "1-800-Value" }, { match: "#NumericValue #PhoneNumber", tag: "PhoneNumber", reason: "(800) PhoneNumber" }, { match: "#Demonym #Currency", tag: "Currency", reason: "demonym-currency" }, { match: "#Value [(buck|bucks|grand)]", group: 0, tag: "Currency", reason: "value-bucks" }, { match: "[#Value+] #Currency", group: 0, tag: "Money", reason: "15 usd" }, { match: "[second] #Noun", group: 0, tag: "Ordinal", reason: "second-noun" }, { match: "#Value+ [#Currency]", group: 0, tag: "Unit", reason: "5-yan" }, { match: "#Value [(foot|feet)]", group: 0, tag: "Unit", reason: "foot-unit" }, { match: "#Value [#Abbreviation]", group: 0, tag: "Unit", reason: "value-abbr" }, { match: "#Value [k]", group: 0, tag: "Unit", reason: "value-k" }, { match: "#Unit an hour", tag: "Unit", reason: "unit-an-hour" }, { match: "(minus|negative) #Value", tag: "Value", reason: "minus-value" }, { match: "#Value (point|decimal) #Value", tag: "Value", reason: "value-point-value" }, { match: "#Determiner [(half|quarter)] #Ordinal", group: 0, tag: "Value", reason: "half-ordinal" }, { match: "#Multiple+ and #Value", tag: "Value", reason: "magnitude-and-value" }, { match: "#Value #Unit [(per|an) (hr|hour|sec|second|min|minute)]", group: 0, tag: "Unit", reason: "12-miles-per-second" }, { match: "#Value [(square|cubic)] #Unit", group: 0, tag: "Unit", reason: "square-miles" }], [{ match: "#Copula [(#Noun|#PresentTense)] #LastName", group: 0, tag: "FirstName", reason: "copula-noun-lastname" }, { match: "(sister|pope|brother|father|aunt|uncle|grandpa|grandfather|grandma) #ProperNoun", tag: "Person", reason: "lady-titlecase", safe: true }, { match: "#FirstName [#Determiner #Noun] #LastName", group: 0, tag: "Person", reason: "first-noun-last" }, { match: "#ProperNoun (b|c|d|e|f|g|h|j|k|l|m|n|o|p|q|r|s|t|u|v|w|x|y|z) #ProperNoun", tag: "Person", reason: "titlecase-acronym-titlecase", safe: true }, { match: "#Acronym #LastName", tag: "Person", reason: "acronym-lastname", safe: true }, { match: "#Person (jr|sr|md)", tag: "Person", reason: "person-honorific" }, { match: "#Honorific #Acronym", tag: "Person", reason: "Honorific-TitleCase" }, { match: "#Person #Person the? #RomanNumeral", tag: "Person", reason: "roman-numeral" }, { match: "#FirstName [/^[^aiurck]$/]", group: 0, tag: ["Acronym", "Person"], reason: "john-e" }, { match: "#Noun van der? #Noun", tag: "Person", reason: "van der noun", safe: true }, { match: "(king|queen|prince|saint|lady) of #Noun", tag: "Person", reason: "king-of-noun", safe: true }, { match: "(prince|lady) #Place", tag: "Person", reason: "lady-place" }, { match: "(king|queen|prince|saint) #ProperNoun", tag: "Person", notIf: "#Place", reason: "saint-foo" }, { match: "al (#Person|#ProperNoun)", tag: "Person", reason: "al-borlen", safe: true }, { match: "#FirstName de #Noun", tag: "Person", reason: "bill-de-noun" }, { match: "#FirstName (bin|al) #Noun", tag: "Person", reason: "bill-al-noun" }, { match: "#FirstName #Acronym #ProperNoun", tag: "Person", reason: "bill-acronym-title" }, { match: "#FirstName #FirstName #ProperNoun", tag: "Person", reason: "bill-firstname-title" }, { match: "#Honorific #FirstName? #ProperNoun", tag: "Person", reason: "dr-john-Title" }, { match: "#FirstName the #Adjective", tag: "Person", reason: "name-the-great" }, { match: "#ProperNoun (van|al|bin) #ProperNoun", tag: "Person", reason: "title-van-title", safe: true }, { match: "#ProperNoun (de|du) la? #ProperNoun", tag: "Person", notIf: "#Place", reason: "title-de-title" }, { match: "#Singular #Acronym #LastName", tag: "#FirstName #Person .", reason: "title-acro-noun", safe: true }, { match: "[#ProperNoun] #Person", group: 0, tag: "Person", reason: "proper-person", safe: true }, { match: "#Person [#ProperNoun #ProperNoun]", group: 0, tag: "Person", notIf: "#Possessive", reason: "three-name-person", safe: true }, { match: "#FirstName #Acronym? [#ProperNoun]", group: 0, tag: "LastName", notIf: "#Possessive", reason: "firstname-titlecase" }, { match: "#FirstName [#FirstName]", group: 0, tag: "LastName", reason: "firstname-firstname" }, { match: "#FirstName #Acronym #Noun", tag: "Person", reason: "n-acro-noun", safe: true }, { match: "#FirstName [(de|di|du|van|von)] #Person", group: 0, tag: "LastName", reason: "de-firstname" }, { match: "[(lieutenant|corporal|sergeant|captain|qeen|king|admiral|major|colonel|marshal|president|queen|king)+] #ProperNoun", group: 0, tag: "Honorific", reason: "seargeant-john" }, { match: "[(private|general|major|rear|prime|field|count|miss)] #Honorific? #Person", group: 0, tag: ["Honorific", "Person"], reason: "ambg-honorifics" }, { match: "#Honorific #FirstName [#Singular]", group: 0, tag: "LastName", notIf: "#Possessive", reason: "dr-john-foo", safe: true }, { match: "[(his|her) (majesty|honour|worship|excellency|honorable)] #Person", group: 0, tag: "Honorific", reason: "his-excellency" }, { match: "#Honorific #Actor", tag: "Honorific", reason: "Lieutenant colonel" }, { match: "(first|second|third|1st|2nd|3rd) #Actor", tag: "Honorific", reason: "first lady" }, { match: "#Person #RomanNumeral", tag: "Person", reason: "louis-IV" }], [{ match: "#FirstName #Noun$", tag: ". #LastName", notIf: "(#Possessive|#Organization|#Place|#Pronoun|@hasTitleCase)", reason: "firstname-noun" }, { match: "%Person|Date% #Acronym? #ProperNoun", tag: "Person", reason: "jan-thierson" }, { match: "%Person|Noun% #Acronym? #ProperNoun", tag: "Person", reason: "switch-person", safe: true }, { match: "%Person|Noun% #Organization", tag: "Organization", reason: "olive-garden" }, { match: "%Person|Verb% #Acronym? #ProperNoun", tag: "Person", reason: "verb-propernoun", ifNo: "#Actor" }, { match: "[%Person|Verb%] (will|had|has|said|says|told|did|learned|wants|wanted)", group: 0, tag: "Person", reason: "person-said" }, { match: "[%Person|Place%] (harbor|harbour|pier|town|city|place|dump|landfill)", group: 0, tag: "Place", reason: "sydney-harbour" }, { match: "(west|east|north|south) [%Person|Place%]", group: 0, tag: "Place", reason: "east-sydney" }, { match: "#Modal [%Person|Verb%]", group: 0, tag: "Verb", reason: "would-mark" }, { match: "#Adverb [%Person|Verb%]", group: 0, tag: "Verb", reason: "really-mark" }, { match: "[%Person|Verb%] (#Adverb|#Comparative)", group: 0, tag: "Verb", reason: "drew-closer" }, { match: "%Person|Verb% #Person", tag: "Person", reason: "rob-smith" }, { match: "%Person|Verb% #Acronym #ProperNoun", tag: "Person", reason: "rob-a-smith" }, { match: "[will] #Verb", group: 0, tag: "Modal", reason: "will-verb" }, { match: "(will && @isTitleCase) #ProperNoun", tag: "Person", reason: "will-name" }, { match: "(#FirstName && !#Possessive) [#Singular] #Verb", group: 0, safe: true, tag: "LastName", reason: "jack-layton" }, { match: "^[#Singular] #Person #Verb", group: 0, safe: true, tag: "Person", reason: "sherwood-anderson" }, { match: "(a|an) [#Person]$", group: 0, unTag: "Person", reason: "a-warhol" }], [{ match: "#Copula (pretty|dead|full|well|sure) (#Adjective|#Noun)", tag: "#Copula #Adverb #Adjective", reason: "sometimes-adverb" }, { match: "(#Pronoun|#Person) (had|#Adverb)? [better] #PresentTense", group: 0, tag: "Modal", reason: "i-better" }, { match: "(#Modal|i|they|we|do) not? [like]", group: 0, tag: "PresentTense", reason: "modal-like" }, { match: "#Noun #Adverb? [left]", group: 0, tag: "PastTense", reason: "left-verb" }, { match: "will #Adverb? not? #Adverb? [be] #Gerund", group: 0, tag: "Copula", reason: "will-be-copula" }, { match: "will #Adverb? not? #Adverb? [be] #Adjective", group: 0, tag: "Copula", reason: "be-copula" }, { match: "[march] (up|down|back|toward)", notIf: "#Date", group: 0, tag: "Infinitive", reason: "march-to" }, { match: "#Modal [march]", group: 0, tag: "Infinitive", reason: "must-march" }, { match: "[may] be", group: 0, tag: "Verb", reason: "may-be" }, { match: "[(subject|subjects|subjected)] to", group: 0, tag: "Verb", reason: "subject to" }, { match: "[home] to", group: 0, tag: "PresentTense", reason: "home to" }, { match: "[open] #Determiner", group: 0, tag: "Infinitive", reason: "open-the" }, { match: "(were|was) being [#PresentTense]", group: 0, tag: "PastTense", reason: "was-being" }, { match: "(had|has|have) [been /en$/]", group: 0, tag: "Auxiliary Participle", reason: "had-been-broken" }, { match: "(had|has|have) [been /ed$/]", group: 0, tag: "Auxiliary PastTense", reason: "had-been-smoked" }, { match: "(had|has) #Adverb? [been] #Adverb? #PastTense", group: 0, tag: "Auxiliary", reason: "had-been-adj" }, { match: "(had|has) to [#Noun] (#Determiner|#Possessive)", group: 0, tag: "Infinitive", reason: "had-to-noun" }, { match: "have [#PresentTense]", group: 0, tag: "PastTense", notIf: "(come|gotten)", reason: "have-read" }, { match: "(does|will|#Modal) that [work]", group: 0, tag: "PastTense", reason: "does-that-work" }, { match: "[(sound|sounds)] #Adjective", group: 0, tag: "PresentTense", reason: "sounds-fun" }, { match: "[(look|looks)] #Adjective", group: 0, tag: "PresentTense", reason: "looks-good" }, { match: "[(start|starts|stop|stops|begin|begins)] #Gerund", group: 0, tag: "Verb", reason: "starts-thinking" }, { match: "(have|had) read", tag: "Modal #PastTense", reason: "read-read" }, { match: "(is|was|were) [(under|over) #PastTense]", group: 0, tag: "Adverb Adjective", reason: "was-under-cooked" }, { match: "[shit] (#Determiner|#Possessive|them)", group: 0, tag: "Verb", reason: "swear1-verb" }, { match: "[damn] (#Determiner|#Possessive|them)", group: 0, tag: "Verb", reason: "swear2-verb" }, { match: "[fuck] (#Determiner|#Possessive|them)", group: 0, tag: "Verb", reason: "swear3-verb" }, { match: "#Plural that %Noun|Verb%", tag: ". #Preposition #Infinitive", reason: "jobs-that-work" }, { match: "[works] for me", group: 0, tag: "PresentTense", reason: "works-for-me" }, { match: "as #Pronoun [please]", group: 0, tag: "Infinitive", reason: "as-we-please" }, { match: "[(co|mis|de|inter|intra|pre|re|un|out|under|over|counter)] #Verb", group: 0, tag: ["Verb", "Prefix"], notIf: "(#Copula|#PhrasalVerb)", reason: "co-write" }, { match: "#PastTense and [%Adj|Past%]", group: 0, tag: "PastTense", reason: "dressed-and-left" }, { match: "[%Adj|Past%] and #PastTense", group: 0, tag: "PastTense", reason: "dressed-and-left" }, { match: "#Copula #Pronoun [%Adj|Past%]", group: 0, tag: "Adjective", reason: "is-he-stoked" }, { match: "to [%Noun|Verb%] #Preposition", group: 0, tag: "Infinitive", reason: "to-dream-of" }], [{ match: "(slowly|quickly) [#Adjective]", group: 0, tag: "Verb", reason: "slowly-adj" }, { match: "does (#Adverb|not)? [#Adjective]", group: 0, tag: "PresentTense", reason: "does-mean" }, { match: "[(fine|okay|cool|ok)] by me", group: 0, tag: "Adjective", reason: "okay-by-me" }, { match: "i (#Adverb|do)? not? [mean]", group: 0, tag: "PresentTense", reason: "i-mean" }, { match: "will #Adjective", tag: "Auxiliary Infinitive", reason: "will-adj" }, { match: "#Pronoun [#Adjective] #Determiner #Adjective? #Noun", group: 0, tag: "Verb", reason: "he-adj-the" }, { match: "#Copula [%Adj|Present%] to #Verb", group: 0, tag: "Verb", reason: "adj-to" }, { match: "#Copula [#Adjective] (well|badly|quickly|slowly)", group: 0, tag: "Verb", reason: "done-well" }, { match: "#Adjective and [#Gerund] !#Preposition?", group: 0, tag: "Adjective", reason: "rude-and-x" }, { match: "#Copula #Adverb? (over|under) [#PastTense]", group: 0, tag: "Adjective", reason: "over-cooked" }, { match: "#Copula #Adjective+ (and|or) [#PastTense]$", group: 0, tag: "Adjective", reason: "bland-and-overcooked" }, { match: "got #Adverb? [#PastTense] of", group: 0, tag: "Adjective", reason: "got-tired-of" }, { match: "(seem|seems|seemed|appear|appeared|appears|feel|feels|felt|sound|sounds|sounded) (#Adverb|#Adjective)? [#PastTense]", group: 0, tag: "Adjective", reason: "felt-loved" }, { match: "(seem|feel|seemed|felt) [#PastTense #Particle?]", group: 0, tag: "Adjective", reason: "seem-confused" }, { match: "a (bit|little|tad) [#PastTense #Particle?]", group: 0, tag: "Adjective", reason: "a-bit-confused" }, { match: "not be [%Adj|Past% #Particle?]", group: 0, tag: "Adjective", reason: "do-not-be-confused" }, { match: "#Copula just [%Adj|Past% #Particle?]", group: 0, tag: "Adjective", reason: "is-just-right" }, { match: "as [#Infinitive] as", group: 0, tag: "Adjective", reason: "as-pale-as" }, { match: "[%Adj|Past%] and #Adjective", group: 0, tag: "Adjective", reason: "faled-and-oppressive" }, { match: "or [#PastTense] #Noun", group: 0, tag: "Adjective", notIf: "(#Copula|#Pronoun)", reason: "or-heightened-emotion" }, { match: "(become|became|becoming|becomes) [#Verb]", group: 0, tag: "Adjective", reason: "become-verb" }, { match: "#Possessive [#PastTense] #Noun", group: 0, tag: "Adjective", reason: "declared-intentions" }, { match: "#Copula #Pronoun [%Adj|Present%]", group: 0, tag: "Adjective", reason: "is-he-cool" }, { match: "#Copula [%Adj|Past%] with", group: 0, tag: "Adjective", notIf: "(associated|worn|baked|aged|armed|bound|fried|loaded|mixed|packed|pumped|filled|sealed)", reason: "is-crowded-with" }, { match: "#Copula #Adverb? [%Adj|Present%]$", group: 0, tag: "Adjective", reason: "was-empty$" }], [{ match: "will (#Adverb|not)+? [have] (#Adverb|not)+? #Verb", group: 0, tag: "Auxiliary", reason: "will-have-vb" }, { match: "[#Copula] (#Adverb|not)+? (#Gerund|#PastTense)", group: 0, tag: "Auxiliary", reason: "copula-walking" }, { match: "[(#Modal|did)+] (#Adverb|not)+? #Verb", group: 0, tag: "Auxiliary", reason: "modal-verb" }, { match: "#Modal (#Adverb|not)+? [have] (#Adverb|not)+? [had] (#Adverb|not)+? #Verb", group: 0, tag: "Auxiliary", reason: "would-have" }, { match: "[(has|had)] (#Adverb|not)+? #PastTense", group: 0, tag: "Auxiliary", reason: "had-walked" }, { match: "[(do|does|did|will|have|had|has|got)] (not|#Adverb)+? #Verb", group: 0, tag: "Auxiliary", reason: "have-had" }, { match: "[about to] #Adverb? #Verb", group: 0, tag: ["Auxiliary", "Verb"], reason: "about-to" }, { match: "#Modal (#Adverb|not)+? [be] (#Adverb|not)+? #Verb", group: 0, tag: "Auxiliary", reason: "would-be" }, { match: "[(#Modal|had|has)] (#Adverb|not)+? [been] (#Adverb|not)+? #Verb", group: 0, tag: "Auxiliary", reason: "had-been" }, { match: "[(be|being|been)] #Participle", group: 0, tag: "Auxiliary", reason: "being-driven" }, { match: "[may] #Adverb? #Infinitive", group: 0, tag: "Auxiliary", reason: "may-want" }, { match: "#Copula (#Adverb|not)+? [(be|being|been)] #Adverb+? #PastTense", group: 0, tag: "Auxiliary", reason: "being-walked" }, { match: "will [be] #PastTense", group: 0, tag: "Auxiliary", reason: "will-be-x" }, { match: "[(be|been)] (#Adverb|not)+? #Gerund", group: 0, tag: "Auxiliary", reason: "been-walking" }, { match: "[used to] #PresentTense", group: 0, tag: "Auxiliary", reason: "used-to-walk" }, { match: "#Copula (#Adverb|not)+? [going to] #Adverb+? #PresentTense", group: 0, tag: "Auxiliary", reason: "going-to-walk" }, { match: "#Imperative [(me|him|her)]", group: 0, tag: "Reflexive", reason: "tell-him" }, { match: "(is|was) #Adverb? [no]", group: 0, tag: "Negative", reason: "is-no" }, { match: "[(been|had|became|came)] #PastTense", group: 0, notIf: "#PhrasalVerb", tag: "Auxiliary", reason: "been-told" }, { match: "[(being|having|getting)] #Verb", group: 0, tag: "Auxiliary", reason: "being-born" }, { match: "[be] #Gerund", group: 0, tag: "Auxiliary", reason: "be-walking" }, { match: "[better] #PresentTense", group: 0, tag: "Modal", notIf: "(#Copula|#Gerund)", reason: "better-go" }, { match: "even better", tag: "Adverb #Comparative", reason: "even-better" }], [{ match: "(#Verb && @hasHyphen) up", tag: "PhrasalVerb", reason: "foo-up" }, { match: "(#Verb && @hasHyphen) off", tag: "PhrasalVerb", reason: "foo-off" }, { match: "(#Verb && @hasHyphen) over", tag: "PhrasalVerb", reason: "foo-over" }, { match: "(#Verb && @hasHyphen) out", tag: "PhrasalVerb", reason: "foo-out" }, { match: "[#Verb (in|out|up|down|off|back)] (on|in)", notIf: "#Copula", tag: "PhrasalVerb Particle", reason: "walk-in-on" }, { match: "(lived|went|crept|go) [on] for", group: 0, tag: "PhrasalVerb", reason: "went-on" }, { match: "#Verb (up|down|in|on|for)$", tag: "PhrasalVerb #Particle", notIf: "#PhrasalVerb", reason: "come-down$" }, { match: "help [(stop|end|make|start)]", group: 0, tag: "Infinitive", reason: "help-stop" }, { match: "#PhrasalVerb (in && #Particle) #Determiner", tag: "#Verb #Preposition #Determiner", unTag: "PhrasalVerb", reason: "work-in-the" }, { match: "[(stop|start|finish|help)] #Gerund", group: 0, tag: "Infinitive", reason: "start-listening" }, { match: "#Verb (him|her|it|us|himself|herself|itself|everything|something) [(up|down)]", group: 0, tag: "Adverb", reason: "phrasal-pronoun-advb" }], [{ match: "^do not? [#Infinitive #Particle?]", notIf: Gl, group: 0, tag: "Imperative", reason: "do-eat" }, { match: "^please do? not? [#Infinitive #Particle?]", group: 0, tag: "Imperative", reason: "please-go" }, { match: "^just do? not? [#Infinitive #Particle?]", group: 0, tag: "Imperative", reason: "just-go" }, { match: "^[#Infinitive] it #Comparative", notIf: Gl, group: 0, tag: "Imperative", reason: "do-it-better" }, { match: "^[#Infinitive] it (please|now|again|plz)", notIf: Gl, group: 0, tag: "Imperative", reason: "do-it-please" }, { match: "^[#Infinitive] (#Adjective|#Adverb)$", group: 0, tag: "Imperative", notIf: "(so|such|rather|enough)", reason: "go-quickly" }, { match: "^[#Infinitive] (up|down|over) #Determiner", group: 0, tag: "Imperative", reason: "turn-down" }, { match: "^[#Infinitive] (your|my|the|a|an|any|each|every|some|more|with|on)", group: 0, notIf: "like", tag: "Imperative", reason: "eat-my-shorts" }, { match: "^[#Infinitive] (him|her|it|us|me|there)", group: 0, tag: "Imperative", reason: "tell-him" }, { match: "^[#Infinitive] #Adjective #Noun$", group: 0, tag: "Imperative", reason: "avoid-loud-noises" }, { match: "^[#Infinitive] (#Adjective|#Adverb)? and #Infinitive", group: 0, tag: "Imperative", reason: "call-and-reserve" }, { match: "^(go|stop|wait|hurry) please?$", tag: "Imperative", reason: "go" }, { match: "^(somebody|everybody) [#Infinitive]", group: 0, tag: "Imperative", reason: "somebody-call" }, { match: "^let (us|me) [#Infinitive]", group: 0, tag: "Imperative", reason: "lets-leave" }, { match: "^[(shut|close|open|start|stop|end|keep)] #Determiner #Noun", group: 0, tag: "Imperative", reason: "shut-the-door" }, { match: "^[#PhrasalVerb #Particle] #Determiner #Noun", group: 0, tag: "Imperative", reason: "turn-off-the-light" }, { match: "^[go] to .", group: 0, tag: "Imperative", reason: "go-to-toronto" }, { match: "^#Modal you [#Infinitive]", group: 0, tag: "Imperative", reason: "would-you-" }, { match: "^never [#Infinitive]", group: 0, tag: "Imperative", reason: "never-stop" }, { match: "^come #Infinitive", tag: "Imperative", notIf: "on", reason: "come-have" }, { match: "^come and? #Infinitive", tag: "Imperative . Imperative", notIf: "#PhrasalVerb", reason: "come-and-have" }, { match: "^stay (out|away|back)", tag: "Imperative", reason: "stay-away" }, { match: "^[(stay|be|keep)] #Adjective", group: 0, tag: "Imperative", reason: "stay-cool" }, { match: "^[keep it] #Adjective", group: 0, tag: "Imperative", reason: "keep-it-cool" }, { match: "^do not [#Infinitive]", group: 0, tag: "Imperative", reason: "do-not-be" }, { match: "[#Infinitive] (yourself|yourselves)", group: 0, tag: "Imperative", reason: "allow-yourself" }, { match: "[#Infinitive] what .", group: 0, tag: "Imperative", reason: "look-what" }, { match: "^[#Infinitive] #Gerund", group: 0, tag: "Imperative", reason: "keep-playing" }, { match: "^[#Infinitive] (to|for|into|toward|here|there)", group: 0, tag: "Imperative", reason: "go-to" }, { match: "^[#Infinitive] (and|or) #Infinitive", group: 0, tag: "Imperative", reason: "inf-and-inf" }, { match: "^[%Noun|Verb%] to", group: 0, tag: "Imperative", reason: "commit-to" }, { match: "^[#Infinitive] #Adjective? #Singular #Singular", group: 0, tag: "Imperative", reason: "maintain-eye-contact" }, { match: "do not (forget|omit|neglect) to [#Infinitive]", group: 0, tag: "Imperative", reason: "do-not-forget" }, { match: "^[(ask|wear|pay|look|help|show|watch|act|fix|kill|stop|start|turn|try|win)] #Noun", group: 0, tag: "Imperative", reason: "pay-attention" }], [{ match: "(that|which) were [%Adj|Gerund%]", group: 0, tag: "Gerund", reason: "that-were-growing" }, { match: "#Gerund [#Gerund] #Plural", group: 0, tag: "Adjective", reason: "hard-working-fam" }], [{ match: "u r", tag: "#Pronoun #Copula", reason: "u r" }, { match: "#Noun [(who|whom)]", group: 0, tag: "Determiner", reason: "captain-who" }, { match: "[had] #Noun+ #PastTense", group: 0, tag: "Condition", reason: "had-he" }, { match: "[were] #Noun+ to #Infinitive", group: 0, tag: "Condition", reason: "were-he" }, { match: "some sort of", tag: "Adjective Noun Conjunction", reason: "some-sort-of" }, { match: "of some sort", tag: "Conjunction Adjective Noun", reason: "of-some-sort" }, { match: "[such] (a|an|is)? #Noun", group: 0, tag: "Determiner", reason: "such-skill" }, { match: "[right] (before|after|in|into|to|toward)", group: 0, tag: "#Adverb", reason: "right-into" }, { match: "#Preposition [about]", group: 0, tag: "Adjective", reason: "at-about" }, { match: "(are|#Modal|see|do|for) [ya]", group: 0, tag: "Pronoun", reason: "are-ya" }, { match: "[long live] .", group: 0, tag: "#Adjective #Infinitive", reason: "long-live" }, { match: "[plenty] of", group: 0, tag: "#Uncountable", reason: "plenty-of" }, { match: "(always|nearly|barely|practically) [there]", group: 0, tag: "Adjective", reason: "always-there" }, { match: "[there] (#Adverb|#Pronoun)? #Copula", group: 0, tag: "There", reason: "there-is" }, { match: "#Copula [there] .", group: 0, tag: "There", reason: "is-there" }, { match: "#Modal #Adverb? [there]", group: 0, tag: "There", reason: "should-there" }, { match: "^[do] (you|we|they)", group: 0, tag: "QuestionWord", reason: "do-you" }, { match: "^[does] (he|she|it|#ProperNoun)", group: 0, tag: "QuestionWord", reason: "does-he" }, { match: "#Determiner #Noun+ [who] #Verb", group: 0, tag: "Preposition", reason: "the-x-who" }, { match: "#Determiner #Noun+ [which] #Verb", group: 0, tag: "Preposition", reason: "the-x-which" }, { match: "a [while]", group: 0, tag: "Noun", reason: "a-while" }, { match: "guess who", tag: "#Infinitive #QuestionWord", reason: "guess-who" }, { match: "[fucking] !#Verb", group: 0, tag: "#Gerund", reason: "f-as-gerund" }], [{ match: "university of #Place", tag: "Organization", reason: "university-of-Foo" }, { match: "#Noun (&|n) #Noun", tag: "Organization", reason: "Noun-&-Noun" }, { match: "#Organization of the? #ProperNoun", tag: "Organization", reason: "org-of-place", safe: true }, { match: "#Organization #Country", tag: "Organization", reason: "org-country" }, { match: "#ProperNoun #Organization", tag: "Organization", notIf: "#FirstName", reason: "titlecase-org" }, { match: "#ProperNoun (ltd|co|inc|dept|assn|bros)", tag: "Organization", reason: "org-abbrv" }, { match: "the [#Acronym]", group: 0, tag: "Organization", reason: "the-acronym", safe: true }, { match: "government of the? [#Place+]", tag: "Organization", reason: "government-of-x" }, { match: "(health|school|commerce) board", tag: "Organization", reason: "school-board" }, { match: "(nominating|special|conference|executive|steering|central|congressional) committee", tag: "Organization", reason: "special-comittee" }, { match: "(world|global|international|national|#Demonym) #Organization", tag: "Organization", reason: "global-org" }, { match: "#Noun+ (public|private) school", tag: "School", reason: "noun-public-school" }, { match: "#Place+ #SportsTeam", tag: "SportsTeam", reason: "place-sportsteam" }, { match: "(dc|atlanta|minnesota|manchester|newcastle|sheffield) united", tag: "SportsTeam", reason: "united-sportsteam" }, { match: "#Place+ fc", tag: "SportsTeam", reason: "fc-sportsteam" }, { match: "#Place+ #Noun{0,2} (club|society|group|team|committee|commission|association|guild|crew)", tag: "Organization", reason: "place-noun-society" }], [{ match: "(west|north|south|east|western|northern|southern|eastern)+ #Place", tag: "Region", reason: "west-norfolk" }, { match: "#City [(al|ak|az|ar|ca|ct|dc|fl|ga|id|il|nv|nh|nj|ny|oh|pa|sc|tn|tx|ut|vt|pr)]", group: 0, tag: "Region", reason: "us-state" }, { match: "portland [or]", group: 0, tag: "Region", reason: "portland-or" }, { match: "#ProperNoun+ (cliff|place|range|pit|place|point|room|grounds|ruins)", tag: "Place", reason: "foo-point" }, { match: "in [#ProperNoun] #Place", group: 0, tag: "Place", reason: "propernoun-place" }, { match: "#Value #Noun (st|street|rd|road|crescent|cr|way|tr|terrace|avenue|ave)", tag: "Address", reason: "address-st" }, { match: "(port|mount|mt) #ProperName", tag: "Place", reason: "port-name" }], [{ match: "[so] #Noun", group: 0, tag: "Conjunction", reason: "so-conj" }, { match: "[(who|what|where|why|how|when)] #Noun #Copula #Adverb? (#Verb|#Adjective)", group: 0, tag: "Conjunction", reason: "how-he-is-x" }, { match: "#Copula [(who|what|where|why|how|when)] #Noun", group: 0, tag: "Conjunction", reason: "when-he" }, { match: "#Verb [that] #Pronoun", group: 0, tag: "Conjunction", reason: "said-that-he" }, { match: "#Noun [that] #Copula", group: 0, tag: "Conjunction", reason: "that-are" }, { match: "#Noun [that] #Verb #Adjective", group: 0, tag: "Conjunction", reason: "that-seem" }, { match: "#Noun #Copula not? [that] #Adjective", group: 0, tag: "Adverb", reason: "that-adj" }, { match: "#Verb #Adverb? #Noun [(that|which)]", group: 0, tag: "Preposition", reason: "that-prep" }, { match: "@hasComma [which] (#Pronoun|#Verb)", group: 0, tag: "Preposition", reason: "which-copula" }, { match: "#Noun [like] #Noun", group: 0, tag: "Preposition", reason: "noun-like" }, { match: "^[like] #Determiner", group: 0, tag: "Preposition", reason: "like-the" }, { match: "a #Noun [like] (#Noun|#Determiner)", group: 0, tag: "Preposition", reason: "a-noun-like" }, { match: "#Adverb [like]", group: 0, tag: "Verb", reason: "really-like" }, { match: "(not|nothing|never) [like]", group: 0, tag: "Preposition", reason: "nothing-like" }, { match: "#Infinitive #Pronoun [like]", group: 0, tag: "Preposition", reason: "treat-them-like" }, { match: "[#QuestionWord] (#Pronoun|#Determiner)", group: 0, tag: "Preposition", reason: "how-he" }, { match: "[#QuestionWord] #Participle", group: 0, tag: "Preposition", reason: "when-stolen" }, { match: "[how] (#Determiner|#Copula|#Modal|#PastTense)", group: 0, tag: "QuestionWord", reason: "how-is" }, { match: "#Plural [(who|which|when)] .", group: 0, tag: "Preposition", reason: "people-who" }], [{ match: "holy (shit|fuck|hell)", tag: "Expression", reason: "swears-expression" }, { match: "^[(well|so|okay|now)] !#Adjective?", group: 0, tag: "Expression", reason: "well-" }, { match: "^come on", tag: "Expression", reason: "come-on" }, { match: "(say|says|said) [sorry]", group: 0, tag: "Expression", reason: "say-sorry" }, { match: "^(ok|alright|shoot|hell|anyways)", tag: "Expression", reason: "ok-" }, { match: "^(say && @hasComma)", tag: "Expression", reason: "say-" }, { match: "^(like && @hasComma)", tag: "Expression", reason: "like-" }, { match: "^[(dude|man|girl)] #Pronoun", group: 0, tag: "Expression", reason: "dude-i" }]), Fl = null;
      var Vl = { postTagger: function(e3) {
        const { world: t3 } = e3, { model: n2, methods: r2 } = t3;
        Fl = Fl || r2.one.buildNet(n2.two.matches, t3);
        let a2 = r2.two.quickSplit(e3.document).map((e4) => {
          let t4 = e4[0];
          return [t4.index[0], t4.index[1], t4.index[1] + e4.length];
        }), o2 = e3.update(a2);
        return o2.cache(), o2.sweep(Fl), e3.uncache(), e3.unfreeze(), e3;
      }, tagger: (e3) => e3.compute(["freeze", "lexicon", "preTagger", "postTagger", "unfreeze"]) };
      const zl = { api: function(e3) {
        e3.prototype.confidence = function() {
          let e4 = 0, t3 = 0;
          return this.docs.forEach((n2) => {
            n2.forEach((n3) => {
              t3 += 1, e4 += n3.confidence || 1;
            });
          }), 0 === t3 ? 1 : ((e5) => Math.round(100 * e5) / 100)(e4 / t3);
        }, e3.prototype.tagger = function() {
          return this.compute(["tagger"]);
        };
      }, compute: Vl, model: { two: { matches: Ol } }, hooks: ["postTagger"] }, Bl = function(e3, t3) {
        let n2 = function(e4) {
          return Object.keys(e4.hooks).filter((e5) => !e5.startsWith("#") && !e5.startsWith("%"));
        }(t3);
        if (0 === n2.length) return e3;
        e3._cache || e3.cache();
        let r2 = e3._cache;
        return e3.filter((e4, t4) => n2.some((e5) => r2[t4].has(e5)));
      };
      var Sl = { lib: { lazy: function(e3, t3) {
        let n2 = t3;
        "string" == typeof t3 && (n2 = this.buildNet([{ match: t3 }]));
        let r2 = this.tokenize(e3), a2 = Bl(r2, n2);
        return a2.found ? (a2.compute(["index", "tagger"]), a2.match(t3)) : r2.none();
      } } };
      const $l = function(e3, t3, n2) {
        let r2 = e3.split(/ /g).map((e4) => e4.toLowerCase().trim());
        r2 = r2.filter((e4) => e4), r2 = r2.map((e4) => `{${e4}}`).join(" ");
        let a2 = this.match(r2);
        return n2 && (a2 = a2.if(n2)), a2.has("#Verb") ? function(e4, t4) {
          let n3 = t4;
          return e4.forEach((e5) => {
            e5.has("#Infinitive") || (n3 = function(e6, t5) {
              let n4 = (0, e6.methods.two.transform.verb.conjugate)(t5, e6.model);
              return e6.has("#Gerund") ? n4.Gerund : e6.has("#PastTense") ? n4.PastTense : e6.has("#PresentTense") ? n4.PresentTense : e6.has("#Gerund") ? n4.Gerund : t5;
            }(e5, t4)), e5.replaceWith(n3);
          }), e4;
        }(a2, t3) : a2.has("#Noun") ? function(e4, t4) {
          let n3 = t4;
          e4.has("#Plural") && (n3 = (0, e4.methods.two.transform.noun.toPlural)(t4, e4.model)), e4.replaceWith(n3, { possessives: true });
        }(a2, t3) : a2.has("#Adverb") ? function(e4, t4) {
          const { toAdverb: n3 } = e4.methods.two.transform.adjective;
          let r3 = n3(t4);
          r3 && e4.replaceWith(r3);
        }(a2, t3) : a2.has("#Adjective") ? function(e4, t4) {
          const { toComparative: n3, toSuperlative: r3 } = e4.methods.two.transform.adjective;
          let a3 = t4;
          e4.has("#Comparative") ? a3 = n3(a3, e4.model) : e4.has("#Superlative") && (a3 = r3(a3, e4.model)), a3 && e4.replaceWith(a3);
        }(a2, t3) : this;
      };
      var Ml = { api: function(e3) {
        e3.prototype.swap = $l;
      } };
      h.plugin(sl), h.plugin(Hl), h.plugin(zl), h.plugin(Sl), h.plugin(Ml);
      const Kl = function(e3) {
        const { fromComparative: t3, fromSuperlative: n2 } = e3.methods.two.transform.adjective;
        let r2 = e3.text("normal");
        return e3.has("#Comparative") ? t3(r2, e3.model) : e3.has("#Superlative") ? n2(r2, e3.model) : r2;
      };
      var Ll = { api: function(e3) {
        class Adjectives extends e3 {
          constructor(e4, t3, n2) {
            super(e4, t3, n2), this.viewType = "Adjectives";
          }
          json(e4 = {}) {
            const { toAdverb: t3, toNoun: n2, toSuperlative: r2, toComparative: a2 } = this.methods.two.transform.adjective;
            return e4.normal = true, this.map((o2) => {
              let i2 = o2.toView().json(e4)[0] || {}, s2 = Kl(o2);
              return i2.adjective = { adverb: t3(s2, this.model), noun: n2(s2, this.model), superlative: r2(s2, this.model), comparative: a2(s2, this.model) }, i2;
            }, []);
          }
          adverbs() {
            return this.before("#Adverb+$").concat(this.after("^#Adverb+"));
          }
          conjugate(e4) {
            const { toComparative: t3, toSuperlative: n2, toNoun: r2, toAdverb: a2 } = this.methods.two.transform.adjective;
            return this.getNth(e4).map((e5) => {
              let o2 = Kl(e5);
              return { Adjective: o2, Comparative: t3(o2, this.model), Superlative: n2(o2, this.model), Noun: r2(o2, this.model), Adverb: a2(o2, this.model) };
            }, []);
          }
          toComparative(e4) {
            const { toComparative: t3 } = this.methods.two.transform.adjective;
            return this.getNth(e4).map((e5) => {
              let n2 = Kl(e5), r2 = t3(n2, this.model);
              return e5.replaceWith(r2);
            });
          }
          toSuperlative(e4) {
            const { toSuperlative: t3 } = this.methods.two.transform.adjective;
            return this.getNth(e4).map((e5) => {
              let n2 = Kl(e5), r2 = t3(n2, this.model);
              return e5.replaceWith(r2);
            });
          }
          toAdverb(e4) {
            const { toAdverb: t3 } = this.methods.two.transform.adjective;
            return this.getNth(e4).map((e5) => {
              let n2 = Kl(e5), r2 = t3(n2, this.model);
              return e5.replaceWith(r2);
            });
          }
          toNoun(e4) {
            const { toNoun: t3 } = this.methods.two.transform.adjective;
            return this.getNth(e4).map((e5) => {
              let n2 = Kl(e5), r2 = t3(n2, this.model);
              return e5.replaceWith(r2);
            });
          }
        }
        e3.prototype.adjectives = function(e4) {
          let t3 = this.match("#Adjective");
          return t3 = t3.getNth(e4), new Adjectives(t3.document, t3.pointer);
        }, e3.prototype.superlatives = function(e4) {
          let t3 = this.match("#Superlative");
          return t3 = t3.getNth(e4), new Adjectives(t3.document, t3.pointer);
        }, e3.prototype.comparatives = function(e4) {
          let t3 = this.match("#Comparative");
          return t3 = t3.getNth(e4), new Adjectives(t3.document, t3.pointer);
        };
      } }, Jl = { api: function(e3) {
        class Adverbs extends e3 {
          constructor(e4, t3, n2) {
            super(e4, t3, n2), this.viewType = "Adverbs";
          }
          conjugate(e4) {
            return this.getNth(e4).map((e5) => {
              let t3 = function(e6) {
                return e6.compute("root").text("root");
              }(e5);
              return { Adverb: e5.text("normal"), Adjective: t3 };
            }, []);
          }
          json(e4 = {}) {
            const t3 = this.methods.two.transform.adjective.fromAdverb;
            return e4.normal = true, this.map((n2) => {
              let r2 = n2.toView().json(e4)[0] || {};
              return r2.adverb = { adjective: t3(r2.normal) }, r2;
            }, []);
          }
        }
        e3.prototype.adverbs = function(e4) {
          let t3 = this.match("#Adverb");
          return t3 = t3.getNth(e4), new Adverbs(t3.document, t3.pointer);
        };
      } };
      const Wl = function(e3) {
        let t3 = this;
        t3 = function(e4) {
          let t4 = e4.parentheses();
          return t4 = t4.filter((e5) => e5.wordCount() >= 3 && e5.has("#Verb") && e5.has("#Noun")), e4.splitOn(t4);
        }(t3), t3 = function(e4) {
          let t4 = e4.quotations();
          return t4 = t4.filter((e5) => e5.wordCount() >= 3 && e5.has("#Verb") && e5.has("#Noun")), e4.splitOn(t4);
        }(t3), t3 = function(e4) {
          let t4 = e4.match("@hasComma");
          return t4 = t4.filter((e5) => {
            if (1 === e5.growLeft(".").wordCount()) return false;
            if (1 === e5.growRight(". .").wordCount()) return false;
            let t5 = e5.grow(".");
            return t5 = t5.ifNo("@hasComma @hasComma"), t5 = t5.ifNo("@hasComma (and|or) ."), t5 = t5.ifNo("(#City && @hasComma) #Country"), t5 = t5.ifNo("(#WeekDay && @hasComma) #Date"), t5 = t5.ifNo("(#Date+ && @hasComma) #Value"), t5 = t5.ifNo("(#Adjective && @hasComma) #Adjective"), t5.found;
          }), e4.splitAfter(t4);
        }(t3), t3 = t3.splitAfter("(@hasEllipses|@hasSemicolon|@hasDash|@hasColon)"), t3 = t3.splitAfter("^#Pronoun (said|says)"), t3 = t3.splitBefore("(said|says) #ProperNoun$"), t3 = t3.splitBefore(". . if .{4}"), t3 = t3.splitBefore("and while"), t3 = t3.splitBefore("now that"), t3 = t3.splitBefore("ever since"), t3 = t3.splitBefore("(supposing|although)"), t3 = t3.splitBefore("even (while|if|though)"), t3 = t3.splitBefore("(whereas|whose)"), t3 = t3.splitBefore("as (though|if)"), t3 = t3.splitBefore("(til|until)");
        let n2 = t3.match("#Verb .* [but] .* #Verb", 0);
        n2.found && (t3 = t3.splitBefore(n2));
        let r2 = t3.if("if .{2,9} then .").match("then");
        return t3 = t3.splitBefore(r2), "number" == typeof e3 && (t3 = t3.get(e3)), t3;
      }, ql = { this: "Noun", then: "Pivot" }, Ul = [{ match: "[that] #Determiner #Noun", group: 0, chunk: "Pivot" }, { match: "#PastTense [that]", group: 0, chunk: "Pivot" }, { match: "[so] #Determiner", group: 0, chunk: "Pivot" }, { match: "#Copula #Adverb+? [#Adjective]", group: 0, chunk: "Adjective" }, { match: "#Adjective and #Adjective", chunk: "Adjective" }, { match: "#Adverb+ and #Adverb #Verb", chunk: "Verb" }, { match: "#Gerund #Adjective$", chunk: "Verb" }, { match: "#Gerund to #Verb", chunk: "Verb" }, { match: "#PresentTense and #PresentTense", chunk: "Verb" }, { match: "#Adverb #Negative", chunk: "Verb" }, { match: "(want|wants|wanted) to #Infinitive", chunk: "Verb" }, { match: "#Verb #Reflexive", chunk: "Verb" }, { match: "#Verb [to] #Adverb? #Infinitive", group: 0, chunk: "Verb" }, { match: "[#Preposition] #Gerund", group: 0, chunk: "Verb" }, { match: "#Infinitive [that] <Noun>", group: 0, chunk: "Verb" }, { match: "#Noun of #Determiner? #Noun", chunk: "Noun" }, { match: "#Value+ #Adverb? #Adjective", chunk: "Noun" }, { match: "the [#Adjective] #Noun", chunk: "Noun" }, { match: "#Singular in #Determiner? #Singular", chunk: "Noun" }, { match: "#Plural [in] #Determiner? #Noun", group: 0, chunk: "Pivot" }, { match: "#Noun and #Determiner? #Noun", notIf: "(#Possessive|#Pronoun)", chunk: "Noun" }];
      let Rl = null;
      const Ql = function(e3, t3) {
        if (("undefined" != typeof process && process.env ? process.env : self.env || {}).DEBUG_CHUNKS) {
          let n2 = (e3.normal + "'").padEnd(8);
          console.log(`  | '${n2}  \u2192  \x1B[34m${t3.padEnd(12)}\x1B[0m \x1B[2m -fallback- \x1B[0m`);
        }
        e3.chunk = t3;
      };
      var Zl = { chunks: function(e3) {
        const { document: t3, world: n2 } = e3;
        !function(e4) {
          for (let t4 = 0; t4 < e4.length; t4 += 1) for (let n3 = 0; n3 < e4[t4].length; n3 += 1) {
            let r2 = e4[t4][n3];
            true !== ql.hasOwnProperty(r2.normal) ? r2.tags.has("Verb") ? r2.chunk = "Verb" : r2.tags.has("Noun") || r2.tags.has("Determiner") || r2.tags.has("Value") ? r2.chunk = "Noun" : r2.tags.has("QuestionWord") && (r2.chunk = "Pivot") : r2.chunk = ql[r2.normal];
          }
        }(t3), function(e4) {
          for (let t4 = 0; t4 < e4.length; t4 += 1) for (let n3 = 0; n3 < e4[t4].length; n3 += 1) {
            let r2 = e4[t4][n3];
            if (r2.chunk) continue;
            let a2 = e4[t4][n3 + 1], o2 = e4[t4][n3 - 1];
            if (r2.tags.has("Adjective")) {
              if (o2 && o2.tags.has("Copula")) {
                r2.chunk = "Adjective";
                continue;
              }
              if (o2 && o2.tags.has("Determiner")) {
                r2.chunk = "Noun";
                continue;
              }
              if (a2 && a2.tags.has("Noun")) {
                r2.chunk = "Noun";
                continue;
              }
            } else if (r2.tags.has("Adverb") || r2.tags.has("Negative")) {
              if (o2 && o2.tags.has("Adjective")) {
                r2.chunk = "Adjective";
                continue;
              }
              if (o2 && o2.tags.has("Verb")) {
                r2.chunk = "Verb";
                continue;
              }
              if (a2 && a2.tags.has("Adjective")) {
                r2.chunk = "Adjective";
                continue;
              }
              if (a2 && a2.tags.has("Verb")) {
                r2.chunk = "Verb";
                continue;
              }
            }
          }
        }(t3), function(e4, t4, n3) {
          const { methods: r2 } = n3;
          Rl = Rl || r2.one.buildNet(Ul, n3), e4.sweep(Rl);
        }(e3, 0, n2), function(e4) {
          for (let t4 = 0; t4 < e4.length; t4 += 1) for (let n3 = 0; n3 < e4[t4].length; n3 += 1) {
            let r2 = e4[t4][n3];
            void 0 === r2.chunk && (r2.tags.has("Conjunction") || r2.tags.has("Preposition") ? Ql(r2, "Pivot") : r2.tags.has("Adverb") ? Ql(r2, "Verb") : r2.chunk = "Noun");
          }
        }(t3), function(e4) {
          let t4 = [], n3 = null;
          e4.forEach((e5) => {
            for (let r2 = 0; r2 < e5.length; r2 += 1) {
              let a2 = e5[r2];
              n3 && a2.chunk === n3 ? t4[t4.length - 1].terms.push(a2) : (t4.push({ chunk: a2.chunk, terms: [a2] }), n3 = a2.chunk);
            }
          }), t4.forEach((e5) => {
            if ("Verb" === e5.chunk) {
              const t5 = e5.terms.find((e6) => e6.tags.has("Verb"));
              t5 || e5.terms.forEach((e6) => e6.chunk = null);
            }
          });
        }(t3);
      } }, _l = { compute: Zl, api: function(e3) {
        class Chunks extends e3 {
          constructor(e4, t3, n2) {
            super(e4, t3, n2), this.viewType = "Chunks";
          }
          isVerb() {
            return this.filter((e4) => e4.has("<Verb>"));
          }
          isNoun() {
            return this.filter((e4) => e4.has("<Noun>"));
          }
          isAdjective() {
            return this.filter((e4) => e4.has("<Adjective>"));
          }
          isPivot() {
            return this.filter((e4) => e4.has("<Pivot>"));
          }
          debug() {
            return this.toView().debug("chunks"), this;
          }
          update(e4) {
            let t3 = new Chunks(this.document, e4);
            return t3._cache = this._cache, t3;
          }
        }
        e3.prototype.chunks = function(e4) {
          let t3 = function(e5) {
            let t4 = [], n2 = null;
            return e5.clauses().docs.forEach((e6) => {
              e6.forEach((e7) => {
                e7.chunk && e7.chunk === n2 ? t4[t4.length - 1][2] = e7.index[1] + 1 : (n2 = e7.chunk, t4.push([e7.index[0], e7.index[1], e7.index[1] + 1]));
              }), n2 = null;
            }), e5.update(t4);
          }(this);
          return t3 = t3.getNth(e4), new Chunks(this.document, t3.pointer);
        }, e3.prototype.clauses = Wl;
      }, hooks: ["chunks"] };
      const Xl = /\./g, Yl = /\(/, eu = /\)/, tu = function(e3, t3) {
        for (; t3 < e3.length; t3 += 1) if (e3[t3].post && eu.test(e3[t3].post)) {
          let [, n2] = e3[t3].index;
          return n2 = n2 || 0, n2;
        }
        return null;
      }, nu = function(e3) {
        class Parentheses extends e3 {
          constructor(e4, t3, n2) {
            super(e4, t3, n2), this.viewType = "Possessives";
          }
          strip() {
            return function(e4) {
              return e4.docs.forEach((e5) => {
                e5[0].pre = e5[0].pre.replace(Yl, "");
                let t3 = e5[e5.length - 1];
                t3.post = t3.post.replace(eu, "");
              }), e4;
            }(this);
          }
        }
        e3.prototype.parentheses = function(e4) {
          let t3 = function(e5) {
            let t4 = [];
            return e5.docs.forEach((e6) => {
              for (let n2 = 0; n2 < e6.length; n2 += 1) {
                let r2 = e6[n2];
                if (r2.pre && Yl.test(r2.pre)) {
                  let r3 = tu(e6, n2);
                  if (null !== r3) {
                    let [a2, o2] = e6[n2].index;
                    t4.push([a2, o2, r3 + 1, e6[n2].id]), n2 = r3;
                  }
                }
              }
            }), e5.update(t4);
          }(this);
          return t3 = t3.getNth(e4), new Parentheses(t3.document, t3.pointer);
        };
      }, ru = /'s$/, au = { '"': '"', "\uFF02": "\uFF02", "'": "'", "\u201C": "\u201D", "\u2018": "\u2019", "\u201F": "\u201D", "\u201B": "\u2019", "\u201E": "\u201D", "\u2E42": "\u201D", "\u201A": "\u2019", "\xAB": "\xBB", "\u2039": "\u203A", "\u2035": "\u2032", "\u2036": "\u2033", "\u2037": "\u2034", "\u301D": "\u301E", "`": "\xB4", "\u301F": "\u301E" }, ou = RegExp("[" + Object.keys(au).join("") + "]"), iu = RegExp("[" + Object.values(au).join("") + "]"), su = function(e3, t3) {
        const n2 = e3[t3].pre.match(ou)[0] || "";
        if (!n2 || !au[n2]) return null;
        const r2 = au[n2];
        for (; t3 < e3.length; t3 += 1) if (e3[t3].post && e3[t3].post.match(r2)) return t3;
        return null;
      }, lu = function(e3) {
        class Quotations extends e3 {
          constructor(e4, t3, n2) {
            super(e4, t3, n2), this.viewType = "Possessives";
          }
          strip() {
            return function(e4) {
              e4.docs.forEach((e5) => {
                e5[0].pre = e5[0].pre.replace(ou, "");
                let t3 = e5[e5.length - 1];
                t3.post = t3.post.replace(iu, "");
              });
            }(this);
          }
        }
        e3.prototype.quotations = function(e4) {
          let t3 = function(e5) {
            let t4 = [];
            return e5.docs.forEach((e6) => {
              for (let n2 = 0; n2 < e6.length; n2 += 1) {
                let r2 = e6[n2];
                if (r2.pre && ou.test(r2.pre)) {
                  let r3 = su(e6, n2);
                  if (null !== r3) {
                    let [a2, o2] = e6[n2].index;
                    t4.push([a2, o2, r3 + 1, e6[n2].id]), n2 = r3;
                  }
                }
              }
            }), e5.update(t4);
          }(this);
          return t3 = t3.getNth(e4), new Quotations(t3.document, t3.pointer);
        };
      }, uu = function(e3) {
        let t3 = this.splitAfter("@hasComma");
        return t3 = t3.match("#PhoneNumber+"), t3 = t3.getNth(e3), t3;
      }, cu = [["hyphenated", "@hasHyphen ."], ["hashTags", "#HashTag"], ["emails", "#Email"], ["emoji", "#Emoji"], ["emoticons", "#Emoticon"], ["atMentions", "#AtMention"], ["urls", "#Url"], ["conjunctions", "#Conjunction"], ["prepositions", "#Preposition"], ["abbreviations", "#Abbreviation"], ["honorifics", "#Honorific"]];
      let hu = [["emojis", "emoji"], ["atmentions", "atMentions"]];
      const du = /\//;
      var gu = { api: function(e3) {
        !function(e4) {
          class Acronyms extends e4 {
            constructor(e5, t3, n2) {
              super(e5, t3, n2), this.viewType = "Acronyms";
            }
            strip() {
              return this.docs.forEach((e5) => {
                e5.forEach((e6) => {
                  e6.text = e6.text.replace(Xl, ""), e6.normal = e6.normal.replace(Xl, "");
                });
              }), this;
            }
            addPeriods() {
              return this.docs.forEach((e5) => {
                e5.forEach((e6) => {
                  e6.text = e6.text.replace(Xl, ""), e6.normal = e6.normal.replace(Xl, ""), e6.text = e6.text.split("").join(".") + ".", e6.normal = e6.normal.split("").join(".") + ".";
                });
              }), this;
            }
          }
          e4.prototype.acronyms = function(e5) {
            let t3 = this.match("#Acronym");
            return t3 = t3.getNth(e5), new Acronyms(t3.document, t3.pointer);
          };
        }(e3), nu(e3), function(e4) {
          class Possessives extends e4 {
            constructor(e5, t3, n2) {
              super(e5, t3, n2), this.viewType = "Possessives";
            }
            strip() {
              return this.docs.forEach((e5) => {
                e5.forEach((e6) => {
                  e6.text = e6.text.replace(ru, ""), e6.normal = e6.normal.replace(ru, "");
                });
              }), this;
            }
          }
          e4.prototype.possessives = function(e5) {
            let t3 = function(e6) {
              let t4 = e6.match("#Possessive+");
              return t4.has("#Person") && (t4 = t4.growLeft("#Person+")), t4.has("#Place") && (t4 = t4.growLeft("#Place+")), t4.has("#Organization") && (t4 = t4.growLeft("#Organization+")), t4;
            }(this);
            return t3 = t3.getNth(e5), new Possessives(t3.document, t3.pointer);
          };
        }(e3), lu(e3), function(e4) {
          cu.forEach((t3) => {
            e4.prototype[t3[0]] = function(e5) {
              let n2 = this.match(t3[1]);
              return "number" == typeof e5 ? n2.get(e5) : n2;
            };
          }), e4.prototype.phoneNumbers = uu, hu.forEach((t3) => {
            e4.prototype[t3[0]] = e4.prototype[t3[1]];
          });
        }(e3), function(e4) {
          class Slashes extends e4 {
            constructor(e5, t3, n2) {
              super(e5, t3, n2), this.viewType = "Slashes";
            }
            split() {
              return this.map((e5) => {
                let t3 = e5.text().split(du);
                return (e5 = e5.replaceWith(t3.join(" "))).growRight("(" + t3.join("|") + ")+");
              });
            }
          }
          e4.prototype.slashes = function(e5) {
            let t3 = this.match("#SlashedTerm");
            return t3 = t3.getNth(e5), new Slashes(t3.document, t3.pointer);
          };
        }(e3);
      } };
      const mu = function(e3, t3) {
        e3.docs.forEach((e4) => {
          e4.forEach(t3);
        });
      };
      var pu = { case: (e3) => {
        mu(e3, (e4) => {
          e4.text = e4.text.toLowerCase();
        });
      }, unicode: (e3) => {
        const t3 = e3.world, n2 = t3.methods.one.killUnicode;
        mu(e3, (e4) => e4.text = n2(e4.text, t3));
      }, whitespace: (e3) => {
        mu(e3, (e4) => {
          e4.post = e4.post.replace(/\s+/g, " "), e4.post = e4.post.replace(/\s([.,?!:;])/g, "$1"), e4.pre = e4.pre.replace(/\s+/g, "");
        });
      }, punctuation: (e3) => {
        mu(e3, (e4) => {
          e4.post = e4.post.replace(/[–—-]/g, " "), e4.post = e4.post.replace(/[,:;]/g, ""), e4.post = e4.post.replace(/\.{2,}/g, ""), e4.post = e4.post.replace(/\?{2,}/g, "?"), e4.post = e4.post.replace(/!{2,}/g, "!"), e4.post = e4.post.replace(/\?!+/g, "?");
        });
        let t3 = e3.docs, n2 = t3[t3.length - 1];
        if (n2 && n2.length > 0) {
          let e4 = n2[n2.length - 1];
          e4.post = e4.post.replace(/ /g, "");
        }
      }, contractions: (e3) => {
        e3.contractions().expand();
      }, acronyms: (e3) => {
        e3.acronyms().strip();
      }, parentheses: (e3) => {
        e3.parentheses().strip();
      }, possessives: (e3) => {
        e3.possessives().strip();
      }, quotations: (e3) => {
        e3.quotations().strip();
      }, emoji: (e3) => {
        e3.emojis().remove();
      }, honorifics: (e3) => {
        e3.match("#Honorific+ #Person").honorifics().remove();
      }, adverbs: (e3) => {
        e3.adverbs().remove();
      }, nouns: (e3) => {
        e3.nouns().toSingular();
      }, verbs: (e3) => {
        e3.verbs().toInfinitive();
      }, numbers: (e3) => {
        e3.numbers().toNumber();
      }, debullet: (e3) => {
        const t3 = /^\s*([-–—*•])\s*$/;
        return e3.docs.forEach((e4) => {
          t3.test(e4[0].pre) && (e4[0].pre = e4[0].pre.replace(t3, ""));
        }), e3;
      } };
      const fu = (e3) => e3.split("|").reduce((e4, t3) => (e4[t3] = true, e4), {}), bu = "unicode|punctuation|whitespace|acronyms", vu = "|case|contractions|parentheses|quotations|emoji|honorifics|debullet", yu = { light: fu(bu), medium: fu(bu + vu), heavy: fu(bu + vu + "|possessives|adverbs|nouns|verbs") };
      var wu = { api: function(e3) {
        e3.prototype.normalize = function(e4 = "light") {
          return "string" == typeof e4 && (e4 = yu[e4]), Object.keys(e4).forEach((t3) => {
            pu.hasOwnProperty(t3) && pu[t3](this, e4[t3]);
          }), this;
        };
      } };
      const ku = ["after", "although", "as if", "as long as", "as", "because", "before", "even if", "even though", "ever since", "if", "in order that", "provided that", "since", "so that", "than", "that", "though", "unless", "until", "what", "whatever", "when", "whenever", "where", "whereas", "wherever", "whether", "which", "whichever", "who", "whoever", "whom", "whomever", "whose"], Pu = function(e3) {
        if (e3.before("#Preposition$").found) return true;
        if (!e3.before().found) return false;
        for (let t3 = 0; t3 < ku.length; t3 += 1) if (e3.has(ku[t3])) return true;
        return false;
      }, Au = function(e3, t3) {
        if (e3.has("#Plural")) return true;
        if (e3.has("#Noun and #Noun")) return true;
        if (e3.has("(we|they)")) return true;
        if (true === t3.has("(#Pronoun|#Place|#Value|#Person|#Uncountable|#Month|#WeekDay|#Holiday|#Possessive)")) return false;
        if (e3.has("#Singular")) return false;
        let n2 = t3.text("normal");
        return n2.length > 3 && n2.endsWith("s") && !n2.endsWith("ss");
      }, Cu = function(e3) {
        let t3 = function(e4) {
          let t4 = e4.clone();
          return t4 = t4.match("#Noun+"), t4 = t4.remove("(#Adjective|#Preposition|#Determiner|#Value)"), t4 = t4.not("#Possessive"), t4 = t4.first(), t4.found ? t4 : e4;
        }(e3);
        return { determiner: e3.match("#Determiner").eq(0), adjectives: e3.match("#Adjective"), number: e3.values(), isPlural: Au(e3, t3), isSubordinate: Pu(e3), root: t3 };
      }, Nu = (e3) => e3.text(), ju = (e3) => e3.json({ terms: false, normal: true }).map((e4) => e4.normal), xu = function(e3) {
        if (!e3.found) return null;
        let t3 = e3.values(0);
        return t3.found ? (t3.parse()[0] || {}).num : null;
      }, Iu = function(e3) {
        return !e3.has("^(#Uncountable|#ProperNoun|#Place|#Pronoun|#Acronym)+$");
      }, Tu = { tags: true }, Du = { tags: true };
      var Hu = { api: function(e3) {
        class Nouns extends e3 {
          constructor(e4, t3, n2) {
            super(e4, t3, n2), this.viewType = "Nouns";
          }
          parse(e4) {
            return this.getNth(e4).map(Cu);
          }
          json(e4) {
            let t3 = "object" == typeof e4 ? e4 : {};
            return this.getNth(e4).map((e5) => {
              let n2 = e5.toView().json(t3)[0] || {};
              return t3 && false !== t3.noun && (n2.noun = function(e6) {
                let t4 = Cu(e6);
                return { root: Nu(t4.root), number: xu(t4.number), determiner: Nu(t4.determiner), adjectives: ju(t4.adjectives), isPlural: t4.isPlural, isSubordinate: t4.isSubordinate };
              }(e5)), n2;
            }, []);
          }
          conjugate(e4) {
            const t3 = this.world.methods.two.transform.noun;
            return this.getNth(e4).map((e5) => {
              let n2 = Cu(e5), r2 = n2.root.compute("root").text("root"), a2 = { Singular: r2 };
              return Iu(n2.root) && (a2.Plural = t3.toPlural(r2, this.model)), a2.Singular === a2.Plural && delete a2.Plural, a2;
            }, []);
          }
          isPlural(e4) {
            let t3 = this.filter((e5) => Cu(e5).isPlural);
            return t3.getNth(e4);
          }
          isSingular(e4) {
            let t3 = this.filter((e5) => !Cu(e5).isPlural);
            return t3.getNth(e4);
          }
          adjectives(e4) {
            let t3 = this.update([]);
            return this.forEach((e5) => {
              let n2 = Cu(e5).adjectives;
              n2.found && (t3 = t3.concat(n2));
            }), t3.getNth(e4);
          }
          toPlural(e4) {
            return this.getNth(e4).map((e5) => function(e6, t3) {
              if (true === t3.isPlural) return e6;
              if (t3.root.has("#Possessive") && (t3.root = t3.root.possessives().strip()), !Iu(t3.root)) return e6;
              const { methods: n2, model: r2 } = e6.world, { toPlural: a2 } = n2.two.transform.noun;
              let o2 = a2(t3.root.text({ keepPunct: false }), r2);
              e6.match(t3.root).replaceWith(o2, Tu).tag("Plural", "toPlural"), t3.determiner.has("(a|an)") && e6.remove(t3.determiner);
              let i2 = t3.root.after("not? #Adverb+? [#Copula]", 0);
              return i2.found && (i2.has("is") ? e6.replace(i2, "are") : i2.has("was") && e6.replace(i2, "were")), e6;
            }(e5, Cu(e5)));
          }
          toSingular(e4) {
            return this.getNth(e4).map((e5) => function(e6, t3) {
              if (false === t3.isPlural) return e6;
              const { methods: n2, model: r2 } = e6.world, { toSingular: a2 } = n2.two.transform.noun;
              let o2 = a2(t3.root.text("normal"), r2);
              return e6.replace(t3.root, o2, Du).tag("Singular", "toPlural"), e6;
            }(e5, Cu(e5)));
          }
          update(e4) {
            let t3 = new Nouns(this.document, e4);
            return t3._cache = this._cache, t3;
          }
        }
        e3.prototype.nouns = function(e4) {
          let t3 = function(e5) {
            let t4 = e5.clauses().match("<Noun>"), n2 = t4.match("@hasComma");
            return n2 = n2.not("#Place"), n2.found && (t4 = t4.splitAfter(n2)), t4 = t4.splitOn("#Expression"), t4 = t4.splitOn("(he|she|we|you|they|i)"), t4 = t4.splitOn("(#Noun|#Adjective) [(he|him|she|it)]", 0), t4 = t4.splitOn("[(he|him|she|it)] (#Determiner|#Value)", 0), t4 = t4.splitBefore("#Noun [(the|a|an)] #Adjective? #Noun", 0), t4 = t4.splitOn("[(here|there)] #Noun", 0), t4 = t4.splitOn("[#Noun] (here|there)", 0), t4 = t4.splitBefore("(our|my|their|your)"), t4 = t4.splitOn("#Noun [#Determiner]", 0), t4 = t4.if("#Noun"), t4;
          }(this);
          return t3 = t3.getNth(e4), new Nouns(this.document, t3.pointer);
        };
      } }, Eu = { ones: { zeroth: 0, first: 1, second: 2, third: 3, fourth: 4, fifth: 5, sixth: 6, seventh: 7, eighth: 8, ninth: 9, zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9 }, teens: { tenth: 10, eleventh: 11, twelfth: 12, thirteenth: 13, fourteenth: 14, fifteenth: 15, sixteenth: 16, seventeenth: 17, eighteenth: 18, nineteenth: 19, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19 }, tens: { twentieth: 20, thirtieth: 30, fortieth: 40, fourtieth: 40, fiftieth: 50, sixtieth: 60, seventieth: 70, eightieth: 80, ninetieth: 90, twenty: 20, thirty: 30, forty: 40, fourty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90 }, multiples: { hundredth: 100, thousandth: 1e3, millionth: 1e6, billionth: 1e9, trillionth: 1e12, quadrillionth: 1e15, quintillionth: 1e18, sextillionth: 1e21, septillionth: 1e24, hundred: 100, thousand: 1e3, million: 1e6, billion: 1e9, trillion: 1e12, quadrillion: 1e15, quintillion: 1e18, sextillion: 1e21, septillion: 1e24, grand: 1e3 } };
      const Gu = (e3, t3) => {
        if (Eu.ones.hasOwnProperty(e3)) {
          if (t3.ones || t3.teens) return false;
        } else if (Eu.teens.hasOwnProperty(e3)) {
          if (t3.ones || t3.teens || t3.tens) return false;
        } else if (Eu.tens.hasOwnProperty(e3) && (t3.ones || t3.teens || t3.tens)) return false;
        return true;
      }, Ou = function(e3) {
        let t3 = "0.";
        for (let n2 = 0; n2 < e3.length; n2++) {
          let r2 = e3[n2];
          if (true === Eu.ones.hasOwnProperty(r2)) t3 += Eu.ones[r2];
          else if (true === Eu.teens.hasOwnProperty(r2)) t3 += Eu.teens[r2];
          else if (true === Eu.tens.hasOwnProperty(r2)) t3 += Eu.tens[r2];
          else {
            if (true !== /^[0-9]$/.test(r2)) return 0;
            t3 += r2;
          }
        }
        return parseFloat(t3);
      }, Fu = (e3) => e3 = (e3 = (e3 = (e3 = (e3 = (e3 = (e3 = (e3 = e3.replace(/1st$/, "1")).replace(/2nd$/, "2")).replace(/3rd$/, "3")).replace(/([4567890])r?th$/, "$1")).replace(/^[$€¥£¢]/, "")).replace(/[%$€¥£¢]$/, "")).replace(/,/g, "")).replace(/([0-9])([a-z\u00C0-\u00FF]{1,2})$/, "$1"), Vu = /^([0-9,. ]+)\/([0-9,. ]+)$/, zu = { "a few": 3, "a couple": 2, "a dozen": 12, "two dozen": 24, zero: 0 }, Bu = (e3) => Object.keys(e3).reduce((t3, n2) => t3 += e3[n2], 0), Su = function(e3) {
        if (true === zu.hasOwnProperty(e3)) return zu[e3];
        if ("a" === e3 || "an" === e3) return 1;
        const t3 = ((e4) => {
          const t4 = [{ reg: /^(minus|negative)[\s-]/i, mult: -1 }, { reg: /^(a\s)?half[\s-](of\s)?/i, mult: 0.5 }];
          for (let n3 = 0; n3 < t4.length; n3++) if (true === t4[n3].reg.test(e4)) return { amount: t4[n3].mult, str: e4.replace(t4[n3].reg, "") };
          return { amount: 1, str: e4 };
        })(e3);
        let n2 = null, r2 = {}, a2 = 0, o2 = false;
        const i2 = (e3 = t3.str).split(/[ -]/);
        for (let e4 = 0; e4 < i2.length; e4++) {
          let s2 = i2[e4];
          if (s2 = Fu(s2), !s2 || "and" === s2) continue;
          if ("-" === s2 || "negative" === s2) {
            o2 = true;
            continue;
          }
          if ("-" === s2.charAt(0) && (o2 = true, s2 = s2.substring(1)), "point" === s2) return a2 += Bu(r2), a2 += Ou(i2.slice(e4 + 1, i2.length)), a2 *= t3.amount, a2;
          const l2 = s2.match(Vu);
          if (l2) {
            const e5 = parseFloat(l2[1].replace(/[, ]/g, "")), t4 = parseFloat(l2[2].replace(/[, ]/g, ""));
            t4 && (a2 += e5 / t4 || 0);
          } else {
            if (Eu.tens.hasOwnProperty(s2) && r2.ones && 1 === Object.keys(r2).length && (a2 = 100 * r2.ones, r2 = {}), false === Gu(s2, r2)) return null;
            if (/^[0-9.]+$/.test(s2)) r2.ones = parseFloat(s2);
            else if (true === Eu.ones.hasOwnProperty(s2)) r2.ones = Eu.ones[s2];
            else if (true === Eu.teens.hasOwnProperty(s2)) r2.teens = Eu.teens[s2];
            else if (true === Eu.tens.hasOwnProperty(s2)) r2.tens = Eu.tens[s2];
            else if (true === Eu.multiples.hasOwnProperty(s2)) {
              let t4 = Eu.multiples[s2];
              if (t4 === n2) return null;
              if (100 === t4 && void 0 !== i2[e4 + 1]) {
                const n3 = i2[e4 + 1];
                Eu.multiples[n3] && (t4 *= Eu.multiples[n3], e4 += 1);
              }
              null === n2 || t4 < n2 ? (a2 += (Bu(r2) || 1) * t4, n2 = t4, r2 = {}) : (a2 += Bu(r2), n2 = t4, a2 = (a2 || 1) * t4, r2 = {});
            }
          }
        }
        return a2 += Bu(r2), a2 *= t3.amount, a2 *= o2 ? -1 : 1, 0 === a2 && 0 === Object.keys(r2).length ? null : a2;
      }, $u = /s$/, Mu = function(e3) {
        let t3 = e3.text("reduced");
        return Su(t3);
      };
      let Ku = { half: 2, halve: 2, quarter: 4 };
      const Lu = function(e3) {
        let t3 = function(e4) {
          let t4 = e4.text("reduced");
          return Ku.hasOwnProperty(t4) ? { numerator: 1, denominator: Ku[t4] } : null;
        }(e3 = e3.clone()) || function(e4) {
          let t4 = e4.text("reduced").match(/^([-+]?[0-9]+)\/([-+]?[0-9]+)(st|nd|rd|th)?s?$/);
          return t4 && t4[1] && t4[0] ? { numerator: Number(t4[1]), denominator: Number(t4[2]) } : null;
        }(e3) || function(e4) {
          let t4 = e4.match("[<num>#Value+] out of every? [<den>#Value+]");
          if (true !== t4.found) return null;
          let { num: n2, den: r2 } = t4.groups();
          return n2 && r2 ? (n2 = Mu(n2), r2 = Mu(r2), n2 && r2 && "number" == typeof n2 && "number" == typeof r2 ? { numerator: n2, denominator: r2 } : null) : null;
        }(e3) || function(e4) {
          let t4 = e4.match("[<num>(#Cardinal|a)+] [<den>#Fraction+]");
          if (true !== t4.found) return null;
          let { num: n2, den: r2 } = t4.groups();
          n2 = n2.has("a") ? 1 : Mu(n2);
          let a2 = r2.text("reduced");
          return $u.test(a2) && (a2 = a2.replace($u, ""), r2 = r2.replaceWith(a2)), r2 = Ku.hasOwnProperty(a2) ? Ku[a2] : Mu(r2), "number" == typeof n2 && "number" == typeof r2 ? { numerator: n2, denominator: r2 } : null;
        }(e3) || function(e4) {
          let t4 = e4.match("^#Ordinal$");
          return true !== t4.found ? null : e4.lookAhead("^of .") ? { numerator: 1, denominator: Mu(t4) } : null;
        }(e3) || null;
        return null !== t3 && t3.numerator && t3.denominator && (t3.decimal = t3.numerator / t3.denominator, t3.decimal = ((e4) => {
          let t4 = Math.round(1e3 * e4) / 1e3;
          return 0 === t4 && 0 !== e4 ? e4 : t4;
        })(t3.decimal)), t3;
      }, Ju = function(e3) {
        if (e3 < 1e6) return String(e3);
        let t3;
        return t3 = "number" == typeof e3 ? e3.toFixed(0) : e3, -1 === t3.indexOf("e+") ? t3 : t3.replace(".", "").split("e+").reduce(function(e4, t4) {
          return e4 + Array(t4 - e4.length + 2).join(0);
        });
      }, Wu = [["ninety", 90], ["eighty", 80], ["seventy", 70], ["sixty", 60], ["fifty", 50], ["forty", 40], ["thirty", 30], ["twenty", 20]], qu = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"], Uu = [[1e24, "septillion"], [1e20, "hundred sextillion"], [1e21, "sextillion"], [1e20, "hundred quintillion"], [1e18, "quintillion"], [1e17, "hundred quadrillion"], [1e15, "quadrillion"], [1e14, "hundred trillion"], [1e12, "trillion"], [1e11, "hundred billion"], [1e9, "billion"], [1e8, "hundred million"], [1e6, "million"], [1e5, "hundred thousand"], [1e3, "thousand"], [100, "hundred"], [1, "one"]], Ru = function(e3) {
        let t3 = [];
        if (e3 > 100) return t3;
        for (let n2 = 0; n2 < Wu.length; n2++) e3 >= Wu[n2][1] && (e3 -= Wu[n2][1], t3.push(Wu[n2][0]));
        return qu[e3] && t3.push(qu[e3]), t3;
      }, Qu = function(e3) {
        let t3 = e3.num;
        if (0 === t3 || "0" === t3) return "zero";
        t3 > 1e21 && (t3 = Ju(t3));
        let n2 = [];
        t3 < 0 && (n2.push("minus"), t3 = Math.abs(t3));
        let r2 = function(e4) {
          let t4 = e4, n3 = [];
          return Uu.forEach((r3) => {
            if (e4 >= r3[0]) {
              let e5 = Math.floor(t4 / r3[0]);
              t4 -= e5 * r3[0], e5 && n3.push({ unit: r3[1], count: e5 });
            }
          }), n3;
        }(t3);
        for (let e4 = 0; e4 < r2.length; e4++) {
          let t4 = r2[e4].unit;
          "one" === t4 && (t4 = "", n2.length > 1 && n2.push("and")), n2 = n2.concat(Ru(r2[e4].count)), n2.push(t4);
        }
        return n2 = n2.concat(((e4) => {
          const t4 = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
          let n3 = [], r3 = Ju(e4).match(/\.([0-9]+)/);
          if (!r3 || !r3[0]) return n3;
          n3.push("point");
          let a2 = r3[0].split("");
          for (let e5 = 0; e5 < a2.length; e5++) n3.push(t4[a2[e5]]);
          return n3;
        })(t3)), n2 = n2.filter((e4) => e4), 0 === n2.length && (n2[0] = ""), n2.join(" ");
      }, Zu = { one: "first", two: "second", three: "third", five: "fifth", eight: "eighth", nine: "ninth", twelve: "twelfth", twenty: "twentieth", thirty: "thirtieth", forty: "fortieth", fourty: "fourtieth", fifty: "fiftieth", sixty: "sixtieth", seventy: "seventieth", eighty: "eightieth", ninety: "ninetieth" }, _u = (e3) => {
        let t3 = Qu(e3).split(" "), n2 = t3[t3.length - 1];
        return Zu.hasOwnProperty(n2) ? t3[t3.length - 1] = Zu[n2] : t3[t3.length - 1] = n2.replace(/y$/, "i") + "th", t3.join(" ");
      }, Xu = function(e3) {
        class Fractions extends e3 {
          constructor(e4, t3, n2) {
            super(e4, t3, n2), this.viewType = "Fractions";
          }
          parse(e4) {
            return this.getNth(e4).map(Lu);
          }
          get(e4) {
            return this.getNth(e4).map(Lu);
          }
          json(e4) {
            return this.getNth(e4).map((t3) => {
              let n2 = t3.toView().json(e4)[0], r2 = Lu(t3);
              return n2.fraction = r2, n2;
            }, []);
          }
          toDecimal(e4) {
            return this.getNth(e4).forEach((e5) => {
              let { decimal: t3 } = Lu(e5);
              (e5 = e5.replaceWith(String(t3), true)).tag("NumericValue"), e5.unTag("Fraction");
            }), this;
          }
          toFraction(e4) {
            return this.getNth(e4).forEach((e5) => {
              let t3 = Lu(e5);
              if (t3 && "number" == typeof t3.numerator && "number" == typeof t3.denominator) {
                let n2 = `${t3.numerator}/${t3.denominator}`;
                this.replace(e5, n2);
              }
            }), this;
          }
          toOrdinal(e4) {
            return this.getNth(e4).forEach((e5) => {
              let t3 = function(e6) {
                if (!e6.numerator || !e6.denominator) return "";
                let t4 = Qu({ num: e6.numerator }), n2 = _u({ num: e6.denominator });
                return 2 === e6.denominator && (n2 = "half"), t4 && n2 ? (1 !== e6.numerator && (n2 += "s"), `${t4} ${n2}`) : "";
              }(Lu(e5));
              e5.after("^#Noun").found && (t3 += " of"), e5.replaceWith(t3);
            }), this;
          }
          toCardinal(e4) {
            return this.getNth(e4).forEach((e5) => {
              let t3 = function(e6) {
                return e6.numerator && e6.denominator ? `${Qu({ num: e6.numerator })} out of ${Qu({ num: e6.denominator })}` : "";
              }(Lu(e5));
              e5.replaceWith(t3);
            }), this;
          }
          toPercentage(e4) {
            return this.getNth(e4).forEach((e5) => {
              let { decimal: t3 } = Lu(e5), n2 = 100 * t3;
              n2 = Math.round(100 * n2) / 100, e5.replaceWith(`${n2}%`);
            }), this;
          }
        }
        e3.prototype.fractions = function(e4) {
          let t3 = function(e5, t4) {
            let n2 = e5.match("#Fraction+");
            return n2 = n2.filter((e6) => !e6.lookBehind("#Value and$").found), n2 = n2.notIf("#Value seconds"), n2;
          }(this);
          return t3 = t3.getNth(e4), new Fractions(this.document, t3.pointer);
        };
      }, Yu = "twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|fourty", ec = function(e3) {
        let t3 = e3.match("#Value+");
        if (t3.has("#NumericValue #NumericValue") && (t3.has("#Value @hasComma #Value") ? t3.splitAfter("@hasComma") : t3.has("#NumericValue #Fraction") ? t3.splitAfter("#NumericValue #Fraction") : t3 = t3.splitAfter("#NumericValue")), t3.has("#Value #Value #Value") && !t3.has("#Multiple") && t3.has("(" + Yu + ") #Cardinal #Cardinal") && (t3 = t3.splitAfter("(" + Yu + ") #Cardinal")), t3.has("#Value #Value")) {
          t3.has("#NumericValue #NumericValue") && (t3 = t3.splitOn("#Year")), t3.has("(" + Yu + ") (eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen)") && (t3 = t3.splitAfter("(" + Yu + ")"));
          let e4 = t3.match("#Cardinal #Cardinal");
          if (e4.found && !t3.has("(point|decimal|#Fraction)") && !e4.has("#Cardinal (#Multiple|point|decimal)")) {
            let n2 = t3.has(`(one|two|three|four|five|six|seven|eight|nine) (${Yu})`), r2 = e4.has("(" + Yu + ") #Cardinal"), a2 = e4.has("#Multiple #Value");
            n2 || r2 || a2 || e4.terms().forEach((e5) => {
              t3 = t3.splitOn(e5);
            });
          }
          t3.match("#Ordinal #Ordinal").match("#TextValue").found && !t3.has("#Multiple") && (t3.has("(" + Yu + ") #Ordinal") || (t3 = t3.splitAfter("#Ordinal"))), t3 = t3.splitBefore("#Ordinal [#Cardinal]", 0), t3.has("#TextValue #NumericValue") && !t3.has("(" + Yu + "|#Multiple)") && (t3 = t3.splitBefore("#TextValue #NumericValue"));
        }
        return t3 = t3.splitAfter("#NumberRange"), t3 = t3.splitBefore("#Year"), t3;
      }, tc = function(e3) {
        if ("string" == typeof e3) return { num: Su(e3) };
        let t3 = e3.text("reduced"), n2 = e3.growRight("#Unit").match("#Unit$").text("machine"), r2 = /[0-9],[0-9]/.test(e3.text("text"));
        if (1 === e3.terms().length && !e3.has("#Multiple")) {
          let a3 = function(e4, t4) {
            let n3 = (e4 = e4.replace(/,/g, "")).split(/([0-9.,]*)/), [r3, a4] = n3, o3 = n3.slice(2).join("");
            return "" !== a4 && t4.length < 2 ? (a4 = Number(a4 || e4), "number" != typeof a4 && (a4 = null), o3 = o3 || "", "st" !== o3 && "nd" !== o3 && "rd" !== o3 && "th" !== o3 || (o3 = ""), { prefix: r3 || "", num: a4, suffix: o3 }) : null;
          }(t3, e3);
          if (null !== a3) return a3.hasComma = r2, a3.unit = n2, a3;
        }
        let a2 = e3.match("#Fraction{2,}$");
        a2 = false === a2.found ? e3.match("^#Fraction$") : a2;
        let o2 = null;
        a2.found && (a2.has("#Value and #Value #Fraction") && (a2 = a2.match("and #Value #Fraction")), o2 = Lu(a2), t3 = (e3 = (e3 = e3.not(a2)).not("and$")).text("reduced"));
        let i2 = 0;
        return t3 && (i2 = Su(t3) || 0), o2 && o2.decimal && (i2 += o2.decimal), { hasComma: r2, prefix: "", num: i2, suffix: "", isOrdinal: e3.has("#Ordinal"), isText: e3.has("#TextValue"), isFraction: e3.has("#Fraction"), isMoney: e3.has("#Money"), unit: n2 };
      }, nc = { "\xA2": "cents", $: "dollars", "\xA3": "pounds", "\xA5": "yen", "\u20AC": "euros", "\u20A1": "col\xF3n", "\u0E3F": "baht", "\u20AD": "kip", "\u20A9": "won", "\u20B9": "rupees", "\u20BD": "ruble", "\u20BA": "liras" }, rc = { "%": "percent", "\xB0": "degrees" }, ac = function(e3) {
        let t3 = { suffix: "", prefix: e3.prefix };
        return nc.hasOwnProperty(e3.prefix) && (t3.suffix += " " + nc[e3.prefix], t3.prefix = ""), rc.hasOwnProperty(e3.suffix) && (t3.suffix += " " + rc[e3.suffix]), t3.suffix && 1 === e3.num && (t3.suffix = t3.suffix.replace(/s$/, "")), !t3.suffix && e3.suffix && (t3.suffix += " " + e3.suffix), t3;
      }, oc = function(e3, t3) {
        if ("TextOrdinal" === t3) {
          let { prefix: t4, suffix: n3 } = ac(e3);
          return t4 + _u(e3) + n3;
        }
        if ("Ordinal" === t3) return e3.prefix + function(e4) {
          let t4 = e4.num;
          if (!t4 && 0 !== t4) return null;
          let n3 = t4 % 100;
          if (n3 > 10 && n3 < 20) return String(t4) + "th";
          const r2 = { 0: "th", 1: "st", 2: "nd", 3: "rd" };
          let a2 = Ju(t4), o2 = a2.slice(a2.length - 1, a2.length);
          return a2 += r2[o2] ? r2[o2] : "th", a2;
        }(e3) + e3.suffix;
        if ("TextCardinal" === t3) {
          let { prefix: t4, suffix: n3 } = ac(e3);
          return t4 + Qu(e3) + n3;
        }
        let n2 = e3.num;
        return e3.hasComma && (n2 = n2.toLocaleString()), e3.prefix + String(n2) + e3.suffix;
      }, ic = function(e3) {
        if ("string" == typeof e3 || "number" == typeof e3) {
          let t4 = {};
          return t4[e3] = true, t4;
        }
        return t3 = e3, "[object Array]" === Object.prototype.toString.call(t3) ? e3.reduce((e4, t4) => (e4[t4] = true, e4), {}) : e3 || {};
        var t3;
      }, sc = function(e3) {
        class Numbers extends e3 {
          constructor(e4, t3, n2) {
            super(e4, t3, n2), this.viewType = "Numbers";
          }
          parse(e4) {
            return this.getNth(e4).map(tc);
          }
          get(e4) {
            return this.getNth(e4).map(tc).map((e5) => e5.num);
          }
          json(e4) {
            let t3 = "object" == typeof e4 ? e4 : {};
            return this.getNth(e4).map((e5) => {
              let n2 = e5.toView().json(t3)[0], r2 = tc(e5);
              return n2.number = { prefix: r2.prefix, num: r2.num, suffix: r2.suffix, hasComma: r2.hasComma, unit: r2.unit }, n2;
            }, []);
          }
          units() {
            return this.growRight("#Unit").match("#Unit$");
          }
          isUnit(e4) {
            return function(e5, t3 = {}) {
              return t3 = ic(t3), e5.filter((e6) => {
                let { unit: n2 } = tc(e6);
                return !(!n2 || true !== t3[n2]);
              });
            }(this, e4);
          }
          isOrdinal() {
            return this.if("#Ordinal");
          }
          isCardinal() {
            return this.if("#Cardinal");
          }
          toNumber() {
            let e4 = this.map((e5) => {
              if (!this.has("#TextValue")) return e5;
              let t3 = tc(e5);
              if (null === t3.num) return e5;
              let n2 = e5.has("#Ordinal") ? "Ordinal" : "Cardinal", r2 = oc(t3, n2);
              return e5.replaceWith(r2, { tags: true }), e5.tag("NumericValue");
            });
            return new Numbers(e4.document, e4.pointer);
          }
          toLocaleString() {
            return this.forEach((e4) => {
              let t3 = tc(e4);
              if (null === t3.num) return;
              let n2 = t3.num.toLocaleString();
              if (e4.has("#Ordinal")) {
                let e5 = oc(t3, "Ordinal").match(/[a-z]+$/);
                e5 && (n2 += e5[0] || "");
              }
              e4.replaceWith(n2, { tags: true });
            }), this;
          }
          toText() {
            let e4 = this.map((e5) => {
              if (e5.has("#TextValue")) return e5;
              let t3 = tc(e5);
              if (null === t3.num) return e5;
              let n2 = e5.has("#Ordinal") ? "TextOrdinal" : "TextCardinal", r2 = oc(t3, n2);
              return e5.replaceWith(r2, { tags: true }), e5.tag("TextValue"), e5;
            });
            return new Numbers(e4.document, e4.pointer);
          }
          toCardinal() {
            let e4 = this.map((e5) => {
              if (!e5.has("#Ordinal")) return e5;
              let t3 = tc(e5);
              if (null === t3.num) return e5;
              let n2 = e5.has("#TextValue") ? "TextCardinal" : "Cardinal", r2 = oc(t3, n2);
              return e5.replaceWith(r2, { tags: true }), e5.tag("Cardinal"), e5;
            });
            return new Numbers(e4.document, e4.pointer);
          }
          toOrdinal() {
            let e4 = this.map((e5) => {
              if (e5.has("#Ordinal")) return e5;
              let t3 = tc(e5);
              if (null === t3.num) return e5;
              let n2 = e5.has("#TextValue") ? "TextOrdinal" : "Ordinal", r2 = oc(t3, n2);
              return e5.replaceWith(r2, { tags: true }), e5.tag("Ordinal"), e5;
            });
            return new Numbers(e4.document, e4.pointer);
          }
          isEqual(e4) {
            return this.filter((t3) => tc(t3).num === e4);
          }
          greaterThan(e4) {
            return this.filter((t3) => tc(t3).num > e4);
          }
          lessThan(e4) {
            return this.filter((t3) => tc(t3).num < e4);
          }
          between(e4, t3) {
            return this.filter((n2) => {
              let r2 = tc(n2).num;
              return r2 > e4 && r2 < t3;
            });
          }
          set(e4) {
            if (void 0 === e4) return this;
            "string" == typeof e4 && (e4 = tc(e4).num);
            let t3 = this.map((t4) => {
              let n2 = tc(t4);
              if (n2.num = e4, null === n2.num) return t4;
              let r2 = t4.has("#Ordinal") ? "Ordinal" : "Cardinal";
              t4.has("#TextValue") && (r2 = t4.has("#Ordinal") ? "TextOrdinal" : "TextCardinal");
              let a2 = oc(n2, r2);
              return n2.hasComma && "Cardinal" === r2 && (a2 = Number(a2).toLocaleString()), (t4 = t4.not("#Currency")).replaceWith(a2, { tags: true }), t4;
            });
            return new Numbers(t3.document, t3.pointer);
          }
          add(e4) {
            if (!e4) return this;
            "string" == typeof e4 && (e4 = tc(e4).num);
            let t3 = this.map((t4) => {
              let n2 = tc(t4);
              if (null === n2.num) return t4;
              n2.num += e4;
              let r2 = t4.has("#Ordinal") ? "Ordinal" : "Cardinal";
              n2.isText && (r2 = t4.has("#Ordinal") ? "TextOrdinal" : "TextCardinal");
              let a2 = oc(n2, r2);
              return t4.replaceWith(a2, { tags: true }), t4;
            });
            return new Numbers(t3.document, t3.pointer);
          }
          subtract(e4, t3) {
            return this.add(-1 * e4, t3);
          }
          increment(e4) {
            return this.add(1, e4);
          }
          decrement(e4) {
            return this.add(-1, e4);
          }
          update(e4) {
            let t3 = new Numbers(this.document, e4);
            return t3._cache = this._cache, t3;
          }
        }
        Numbers.prototype.toNice = Numbers.prototype.toLocaleString, Numbers.prototype.isBetween = Numbers.prototype.between, Numbers.prototype.minus = Numbers.prototype.subtract, Numbers.prototype.plus = Numbers.prototype.add, Numbers.prototype.equals = Numbers.prototype.isEqual, e3.prototype.numbers = function(e4) {
          let t3 = ec(this);
          return t3 = t3.getNth(e4), new Numbers(this.document, t3.pointer);
        }, e3.prototype.percentages = function(e4) {
          let t3 = ec(this);
          return t3 = t3.filter((e5) => e5.has("#Percent") || e5.after("^percent")), t3 = t3.getNth(e4), new Numbers(this.document, t3.pointer);
        }, e3.prototype.money = function(e4) {
          let t3 = ec(this);
          return t3 = t3.filter((e5) => e5.has("#Money") || e5.after("^#Currency")), t3 = t3.getNth(e4), new Numbers(this.document, t3.pointer);
        }, e3.prototype.values = e3.prototype.numbers;
      };
      var lc = { api: function(e3) {
        Xu(e3), sc(e3);
      } };
      const uc = { people: true, emails: true, phoneNumbers: true, places: true }, cc = function(e3 = {}) {
        return false !== (e3 = Object.assign({}, uc, e3)).people && this.people().replaceWith("\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588"), false !== e3.emails && this.emails().replaceWith("\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588"), false !== e3.places && this.places().replaceWith("\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588"), false !== e3.phoneNumbers && this.phoneNumbers().replaceWith("\u2588\u2588\u2588\u2588\u2588\u2588\u2588"), this;
      }, hc = { api: function(e3) {
        e3.prototype.redact = cc;
      } }, dc = function(e3) {
        let t3 = null;
        return e3.has("#PastTense") ? t3 = "PastTense" : e3.has("#FutureTense") ? t3 = "FutureTense" : e3.has("#PresentTense") && (t3 = "PresentTense"), { tense: t3 };
      }, gc = function(e3) {
        let t3 = function(e4) {
          let t4 = e4;
          return 1 === t4.length ? t4 : (t4 = t4.if("#Verb"), 1 === t4.length ? t4 : (t4 = t4.ifNo("(after|although|as|because|before|if|since|than|that|though|when|whenever|where|whereas|wherever|whether|while|why|unless|until|once)"), t4 = t4.ifNo("^even (if|though)"), t4 = t4.ifNo("^so that"), t4 = t4.ifNo("^rather than"), t4 = t4.ifNo("^provided that"), 1 === t4.length ? t4 : (t4 = t4.ifNo("(that|which|whichever|who|whoever|whom|whose|whomever)"), 1 === t4.length ? t4 : (t4 = t4.ifNo("(^despite|^during|^before|^through|^throughout)"), 1 === t4.length ? t4 : (t4 = t4.ifNo("^#Gerund"), 1 === t4.length ? t4 : (0 === t4.length && (t4 = e4), t4.eq(0)))))));
        }(e3.clauses()), n2 = t3.chunks(), r2 = e3.none(), a2 = e3.none(), o2 = e3.none();
        return n2.forEach((e4, t4) => {
          0 !== t4 || e4.has("<Verb>") ? a2.found || !e4.has("<Verb>") ? a2.found && (o2 = o2.concat(e4)) : a2 = e4 : r2 = e4;
        }), a2.found && !r2.found && (r2 = a2.before("<Noun>+").first()), { subj: r2, verb: a2, pred: o2, grammar: dc(a2) };
      };
      var mc = { api: function(e3) {
        class Sentences extends e3 {
          constructor(e4, t4, n2) {
            super(e4, t4, n2), this.viewType = "Sentences";
          }
          json(e4 = {}) {
            return this.map((t4) => {
              let n2 = t4.toView().json(e4)[0] || {}, { subj: r2, verb: a2, pred: o2, grammar: i2 } = gc(t4);
              return n2.sentence = { subject: r2.text("normal"), verb: a2.text("normal"), predicate: o2.text("normal"), grammar: i2 }, n2;
            }, []);
          }
          toPastTense(e4) {
            return this.getNth(e4).map((e5) => (gc(e5), function(e6) {
              let t4 = e6.verbs(), n2 = t4.eq(0);
              if (n2.has("#PastTense")) return e6;
              if (n2.toPastTense(), t4.length > 1) {
                t4 = t4.slice(1), t4 = t4.filter((e7) => !e7.lookBehind("to$").found), t4 = t4.if("#PresentTense"), t4 = t4.notIf("#Gerund");
                let n3 = e6.match("to #Verb+ #Conjunction #Verb").terms();
                t4 = t4.not(n3), t4.found && t4.verbs().toPastTense();
              }
              return e6;
            }(e5)));
          }
          toPresentTense(e4) {
            return this.getNth(e4).map((e5) => (gc(e5), function(e6) {
              let t4 = e6.verbs();
              return t4.eq(0).toPresentTense(), t4.length > 1 && (t4 = t4.slice(1), t4 = t4.filter((e7) => !e7.lookBehind("to$").found), t4 = t4.notIf("#Gerund"), t4.found && t4.verbs().toPresentTense()), e6;
            }(e5)));
          }
          toFutureTense(e4) {
            return this.getNth(e4).map((e5) => (gc(e5), e5 = function(e6) {
              let t4 = e6.verbs();
              if (t4.eq(0).toFutureTense(), t4 = (e6 = e6.fullSentence()).verbs(), t4.length > 1) {
                t4 = t4.slice(1);
                let e7 = t4.filter((e8) => !(e8.lookBehind("to$").found || !e8.has("#Copula #Gerund") && (e8.has("#Gerund") || !e8.has("#Copula") && e8.has("#PresentTense") && !e8.has("#Infinitive") && e8.lookBefore("(he|she|it|that|which)$").found)));
                e7.found && e7.forEach((e8) => {
                  if (e8.has("#Copula")) return e8.match("was").replaceWith("is"), void e8.match("is").replaceWith("will be");
                  e8.toInfinitive();
                });
              }
              return e6;
            }(e5), e5));
          }
          toInfinitive(e4) {
            return this.getNth(e4).map((e5) => (gc(e5), function(e6) {
              return e6.verbs().toInfinitive(), e6;
            }(e5)));
          }
          toNegative(e4) {
            return this.getNth(e4).map((e5) => (gc(e5), function(e6) {
              return e6.verbs().first().toNegative().compute("chunks"), e6;
            }(e5)));
          }
          toPositive(e4) {
            return this.getNth(e4).map((e5) => (gc(e5), function(e6) {
              return e6.verbs().first().toPositive().compute("chunks"), e6;
            }(e5)));
          }
          isQuestion(e4) {
            return this.questions(e4);
          }
          isExclamation(e4) {
            let t4 = this.filter((e5) => e5.lastTerm().has("@hasExclamation"));
            return t4.getNth(e4);
          }
          isStatement(e4) {
            let t4 = this.filter((e5) => !e5.isExclamation().found && !e5.isQuestion().found);
            return t4.getNth(e4);
          }
          update(e4) {
            let t4 = new Sentences(this.document, e4);
            return t4._cache = this._cache, t4;
          }
        }
        Sentences.prototype.toPresent = Sentences.prototype.toPresentTense, Sentences.prototype.toPast = Sentences.prototype.toPastTense, Sentences.prototype.toFuture = Sentences.prototype.toFutureTense;
        const t3 = { sentences: function(e4) {
          let t4 = this.map((e5) => e5.fullSentence());
          return t4 = t4.getNth(e4), new Sentences(this.document, t4.pointer);
        }, questions: function(e4) {
          let t4 = function(e5) {
            const t5 = /\?/, { document: n2 } = e5;
            return e5.filter((e6) => {
              let r2 = e6.docs[0] || [], a2 = r2[r2.length - 1];
              return !(!a2 || n2[a2.index[0]].length !== r2.length) && (!!t5.test(a2.post) || function(e7) {
                let t6 = e7.clauses();
                return !(/\.\.$/.test(e7.out("text")) || e7.has("^#QuestionWord") && e7.has("@hasComma") || !e7.has("or not$") && !e7.has("^#QuestionWord") && !e7.has("^(do|does|did|is|was|can|could|will|would|may) #Noun") && !e7.has("^(have|must) you") && !t6.has("(do|does|is|was) #Noun+ #Adverb? (#Adjective|#Infinitive)$"));
              }(e6));
            });
          }(this);
          return t4.getNth(e4);
        } };
        Object.assign(e3.prototype, t3);
      } };
      const pc = function(e3) {
        let t3 = {};
        t3.firstName = e3.match("#FirstName+"), t3.lastName = e3.match("#LastName+"), t3.honorific = e3.match("#Honorific+");
        let n2 = t3.lastName, r2 = t3.firstName;
        return r2.found && n2.found || r2.found || n2.found || !e3.has("^#Honorific .$") || (t3.lastName = e3.match(".$")), t3;
      }, fc = "male", bc = "female", vc = { mr: fc, mrs: bc, miss: bc, madam: bc, king: fc, queen: bc, duke: fc, duchess: bc, baron: fc, baroness: bc, count: fc, countess: bc, prince: fc, princess: bc, sire: fc, dame: bc, lady: bc, ayatullah: fc, congressman: fc, congresswoman: bc, "first lady": bc, mx: null }, yc = function(e3, t3) {
        let { firstName: n2, honorific: r2 } = e3;
        if (n2.has("#FemaleName")) return bc;
        if (n2.has("#MaleName")) return fc;
        if (r2.found) {
          let e4 = r2.text("normal");
          if (e4 = e4.replace(/\./g, ""), vc.hasOwnProperty(e4)) return vc[e4];
          if (/^her /.test(e4)) return bc;
          if (/^his /.test(e4)) return fc;
        }
        let a2 = t3.after();
        if (!a2.has("#Person") && a2.has("#Pronoun")) {
          let e4 = a2.match("#Pronoun");
          if (e4.has("(they|their)")) return null;
          let t4 = e4.has("(he|his)"), n3 = e4.has("(she|her|hers)");
          if (t4 && !n3) return fc;
          if (n3 && !t4) return bc;
        }
        return null;
      }, wc = function(e3) {
        let t3 = this.clauses(), n2 = t3.people();
        return n2 = n2.concat(t3.places()), n2 = n2.concat(t3.organizations()), n2 = n2.not("(someone|man|woman|mother|brother|sister|father)"), n2 = n2.sort("seq"), n2 = n2.getNth(e3), n2;
      };
      var kc = { api: function(e3) {
        !function(e4) {
          class People extends e4 {
            constructor(e5, t3, n2) {
              super(e5, t3, n2), this.viewType = "People";
            }
            parse(e5) {
              return this.getNth(e5).map(pc);
            }
            json(e5) {
              let t3 = "object" == typeof e5 ? e5 : {};
              return this.getNth(e5).map((e6) => {
                let n2 = e6.toView().json(t3)[0], r2 = pc(e6);
                return n2.person = { firstName: r2.firstName.text("normal"), lastName: r2.lastName.text("normal"), honorific: r2.honorific.text("normal"), presumed_gender: yc(r2, e6) }, n2;
              }, []);
            }
            presumedMale() {
              return this.filter((e5) => e5.has("(#MaleName|mr|mister|sr|jr|king|pope|prince|sir)"));
            }
            presumedFemale() {
              return this.filter((e5) => e5.has("(#FemaleName|mrs|miss|queen|princess|madam)"));
            }
            update(e5) {
              let t3 = new People(this.document, e5);
              return t3._cache = this._cache, t3;
            }
          }
          e4.prototype.people = function(e5) {
            let t3 = function(e6) {
              let t4 = e6.splitAfter("@hasComma");
              t4 = t4.match("#Honorific+? #Person+");
              let n2 = t4.match("#Possessive").notIf("(his|her)");
              return t4 = t4.splitAfter(n2), t4;
            }(this);
            return t3 = t3.getNth(e5), new People(this.document, t3.pointer);
          };
        }(e3), function(e4) {
          e4.prototype.places = function(t3) {
            let n2 = function(e5) {
              let t4 = e5.match("(#Place|#Address)+"), n3 = t4.match("@hasComma");
              return n3 = n3.filter((e6) => !!e6.has("(asia|africa|europe|america)$") || !e6.has("(#City|#Region|#ProperNoun)$") || !e6.after("^(#Country|#Region)").found), t4 = t4.splitAfter(n3), t4;
            }(this);
            return n2 = n2.getNth(t3), new e4(this.document, n2.pointer);
          };
        }(e3), function(e4) {
          e4.prototype.organizations = function(e5) {
            return this.match("#Organization+").getNth(e5);
          };
        }(e3), function(e4) {
          e4.prototype.topics = wc;
        }(e3);
      } };
      const Pc = function(e3, t3) {
        let n2 = { pre: e3.none(), post: e3.none() };
        if (!e3.has("#Adverb")) return n2;
        let r2 = e3.splitOn(t3);
        return 3 === r2.length ? { pre: r2.eq(0).adverbs(), post: r2.eq(2).adverbs() } : r2.eq(0).isDoc(t3) ? (n2.post = r2.eq(1).adverbs(), n2) : (n2.pre = r2.eq(0).adverbs(), n2);
      }, Ac = function(e3, t3) {
        let n2 = e3.splitBefore(t3);
        if (n2.length <= 1) return e3.none();
        let r2 = n2.eq(0);
        return r2 = r2.not("(#Adverb|#Negative|#Prefix)"), r2;
      }, Cc = function(e3) {
        return e3.match("#Negative");
      }, Nc = function(e3) {
        if (!e3.has("(#Particle|#PhrasalVerb)")) return { verb: e3.none(), particle: e3.none() };
        let t3 = e3.match("#Particle$");
        return { verb: e3.not(t3), particle: t3 };
      }, jc = function(e3) {
        let t3 = e3.clone();
        t3.contractions().expand();
        const n2 = function(e4) {
          let t4 = e4;
          return e4.wordCount() > 1 && (t4 = e4.not("(#Negative|#Auxiliary|#Modal|#Adverb|#Prefix)")), t4.length > 1 && !t4.has("#Phrasal #Particle") && (t4 = t4.last()), t4 = t4.not("(want|wants|wanted) to"), t4.found || (t4 = e4.not("#Negative")), t4;
        }(t3);
        return { root: n2, prefix: t3.match("#Prefix"), adverbs: Pc(t3, n2), auxiliary: Ac(t3, n2), negative: Cc(t3), phrasal: Nc(n2) };
      }, xc = { tense: "PresentTense" }, Ic = { conditional: true }, Tc = { tense: "FutureTense" }, Dc = { progressive: true }, Hc = { tense: "PastTense" }, Ec = { complete: true, progressive: false }, Gc = { passive: true }, Oc = function(e3) {
        let t3 = {};
        return e3.forEach((e4) => {
          Object.assign(t3, e4);
        }), t3;
      }, Fc = { imperative: [["#Imperative", []]], "want-infinitive": [["^(want|wants|wanted) to #Infinitive$", [xc]], ["^wanted to #Infinitive$", [Hc]], ["^will want to #Infinitive$", [Tc]]], "gerund-phrase": [["^#PastTense #Gerund$", [Hc]], ["^#PresentTense #Gerund$", [xc]], ["^#Infinitive #Gerund$", [xc]], ["^will #Infinitive #Gerund$", [Tc]], ["^have #PastTense #Gerund$", [Hc]], ["^will have #PastTense #Gerund$", [Hc]]], "simple-present": [["^#PresentTense$", [xc]], ["^#Infinitive$", [xc]]], "simple-past": [["^#PastTense$", [Hc]]], "simple-future": [["^will #Adverb? #Infinitive", [Tc]]], "present-progressive": [["^(is|are|am) #Gerund$", [xc, Dc]]], "past-progressive": [["^(was|were) #Gerund$", [Hc, Dc]]], "future-progressive": [["^will be #Gerund$", [Tc, Dc]]], "present-perfect": [["^(has|have) #PastTense$", [Hc, Ec]]], "past-perfect": [["^had #PastTense$", [Hc, Ec]], ["^had #PastTense to #Infinitive", [Hc, Ec]]], "future-perfect": [["^will have #PastTense$", [Tc, Ec]]], "present-perfect-progressive": [["^(has|have) been #Gerund$", [Hc, Dc]]], "past-perfect-progressive": [["^had been #Gerund$", [Hc, Dc]]], "future-perfect-progressive": [["^will have been #Gerund$", [Tc, Dc]]], "passive-past": [["(got|were|was) #Passive", [Hc, Gc]], ["^(was|were) being #Passive", [Hc, Gc]], ["^(had|have) been #Passive", [Hc, Gc]]], "passive-present": [["^(is|are|am) #Passive", [xc, Gc]], ["^(is|are|am) being #Passive", [xc, Gc]], ["^has been #Passive", [xc, Gc]]], "passive-future": [["will have been #Passive", [Tc, Gc, Ic]], ["will be being? #Passive", [Tc, Gc, Ic]]], "present-conditional": [["would be #PastTense", [xc, Ic]]], "past-conditional": [["would have been #PastTense", [Hc, Ic]]], "auxiliary-future": [["(is|are|am|was) going to (#Infinitive|#PresentTense)", [Tc]]], "auxiliary-past": [["^did #Infinitive$", [Hc, { plural: false }]], ["^used to #Infinitive$", [Hc, Ec]]], "auxiliary-present": [["^(does|do) #Infinitive$", [xc, Ec, { plural: true }]]], "modal-past": [["^(could|must|should|shall) have #PastTense$", [Hc]]], "modal-infinitive": [["^#Modal #Infinitive$", []]], infinitive: [["^#Infinitive$", []]] };
      let Vc = [];
      Object.keys(Fc).map((e3) => {
        Fc[e3].forEach((t3) => {
          Vc.push({ name: e3, match: t3[0], data: Oc(t3[1]) });
        });
      });
      const zc = function(e3, t3) {
        let n2 = {};
        e3 = function(e4, t4) {
          return e4 = e4.clone(), t4.adverbs.post && t4.adverbs.post.found && e4.remove(t4.adverbs.post), t4.adverbs.pre && t4.adverbs.pre.found && e4.remove(t4.adverbs.pre), e4.has("#Negative") && (e4 = e4.remove("#Negative")), e4.has("#Prefix") && (e4 = e4.remove("#Prefix")), t4.root.has("#PhrasalVerb #Particle") && e4.remove("#Particle$"), e4.not("#Adverb");
        }(e3, t3);
        for (let t4 = 0; t4 < Vc.length; t4 += 1) {
          let r2 = Vc[t4];
          if (true === e3.has(r2.match)) {
            n2.form = r2.name, Object.assign(n2, r2.data);
            break;
          }
        }
        return n2.form || e3.has("^#Verb$") && (n2.form = "infinitive"), n2.tense || (n2.tense = t3.root.has("#PastTense") ? "PastTense" : "PresentTense"), n2.copula = t3.root.has("#Copula"), n2.isInfinitive = function(e4) {
          return !(!e4.has("#Infinitive") || !e4.growLeft("to").has("^to #Infinitive"));
        }(e3), n2;
      }, Bc = function(e3) {
        return !(e3.length <= 1) && (e3.parse()[0] || {}).isSubordinate;
      }, Sc = function(e3, t3) {
        return !!t3.has("(are|were|does)") || !!e3.has("(those|they|we)") || !(!e3.found || !e3.isPlural) && e3.isPlural().found;
      }, $c = function(e3) {
        let t3 = function(e4) {
          let t4 = e4.before();
          t4 = function(e5) {
            let t5 = e5.clauses();
            return t5 = t5.filter((e6, t6) => !(e6.has("^(if|unless|while|but|for|per|at|by|that|which|who|from)") || t6 > 0 && e6.has("^#Verb . #Noun+$") || t6 > 0 && e6.has("^#Adverb"))), 0 === t5.length ? e5 : t5;
          }(t4);
          let n2 = t4.nouns(), r2 = n2.last(), a2 = r2.match("(i|he|she|we|you|they)");
          if (a2.found) return a2.nouns();
          let o2 = n2.if("^(that|this|those)");
          return o2.found || false === n2.found && (o2 = t4.match("^(that|this|those)"), o2.found) ? o2 : (r2 = n2.last(), Bc(r2) && (n2.remove(r2), r2 = n2.last()), Bc(r2) && (n2.remove(r2), r2 = n2.last()), r2);
        }(e3);
        return { subject: t3, plural: Sc(t3, e3) };
      }, Mc = (e3) => e3, Kc = (e3, t3) => {
        let n2 = $c(e3), r2 = n2.subject;
        return !(!r2.has("i") && !r2.has("we")) || n2.plural;
      }, Lc = function(e3, t3) {
        if (e3.has("were")) return "are";
        let { subject: n2, plural: r2 } = $c(e3);
        return n2.has("i") ? "am" : n2.has("we") || r2 ? "are" : "is";
      }, Jc = function(e3, t3) {
        let n2 = $c(e3), r2 = n2.subject;
        return r2.has("i") || r2.has("we") || n2.plural ? "do" : "does";
      }, Wc = function(e3) {
        return e3.has("#Infinitive") ? "Infinitive" : e3.has("#Participle") ? "Participle" : e3.has("#PastTense") ? "PastTense" : e3.has("#Gerund") ? "Gerund" : e3.has("#PresentTense") ? "PresentTense" : void 0;
      }, qc = function(e3, t3) {
        const { toInfinitive: n2 } = e3.methods.two.transform.verb;
        let r2 = t3.root.text({ keepPunct: false });
        return r2 = n2(r2, e3.model, Wc(e3)), r2 && e3.replace(t3.root, r2), e3;
      }, Uc = (e3) => e3.has("will not") ? e3.replace("will not", "have not") : e3.remove("will"), Rc = function(e3) {
        return e3 && e3.isView ? e3.json({ normal: true, terms: false, text: false }).map((e4) => e4.normal) : [];
      }, Qc = function(e3) {
        return e3 && e3.isView ? e3.text("normal") : "";
      }, Zc = function(e3) {
        const { toInfinitive: t3 } = e3.methods.two.transform.verb;
        return t3(e3.text("normal"), e3.model, Wc(e3));
      }, _c = { tags: true }, Xc = { tags: true }, Yc = { noAux: (e3, t3) => (t3.auxiliary.found && (e3 = e3.remove(t3.auxiliary)), e3), simple: (e3, t3) => {
        const { conjugate: n2, toInfinitive: r2 } = e3.methods.two.transform.verb, a2 = t3.root;
        if (a2.has("#Modal")) return e3;
        let o2 = a2.text({ keepPunct: false });
        return o2 = r2(o2, e3.model, Wc(a2)), o2 = n2(o2, e3.model).PastTense, o2 = "been" === o2 ? "was" : o2, "was" === o2 && (o2 = ((e4, t4) => {
          let { subject: n3, plural: r3 } = $c(e4);
          return r3 || n3.has("we") ? "were" : "was";
        })(e3)), o2 && e3.replace(a2, o2, Xc), e3;
      }, both: function(e3, t3) {
        return t3.negative.found ? (e3.replace("will", "did"), e3) : (e3 = Yc.simple(e3, t3), e3 = Yc.noAux(e3, t3));
      }, hasHad: (e3) => (e3.replace("has", "had", Xc), e3), hasParticiple: (e3, t3) => {
        const { conjugate: n2, toInfinitive: r2 } = e3.methods.two.transform.verb, a2 = t3.root;
        let o2 = a2.text("normal");
        return o2 = r2(o2, e3.model, Wc(a2)), n2(o2, e3.model).Participle;
      } }, eh = { infinitive: Yc.simple, "simple-present": Yc.simple, "simple-past": Mc, "simple-future": Yc.both, "present-progressive": (e3) => (e3.replace("are", "were", Xc), e3.replace("(is|are|am)", "was", Xc), e3), "past-progressive": Mc, "future-progressive": (e3, t3) => (e3.match(t3.root).insertBefore("was"), e3.remove("(will|be)"), e3), "present-perfect": Yc.hasHad, "past-perfect": Mc, "future-perfect": (e3, t3) => (e3.match(t3.root).insertBefore("had"), e3.has("will") && (e3 = Uc(e3)), e3.remove("have"), e3), "present-perfect-progressive": Yc.hasHad, "past-perfect-progressive": Mc, "future-perfect-progressive": (e3) => (e3.remove("will"), e3.replace("have", "had", Xc), e3), "passive-past": (e3) => (e3.replace("have", "had", Xc), e3), "passive-present": (e3) => (e3.replace("(is|are)", "was", Xc), e3), "passive-future": (e3, t3) => (t3.auxiliary.has("will be") && (e3.match(t3.root).insertBefore("had been"), e3.remove("(will|be)")), t3.auxiliary.has("will have been") && (e3.replace("have", "had", Xc), e3.remove("will")), e3), "present-conditional": (e3) => (e3.replace("be", "have been"), e3), "past-conditional": Mc, "auxiliary-future": (e3) => (e3.replace("(is|are|am)", "was", Xc), e3), "auxiliary-past": Mc, "auxiliary-present": (e3) => (e3.replace("(do|does)", "did", Xc), e3), "modal-infinitive": (e3, t3) => (e3.has("can") ? e3.replace("can", "could", Xc) : (Yc.simple(e3, t3), e3.match("#Modal").insertAfter("have").tag("Auxiliary")), e3), "modal-past": Mc, "want-infinitive": (e3) => (e3.replace("(want|wants)", "wanted", Xc), e3.remove("will"), e3), "gerund-phrase": (e3, t3) => (t3.root = t3.root.not("#Gerund$"), Yc.simple(e3, t3), Uc(e3), e3) }, th = function(e3, t3) {
        let n2 = $c(e3), r2 = n2.subject;
        return r2.has("(i|we|you)") ? "have" : false === n2.plural || r2.has("he") || r2.has("she") || r2.has("#Person") ? "has" : "have";
      }, nh = (e3, t3) => {
        const { conjugate: n2, toInfinitive: r2 } = e3.methods.two.transform.verb, { root: a2, auxiliary: o2 } = t3;
        if (a2.has("#Modal")) return e3;
        let i2 = a2.text({ keepPunct: false });
        i2 = r2(i2, e3.model, Wc(a2));
        let s2 = n2(i2, e3.model);
        if (i2 = s2.Participle || s2.PastTense, i2) {
          e3 = e3.replace(a2, i2);
          let t4 = th(e3);
          e3.prepend(t4).match(t4).tag("Auxiliary"), e3.remove(o2);
        }
        return e3;
      }, rh = { infinitive: nh, "simple-present": nh, "simple-future": (e3, t3) => e3.replace("will", th(e3)), "present-perfect": Mc, "past-perfect": Mc, "future-perfect": (e3, t3) => e3.replace("will have", th(e3)), "present-perfect-progressive": Mc, "past-perfect-progressive": Mc, "future-perfect-progressive": Mc }, ah = { tags: true }, oh = (e3, t3) => {
        const { conjugate: n2, toInfinitive: r2 } = e3.methods.two.transform.verb, a2 = t3.root;
        let o2 = a2.text("normal");
        return o2 = r2(o2, e3.model, Wc(a2)), false === Kc(e3) && (o2 = n2(o2, e3.model).PresentTense), a2.has("#Copula") && (o2 = Lc(e3)), o2 && (e3 = e3.replace(a2, o2, ah)).not("#Particle").tag("PresentTense"), e3;
      }, ih = (e3, t3) => {
        const { conjugate: n2, toInfinitive: r2 } = e3.methods.two.transform.verb, a2 = t3.root;
        let o2 = a2.text("normal");
        return o2 = r2(o2, e3.model, Wc(a2)), false === Kc(e3) && (o2 = n2(o2, e3.model).Gerund), o2 && (e3 = e3.replace(a2, o2, ah)).not("#Particle").tag("Gerund"), e3;
      }, sh = { infinitive: oh, "simple-present": (e3, t3) => {
        const { conjugate: n2 } = e3.methods.two.transform.verb;
        let { root: r2 } = t3;
        if (!r2.has("#Infinitive")) return oh(e3, t3);
        {
          let t4 = $c(e3).subject;
          if (Kc(e3) || t4.has("i")) return e3;
          let a2 = r2.text("normal"), o2 = n2(a2, e3.model).PresentTense;
          a2 !== o2 && e3.replace(r2, o2, ah);
        }
        return e3;
      }, "simple-past": oh, "simple-future": (e3, t3) => {
        const { root: n2, auxiliary: r2 } = t3;
        if (r2.has("will") && n2.has("be")) {
          let t4 = Lc(e3);
          e3.replace(n2, t4), (e3 = e3.remove("will")).replace("not " + t4, t4 + " not");
        } else oh(e3, t3), e3 = e3.remove("will");
        return e3;
      }, "present-progressive": Mc, "past-progressive": (e3, t3) => {
        let n2 = Lc(e3);
        return e3.replace("(were|was)", n2, ah);
      }, "future-progressive": (e3) => (e3.match("will").insertBefore("is"), e3.remove("be"), e3.remove("will")), "present-perfect": (e3, t3) => (oh(e3, t3), e3 = e3.remove("(have|had|has)")), "past-perfect": (e3, t3) => {
        let n2 = $c(e3).subject;
        return Kc(e3) || n2.has("i") ? ((e3 = qc(e3, t3)).remove("had"), e3) : (e3.replace("had", "has", ah), e3);
      }, "future-perfect": (e3) => (e3.match("will").insertBefore("has"), e3.remove("have").remove("will")), "present-perfect-progressive": Mc, "past-perfect-progressive": (e3) => e3.replace("had", "has", ah), "future-perfect-progressive": (e3) => (e3.match("will").insertBefore("has"), e3.remove("have").remove("will")), "passive-past": (e3, t3) => {
        let n2 = Lc(e3);
        return e3.has("(had|have|has)") && e3.has("been") ? (e3.replace("(had|have|has)", n2, ah), e3.replace("been", "being"), e3) : e3.replace("(got|was|were)", n2);
      }, "passive-present": Mc, "passive-future": (e3) => (e3.replace("will", "is"), e3.replace("be", "being")), "present-conditional": Mc, "past-conditional": (e3) => (e3.replace("been", "be"), e3.remove("have")), "auxiliary-future": (e3, t3) => (ih(e3, t3), e3.remove("(going|to)"), e3), "auxiliary-past": (e3, t3) => {
        if (t3.auxiliary.has("did")) {
          let n2 = Jc(e3);
          return e3.replace(t3.auxiliary, n2), e3;
        }
        return ih(e3, t3), e3.replace(t3.auxiliary, "is"), e3;
      }, "auxiliary-present": Mc, "modal-infinitive": Mc, "modal-past": (e3, t3) => (((e4, t4) => {
        const { toInfinitive: n2 } = e4.methods.two.transform.verb, r2 = t4.root;
        let a2 = t4.root.text("normal");
        a2 = n2(a2, e4.model, Wc(r2)), a2 && (e4 = e4.replace(t4.root, a2, ah));
      })(e3, t3), e3.remove("have")), "gerund-phrase": (e3, t3) => (t3.root = t3.root.not("#Gerund$"), oh(e3, t3), e3.remove("(will|have)")), "want-infinitive": (e3, t3) => {
        let n2 = "wants";
        return Kc(e3) && (n2 = "want"), e3.replace("(want|wanted|wants)", n2, ah), e3.remove("will"), e3;
      } }, lh = { tags: true }, uh = (e3, t3) => {
        const { toInfinitive: n2 } = e3.methods.two.transform.verb, { root: r2, auxiliary: a2 } = t3;
        if (r2.has("#Modal")) return e3;
        let o2 = r2.text("normal");
        return o2 = n2(o2, e3.model, Wc(r2)), o2 && (e3 = e3.replace(r2, o2, lh)).not("#Particle").tag("Verb"), e3.prepend("will").match("will").tag("Auxiliary"), e3.remove(a2), e3;
      }, ch = (e3, t3) => {
        const { conjugate: n2, toInfinitive: r2 } = e3.methods.two.transform.verb, { root: a2, auxiliary: o2 } = t3;
        let i2 = a2.text("normal");
        return i2 = r2(i2, e3.model, Wc(a2)), i2 && (i2 = n2(i2, e3.model).Gerund, e3.replace(a2, i2, lh), e3.not("#Particle").tag("PresentTense")), e3.remove(o2), e3.prepend("will be").match("will be").tag("Auxiliary"), e3;
      }, hh = { infinitive: uh, "simple-present": uh, "simple-past": uh, "simple-future": Mc, "present-progressive": ch, "past-progressive": ch, "future-progressive": Mc, "present-perfect": (e3) => (e3.match("(have|has)").replaceWith("will have"), e3), "past-perfect": (e3) => e3.replace("(had|has)", "will have"), "future-perfect": Mc, "present-perfect-progressive": (e3) => e3.replace("has", "will have"), "past-perfect-progressive": (e3) => e3.replace("had", "will have"), "future-perfect-progressive": Mc, "passive-past": (e3) => e3.has("got") ? e3.replace("got", "will get") : e3.has("(was|were)") ? (e3.replace("(was|were)", "will be"), e3.remove("being")) : e3.has("(have|has|had) been") ? e3.replace("(have|has|had) been", "will be") : e3, "passive-present": (e3) => (e3.replace("being", "will be"), e3.remove("(is|are|am)"), e3), "passive-future": Mc, "present-conditional": (e3) => e3.replace("would", "will"), "past-conditional": (e3) => e3.replace("would", "will"), "auxiliary-future": Mc, "auxiliary-past": (e3) => e3.has("used") && e3.has("to") ? (e3.replace("used", "will"), e3.remove("to")) : (e3.replace("did", "will"), e3), "auxiliary-present": (e3) => e3.replace("(do|does)", "will"), "modal-infinitive": Mc, "modal-past": Mc, "gerund-phrase": (e3, t3) => (t3.root = t3.root.not("#Gerund$"), uh(e3, t3), e3.remove("(had|have)")), "want-infinitive": (e3) => (e3.replace("(want|wants|wanted)", "will want"), e3) }, dh = { tags: true }, gh = { tags: true }, mh = function(e3, t3) {
        let n2 = Jc(e3);
        return e3.prepend(n2 + " not"), e3;
      }, ph = function(e3) {
        let t3 = e3.match("be");
        return t3.found ? (t3.prepend("not"), e3) : (t3 = e3.match("(is|was|am|are|will|were)"), t3.found ? (t3.append("not"), e3) : e3);
      }, fh = (e3) => e3.has("(is|was|am|are|will|were|be)"), bh = { "simple-present": (e3, t3) => true === fh(e3) ? ph(e3) : (e3 = qc(e3, t3), e3 = mh(e3)), "simple-past": (e3, t3) => true === fh(e3) ? ph(e3) : ((e3 = qc(e3, t3)).prepend("did not"), e3), imperative: (e3) => (e3.prepend("do not"), e3), infinitive: (e3, t3) => true === fh(e3) ? ph(e3) : mh(e3), "passive-past": (e3) => {
        if (e3.has("got")) return e3.replace("got", "get", gh), e3.prepend("did not"), e3;
        let t3 = e3.match("(was|were|had|have)");
        return t3.found && t3.append("not"), e3;
      }, "auxiliary-past": (e3) => {
        if (e3.has("used")) return e3.prepend("did not"), e3;
        let t3 = e3.match("(did|does|do)");
        return t3.found && t3.append("not"), e3;
      }, "want-infinitive": (e3, t3) => e3 = (e3 = mh(e3)).replace("wants", "want", gh) };
      var vh = { api: function(e3) {
        class Verbs extends e3 {
          constructor(e4, t3, n2) {
            super(e4, t3, n2), this.viewType = "Verbs";
          }
          parse(e4) {
            return this.getNth(e4).map(jc);
          }
          json(e4, t3) {
            let n2 = this.getNth(t3).map((t4) => {
              let n3 = t4.toView().json(e4)[0] || {};
              return n3.verb = function(e5) {
                let t5 = jc(e5);
                e5 = e5.clone().toView();
                const n4 = zc(e5, t5);
                return { root: t5.root.text(), preAdverbs: Rc(t5.adverbs.pre), postAdverbs: Rc(t5.adverbs.post), auxiliary: Qc(t5.auxiliary), negative: t5.negative.found, prefix: Qc(t5.prefix), infinitive: Zc(t5.root), grammar: n4 };
              }(t4), n3;
            }, []);
            return n2;
          }
          subjects(e4) {
            return this.getNth(e4).map((e5) => (jc(e5), $c(e5).subject));
          }
          adverbs(e4) {
            return this.getNth(e4).map((e5) => e5.match("#Adverb"));
          }
          isSingular(e4) {
            return this.getNth(e4).filter((e5) => true !== $c(e5).plural);
          }
          isPlural(e4) {
            return this.getNth(e4).filter((e5) => true === $c(e5).plural);
          }
          isImperative(e4) {
            return this.getNth(e4).filter((e5) => e5.has("#Imperative"));
          }
          toInfinitive(e4) {
            return this.getNth(e4).map((e5) => {
              let t3 = jc(e5);
              return function(e6, t4) {
                const { toInfinitive: n2 } = e6.methods.two.transform.verb, { root: r2, auxiliary: a2 } = t4;
                let o2 = a2.terms().harden(), i2 = r2.text("normal");
                if (i2 = n2(i2, e6.model, Wc(r2)), i2 && e6.replace(r2, i2, _c).tag("Verb").firstTerm().tag("Infinitive"), o2.found && e6.remove(o2), t4.negative.found) {
                  e6.has("not") || e6.prepend("not");
                  let t5 = Jc(e6);
                  e6.prepend(t5);
                }
                return e6.fullSentence().compute(["freeze", "lexicon", "preTagger", "postTagger", "unfreeze", "chunks"]), e6;
              }(e5, t3, zc(e5, t3).form);
            });
          }
          toPresentTense(e4) {
            return this.getNth(e4).map((e5) => {
              let t3 = jc(e5), n2 = zc(e5, t3);
              return n2.isInfinitive ? e5 : function(e6, t4, n3) {
                return sh.hasOwnProperty(n3) ? ((e6 = sh[n3](e6, t4)).fullSentence().compute(["tagger", "chunks"]), e6) : e6;
              }(e5, t3, n2.form);
            });
          }
          toPastTense(e4) {
            return this.getNth(e4).map((e5) => {
              let t3 = jc(e5), n2 = zc(e5, t3);
              return n2.isInfinitive ? e5 : function(e6, t4, n3) {
                return eh.hasOwnProperty(n3) ? ((e6 = eh[n3](e6, t4)).fullSentence().compute(["tagger", "chunks"]), e6) : e6;
              }(e5, t3, n2.form);
            });
          }
          toFutureTense(e4) {
            return this.getNth(e4).map((e5) => {
              let t3 = jc(e5), n2 = zc(e5, t3);
              return n2.isInfinitive ? e5 : function(e6, t4, n3) {
                return e6.has("will") || e6.has("going to") ? e6 : hh.hasOwnProperty(n3) ? ((e6 = hh[n3](e6, t4)).fullSentence().compute(["tagger", "chunks"]), e6) : e6;
              }(e5, t3, n2.form);
            });
          }
          toGerund(e4) {
            return this.getNth(e4).map((e5) => {
              let t3 = jc(e5), n2 = zc(e5, t3);
              return n2.isInfinitive ? e5 : function(e6, t4) {
                const { toInfinitive: n3, conjugate: r2 } = e6.methods.two.transform.verb, { root: a2, auxiliary: o2 } = t4;
                if (e6.has("#Gerund")) return e6;
                let i2 = a2.text("normal");
                i2 = n3(i2, e6.model, Wc(a2));
                let s2 = r2(i2, e6.model).Gerund;
                if (s2) {
                  let t5 = Lc(e6);
                  e6.replace(a2, s2, dh), e6.remove(o2), e6.prepend(t5);
                }
                return e6.replace("not is", "is not"), e6.replace("not are", "are not"), e6.fullSentence().compute(["tagger", "chunks"]), e6;
              }(e5, t3, n2.form);
            });
          }
          toPastParticiple(e4) {
            return this.getNth(e4).map((e5) => {
              let t3 = jc(e5), n2 = zc(e5, t3);
              return n2.isInfinitive ? e5 : function(e6, t4, n3) {
                return rh.hasOwnProperty(n3) ? ((e6 = rh[n3](e6, t4)).fullSentence().compute(["tagger", "chunks"]), e6) : ((e6 = nh(e6, t4)).fullSentence().compute(["tagger", "chunks"]), e6);
              }(e5, t3, n2.form);
            });
          }
          conjugate(e4) {
            const { conjugate: t3, toInfinitive: n2 } = this.world.methods.two.transform.verb;
            return this.getNth(e4).map((e5) => {
              let r2 = jc(e5), a2 = zc(e5, r2);
              "imperative" === a2.form && (a2.form = "simple-present");
              let o2 = r2.root.text("normal");
              if (!r2.root.has("#Infinitive")) {
                let t4 = Wc(r2.root);
                o2 = n2(o2, e5.model, t4) || o2;
              }
              return t3(o2, e5.model);
            }, []);
          }
          isNegative() {
            return this.if("#Negative");
          }
          isPositive() {
            return this.ifNo("#Negative");
          }
          toPositive() {
            let e4 = this.match("do not #Verb");
            return e4.found && e4.remove("do not"), this.remove("#Negative");
          }
          toNegative(e4) {
            return this.getNth(e4).map((e5) => {
              let t3 = jc(e5);
              return function(e6, t4, n2) {
                if (e6.has("#Negative")) return e6;
                if (bh.hasOwnProperty(n2)) return bh[n2](e6, t4);
                let r2 = e6.matchOne("be");
                return r2.found ? (r2.prepend("not"), e6) : true === fh(e6) ? ph(e6) : (r2 = e6.matchOne("(will|had|have|has|did|does|do|#Modal)"), r2.found ? (r2.append("not"), e6) : e6);
              }(e5, t3, zc(e5, t3).form);
            });
          }
          update(e4) {
            let t3 = new Verbs(this.document, e4);
            return t3._cache = this._cache, t3;
          }
        }
        Verbs.prototype.toPast = Verbs.prototype.toPastTense, Verbs.prototype.toPresent = Verbs.prototype.toPresentTense, Verbs.prototype.toFuture = Verbs.prototype.toFutureTense, e3.prototype.verbs = function(e4) {
          let t3 = function(e5) {
            let t4 = e5.match("<Verb>");
            return t4 = t4.not("#Conjunction"), t4 = t4.not("#Preposition"), t4 = t4.splitAfter("@hasComma"), t4 = t4.splitAfter("[(do|did|am|was|is|will)] (is|was)", 0), t4 = t4.splitBefore("(#Verb && !#Copula) [being] #Verb", 0), t4 = t4.splitBefore("#Verb [to be] #Verb", 0), t4 = t4.splitAfter("[help] #PresentTense", 0), t4 = t4.splitBefore("(#PresentTense|#PastTense) [#Copula]$", 0), t4 = t4.splitBefore("(#PresentTense|#PastTense) [will be]$", 0), t4 = t4.splitBefore("(#PresentTense|#PastTense) [(had|has)]", 0), t4 = t4.not("#Reflexive$"), t4 = t4.not("#Adjective"), t4 = t4.splitAfter("[#PastTense] #PastTense", 0), t4 = t4.splitAfter("[#PastTense] #Auxiliary+ #PastTense", 0), t4 = t4.splitAfter("#Copula [#Gerund] #PastTense", 0), t4 = t4.if("#Verb"), t4.has("(#Verb && !#Auxiliary) #Adverb+? #Copula") && (t4 = t4.splitBefore("#Copula")), t4;
          }(this);
          return t3 = t3.getNth(e4), new Verbs(this.document, t3.pointer);
        };
      } };
      const yh = function(e3, t3) {
        let n2 = t3.match(e3);
        if (n2.found) {
          let e4 = n2.pronouns().refersTo();
          if (e4.found) return e4;
        }
        return t3.none();
      }, wh = function(e3) {
        if (!e3.found) return e3;
        let [t3] = e3.fullPointer[0];
        return t3 && t3 > 0 ? e3.update([[t3 - 1]]) : e3.none();
      }, kh = function(e3, t3) {
        let n2 = e3.people();
        return n2 = function(e4, t4) {
          return "m" === t4 ? e4.filter((e5) => !e5.presumedFemale().found) : "f" === t4 ? e4.filter((e5) => !e5.presumedMale().found) : e4;
        }(n2, t3), n2.found ? n2.last() : (n2 = e3.nouns("#Actor"), n2.found ? n2.last() : "f" === t3 ? yh("(she|her|hers)", e3) : "m" === t3 ? yh("(he|him|his)", e3) : e3.none());
      }, Ph = function(e3) {
        let t3 = e3.nouns(), n2 = t3.isPlural().notIf("#Pronoun");
        if (n2.found) return n2.last();
        let r2 = yh("(they|their|theirs)", e3);
        return r2.found ? r2 : (n2 = t3.match("(somebody|nobody|everybody|anybody|someone|noone|everyone|anyone)"), n2.found ? n2.last() : e3.none());
      }, Ah = function(e3, t3) {
        let n2 = e3.before(), r2 = t3(n2);
        return r2.found ? r2 : (n2 = wh(e3), r2 = t3(n2), r2.found ? r2 : (n2 = wh(n2), r2 = t3(n2), r2.found ? r2 : e3.none()));
      };
      var Ch = { compute: { coreference: function(e3) {
        e3.pronouns().if("(he|him|his|she|her|hers|they|their|theirs|it|its)").forEach((e4) => {
          let t3 = null;
          e4.has("(he|him|his)") ? t3 = Ah(e4, (e5) => kh(e5, "m")) : e4.has("(she|her|hers)") ? t3 = Ah(e4, (e5) => kh(e5, "f")) : e4.has("(they|their|theirs)") && (t3 = Ah(e4, Ph)), t3 && t3.found && function(e5, t4) {
            t4 && t4.found && (e5.docs[0][0].reference = t4.ptrs[0]);
          }(e4, t3);
        });
      } }, api: function(e3) {
        class Pronouns extends e3 {
          constructor(e4, t3, n2) {
            super(e4, t3, n2), this.viewType = "Pronouns";
          }
          hasReference() {
            return this.compute("coreference"), this.filter((e4) => e4.docs[0][0].reference);
          }
          refersTo() {
            return this.compute("coreference"), this.map((e4) => {
              if (!e4.found) return e4.none();
              let t3 = e4.docs[0][0];
              return t3.reference ? e4.update([t3.reference]) : e4.none();
            });
          }
          update(e4) {
            let t3 = new Pronouns(this.document, e4);
            return t3._cache = this._cache, t3;
          }
        }
        e3.prototype.pronouns = function(e4) {
          let t3 = this.match("#Pronoun");
          return t3 = t3.getNth(e4), new Pronouns(t3.document, t3.pointer);
        };
      } };
      return h.plugin(Ll), h.plugin(Jl), h.plugin(_l), h.plugin(Ch), h.plugin(gu), h.plugin(wu), h.plugin(Hu), h.plugin(lc), h.plugin(hc), h.plugin(mc), h.plugin(kc), h.plugin(vh), h;
    }, "object" == typeof exports2 && "undefined" != typeof module2 ? module2.exports = t() : "function" == typeof define && define.amd ? define(t) : (e = "undefined" != typeof globalThis ? globalThis : e || self).nlp = t();
  }
});

// vscode/extension.js
var vscode = require("vscode");
var nlp = require_compromise_three();
var os = require("os");
var paths = require("path");
var fs = require("fs");
var {
  Uri,
  Range,
  Position,
  DocumentLink,
  DocumentLinkProvider,
  commands,
  languages,
  workspace,
  window: window2
} = vscode;
var posColors = {
  Noun: "entity_name_type",
  Verb: "entity_name_function",
  Adjective: "entity_other_attribute_name",
  Adverb: "adverb_language",
  Value: "value_type"
};
var tokenTypes = ["entity_name_type", "entity_name_function", "entity_other_attribute_name", "adverb_language", "value_type"];
exports.activate = async function activate(context) {
  context.subscriptions.push(
    commands.registerTextEditorCommand(
      "notesnlh.cycleTaskForwardNew",
      cycleTaskForwardNew
    ),
    commands.registerTextEditorCommand(
      "notesnlh.cycleTaskBackwardNew",
      cycleTaskBackwardNew
    )
  );
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((event) => {
      if (event.affectsConfiguration("notesnlh")) {
        vscode.workspace.textDocuments.forEach((doc) => {
          if (doc.languageId === "notesnlh") {
            vscode.languages.triggerTokenSemanticTokensRefresh();
          }
        });
      }
    })
  );
  function expandPathHome(path) {
    if (path.slice(0, 1) == "~") {
      return paths.join(os.homedir(), path.slice(1, path.length));
    } else {
      return path;
    }
  }
  function regexpSubstitute(text, matches) {
    return text.replace(/\$(\d+)/g, (_, p1) => matches[parseInt(p1, 10)]);
  }
  const linkPattern = /("([^"]+?\.notesnlh)"|[^\s]+?\.notesnlh)/g;
  const externalLinkPatterns = /\[\/([^\/]+)\/\s*->\s*(https?:\/\/[^\]]+)\]/g;
  const linkProvider = {
    provideDocumentLinks: async function(document, token) {
      let relativeRoot;
      if (document.uri.scheme === "file") {
        relativeRoot = paths.dirname(document.uri.fsPath);
      } else {
        relativeRoot = null;
      }
      let text = document.getText();
      let match;
      const externalPatterns = [];
      linkPatterns = vscode.workspace.getConfiguration("notesnlh")["linkPatterns"];
      if (linkPatterns) {
        for (let [regexp, link] of Object.entries(linkPatterns)) {
          externalPatterns.push({ regexp, link });
        }
      }
      while (match = externalLinkPatterns.exec(text)) {
        externalPatterns.push({ regexp: match[1], link: match[2] });
      }
      const results = [];
      while (match = linkPattern.exec(text)) {
        const linkEnd = document.positionAt(linkPattern.lastIndex);
        const linkStart = linkEnd.translate({
          characterDelta: -match[1].length
        });
        const range = new Range(linkStart, linkEnd);
        const linkPath = expandPathHome(match[2] ? match[2] : match[1]);
        let linkTarget;
        if (paths.isAbsolute(linkPath)) {
          linkTarget = linkPath;
        } else if (relativeRoot) {
          linkTarget = paths.resolve(relativeRoot, linkPath);
        } else {
          continue;
        }
        const fileUri = Uri.file(linkTarget);
        const docLink = new DocumentLink(range, fileUri);
        results.push(docLink);
      }
      for (pattern of externalPatterns) {
        const RE = new RegExp(pattern.regexp, "g");
        while (match = RE.exec(text)) {
          const linkEnd = document.positionAt(RE.lastIndex);
          const linkStart = linkEnd.translate({
            characterDelta: -match[0].length
          });
          const range = new Range(linkStart, linkEnd);
          const uri = Uri.parse(regexpSubstitute(pattern.link, match));
          const docLink = new DocumentLink(range, uri);
          results.push(docLink);
        }
      }
      return results;
    }
  };
  context.subscriptions.push(
    languages.registerDocumentLinkProvider({ scheme: "file", language: "notesnlh" }, linkProvider)
  );
  function swap(obj) {
    let ret = {};
    for (let key in obj) {
      ret[obj[key]] = key;
    }
    return ret;
  }
  const nextStateLookup = {
    "[ ]": "[\u221A]",
    "[\u221A]": "[!]",
    "[!]": "[x]",
    "[x]": "[ ]"
  };
  function nextTaskState(currentState) {
    const lookup = nextStateLookup[currentState];
    if (lookup) {
      return lookup;
    } else {
      return currentState;
    }
  }
  function prevTaskState(currentState) {
    const lookup = swap(nextStateLookup)[currentState];
    if (lookup) {
      return lookup;
    } else {
      return currentState;
    }
  }
  function cycleTaskForwardNew(editor) {
    cycleTask(editor, nextTaskState);
  }
  function cycleTaskBackwardNew(editor) {
    cycleTask(editor, prevTaskState);
  }
  function cycleTask(editor, nextStateFn) {
    editor.edit((editBuilder) => {
      editor.selections.forEach((selection) => {
        let lineNo = selection.start.line;
        while (lineNo <= selection.end.line) {
          const line = editor.document.lineAt(lineNo);
          const m = line.text.match(/^\s*(\[.?\])/);
          if (m) {
            const braceMatch = m[1];
            const position = line.text.indexOf(braceMatch);
            const range = new Range(
              new Position(lineNo, position),
              new Position(lineNo, position + 3)
            );
            const newText = nextStateFn(braceMatch);
            editBuilder.replace(range, newText);
          } else {
            let insertPos = selection.active.character;
            const m2 = line.text.match(/[^\s]/);
            if (m2) {
              insertPos = line.text.indexOf(m2[0]);
            }
            editBuilder.insert(new Position(lineNo, insertPos), "[ ] ");
          }
          lineNo++;
        }
      });
    });
  }
  function getSupportedLanguages() {
    const tmLanguagePath = paths.join(__dirname, "..", "syntaxes", "notesnlh.tmLanguage.json");
    const tmLanguageContent = fs.readFileSync(tmLanguagePath, "utf8");
    const tmLanguage = JSON.parse(tmLanguageContent);
    const languages2 = tmLanguage.patterns.filter((pattern2) => pattern2.begin && pattern2.begin.includes("\\[") && pattern2.begin.includes("\\]")).map((pattern2) => {
      const match = pattern2.begin.match(/\\\[(.*?)\\\]/);
      return match ? match[1].split("|") : [];
    }).flat();
    return new Set(languages2);
  }
  function isInSpecialBlock(lineNumber, characterNumber, specialBlocks) {
    for (const block of specialBlocks) {
      if (lineNumber > block.start.line && lineNumber < block.end.line) {
        return true;
      }
      if (lineNumber === block.start.line && characterNumber >= block.start.character) {
        return true;
      }
      if (lineNumber === block.end.line && characterNumber <= block.end.character) {
        return true;
      }
    }
    return false;
  }
  function shouldHighlightPOS(pos, config) {
    switch (pos.toLowerCase()) {
      case "noun":
        return config.get("highlightNouns");
      case "verb":
        return config.get("highlightVerbs");
      case "adjective":
        return config.get("highlightAdjectives");
      case "adverb":
        return config.get("highlightAdverbs");
      case "value":
        return config.get("highlightNumbers");
      default:
        return false;
    }
  }
  const semanticTokensProvider = {
    provideDocumentSemanticTokens(document) {
      const text = document.getText();
      const supportedLanguages = getSupportedLanguages();
      const lines = text.split("\n");
      const specialBlocks = [];
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith("//") || line.startsWith("#") || line.startsWith("[!]") || line.startsWith("[\u221A]")) {
          specialBlocks.push({
            start: new vscode.Position(i, 0),
            end: new vscode.Position(i, lines[i].length)
          });
        }
        const languageMatch = line.match(/^\[([^\]]+)\]/);
        if (languageMatch && supportedLanguages.has(languageMatch[1])) {
          const startIndex = i;
          while (i < lines.length && !lines[i].includes("[end]") && !lines[i].includes("[/")) {
            i++;
          }
          specialBlocks.push({
            start: new vscode.Position(startIndex, 0),
            end: new vscode.Position(i, lines[i].length)
          });
        }
      }
      try {
        const doc = nlp(text);
        const json = doc.json();
        const builder = new vscode.SemanticTokensBuilder(legend);
        let lineNumber = 0;
        let characterNumber = 0;
        const config = vscode.workspace.getConfiguration("notesnlh");
        for (const sentence of json) {
          for (const term of sentence.terms) {
            if (!term || typeof term !== "object") {
              console.log("Invalid term:", term, "type of term:", typeof term);
              continue;
            }
            var pos = term.tags[0];
            if (pos.toLowerCase().includes("noun")) {
              pos = "Noun";
            }
            const preText = term.pre;
            for (const char of preText) {
              if (char === "\n") {
                lineNumber++;
                characterNumber = 0;
              } else {
                characterNumber++;
              }
            }
            if (!isInSpecialBlock(lineNumber, characterNumber, specialBlocks) && posColors[pos] && shouldHighlightPOS(pos, config)) {
              const range = new vscode.Range(
                new vscode.Position(lineNumber, characterNumber),
                new vscode.Position(lineNumber, characterNumber + term.text.length)
              );
              var specialblock = false;
              builder.push(range, posColors[pos]);
            }
            for (const char of term.text) {
              if (char === "\n") {
                lineNumber++;
                characterNumber = 0;
              } else {
                characterNumber++;
              }
            }
            const afterText = term.post;
            for (const char of afterText) {
              if (char === "\n") {
                lineNumber++;
                characterNumber = 0;
              } else {
                characterNumber++;
              }
            }
            if (isInSpecialBlock(lineNumber, characterNumber, specialBlocks)) {
              characterNumber = 0;
              specialblock = true;
            }
          }
        }
        const tokens = builder.build();
        return tokens;
      } catch (error) {
        console.error("Error in provideDocumentSemanticTokens:", error);
        return null;
      }
    }
  };
  const selector = { language: "notesnlh", scheme: "file" };
  const legend = new vscode.SemanticTokensLegend(tokenTypes);
  context.subscriptions.push(
    vscode.languages.registerDocumentSemanticTokensProvider(
      selector,
      semanticTokensProvider,
      legend
    )
  );
};
//# sourceMappingURL=extension_bundled.js.map
