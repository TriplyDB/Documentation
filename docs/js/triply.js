// This file we can use to create more customization using Javascript.
const onLoad = window.onload

window.onload = () => {
  hljs.highlightAll()

  if (window.location.pathname.endsWith('search.html')) {
    const li = document.createElement('li')
    li.innerHTML = document.querySelector('h1').innerHTML
    document.querySelector('.wy-breadcrumbs')
      .appendChild(li)

    // document.querySelectorAll('#mkdocs-search-results article h3 a')
    //   .forEach(el => el.innerText = 'aaa' )
  }
  // activate hamburger menu:
  document.querySelector('[data-toggle="wy-nav-top"]').addEventListener('click', (e) => {
    document.querySelectorAll('[data-toggle="wy-nav-shift"]')
      .forEach(el => el.classList.toggle('shift'))
  })

  const activeTOClink = () => {
    const el = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5'))
      .filter(heading => heading.getBoundingClientRect().y <= 40).pop()
    if (el) {
      Array.from(document.querySelectorAll('div.toc a')).map(a => a.classList.remove('active'))
      document.querySelector(`div.toc a[href="#${el.id}"]`)?.classList.add('active')
    }
  }

  if ('onscrollend' in window) {
    document.addEventListener('scrollend', activeTOClink)
  } else {
    document.addEventListener('scroll', () => {
      clearTimeout(window.scrollEndTimer)
      window.scrollEndTimer = setTimeout(activeTOClink, 100)
    })
  }

}
