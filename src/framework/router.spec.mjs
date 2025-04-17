import { expect } from "chai";
import { Router } from "./router.ts";
import sinon from "sinon";

describe('Router test', () => {
    let router;
    let elementConstructor;
    let onRouteSpy;

    function createRouter() {
        return new Router();
    }

    beforeEach(()=>{
        router = createRouter();
        elementConstructor = function() {
            return {
                _render() {
                    return '<div>element</div>';
                },
                hide() {},
                show() {}
            };
        };

        router.use('/test', elementConstructor);
        router.use('/test2', elementConstructor);

        onRouteSpy = sinon.spy(router, "onRoute");
    })

    afterEach(() => {
        onRouteSpy.restore();
    });

    it('Router must be created', ()=> {
        expect(router).to.be.ok;
    });

    it('Router must remember the route when use called', () => {
        router.use('/test3', elementConstructor);
        expect(router.routes.length).to.be.equal(3);
        expect(router.routes[2].pathname).to.be.equal('/test3');
    });

    it("should call history.pushState and onRoute when go is called", () => {
        const pushStateSpy = sinon.spy(window.history, "pushState");
        router.go("/test");
    
        expect(pushStateSpy.calledWith({}, "", "/test")).to.be.true;
        expect(onRouteSpy.calledWith("/test")).to.be.true;
    
        pushStateSpy.restore();
    });
    
    it("should call history.back when back is called", () => {
        const backSpy = sinon.spy(window.history, "back");
        router.back();
        expect(backSpy.calledOnce).to.be.true;
        backSpy.restore();
    });
    
    it("should call history.forward when forward is called", () => {
        const forwardSpy = sinon.spy(window.history, "forward");
        router.forward();
        expect(forwardSpy.calledOnce).to.be.true;
        forwardSpy.restore();
    });
})

