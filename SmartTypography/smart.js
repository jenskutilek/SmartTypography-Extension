/* jshint esversion: 6 */

let openDoubleQuote, openSingleQuote, closeDoubleQuote, closeSingleQuote, enDash

function findLanguage (el) {
  if (el.hasAttribute('lang')) {
    return el.getAttribute('lang')
  }
  while (el && el.parentNode && el.parentNode.nodeName !== '#document') {
    el = el.parentNode
    if (el.hasAttribute('lang')) {
      return el.getAttribute('lang')
    }
  }
  return null
}

function replaceInChildren (element, lang) {
  element.childNodes.forEach(child => {
    if (
      child.childNodes &&
      child.nodeName === 'SPAN'
    ) {
      const lang = findLanguage(child)
      replaceInChildren(child, lang)
    }
    replaceText(lang, child)
  })
}

function findAndReplace (elements) {
  elements.forEach(element => {
    const lang = findLanguage(element)
    replaceInChildren(element, lang)
  })
}

function replaceOpenDoubleQuote (text, char) {
  return text.replace(/(\s|^|\()"/gi, `$1${char}`)
}

function replaceOpenSingleQuote (text, char) {
  return text.replace(/(\s|^|\()'/gi, `$1${char}`)
}

function replaceCloseDoubleQuote (text, char) {
  text = text.replace(/(\w|[!?.,]|'|\))"/gi, `$1${char}`)
  return text.replace(/"[$,]/gi, char)
}

function replaceCloseSingleQuote (text, char) {
  text = text.replace(/(\w|"|\))'/gi, `$1${char}`)
  return text.replace(/'[$,]/gi, char)
}

function replaceEnDash (text, char) {
  return text.replace(/ - /gi, char)
}

function replaceText (lang, node) {
  let value = node.nodeValue
  if (value) {
    // apostrophe is the same for any language
    value = value.replace(/(\w)['´`](\w)['´`](\w)/gi, '$1’$2’$3')
    value = value.replace(/(\w)['´`](\w)/gi, '$1’$2')
    value = value.replace(/CO2/g, 'CO₂')
    value = value.replace(/H2O/g, 'H₂O')

    switch (lang) {
      case 'de':
      case 'de-AT':
      case 'de-DE':
        openDoubleQuote = '„'
        openSingleQuote = '‚'
        closeDoubleQuote = '“'
        closeSingleQuote = '‘'
        enDash = ' – '
        break
      case 'de-CH':
        openDoubleQuote = '«'
        openSingleQuote = '‹'
        closeDoubleQuote = '»'
        closeSingleQuote = '›'
        enDash = ' – '
        break
      default:
        openDoubleQuote = '“'
        openSingleQuote = '‘'
        closeDoubleQuote = '”'
        closeSingleQuote = '’'
        enDash = ' — '
    }
    value = replaceOpenDoubleQuote(value, openDoubleQuote)
    value = replaceOpenSingleQuote(value, openSingleQuote)
    value = replaceCloseDoubleQuote(value, closeDoubleQuote)
    value = replaceCloseSingleQuote(value, closeSingleQuote)
    value = replaceEnDash(value, enDash)
    node.nodeValue = value
  }
}

// document.addEventListener('DOMContentLoaded', function (event) {
const elementsInsideBody = [
  ...document.body.querySelectorAll('a, b, div, dl, dt, em, h1, h2, h3, h4, h5, h6, i, li, p, strong')
]
findAndReplace(elementsInsideBody)
// })
