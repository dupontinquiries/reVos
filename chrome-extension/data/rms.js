!(function (r, t) {
    "object" == typeof exports && "undefined" != typeof module ? (module.exports = t()) : "function" == typeof define && define.amd ? define(t) : ((r = "undefined" != typeof globalThis ? globalThis : r || self).Meyda = t());
})(this, function () {
    "use strict";
    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */ function r(
        r,
        t,
        e
    ) {
        if (e || 2 === arguments.length) for (var a, n = 0, i = t.length; n < i; n++) (!a && n in t) || (a || (a = Array.prototype.slice.call(t, 0, n)), (a[n] = t[n]));
        return r.concat(a || Array.prototype.slice.call(t));
    }
    var t = Object.freeze({
            __proto__: null,
            blackman: function (r) {
                for (var t = new Float32Array(r), e = (2 * Math.PI) / (r - 1), a = 2 * e, n = 0; n < r / 2; n++) t[n] = 0.42 - 0.5 * Math.cos(n * e) + 0.08 * Math.cos(n * a);
                for (n = Math.ceil(r / 2); n > 0; n--) t[r - n] = t[n - 1];
                return t;
            },
            sine: function (r) {
                for (var t = Math.PI / (r - 1), e = new Float32Array(r), a = 0; a < r; a++) e[a] = Math.sin(t * a);
                return e;
            },
            hanning: function (r) {
                for (var t = new Float32Array(r), e = 0; e < r; e++) t[e] = 0.5 - 0.5 * Math.cos((2 * Math.PI * e) / (r - 1));
                return t;
            },
            hamming: function (r) {
                for (var t = new Float32Array(r), e = 0; e < r; e++) t[e] = 0.54 - 0.46 * Math.cos(2 * Math.PI * (e / r - 1));
                return t;
            },
        }),
        e = {};
    function a(r) {
        for (; r % 2 == 0 && r > 1; ) r /= 2;
        return 1 === r;
    }
    function n(r, a) {
        if ("rect" !== a) {
            if ((("" !== a && a) || (a = "hanning"), e[a] || (e[a] = {}), !e[a][r.length]))
                try {
                    e[a][r.length] = t[a](r.length);
                } catch (r) {
                    throw new Error("Invalid windowing function");
                }
            r = (function (r, t) {
                for (var e = [], a = 0; a < Math.min(r.length, t.length); a++) e[a] = r[a] * t[a];
                return e;
            })(r, e[a][r.length]);
        }
        return r;
    }
    function i(r, t, e) {
        for (var a = new Float32Array(r), n = 0; n < a.length; n++) (a[n] = (n * t) / e), (a[n] = 13 * Math.atan(a[n] / 1315.8) + 3.5 * Math.atan(Math.pow(a[n] / 7518, 2)));
        return a;
    }
    function o(r) {
        return Float32Array.from(r);
    }
    function u(r) {
        return 1125 * Math.log(1 + r / 700);
    }
    function f(r, t, e) {
        for (var a, n = new Float32Array(r + 2), i = new Float32Array(r + 2), o = t / 2, f = u(0), s = (u(o) - f) / (r + 1), c = new Array(r + 2), l = 0; l < n.length; l++)
            (n[l] = l * s), (i[l] = ((a = n[l]), 700 * (Math.exp(a / 1125) - 1))), (c[l] = Math.floor(((e + 1) * i[l]) / t));
        for (var m = new Array(r), h = 0; h < m.length; h++) {
            m[h] = new Array(e / 2 + 1).fill(0);
            for (l = c[h]; l < c[h + 1]; l++) m[h][l] = (l - c[h]) / (c[h + 1] - c[h]);
            for (l = c[h + 1]; l < c[h + 2]; l++) m[h][l] = (c[h + 2] - l) / (c[h + 2] - c[h + 1]);
        }
        return m;
    }
    function s(t, e, a, n, i, o, u) {
        void 0 === n && (n = 5), void 0 === i && (i = 2), void 0 === o && (o = !0), void 0 === u && (u = 440);
        var f = Math.floor(a / 2) + 1,
            s = new Array(a).fill(0).map(function (r, n) {
                return (
                    t *
                    (function (r, t) {
                        return Math.log2((16 * r) / t);
                    })((e * n) / a, u)
                );
            });
        s[0] = s[1] - 1.5 * t;
        var c,
            l,
            m,
            h = s
                .slice(1)
                .map(function (r, t) {
                    return Math.max(r - s[t]);
                }, 1)
                .concat([1]),
            p = Math.round(t / 2),
            g = new Array(t).fill(0).map(function (r, e) {
                return s.map(function (r) {
                    return ((10 * t + p + r - e) % t) - p;
                });
            }),
            w = g.map(function (r, t) {
                return r.map(function (r, e) {
                    return Math.exp(-0.5 * Math.pow((2 * g[t][e]) / h[e], 2));
                });
            });
        if (
            ((l = (c = w)[0].map(function () {
                return 0;
            })),
            (m = c
                .reduce(function (r, t) {
                    return (
                        t.forEach(function (t, e) {
                            r[e] += Math.pow(t, 2);
                        }),
                        r
                    );
                }, l)
                .map(Math.sqrt)),
            (w = c.map(function (r, t) {
                return r.map(function (r, t) {
                    return r / (m[t] || 1);
                });
            })),
            i)
        ) {
            var v = s.map(function (r) {
                return Math.exp(-0.5 * Math.pow((r / t - n) / i, 2));
            });
            w = w.map(function (r) {
                return r.map(function (r, t) {
                    return r * v[t];
                });
            });
        }
        return (
            o && (w = r(r([], w.slice(3), !0), w.slice(0, 3), !0)),
            w.map(function (r) {
                return r.slice(0, f);
            })
        );
    }
    function c(r, t) {
        for (var e = 0, a = 0, n = 0; n < t.length; n++) (e += Math.pow(n, r) * Math.abs(t[n])), (a += t[n]);
        return e / a;
    }
    function l(r) {
        var t = r.ampSpectrum,
            e = r.barkScale,
            a = r.numberOfBarkBands,
            n = void 0 === a ? 24 : a;
        if ("object" != typeof t || "object" != typeof e) throw new TypeError();
        var i = n,
            o = new Float32Array(i),
            u = 0,
            f = t,
            s = new Int32Array(i + 1);
        s[0] = 0;
        for (var c = e[f.length - 1] / i, l = 1, m = 0; m < f.length; m++) for (; e[m] > c; ) (s[l++] = m), (c = (l * e[f.length - 1]) / i);
        s[i] = f.length - 1;
        for (m = 0; m < i; m++) {
            for (var h = 0, p = s[m]; p < s[m + 1]; p++) h += f[p];
            o[m] = Math.pow(h, 0.23);
        }
        for (m = 0; m < o.length; m++) u += o[m];
        return { specific: o, total: u };
    }
    function m(r) {
        var t = r.ampSpectrum;
        if ("object" != typeof t) throw new TypeError();
        for (var e = new Float32Array(t.length), a = 0; a < e.length; a++) e[a] = Math.pow(t[a], 2);
        return e;
    }
    var h = null;
    var p = function (r, t) {
        var e = r.length;
        return (
            (t = t || 2),
            (h && h[e]) ||
                (function (r) {
                    (h = h || {})[r] = new Array(r * r);
                    for (var t = Math.PI / r, e = 0; e < r; e++) for (var a = 0; a < r; a++) h[r][a + e * r] = Math.cos(t * (a + 0.5) * e);
                })(e),
            r
                .map(function () {
                    return 0;
                })
                .map(function (a, n) {
                    return (
                        t *
                        r.reduce(function (r, t, a, i) {
                            return r + t * h[e][a + n * e];
                        }, 0)
                    );
                })
        );
    };
    var g = Object.freeze({
        __proto__: null,
        buffer: function (r) {
            return r.signal;
        },
        rms: function (r) {
            var t = r.signal;
            if ("object" != typeof t) throw new TypeError();
            for (var e = 0, a = 0; a < t.length; a++) e += Math.pow(t[a], 2);
            return (e /= t.length), (e = Math.sqrt(e));
        },
        energy: function (r) {
            var t = r.signal;
            if ("object" != typeof t) throw new TypeError();
            for (var e = 0, a = 0; a < t.length; a++) e += Math.pow(Math.abs(t[a]), 2);
            return e;
        },
        complexSpectrum: function (r) {
            return r.complexSpectrum;
        },
        spectralSlope: function (r) {
            var t = r.ampSpectrum,
                e = r.sampleRate,
                a = r.bufferSize;
            if ("object" != typeof t) throw new TypeError();
            for (var n = 0, i = 0, o = new Float32Array(t.length), u = 0, f = 0, s = 0; s < t.length; s++) {
                n += t[s];
                var c = (s * e) / a;
                (o[s] = c), (u += c * c), (i += c), (f += c * t[s]);
            }
            return (t.length * f - i * n) / (n * (u - Math.pow(i, 2)));
        },
        spectralCentroid: function (r) {
            var t = r.ampSpectrum;
            if ("object" != typeof t) throw new TypeError();
            return c(1, t);
        },
        spectralRolloff: function (r) {
            var t = r.ampSpectrum,
                e = r.sampleRate;
            if ("object" != typeof t) throw new TypeError();
            for (var a = t, n = e / (2 * (a.length - 1)), i = 0, o = 0; o < a.length; o++) i += a[o];
            for (var u = 0.99 * i, f = a.length - 1; i > u && f >= 0; ) (i -= a[f]), --f;
            return (f + 1) * n;
        },
        spectralFlatness: function (r) {
            var t = r.ampSpectrum;
            if ("object" != typeof t) throw new TypeError();
            for (var e = 0, a = 0, n = 0; n < t.length; n++) (e += Math.log(t[n])), (a += t[n]);
            return (Math.exp(e / t.length) * t.length) / a;
        },
        spectralSpread: function (r) {
            var t = r.ampSpectrum;
            if ("object" != typeof t) throw new TypeError();
            return Math.sqrt(c(2, t) - Math.pow(c(1, t), 2));
        },
        spectralSkewness: function (r) {
            var t = r.ampSpectrum;
            if ("object" != typeof t) throw new TypeError();
            var e = c(1, t),
                a = c(2, t),
                n = c(3, t);
            return (2 * Math.pow(e, 3) - 3 * e * a + n) / Math.pow(Math.sqrt(a - Math.pow(e, 2)), 3);
        },
        spectralKurtosis: function (r) {
            var t = r.ampSpectrum;
            if ("object" != typeof t) throw new TypeError();
            var e = t,
                a = c(1, e),
                n = c(2, e),
                i = c(3, e),
                o = c(4, e);
            return (-3 * Math.pow(a, 4) + 6 * a * n - 4 * a * i + o) / Math.pow(Math.sqrt(n - Math.pow(a, 2)), 4);
        },
        amplitudeSpectrum: function (r) {
            return r.ampSpectrum;
        },
        zcr: function (r) {
            var t = r.signal;
            if ("object" != typeof t) throw new TypeError();
            for (var e = 0, a = 1; a < t.length; a++) ((t[a - 1] >= 0 && t[a] < 0) || (t[a - 1] < 0 && t[a] >= 0)) && e++;
            return e;
        },
        loudness: l,
        perceptualSpread: function (r) {
            for (var t = l({ ampSpectrum: r.ampSpectrum, barkScale: r.barkScale }), e = 0, a = 0; a < t.specific.length; a++) t.specific[a] > e && (e = t.specific[a]);
            return Math.pow((t.total - e) / t.total, 2);
        },
        perceptualSharpness: function (r) {
            for (var t = l({ ampSpectrum: r.ampSpectrum, barkScale: r.barkScale }), e = t.specific, a = 0, n = 0; n < e.length; n++) a += n < 15 ? (n + 1) * e[n + 1] : 0.066 * Math.exp(0.171 * (n + 1));
            return (a *= 0.11 / t.total);
        },
        powerSpectrum: m,
        mfcc: function (r) {
            var t = r.ampSpectrum,
                e = r.melFilterBank,
                a = r.numberOfMFCCCoefficients,
                n = r.bufferSize;
            if ("object" != typeof t) throw new TypeError("Valid ampSpectrum is required to generate MFCC");
            if ("object" != typeof e) throw new TypeError("Valid melFilterBank is required to generate MFCC");
            var i = Math.min(40, Math.max(1, a || 13)),
                o = m({ ampSpectrum: t }),
                u = e.length,
                f = Array(u);
            if (u < i) throw new Error("Insufficient filter bank for requested number of coefficients");
            for (var s = new Float32Array(u), c = 0; c < s.length; c++) {
                (f[c] = new Float32Array(n / 2)), (s[c] = 0);
                for (var l = 0; l < n / 2; l++) (f[c][l] = e[c][l] * o[l]), (s[c] += f[c][l]);
                s[c] = Math.log(s[c] + 1);
            }
            var h = Array.prototype.slice.call(s);
            return p(h).slice(0, i);
        },
        chroma: function (r) {
            var t = r.ampSpectrum,
                e = r.chromaFilterBank;
            if ("object" != typeof t) throw new TypeError("Valid ampSpectrum is required to generate chroma");
            if ("object" != typeof e) throw new TypeError("Valid chromaFilterBank is required to generate chroma");
            var a = e.map(function (r, e) {
                    return t.reduce(function (t, e, a) {
                        return t + e * r[a];
                    }, 0);
                }),
                n = Math.max.apply(Math, a);
            return n
                ? a.map(function (r) {
                      return r / n;
                  })
                : a;
        },
        spectralFlux: function (r) {
            var t = r.signal,
                e = r.previousSignal,
                a = r.bufferSize;
            if ("object" != typeof t || "object" != typeof e) throw new TypeError();
            for (var n = 0, i = -a / 2; i < t.length / 2 - 1; i++) (x = Math.abs(t[i]) - Math.abs(e[i])), (n += (x + Math.abs(x)) / 2);
            return n;
        },
    });
    function w(r) {
        if (Array.isArray(r)) {
            for (var t = 0, e = Array(r.length); t < r.length; t++) e[t] = r[t];
            return e;
        }
        return Array.from(r);
    }
    var v = {},
        d = {},
        _ = {
            bitReverseArray: function (r) {
                if (void 0 === v[r]) {
                    for (var t = (r - 1).toString(2).length, e = "0".repeat(t), a = {}, n = 0; n < r; n++) {
                        var i = n.toString(2);
                        (i = e.substr(i.length) + i), (i = [].concat(w(i)).reverse().join("")), (a[n] = parseInt(i, 2));
                    }
                    v[r] = a;
                }
                return v[r];
            },
            multiply: function (r, t) {
                return { real: r.real * t.real - r.imag * t.imag, imag: r.real * t.imag + r.imag * t.real };
            },
            add: function (r, t) {
                return { real: r.real + t.real, imag: r.imag + t.imag };
            },
            subtract: function (r, t) {
                return { real: r.real - t.real, imag: r.imag - t.imag };
            },
            euler: function (r, t) {
                var e = (-2 * Math.PI * r) / t;
                return { real: Math.cos(e), imag: Math.sin(e) };
            },
            conj: function (r) {
                return (r.imag *= -1), r;
            },
            constructComplexArray: function (r) {
                var t = {};
                t.real = void 0 === r.real ? r.slice() : r.real.slice();
                var e = t.real.length;
                return void 0 === d[e] && (d[e] = Array.apply(null, Array(e)).map(Number.prototype.valueOf, 0)), (t.imag = d[e].slice()), t;
            },
        },
        y = function (r) {
            var t = {};
            void 0 === r.real || void 0 === r.imag ? (t = _.constructComplexArray(r)) : ((t.real = r.real.slice()), (t.imag = r.imag.slice()));
            var e = t.real.length,
                a = Math.log2(e);
            if (Math.round(a) != a) throw new Error("Input size must be a power of 2.");
            if (t.real.length != t.imag.length) throw new Error("Real and imaginary components must have the same length.");
            for (var n = _.bitReverseArray(e), i = { real: [], imag: [] }, o = 0; o < e; o++) (i.real[n[o]] = t.real[o]), (i.imag[n[o]] = t.imag[o]);
            for (var u = 0; u < e; u++) (t.real[u] = i.real[u]), (t.imag[u] = i.imag[u]);
            for (var f = 1; f <= a; f++)
                for (var s = Math.pow(2, f), c = 0; c < s / 2; c++)
                    for (var l = _.euler(c, s), m = 0; m < e / s; m++) {
                        var h = s * m + c,
                            p = s * m + c + s / 2,
                            g = { real: t.real[h], imag: t.imag[h] },
                            w = { real: t.real[p], imag: t.imag[p] },
                            v = _.multiply(l, w),
                            d = _.subtract(g, v);
                        (t.real[p] = d.real), (t.imag[p] = d.imag);
                        var y = _.add(v, g);
                        (t.real[h] = y.real), (t.imag[h] = y.imag);
                    }
            return t;
        },
        S = y,
        b = (function () {
            function r(r, t) {
                var e = this;
                if (((this._m = t), !r.audioContext)) throw this._m.errors.noAC;
                if (r.bufferSize && !a(r.bufferSize)) throw this._m._errors.notPow2;
                if (!r.source) throw this._m._errors.noSource;
                (this._m.audioContext = r.audioContext),
                    (this._m.bufferSize = r.bufferSize || this._m.bufferSize || 256),
                    (this._m.hopSize = r.hopSize || this._m.hopSize || this._m.bufferSize),
                    (this._m.sampleRate = r.sampleRate || this._m.audioContext.sampleRate || 44100),
                    (this._m.callback = r.callback),
                    (this._m.windowingFunction = r.windowingFunction || "hanning"),
                    (this._m.featureExtractors = g),
                    (this._m.EXTRACTION_STARTED = r.startImmediately || !1),
                    (this._m.channel = "number" == typeof r.channel ? r.channel : 0),
                    (this._m.inputs = r.inputs || 1),
                    (this._m.outputs = r.outputs || 1),
                    (this._m.numberOfMFCCCoefficients = r.numberOfMFCCCoefficients || this._m.numberOfMFCCCoefficients || 13),
                    (this._m.numberOfBarkBands = r.numberOfBarkBands || this._m.numberOfBarkBands || 24),
                    (this._m.spn = this._m.audioContext.createScriptProcessor(this._m.bufferSize, this._m.inputs, this._m.outputs)),
                    this._m.spn.connect(this._m.audioContext.destination),
                    (this._m._featuresToExtract = r.featureExtractors || []),
                    (this._m.barkScale = i(this._m.bufferSize, this._m.sampleRate, this._m.bufferSize)),
                    (this._m.melFilterBank = f(Math.max(this._m.melBands, this._m.numberOfMFCCCoefficients), this._m.sampleRate, this._m.bufferSize)),
                    (this._m.inputData = null),
                    (this._m.previousInputData = null),
                    (this._m.frame = null),
                    (this._m.previousFrame = null),
                    this.setSource(r.source),
                    (this._m.spn.onaudioprocess = function (r) {
                        var t;
                        null !== e._m.inputData && (e._m.previousInputData = e._m.inputData),
                            (e._m.inputData = r.inputBuffer.getChannelData(e._m.channel)),
                            e._m.previousInputData
                                ? ((t = new Float32Array(e._m.previousInputData.length + e._m.inputData.length - e._m.hopSize)).set(e._m.previousInputData.slice(e._m.hopSize)),
                                  t.set(e._m.inputData, e._m.previousInputData.length - e._m.hopSize))
                                : (t = e._m.inputData),
                            (function (r, t, e) {
                                if (r.length < t) throw new Error("Buffer is too short for frame length");
                                if (e < 1) throw new Error("Hop length cannot be less that 1");
                                if (t < 1) throw new Error("Frame length cannot be less that 1");
                                var a = 1 + Math.floor((r.length - t) / e);
                                return new Array(a).fill(0).map(function (a, n) {
                                    return r.slice(n * e, n * e + t);
                                });
                            })(t, e._m.bufferSize, e._m.hopSize).forEach(function (r) {
                                e._m.frame = r;
                                var t = e._m.extract(e._m._featuresToExtract, e._m.frame, e._m.previousFrame);
                                "function" == typeof e._m.callback && e._m.EXTRACTION_STARTED && e._m.callback(t), (e._m.previousFrame = e._m.frame);
                            });
                    });
            }
            return (
                (r.prototype.start = function (r) {
                    (this._m._featuresToExtract = r || this._m._featuresToExtract), (this._m.EXTRACTION_STARTED = !0);
                }),
                (r.prototype.stop = function () {
                    this._m.EXTRACTION_STARTED = !1;
                }),
                (r.prototype.setSource = function (r) {
                    this._m.source && this._m.source.disconnect(this._m.spn), (this._m.source = r), this._m.source.connect(this._m.spn);
                }),
                (r.prototype.setChannel = function (r) {
                    r <= this._m.inputs ? (this._m.channel = r) : console.error("Channel " + r + " does not exist. Make sure you've provided a value for 'inputs' that is greater than " + r + " when instantiating the MeydaAnalyzer");
                }),
                (r.prototype.get = function (r) {
                    return this._m.inputData ? this._m.extract(r || this._m._featuresToExtract, this._m.inputData, this._m.previousInputData) : null;
                }),
                r
            );
        })(),
        M = {
            audioContext: null,
            spn: null,
            bufferSize: 512,
            sampleRate: 44100,
            melBands: 26,
            chromaBands: 12,
            callback: null,
            windowingFunction: "hanning",
            featureExtractors: g,
            EXTRACTION_STARTED: !1,
            numberOfMFCCCoefficients: 13,
            numberOfBarkBands: 24,
            _featuresToExtract: [],
            windowing: n,
            _errors: {
                notPow2: new Error("Meyda: Buffer size must be a power of 2, e.g. 64 or 512"),
                featureUndef: new Error("Meyda: No features defined."),
                invalidFeatureFmt: new Error("Meyda: Invalid feature format"),
                invalidInput: new Error("Meyda: Invalid input."),
                noAC: new Error("Meyda: No AudioContext specified."),
                noSource: new Error("Meyda: No source node specified."),
            },
            createMeydaAnalyzer: function (r) {
                return new b(r, Object.assign({}, M));
            },
            listAvailableFeatureExtractors: function () {
                return Object.keys(this.featureExtractors);
            },
            extract: function (r, t, e) {
                var n = this;
                if (!t) throw this._errors.invalidInput;
                if ("object" != typeof t) throw this._errors.invalidInput;
                if (!r) throw this._errors.featureUndef;
                if (!a(t.length)) throw this._errors.notPow2;
                (void 0 !== this.barkScale && this.barkScale.length == this.bufferSize) || (this.barkScale = i(this.bufferSize, this.sampleRate, this.bufferSize)),
                    (void 0 !== this.melFilterBank && this.barkScale.length == this.bufferSize && this.melFilterBank.length == this.melBands) ||
                        (this.melFilterBank = f(Math.max(this.melBands, this.numberOfMFCCCoefficients), this.sampleRate, this.bufferSize)),
                    (void 0 !== this.chromaFilterBank && this.chromaFilterBank.length == this.chromaBands) || (this.chromaFilterBank = s(this.chromaBands, this.sampleRate, this.bufferSize)),
                    "buffer" in t && void 0 === t.buffer ? (this.signal = o(t)) : (this.signal = t);
                var u = F(t, this.windowingFunction, this.bufferSize);
                if (((this.signal = u.windowedSignal), (this.complexSpectrum = u.complexSpectrum), (this.ampSpectrum = u.ampSpectrum), e)) {
                    var c = F(e, this.windowingFunction, this.bufferSize);
                    (this.previousSignal = c.windowedSignal), (this.previousComplexSpectrum = c.complexSpectrum), (this.previousAmpSpectrum = c.ampSpectrum);
                }
                var l = function (r) {
                    return n.featureExtractors[r]({
                        ampSpectrum: n.ampSpectrum,
                        chromaFilterBank: n.chromaFilterBank,
                        complexSpectrum: n.complexSpectrum,
                        signal: n.signal,
                        bufferSize: n.bufferSize,
                        sampleRate: n.sampleRate,
                        barkScale: n.barkScale,
                        melFilterBank: n.melFilterBank,
                        previousSignal: n.previousSignal,
                        previousAmpSpectrum: n.previousAmpSpectrum,
                        previousComplexSpectrum: n.previousComplexSpectrum,
                        numberOfMFCCCoefficients: n.numberOfMFCCCoefficients,
                        numberOfBarkBands: n.numberOfBarkBands,
                    });
                };
                if ("object" == typeof r)
                    return r.reduce(function (r, t) {
                        var e;
                        return Object.assign({}, r, (((e = {})[t] = l(t)), e));
                    }, {});
                if ("string" == typeof r) return l(r);
                throw this._errors.invalidFeatureFmt;
            },
        },
        F = function (r, t, e) {
            var a = {};
            void 0 === r.buffer ? (a.signal = o(r)) : (a.signal = r), (a.windowedSignal = n(a.signal, t)), (a.complexSpectrum = S(a.windowedSignal)), (a.ampSpectrum = new Float32Array(e / 2));
            for (var i = 0; i < e / 2; i++) a.ampSpectrum[i] = Math.sqrt(Math.pow(a.complexSpectrum.real[i], 2) + Math.pow(a.complexSpectrum.imag[i], 2));
            return a;
        };
    return "undefined" != typeof window && (window.Meyda = M), M;
});
//# sourceMappingURL=meyda.min.js.map
