import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { Db, User, AppState } from "../model";
import { EnvironmentService } from './environment.service';

@Injectable()
export class DbService {

	public db!: Db;
	private dbBaseUrl: string;

	constructor(private http: HttpClient, environment: EnvironmentService) {
		this.dbBaseUrl = environment.isLive
			? "https://pmc-club.firebaseio.com/db"
			: "https://pmc-club.firebaseio.com/db-test";
	}

	public async refreshDb(): Promise<Db> {
		this.db = await this.getDb();
		if (!this.db) {
			this.db = await this.initDb();
		}
		return this.db!;
	}

	private getDb(): Promise<Db> {
		let url = this.getUrl();
		return this.http.get<Db>(url).toPromise();
	}

	private initDb(): Promise<Db> {
		let url = this.getUrl();
		let db: Db = {
			users: [User.Eszter, User.Balint, User.Dani],
			movies: {
				current: [],
				nominated: [],
				rejected: [],
				watched: []
			},
			state: AppState.Nominate,
		};
		return this.http.put<Db>(url, db).toPromise();
	}

	private getUrl(...segments: (string | number)[]): string {
		let path = segments.map(a => `/${a}`).join("");
		return `${this.dbBaseUrl}${path}.json`;
	}
}
