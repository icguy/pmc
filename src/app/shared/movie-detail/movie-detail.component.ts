import { Component, Input } from "@angular/core";
import { Movie, User } from '../../model';
import { DbService } from '../db.service';

@Component({
	selector: "movie-detail",
	templateUrl: "./movie-detail.component.html",
	styleUrls: ["./movie-detail.component.scss"]
})
export class MovieDetailComponent {

	@Input()
	public set movie(value: Movie) {
		if (this._movie !== value)
			this.calculateScore(value);
		this._movie = value;
	}
	public get movie(): Movie { return this._movie; }
	private _movie: Movie;

	public totalScore: number = 0;
	public users: User[];

	constructor(private db: DbService) {
		this.users = this.db.db.users;
	}

	public getScore(user: User): number {
		return this.movie.score?.[user] || 0;
	}

	private calculateScore(movie: Movie): void {
		this.totalScore = this.db.db.users
			.map(u => movie.score?.[u] || 0)
			.reduce((prev, curr) => prev + curr, 0);
	}
}
