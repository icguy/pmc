import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import * as moment from "moment";
import { AppState, Db, Movie, User, LogData } from "../model";
import { EnvironmentService } from './environment.service';
import { UserContextService } from './user-context.service';

@Injectable()
export class DbService {

	public db: Db;
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
				state: AppState.Nominate,
				log: {},
			};
			this.db = await this.http.put<Db>(url, db).toPromise();
		}
		return this.db;
	}

	public async nominate(movie1: Movie, movie2: Movie): Promise<void> {
		let url = this.getUrl("movies", "nominated", this.userContext.currentUser as string);
		await this.log({ eventType: "nominate", data: [movie1, movie2].map(m => m.title) });
		await this.http.put(url, [movie1, movie2]).toPromise();
	}

	public async updateState(state: AppState): Promise<void> {
		let url = this.getUrl("state");
		await this.log({ eventType: "update state", data: state });
		await this.http.put(url, JSON.stringify(state)).toPromise();
	}

	public async consolidateStateIfNecessary(): Promise<void> {
		let hasCurrentMovies = (this.db.movies?.current?.length || 0) > 0;
		let allUsershaveNominatedMovies = this.db.users
			.map(u => this.db.movies?.nominated?.[u])
			.every(m => m && m.length === 2);

		let state: AppState;
		if (hasCurrentMovies) state = AppState.Watch;
		else if (allUsershaveNominatedMovies) state = AppState.Vote;
		else state = AppState.Nominate;

		if (this.db.state !== state) {
			await this.log({ eventType: "consolidate", data: `state: ${state}` });
			let url = this.getUrl("state");
			await this.http.put(url, JSON.stringify(state)).toPromise();
		}
	}

	private getUrl(...segments: (string | number)[]): string {
		let path = segments.map(a => `/${a}`).join("");
		return `${this.dbBaseUrl}${path}.json`;
	}

	private log(log: { eventType: string, data?: any }): Promise<any> {
		let rand = Math.floor(Math.random() * 1000);
		let logKey = moment().utc().format("YYYYMMDD-HHmmss") + "-" + rand.toString();
		let url = this.getUrl("log", logKey);
		let logData: LogData = {
			...log,
			user: this.userContext.currentUser
		};
		return this.http.put(url, logData).toPromise();
	}
}
