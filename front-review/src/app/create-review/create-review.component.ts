import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { ReviewService } from './review.service';
import { GroupType } from '../shared/interfaces/group-type.model';
import { Art } from '../shared/interfaces/art.model';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

@Component({
  selector: 'app-create-review',
  templateUrl: './create-review.component.html',
  styleUrls: ['./create-review.component.css'],
})
export class CreateReviewComponent implements OnInit {
  @ViewChild('groupTypeAuto') groupTypeAuto: MatAutocompleteTrigger;
  @ViewChild('artAuto') artAuto: MatAutocompleteTrigger;


  filteredOptions: Observable<string[]>;
  filteredArts: Observable<string[]>;
  filteredTags: Observable<string[]>;

  createReviewForm = new FormGroup({});
  groupTypeControl = new FormControl('');
  artControl = new FormControl();
  tagControl = new FormControl();

  groupTypes: GroupType[] = [];
  artTypes: Art[] = [];
  tags: any[]=[]
  selectedRating: number = 0;
  options: string[] = ['One', 'Two', 'Three'];
  selectedTags: string[] = [];
  markdownContent: string = '';
  constructor(private reviewService: ReviewService) {}

  ngOnInit(): void {
    this.getGroupTypes();
    this.getArts();
    this.filteredOptions = this.groupTypeControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterGroupTypes(value || ''))
    );
    this.filteredArts = this.artControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterArts(value))
    );
    this.filteredTags = this.tagControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterTags(value))
    )
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
        // Assuming your backend response matches the structure you provided
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
  capitalizeFirstLetter(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  submitReview() {}
  onFileSelected(number) {}
}
