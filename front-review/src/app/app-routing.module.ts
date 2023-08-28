import { NgModule, inject } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeedComponent } from './feed/feed.component';
import { AuthComponent } from './auth/auth.component';
import { AuthGuardService } from './auth/auth.guard';

const routes: Routes = [
  {path:'', redirectTo:'/feed', pathMatch:'full'},
  {path:'feed', component:FeedComponent},
  {path:'auth', component:AuthComponent}
]
@NgModule({
  imports:[RouterModule.forRoot(routes)],
  exports:[RouterModule]
})

export class AppRoutingModule{}
