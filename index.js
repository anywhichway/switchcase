(function() {
	function switchcase(cases={},strict) {
		const switches = [];
		for(let key in cases) {
			try {
				key = Function("return " + key)();
			} catch(e) { }
			switches.push([key,cases[key]]);
		}
		const switcher = (value) => { 
			for(let item of switches) {
				const key = item[0],
					type = typeof(key);
				if((key && type==="object" && key instanceof RegExp && key.test(value)) || (type==="function" && key(value)) || (strict && key===value) || (!strict && key==value)) {
					return item[1];
				}
			} 
			return switcher.otherwise; 
		};
		switcher.otherwise = cases.default;
		switcher.case = (test,value) => {
			switches.push([test,value]);
			return switcher;
		}
		switcher.default = (value) => {
			switcher.otherwise = value;
			return switcher;
		}
		switcher.match = (value) => switcher(value);
		return switcher;
	}
	
	if(typeof(module)!=="undefined") {
		module.exports = switchcase;
	} 
	if(typeof(window)!=="undefined") {
		window.switchcase = switchcase;
	}
}());