import { Event, Registration } from '@prisma/client';

export class EventDto {
    id!: string;
    tallyFormId!: string;
    title!: string;
    description!: string | null;
    venue!: string | null;
    eventDate!: Date;
    capacity!: number | null;
    isActive!: boolean;
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
            eventDate: event.eventDate,
            capacity: event.capacity,
            isActive: event.isActive,
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
