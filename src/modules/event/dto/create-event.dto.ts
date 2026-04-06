import { IsString, IsOptional, IsDateString, IsInt, IsBoolean, Min } from 'class-validator';

export class CreateEventDto {
    @IsString()
    tallyFormId!: string;

    @IsString()
    title!: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    venue?: string;

    @IsDateString()
    eventDate!: string;
    @IsInt()
    @Min(1)
    capacity?: number;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
