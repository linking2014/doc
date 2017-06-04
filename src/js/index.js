var $ = require('./jquery');
require('./jquery.easing');
var hljs = require('./highlight.pack');
var Waves = require('./waves');
var throttle = require('lodash.throttle');
var $window = $(window);
// var scrollTop = $window.scrollTop();
var windowHeight = $window.height();
var $body = $('body');
var $header = $('.header-fixed');
var headerHeight = $header.height();
var $fab = $('.fab');

// var shadowPos1 = $;
var scrolling = false;

$(function(){

    hljs.registerLanguage("markdown", function (e) {
        return {
            aliases: ["md", "mkdown", "mkd"],
            c: [{cN: "section", v: [{b: "^#{1,6}", e: "$"}, {b: "^.+?\\n[=-]{2,}$"}]}, {
                b: "<",
                e: ">",
                sL: "xml",
                r: 0
            }, {cN: "bullet", b: "^([*+-]|(\\d+\\.))\\s+"}, {cN: "strong", b: "[*_]{2}.+?[*_]{2}"}, {
                cN: "emphasis",
                v: [{b: "\\*.+?\\*"}, {b: "_.+?_", r: 0}]
            }, {cN: "quote", b: "^>\\s+", e: "$"}, {
                cN: "code",
                v: [{b: "^```w*s*$", e: "^```s*$"}, {b: "`.+?`"}, {b: "^( {4}|	)", e: "$", r: 0}]
            }, {b: "^[-\\*]{3,}", e: "$"}, {
                b: "\\[.+?\\][\\(\\[].*?[\\)\\]]",
                rB: !0,
                c: [{cN: "string", b: "\\[", e: "\\]", eB: !0, rE: !0, r: 0}, {
                    cN: "link",
                    b: "\\]\\(",
                    e: "\\)",
                    eB: !0,
                    eE: !0
                }, {cN: "symbol", b: "\\]\\[", e: "\\]", eB: !0, eE: !0}],
                r: 10
            }, {
                b: /^\[[^\n]+\]:/,
                rB: !0,
                c: [{cN: "symbol", b: /\[/, e: /\]/, eB: !0, eE: !0}, {cN: "link", b: /:\s*/, e: /$/, eB: !0}]
            }]
        }
    });
    hljs.registerLanguage("json", function (e) {
        var i = {literal: "true false null"}, n = [e.QSM, e.CNM], r = {e: ",", eW: !0, eE: !0, c: n, k: i}, t = {
            b: "{",
            e: "}",
            c: [{cN: "attr", b: /"/, e: /"/, c: [e.BE], i: "\\n"}, e.inherit(r, {b: /:/})],
            i: "\\S"
        }, c = {b: "\\[", e: "\\]", c: [e.inherit(r)], i: "\\S"};
        return n.splice(n.length, 0, t, c), {c: n, k: i, i: "\\S"}
    });
    hljs.registerLanguage("javascript", function (e) {
        return {
            aliases: ["js", "jsx"],
            k: {
                keyword: "in of if for while finally var new function do return void else break catch instanceof with throw case default try this switch continue typeof delete let yield const export super debugger as async await static import from as",
                literal: "true false null undefined NaN Infinity",
                built_in: "eval isFinite isNaN parseFloat parseInt decodeURI decodeURIComponent encodeURI encodeURIComponent escape unescape Object Function Boolean Error EvalError InternalError RangeError ReferenceError StopIteration SyntaxError TypeError URIError Number Math Date String RegExp Array Float32Array Float64Array Int16Array Int32Array Int8Array Uint16Array Uint32Array Uint8Array Uint8ClampedArray ArrayBuffer DataView JSON Intl arguments require module console window document Symbol Set Map WeakSet WeakMap Proxy Reflect Promise"
            },
            c: [{cN: "meta", r: 10, b: /^\s*['"]use (strict|asm)['"]/}, {
                cN: "meta",
                b: /^#!/,
                e: /$/
            }, e.ASM, e.QSM, {
                cN: "string",
                b: "`",
                e: "`",
                c: [e.BE, {cN: "subst", b: "\\$\\{", e: "\\}"}]
            }, e.CLCM, e.CBCM, {
                cN: "number",
                v: [{b: "\\b(0[bB][01]+)"}, {b: "\\b(0[oO][0-7]+)"}, {b: e.CNR}],
                r: 0
            }, {
                b: "(" + e.RSR + "|\\b(case|return|throw)\\b)\\s*",
                k: "return throw case",
                c: [e.CLCM, e.CBCM, e.RM, {
                    b: /</,
                    e: /(\/\w+|\w+\/)>/,
                    sL: "xml",
                    c: [{b: /<\w+\s*\/>/, skip: !0}, {b: /<\w+/, e: /(\/\w+|\w+\/)>/, skip: !0, c: ["self"]}]
                }],
                r: 0
            }, {
                cN: "function",
                bK: "function",
                e: /\{/,
                eE: !0,
                c: [e.inherit(e.TM, {b: /[A-Za-z$_][0-9A-Za-z$_]*/}), {
                    cN: "params",
                    b: /\(/,
                    e: /\)/,
                    eB: !0,
                    eE: !0,
                    c: [e.CLCM, e.CBCM]
                }],
                i: /\[|%/
            }, {b: /\$[(.]/}, e.METHOD_GUARD, {
                cN: "class",
                bK: "class",
                e: /[{;=]/,
                eE: !0,
                i: /[:"\[\]]/,
                c: [{bK: "extends"}, e.UTM]
            }, {bK: "constructor", e: /\{/, eE: !0}],
            i: /#(?!!)/
        }
    });
    hljs.registerLanguage("php", function (e) {
        var c = {b: "\\$+[a-zA-Z_-ÿ][a-zA-Z0-9_-ÿ]*"}, i = {cN: "meta", b: /<\?(php)?|\?>/}, t = {
            cN: "string",
            c: [e.BE, i],
            v: [{b: 'b"', e: '"'}, {b: "b'", e: "'"}, e.inherit(e.ASM, {i: null}), e.inherit(e.QSM, {i: null})]
        }, a = {v: [e.BNM, e.CNM]};
        return {
            aliases: ["php3", "php4", "php5", "php6"],
            cI: !0,
            k: "and include_once list abstract global private echo interface as static endswitch array null if endwhile or const for endforeach self var while isset public protected exit foreach throw elseif include __FILE__ empty require_once do xor return parent clone use __CLASS__ __LINE__ else break print eval new catch __METHOD__ case exception default die require __FUNCTION__ enddeclare final try switch continue endfor endif declare unset true false trait goto instanceof insteadof __DIR__ __NAMESPACE__ yield finally",
            c: [e.HCM, e.C("//", "$", {c: [i]}), e.C("/\\*", "\\*/", {
                c: [{
                    cN: "doctag",
                    b: "@[A-Za-z]+"
                }]
            }), e.C("__halt_compiler.+?;", !1, {eW: !0, k: "__halt_compiler", l: e.UIR}), {
                cN: "string",
                b: /<<<['"]?\w+['"]?$/,
                e: /^\w+;?$/,
                c: [e.BE, {cN: "subst", v: [{b: /\$\w+/}, {b: /\{\$/, e: /\}/}]}]
            }, i, {
                cN: "keyword",
                b: /\$this\b/
            }, c, {b: /(::|->)+[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*/}, {
                cN: "function",
                bK: "function",
                e: /[;{]/,
                eE: !0,
                i: "\\$|\\[|%",
                c: [e.UTM, {cN: "params", b: "\\(", e: "\\)", c: ["self", c, e.CBCM, t, a]}]
            }, {
                cN: "class",
                bK: "class interface",
                e: "{",
                eE: !0,
                i: /[:\(\$"]/,
                c: [{bK: "extends implements"}, e.UTM]
            }, {bK: "namespace", e: ";", i: /[\.']/, c: [e.UTM]}, {bK: "use", e: ";", c: [e.UTM]}, {b: "=>"}, t, a]
        }
    });
    hljs.registerLanguage("css", function (e) {
        var c = "[a-zA-Z-][a-zA-Z0-9_-]*", t = {
            b: /[A-Z\_\.\-]+\s*:/,
            rB: !0,
            e: ";",
            eW: !0,
            c: [{
                cN: "attribute",
                b: /\S/,
                e: ":",
                eE: !0,
                starts: {
                    eW: !0,
                    eE: !0,
                    c: [{
                        b: /[\w-]+\(/,
                        rB: !0,
                        c: [{cN: "built_in", b: /[\w-]+/}, {b: /\(/, e: /\)/, c: [e.ASM, e.QSM]}]
                    }, e.CSSNM, e.QSM, e.ASM, e.CBCM, {cN: "number", b: "#[0-9A-Fa-f]+"}, {cN: "meta", b: "!important"}]
                }
            }]
        };
        return {
            cI: !0,
            i: /[=\/|'\$]/,
            c: [e.CBCM, {cN: "selector-id", b: /#[A-Za-z0-9_-]+/}, {
                cN: "selector-class",
                b: /\.[A-Za-z0-9_-]+/
            }, {cN: "selector-attr", b: /\[/, e: /\]/, i: "$"}, {
                cN: "selector-pseudo",
                b: /:(:)?[a-zA-Z0-9\_\-\+\(\)"'.]+/
            }, {b: "@(font-face|page)", l: "[a-z-]+", k: "font-face page"}, {
                b: "@",
                e: "[{;]",
                i: /:/,
                c: [{cN: "keyword", b: /\w+/}, {b: /\s/, eW: !0, eE: !0, r: 0, c: [e.ASM, e.QSM, e.CSSNM]}]
            }, {cN: "selector-tag", b: c, r: 0}, {b: "{", e: "}", i: /\S/, c: [e.CBCM, t]}]
        }
    });
    hljs.registerLanguage("xml", function (s) {
        var e = "[A-Za-z0-9\\._:-]+", t = {
            eW: !0,
            i: /</,
            r: 0,
            c: [{cN: "attr", b: e, r: 0}, {
                b: /=\s*/,
                r: 0,
                c: [{cN: "string", endsParent: !0, v: [{b: /"/, e: /"/}, {b: /'/, e: /'/}, {b: /[^\s"'=<>`]+/}]}]
            }]
        };
        return {
            aliases: ["html", "xhtml", "rss", "atom", "xjb", "xsd", "xsl", "plist"],
            cI: !0,
            c: [{
                cN: "meta",
                b: "<!DOCTYPE",
                e: ">",
                r: 10,
                c: [{b: "\\[", e: "\\]"}]
            }, s.C("<!--", "-->", {r: 10}), {b: "<\\!\\[CDATA\\[", e: "\\]\\]>", r: 10}, {
                b: /<\?(php)?/,
                e: /\?>/,
                sL: "php",
                c: [{b: "/\\*", e: "\\*/", skip: !0}]
            }, {
                cN: "tag",
                b: "<style(?=\\s|>|$)",
                e: ">",
                k: {name: "style"},
                c: [t],
                starts: {e: "</style>", rE: !0, sL: ["css", "xml"]}
            }, {
                cN: "tag",
                b: "<script(?=\\s|>|$)",
                e: ">",
                k: {name: "script"},
                c: [t],
                starts: {e: "</script>", rE: !0, sL: ["actionscript", "javascript", "handlebars", "xml"]}
            }, {cN: "meta", v: [{b: /<\?xml/, e: /\?>/, r: 10}, {b: /<\?\w+/, e: /\?>/}]}, {
                cN: "tag",
                b: "</?",
                e: "/?>",
                c: [{cN: "name", b: /[^\/><\s]+/, r: 0}, t]
            }]
        }
    });

    hljs.initHighlightingOnLoad();

    var bgElement = document.getElementsByClassName('header')[0];
    var bgHeight = parseInt(window.getComputedStyle(bgElement, ':before').getPropertyValue('height'));
    var cardHeight = $('.card:first').offset().top;
    var $header = $('.header');
    var $headerFixed = $('.header-fixed');
    var headerHeight = $header.height();
    var posShadowCenter = cardHeight - headerHeight;
    var posShadowWide = bgHeight - headerHeight;

    var $cardHeader = $('.card-header');
    var $cardTitle = $('.card-header-title');
    var posHeader = $cardHeader.offset().top + $cardHeader.height() - $cardTitle.height();
    var i = 0;

    $window.on('scroll', throttle(scrollCal, 10));

    function scrollCal() {
        console.log(i++);
        $cardHeader.toggleClass('active', $window.scrollTop() >= posHeader);
        $('.header-fixed, .fab').toggleClass('active', $window.scrollTop() >= posHeader);
    }

    $fab.on('click',function () {
        if(scrolling == false) {
            scrolling = true;
            $body.animate({scrollTop: 0}, {easing: 'easeInOutQuint', duration: 600, complete: function () {
                scrolling = false;
            }});
        }
    });

    Waves.init({
        // duration: 600,
        // delay: 200
    });

    Waves.attach('.waves-float', ['waves-float']);
    Waves.attach('.waves-light', ['waves-light']);

});
