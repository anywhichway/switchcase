[![Codacy Badge](https://api.codacy.com/project/badge/Grade/a5863bf7debd4dfbacb043f5b3996e3a)](https://www.codacy.com/app/syblackwell/switchcase?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=anywhichway/switchcase&amp;utm_campaign=Badge_Grade)

# switchcase

Declarative and functional switch supporting literals, functional tests, regular expressions, and object pattern matching.

This module can be used to simplify code using `if then else` and `switch` statements. It can also be used as a foundation for super flexible routers.

# Installation

npm install switchcase

For browsers, use the files in the `browser` directory.

# API

Lets start with an example:

```javascript
let sw = switchcase({
	1: "Case one, a literal",
	[(value) => value===2]: "Case two, a function",
	[/3/]: "Case three, a regular expression",
	[4]: () => "Case four, just demonstrating a functional value",
	default: "Defaulted"
});

console.log(sw(1));
console.log(sw(2));
console.log(sw(3));
console.log(sw(4)()); // note the function invocation
console.log(sw(5));

```

```javascript
let sw = switchcase({
	1: () => console.log("Case one, a literal"),
	[(value) => value===2]: () => console.log("Case two, a function"),
	[/3/]: () => console.log("Case three, a regular expression"),
	[4]: () => () => console.log("Case four, just demonstrating a functional value"),
	default: () => console.log("Defaulted")
},{call:true}); // if the switch values are functions, call them

console.log(sw(1));
console.log(sw(2));
console.log(sw(3));
console.log(sw(4)()); // note the function invocation
console.log(sw(5));

```


will both print

```
Case one, a literal

Case two, a function

Case three, a regular expression

Case four, just demonstrating a functional value

Defaulted
```

In short, calling `switchcase` with an object will return a functional switch. By using [ES2015 object initializer syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer), the properties of the object can look like they are functions or regular expressions.

The returned function can also be enhanced through the use of chained calls:

1) `case(test,value)`, which adds a test and value.

2) `default(value)`, which sets the default result.


You can also optionaly use `sw.match(value)` in place of direct invocation, `sw(value)`, if you think it assists with clarity.

## Optional Argument

`switchcase` can take a second argument `switchcase(<object>,<object || boolean>)`. 

If the second argument is an object it can have the properties `strict`, `call`, `continuable`. If it is a boolean, it is used as the value of `strict`. 

If `strict` is `true`, all property values in the case object that can be converted to integers as integers and only match integers to those properties. Otherwise, a soft compare is done and "1" will equal 1. 

If `call` is `true` and a property value is a function, it will be called with the switching value and the result returned. This can be very powerful when used with pattern matching destructuring.

If `continuable` is `true`, call is set to `true` and any functions that return undefined cascade to the next case. This is useful for adding logging and similar capability for router like functionality.

```
const sw = switchcase({},{continuable:true})
	.case(()=>true,(value) => console.log(value))
	.case(1,value => value)
	.case(2,value => value * 2)
```

The same second argument can be provided to the invocation of a `switchcase`, if you want to defer the resolution type, e.g.

```
const sw = switchcase({1:"case 1"});

sw(1,{strict:true});
```

## Pattern Matching

You can use partial objects in cases to match objects:

```
const sw = switchcase();

sw.case({address: {city: "Seattle"}},({name}) => name);

sw({name:"joe",address:{city: "Seattle"}},{call:true})); // returns "joe"
```

If you want to use patterns with object based switching, you will need to stringify them, e.g.


```
const sw = switchcase({
	[JSON.stringify({address: {city: "Seattle"}})]: ({name}) => name
});

```

You might also want to explore the use of functional switches:

```
const sw = switchcase({
	[({address: {city}}) => city==="Seattle"]: ({name}) => name;
});
```


# Internals

The main power of `switchcase` comes from the use of the ES2015 object initializer syntax, `[]`. This allows the use of the JavaScript interpreter to validate functions and regular expressions before they get turned into string property names. The `switchcase` function then loops through the properties in the object and converts them back to functions or regular expressions.

# Rational and Background

There are a number of articles on the use of decalarative or functional approaches to the replacement of switch. In our opinion, here are three of the best:

1) July, 2014 [Replacing switch statements with object literals](https://toddmotto.com/deprecating-the-switch-statement-for-object-literals/) ... plus commentary on [Reddit](http://www.reddit.com/r/javascript/comments/2b4s6r/deprecating_the_switch_statement_for_object).

2) Jan, 2017 [Rethinking JavaScript: Eliminate the switch statement for better code](https://hackernoon.com/rethinking-javascript-eliminate-the-switch-statement-for-better-code-5c81c044716d)

3) Nov, 2017 [Alternative to JavaScript’s switch statement with a functional twist](https://codeburst.io/alternative-to-javascripts-switch-statement-with-a-functional-twist-3f572787ba1c)

We simply wanted a switch capability that could support literals, functional tests, regular expressions, and object patterns so that we could build super flexible routers.

# Release History - Reverse Chronological Order

2019-02-05 v1.0.1 Added support for object pattern matching, ability to call switch values, case continuation, and defering the strict constraint to switch evaluation time.

2018-04-13 v1.0.0 Code style improvements. Fixed node.js unit test config.

2017-11-27 v0.0.3 Added unit tests

2017-11-27 v0.0.2 Added documentation

2017-11-27 v0.0.1 First public release
