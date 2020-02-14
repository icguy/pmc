import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree, CanActivateChild } from "@angular/router";
import { UserContextService } from './user-context.service';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
	constructor(
		private userContext: UserContextService,
		private router: Router
	) { }

	public canActivateChild(): boolean | UrlTree { return this.canActivate(); }

	public canActivate(): boolean | UrlTree {
		if (this.userContext.currentUser)
			return true;
		return this.router.createUrlTree(["login"]);
	}
}
