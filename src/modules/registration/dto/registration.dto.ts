import { Registration, Event } from '@prisma/client';
import { RegistrationStatus } from './create-registration.dto';

export class RegistrationDto {
    id!: string;
    eventId!: string;
    firstName!: string;
    lastName!: string;
    email!: string;
    phone!: string | null;
    tallySubmissionId!: string;
    rawPayload!: Record<string, any>;
    status!: RegistrationStatus;
    attended!: boolean;
    checkedInAt!: Date | null;
    confirmationSentAt!: Date | null;
    reminderSentAt!: Date | null;
    joinCommunity?: boolean;
    createdAt!: Date;
    updatedAt!: Date;
    event?: {
        id: string;
        title: string;
        eventDate: Date;
    };

    constructor(partial: Partial<RegistrationDto>) {
        Object.assign(this, partial);
    }

    static fromModel(registration: Registration): RegistrationDto {
        return new RegistrationDto({
            id: registration.id,
            eventId: registration.eventId,
            firstName: registration.firstName,
            lastName: registration.lastName,
            email: registration.email,
            phone: registration.phone,
            tallySubmissionId: registration.tallySubmissionId,
            rawPayload: registration.rawPayload as Record<string, any>,
            status: registration.status as RegistrationStatus,
            attended: registration.attended,
            checkedInAt: registration.checkedInAt,
            confirmationSentAt: registration.confirmationSentAt,
            reminderSentAt: registration.reminderSentAt,
            joinCommunity: registration.joinCommunity,

            createdAt: registration.createdAt,
            updatedAt: registration.updatedAt,
        });
    }

    static fromModelWithEvent(
        registration: Registration & { event?: Event },
    ): RegistrationDto {
        const dto = RegistrationDto.fromModel(registration);
        if (registration.event) {
            dto.event = {
                id: registration.event.id,
                title: registration.event.title,
                eventDate: registration.event.eventDate,
            };
        }
        return dto;
    }
}
