import { Body, Controller, Headers, Param, Post, UnauthorizedException } from '@nestjs/common';
import { RegistrationService } from './registration.service';
import { createHmac } from 'node:crypto';
import { CreateRegistrationDto, RegistrationStatus } from './dto';

@Controller('registration/:eventId')
export class RegistrationController {
    constructor(private readonly registrationService: RegistrationService) { }

    @Post("webhook")
    async createRegistrationHook(@Body() payload: any, @Headers('tally-signature') signature: string, @Param('eventId') eventId: string) {
        // Validate signing secret exists
        const signingSecret = process.env.TALLY_SIGNING_SECRET;
        if (!signingSecret) {
            throw new Error('TALLY_SIGNING_SECRET is not configured');
        }

        console.log("Received signature:", signature);

        // Calculate the signature using the signing secret and the payload
        const calculatedSignature = createHmac('sha256', signingSecret)
            .update(JSON.stringify(payload))
            .digest('base64');

        // Verify signature matches
        if (calculatedSignature !== signature) {
            throw new UnauthorizedException('Invalid signature');
        }

        console.log("Signature validated successfully");

        let firstName = "";
        let lastName = "";
        let email = "";
        let phone = "";
        let tallySubmissionId = "";
        let joinCommunity = false;

        console.log("Received payload:", payload);

        for (const field of payload.fields) {
            if (field.id === "first_name") {
                firstName = field.value;
            } else if (field.id === "Last name") {
                lastName = field.value;
            } else if (field.id === "Email") {
                email = field.value;
            } else if (field.id === "Phone Number (Whatsapp)") {
                phone = field.value;
            } else if (field.id === "tally_submission_id") {
                tallySubmissionId = field.value;
            } else if (field.id === "Would you like to join our community?") {
                joinCommunity = field.value?.toLowerCase() === "yes";
            }
        }

        // Process the webhook
        let registrationData: CreateRegistrationDto = {
            eventId: eventId,
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone,
            joinCommunity: joinCommunity,
            tallySubmissionId: tallySubmissionId,
            rawPayload: payload,
            status: RegistrationStatus.CONFIRMED
        };

        await this.registrationService.createRegistration(registrationData);
    }
}
