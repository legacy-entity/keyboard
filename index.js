
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

  kbd.keys = []

  kbd.init = function () {

    // add listeners

    el.addEventListener('keydown', function (ev) {
      ev.preventDefault()
      ev.stopPropagation()
      if (!kbd.isKeyPressed(ev.which)) {
        kbd.keys.push(ev.which)
        kbd.emit('keys', kbd.keys)
      }
      return false
    })

    el.addEventListener('keyup', function (ev) {
      ev.preventDefault()
      ev.stopPropagation()
      if (kbd.isKeyPressed(ev.which)) {
        kbd.keys.splice(kbd.keys.indexOf(ev.which), 1)
        kbd.emit('keys', kbd.keys)
      }
      return false
    })

  }

  kbd.isKeyPressed = function (key) {
    return !!~kbd.keys.indexOf(key)
  }

  kbd.getMappedKeys = function () {
    return kbd.keys.map(function (el) { return map[el] })
  }

  kbd.satisfies = function (keymap, str) {
    var m = str.split(' ')
    var cnt = m.length
    if (keymap.length !== cnt) return false
    var p
    while (p = m.shift()) {
      if (~keymap.indexOf(p)) cnt--
    }
    if (cnt === 0) return true
    else return false
  }

  return kbd
}
