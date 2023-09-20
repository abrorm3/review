import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { FormControl } from '@angular/forms';
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
import { AngularEditorComponent } from '@kolkov/angular-editor';
import { ImageUploadService } from '../shared/image-upload.service';
import { AuthService } from '../auth/auth.service';
import { editorConfig } from './editor-config';
import { Router } from '@angular/router';
@Component({
  selector: 'app-create-review',
  templateUrl: './create-review.component.html',
  styleUrls: ['./create-review.component.css'],
})
export class CreateReviewComponent implements OnInit {
  @ViewChild('groupTypeAuto') groupTypeAuto: MatAutocompleteTrigger;
  @ViewChild('artAuto') artAuto: MatAutocompleteTrigger;
  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
  @ViewChild('editor') editor: AngularEditorComponent;
  @ViewChild('coverPhotoInput', { static: false }) coverPhotoInput: ElementRef;

  announcer = inject(LiveAnnouncer);
  userId = '';
  editorConfig = editorConfig;

  resMessage: String = '';
  isError: boolean = false;
  isSuccess: boolean = false;
  isLoading = false;
  isImgLoading = false;

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
  selectedTags: string[] = [];
  opened: boolean = true;
  selectedCoverPhoto: File;

  // tags

  separatorKeysCodes: number[] = [ENTER, COMMA];
  tags: string[] = [];
  allTags: string[] = [];

  constructor(
    private reviewService: ReviewService,
    private imageUploadService: ImageUploadService,
    private authService: AuthService,
    private router:Router
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

  async submitReview() {
    this.isLoading = true;
    let coverImage = '';
    if (this.selectedCoverPhoto) {
      coverImage = await this.imageUploadService.uploadImage(
        this.selectedCoverPhoto,
        `${this.userId}/${this.reviewTitleControl.value}/coverImage`
      );
      console.log('Cover photo uploaded:', coverImage);
    }
    const authorId = this.authService.getUserId();
    const name = this.reviewTitleControl.value;
    const group = this.groupTypeControl.value;
    const art = this.artControl.value;
    const content = this.htmlContent.value;
    const authorRate = this.authorRateControl.value;
    const tags = this.tags;
    console.log(content);

    if (!content || content.trim().length === 0) {
      this.isError = true;
      this.isSuccess = false;
      this.resMessage = 'Content cannot be empty';
      this.isLoading = false;
      return;
    }
    this.reviewService
      .sendReview({
        authorId,
        name,
        group,
        art,
        content,
        authorRate,
        tags,
        coverImage,
      })
      .subscribe({
        next: (response) => {
          console.log(response);
          this.isSuccess = true;
          this.isError = false;
          this.resMessage = 'Review is posted successfully. Redirecting to feed ...';
          this.isLoading = false;
          setTimeout(()=>{
            this.router.navigate(['/feed'])
          },2000)
        },
        error: (err) => {
          console.log(err);
          this.isError = true;
          this.isSuccess = false;
          if (err.status === 500) {
            this.resMessage = 'Make sure all fields are filled';
          } else {
            this.resMessage = err.error.message;
          }
          this.isLoading = false;
        },
      });
  }

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

  onImageUpload() {
    const inputElement = document.createElement('input');
    inputElement.type = 'file';
    inputElement.accept = 'image/*';

    // Listen for file selection
    inputElement.addEventListener('change', (event) => {
      const file = (event.target as HTMLInputElement).files[0];

      if (file) {
        this.isImgLoading = true;
        // Upload the image to Firebase Storage
        this.imageUploadService
          .uploadImage(file, `${this.userId}/${this.reviewTitleControl.value}`)
          .then((downloadUrl) => {
            // Inserting the image URL into the editor
            const html = `<img style="max-height: 50vh;" src="${downloadUrl}" alt="Uploaded Image" />`;
            this.isImgLoading = false;
            // Using execCommand to insert HTML at the current cursor position, but yeah it is deprecated
            document.execCommand('insertHTML', false, html);
          });
      }
    });

    // Triggering the file input dialog
    inputElement.click();
  }

  // Cover image
  onCoverPhotoSelected(event: any) {
    this.selectedCoverPhoto = event.target.files[0];
  }
}
