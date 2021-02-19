export default (function (valid, component) {
  const message = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ''

  warningOnce(valid, '[' + title + ': ' + component + '] ' + message)
})

const title = 'cdm'

const warned = {}

function warning (valid, message) {
  // Support uglify
  if (process.env.NODE_ENV !== 'production' && !valid && console !== undefined) {
    console.error('Warning: ' + message)
  }
}

function note (valid, message) {
  // Support uglify
  if (process.env.NODE_ENV !== 'production' && !valid && console !== undefined) {
    console.warn('Note: ' + message)
  }
}

function call (method, valid, message) {
  if (!valid && !warned[message]) {
    method(false, message)
    // warned[message] = true
  }
}

function warningOnce (valid, message) {
  call(warning, valid, message)
}

export function noteOnce (valid, message) {
  call(note, valid, message)
}
