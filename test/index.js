var chai,
	expect,
	unionizor,
	_;
if(typeof(window)==="undefined") {
	chai = require("chai");
	expect = chai.expect;
	switchcase = require("../index.js");
}

let sw1 = switchcase({
	1: "Case one, a literal",
	[(value) => value===2]: "Case two, a function",
	[/3/]: "Case three, a regular expression",
	[4]: () => "Case four, just demonstrating a functional value",
	default: "Defaulted"
}); 

describe("Test",function() {
	it("literal",function() {
		let sw = switchcase({
			1: "1"
		});
		expect(sw(1)).to.equal("1");
	});
	it("function",function() {
		let sw = switchcase({
			[(value) => value===1]: "1",
		});
		expect(sw(1)).to.equal("1");
	});
	it("RegExp",function() {
		let sw = switchcase({
			[/1/]: "1"
		});
		expect(sw(1)).to.equal("1");
	});
	it("default",function() {
		let sw = switchcase({
			[/1/]: "1",
			default: "1"
		});
		expect(sw(2)).to.equal("1");
	});
	it("case",function() {
		let sw = switchcase({});
		sw.case(1,"1");
		expect(sw(1)).to.equal("1");
	});
	it("case default",function() {
		let sw = switchcase({});
		sw.default("1");
		expect(sw(2)).to.equal("1");
	});
});