import { Component } from "@angular/core";
import { User } from '../../model';
import { BusyService } from '../busy.service';
import { UserContextService } from '../user-context.service';

@Component({
	selector: "sticky-header",
	templateUrl: "./sticky-header.component.html",
	styleUrls: ["./sticky-header.component.scss"]
})
export class StickyHeaderComponent {

	public user: User;

	constructor(
		userContext: UserContextService,
		public busy: BusyService
	) {
		this.user = userContext.currentUser!;
	}
}
