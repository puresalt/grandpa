# The Good Stuff

Here it is, the documentation for the game source code itself. Nothing too ground breaking in here yet I'll try to make
this as relevant and helpful as possible. To start it off with some background on the code style.

## Code Style

On a high level the goal for the video game source code is to be as functional and lacking in state as possible.
Unfortunately due to garbage collection in different browsers this isn't 100% achievable as memory consumption would
jigsaw too much creating a big hit in performance.

On a more meta level this code base borrows a lot of ideas from Douglas Crockford and working in JavaScript from a
different paradigm as a challenge to myself: <https://youtu.be/PSGEjv3Tqo0>

### ESLint

To help keep code clean and consistent I added ESLint with a pretty strict guide line. Running `npm run build` and
`npm run watch` will both trigger Webpack which uses ESLint as part of the build process. Outside of that there is also
`npm run lint` to just run the linter when needed.

### Standards Guide

The code itself uses `EMCAScript 6` to its fullest and avoids using any external dependencies instead to lean on native
JavaScript. Based on that the follow code standard is used.

#### Variable Declaration

Always use `const` when possible and fall back on `let` if a variable must be mutable. Avoid `var` and never leave out
`const` and `let`. In the gross chance that a global must be defined, use `window.someGlobal = 'value'`. When assigning
anonymous functions use parentheses for parameters unless it is a one line function. If it is a one line function with
no parameters, prefer `() => ` over `_ =>` yet it is okay to use either.

Variables are to be camelcase, uppercase first letter for a class and factory, lowercase first letter for everything else.
Constants, enums, and lookup tables are to be all uppercase snake case.

```javascript
// good.
const someVariable = 'cool';
let someMutableVariable = 'cool when needed';

// good.
const SOME_ENUM = {
  VALUE_A: 'VALUE_A',
  VALUE_B: 'VALUE_B'
};

// good.
const GLOBAL_ENV = 'development';

// good.
const SomeObject = {
  getValue() {
    // do stuff.
  }
};

// bad.
var something = 'not cool';

// bad.
const someEnum = {
  val1: 'val1',
  val2: 'val2'
};

// bad.
const some_func = 'come on dude/dudette';

// bad.
const SomeClass = {
  get_value() {
    // do lame stuff.
  }
};
```

All statements must end with a semicolon and no trailing commas.

```javascript
// good.
const someObject = {
  a: 1,
  b: 2
};

// bad.
const someObject = {
  a: 1,
  b: 2,
};

// bad.
const someObject = {
  a: 1,
  b: 2
}
```

#### Function Declaration

Use fat arrows to declare anonymous functions and in cases where you need the context of `this` to be the function's
context. Although that second one shouldn't be a major concern as `this` should be avoided outside of declared objects.
Oh, if the function needs to be named then `function NamedFunction() {}` instead of `() => {}` is obviously fine.

```javascript
// good.
const someFunc = () => {
  // do stuff.
};

// good.
function someFunc() {
  // do stuff.
}

// good.
someObserver.on('eventName', (err, data) => {
  // do stuff.
});

// good.
someObserver.on('eventName', () => doSomeCallback());

// okay
someObserver.on('eventName', err => doSomeCallback(err));

// okay
someObserver.on('eventName', _ => doSomeCallback());

// bad.
const someFunc =  function() {
  // do lame stuff.
};

// bad.
someObserver.on('eventName', function() {
  doSomeCallback();
});
```

#### Looping

When possible prefer to use a more functional approach. Utilize `map`, `reduce`, `filter`, and `forEach` whenever
possible. If it causes garbage collection to trigger too much in certain browsers then fall back to a `for`, `while`,
or `do/while` loop where it makes sense.

```javascript
// good.
const newObject = Object.keys(oldObject)
  .filter(key => key !== 'skipKeyNamedThis')
  .reduce((gathered, key) => {
    gathered[key] = String(oldObject[key]).toLowerCase();
    return gathered;
  }, {});

// okay, when needed.
const newObject = {};
for (const key in oldObject) {
  if (!oldObject.hasOwnProperty(key)) {
    continue;
  }
  if (key === 'skipKeyNamedThis') {
    continue;
  }
  newObject[key] = String(oldObject[key]).toLowerCase();
}

// good.
const newArray = oldArray
  .filter(Boolean)
  .map(String);

// okay, when needed.
const newArray = [];
for (let i = 0, count = oldArray.length; i < count; ++i) {
  if (!oldArray[i]) {
    continue;
  }
  newArray.push(String(oldArray[i]));
}
```

#### Whitespace

Use 2 spaces, never tabs.
```javascript
// good.
const oneGoodFunction = () => {
∙∙return 0;
};

// bad.
const oneBadFunction = () => {
∙∙∙∙return 0;
};

// bad.
const anotherBackFunction = () => {
→    return 0;
};
```

Use spaces on the outside of statements.
```javascript
// good.
if (condition) {
  // do stuff.
}

// good.
while (true) {
  // do stuff.
}

// bad.
while(true) {
  // do lame stuff.
}
```

End all files with a newline. Apply judgement on adding an extra newline to break up context blocks.
```javascript
// good.
callback();↵

// maybe
callback();↵
↵

// bad.
callback();
```

#### Blocks

Curly braces live on the end of the line.
```javascript
// good
function goodThing() {
  // do stuff.
}

// okay
const okayThing = () => { /* do stuff. */ };

// bad
function badThing()
{
  // do lame stuff
}
```

Always use braces with statements with inner content on a newline (excluding `function`, see above).
```javascript
var count = 0;

// good
if (cond) {
  count++;
}

// bad
if (cond) count++;

// bad
if (cond)
  count++;

// bad
if (cond) { count++; }
```

Cuddle your `else` blocks.
```javascript
// good
if (cond) {
  // do stuff.
} else {
  // do other stuff.
}

// bad
if (cond) {
  // do lame stuff.
}
else {
  // do other lame stuff.
}
```

#### EMCAScript 6

Go all in with EMCAScript 6 with `import`, `export`, and all the fun new module system.

```javascript
// good.
import BaseClass from './someClass';

export default function ExtendedClass(parameters) {
  const baseClass = BaseClass(parameters);

  const extendedClass = {
    ...baseClass,
    overrideMethod() {
      // do stuff.
    },
    ...data
  };

  return Object.freeze(extendedClass);
}

// bad.
const BaseClass = require('./someClass');

module.exports = function ExtendedClass(parameters) {
  const baseClass = BaseClass(parameters);

  const extendedClass = {
    ...baseClass,
    overrideMethod() {
      // do stuff.
    },
    ...data
  };

  return Object.freeze(extendedClass);
}
```

Use spread when needed, avoid using `arguments` and `call` or `apply` for dynamic arguments.

```javascript
// good.
const someFunction = (name, ...args) => {
  args.forEach(arg => console.log(arg));
};

// good.
console.log(...someArray);

// bad.
const someFunction = (name) => {
  const args = Array.prototype.slice.call(arguments);
  args.forEach(arg => console.log(arg));
};

// bad.
console.log.apply(null, someArray);
```
