export default class Algorithm {
	constructor() {
		this.current = [[2, 3], [3]]; // standard rule-set
	}
	// lives 2,3 - revives 3 - dies
	setRule(rule = [[2, 3], [3]]) {
		this.current = rule;
	}
}
