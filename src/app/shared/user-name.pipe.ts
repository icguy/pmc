import { Pipe, PipeTransform } from "@angular/core";
import { User } from '../model';

@Pipe({ name: "username" })
export class UserNamePipe implements PipeTransform {
	public transform(value: User): string {
		switch (value) {
			case User.Eszter: return "Eszter";
			case User.Balint: return "Bálint";
			case User.Dani: return "Dani";
		}
		return "<< unknown user >>";
	}
}
