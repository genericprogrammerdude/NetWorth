/**
 * Credit for this goes to olanod.
 * https://gist.github.com/olanod/ede8befb771057bb004c4f57be591640
 */
const templates = Object.create(null, {
  load: {
    value: async function(fileName) {
      const url = new URL(fileName,
        document.currentScript && document.currentScript.src || location.href)
      if (url in this) return this[url]
      // fetch and parse template as string
      let template = await fetch(url)
      template = await template.text()
      template = new DOMParser().parseFromString(template, 'text/html')
        .querySelector('template')
      if (!template) throw new TypeError('No template element found')
      // overwrite link tags' hrefs asuming they're always relative to the template
      for (let link of template.content.querySelectorAll('link')) {
        let href = document.importNode(link).href
        href = new URL(href).pathname.substr(1)
        link.href = new URL(href, url).href
      }
      document.head.append(template)
      this[url] = template
      return template
    }
  }
})