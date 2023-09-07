import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { ReviewService } from './review.service';
import { GroupType } from '../shared/interfaces/group-type.model';

@Component({
  selector: 'app-create-review',
  templateUrl: './create-review.component.html',
  styleUrls: ['./create-review.component.css'],
})
export class CreateReviewComponent implements OnInit {
  groupTypes: GroupType[] = [];
  artTypes: ArtType[] = [];

  selectedRating: number = 0;
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;
  createReviewForm = new FormGroup({});
  createReview = new FormControl('')
  selectedTags: string[] = [];
  markdownContent: string = '';
  constructor(private reviewService:ReviewService) {}

  ngOnInit(): void {
    this.filteredOptions = this.createReview.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || ''))
    );
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }
  getGroupTypes(){
    this.reviewService.fetchGroupType().subscribe({
      next:
      (response: any) => {
        // Assuming your backend response matches the structure you provided
        this.groupTypes = response.groupTypes as GroupType[];
      },
      error:
      (error) => {
        console.error('Error fetching GroupTypes and ArtTypes:', error);
      }
  })}
  getArts(){
    this.reviewService.fetchGroupType().subscribe({
      next:
      (response: any) => {
        this.artTypes = response.artTypes as ArtType[];
      },
      error:
      (error) => {
        console.error('Error fetching GroupTypes and ArtTypes:', error);
      }
  })}

  submitReview() {}
  onFileSelected(number) {}
}
