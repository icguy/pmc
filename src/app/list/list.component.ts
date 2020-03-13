import { Component, OnInit } from '@angular/core';
import { Movie } from '../model';
import { CommonServices, PageComponentBase } from '../shared/page-component-base';

type ListOption = "watched" | "rejected";

@Component({
	templateUrl: "./list.component.html",
	styleUrls: ["./list.component.scss"]
})
export class ListComponent extends PageComponentBase implements OnInit {

	public movies: Movie[];

	public options: ListOption[] = ["watched", "rejected"];
	public get currentOption(): ListOption { return this._currentOption; }
	public set currentOption(value: ListOption) {
		this.refreshMovies(value);
		this._currentOption = value;
	}
	private _currentOption: ListOption = "watched";

	constructor(common: CommonServices) {
		super(common);
	}

	public async ngOnInit(): Promise<void> {
		await super.refresh(false);
		this.refreshMovies(this.currentOption);
	}

	private refreshMovies(value: ListOption): void {
		this.movies = (value === "watched" ? this.db.db.movies?.watched : this.db.db.movies?.rejected) || [];
	}
}
