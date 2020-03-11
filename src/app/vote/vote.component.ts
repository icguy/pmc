import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { AppState, Movie, User, NominatedMovies } from '../model';
import { CommonServices, ComponentBase } from '../shared/component-base';

interface MovieAndIndex {
	movie: Movie;
	dbIndex: number;
}

@Component({
	templateUrl: "./vote.component.html",
	styleUrls: ["./vote.component.scss"]
})
export class VoteComponent extends ComponentBase implements OnInit {

	public movies: MovieAndIndex[] = [];
	public usersPending: User[] = [];
	public get isEditable(): boolean { return this.usersPending.includes(this.userContext.currentUser!); }

	constructor(common: CommonServices) {
		super(common, AppState.Vote);
	}

	public async ngOnInit(): Promise<void> {
		await super.ngOnInit();
	}

	public drop(event: CdkDragDrop<string[]>): void {
		moveItemInArray(this.movies, event.previousIndex, event.currentIndex);
	}

	public async ok(): Promise<void> {
		await this.busy.doAsync((async () => {
			this.movies.forEach((m, idx, arr) => {
				m.movie.score[this.userContext.currentUser!] = arr.length - idx;
			});

			let data: NominatedMovies = this.db.db.users
				.reduce((prev, u) => {
					let userMovies: Movie[] = this.movies
						.filter(m => m.movie.nominatedBy === u)
						.sort((a, b) => a.dbIndex - b.dbIndex)
						.map(m => m.movie);
					return { ...prev, [u]: userMovies };
				}, {} as NominatedMovies);

			await this.db.vote(data);
			await this.refresh();
		})());
	}

	public edit(): void {

	}

	public async refresh(): Promise<void> {
		await this.busy.doAsync((async () => {
			await super.refresh();
			this.movies = this.db.db.users.flatMap(u => {
				let nominated = this.db.db.movies?.nominated?.[u] || [];
				return nominated.map<MovieAndIndex>((val, idx) => ({
					movie: val,
					dbIndex: idx
				}));
			});
			this.usersPending = this.db.db.users.filter(u => this.movies.some(m => !m.movie.score?.[u]));
			if (this.usersPending.length === 0) {
				this.nav.navigateByState();
			}
		})());
	}
}
