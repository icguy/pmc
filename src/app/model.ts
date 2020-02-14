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
	movies: {
		watched: Movie[];
		current: Movie[];
		nominated: Movie[];
		rejected: Movie[];
	};
	state: AppState;
}

export interface Movie {
	title: string;
	chosenDate: string;
	watchedDate: string;
	nominatedBy: string;
	score: {
		[key in User]: number; // score by users
	};
}
