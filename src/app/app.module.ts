import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import * as fa from '@fortawesome/free-solid-svg-icons';
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { ListComponent } from './list/list.component';
import { LoginComponent } from "./login/login.component";
import { NominateComponent } from './nominate/nominate.component';
import { AppInitService } from './shared/app-init.service';
import { AuthGuard } from './shared/auth.guard';
import { BusyService } from './shared/busy.service';
import { DbService } from "./shared/db.service";
import { EnvironmentService } from './shared/environment.service';
import "./shared/extensions/extensions-impl";
import { MovieDetailComponent } from './shared/movie-detail/movie-detail.component';
import { NavService } from './shared/nav.service';
import { CommonServices } from './shared/page-component-base';
import { StickyHeaderComponent } from './shared/sticky-header/sticky-header.component';
import { UserContextService } from './shared/user-context.service';
import { UserNamePipe } from './shared/user-name.pipe';
import { VoteComponent } from './vote/vote.component';
import { WatchComponent } from './watch/watch.component';

export function appInit(init: AppInitService): () => Promise<void> {
	return () => init.initApp();
}

@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		UserNamePipe,
		MovieDetailComponent,
		NominateComponent,
		VoteComponent,
		WatchComponent,
		StickyHeaderComponent,
		ListComponent,
	],
	imports: [
		AppRoutingModule,
		BrowserModule,
		BrowserAnimationsModule,
		DragDropModule,
		FontAwesomeModule,
		MatButtonModule,
		MatInputModule,
		MatFormFieldModule,
		MatProgressBarModule,
		MatSnackBarModule,
		HttpClientModule,
		ReactiveFormsModule,
	],
	providers: [
		AppInitService,
		BusyService,
		DbService,
		EnvironmentService,
		NavService,
		UserContextService,
		CommonServices,
		AuthGuard,
		{
			provide: APP_INITIALIZER,
			useFactory: appInit,
			deps: [AppInitService],
			multi: true
		}
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	bootstrap: [AppComponent]
})
export class AppModule {
	constructor(library: FaIconLibrary) {
		library.addIcons(fa.faSync, fa.faList, fa.faFilm);
	}
}
