export class VietService {
    /** truyền vào một array và thuộc tính muốn order của phần tử dạng string
     * mặc định là tăng dần, increase = false sẽ sawpx xếp giảm dần
     * @example arrayOrder(array, "property_name")
     */
    arrayOrder(values: any[], orderProperty: any, increase: boolean = true) {
        if (!increase) {
            return values.sort((a, b) => {
                if (a[orderProperty] > b[orderProperty]) {
                    return -1;
                }
                if (a[orderProperty] < b[orderProperty]) {
                    return 1;
                }
                return 0;
            });
        }
        return values.sort((a, b) => {
            if (a[orderProperty] < b[orderProperty]) {
                return -1;
            }
            if (a[orderProperty] > b[orderProperty]) {
                return 1;
            }
            return 0;
        });
    }
    /** hàm clone một array object - không sử dụng được với array string */
    isClonedOfArray(arr: Array<any>) {
        let cloned = arr.map(x => Object.assign({}, x));
        return cloned;
    }
    /** hàm clone một object*/
    isClonedOf(obj: any) {
        let cloned = Object.assign({}, obj);
        return cloned;
    }
    /** hàm phân mảnh array theo kích thước mong muốn
     * @example - ChunkArray([array], <size>)
     */
    chunkArray(arr: Array<any>, size: number) {
        let groups: Array<any> = [];
        for (let i = 0; i < arr.length; i += size) {
            groups.push(arr.slice(i, i + size));
        }
        return groups;
    }
    /** set object datetime tới nửa đêm
     * nếu truyền vào một object datetime thì trả về nửa đêm của ngày hôm đó
     * nếu không thì là ngày hiện tại
     */
    setTimeToMidnight(date?: Date) {
        if (date != null) {
            date.setHours(23, 59, 59, 999);
            return date;
        } else {
            let nowDate = new Date();
            nowDate.setHours(23, 59, 59, 999);
            return nowDate;
        }
    }
    /** trả về object datetime có giá trị ngày/tháng/năm không có thời gian */
    nowDate() {
        let nowDate = new Date();
        nowDate.setHours(0, 0, 0, 0);
        return nowDate;
    }
    /** trả về object datetime có giá trị ngày/tháng/năm ngày tiếp theo ngày hiện tại */
    nextDate() {
        let nowDate = new Date();
        nowDate.setHours(24, 0, 0, 0);
        return nowDate;
    }
    /** trả về object datetime có giá trị ngày/tháng/năm ngày tiếp theo n ngày hiện tại */
    next_N_Date(nDay) {
        let nowDate = new Date();
        let nDays = 24 * nDay;
        nowDate.setHours(nDays, 0, 0, 0);
        return nowDate;
    }
    /** chuyển chuỗi ngày tháng thành kiểu Date */
    toDate(dateString: string) {
        let arr = dateString.split(/\/|-|\\|\.|\_|\,/);
        return new Date(+arr[2], +arr[1] - 1, +arr[0]);
    }
    /** chuyển chuỗi số năm thành kiểu Date - ngày 1 tháng 1 của năm nhập vào */
    toYearDate(year) {
        return isNaN(year) ? null : new Date(+year, 0, 1);
    }
    /** chuyển chuỗi ngày tháng thành kiểu Date */
    toDateString(date: Date) {
        date = new Date(date);
        return date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
    }
    /** hàm trả về ngày tháng giống hôm nay của n năm trước */
    thisDay_N_YearsAgo(numberOfYears: number): Date {
        let nYearsAgo = new Date();
        nYearsAgo.setFullYear(nYearsAgo.getFullYear() - numberOfYears);
        return nYearsAgo;
    }
    /** hàm tính toán thời hạn bảo hiểm 1 năm theo ngày đưa vào
     * @param inputDateObj: Date Object
     * @returns Date Object
     */
    calculatorExpiredTimeOfContract(inputDateObj) {
        let temp = new Date(inputDateObj);
        temp.setHours(0, 0, 0, 0);
        let temp2 = new Date(temp);
        return new Date(temp2.setFullYear(temp2.getFullYear() + 1) - 1);
    }
    /** hàm tính toán thời hạn bảo hiểm n năm theo ngày đưa vào
     * @param inputDateObj: Date Object
     * @param expireYears: number
     * @returns Date Object
     */
    calculatorExpiredTimeOfContract_v2(inputDateObj, expireYears = 1) {
      let temp = new Date(inputDateObj);
      temp.setHours(0, 0, 0, 0);
      let temp2 = new Date(temp);
      return new Date(temp2.setFullYear(temp2.getFullYear() + +expireYears) - 1);
    }
    /** hàm tính toán thời hạn bảo hiểm n năm theo ngày đưa vào
     * @param inputDateObj: Date Object
     * @param numOfYear: number
     * @returns Date Object
     */
    calculatorExpiredTimeOfContract_new(inputDateObj, numOfYear) {
        let temp = new Date(inputDateObj);
        temp.setHours(0, 0, 0, 0);
        let temp2 = new Date(temp);
        return new Date(temp2.setFullYear(temp2.getFullYear() + +numOfYear) - 1);
    }
    /** chuyển chuỗi có dấu sang không dấu */
    toSignless(string: string) {
        string = string.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
        string = string.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
        string = string.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
        string = string.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
        string = string.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
        string = string.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
        string = string.replace(/Đ/g, "D");
        string = string.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        string = string.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        string = string.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        string = string.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        string = string.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        string = string.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        string = string.replace(/đ/g, "d");
        string = string.replace(/ + /g, " ");
        string = string.trim();
        return string;
    }
    /** xóa toàn bộ các giá trị sai trong mảng bao gồm: undefined, null, 0, false, NaN, "" */
    cleanArray(arr) {
        var newArray = new Array();
        for (var i = 0; i < arr.length; i++) {
            if (arr[i]) {
                newArray.push(arr[i]);
            }
        }
        return newArray;
    }
    /** chuyển đổi những param phía sau dấu ? trên url thành object */
    convertParamsToObjectInURL(url: string, bonusParams?: Object) {
        let split = url.split("?");
        if (split[1]) {
            // return JSON.parse('{"' + split[1].replace(/&/g, '","').replace(/=/g, '":"') + '"}', function(key, value) {
            //     return key === "" ? value : decodeURIComponent(value);
            // });
            return Object.assign({}, bonusParams, JSON.parse('{"' + split[1].replace(/&/g, '","').replace(/=/g, '":"') + '"}', function(key, value) {
                return key === "" ? value : decodeURIComponent(value);
            }))
        }
    }
    /** loại bỏ những param phía sau dấu ? trên url */
    cleanParamsInURL(url: string) {
        return url.split("?")[0];
    }
}
