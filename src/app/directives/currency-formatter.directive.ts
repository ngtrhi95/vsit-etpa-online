import { Directive, HostListener, ElementRef, OnInit, AfterViewChecked  } from '@angular/core';
import {AmountConverterPipe} from './amountConverterPipe';
import { debug } from 'util';
@Directive({
  selector: '[currencyFormatter]'
})
export class CurrencyFormatterDirective implements AfterViewChecked  {
  private el: HTMLInputElement;
  constructor(private elementRef: ElementRef,
    private currencyPipe: AmountConverterPipe) {
      this.el = this.elementRef.nativeElement;
     }
     ngAfterViewChecked(): void {
      this.el.value = this.currencyPipe.transform(this.el.value);
    }
}
