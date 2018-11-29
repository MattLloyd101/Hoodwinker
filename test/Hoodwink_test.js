const chai = require('chai')
const expect = chai.expect;
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);

const Hoodwinker = require('../src/Hoodwinker');

const getPrototypeOf = Object.getPrototypeOf;
const setPrototypeOf = Object.setPrototypeOf;
const isExtensible = Object.isExtensible;
const preventExtensions = Object.preventExtensions;
const getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
const defineProperty = Object.defineProperty;;

describe('Hoodwinker', () => {

    describe('when switching target', () => {

        let hoodwinker;
        let hoodwink;
        let target; 
        let target2;

        beforeEach(() => {
            target = { "original": true, "a": 42, "deleteMe": true };
            target2 = { "original": false, "b": 52, "deleteMe": true };

            hoodwinker = new Hoodwinker(target);
            hoodwink = hoodwinker.hoodwink;
        });

        it('should proxy setPrototypeOf', () => {
            const proto = {'isProto': true};
            const spy = sinon.spy(Object, "setPrototypeOf");

            setPrototypeOf(hoodwink, proto);

            expect(spy).to.have.been.calledWith(target, proto);

            hoodwinker.setHoodwinkTarget(target2);

            setPrototypeOf(hoodwink, proto);

            expect(spy).to.have.been.calledWith(target2, proto);
            Object.setPrototypeOf = setPrototypeOf;
        });

        it('should proxy getPrototypeOf', () => {
            const spy = sinon.spy(Object, "getPrototypeOf");

            getPrototypeOf(hoodwink);

            expect(spy).to.have.been.calledWith(target);

            hoodwinker.setHoodwinkTarget(target2);
            getPrototypeOf(hoodwink);

            expect(spy).to.have.been.calledWith(target2);
            Object.getPrototypeOf = getPrototypeOf;
        });

        it('should proxy isExtensible', () => {
            const spy = sinon.spy(Object, "isExtensible");

            isExtensible(hoodwink);

            expect(spy).to.have.been.calledWith(target);

            hoodwinker.setHoodwinkTarget(target2);
            isExtensible(hoodwink);

            expect(spy).to.have.been.calledWith(target2);
            Object.isExtensible = isExtensible;
        });

        it('should proxy preventExtensions', () => {
            const spy = sinon.spy(Object, "preventExtensions");

            preventExtensions(hoodwink);

            expect(spy).to.have.been.calledWith(target);

            hoodwinker.setHoodwinkTarget(target2);
            preventExtensions(hoodwink);

            expect(spy).to.have.been.calledWith(target2);
            Object.preventExtensions = preventExtensions;
        });
        
        it('should proxy getOwnPropertyDescriptor', () => {
            const spy = sinon.spy(Object, "getOwnPropertyDescriptor");

            getOwnPropertyDescriptor(hoodwink, 'original');

            expect(spy).to.have.been.calledWith(target, 'original');

            hoodwinker.setHoodwinkTarget(target2);
            getOwnPropertyDescriptor(hoodwink, 'original');

            expect(spy).to.have.been.calledWith(target2, 'original');
            Object.getOwnPropertyDescriptor = getOwnPropertyDescriptor;
        });

        it('should proxy defineProperty', () => {
            const spy = sinon.spy(Object, "defineProperty");
            const desciptor = { value: 42, writable: true };
            defineProperty(hoodwink, 'newField', desciptor);

            expect(spy).to.have.been.calledWith(target, 'newField', desciptor);

            hoodwinker.setHoodwinkTarget(target2);
            defineProperty(hoodwink, 'newField', desciptor);

            expect(spy).to.have.been.calledWith(target2, 'newField', desciptor);
            Object.defineProperty = defineProperty;
        });

        it('should proxy has', () => {
            expect("a" in hoodwink).to.be.true;

            hoodwinker.setHoodwinkTarget(target2);
            expect("a" in hoodwink).to.be.false;
        });

        it('should proxy get', () => {
            expect(hoodwink.a).to.equal(42);
            expect(hoodwink['a']).to.equal(42);

            hoodwinker.setHoodwinkTarget(target2);
            expect(hoodwink.a).to.be.undefined;
            expect(hoodwink['a']).to.be.undefined;
        });  

        it('should proxy set', () => {
            hoodwink.a = "test1";
            expect(target.a).to.equal("test1");

            hoodwinker.setHoodwinkTarget(target2);
            hoodwink.a = "test2";
            expect(target.a).to.equal("test1");
            expect(target2.a).to.equal("test2");
        });  

        it('should proxy delete', () => {
            expect(hoodwink.deleteMe).to.equal(true);
            delete hoodwink.deleteMe;
            expect(target.deleteMe).to.be.undefined;

            hoodwinker.setHoodwinkTarget(target2);
            expect(hoodwink.deleteMe).to.equal(true);
            delete hoodwink.deleteMe;
            expect(target2.deleteMe).to.be.undefined;
        });  

        it('should proxy ownKeys', () => {
            expect(Object.keys(hoodwink)).to.eql(["original", "a", "deleteMe"]);

            hoodwinker.setHoodwinkTarget(target2);
            expect(Object.keys(hoodwink)).to.eql(["original", "b", "deleteMe"]);
        });  

        it('should proxy apply', () => {
            const fn1 = function (a) { return 20 + a; };
            const fn2 = function (b) { return 10 - b; };
            const hoodwinker = new Hoodwinker(fn1);
            const hoodwink = hoodwinker.hoodwink;

            expect(hoodwink(5)).to.equal(25);
            hoodwinker.setHoodwinkTarget(fn2);
            expect(hoodwink(5)).to.equal(5);
        });

        it('should proxy apply for lambdas', () => {
            const fn1 = (a) => { return 20 + a; };
            const fn2 = (b) => { return 10 - b; };
            const hoodwinker = new Hoodwinker(fn1);
            const hoodwink = hoodwinker.hoodwink;

            expect(hoodwink(5)).to.equal(25);
            hoodwinker.setHoodwinkTarget(fn2);
            expect(hoodwink(5)).to.equal(5);
        });

        it('should proxy new', () => {
            const class1 = class TestClass1 { constructor(value) { this.a = value; } }
            const class2 = class TestClass2 { constructor(value) { this.b = value; } }
            const hoodwinker = new Hoodwinker(class1);
            const hoodwink = hoodwinker.hoodwink;

            const instance1 = new hoodwink("hello world");
            expect(instance1).to.not.be.null;
            expect(instance1.a).to.equal("hello world");

            hoodwinker.setHoodwinkTarget(class2);

            const instance2 = new hoodwink("hello world");
            expect(instance2).to.not.be.null;
            expect(instance2.b).to.equal("hello world");
        });
    });

});