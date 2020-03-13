import { Component } from '@angular/core';
import { CommonServices, PageComponentBase } from '../shared/page-component-base';

@Component({
	template: "",
	// templateUrl: "./list.component.html",
	// styleUrls: ["./list.component.scss"]
})
export class ListComponent extends PageComponentBase {

	constructor(common: CommonServices) {
		super(common);
	}
}
