import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ListComponent } from './list/list.component';
import { LoginComponent } from "./login/login.component";
import { NominateComponent } from './nominate/nominate.component';
import { AuthGuard } from './shared/auth.guard';
import { VoteComponent } from './vote/vote.component';
import { WatchComponent } from './watch/watch.component';


const routes: Routes = [
	{ path: "", pathMatch: "full", redirectTo: "login", },
	{ path: "login", component: LoginComponent },
	{
		path: "", canActivateChild: [AuthGuard], children: [
			{ path: "nominate", component: NominateComponent },
			{ path: "vote", component: VoteComponent },
			{ path: "watch", component: WatchComponent },
			{ path: "list", component: ListComponent }
		]
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
