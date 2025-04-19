import { expect } from "chai";
import sinon from "sinon";
import assert from 'node:assert/strict';
import { EVENTS, BaseComponent } from "./basecomponent";

class FakeComponent extends BaseComponent {
    template = '<div>Fake component</div>';
    _meta = {
        selector:'f-cmp',
        tagName: 'div'
    };

    constructor() {
        super();
        this.eventBus.emit(EVENTS.INIT);
    }
}

globalThis.customElements.define('fake-component', FakeComponent);

describe('Component', () => {
    let component;

    beforeEach(()=> {
        component = new FakeComponent();
    });

    it('Should exist', () => {
        expect(component).to.be.ok;
    });

    it('Should contain a given HTML after rendering', () => {
        component._render();
        const content = component.getContent();
        expect(content.innerHTML).to.be.equal('<div>Fake component</div>');
    });

    it('Should assign event listeners on render', () => {
        const assignSpy = sinon.spy(component, '_assignEvents');
        component._render();
        expect(assignSpy.called).to.be.true;
    });

    it('Should change style.display on hide', () => {
        component._render();
        expect(component.style.display).to.be.equal('contents');
        component.hide();
        expect(component.style.display).to.be.equal('none');
    });

    it('Should contain HTML element according to given tag', () => {
        component._render();
        expect(component._element.constructor.name).to.be.equal('HTMLDivElement');
    });

    it('Should contain valid proxy', () => {
        component._render();
        expect(component.proxy).to.be.instanceOf(FakeComponent);
    });

    it('Should render on update event', () => {
        const renderSpy = sinon.spy(component, '_render');
        component.eventBus.emit(EVENTS.FLOW_CDU);
        expect(renderSpy.called).to.be.true;
    });

    it('Should have CSS class according to given constructor name', () => {
        component._render();
        const content = component.getContent();
        expect(content.classList.contains('fakecomponent')).to.be.true;
    });

    it('Should be able to find parent instance of BaseComponent', () => {
        const parent = new FakeComponent();
        const div = document.createElement("div");
        div.appendChild(component);
        parent.appendChild(div);
        const foundParent = component.getParentComponent(component);
        expect(foundParent).to.be.equal(parent);
    });
});
