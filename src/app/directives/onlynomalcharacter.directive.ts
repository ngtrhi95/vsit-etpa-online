import { Directive, ElementRef, Input, HostListener } from "@angular/core";
import { NgControl } from "@angular/forms";

@Directive({
    selector: "[onlyNomal]"
})
export class OnlyNomalCharacterDirective {
    constructor(private el: ElementRef, public model: NgControl) { }
    @HostListener("input", ["$event"])
    onEvent($event) {
        let val = this.el.nativeElement.value.replace(/[-!$%^&*()_+0123456789"\/|~=`{}[:;<>?,.@#\]]/g, "");
        this.model.control.setValue(val);
    }
}