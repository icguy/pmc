import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from "moment";
import { AppState, Movie, User } from '../model';
import { CommonServices, PageComponentBase } from '../shared/page-component-base';

class NominateForm extends FormGroup {

	constructor() {
		super({
			movie1: new FormControl("", Validators.required),
			movie2: new FormControl("", Validators.required),
		});
	}

	public get movie1(): FormControl { return this.controls["movie1"] as FormControl; }
	public get movie2(): FormControl { return this.controls["movie2"] as FormControl; }
}

@Component({
	templateUrl: "./nominate.component.html",
	styleUrls: ["./nominate.component.scss"]
})
export class NominateComponent extends PageComponentBase implements OnInit {

	public form: NominateForm;
	public usersPending: User[] = [];

	constructor(common: CommonServices, private snackbar: MatSnackBar) {
		super(common, AppState.Nominate);
		this.form = new NominateForm();
	}

	public async ngOnInit(): Promise<void> {
		await this.refresh();
	}

	public async ok(): Promise<void> {
		if (!this.form.valid) {
			this.form.markAsTouched();
			this.snackbar.open("Adj meg 2 filmet!", undefined, { duration: 3000 });
			return;
		}

		await this.busy.doAsync((async () => {
			await this.db.nominate(
				this.createMovie(this.form.movie1.value),
				this.createMovie(this.form.movie2.value)
			);
			await this.refresh();
		})());
	}

	public edit(): void {
		this.form.enable();
	}

	public async refresh(): Promise<void> {
		await this.busy.doAsync((async () => {
			await super.refresh();
			let currentNominations = this.db.db.movies?.nominated?.[this.userContext.currentUser!];
			if (currentNominations) {
				this.form.movie1.setValue(currentNominations[0].title);
				this.form.movie2.setValue(currentNominations[1].title);
				this.form.disable();
			}
			else {
				this.form.enable();
			}
			let usersVoted = this.db.db.users.filter(u => this.db.db.movies?.nominated?.[u]);
			this.usersPending = this.db.db.users.filter(u => !usersVoted.includes(u));
			if (this.usersPending.length === 0) {
				this.nav.navigateByState();
			}
		})());
	}

	private createMovie(title: string): Movie {
		return {
			chosenDate: moment().toISOString(),
			nominatedBy: this.userContext.currentUser!,
			score: {},
			title: title,
			watchedDate: undefined
		};
	}
}
