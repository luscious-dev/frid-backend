import { IsString, IsOptional, IsDateString, IsInt, IsBoolean, Min } from 'class-validator';

export class UpdateEventDto {
    @IsOptional()
    @IsString()
    tallyFormId?: string;

    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    venue?: string;

    @IsOptional()
    @IsDateString()
    eventDate?: string;

    @IsOptional()
    @IsInt()
    @Min(1)
    capacity?: number;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
