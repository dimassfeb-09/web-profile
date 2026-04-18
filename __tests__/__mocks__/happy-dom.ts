// Mock happy-dom's Window for Jest (CJS) environment
// @tiptap/html/server uses `new Window()` to create a virtual DOM

class MockElement {
    tagName: string;
    attributes: Record<string, string> = {};
    childNodes: MockElement[] = [];
    innerHTML = '';
    outerHTML = '';
    textContent = '';

    constructor(tagName = '') {
        this.tagName = tagName;
    }

    setAttribute(name: string, value: string) {
        this.attributes[name] = value;
    }
    getAttribute(name: string) {
        return this.attributes[name] ?? null;
    }
    appendChild(child: MockElement) {
        this.childNodes.push(child);
        return child;
    }
    cloneNode() { return new MockElement(this.tagName); }
}

class MockDocument {
    body = new MockElement('body');
    createElement(tag: string) { return new MockElement(tag); }
    createTextNode(text: string) {
        const el = new MockElement('#text');
        el.textContent = text;
        return el;
    }
    createDocumentFragment() { return new MockElement('fragment'); }
}

export class Window {
    document = new MockDocument();
}