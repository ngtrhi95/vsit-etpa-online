import { Directive, ElementRef, Input, HostListener } from "@angular/core";
import { NgControl } from "@angular/forms";

@Directive({
  selector: "[onlyNum]"
})
export class OnlyNumberDirective {
  private _min;
  private _max;
  @Input()
  set minNum(min: number) {
    this._min = min;
  }
  @Input()
  set maxNum(max: number) {
    this._max = max;
  }
  constructor(private el: ElementRef, public model: NgControl) {}
  @HostListener("input", ["$event"])
  onEvent($event) {
    let val = this.el.nativeElement.value.replace(/\D/g, "");
    if (this._min && val < this._min) {
      this.model.control.setValue(this._min);
    } else if (this._max && val > this._max) {
      this.model.control.setValue(this._max);
    } else {
      this.model.control.setValue(val);
    }
  }
}
