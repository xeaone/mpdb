const Handle = require('../index');

var a3 = [];
var a2 = [];
var a1 = [];
var a = [];

a3.push('zero');
a2.push(a3);
a1.push(a2);
a.push(a1);

// [ 'zero', 1 ]
Handle.set(a, '0.0.0.1', 1);
console.log(a[0][0][0]);

// no change
Handle.set(a, '0.0.0.0.0', 2);

// [ 1 ]
Handle.del(a, '0.0.0.0');

// [ 1 ]
var r = Handle.get(a, '0.0.0');
console.log(r);

// undefined
var b = Handle.get(a, '0.0.0.0.0');
console.log(b);

// true
var ht = Handle.has(a, '0.0.0.0', 1);
console.log(ht);

// false
var hf = Handle.has(a, '0.0.0.0', 2);
console.log(hf);

// false
var hu = Handle.has(a, '0.0.0.0.0', 2);
console.log(hu);
