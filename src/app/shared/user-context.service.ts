import { Injectable } from "@angular/core";
import { User } from "../model";

@Injectable()
export class UserContextService {
	public currentUser: User | undefined;
}
