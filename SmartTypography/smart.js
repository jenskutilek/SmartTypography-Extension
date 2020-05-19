/* jshint esversion: 6 */

const ignoreElements = [
  'CODE',
  'KBD',
  'INPUT',
  'MATH',
  'PRE',
  'SAMP',
  'TEXTAREA',
  'TT',
  'VAR'
]

// var elementsInsideBody = [...document.body.getElementsByTagName('*')]
var elementsInsideBody = [...document.body.querySelectorAll('a, dl, dt, h1, h2, h3, h4, h5, h6, li, p')]

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

function findAndReplace () {
  elementsInsideBody.forEach(element => {
    // console.log(element.nodeName)
    if (!ignoreElements.includes(element.nodeName)) {
      const lang = findLanguage(element)
      element.childNodes.forEach(child => {
        // console.log(child)
        replaceText(lang, child)
      })
    } else {
      // console.log("  ignore")
    }
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
    value = value.replace('CO2', 'CO₂')
    value = value.replace('H2O', 'H₂O')

    let openDoubleQuote, openSingleQuote, closeDoubleQuote, closeSingleQuote, enDash
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

window.onload = findAndReplace()