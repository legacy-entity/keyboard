
/**
 * Keyboard map.
 */

var map = {
  37: 'left'
, 38: 'up'
, 39: 'right'
, 40: 'down'
}

/**
 * Keyboard system.
 */

module.exports = function (el) {
  var kbd = {}

  kbd.keys = {}

  kbd.init = function () {

    // add listeners

    el.addEventListener('keydown', function (ev) {
      ev.preventDefault()
      ev.stopPropagation()
      kbd.keys[ev.which] = true
      kbd.emit('keys', kbd.getKeys())
      return false
    })

    el.addEventListener('keyup', function (ev) {
      ev.preventDefault()
      ev.stopPropagation()
      kbd.keys[ev.which] = false
      kbd.emit('keys', kbd.getKeys())
      return false
    })

  }

  kbd.getKeys = function () {
    return Object.keys(kbd.keys)
      .filter(function (el) { return kbd.keys[el] })
      .sort(function (a, b) { return a - b })
      .map(function (el) { return map[el] })
      .join(' ')
  }

  return kbd
}
