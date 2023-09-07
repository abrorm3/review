import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-auto-complete',
  templateUrl: './auto-complete.component.html',
  styleUrls: ['./auto-complete.component.css']
})
export class AutoCompleteComponent {
  tagControl = new FormControl();
  tagSuggestions: string[] = ['Tag1', 'Tag2', 'Tag3']; // Replace with actual tag suggestions

  filteredTags$: Observable<string[]>;

  constructor() {
    this.filteredTags$ = this.tagControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.tagSuggestions.filter((tag) =>
      tag.toLowerCase().includes(filterValue)
    );
  }
}
