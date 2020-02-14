import { Injectable } from "@angular/core";

@Injectable()
export class EnvironmentService {
	public get isLive(): boolean {
		if (this._isLive !== undefined)
			return this._isLive;
		return this._isLive = !/^https?:\/\/((localhost)|(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}))/.test(window.location.href);
	}

	private _isLive: boolean | undefined;
}
