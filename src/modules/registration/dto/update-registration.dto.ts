import { IsString, IsEmail, IsOptional, IsEnum, IsBoolean, IsDateString } from 'class-validator';
import { RegistrationStatus } from './create-registration.dto';

export class UpdateRegistrationDto {
    @IsOptional()
    @IsString()
    firstName?: string;

    @IsOptional()
    @IsString()
    lastName?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsEnum(RegistrationStatus)
    status?: RegistrationStatus;

    @IsOptional()
    @IsBoolean()
    attended?: boolean;

    @IsOptional()
    @IsDateString()
    checkedInAt?: string;

    @IsOptional()
    @IsDateString()
    confirmationSentAt?: string;

    @IsOptional()
    @IsDateString()
    reminderSentAt?: string;
}
