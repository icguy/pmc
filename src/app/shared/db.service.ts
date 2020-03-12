import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import * as moment from "moment";
import { AppState, Db, Movie, User, LogData, NominatedMovies } from "../model";
import { EnvironmentService } from './environment.service';
import { UserContextService } from './user-context.service';

@Injectable()
export class DbService {

	public db: Db;

	public get state(): AppState {
		let hasCurrentMovies = (this.db.movies?.current?.length || 0) > 0;
		let allUsershaveNominatedMovies = this.db.users
			.map(u => this.db.movies?.nominated?.[u])
			.every(m => m && m.length === 2);

		if (hasCurrentMovies) return AppState.Watch;
		else if (allUsershaveNominatedMovies) return AppState.Vote;
		else return AppState.Nominate;
	}

	private dbBaseUrl: string;

	constructor(private http: HttpClient, private userContext: UserContextService, environment: EnvironmentService) {
		this.dbBaseUrl = environment.isLive
			? "https://pmc-club.firebaseio.com/db"
			: "https://pmc-club.firebaseio.com/db-test";
	}

	public async refreshDb(): Promise<Db> {
		let url = this.getUrl();
		this.db = await this.http.get<Db>(url).toPromise();
		if (!this.db) {
			let db: Db = {
				users: [User.Eszter, User.Balint, User.Dani],
				movies: {
					current: [],
					nominated: {},
					rejected: [],
					watched: []
				},
				log: {},
			};
			this.db = await this.http.put<Db>(url, db).toPromise();
		}
		return this.db;
	}

	public async nominate(movie1: Movie, movie2: Movie): Promise<void> {
		let url = this.getUrl("movies", "nominated", this.userContext.currentUser as string);
		await this.log("nominate", [movie1, movie2].map(m => m.title));
		await this.http.put(url, [movie1, movie2]).toPromise();
	}

	public async vote(movies: NominatedMovies): Promise<void> {
		let currentUser = this.userContext.currentUser!;
		let logData = this.db.users
			.flatMap(u => movies?.[u] || [])
			.filter(m => !!m)
			.map(m => ({ title: m.title, score: m.score[currentUser] || -1 }))
			.sort((a, b) => a.score - b.score)
			.reverse()
			.map(a => a.title)
			.join(", ");
		await this.log("vote", logData);

		for (let user of this.db.users) {
			let userMovies = movies[user] || [];
			for (let i = 0; i < userMovies.length; i++) {
				const userMovie = userMovies[i];
				let url = this.getUrl("movies", "nominated", user, i, "score", currentUser);
				await this.http.put(url, userMovie.score[currentUser]).toPromise();
			}
		}
	}

	public async startWatch(): Promise<void> {
		await this.log("start watch");
		let now = moment().toISOString();
		let allNominated = this.db.users
			.flatMap(u => this.db.movies!.nominated![u] || [])
			.map(m => ({ ...m, chosenDate: now }));
		let currentUrl = this.getUrl("movies", "current");
		await this.http.put(currentUrl, allNominated).toPromise();
		let nominatedUrl = this.getUrl("movies", "nominated");
		await this.http.delete(nominatedUrl).toPromise();
		await this.refreshDb();
	}

	private getUrl(...segments: (string | number)[]): string {
		let path = segments.map(a => `/${a}`).join("");
		return `${this.dbBaseUrl}${path}.json`;
	}

	private log(eventType: string, data?: any): Promise<any> {
		let rand = Math.floor(Math.random() * 1000);
		let logKey = moment().utc().format("YYYYMMDD-HHmmss") + "-" + rand.toString();
		let url = this.getUrl("log", logKey);
		let logData: LogData = {
			eventType: eventType,
			data: data,
			user: this.userContext.currentUser
		};
		return this.http.put(url, logData).toPromise();
	}
}
