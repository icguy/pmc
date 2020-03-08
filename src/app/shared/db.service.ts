import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AppState, Db, Movie, User } from "../model";
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
			};
			this.db = await this.http.put<Db>(url, db).toPromise();
		}
		return this.db!;
	}

	public async nominate(movie1: Movie, movie2: Movie): Promise<void> {
		let url = this.getUrl("movies", "nominated", this.userContext.currentUser as string);
		await this.http.put(url, [movie1, movie2]).toPromise();
	}

	public async updateState(state: AppState): Promise<void> {
		let url = this.getUrl("state");
		await this.http.put(url, JSON.stringify(state)).toPromise();
	}

	private getUrl(...segments: (string | number)[]): string {
		let path = segments.map(a => `/${a}`).join("");
		return `${this.dbBaseUrl}${path}.json`;
	}
}
