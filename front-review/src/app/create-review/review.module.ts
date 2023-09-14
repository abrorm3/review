import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CreateReviewComponent } from './create-review.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MarkdownEditorComponent } from './markdown-editor/markdown-editor.component';
import { RatingComponent } from './rating/rating.component';
import { MarkdownModule } from 'ngx-markdown';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';
import { AccountSettingsComponent } from '../account-settings/account-settings.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TagsComponent } from './tags/tags.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { HttpClientModule } from '@angular/common/http';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    CreateReviewComponent,
    MarkdownEditorComponent,
    RatingComponent,
    SidebarComponent,
    AccountSettingsComponent,
    TagsComponent,
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
    MatSliderModule,
    MatIconModule,
    AngularEditorModule,
    MatButtonModule,
  ],
})
export class ReviewModule {}
