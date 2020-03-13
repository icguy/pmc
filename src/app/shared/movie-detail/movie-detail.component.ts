import { Component, Input, Output, EventEmitter } from "@angular/core";
import { Movie, User, MovieScores } from '../../model';
import { DbService } from '../db.service';

export type MovieState = "pending" | "watched" | "rejected" | "none";

export function calculateScore(movie: Movie): number {
	return Object.keys(movie.score)
		.map(u => movie.score?.[u as User] || 0)
		.reduce((prev, curr) => prev + curr, 0);
}

@Component({
	selector: "movie-detail",
	templateUrl: "./movie-detail.component.html",
	styleUrls: ["./movie-detail.component.scss"]
})
export class MovieDetailComponent {

	@Input()
	public set movie(value: Movie) {
		if (this._movie !== value)
			this.totalScore = calculateScore(value);
		this._movie = value;
	}
	public get movie(): Movie { return this._movie; }
	private _movie: Movie;

	@Input()
	public movieState: MovieState = "pending";

	@Output()
	public watched: EventEmitter<void> = new EventEmitter();


	public totalScore: number = 0;
	public users: User[];

	constructor(private db: DbService) {
		this.users = this.db.db.users;
	}

	public getScore(user: User): number {
		return this.movie.score?.[user] || 0;
	}
}
