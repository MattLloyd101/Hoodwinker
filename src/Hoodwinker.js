"use strict";

module.exports = class Hoodwinker {

    constructor(original = null) {
        this.original = this.hoodwinkTarget = original;
        this.hoodwink = new Proxy(original, this);
    }

    setHoodwinkTarget(target) {
        this.hoodwinkTarget = target;
    }

    reset() {
        this.hoodwinkTarget = this.original;
    }

    getPrototypeOf(_) {
        return Object.getPrototypeOf(this.hoodwinkTarget);
    }

    setPrototypeOf(_, prototype) {
        return Object.setPrototypeOf(this.hoodwinkTarget, prototype);
    }

    isExtensible(_) {
        return Object.isExtensible(this.hoodwinkTarget);
    }

    preventExtensions(_) {
        return Object.preventExtensions(this.hoodwinkTarget);
    }

    getOwnPropertyDescriptor(_, prop) {
        return Object.getOwnPropertyDescriptor(this.hoodwinkTarget, prop);
    }

    defineProperty(_, key, descriptor) {
        return Object.defineProperty(this.hoodwinkTarget, key, descriptor);
    }

    has (_, key) {
        return key in this.hoodwinkTarget;
    }

    get(_, prop, receiver) {
        return this.hoodwinkTarget[prop];
    }

    set(_, prop, value) {
        return this.hoodwinkTarget[prop] = value;
    }

    deleteProperty(_, prop) {
        return delete this.hoodwinkTarget[prop];
    }

    ownKeys (_) {
        return Reflect.ownKeys(this.hoodwinkTarget);
    }

    apply(_, thisArg, argumentsList) {
        return this.hoodwinkTarget.apply(thisArg, argumentsList);
    }

    construct(_, args) {
        return new this.hoodwinkTarget(...args);
    }
}