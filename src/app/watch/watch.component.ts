import { Component } from '@angular/core';
import { AppState } from '../model';
import { CommonServices, ComponentBase } from '../shared/component-base';

@Component({
	template: "",
	// templateUrl: "./watch.component.html",
	// styleUrls: ["./watch.component.scss"]
})
export class WatchComponent extends ComponentBase {

	constructor(common: CommonServices) {
		super(common, AppState.Watch);
	}
}
