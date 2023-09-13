import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { ReviewService } from './review.service';
import { GroupType } from '../shared/interfaces/group-type.model';
import { Art } from '../shared/interfaces/art.model';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import { MatChipInputEvent } from '@angular/material/chips';
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


  filteredOptions: Observable<string[]>;
  filteredArts: Observable<string[]>;
  // filteredTags: Observable<string[]>;

  createReviewForm = new FormGroup({});
  groupTypeControl = new FormControl('');
  artControl = new FormControl();

  groupTypes: GroupType[] = [];
  artTypes: Art[] = [];
  // tags: any[]=[]
  selectedRating: number = 0;
  options: string[] = ['One', 'Two', 'Three'];
  selectedTags: string[] = [];
  markdownContent: string = '';

  // tags

  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagCtrl = new FormControl('');
  filteredTags: Observable<string[]>;
  tags: string[] = ['Lemon'];
  allTags: string[] = [];

  constructor(private reviewService: ReviewService) {
    this.filteredTags = this.tagCtrl.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) => (tag ? this._filter(tag) : this.allTags.slice())),
    );
  }

  ngOnInit(): void {
    this.getGroupTypes();
    this.getArts();
    this.getAllTags();
    this.filteredOptions = this.groupTypeControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterGroupTypes(value || ''))
    );
    this.filteredArts = this.artControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterArts(value))
    );
  }
  private _filterGroupTypes(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.groupTypes
      .map((groupType) => this.capitalizeFirstLetter(groupType.name))
      .filter((option) => option.includes(filterValue));
  }
  private _filterArts(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.artTypes
      .map((art) => this.capitalizeFirstLetter(art.title))
      .filter((title) => title.includes(filterValue));
  }
  private _filterTags(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.artTypes
      .map((tag) => this.capitalizeFirstLetter(tag.title))
      .filter((title) => title.includes(filterValue));
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
  getAllTags(){
    this.reviewService.fetchAllTags().subscribe({
      next:(response:any)=>{
        this.allTags = response.tags;
        console.log(response);
      }
    })
  }
  capitalizeFirstLetter(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  submitReview() {}
  onFileSelected(number) {}

  // tags
  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our tag
    if (value) {
      this.tags.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.tagCtrl.setValue(null);
  }

  remove(tag: string): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);

      this.announcer.announce(`Removed ${tag}`);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.tags.push(event.option.viewValue);
    this.tagInput.nativeElement.value = '';
    this.tagCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allTags.filter(tag => tag.toLowerCase().includes(filterValue));
  }
}
