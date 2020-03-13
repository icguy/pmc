import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import { AppState, Movie } from '../model';
import { calculateScore, MovieState } from '../shared/movie-detail/movie-detail.component';
import { CommonServices, PageComponentBase } from '../shared/page-component-base';

interface MovieModel {
	movie: Movie;
	state: MovieState;
	dbIdx: number;
}

@Component({
	templateUrl: "./watch.component.html",
	styleUrls: ["./watch.component.scss"]
})
export class WatchComponent extends PageComponentBase implements OnInit {

	public movies: MovieModel[];

	constructor(common: CommonServices, private snackbar: MatSnackBar) {
		super(common, AppState.Nominate);
	}

	public async ngOnInit(): Promise<void> {
		await this.refresh();
	}

	public async watched(movie: MovieModel): Promise<void> {
		let now = moment().toISOString();
		await this.setMovieWatchedDate(movie, now);
		let snackref = this.snackbar.open(`"${movie.movie.title}" megnézve, remélem tetszett.`, "Visszavonás", { duration: 3000, panelClass: "snack-action" });
		let dismiss = await snackref.afterDismissed().toPromise();
		if (dismiss.dismissedByAction) {
			await this.setMovieWatchedDate(movie, undefined);
		}
		else {
			await this.refresh();
		}
	}

	private async setMovieWatchedDate(movie: MovieModel, date: string | undefined): Promise<void> {
		await this.db.setWatchedDate(movie.dbIdx, date);
		movie.movie.watchedDate = date;
		this.db.db.movies?.current?.[movie.dbIdx]!.watchedDate = date;
		movie.state = date ? "watched" : "pending";
	}

	public async refresh(): Promise<void> {
		await this.busy.doAsync((async () => {
			await super.refresh();
			let numUsers = this.db.db.users.length;
			this.movies = (this.db.db.movies?.current || [])
				.map((m, idx) => ({ movie: m, dbIdx: idx }))
				.sort((a, b) => calculateScore(a.movie) - calculateScore(b.movie))
				.reverse()
				.map((m, idx) => ({
					...m,
					state: m.movie.watchedDate
						? "watched"
						: idx >= numUsers
							? "rejected"
							: "pending",
				}));
			if (!this.movies.some(m => m.state === "pending")) {
				await this.db.newRound();
				this.nav.navigateByState();
			}
		})());
	}
}
