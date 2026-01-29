import { Type } from "class-transformer";
import { IsInt, IsOptional, IsPositive, Min } from "class-validator";


//Entrada
export class PaginationDto {
    @IsOptional()
    @IsInt()
    @IsPositive()
    @Type(() => Number)
    limit: number = 10;

    @IsOptional()
    @IsInt()
    @Min(1)
    @Type(() => Number)
    page: number = 1;



}


//!Respuesta
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

