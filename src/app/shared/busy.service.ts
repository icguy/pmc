import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Injectable()
export class BusyService {

	public isBusy$: Observable<boolean>;
	private _isBusy$: BehaviorSubject<boolean>;
	private count: number;

	constructor() {
		this._isBusy$ = new BehaviorSubject<boolean>(false);
		this.isBusy$ = this._isBusy$.asObservable().pipe(debounceTime(100));
		this.count = 0;
	}

	public async doAsync<T>(action: Promise<T>): Promise<T> {
		try {
			this.count++;
			if (!this._isBusy$.value)
				this._isBusy$.next(true);

			return await action;
		}
		finally {
			this.count--;
			if (this.count <= 0) {
				this.count = 0;
				if (this._isBusy$.value)
					this._isBusy$.next(false);
			}
		}
	}
}
