interface Array<T> {
	flatMap<U>(callbackfn: (value: T, index: number, array: T[], thisArg?: any) => U[], thisArg?: any): U[];
}
