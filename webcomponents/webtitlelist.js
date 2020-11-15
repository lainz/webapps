class WebTitleList extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({ mode: 'open' })
        this.setItems(this)
    }

    setItems(elem) {
        const shadow = elem.shadowRoot
        shadow.innerHTML = ''
        var items = this.getAttribute('items')
        if (items) {
            items = JSON.parse(items)
            items.forEach(element => {
                const elm = document.createElement('web-title')
                elm.setAttribute('title', element)
                shadow.appendChild(elm)
            })
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.setItems(this)
    }

    static get observedAttributes() {
        return ['items'];
    }
}

customElements.define('web-title-list', WebTitleList)