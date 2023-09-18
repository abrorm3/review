import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: 'input[type="number"][wholeNumber]',
})
export class WholeNumberDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    const newValue = value.replace(/[^\d]/g, ''); // Remove non-numeric characters

    if (value !== newValue) {
      input.value = newValue;
      input.dispatchEvent(new Event('input'));
    }
  }

}
