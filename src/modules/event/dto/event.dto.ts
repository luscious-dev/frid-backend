import { Event, Registration } from '@prisma/client';

export class EventDto {
    id!: string;
    title!: string;
    description!: string | null;
    venue!: string | null;

    // Event timing
    startDate!: Date;
    endDate!: Date;
    timezone!: string;

    // Event capacity and status
    capacity!: number | null;
    isActive!: boolean;

    // Virtual meeting details
    meetingLink!: string | null;
    meetingId!: string | null;
    meetingPasscode!: string | null;

    // Event host information
    hostName!: string;
    hostEmail!: string | null;

    // Additional metadata
    bannerUrl!: string | null;
    tags!: string[];

    createdAt!: Date;
    updatedAt!: Date;
    registrationCount?: number;

    constructor(partial: Partial<EventDto>) {
        Object.assign(this, partial);
    }

    static fromModel(event: Event): EventDto {
        return new EventDto({
            id: event.id,
            title: event.title,
            description: event.description,
            venue: event.venue,
            startDate: event.startDate,
            endDate: event.endDate,
            timezone: event.timezone,
            capacity: event.capacity,
            isActive: event.isActive,
            meetingLink: event.meetingLink,
            meetingId: event.meetingId,
            meetingPasscode: event.meetingPasscode,
            hostName: event.hostName,
            hostEmail: event.hostEmail,
            bannerUrl: event.bannerUrl,
            tags: event.tags,
            createdAt: event.createdAt,
            updatedAt: event.updatedAt,
        });
    }

    static fromModelWithCount(
        event: Event & { registrations?: Registration[] },
    ): EventDto {
        return new EventDto({
            ...EventDto.fromModel(event),
            registrationCount: event.registrations?.length ?? 0,
        });
    }
}
