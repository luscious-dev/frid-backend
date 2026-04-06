import { IsString, IsEmail, IsOptional, IsObject, IsEnum, IsBoolean } from 'class-validator';

export enum RegistrationStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    CANCELLED = 'CANCELLED',
    WAITLISTED = 'WAITLISTED',
    NO_SHOW = 'NO_SHOW',
}

export class CreateRegistrationDto {
    @IsString()
    eventId!: string;

    @IsString()
    firstName!: string;

    @IsString()
    lastName!: string;

    @IsEmail()
    email!: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsString()
    tallySubmissionId!: string;

    @IsBoolean()
    joinCommunity?: boolean;

    @IsObject()
    rawPayload!: Record<string, any>;
    @IsEnum(RegistrationStatus)
    status?: RegistrationStatus;

    @IsOptional()
    @IsBoolean()
    attended?: boolean;
}
