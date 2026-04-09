import { Injectable } from '@nestjs/common';
import { prisma } from '../../lib/prisma';
import { CreateRegistrationDto, UpdateRegistrationDto, RegistrationDto } from './dto';
import { generateCalendarFile, sendRegistrationConfirmationEmail } from 'src/services/mail/email-delivery';

@Injectable()
export class RegistrationService {

    async createRegistration(createDto: CreateRegistrationDto): Promise<RegistrationDto> {
        let existingRegistration = await prisma.registration.findFirst({
            where: {
                eventId: createDto.eventId,
                email: createDto.email
            }
        });
        if (!existingRegistration) {
            existingRegistration = await prisma.registration.create({ data: createDto });

            await sendRegistrationConfirmationEmail({
                email: existingRegistration.email,
                firstName: existingRegistration.firstName,
                eventTitle: 'From Confusion to Clarity',
                eventDate: 'April 21, 2026',
                eventTime: '6pm-8pm WAT',
                eventVenue: 'Zoom',
                calendarLink: generateCalendarFile({
                    title: 'From Confusion to Clarity',
                    startDate: new Date('2026-04-21T18:00:00Z'),
                    endDate: new Date('2026-04-21T20:00:00Z'),
                    location: 'Zoom',
                    description: 'From Confusion to Clarity: First Step Toward Purpose',
                    meetingLink: process.env.MEETING_LINK,
                }),
            });
        }

        return RegistrationDto.fromModel(existingRegistration);
    }

    async findAllByEvent(eventId: string): Promise<RegistrationDto[]> {
        const registrations = await prisma.registration.findMany({
            where: { eventId },
            orderBy: { createdAt: 'desc' }
        });
        return registrations.map(RegistrationDto.fromModel);
    }

    async findById(id: string): Promise<RegistrationDto> {
        const registration = await prisma.registration.findUniqueOrThrow({
            where: { id },
            include: { event: true }
        });
        return RegistrationDto.fromModelWithEvent(registration);
    }

    async updateRegistration(id: string, updateDto: UpdateRegistrationDto): Promise<RegistrationDto> {
        const registration = await prisma.registration.update({
            where: { id },
            data: {
                ...updateDto,
                checkedInAt: updateDto.checkedInAt ? new Date(updateDto.checkedInAt) : undefined,
                confirmationSentAt: updateDto.confirmationSentAt ? new Date(updateDto.confirmationSentAt) : undefined,
                reminderSentAt: updateDto.reminderSentAt ? new Date(updateDto.reminderSentAt) : undefined,
            }
        });
        return RegistrationDto.fromModel(registration);
    }

    async deleteRegistration(id: string): Promise<void> {
        await prisma.registration.delete({ where: { id } });
    }
}
