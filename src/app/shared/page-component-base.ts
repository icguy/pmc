import { OnInit, Injectable } from '@angular/core';
import { AppState } from '../model';
import { BusyService } from './busy.service';
import { DbService } from './db.service';
import { NavService } from './nav.service';
import { UserContextService } from './user-context.service';

@Injectable()
export class CommonServices {
	constructor(
		public readonly nav: NavService,
		public readonly db: DbService,
		public readonly busy: BusyService,
		public readonly userContext: UserContextService
	) {
	}
}

export class PageComponentBase {

	protected readonly nav: NavService;
	protected readonly db: DbService;
	protected readonly busy: BusyService;
	protected readonly userContext: UserContextService;

	constructor(
		common: CommonServices,
		private readonly activeState?: AppState
	) {
		this.nav = common.nav;
		this.db = common.db;
		this.busy = common.busy;
		this.userContext = common.userContext;
	}

	public async refresh(shouldNavigate?: boolean): Promise<void> {
		await this.busy.doAsync((async () => {
			await this.db.refreshDb();
		})());
		if (this.activeState && this.db.state !== this.activeState && shouldNavigate !== false) {
			this.nav.navigateByState();
		}
	}
}
