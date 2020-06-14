const singleQuoteRegex = /'/g
const doubleQuoteRegex = /"/g

const openDoubleQuoteRegex = /(\s|^|\()"/gi
const openSingleQuoteRegex = /(\s|^|\()'/gi
const closeDoubleQuoteRegex1 = /(\w|[!?.,]|'|\))"/gi
const closeDoubleQuoteRegex2 = /"[$,]/gi
const closeSingleQuoteRegex1 = /(\w|"|\))'/gi
const closeSingleQuoteRegex2 = /'[$,]/gi
const enDashRegex = /( - |--)/gi

const apostropheRegex1 = /(\w)['´`](\w)['´`](\w)/gi
const apostropheRegex2 = /(\w)['´`](\w)/gi
const co2Regex = /CO2/g
const h2oRegex = /H2O/g

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
  if ((text.match(doubleQuoteRegex) || []).length === 1) {
    return text.replace(doubleQuoteRegex, '”')
  }
  return text.replace(openDoubleQuoteRegex, `$1${char}`)
}

function replaceOpenSingleQuote (text, char) {
  if ((text.match(singleQuoteRegex) || []).length === 1) {
    return text.replace(singleQuoteRegex, '’')
  }
  return text.replace(openSingleQuoteRegex, `$1${char}`)
}

function replaceCloseDoubleQuote (text, char) {
  text = text.replace(closeDoubleQuoteRegex1, `$1${char}`)
  return text.replace(closeDoubleQuoteRegex2, char)
}

function replaceCloseSingleQuote (text, char) {
  text = text.replace(closeSingleQuoteRegex1, `$1${char}`)
  return text.replace(closeSingleQuoteRegex2, char)
}

function replaceEnDash (text, char) {
  return text.replace(enDashRegex, char)
}

function replaceText (lang, node) {
  let value = node.nodeValue
  if (value) {
    // apostrophe is the same for any language
    value = value.replace(apostropheRegex1, '$1’$2’$3')
    value = value.replace(apostropheRegex2, '$1’$2')
    value = value.replace(co2Regex, 'CO₂')
    value = value.replace(h2oRegex, 'H₂O')

    switch (lang) {
      case 'de':
      case 'de-AT':
      case 'de-DE':
      case 'de-LI':
      case 'de-LU':
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
      case 'fr':
      case 'fr-BE':
      case 'fr-CH':
      case 'fr-FR':
      case 'fr-LU':
      case 'fr-MC':
        openDoubleQuote = '« '
        openSingleQuote = '‹ '
        closeDoubleQuote = ' »'
        closeSingleQuote = ' ›'
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
            
document.addEventListener('load', function (event) {
  const elementsInsideBody = [
    ...document.body.querySelectorAll('a, b, div, dl, dt, em, h1, h2, h3, h4, h5, h6, i, li, p, strong')
  ]
  findAndReplace(elementsInsideBody)
})
