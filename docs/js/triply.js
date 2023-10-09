// This file we can use to create more customization using Javascript.
const onLoad = window.onload
window.onload = () => {
  hljs.highlightAll()
  if (typeof onLoad === 'function') onLoad()
}