import { Injectable } from '@nestjs/common';
import { prisma } from '../../lib/prisma';
import { CreateRegistrationDto, UpdateRegistrationDto, RegistrationDto } from './dto';

@Injectable()
export class RegistrationService {

    async createRegistration(createDto: CreateRegistrationDto): Promise<RegistrationDto> {
        const registration = await prisma.registration.create({ data: createDto });
        return RegistrationDto.fromModel(registration);
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
