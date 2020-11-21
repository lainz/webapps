import { Items } from "./items.js"

const ITEMS = "./data.json"

class App extends HTMLElement {
  constructor() {
    super()
    const shadow = this.attachShadow({ mode: 'open' })

    this.data = []
    this.webtitlelist = document.createElement('web-title-list')
    this.webtitlelist.id = 'titles'
    
    this.search = document.createElement('input')
    this.search.addEventListener('keyup', this.filter.bind(this))
  
    shadow.appendChild(this.search)
    shadow.appendChild(this.webtitlelist)

    this.items = new Items(this.webtitlelist)
    this.populateItems()
  }

  populateItems() {
    fetch(ITEMS)
      .then(response => response.json())
      .then(data => {
        this.data = data
        this.filter()
      })
  }

  filter(event) {
    var search = ''
    if (event) {
      search = event.target.value.toLowerCase()
    }
    if (search) {
      var temp = this.data.filter(element => element.toLowerCase().indexOf(search) != -1)
      this.items.replaceItems(temp)
    } else {
      this.items.replaceItems(this.data)
    }
  }
}

customElements.define('web-app', App)