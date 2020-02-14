import { Component, OnInit } from "@angular/core";
import { User } from '../../model';
import { UserContextService } from '../user-context.service';

@Component({
	selector: "sticky-header",
	templateUrl: "./sticky-header.component.html",
	styleUrls: ["./sticky-header.component.scss"]
})
export class StickyHeaderComponent implements OnInit {

	public user: User;

	constructor(
		// private dbService: DbService,
		private userContext: UserContextService,
		// private nav: NavService,
		// public busy: BusyService,
	) {
		this.user = this.userContext.currentUser!;
	}

	public async ngOnInit(): Promise<void> {
	}
}
