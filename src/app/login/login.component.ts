import { Component, OnInit } from "@angular/core";
import { User } from '../model';
import { BusyService } from '../shared/busy.service';
import { CommonServices, PageComponentBase } from '../shared/page-component-base';
import { storageKeys } from '../shared/storage-keys';

@Component({
	templateUrl: "./login.component.html",
	styleUrls: ["./login.component.scss"]
})
export class LoginComponent extends PageComponentBase implements OnInit {

	public availableUsers: User[];
	public busy: BusyService;

	constructor(common: CommonServices) { super(common); }

	public async ngOnInit(): Promise<void> {
		await this.busy.doAsync(super.ngOnInit());

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
