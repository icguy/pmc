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
	log: {
		[key: string]: LogData;
	};
}

export type NominatedMovies = {
	[key in User]?: Movie[]
};

export interface Movie {
	title: string;
	chosenDate: string;
	watchedDate: string | undefined;
	nominatedBy: User;
	score: {
		[key in User]?: number; // score by users
	};
}

export interface LogData {
	eventType: string;
	user: User | undefined;
	data?: any;
}
