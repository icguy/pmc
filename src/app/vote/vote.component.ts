import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { AppState, Movie, User, NominatedMovies } from '../model';
import { CommonServices, PageComponentBase } from '../shared/page-component-base';

interface MovieModel {
	movie: Movie;
	dbIndex: number;
	searchUrl: string;
}

@Component({
	templateUrl: "./vote.component.html",
	styleUrls: ["./vote.component.scss"]
})
export class VoteComponent extends PageComponentBase implements OnInit {

	public movies: MovieModel[] = [];
	public usersPending: User[] = [];
	public get isEditable(): boolean { return this.usersPending.includes(this.userContext.currentUser!); }

	constructor(common: CommonServices) {
		super(common, AppState.Vote);
	}

	public async ngOnInit(): Promise<void> {
		await this.refresh();
	}

	public drop(event: CdkDragDrop<string[]>): void {
		moveItemInArray(this.movies, event.previousIndex, event.currentIndex);
	}

	public async ok(): Promise<void> {
		await this.busy.doAsync((async () => {
			this.movies.forEach((m, idx, arr) => {
				if (!m.movie.score)
					m.movie.score = {};
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
		this.usersPending.push(this.userContext.currentUser!);
	}

	public async refresh(): Promise<void> {
		let user = this.userContext.currentUser!;
		await this.busy.doAsync((async () => {
			await super.refresh();
			this.movies = this.db.db.users
				.flatMap(u => {
					let nominated = this.db.db.movies?.nominated?.[u] || [];
					return nominated.map<MovieModel>((val, idx) => ({
						movie: val,
						dbIndex: idx,
						searchUrl: `https://www.youtube.com/results?search_query=${window.encodeURI(val.title)}`
					}));
				})
				.sort((a, b) => (a.movie.score?.[user] || -1) - (b.movie.score?.[user] || -1))
				.reverse();
			this.usersPending = this.db.db.users.filter(u => this.movies.some(m => !m.movie.score?.[u]));
			if (this.usersPending.length === 0) {
				await this.db.startWatch();
				this.nav.navigateByState();
			}
		})());
	}
}
