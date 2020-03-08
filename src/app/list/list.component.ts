import { Component } from '@angular/core';
import { CommonServices, ComponentBase } from '../shared/component-base';

@Component({
	template: "",
	// templateUrl: "./list.component.html",
	// styleUrls: ["./list.component.scss"]
})
export class ListComponent extends ComponentBase {

	constructor(common: CommonServices) {
		super(common);
	}
}
