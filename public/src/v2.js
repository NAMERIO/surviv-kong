"use strict";


function min(a, b) {
    return a < b ? a : b;
}

function max(a, b) {
    return a > b ? a : b;
}

var v2 = {
    create: function create(x, y) {
        return { x: x, y: y !== undefined ? y : x };
    },

    copy: function copy(vec) {
        return { x: vec.x, y: vec.y };
    },

    set: function set(a, b) {
        a.x = b.x;
        a.y = b.y;
    },

    add: function add(a, b) {
        return { x: a.x + b.x, y: a.y + b.y };
    },

    sub: function sub(a, b) {
        return { x: a.x - b.x, y: a.y - b.y };
    },

    mul: function mul(a, s) {
        return { x: a.x * s, y: a.y * s };
    },

    div: function div(a, s) {
        return { x: a.x / s, y: a.y / s };
    },

    neg: function neg(a) {
        return { x: -a.x, y: -a.y };
    },

    lengthSqr: function lengthSqr(a) {
        return a.x * a.x + a.y * a.y;
    },

    length: function length(a) {
        return Math.sqrt(v2.lengthSqr(a));
    },

    normalize: function normalize(a) {
        var eps = 0.000001;
        var len = v2.length(a);
        return {
            x: len > eps ? a.x / len : a.x,
            y: len > eps ? a.y / len : a.y
        };
    },

    distance: function distance(startPos, finishPos) {
        var diffPos = v2.sub(startPos, finishPos);
        return v2.length(diffPos);
    },

    directionNormalized: function directionNormalized(a, b) {
        var diffPos = v2.sub(b, a);
        return v2.normalize(diffPos);
    },

    normalizeSafe: function normalizeSafe(a, v) {
        v = v || v2.create(1.0, 0.0);
        var eps = 0.000001;
        var len = v2.length(a);
        return {
            x: len > eps ? a.x / len : v.x,
            y: len > eps ? a.y / len : v.y
        };
    },

    dot: function dot(a, b) {
        return a.x * b.x + a.y * b.y;
    },

    perp: function perp(a) {
        return { x: -a.y, y: a.x };
    },

    proj: function proj(a, b) {
        return v2.mul(b, v2.dot(a, b) / v2.dot(b, b));
    },

    rotate: function rotate(a, rad) {
        var cosr = Math.cos(rad);
        var sinr = Math.sin(rad);
        return {
            x: a.x * cosr - a.y * sinr,
            y: a.x * sinr + a.y * cosr
        };
    },

    mulElems: function mulElems(a, b) {
        return { x: a.x * b.x, y: a.y * b.y };
    },

    divElems: function divElems(a, b) {
        return { x: a.x / b.x, y: a.y / b.y };
    },

    minElems: function minElems(a, b) {
        return { x: min(a.x, b.x), y: min(a.y, b.y) };
    },

    maxElems: function maxElems(a, b) {
        return { x: max(a.x, b.x), y: max(a.y, b.y) };
    },

    randomUnit: function randomUnit() {
        return v2.normalizeSafe(v2.create(Math.random() - 0.5, Math.random() - 0.5), v2.create(1.0, 0.0));
    },

    lerp: function lerp(t, a, b) {
        return v2.add(v2.mul(a, 1.0 - t), v2.mul(b, t));
    },

    eq: function eq(a, b, epsilon) {
        var eps = epsilon !== undefined ? epsilon : 0.0001;
        return Math.abs(a.x - b.x) <= eps && Math.abs(a.y - b.y) <= eps;
    }
};

module.exports = v2;
