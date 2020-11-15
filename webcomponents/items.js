import "./webtitle.js"
import "./webtitlelist.js"

class Items {
    constructor(webitemslist) {
        this.webitemslist = webitemslist
        this.items = []
    }

    addItem(name) {
        this.items.push(name)
        this.updateItems()
    }

    replaceItems(items) {
        this.items = items.slice()
        this.updateItems()
    }

    getItems() {
        return JSON.stringify(this.items)
    }

    updateItems() {
        this.webitemslist.setAttribute('items', this.getItems())
    }
}

export { Items };