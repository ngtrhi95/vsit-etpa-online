import { Component, Input, AfterViewInit, forwardRef, ElementRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
declare var $: any;

export const TYPEAHEAD_VALUE_ACCESSOR: any = {
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => Select2Component),
	multi: true
};

@Component({
	moduleId: module.id,
	selector: 'select2-ng2',
	template: `<ng-content></ng-content>`,
	providers: [TYPEAHEAD_VALUE_ACCESSOR],
})

export class Select2Component implements AfterViewInit, ControlValueAccessor {
	private objRef: any;
	@Input() items: any;
	value: any;
	onModelChange: Function = () => { };
	onModelTouched: Function = () => { };
	@Input() disabled: any;
	@Input() placeholder = 'Chọn...';
	@Input() allowClear = true;
	@Input() multiple = false;
	@Input() showSearchBox = true;
	@Input() minimumResultsForSearch = 6;
	selectElm: any;
	initItemsCount = 0;

	constructor(private elRef: ElementRef) {
	}

	ngAfterViewInit() {
		this.selectElm = this.elRef.nativeElement.getElementsByTagName('select')[0];
		this.initItemsCount = this.selectElm.options.length;
		this.objRef = $(this.selectElm);
		this.objRef.select2({
			placeholder: this.placeholder,
			allowClear: this.allowClear,
			multiple: this.multiple,
			showSearchBox: this.showSearchBox,
			minimumResultsForSearch: this.minimumResultsForSearch,
		});

		this.objRef.on("select2:select", (e) => {
			if (e.target.type == 'select-one') {
				this.value = isNaN(this.objRef.val()) ? this.objRef.val() : +this.objRef.val();
			} else {
				this.value = this.objRef.val().map(Number);
			}
			this.onModelChange(this.value);
			this.selectElm.focus();
		});

		this.objRef.on("select2:unselect", (e) => {
			if (e.target.type == 'select-one') {
				this.value = null;
			} else {
				this.value = this.objRef.val().map(Number);
				if (this.value[0] == null) {
					this.value = null;
				}
			}
			this.onModelChange(this.value);
			this.selectElm.focus();
		});

	}

	writeValue(value: any): void {
		if (value === undefined) {
			value = null;
		}
		this.value = value;
		if (this.objRef) {
			this.objRef.val(value).trigger("change");
		}
	}

	ngAfterViewChecked() {
		if (this.selectElm && this.selectElm.options.length != this.initItemsCount) {
			/**
			 * trigger change in writeValue() doesn't work if the items (the option tags) in 
			 * <select> haven't been rendered. This trigger is to fix this problem
			 */
			this.initItemsCount = this.selectElm.options.length;
			this.objRef.val(this.value).trigger("change");
		}
	}

	registerOnChange(fn: Function): void {
		this.onModelChange = fn;
	}

	registerOnTouched(fn: Function): void {
		this.onModelTouched = fn;
	}

	setDisabledState(val: boolean): void {
		this.disabled = val;
		this.objRef.prop("disabled", val);
	}

}