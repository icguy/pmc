import { Component, OnInit } from "@angular/core";
import { User } from '../model';
import { BusyService } from '../shared/busy.service';
import { ComponentBase } from '../shared/component-base';
import { DbService } from '../shared/db.service';
import { NavService } from '../shared/nav.service';
import { storageKeys } from '../shared/storage-keys';
import { UserContextService } from '../shared/user-context.service';

@Component({
	templateUrl: "./login.component.html",
	styleUrls: ["./login.component.scss"]
})
export class LoginComponent extends ComponentBase implements OnInit {

	public availableUsers!: User[];

	constructor(
		db: DbService,
		nav: NavService,
		private userContext: UserContextService,
		public busy: BusyService,
	) {
		super(nav, db);
	}

	public async ngOnInit(): Promise<void> {
		await super.ngOnInit();

		if (this.userContext.currentUser) {
			this.nav.navigateByState();
			return;
		}

		this.availableUsers = this.db.db.users;
	}

	public login(user: User): void {
		localStorage.setItem(storageKeys.currentUser, user);
		this.userContext.currentUser = user;
		this.nav.navigateByState();
	}
}
