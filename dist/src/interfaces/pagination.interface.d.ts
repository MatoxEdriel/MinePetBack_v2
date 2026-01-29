export declare class PaginationDto {
    limit: number;
    page: number;
}
export interface PaginationInfo {
    page: number;
    limit: number;
    total: number;
    showing: number;
}
export interface PaginatedResponse<T> {
    items: T[];
    pagination: PaginationInfo;
}
