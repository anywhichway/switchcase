[![Codacy Badge](https://api.codacy.com/project/badge/Grade/a5863bf7debd4dfbacb043f5b3996e3a)](https://www.codacy.com/app/syblackwell/switchcase?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=anywhichway/switchcase&amp;utm_campaign=Badge_Grade)

# switchcase

Declarative and functional switch supporting literals, functional tests, regular expressions, and object pattern matching.

This module can be used to simplify code using `if then else` and `switch` statements. 

It can also be used as a [router](#router), e.g.

```javascript
const router = switchcase()
		.route("/:id/:name",value => {
			console.log(logged = value);
		});
router.handle({req:{url:"https://www.somesite.com/1/joe"},res:{}});
```

Or, it can be used as a powerful object selection pattern matcher, e.g.

```
switchcase([
	{name:"joe",age:21,address:{city:"Seattle",zipcode:"98101"}},
	{name:"mary",age:20,address:{city:"Seattle",zipcode:"90101"}},
	{name:"joan",age:22,address:{city:"Bainbridge Island",zipcode:"98110"}]])
	.match({age:(value) => value >=21,address:{city:"Seattle"}});
```

# Installation

npm install switchcase

For browsers, use the files in the `browser` directory.

# API

Let's start with an example:

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
let sw = switchcase({},{call:true}) // if the switch values are functions, call them
	.case(1,() => console.log("Case one, a literal"))
	.case(value => value===2,() => console.log("Case two, a function"))
	.case(/3/, () => console.log("Case three, a regular expression"))
	.case(4, () => () => console.log("Case four, just demonstrating a functional value"))
	.default(() => console.log("Defaulted"));

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


will all print

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

2) `route(test,handler)`, which turns the switch into a router adds a test and handler.

3) `default(value)`, which sets the default result.

4) `otherwise(value)`, an alias for `default`.


You can also optionaly use `sw.match(value)` or `sw.handle(value)` in place of direct invocation, `sw(value)`, if you think it assists with clarity.

## Optional Argument

`switchcase` can take a second argument `switchcase(<object>,<object || boolean>)`. 

If the second argument is an options object it can have the properties `async`, `call`, `continuable`, `pathRouter`, and `strict`. If it is a boolean, it is used as the value of `strict`. 

If `async` is true, then the case tests and actions can be asynchronous and their return values will be awaited.

If `call` is `true` and a property value is a function, it will be called with the switching value and the result returned. This can be very powerful when used with pattern matching destructuring. You do not need to set this if you explicity set `pathRouter` (see below) or call `route(test,handler)` on your switch.

If `continuable` is `true`, `call` is set to `true` and any functions that return undefined cascade to the next case. This is useful for adding logging and similar capability for router like functionality. You do not need to set this if you explicity set `pathRouter` (see below) or call `route(test,handler)` on your switch.

If `strict` is `true`, all property values in the case object that can be converted to integers will only match integers. Otherwise, a soft compare is done and "1" will equal 1. 

```
const sw = switchcase({},{continuable:true})
	.case(()=>true,(value) => console.log(value))
	.case(1,value => value)
	.case(2,value => value * 2)
```

`pathRouter` is used to turn a switchcase into a router. See the section on [routing](#router).

With the exceptions of `continuable` and `pathRouter`, if you want to defer the resolution type, the same second argument can be provided to the invocation of a `switchcase` to override those provided when the switch was created, e.g.

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

Or, functional matching:

```
const sw = switchcase();

sw.case({address: {city: value => value==="Seattle"}},({name}) => name);

sw({name:"joe",address:{city: "Seattle"}},{call:true,functionalMatch:true})); // returns "joe"
```

And even, reverse functional matching:

```
const sw = switchcase();

sw.case({address: {city: "Seattle"}},({name}) => name);

sw({name:"joe",address:{city: value => value==="Seattle"}},{call:true,functionalMatch:true})); // returns "joe"
```

Reverse functional matching is leveraged to support [object selection](#object-selection).

Also, anywhere you use a function in functional switches or functional matching, you can use a regular expression.

<a name="object-selection">&nbsp;</a>

## Object Selection

If you pass in an iterable (usually Array) of values, then `switchcase` can be used to return the subset of values that match a pattern. The below will return the object with the name "joe".

```
switchcase([
	{name:"joe",age:21,address:{city:"Seattle",zipcode:"98101"}},
	{name:"mary",age:20,address:{city:"Seattle",zipcode:"90101"}},
	{name:"joan",age:22,address:{city:"Bainbridge Island",zipcode:"98110"}]])
	.match({age:(value) => value >=21,address:{city:"Seattle"}});
```

<a name="router">&nbsp;</a>

## Path Router

You can use `switchcase` like a regular router if you create your switch with the `pathRouter` option or ever call `.route(test,handler)` instead of `case(test,value)`.

`switchcase` will automatically handle requests in any of these forms: 

```javascript
{request:{path: <some path string>},response:<some response object>}

{request:{location: <URL object>},response:<some response object>}

{request:{url: <some URL string>},response:<some response object>}

{req:{path: <some path string>},res:<some response object>}

{req:{location: <URL object>},res:<some response object>}

{req:{url: <some URL string>},res:<some response object>}

{newURL: <some URL string>} // matches a hashchange browser event

{path: <some path string>},...}

{location: <URL object>},...}

{url: <some URL string>},...}

{path: <some path string>},...}

```

If a `pathRouter` configuration object is not passed in, then `request` objects or the `hashchange` events are automatically enhanced to have the properties shown below if they don't already exist and parameterized paths with colon delimiters are automatically handled, e.g. `/:id/:version/`. This maximizes similarity to routers from other libraries. 


```javascript
{
	path: <a path>,
	pathname: <the same as path>,
	location: [a URL object](https://developer.mozilla.org/en-US/docs/Web/API/URL), // if a url string existed
	url: <url string> // if location existed
	params: {<paramName>:<paramValue>[,...} // if a parameterized path was matched
}
```

Alternatively, an `pathRouter` configuration object can be provided to look-up the path for matching and set parameters when a parameterized path is encountered:

```javascript
{
	pathRouter:
		{
			route: object => object.URL.pathname
			setParams: (object,params) => object.args = params;
		}
}
```

When using `switchcase` as a router, any routed functions that return a value other than `undefined` are considered to have succeeded, routing stops and switchcase returns the value. If a routed function returns `undefined`, routing continues. 

### Path Router Example

```
function bodyparser({req}) {
	... <do something to parse a body and augment the request> ...
	return;
}

const sw = switchcase()
		.route(()=>true,bodyparser)
		.route("/:id/:name",({req,res}) => {
			console.log(req.params,req.path);
			return true;
		})
		.route("/login/",({req,res}) => {
			console.log(req.params,req.path);
			return true;
		})
		.default({req} => {
			console.log("Not Found",req.params,req.path);
		});
sw.handle({req:{url:"https://www.somesite.com/1/joe"},res:{}});
```


# Internals

Some of the power of `switchcase` comes from the use of the ES2015 object initializer syntax, `[]`. This allows the use of the JavaScript interpreter to validate functions and regular expressions before they get turned into string property names. The `switchcase` function then loops through the properties in the object and converts them back to functions or regular expressions. The rest of the power comes from object destructuring.

# Rational and Background

There are a number of articles on the use of decalarative or functional approaches to the replacement of switch. In our opinion, here are three of the best:

1) July, 2014 [Replacing switch statements with object literals](https://toddmotto.com/deprecating-the-switch-statement-for-object-literals/) ... plus commentary on [Reddit](http://www.reddit.com/r/javascript/comments/2b4s6r/deprecating_the_switch_statement_for_object).

2) Jan, 2017 [Rethinking JavaScript: Eliminate the switch statement for better code](https://hackernoon.com/rethinking-javascript-eliminate-the-switch-statement-for-better-code-5c81c044716d)

3) Nov, 2017 [Alternative to JavaScript’s switch statement with a functional twist](https://codeburst.io/alternative-to-javascripts-switch-statement-with-a-functional-twist-3f572787ba1c)

We simply wanted a switch capability that could support literals, functional tests, regular expressions, and object patterns so that we could build super flexible routers.

# Release History - Reverse Chronological Order

2019-02-12 v1.0.9 Added async support. See recursion.html example.

2019-02-11 v1.0.8 Patched incomplete example.

2019-02-11 v1.0.7 Tested switch recursion and added ability to pass args during recursion. See recursion.html example.

2019-02-09 v1.0.6 Corrected issue with pattern matched objects getting frozen.

2019-02-09 v1.0.5 Optimized switch creation for large arrays. Can also now pass in a true iterable.

2019-02-09 v1.0.4 Added object selection. Enhanced routing with some naming aliases/sugar.

2019-02-08 v1.0.3 Added array initialization of switch and the `pathRouter` option.

2019-02-06 v1.0.2 Added support for functional object patterns. The values in pattern properties can be functions or RegExp used to test the value passed into the switch. Alternatively, the values passed in to the switch can be used to reverse match to the switch.  

2019-02-05 v1.0.1 Added support for object pattern matching, ability to call switch values, case continuation, and deferring the strict constraint to switch evaluation time.

2018-04-13 v1.0.0 Code style improvements. Fixed node.js unit test config.

2017-11-27 v0.0.3 Added unit tests

2017-11-27 v0.0.2 Added documentation

2017-11-27 v0.0.1 First public release
