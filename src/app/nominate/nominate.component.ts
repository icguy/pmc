import { Component } from '@angular/core';
import { ComponentBase } from '../shared/component-base';
import { DbService } from '../shared/db.service';
import { NavService } from '../shared/nav.service';

@Component({
	templateUrl: "./nominate.component.html",
	styleUrls: ["./nominate.component.scss"]
})
export class NominateComponent extends ComponentBase {

	constructor(
		nav: NavService,
		db: DbService
	) {
		super(nav, db);
	}
}
