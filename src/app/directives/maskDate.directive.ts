import { Directive, ElementRef, OnDestroy, HostListener, EventEmitter } from "@angular/core";
import * as textMask from "vanilla-text-mask/dist/vanillaTextMask.js";

@Directive({
    selector: "[maskDate]",
    outputs: ["inputValue"]
})
export class MaskDateDirective implements OnDestroy {
    mask = [/\d/, /\d/, "/", /\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/]; // dd/mm/yyyy
    maskedInputController;
    inputValue = new EventEmitter();
    constructor(private element: ElementRef) {
        this.maskedInputController = textMask.maskInput({
            inputElement: this.element.nativeElement,
            mask: this.mask,
            guide: true,
            keepCharPositions: true,
            // placeholderChar: ' '
        });
    }
    @HostListener("input", ["$event"])
    onEvent($event) {
        this.inputValue.emit(this.element.nativeElement.value.replace('_', ''));
    }

    ngOnDestroy() {
        this.maskedInputController.destroy();
    }
}
