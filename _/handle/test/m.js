const Handle = require('../index');

var m3 = new Map();
var m2 = new Map();
var m1 = new Map();
var m = new Map();

m3.set('zero', 0);
m2.set('m3', m3);
m1.set('m2', m2);
m.set('m1', m1);

Handle.set(m, 'm1.m2.m3.m4', 1);
console.log(m.get('m1').get('m2').get('m3').get('m4'));

// nonthing changed
Handle.set(m, 'm1.m2.m3.m4.m5', 2);

Handle.del(m, 'm1.m2.m3.zero');

var r = Handle.get(m, 'm1.m2.m3');
console.log(r);

// undefined
var b = Handle.get(m, 'm1.m2.m3.m4.m5');
console.log(b);

// true
var ht = Handle.has(m, 'm1.m2.m3.m4', 1);
console.log(ht);

// false
var hf = Handle.has(m, 'm1.m2.m3.m4', 2);
console.log(hf);

// false
var hu = Handle.has(m, 'm1.m2.m3.m4.m5', 2);
console.log(hu);
