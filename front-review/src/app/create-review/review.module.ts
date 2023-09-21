import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CreateReviewComponent } from './create-review.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MarkdownModule } from 'ngx-markdown';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';
import { AccountSettingsComponent } from '../account-settings/account-settings.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { HttpClientModule } from '@angular/common/http';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { FeedComponent } from '../feed/feed.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import { WholeNumberDirective } from '../shared/directives/whole-number.directive';
import { MatListModule } from '@angular/material/list';
import { ReviewDetailsComponent } from '../review-details/review-details.component';
import { AuthModule } from '../auth/auth.module';
import { LikeButtonComponent } from '../review-details/like-button/like-button.component';

@NgModule({
  declarations: [
    CreateReviewComponent,
    SidebarComponent,
    AccountSettingsComponent,
    FeedComponent,
    WholeNumberDirective,
    ReviewDetailsComponent,
    LikeButtonComponent
  ],
  imports: [
    CommonModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MarkdownModule.forRoot(),
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatIconModule,
    AngularEditorModule,
    MatButtonModule,
    MatListModule,
    MatSliderModule,
    MatSidenavModule,
    AuthModule
  ],
  exports: [SidebarComponent]
})
export class ReviewModule {}
