export enum User {
	Eszter = "Eszter",
	Balint = "Balint",
	Dani = "Dani",
}

export enum AppState {
	Nominate = "Nominate",
	Vote = "Vote",
	Watch = "Watch",
}

export interface Db {
	users: User[];
	movies?: {
		watched?: Movie[];
		current?: Movie[];
		nominated?: NominatedMovies;
		rejected?: Movie[];
	};
	notes?: Notes;
	log: {
		[key: string]: LogData;
	};
}

export type ByUser<T> = { [key in User]?: T };

export type Notes = ByUser<string>;
export type NominatedMovies = ByUser<Movie[]>;
export type MovieScores = ByUser<number>;

export interface Movie {
	title: string;
	chosenDate: string;
	watchedDate: string | undefined;
	nominatedBy: User;
	score: MovieScores;
}

export interface LogData {
	eventType: string;
	user: User | undefined;
	data?: any;
}
