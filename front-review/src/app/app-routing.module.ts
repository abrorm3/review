import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeedComponent } from './feed/feed.component';
import { AuthComponent } from './auth/auth.component';

const routes: Routes = [
  {path:'', redirectTo:'/feed', pathMatch:'full'},
  {path:'feed', component:FeedComponent},
  {path:'signup', component:AuthComponent}
]
@NgModule({
  imports:[RouterModule.forRoot(routes)],
  exports:[RouterModule]
})

export class AppRoutingModule{}
