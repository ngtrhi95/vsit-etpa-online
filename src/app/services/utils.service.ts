import { Injectable } from '@angular/core';

@Injectable()
export class UtilsService {
  constructor() { }
  /**
   * test
   */
  public test(): void {
    console.log('test service');
  }
  public fix = 0 ;
  /**
   * toStringByLang
   */
  public toStringByLang(pnumber, fix, numDefault, enough) {
    //var langId = _system["langId"];
    let langId = 0;
    if (numDefault == null || numDefault == undefined || numDefault + '' == '') {
        numDefault = '-';
    }
    if (isNaN(pnumber) || pnumber == '' || (pnumber == 0) || pnumber == -999 || (pnumber + '' == '0')) {
        if (pnumber == null || pnumber == undefined || pnumber == -999 || pnumber == 0 || pnumber + '' == '0') {
            return numDefault;
        } else if (pnumber != '') {
            return pnumber;
             }
    }

    let num = this.format_number(pnumber, fix);

    //Format money
    let snum = new String(Math.abs(num));

    let sec = snum.split('.');
    let whole = sec[0];

    let result = whole;
    let secMore = '';

    if (whole.length > 3) {
        result = whole.substr(whole.length - 3, 3);
        for (let i = whole.length - 3; i > 0; i -= 3) {
            if (langId == 0) {
                if (i - 3 > 0) {
                    result = whole.substring(i - 3, i) + '.' + result;
                } else {
                    result = whole.substring(0, i) + '.' + result;
                }
            } else {
                if (i - 3 > 0) {
                    result = whole.substring(i - 3, i) + ',' + result;
                } else {
                    result = whole.substring(0, i) + ',' + result;
                }
            }
        }
    }
    if (enough != null && enough !== undefined) {
        let j = sec.length > 1 ? 1 : 0;
        if (j === 1) {
            j = sec[1].length;
        }
        for (j; j < fix; j++) {
            secMore += '0';
        }
    }

    if (sec.length > 1) {
        result += '.' + sec[1];
    }

    if (enough != null && enough !== undefined) {
        if (sec.length === 1) {
            result += '.' + secMore;
        } else {
            result += secMore;
        }
    }

    if (num < 0) {
        result = '-' + result;
    }
    return result;
  }
  /**
   * format_number
   */
  public format_number(dec, fix) {
    const fixValue = parseFloat(Math.pow(10, fix).toString());
    const retValue = parseInt(Math.round(dec * fixValue).toString()) / fixValue;
    return retValue;
  }
  /**
   * CompareDate
   */
  public CompareDate(DateA, DateB) {
    let a = new Date(DateA);
    let b = new Date(DateB);
    let msDateA = Date.UTC(a.getFullYear(), a.getMonth() + 1, a.getDate());
    let msDateB = Date.UTC(b.getFullYear(), b.getMonth() + 1, b.getDate());

    if (parseFloat(msDateA.toString()) < parseFloat(msDateB.toString())) {
        return 0;
    } else if (parseFloat(msDateA.toString()) == parseFloat(msDateB.toString())) {
        return 0;
         } else if (parseFloat(msDateA.toString()) > parseFloat(msDateB.toString())) {
        return 1;
         } else {
        return null;
         }  // error
  }

  /**
   * GetURLParameter
   */
  public GetURLParameter(sParam) {
    let sPageURL = window.location.search.substring(1);
    let sURLVariables = sPageURL.split('&');
    for (let i = 0; i < sURLVariables.length; i++) {
        let sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
            return sParameterName[1];
        }
    }
  }
  /**
   * GetCurrentResources
   */
  // public GetCurrentResources(key) {
  //   var langName = webAPI.utils.readCookie('LANGUAGE');
  //   if (key) {
  //       if (langName == "" || langName == "vi-vn")
  //           return _globalResources_0[key]
  //       if (langName == "en-us")
  //           return _globalResources_1[key];
  //   }
  //   return "";
  // }
  /**
   * formatDateTime
   */
  public formatDateTime(val) {
    if (val) {
      let d = new Date(val);
      let datestring = d.getDate() + '-' + (d.getMonth() + 1) + '-' + d.getFullYear() + ' ' +
          d.getHours() + ':' + d.getMinutes();
      return datestring;
  }
  return '';
  }
  /**
   * getCurrentDateTime
   */
  public getCurrentDateTime() {
    let d = new Date();
    let datestring = (d.getDate() < 10 ? '0' + d.getDate() : d.getDate()) + '/' + ((d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1)) + '/' + d.getFullYear() + ' ' +
        d.getHours() + ':' + (d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()) + ':' + (d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds());
    return datestring;
  }
  /**
   * convertTextToNumber
   */
  public convertTextToNumber(input) {
    let arr = input.split(',');
    let result = '';
    for (let i = 0; i < arr.length; i++) {
        result += arr[i];
    }
    return parseInt(result);
  }
  /**
   * GetChangeLanguage
   */
  public GetChangeLanguage(langName) {
  //   if (langName) {
  //     webAPI.utils.createCookie('LANGUAGE', langName, _system["LanguageCookieTime"]);
  // }
  // document.location.href = "/?lang=" + langName;
  }
  /**
   * ConvertStringToDate
   */
  public ConvertStringToDate(_date) {
    if (_date) {
      let objDatetime: any = this.parseDate(_date);
      let date = objDatetime.year + '-' + objDatetime.month + '-' + objDatetime.day + ' ' + objDatetime.time;
      return date;
    }
  return new Date();
  }
  /**
   * ConvertStringToDouble
   */
  public ConvertStringToDouble(val) {
    if (val) {
      return parseFloat(this.getRawVal(val));
  }
  return 0;
  }
  /**
   * getRawVal
   */
  public getRawVal(val) {
    if (val) {
      // var langId = _system.langId;
      let langId = 0;
      if (langId == 0) {
          return val.replace(/\./g, '').trim();
      } else {
          return val.replaceAll(',', '').trim();
      }
  }
  return 0;
  }
  /**
   * parseDate
   */
  public parseDate(strDate) {
    // var langId = _system.langId;
    let langId = 0;
    if (strDate == '') {
        return '';
    }
    let result = '';
    let arrDate = strDate.split('/');
    let month = '';
    let day = '';
    let year = arrDate[2];

    if (langId == 0) {
        month = arrDate[1];
        day = arrDate[0];
    } else {
        month = arrDate[0];
        day = arrDate[1];
    }
    return { 'year': year.split(' ')[0], 'month': month, 'day': day, 'time': year.split(' ')[1] };
  }
  /**
   * getFormattedDate
   */
  public getFormattedDate(dateInput) {
    // var langId = _system.langId;
    let langId = 0;
    let date = new Date(dateInput);
    let year = date.getFullYear();

    let month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    let day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    if (langId == 0) {
        return day + '/' + month + '/' + year;
    } else {
        return month + '/' + day + '/' + year;
    }
  }
  /**
   * convertOrderDayByLang
   */
  public convertOrderDayByLang(strDate) {
    // var langName = webAPI.utils.readCookie('LANGUAGE');
    let langName = 'vi-vn';
    if (langName == 'vi-vn') {
        let arr = strDate.split('/');
        strDate = arr[1] + '/' + arr[0] + '/' + arr[2];
        return new Date(strDate);
    }
    return new Date(strDate);
  }
  /**
   * getFormattedDateVi
   */
  public getFormattedDateVi(dateInput) {
    // var langId = _system.langId;
    let langId = 0;
    let date = new Date(dateInput);
    let year = date.getFullYear();

    let month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    let day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    if (langId == 0) {
        return day + '/' + month + '/' + year;
    } else {
        return month + '/' + day + '/' + year;
    }
  }
  /**
   * orderHistorySort
   */
  public orderHistorySort(a) {
    let swapped;
    do {
        swapped = false;
        for (let i = 0; i < a.length - 1; i++) {
            if ((a[i].SalesOrderCode < a[i + 1].SalesOrderCode) && (a[i].OrderDate == a[i + 1].OrderDate)) {
                let temp = a[i];
                a[i] = a[i + 1];
                a[i + 1] = temp;
                swapped = true;
            }
        }
    } while (swapped);
    return a;
  }
  /**
   * removeChar
   */
  public removeChar(value: any): number {
    value = value.replace(/[^0-9.%]/g, '').replace(/(\..*)\./g, '$1');
    value = this.getRawVal(value);
    return Number(value);
  }
  /**
   * formatCurrencyWithDot
   */
  public formatCurrencyWithDot(value): string {
    let number = Intl.NumberFormat('en-us', {
        minimumFractionDigits: 0
      }).format(Number(value));
      return number.replace(/,/g, '.');
  }
  /**
   * removeDotCurrency
   */
  public removeDotCurrency(value: string): number {
      return parseInt(value.replace(/\./g, ''));
  }
}
