class WebTitle extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({ mode: 'open' })
        const h1 = document.createElement('h1')

        const style = document.createElement('style')
        style.textContent = `
          .test {
            font-weight: bold;
            color: ${this.getAttribute('color')};
          }
        `
        h1.addEventListener('click', () => {
            alert('hello world')
        })
        shadow.appendChild(style)
        shadow.appendChild(h1)
        this.updateStyle(this)
    }

    updateStyle(elem) {
        const shadow = elem.shadowRoot
        shadow.querySelector('h1').innerHTML = this.getAttribute('title')
        shadow.querySelector('h1').setAttribute('class', 'test')
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.updateStyle(this);
    }

    static get observedAttributes() {
        return ['title'];
    }
}

customElements.define('web-title', WebTitle)