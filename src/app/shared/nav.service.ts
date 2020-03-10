import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { AppState } from "../model";
import { DbService } from './db.service';

@Injectable()
export class NavService {
	constructor(private router: Router, private db: DbService) { }

	public navigateByState(): void {
		switch (this.db.state) {
			case AppState.Nominate: this.router.navigate(["nominate"]); break;
			case AppState.Vote: this.router.navigate(["vote"]); break;
			case AppState.Watch: this.router.navigate(["watch"]); break;
		}
	}
}
