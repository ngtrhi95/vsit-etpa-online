/** loại sản phẩm bán online */
export enum OnlineGroupType {
    /** nhóm bảo hiểm xe cơ giới */
    grXCG = 1,
    /** bảo hiểm tnds bắt buộc */
    grTNDS = 2,
    /** nhóm bảo hiểm tài sản kỹ thuật */
    grTSKT = 3,
    /** nhóm bảo hiểm con người */
    grCN = 4,
    /** nhóm bảo hiểm thiết bị di động */
    grTBDD = 5,
    /** nhóm bảo hiểm xe ô tô */
    grOto = 6
}


export enum ContractType {
    BASE_CONTRACT = 0,
    HUMAN_CONTRACT = 1,
    VEHICLE_CONTRACT = 2,
    BUILDING_CONTRACT = 3,
    HAPPYFAMILY_CONTRACT = 4,
    MOBILE_DEVICE_CONTRACT = 11
}
