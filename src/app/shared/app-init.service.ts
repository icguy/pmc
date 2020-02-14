import { Injectable } from "@angular/core";
import { User } from '../model';
import { DbService } from './db.service';
import { storageKeys } from './storage-keys';
import { UserContextService } from './user-context.service';

@Injectable()
export class AppInitService {

	constructor(
		private userContext: UserContextService,
	) { }

	public async initApp(): Promise<void> {
		let user = localStorage.getItem(storageKeys.currentUser) as User;
		if (user)
			this.userContext.currentUser = user;
	}
}
