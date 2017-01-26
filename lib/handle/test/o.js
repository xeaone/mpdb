const Handle = require('../index');

var o = {
	o1: {
		o2: {
			o3: { zero: 0 }
		}
	}
};

Handle.set(o, 'o1.o2.o3.o4', 1);
console.log(o.o1.o2.o3.o4);

// nonthing changed
Handle.set(o, 'o1.o2.o3.o4.o5', 2);

Handle.del(o, 'o1.o2.o3.zero');

var r = Handle.get(o, 'o1.o2.o3');
console.log(r);

// undefined
var b = Handle.get(o, 'o1.o2.o3.o4.o5');
console.log(b);

// true
var ht = Handle.has(o, 'o1.o2.o3.o4', 1);
console.log(ht);

// false
var hf = Handle.has(o, 'o1.o2.o3.o4', 2);
console.log(hf);

// false
var hu = Handle.has(o, 'o1.o2.o3.o4.o5', 2);
console.log(hu);
