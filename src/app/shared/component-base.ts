import { OnInit } from '@angular/core';
import { DbService } from './db.service';
import { NavService } from './nav.service';

export class ComponentBase implements OnInit {

	constructor(
		protected nav: NavService,
		protected db: DbService
	) {

	}

	public async ngOnInit(): Promise<void> {
		await this.db.refreshDb();
	}

	public async refresh(): Promise<void> {
		await this.db.refreshDb();
		this.nav.navigateByState();
	}
}
