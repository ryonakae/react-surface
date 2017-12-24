require('canvas-prebuilt');
const {JSDOM} = require('jsdom');
const jsdom = new JSDOM();
(global as any).window = jsdom.window;
(global as any).document = jsdom.window.document;
