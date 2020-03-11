Array.prototype.flatMap = function <T, U>(callbackfn: (value: T, index: number, array: T[], thisArg?: any) => U[], thisArg?: any): U[] {
	let _this = (<Array<T>>this);
	return _this.map(callbackfn, thisArg).reduce((a, b) => a.concat(b), []);
};
