import { JSDOM } from "jsdom";

const url = 'https://www.ya.ru';
const jsdom = new JSDOM('<!doctype html><html><body></body></html>', {url: url});

global.window = jsdom.window;
global.document = jsdom.window.document;
global.MouseEvent = jsdom.window.MouseEvent;
global.history = jsdom.window.history;
global.PopStateEvent = jsdom.window.PopStateEvent;
global.Node = jsdom.window.Node;
global.HTMLElement = jsdom.window.HTMLElement;
global.HTMLDivElement = jsdom.window.HTMLDivElement;
global.customElements = jsdom.window.customElements;

// take all properties of the window object and also attach it to the 
// mocha global object
propagateToGlobal(window);

// from mocha-jsdom https://github.com/rstacruz/mocha-jsdom/blob/master/index.js#L80
function propagateToGlobal (window) {
  for (let key in window) {
    if (!window.hasOwnProperty(key)) continue
    if (key in global) continue

    global[key] = window[key]
  }
}
