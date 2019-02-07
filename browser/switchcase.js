(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function() {
	function matches(value,pattern,functional) {
		const type = typeof(value);
		if(pattern instanceof Date) {
			if(value instanceof Date) {
				return pattern.getTime()===value.getTime();
			}
			return false;
		}
		if(pattern instanceof RegExp) {
			if(["boolean","number","string"].includes(type)) {
				return pattern.test(value);
			}
			return false;
		}
		return Object.keys(pattern).every(key => {
			let pvalue = pattern[key],
				ptype = typeof(pvalue),
				test = value => value===pvalue;
			if(ptype==="undefined" || (pvalue && ptype==="object" && Object.keys(pvalue).length===0)) {
				return true;
			}
			if(key.startsWith("/")) {
				const i = key.lastIndexOf("/");
				if(i>0) {
					try {
						const regexp = new RegExp(key.substring(1,i),key.substring(i+1));
						test = key => regexp.test(key);
					} catch(e) {
					true;
					}
				}
			} else if(key.includes("=>")) {
				try {
					test = Function("return " + key)();
				} catch(e) {
					true;
				}
			}
			return Object.keys(value).every(vkey => {
				let vtest = () => vkey===key;
				if(vkey.startsWith("/")) {
					const i = vkey.lastIndexOf("/");
					if(i>0) {
						try {
							const regexp = new RegExp(vkey.substring(1,i),vkey.substring(i+1));
							vtest = regexp.test(key);
						} catch(e) {
						true;
						}
					}
				} else if(vkey.includes("=>")) {
					try {
						vtest = Function("return " + vkey)();
					} catch(e) {
						true;
					}
				}
				if(test(vkey) || vtest()) {
					const vvalue = value[vkey],
						vtype = typeof(vvalue);
					if(functional && ptype==="function") {
						return pvalue(vvalue);
					}
					if(pvalue && ptype==="object" && vtype==="object") {
						return vvalue ? matches(vvalue,pvalue,functional) : false;
					}
					return pvalue===vvalue;
				}
				return true;
			});
		})
	}
	function switchcase(cases={},defaults={}) {
		const switches = [];
		if(defaults && typeof(defaults)!=="object") {
			defaults = {strict:defaults};
		}
		Object.keys(cases).forEach((key) => {
			let test = key;
			try {
				test = Function("return " + key)();
			} catch(e) { true; }
			switches.push([test,cases[key]]);
		});
		const switcher = (value,options) => {
			options = Object.assign({},defaults,options);
			if(options.continuable) options.call = true;
			for(let item of switches) {
				const key = item[0],
					type = typeof(key);
				if((key && type==="object" && matches(value,key,options.functionalMatch))
					  || (type==="function" && key(value)) 
						|| (options.strict && key===value) 
						|| (!options.strict && key==value))	{
					let result = item[1];
					if(typeof(result)==="function" && options.call) {
						const resolved = result(value);
						if(resolved!==undefined || !options.continuable) return resolved;
						if(options.continuable) continue;
						result = resolved;
					}
					return result;
				}
			} 
			return switcher.otherwise; 
		};
		switcher.otherwise = cases.default;
		switcher.case = (test,value) => {
			switches.push([test,value]);
			return switcher;
		};
		switcher.default = (value) => {
			switcher.otherwise = value;
			return switcher;
		};
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
},{}]},{},[1]);
