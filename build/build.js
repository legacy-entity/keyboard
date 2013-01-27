

/**
 * hasOwnProperty.
 */

var has = Object.prototype.hasOwnProperty;

/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module.exports) {
    module.exports = {};
    module.client = module.component = true;
    module.call(this, module.exports, require.relative(resolved), module);
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);
  var index = path + '/index.js';

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (has.call(require.modules, path)) return path;
  }

  if (has.call(require.aliases, index)) {
    return require.aliases[index];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!has.call(require.modules, from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return has.call(require.modules, localRequire.resolve(path));
  };

  return localRequire;
};
require.register("entity-vector/index.js", Function("exports, require, module",
"\n/**\n * References to array helpers.\n */\n\nvar slice = [].slice\nvar map = [].map\n\n/**\n * Exports Vector.\n */\n\nmodule.exports = Vector\n\n/**\n * Vector class.\n *\n * @param {Vector} [vector]\n * or\n * @param {String} [s]\n * or\n * @param {int} x \n * @param {int} y \n * @param {int} z \n */\n\nfunction Vector (val) {\n  switch (typeof val) {\n    case 'number': {\n      val = map.call(arguments, Number)\n      break\n    }\n    case 'string': {\n      val = val.split(',').map(Number)\n      break\n    }\n    case 'object': {\n      if (val instanceof Vector) {\n        val = val.toArray()\n      }\n      break\n    }\n    default:\n      val = [0]\n      break\n  }\n\n  if (!(this instanceof Vector)) {\n    return new Vector(val)\n  }\n\n  Vector.count++\n\n  this.set(val)\n\n  return this\n}\n\nVector.d2 = function (vec) { return Vector(vec || [0,0]) }\nVector.d3 = function (vec) { return Vector(vec || [0,0,0]) }\n\n/**\n * Static values.\n */\n\nVector.maxDecimal = 2\nVector._dt = Math.floor(1000/60)\nVector.count = 0\n\nVector.prototype.__defineGetter__('x', function () { return this[1] })\nVector.prototype.__defineGetter__('y', function () { return this[2] })\nVector.prototype.__defineGetter__('z', function () { return this[3] })\nVector.prototype.__defineGetter__('X', function () { return this[1] })\nVector.prototype.__defineGetter__('Y', function () { return this[2] })\nVector.prototype.__defineGetter__('Z', function () { return this[3] })\n\nVector.prototype.__defineGetter__('a', function () { return this[1] })\nVector.prototype.__defineGetter__('b', function () { return this[2] })\nVector.prototype.__defineGetter__('c', function () { return this[3] })\nVector.prototype.__defineGetter__('A', function () { return this[1] })\nVector.prototype.__defineGetter__('B', function () { return this[2] })\nVector.prototype.__defineGetter__('C', function () { return this[3] })\n\nVector.prototype.__defineGetter__('left', function () { return this[1] })\nVector.prototype.__defineGetter__('top', function () { return this[2] })\n\nVector.prototype.__defineGetter__('width', function () { return this[1] })\nVector.prototype.__defineGetter__('height', function () { return this[2] })\n\nVector.prototype.__defineSetter__('x', function (v) { this[1] = v })\nVector.prototype.__defineSetter__('y', function (v) { this[2] = v })\nVector.prototype.__defineSetter__('z', function (v) { this[3] = v })\nVector.prototype.__defineSetter__('X', function (v) { this[1] = v })\nVector.prototype.__defineSetter__('Y', function (v) { this[2] = v })\nVector.prototype.__defineSetter__('Z', function (v) { this[3] = v })\n\nVector.prototype.__defineSetter__('a', function (v) { this[1] = v })\nVector.prototype.__defineSetter__('b', function (v) { this[2] = v })\nVector.prototype.__defineSetter__('c', function (v) { this[3] = v })\nVector.prototype.__defineSetter__('A', function (v) { this[1] = v })\nVector.prototype.__defineSetter__('B', function (v) { this[2] = v })\nVector.prototype.__defineSetter__('C', function (v) { this[3] = v })\n\nVector.prototype.__defineSetter__('left', function (v) { this[1] = v })\nVector.prototype.__defineSetter__('top', function (v) { this[2] = v })\n\nVector.prototype.__defineSetter__('width', function (v) { this[1] = v })\nVector.prototype.__defineSetter__('height', function (v) { this[2] = v })\n\nVector.prototype.toArray = function () {\n  var arr = []\n  this.each(function (n) { arr.push(n) })\n  return arr\n}\n\n/**\n * Vector utils.\n */\n\nVector.prototype.dt = function (f) {\n  if (f) return (Vector._dt = f)\n  return this.copy().mul(Vector._dt)\n}\n\n/**\n * v.toString()\n * -or-\n * var str = \"vector: \"+v // casts\n *\n * Returns the Vector as a comma delimited\n * string of vector values.\n * \n * @param {float} precision\n *\n * @return {String} comma delimited string of vector values\n */\n\nVector.prototype.toString = function (precision) {\n  var s = this.toArray().map(function (n) { return n.toFixed() })\n  return s.join(',')\n}\n\n/**\n * Returns this.\n *\n * @return {Vector} this\n */\n\nVector.prototype.get = function () {\n  return this\n}\n\n/**\n * v.set(0,4,15)\n * \n * Sets values from an Array\n * or Vector object or arguments.\n *\n * @return {Vector} this\n */\n\nVector.prototype.set = function (arr) {\n  if (arr instanceof Vector) arr = arr.toArray()\n  if (!Array.isArray(arr)) arr = slice.call(arguments)\n  this.length = arr.length\n  for (var i = 1; i <= this.length; i++) {\n    this[i] = arr[i-1]\n  }\n  return this\n}\n\n/**\n * v2 = v.copy()\n * \n * Returns a copy of the Vector.\n *\n * @return {Vector} copy\n */\n\nVector.prototype.clone = \nVector.prototype.copy = function () {\n  return new Vector(this)\n}\n\n\n\n/**\n * a.interpolate(b, 0.75) // v(0,0).interpolate(v(4,4), 0.75) => v(3,3)\n */\n\nVector.prototype.interpolate = \nVector.prototype.lerp = function (b, f) {\n  this.plus(new Vector(b).minus(this).mul(f))\n  return this\n}\n\n/**\n * v.limit(rectangle)\n */\n\nVector.prototype.limit = function (r) {\n  if (r instanceof Vector) {\n    this.max(r[1])\n    this.min(r[2])\n  }\n  else {\n    this.max(r.pos)\n    this.min(r.size)\n  }\n  return this\n}\n\n/**\n * v.each(fn)\n */\n\nVector.prototype.each = function (fn) {\n  for (var i = 1; i <= this.length; i++) {\n    fn(this[i], i)\n  }\n  return this\n}\n\n/**\n * v.map(fn)\n */\n\nVector.prototype.map = function (fn) {\n  for (var i = 1; i <= this.length; i++) {\n    this[i] = fn(this[i], i)\n  }\n  return this\n}\n\n/**\n * v.abs() // -5 => 5, 5 => 5\n */\n\nVector.prototype.abs = \nVector.prototype.absolute = function () {\n  return this.map(Math.abs)\n}\n\n/**\n * v.neg() // 5 => -5\n */\n\nVector.prototype.neg = \nVector.prototype.negate = function () { return this.map(function (n) { return -n }) }\n\nVector.prototype.half = function () { return this.div(2) }\nVector.prototype.double = function () { return this.mul(2) }\nVector.prototype.triple = function () { return this.mul(3) }\nVector.prototype.quad = function () { return this.mul(4) }\n\nVector.prototype.floor = function () { return this.map(Math.floor) }\nVector.prototype.round = function () { return this.map(Math.round) }\nVector.prototype.ceil = function () { return this.map(Math.ceil) }\n\nVector.prototype.pow = function (n) { return this.map(Math.pow.bind(this, n)) }\nVector.prototype.sqrt = function () { return this.map(Math.sqrt) }\n\nVector.prototype.atan2 = function () { return Math.atan2(this.y, this.x) }\n\n/**\n * Return the modulus of this vector.\n */\n\nVector.prototype.mod = \nVector.prototype.modulus = function () {\n  return Math.sqrt(this.dot(this))\n}\n\nVector.prototype.fill = function (len) {\n  var x = 0, n\n  for (var i = 1; i <= len; i++) {\n    n = this[i]\n    this[i] = 'undefined' != typeof n ? (x = n) : x\n  }\n}\n\n/**\n * Vector methods accepting vector as argument.\n */\n\nvar V = {}\n\n/**\n * v.max(-5) // -8 => -5, -2 => -2\n */\n\nV.max = function (v) {\n  return this.map(function (n,i) { return n < v[i] ? v[i] : n })\n}\n\n/**\n * v.min(5) // 8 => 5, 2 => 2\n */\n\nV.min = function (v) {\n  return this.map(function (n,i) { return n > v[i] ? v[i] : n })\n}\n\n/**\n * Compute dot product against a vector.\n *\n * @param {Vector} vec \n * @return {float} product\n */\n\nV.dot = function (vec) {\n  var product = 0\n  var n = this.length + 1\n  while (--n) {\n    product += this[n] * vec[n]\n  }\n  return product\n}\n\n/**\n * Compute cross product against a vector.\n *\n * @param {Vector} b \n * @return {Vector}\n */\n\nV.cross = function (B) {\n  var A = this\n  return new Vector([\n    (A[2] * B[3]) - (A[3] * B[2])\n  , (A[3] * B[1]) - (A[1] * B[3])\n  , (A[1] * B[2]) - (A[2] * B[1])\n  ])\n}\n\n/**\n * v.copyTo(vec)\n * \n * Copies this vector's values and length\n * to another one and returns the other\n * vector.\n * \n * @param {Vector} vec\n * @return {Vector} vec\n */\n\nV.copyTo = function (vec) {\n  this.each(function (n,i) { vec[i] = n })\n  vec.length = this.length\n  return vec\n}\n\n/**\n * v.rand(vec) // v(5,5,5).rand(1,0,1) => v(0.287438,5,0.898736)\n */\n\nV.rand = function (vec) {\n  return this.map(function (n,i) {\n    if (i >= vec.length+1 || vec[i]) return Math.random()\n    else return n\n  })\n}\n\nV.add = V.plus = function (v) { return this.map(function (n,i) { return n+v[i] }) }\nV.sub = V.minus = V.subtract = function (v) { return this.map(function (n,i) { return n-v[i] }) }\n\nV.mul = V.times = V.x = function (v) { return this.map(function (n,i) { return n*v[i] }) }\nV.div = V.divide = function (v) { return this.map(function (n,i) { return n/v[i] }) }\n\n/*\nV.lt = function (x, y, z) {\n  return (this.x < x && this.y < y && this.z < z)\n}\n\nV.gt = function (x, y, z) {\n  return (this.x > x && this.y > y && this.z > z)\n}\n\nV.lte = function (x, y, z) {\n  return (this.x <= x && this.y <= y && this.z <= z)\n}\n\nV.gte = function (x, y, z) {\n  return (this.x >= x && this.y >= y && this.z >= z)\n}\n\nV.eq =\nV.equals = function (x, y, z) {\n  return (this.x === x && this.y === y && this.z === z)\n}\n*/\n\n/**\n * Vector inherits from V.\n */\n\ninherits(Vector, V, function (fn) { \n  return function (b) {\n    var a = this\n    b = new Vector(b)\n    if (b.length < a.length) {\n      b.fill(a.length)\n    }\n    else if (b.length > a.length) {\n      a.fill(b.length)\n    }\n    return fn.call(this, b)\n  }\n})\n\nVector.i = Vector.I = new Vector([1,0,0])\nVector.j = Vector.J = new Vector([0,1,0])\nVector.k = Vector.K = new Vector([0,0,1])\n\n/**\n * Target inherits source methods but\n * with a special modifying function.\n * It is called with `(fn)`.\n * and must return a function.\n *\n * @param {object} t\n * @param {object} s \n * @param {function} m\n * @return {object} t\n * @api private\n */\n\nfunction inherits (t, s, m) {\n  Object.keys(s).forEach(function (k) {\n    var fn = s[k]\n    t.prototype[k] = m(fn)\n  })\n  return t\n}\n//@ sourceURL=entity-vector/index.js"
));
require.register("entity-rect/index.js", Function("exports, require, module",
"\nvar v = require('vector')\n\n// Rect\n\nmodule.exports = Rect\n\nfunction Rect (pos, size) {\n  if (!(this instanceof Rect)) return new Rect(pos, size)\n\n  if (Array.isArray(pos)) {\n    if (!Array.isArray(size)) {\n      size = pos[1]\n      pos = pos[0]\n    }\n  }\n  else if ('object' == typeof pos && !(pos instanceof v)) {\n    size = pos.size\n    pos = pos.pos\n  }\n  else if ('string' == typeof pos) {\n    pos = pos.split(' ')\n    size = pos[1]\n    pos = pos[0]\n  }\n\n  this.pos = v(pos)\n  this.size = v(size)\n}\n\nRect.prototype.toString = function () {\n  return [this.pos, this.size].join(' ')\n}\n\nRect.prototype.set = function (r) {\n  this.pos = r.pos\n  this.size = r.size\n  return this\n}\n//@ sourceURL=entity-rect/index.js"
));
require.register("entity-css-sprite/index.js", Function("exports, require, module",
"\n/**\n * css-sprite\n */\n\nmodule.exports = function (url, map) {\n  var sprite = {}\n\n  sprite.sprite = {\n    url: [String, url]\n  , map: [Object, map || {}]\n  , face: [String, 'stand']\n  , frame: [Number, 0]\n  , duration: [Number, 1]\n  , standing: [Boolean, false]\n  }\n\n  sprite.init = function (e) {\n    e.el.style.backgroundImage = 'url('+e.sprite.url+')'\n  }\n\n  sprite.update = function (e) {\n    if (e.sprite.standing) return\n    if (!(e.sprite.face in e.sprite.map)) return\n\n    var current = e.sprite.map[e.sprite.face][e.sprite.frame]\n\n    if (e.sprite.duration <= 1) {\n      e.sprite.frame++\n      if (e.sprite.frame >= e.sprite.map[e.sprite.face].length) {\n        e.sprite.frame = 0\n      }\n      e.sprite.duration = current[1]\n    }\n    else {\n      e.sprite.duration--\n    }\n  }\n\n  sprite.render = function (e, a, force) {\n    if (!force && e.sprite.standing) return\n    if (!(e.sprite.face in e.sprite.map)) return\n\n    var current = e.sprite.map[e.sprite.face][e.sprite.frame]\n\n    e.setSpriteBgPos(\n      [ current[3]\n      , 'px '\n      , - (current[0] * e.mesh.size.height\n        + current[2])\n      , 'px'\n      ].join('')\n    )\n  }\n\n  // methods\n  sprite.setSpriteBgPos = function (newpos) {\n    this.el.style.backgroundPosition = newpos\n  }\n\n  sprite.setSpriteFace = function (face) {\n    this.sprite.standing = false\n    if (!(face in this.sprite.map)) {\n      this.sprite.standing = true\n      this.sprite.duration = 1\n      this.sprite.frame = 0\n      sprite.render(this, 1, true)\n      return\n    }\n    this.sprite.face = face\n  }\n\n  sprite.setRandomSpriteFace = function () {\n    var keys = Object.keys(this.sprite.map)\n    var k = keys[Math.floor(Math.random() * keys.length)]\n    this.setSpriteFace(k)\n  }\n\n  return sprite\n}\n//@ sourceURL=entity-css-sprite/index.js"
));
require.register("component-emitter/index.js", Function("exports, require, module",
"\n/**\n * Expose `Emitter`.\n */\n\nmodule.exports = Emitter;\n\n/**\n * Initialize a new `Emitter`.\n *\n * @api public\n */\n\nfunction Emitter(obj) {\n  if (obj) return mixin(obj);\n};\n\n/**\n * Mixin the emitter properties.\n *\n * @param {Object} obj\n * @return {Object}\n * @api private\n */\n\nfunction mixin(obj) {\n  for (var key in Emitter.prototype) {\n    obj[key] = Emitter.prototype[key];\n  }\n  return obj;\n}\n\n/**\n * Listen on the given `event` with `fn`.\n *\n * @param {String} event\n * @param {Function} fn\n * @return {Emitter}\n * @api public\n */\n\nEmitter.prototype.on = function(event, fn){\n  this._callbacks = this._callbacks || {};\n  (this._callbacks[event] = this._callbacks[event] || [])\n    .push(fn);\n  return this;\n};\n\n/**\n * Adds an `event` listener that will be invoked a single\n * time then automatically removed.\n *\n * @param {String} event\n * @param {Function} fn\n * @return {Emitter}\n * @api public\n */\n\nEmitter.prototype.once = function(event, fn){\n  var self = this;\n  this._callbacks = this._callbacks || {};\n\n  function on() {\n    self.off(event, on);\n    fn.apply(this, arguments);\n  }\n\n  fn._off = on;\n  this.on(event, on);\n  return this;\n};\n\n/**\n * Remove the given callback for `event` or all\n * registered callbacks.\n *\n * @param {String} event\n * @param {Function} fn\n * @return {Emitter}\n * @api public\n */\n\nEmitter.prototype.off =\nEmitter.prototype.removeListener =\nEmitter.prototype.removeAllListeners = function(event, fn){\n  this._callbacks = this._callbacks || {};\n  var callbacks = this._callbacks[event];\n  if (!callbacks) return this;\n\n  // remove all handlers\n  if (1 == arguments.length) {\n    delete this._callbacks[event];\n    return this;\n  }\n\n  // remove specific handler\n  var i = callbacks.indexOf(fn._off || fn);\n  if (~i) callbacks.splice(i, 1);\n  return this;\n};\n\n/**\n * Emit `event` with the given args.\n *\n * @param {String} event\n * @param {Mixed} ...\n * @return {Emitter}\n */\n\nEmitter.prototype.emit = function(event){\n  this._callbacks = this._callbacks || {};\n  var args = [].slice.call(arguments, 1)\n    , callbacks = this._callbacks[event];\n\n  if (callbacks) {\n    callbacks = callbacks.slice(0);\n    for (var i = 0, len = callbacks.length; i < len; ++i) {\n      callbacks[i].apply(this, args);\n    }\n  }\n\n  return this;\n};\n\n/**\n * Return array of callbacks for `event`.\n *\n * @param {String} event\n * @return {Array}\n * @api public\n */\n\nEmitter.prototype.listeners = function(event){\n  this._callbacks = this._callbacks || {};\n  return this._callbacks[event] || [];\n};\n\n/**\n * Check if this emitter has `event` handlers.\n *\n * @param {String} event\n * @return {Boolean}\n * @api public\n */\n\nEmitter.prototype.hasListeners = function(event){\n  return !! this.listeners(event).length;\n};\n//@ sourceURL=component-emitter/index.js"
));
require.register("entity-uid/index.js", Function("exports, require, module",
"var uuid = module.exports = function (id) {\n  return id || (Math.random() * 10e6 | 0).toString(36)\n}\n\nuuid.id = uuid\n//@ sourceURL=entity-uid/index.js"
));
require.register("entity-entity/index.js", Function("exports, require, module",
"\nvar slice = [].slice\n\n/**\n * Module dependencies.\n */\n\nvar Emitter = require('emitter')\nvar uid = require('uid')\n\n/**\n * Exports Entity class.\n */\n\nmodule.exports = Entity\n\n/**\n * Entity class.\n *\n * @param {String} [id]\n * @param {Array} [components]\n * @api public\n */\n\nfunction Entity () {\n  var args = slice.call(arguments)\n  if (!(this instanceof Entity)) {\n    return new Entity(args)\n  }\n  this.id = uid()\n  this.defaults = {}\n  this.components = []\n\n  args.forEach(function (arg) {\n    this.use(arg)\n  }, this)\n}\n\nEmitter(Entity.prototype)\n\n/**\n * Uses a Component or mixins components\n * from another Entity.\n *\n * @param {Component|Entity|Object} c\n * @return {Entity} this\n * @api public\n */\n\nEntity.prototype.use = function (c) {\n  if (null == c) return\n\n  var oc = c\n\n  if (c instanceof Entity || c.components) {\n    var e = c\n    for (var i = 0; i < e.components.length; i++) {\n      c = e.components[i]\n      this.use(c)\n    }\n  }\n  else if (Array.isArray(c)) {\n    c.forEach(this.use, this)\n  }\n\n  this.add(oc)\n\n  return this\n}\n\n/**\n * Actually adds a component to components.\n *\n * @param {Component} c\n * @api private\n */\n\nEntity.prototype.add = function (c) {\n  if (this.has(c)) {\n    console.dir(c)\n    console.error(this.id + ' already has component', c)\n    return\n//    throw new Error(this.id+': already has component \"'+c)\n  }\n  this.components.push(c)\n  this.emit('add', c)\n}\n\n/**\n * Checks whether we are already using `component`.\n *\n * @param {Component} c\n * @return {Boolean}\n * @api public\n */\n\nEntity.prototype.has = function (c) {\n  return !!~this.components.indexOf(c)\n}\n\n/**\n * Apply component data to entity.\n *\n * @param {component} c\n * @return {entity} this\n * @api private\n */\n\nEntity.prototype.applyComponent = function (c) {\n  var e = this\n  for (var p in c) {\n    if ('components' == p) continue\n    var val = c[p]\n    if ('object' == typeof val) {\n      e.defaults[p] = val\n      e[p] = e.getDefault(p)\n    }\n    else if ('function' == typeof val) {\n      e[p] = val\n    }\n  }\n  return this\n}\n\n/**\n * Get a default value.\n *\n * @param {key} p \n * @return {mixed} value\n * @api private\n */\n\nEntity.prototype.getDefault = function (p) {\n  var c = this.defaults[p]\n  if (Array.isArray(c)) {\n    var fn = c[0]\n    var args = c.slice(1)\n    return fn.apply(c, args)\n  }\n  else if ('object' == typeof c) {\n    var n = each(c, function (item, k) {\n      if (Array.isArray(item)) {\n        var fn = item[0]\n        var args = item.slice(1)\n        return fn.apply(item, args)\n      }\n      else return item\n    })\n    return n\n  }\n  else return item\n}\n\n/**\n * Merge two objects.\n *\n * @param {object} t \n * @param {object} s \n * @return {object} merged\n * @api private\n */\n\nfunction merge (t, s) {\n  for (var k in s) {\n    t[k] = s[k]\n  }\n  return t\n}\n\n/**\n * Iterate an object.\n *\n * @param {object} o \n * @param {fn} fn \n * @param {object} ctx \n * @api private\n */\n\nfunction each (o, fn, ctx) {\n  ctx = ctx || this\n  var n = {}\n  for (var k in o) {\n    n[k] = fn.call(ctx, o[k], k)\n  }\n  return n\n}\n//@ sourceURL=entity-entity/index.js"
));
require.register("entity-manager/index.js", Function("exports, require, module",
"\n// slice\n\nvar slice = [].slice\n\n/**\n * Module dependencies.\n */\n\nvar Entity = require('entity')\n\n/**\n * Manager factory.\n */\n\nmodule.exports = Manager\n\n/**\n * Manager class.\n */\n\nfunction Manager (parent) {\n  if (!(this instanceof Manager)) return new Manager(parent)\n\n  this.parent = parent || this\n  this.root = this.parent.root || this\n  this.children = []\n\n  this.systems = []\n  this.entities = []\n  this.components = {}\n  this.componentsIndex = []\n\n  this.listeners = {}\n\n  this.state('ready')\n}\n\n/**\n * Create an entity of components, and use it.\n *\n * @param {component} c...\n * @return {entity} entity\n * @api public\n */\n\nManager.prototype.createEntity = function () {\n  var args = slice.call(arguments)\n  var e = new Entity(args)\n  this.use(e, true)\n  return e\n}\n\n/**\n * Remove all entities.\n *\n * @return {object} this\n * @api public\n */\n\nManager.prototype.removeAllEntities = function () {\n  this.entities.slice().forEach(function (e) {\n    this.root.removeEntity(e)\n    this.removeEntity(e)\n  }, this)\n  return this\n}\n\n/**\n * Remove an entity.\n *\n * @param {entity} e\n * @return {object) this\n * @api public\n */\n\nManager.prototype.removeEntity = function (e) {\n  var self = this\n  \n  var idx = this.entities.indexOf(e)\n  if (~idx) this.entities.splice(idx, 1)\n  \n  e.components.forEach(function (c) {\n    var idx = self.componentsIndex.indexOf(c)\n    var comps = self.components[idx]\n    if (null != comps) {\n      var idx = comps.indexOf(e)\n      if (~idx) comps.splice(idx, 1)\n    }\n  })\n\n  return this\n}\n\n/**\n * Create a manager and use it.\n *\n * @return {manager}\n * @api public\n */\n\nManager.prototype.createManager = function () {\n  var manager = new Manager(this)\n  this.use(manager)\n  return manager\n}\n\n/**\n * Register the components of an entity.\n *\n * @param {entity} e \n * @return {object} this\n * @api private\n */\n\nManager.prototype.registerComponents = function (e) {\n  var self = this\n  e.components.forEach(function (c) {\n    self.reg(c, e)\n  })\n  return this\n}\n\n/**\n * Apply component data to an entity or all.\n *\n * @param {entity} [e]\n * @api public\n */\n\nManager.prototype.applyComponents = function (e) {\n  if (e) {\n    e.components.forEach(function (c) {\n      e.applyComponent(c)\n    })\n    return this\n  }\n  else {\n    this.each(this.applyComponents.bind(this))\n  }\n  return this\n}\n\n/**\n * Listen on events.\n *\n * @param {string} ev \n * @param {fn} fn \n * @return {object} this\n * @api public\n */\n\nManager.prototype.on = function (ev, fn) {\n  this.listeners[ev] = this.listeners[ev] || []\n  this.listeners[ev].push(fn)\n  return this\n}\n\n/**\n * Emit events.\n *\n * @param {string} ev \n * @param {mixed} arguments\n * @return {object} this\n * @api private\n */\n\nManager.prototype.emit = function (ev, a, b, c, d) {\n  if (!(ev in this.listeners)) return\n  for (var i=0, len=this.listeners[ev].length; i<len; i++) {\n    this.listeners[ev][i].call(this, a, b, c, d)\n  }\n  return this\n}\n\n/**\n * Determine whether this is the root manager.\n *\n * @return {boolean}\n * @api public\n */\n\nManager.prototype.isRoot = function () {\n  return this.parent === this\n}\n\n/**\n * Attach listeners for the methods of an object.\n *\n * @param {object} obj\n * @return {object} this\n * @api private\n */\n\nManager.prototype.addListeners = function (obj) {\n  Object.keys(obj)\n    .filter(function (k) { return '_' != k.substr(0,1) })\n    .forEach(function (k) {\n      if ('function' == typeof obj[k]) {\n        this.on(k, function () {\n          var args = slice.call(arguments)\n\n          if (!obj[k].length) {\n            return obj[k].call(obj)\n          }\n\n          this.each(obj, function (e) {\n            obj[k].apply(obj, [e].concat(args))\n          })\n        })\n      }\n    }, this)\n  return this\n}\n\n/**\n * Generate a string serialized snapshot of our entities.\n *\n * @return {string}\n * @api public\n */\n\nManager.prototype.snapshot = function () {\n  return JSON.stringify(this.entities)\n}\n\n/**\n * Main event handlers.\n * \n * init, start, pause, stop, tear\n *\n * @api public\n */\n\nManager.prototype.init = function () { return this.state('init') }\nManager.prototype.start = function () { return this.state('start') }\nManager.prototype.pause = function () { return this.state('pause') }\nManager.prototype.stop = function () { return this.state('stop') }\nManager.prototype.tear = function () { return this.state('tear') }\nManager.prototype.reset = function () {\n  this.stop()\n  this.tear()\n  setTimeout(function () {\n    this.init()\n    this.start()\n  }.bind(this), 0)\n  return this\n}\n\n/**\n * State accessor. Also emits state on change.\n *\n * @param {string} [s]\n * @return {string} s\n * @api private\n */\n\nManager.prototype.state = function (s) {\n  if (null == s) return this._state\n  this._state = s\n  this.emit(s)\n  this.emit('state', s)\n  return this\n}\n\n/**\n * Get all entities using all the components in the array.\n *\n * @param {array} arr\n * @return {array} entities\n * @api public\n */\n\nManager.prototype.of = function (arr) {\n  var res = []\n  var ents = []\n  for (var i=0, c, len=arr.length; i<len; i++) {\n    c = arr[i]\n    if ('string' == typeof c) {\n      ents.push(this.entities.filter(function (e) {\n        return (c in e)\n      }))\n    }\n    else {\n      c = c.component || c\n      var index = this.componentsIndex\n      var idx = index.indexOf(c)\n      if (~idx) ents.push(this.components[idx] || [])\n    }\n  }\n  var exclude\n  if (!ents.length) return res\n  for (var i=0, e, len=ents[0].length; i<len; i++) {\n    e = ents[0][i]\n    exclude = false\n    ents.forEach(function (list) {\n      if (!~list.indexOf(e)) exclude = true\n    })\n    if (!exclude) res.push(e)\n  }\n  return res\n}\n\n/**\n * Iterate entities of certain components,\n * or through all if no component is passed.\n *\n * @param {component} [c...]\n * @param {fn} fn\n * @return {object} this\n * @api public\n */\n\nManager.prototype.each = function (c, fn) {\n  var args\n  if ('function' == typeof c) {\n    this.entities.forEach(c, this)\n    return this\n  }\n  else if (Array.isArray(c)) {\n    args = c\n  }\n  else {\n    args = slice.call(arguments)\n  }\n  fn = args.pop()\n  this.of(args).forEach(fn)\n  return this\n}\n\n/**\n * Get the first entity matching component.\n *\n * @param {component} c \n * @return {entity}\n * @api public\n */\n\nManager.prototype.get = function (c) {\n  return this.of(c)[0]\n}\n\n/**\n * Use an entity, system or manager.\n *\n * When entity:\n *   Registers an entity (creating a new one or reusing\n *   the one passed).\n *\n * When system:\n *   Registers a system to be used. Order matters.\n *\n * When manager:\n *   Adds the manager to its children.\n *\n * @param {manager|system|entity} item\n * @param {boolean} reuse\n * @return {object} this\n * @api public\n */\n\nManager.prototype.use = function (item, reuse) {\n  if (item instanceof Entity) {\n    var e = item\n    if (!reuse) e = new Entity(item)\n    if (!~this.entities.indexOf(e)) {\n      var self = this\n      e.on('add', function (c) {\n        self.reg(c, e)\n      })\n      this.entities.push(e)\n      this.registerComponents(e)\n      if (this.root != this) {\n        if (!~this.root.entities.indexOf(e)) {\n          this.root.entities.push(e)\n          this.root.registerComponents(e)\n        }\n      }\n    }\n  }\n  else if ('object' == typeof item || 'function' == typeof item) {\n    item = item.system || item\n\n    this.addListeners(item)\n\n    if (!('children' in item)) {\n      item.emit = this.emit.bind(this)\n      item.each = this.each.bind(this)\n      item.of = this.of.bind(this)\n      this.systems.push(item)\n    }\n    else {\n      item.root = this.root\n      this.children.push(item)\n    }\n  }\n  else console.error('unknown', item)\n  return this\n}\n\n/**\n * Register a component for an entity.\n *\n * @param {component} c \n * @param {entity} e \n * @return {object} this\n * @api private\n */\n\nManager.prototype.reg = function (c, e) {\n  var comps = this.components\n  var index = this.componentsIndex\n  var idx = index.indexOf(c)\n  if (~idx) {\n    if (!~comps[idx].indexOf(e)) {\n      comps[idx].push(e)\n    }\n  }\n  else {\n    index.push(c)\n    comps[index.length-1] = [e]\n  }\n  return this\n}\n\n/**\n * Join (late) an entity.\n * \n * It will try to apply components and systems\n * based on the current state.\n *\n * @param {entity} e \n * @return {object} this\n * @api public\n */\n\nManager.prototype.join = function (e) {\n  this.use(e, true)\n  this.applyComponents(e)\n  var s = this.state()\n  if ('none' == s) return this\n  if ('init' == s || 'start' == s || 'pause' == s || 'stop' == s) {\n    this.runSystems(e, 'init')\n  }\n  if ('start' == s || 'pause' == s) {\n    this.runSystems(e, 'start')\n  }\n  if ('pause' == s) {\n    this.runSystems(e, 'pause')\n  }\n  return this\n}\n\n/**\n * Run the systems for an entity alone.\n *\n * @param {entity} e \n * @param {string} method \n * @return {object} this\n * @api private\n */\n\nManager.prototype.runSystems = function (e, method) {\n  this.systems.forEach(function (system) {\n    if (!system[method]) return\n    if (!system[method].length) {\n      return\n    }\n    system.each(system, function (_e) {\n      if (e === _e) {\n        system[method].call(system, e)\n      }\n    })\n  })\n  return this\n}\n\n/**\n * Mixin helper.\n *\n * @param {object} target\n * @param {object} source\n * @param {boolean} force\n * @api private\n */\n\nfunction mixin (t, s, f) {\n  for (var k in s) {\n    if (f || !(k in t)) t[k] = s[k]\n  }\n}\n//@ sourceURL=entity-manager/index.js"
));
require.register("entity-motion/index.js", Function("exports, require, module",
"\nvar v = require('vector')\n\n// motion\n\nvar motion = module.exports = {}\n\nmotion.vel = [v, 0,0]\n\nmotion.update = function (e) {\n  e.pos.add(e.vel)\n  e.vel.mul(0.25)\n}\n//@ sourceURL=entity-motion/index.js"
));
require.register("entity-position/index.js", Function("exports, require, module",
"\nvar v = require('vector')\n\n// position\n\nvar pos = module.exports = {}\n\npos.pos = [v, 0,0]\npos.prevPos = [v, 0,0]\npos.offset = [v, 0,0]\n\npos.update = function (e) {\n  e.prevPos.set(e.pos)\n}\n//@ sourceURL=entity-position/index.js"
));
require.register("component-raf/index.js", Function("exports, require, module",
"\nmodule.exports = window.requestAnimationFrame\n  || window.webkitRequestAnimationFrame\n  || window.mozRequestAnimationFrame\n  || window.oRequestAnimationFrame\n  || window.msRequestAnimationFrame\n  || fallback;\n\nvar prev = new Date().getTime();\nfunction fallback(fn) {\n  var curr = new Date().getTime();\n  var ms = Math.max(0, 16 - (curr - prev));\n  setTimeout(fn, ms);\n  prev = curr;\n}\n//@ sourceURL=component-raf/index.js"
));
require.register("entity-loop/index.js", Function("exports, require, module",
"\n/**\n * Module dependencies.\n */\n\nvar raf = require('raf')\n\n/**\n * Returns a loop system using dt (delta time).\n *\n * @param {float} dt \n * @return {system} loop\n * @api public\n */\n\nmodule.exports = function (opts) {\n  opts = opts || {}\n  opts.dt = opts.dt || 1000/60\n\n  /**\n   * Loop system.\n   */\n\n  var loop = {}\n\n  /**\n   * Init loop.\n   *\n   * @api public\n   */\n\n  loop.init = function () {\n    this.maxDiff = opts.dt * 5\n    this.reset()\n  }\n\n  /**\n   * Resets loop.\n   *\n   * @api private\n   */\n\n  loop.reset = function () {\n    this.running = false\n    this.now = 0\n    this.before = 0\n    this.diff = 0\n    this.frame = 0\n    this.timeElapsed = 0\n    this.accumulator = 0\n  }\n\n  /**\n   * Starts loop.\n   *\n   * @api public\n   */\n\n  loop.start = function () {\n    this.running = true\n    // subtracting diff recovers in case of pause\n    this.before = Date.now() - this.diff\n    this.tick()\n  }\n\n  /**\n   * Pauses loop.\n   *\n   * @api public\n   */\n\n  loop.pause = function () {\n    this.running = false\n    this.diff = Date.now() - this.before\n  }\n\n  /**\n   * Stops loop.\n   * \n   * @api private\n   */\n\n  loop.stop = function () {\n    this.running = false\n    this.reset()\n  }\n\n  /**\n   * Ticks loop.\n   *\n   * @return {object} this\n   * @api private\n   */\n\n  loop.tick = function () {\n    function tick () {\n      if (this.running) raf(tick)\n\n      this.frame++\n\n      this.now = Date.now()\n      this.diff = this.now - this.before\n      this.before = this.now\n\n      if (this.diff > this.maxDiff) {\n        this.diff = 0\n      }\n      this.add(this.diff)\n\n      while (this.overflow()) {\n        this.emit('update', this.frame, this.timeElapsed)\n      }\n      this.emit('render', this.alpha())\n    }\n\n    tick = tick.bind(this)\n    tick()\n    \n    return this\n  }\n\n  /**\n   * Adds to loop accumulator and elapsed.\n   *\n   * @param {number} ms\n   * @return {object} this\n   * @api private\n   */\n\n  loop.add = function (ms) {\n    this.timeElapsed += ms\n    this.accumulator += ms\n    return this\n  }\n\n  /**\n   * Overflow loop.\n   * \n   * @return {boolean} whether this is an underrun\n   * @api private\n   */\n\n  loop.overflow = function () {\n    if (this.accumulator >= opts.dt) {\n      this.accumulator -= opts.dt\n      return true\n    }\n    return false\n  }\n\n  /**\n   * Calculate alpha. In short, a float of the\n   * loop position between this tick and the next.\n   * \n   * @return {float} alpha value\n   * @api private\n   */\n\n  loop.alpha = function () {\n    return this.accumulator / opts.dt\n  }\n\n  return loop\n}\n//@ sourceURL=entity-loop/index.js"
));
require.register("component-css/index.js", Function("exports, require, module",
"\n/**\n * Properties to ignore appending \"px\".\n */\n\nvar ignore = {\n  columnCount: true,\n  fillOpacity: true,\n  fontWeight: true,\n  lineHeight: true,\n  opacity: true,\n  orphans: true,\n  widows: true,\n  zIndex: true,\n  zoom: true\n};\n\n/**\n * Set `el` css values.\n *\n * @param {Element} el\n * @param {Object} obj\n * @return {Element}\n * @api public\n */\n\nmodule.exports = function(el, obj){\n  for (var key in obj) {\n    var val = obj[key];\n    if ('number' == typeof val && !ignore[key]) val += 'px';\n    el.style[key] = val;\n  }\n  return el;\n};\n//@ sourceURL=component-css/index.js"
));
require.register("entity-dom/index.js", Function("exports, require, module",
"\nvar css = require('css')\nvar rect = require('rect')\nvar v = require('vector')\n\nvar domEl = function (el) {\n  if (el) return el\n  else return document.createElement('div')\n}\n\nmodule.exports = function (parentEl) {\n  var dom = {}\n  \n  dom.el = [domEl]\n\n  // listeners\n\n  dom.init = function (e) {\n    if (e.id) e.el.attributes.id = e.id\n    if (e.class) e.setClass(e.class)\n    if (e.classList) {\n      e.setClass()\n      e.classList.forEach(function (c) {\n        e.el.classList.add(c)\n      })\n    }\n    e.resize(e.mesh.size)\n  }\n\n  dom.start = function (e) {\n    parentEl.appendChild(e.el)\n  }\n\n  dom.render = function (e) {\n    e.moveTo(v(e.mesh.pos).sub(e.offset))\n  }\n\n  dom.stop = function (e) {\n    parentEl.removeChild(e.el)\n  }\n\n  // methods\n\n  dom.moveTo = function (pos) {\n    css(this.el, {\n      left: Math.round(pos.left)\n    , top: Math.round(pos.top)\n    })\n  }\n\n  dom.resize = function (size) {\n    css(this.el, {\n      width: size.width\n    , height: size.height\n    })\n  }\n\n  dom.setClass = function (className) {\n    this.el.className = 'entity entity-dom'\n    if (className) this.el.classList.add(className)\n  }\n\n  return dom\n}\n//@ sourceURL=entity-dom/index.js"
));
require.register("keyboard/index.js", Function("exports, require, module",
"\n/**\n * Keyboard map.\n */\n\nvar map = {\n  37: 'left'\n, 38: 'up'\n, 39: 'right'\n, 40: 'down'\n}\n\n/**\n * Keyboard system.\n */\n\nmodule.exports = function (el) {\n  var kbd = {}\n\n  kbd.keys = {}\n\n  kbd.init = function () {\n\n    // add listeners\n\n    el.addEventListener('keydown', function (ev) {\n      ev.preventDefault()\n      ev.stopPropagation()\n      kbd.keys[ev.which] = true\n      kbd.emit('keys', kbd.getKeys())\n      return false\n    })\n\n    el.addEventListener('keyup', function (ev) {\n      ev.preventDefault()\n      ev.stopPropagation()\n      kbd.keys[ev.which] = false\n      kbd.emit('keys', kbd.getKeys())\n      return false\n    })\n\n  }\n\n  kbd.getKeys = function () {\n    return Object.keys(kbd.keys)\n      .filter(function (el) { return kbd.keys[el] })\n      .sort(function (a, b) { return a - b })\n      .map(function (el) { return map[el] })\n      .join(' ')\n  }\n\n  return kbd\n}\n//@ sourceURL=keyboard/index.js"
));
require.alias("entity-vector/index.js", "keyboard/deps/vector/index.js");

require.alias("entity-rect/index.js", "keyboard/deps/rect/index.js");
require.alias("entity-vector/index.js", "entity-rect/deps/vector/index.js");

require.alias("entity-css-sprite/index.js", "keyboard/deps/css-sprite/index.js");

require.alias("entity-manager/index.js", "keyboard/deps/manager/index.js");
require.alias("component-emitter/index.js", "entity-manager/deps/emitter/index.js");

require.alias("entity-entity/index.js", "entity-manager/deps/entity/index.js");
require.alias("component-emitter/index.js", "entity-entity/deps/emitter/index.js");

require.alias("entity-uid/index.js", "entity-entity/deps/uid/index.js");

require.alias("entity-motion/index.js", "keyboard/deps/motion/index.js");
require.alias("entity-vector/index.js", "entity-motion/deps/vector/index.js");

require.alias("entity-position/index.js", "keyboard/deps/position/index.js");
require.alias("entity-vector/index.js", "entity-position/deps/vector/index.js");

require.alias("entity-loop/index.js", "keyboard/deps/loop/index.js");
require.alias("component-raf/index.js", "entity-loop/deps/raf/index.js");

require.alias("entity-dom/index.js", "keyboard/deps/dom/index.js");
require.alias("component-css/index.js", "entity-dom/deps/css/index.js");

require.alias("entity-vector/index.js", "entity-dom/deps/vector/index.js");

require.alias("entity-rect/index.js", "entity-dom/deps/rect/index.js");
require.alias("entity-vector/index.js", "entity-rect/deps/vector/index.js");

