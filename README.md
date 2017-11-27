# switchcase

Declarative and functional switch supporting literals, functional tests, and regular expressions.

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

will print

```
Case one, a literal

Case two, a function

Case three, a regular expression

Defaulted
```

In short, calling `switchcase` with an object will return a functional switch. By using [ES2015 object initializer syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer), the properties of the object can look like they are functions or regular expressions.

The returned function can also be enhanced through the use of chained calls:

1) `case(test,value)`, which adds a test and value.

2) `default(value)`, which sets the default result.

The same example above using this approach:

```javascript
let sw = switchcase()
	.default("Defaulted") // note, you can put the default anywhere!
	.case(1,"Case one, a literal")
	.case(value => value===2, "Case two, a function")
	.case(/3/,"Case three, a regular expression")
	.case(4,() => "Case four, just demonstrating a functional value");

console.log(sw(1));
console.log(sw(2));
console.log(sw(3));
console.log(sw(4)()); // note the function invocation
console.log(sw(5));

```

You can also optionaly use `sw.match(value)` in place of direct invocation, `sw(value)`, if you think it assists with clarity.

Finally, a second argument to `switchcase(<object>,<boolean>)` will treat all property values in the case object that can be converted to integers as integers and only match integers to those properties.
Otherwise, a soft compare is done and "1" will equal 1.

# Internals

The main power of `switchcase` comes from the use of the ES2015 object initializer syntax, `[]`. This allows the use of the JavaScript interpreter to validate functions and regular expressions before they get turned into string property names. The `switchcase` function they loops through the properties in the object and converts them back to functions or regular expressions.

# Rational and Background

There are a number of articles on the use of decalaritive or functional approaches to the replacement of switch. In our opinion, here are three of the best:

1) July, 2014 [Replacing switch statements with object literals](https://toddmotto.com/deprecating-the-switch-statement-for-object-literals/) ... plus commentary on [Reddit](http://www.reddit.com/r/javascript/comments/2b4s6r/deprecating_the_switch_statement_for_object).

2) Jan, 2017 [Rethinking JavaScript: Eliminate the switch statement for better code](https://hackernoon.com/rethinking-javascript-eliminate-the-switch-statement-for-better-code-5c81c044716d)

3) Nov, 2017 [Alternative to JavaScript’s switch statement with a functional twist](https://codeburst.io/alternative-to-javascripts-switch-statement-with-a-functional-twist-3f572787ba1c)

We simply wanted a switch capability that could support literals, functional tests, and regular expressions so that we could build super flexible routers.


# Release History - Reverse Chronological Order

2017-11-27 v0.0.2 Added documentation

2017-11-27 v0.0.1 First public release