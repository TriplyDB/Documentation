// This file we can use to create more customization using Javascript.
const onLoad = window.onload

const prefix = window.location.hostname === 'triplydb.github.io' ? '/Documentation' : ''

const customUrlMappingLevel1 = new Map([
  ['Generics', '/triply-etl'],
  ['Extract', '/triply-etl/extract'],
  ['Transform', '/triply-etl/transform'],
  ['Assert', '/triply-etl/assert'],
  ['Enrich', '/triply-etl/enrich'],
  ['Validate', '/triply-etl/validate'],
  ['Getting started', '/triply-db-getting-started'],
  ['TriplyDB-JS', '/triplydb-js']
])

const customUrlMappingLevel2 = new Map([
  ['RATT', '/triply-etl/assert/ratt/statement'],
])

window.onload = () => {
  hljs.highlightAll()
  Array.from(document.querySelectorAll('.toctree-l1 a'))
    .filter(el => customUrlMappingLevel1.has(el.innerText))
    .map(el => el.href = customUrlMappingLevel1.get(`${prefix}${el.innerText}`))

  Array.from(document.querySelectorAll('.toctree-l2 a'))
    .filter(el => customUrlMappingLevel2.has(el.innerText))
    .map(el => el.href = customUrlMappingLevel2.get(`${prefix}${el.innerText}`))

  if (window.location.pathname.endsWith('search.html')) {
    const li = document.createElement('li')
    li.innerHTML = document.querySelector('h1').innerHTML
    document.querySelector('.wy-breadcrumbs')
      .appendChild(li)

    document.querySelectorAll('#mkdocs-search-results article h3 a')
      .forEach(el => el.innerText = 'aaa' )
  }

  // if (typeof onLoad === 'function') onLoad()
}