import { Component } from '@angular/core';
import { AppState } from '../model';
import { ComponentBase, CommonServices } from '../shared/component-base';

@Component({
	template: "",
	// templateUrl: "./vote.component.html",
	// styleUrls: ["./vote.component.scss"]
})
export class VoteComponent extends ComponentBase {

	constructor(common: CommonServices) {
		super(common, AppState.Vote);
	}
}
