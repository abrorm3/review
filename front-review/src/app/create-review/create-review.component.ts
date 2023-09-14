import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { ReviewService } from './review.service';
import { GroupType } from '../shared/interfaces/group-type.model';
import { Art } from '../shared/interfaces/art.model';
import {
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
} from '@angular/material/autocomplete';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatChipInputEvent } from '@angular/material/chips';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ImageUploadService } from '../shared/image-upload.service';
import { AuthService } from '../auth/auth.service';
import { editorConfig } from './editor-config';
@Component({
  selector: 'app-create-review',
  templateUrl: './create-review.component.html',
  styleUrls: ['./create-review.component.css'],
})
export class CreateReviewComponent implements OnInit {
  @ViewChild('groupTypeAuto') groupTypeAuto: MatAutocompleteTrigger;
  @ViewChild('artAuto') artAuto: MatAutocompleteTrigger;
  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
  announcer = inject(LiveAnnouncer);
  userId = '';
  editorConfig = editorConfig;
  formSubmitted = false;
  resMessage:String = '';

  filteredOptions: Observable<string[]>;
  filteredArts: Observable<string[]>;
  filteredTags: Observable<string[]>;

  reviewTitleControl = new FormControl();
  groupTypeControl = new FormControl('');
  artControl = new FormControl();
  htmlContent = new FormControl('');
  tagCtrl = new FormControl();
  authorRateControl = new FormControl(1);

  groupTypes: GroupType[] = [];
  artTypes: Art[] = [];
  selectedRating: number = 0;
  options: string[] = ['One', 'Two', 'Three'];
  selectedTags: string[] = [];
  markdownContent: string = '';

  // tags

  separatorKeysCodes: number[] = [ENTER, COMMA];
  tags: string[] = [];
  allTags: string[] = [];

  constructor(
    private reviewService: ReviewService,
    private imageUploadService: ImageUploadService,
    private authService: AuthService
  ) {
    this.filteredTags = this.tagCtrl.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) =>
        tag ? this._filterTags(tag) : this.allTags.slice()
      )
    );
    this.filteredOptions = this.groupTypeControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterGroupTypes(value || ''))
    );
    this.filteredArts = this.artControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterArts(value))
    );
  }

  ngOnInit(): void {
    this.getUserInfo();
    this.getGroupTypes();
    this.getArts();
    this.getAllTags();

  }
  getUserInfo() {
    this.userId = this.authService.getUserId();
    this.authService.getUser().subscribe((user) => {
      console.log(user);
      user.id;
    });
  }
  private _filterGroupTypes(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.groupTypes
      .map((groupType) => this.capitalizeFirstLetter(groupType.name))
      .filter((option) => option.toLowerCase().includes(filterValue));
  }
  private _filterArts(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.artTypes
      .map((art) => this.capitalizeFirstLetter(art.title))
      .filter((title) => title.toLowerCase().includes(filterValue));
  }

  private _filterTags(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allTags.filter((tag) =>
      tag.toLowerCase().includes(filterValue)
    );
  }

  getGroupTypes() {
    this.reviewService.fetchGroupArt().subscribe({
      next: (response: any) => {
        this.groupTypes = response.groupType as GroupType[];
        console.log(this.groupTypes);
      },
      error: (error) => {
        console.error('Error fetching GroupTypes and ArtTypes:', error);
      },
    });
  }
  getArts() {
    this.reviewService.fetchGroupArt().subscribe({
      next: (response: any) => {
        this.artTypes = response.art as Art[];
        console.log(response);
      },
      error: (error) => {
        console.error('Error fetching GroupTypes and ArtTypes:', error);
      },
    });
  }
  getAllTags() {
    this.reviewService.fetchAllTags().subscribe({
      next: (response: any) => {
        this.allTags = response.tags;
        console.log(response);
      },
    });
  }
  capitalizeFirstLetter(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  submitReview() {
    console.log('submitReview() called');
    const authorId = this.authService.getUserId();
    const name = this.reviewTitleControl.value;
    const group = this.groupTypeControl.value;
    const art = this.artControl.value;
    const content = this.htmlContent.value;
    const authorRate = this.authorRateControl.value;
    const tags = this.tags.join(', ');
    console.log('Tags:', tags);
// this.reviewService.fetchGroupArt()
    this.reviewService.sendReview({authorId,name, group, art,content,authorRate,tags}).subscribe(response => {
      console.log(response);
      // if(response.status === 200) {
    })
  }

  onFileSelected(number) {}

  // tags
  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our tag
    if (value) {
      this.tags.push(value);
      this.tagCtrl.setValue('');
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(tag: string): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
      this.tagCtrl.setValue('');

      this.announcer.announce(`Removed ${tag}`);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.tags.push(event.option.viewValue);
    this.tagInput.nativeElement.value = '';
    this.tagCtrl.setValue(null);
  }


  uploadImage(file: File): Promise<string> {
    return this.imageUploadService.uploadImage(
      file,
      `${this.userId}/${this.reviewTitleControl}`
    );
  }
}
