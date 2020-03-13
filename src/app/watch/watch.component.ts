import { Component, OnInit } from '@angular/core';
import { AppState, Movie } from '../model';
import { CommonServices, PageComponentBase } from '../shared/page-component-base';

@Component({
	templateUrl: "./watch.component.html",
	styleUrls: ["./watch.component.scss"]
})
export class WatchComponent extends PageComponentBase implements OnInit {

	public movies: Movie[];

	constructor(common: CommonServices) {
		super(common, AppState.Nominate);
	}

	public async ngOnInit(): Promise<void> {
		await super.ngOnInit();
	}

	public async refresh(): Promise<void> {
		await this.busy.doAsync((async () => {
			await super.refresh();
			this.movies = this.db.db.movies?.current || [];
			// let currentNominations = this.db.db.movies?.nominated?.[this.userContext.currentUser!];
			// if (currentNominations) {
			// 	this.form.movie1.setValue(currentNominations[0].title);
			// 	this.form.movie2.setValue(currentNominations[1].title);
			// 	this.form.disable();
			// }
			// else {
			// 	this.form.enable();
			// }
			// let usersVoted = this.db.db.users.filter(u => this.db.db.movies?.nominated?.[u]);
			// this.usersPending = this.db.db.users.filter(u => !usersVoted.includes(u));
			// if (this.usersPending.length === 0) {
			// 	this.nav.navigateByState();
			// }
		})());
	}
}
