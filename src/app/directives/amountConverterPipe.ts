import { Pipe, PipeTransform } from '@angular/core';
import { UtilsService } from '../services/utils.service';
import { debug } from 'util';
@Pipe({
    name: 'numberConverter',
    pure: false
})
export class AmountConverterPipe implements PipeTransform {
    private utils: UtilsService;
    constructor(private utilsService: UtilsService) {
        this.utils = utilsService;
    }
    transform(value) {
        let number: any;
        number = this.utils.removeChar(String(value));
        number = this.utils.formatCurrencyWithDot(number);
        return number;
    }
}
