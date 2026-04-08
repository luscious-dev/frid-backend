import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto, EventDto } from './dto';

@Controller('event')
export class EventController {
    constructor(private readonly eventService: EventService) { }

    @Post()
    async createEvent(@Body() createEventDto: CreateEventDto) {
        return await this.eventService.createEvent(createEventDto);
    }

    @Get(":id")
    async getEvent(@Param("id") id: string) {
        return await this.eventService.fetchEventById(id);
    }

    @Get()
    async getAllEvents() {
        return await this.eventService.fetchAllEvents();
    }
}
