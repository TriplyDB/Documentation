// This file we can use to create more customization using Javascript.
const onLoad = window.onload

// The preview site at docs.triply.cc/next/ documents the unreleased TriplyDB version. It is built
// from the same sources as the live site and is otherwise indistinguishable from it, so say so on
// every page. Deciding this from the path rather than from a build flag is what keeps `master` and
// `next` byte-identical here: the file is the same on both branches and never merge-conflicts.
//
// This runs at parse time rather than from the `window.onload` below, because the theme loads this
// script deferred at the end of <body>: the DOM is ready, and waiting for images would let a
// reader start on the page before being told which site they are on.
if (/^\/next(\/|$)/.test(window.location.pathname)) {
  document.body.classList.add('triply-preview')

  const banner = document.createElement('aside')
  banner.className = 'triply-preview-banner'
  banner.setAttribute('aria-label', 'Preview notice')
  banner.innerHTML =
    '<strong>Preview</strong> \u2014 documentation for the next TriplyDB release. ' +
    'For the version in production, see <a href="/">docs.triply.cc</a>.'
  document.body.prepend(banner)

  // The bar is fixed to the bottom of the viewport, so the layout has to be told how much room it
  // takes -- which depends on where the sentence wraps, and so on the viewport width.
  const measure = () =>
    document.documentElement.style.setProperty('--preview-banner-height', `${banner.offsetHeight}px`)
  measure()
  window.addEventListener('resize', measure)
}

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
