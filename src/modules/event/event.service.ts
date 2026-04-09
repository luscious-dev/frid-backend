import { Injectable } from '@nestjs/common';
import { prisma } from '../../lib/prisma';
import { CreateEventDto, UpdateEventDto, EventDto } from './dto';

@Injectable()
export class EventService {

    constructor() { }

    async createEvent(createEventDto: CreateEventDto): Promise<EventDto> {
        const event = await prisma.event.create({
            data: {
                ...createEventDto,
            }
        });
        return EventDto.fromModel(event);
    }

    async fetchAllEvents(): Promise<EventDto[]> {
        const events = await prisma.event.findMany({
            include: { registrations: true },
            orderBy: { startDate: 'desc' }
        });
        return events.map(event => EventDto.fromModelWithCount(event));
    }

    async fetchEventById(id: string): Promise<EventDto> {
        const event = await prisma.event.findUniqueOrThrow({
            where: { id },
            include: { registrations: true }
        });
        return EventDto.fromModelWithCount(event);
    }

    async updateEvent(id: string, updateEventDto: UpdateEventDto): Promise<EventDto> {
        const event = await prisma.event.update({
            where: { id },
            data: {
                ...updateEventDto,
            }
        });
        return EventDto.fromModel(event);
    }

    async deleteEvent(id: string): Promise<void> {
        await prisma.event.delete({ where: { id } });
    }
}
