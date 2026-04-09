import { IsString, IsOptional, IsDateString, IsInt, IsBoolean, Min, IsArray, IsEmail } from 'class-validator';

export class CreateEventDto {
    @IsString()
    title!: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    venue?: string;

    // Event timing
    @IsDateString()
    startDate!: string;

    @IsDateString()
    endDate!: string;

    @IsOptional()
    @IsString()
    timezone?: string; // Default: "Africa/Lagos"

    // Event capacity and status
    @IsOptional()
    @IsInt()
    @Min(1)
    capacity?: number;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    // Virtual meeting details
    @IsOptional()
    @IsString()
    meetingLink?: string;

    @IsOptional()
    @IsString()
    meetingId?: string;

    @IsOptional()
    @IsString()
    meetingPasscode?: string;

    // Event host information
    @IsOptional()
    @IsString()
    hostName?: string; // Default: "Bolu Taiwo"

    @IsOptional()
    @IsEmail()
    hostEmail?: string;

    // Additional metadata
    @IsOptional()
    @IsString()
    bannerUrl?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tags?: string[];
}
