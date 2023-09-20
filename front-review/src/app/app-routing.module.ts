import { NgModule, inject } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeedComponent } from './feed/feed.component';
import { AuthComponent } from './auth/auth.component';
import { AuthGuardService } from './auth/auth.guard';
import { ForgotPasswordComponent } from './auth/passwordRecovery/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/passwordRecovery/reset-password/reset-password.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { CreateReviewComponent } from './create-review/create-review.component';
import { ReviewDetailsComponent } from './review-details/review-details.component';

const routes: Routes = [
  { path: '', redirectTo: '/feed', pathMatch: 'full' },
  { path: 'feed', component: FeedComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password/:id/:token', component: ResetPasswordComponent },
  { path: 'account/settings', component: AccountSettingsComponent },
  { path: 'create-review', component: CreateReviewComponent },
  {path:'review-details/:title', component: ReviewDetailsComponent}
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
