import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormArray, FormControl } from "@angular/forms";
import { Subscription, Observable } from "rxjs";
import { debounceTime } from "rxjs/operators";
import { CommonServices, PageComponentBase } from "../shared/page-component-base";

@Component({
	templateUrl: "./notes.component.html",
	styleUrls: ["./notes.component.scss"]
})
export class NotesComponent extends PageComponentBase implements OnInit, OnDestroy {

	public moviesForm: FormArray = new FormArray([]);
	public subscription?: Subscription;
	public get isBusy$(): Observable<boolean> { return this.busy.isBusy$; }

	constructor(common: CommonServices) {
		super(common);
	}

	public async ngOnInit(): Promise<void> {
		await super.refresh(false);
		let movies = this.db.db.notes?.[this.userContext.currentUser!] || [];
		for (let movie of movies) {
			this.addNew(movie);
		}
		this.subscription = this.moviesForm.valueChanges
			.pipe(debounceTime(100))
			.subscribe(() => this.saveToDb());
	}

	public ngOnDestroy(): void {
		this.subscription?.unsubscribe();
	}

	public addNew(title?: string): void {
		this.moviesForm.push(new FormControl(title));
	}

	public remove(index: number): void {
		this.moviesForm.removeAt(index);
		this.saveToDb();
	}

	private async saveToDb(): Promise<void> {
		let titles = this.moviesForm.controls
			.map(c => c.value as string | undefined)
			.filter(t => t)
			.map(t => t!);
		await this.busy.doAsync(this.db.saveNotes(titles));
	}
}
