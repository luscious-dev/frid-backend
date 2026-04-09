import sgMail from '@sendgrid/mail';
import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';
import { CreateRegistrationDto, RegistrationDto } from 'src/modules/registration/dto';

// Initialize SendGrid with API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

interface RegistrationEmailData {
    email: string;
    firstName: string;
    eventTitle: string;
    eventDate: string;
    eventTime: string;
    eventVenue: string;
    calendarLink: string;
}

/**
 * Send registration confirmation email using SendGrid
 * @param registration - Registration data containing email and event details
 */
export async function sendRegistrationConfirmationEmail(registration: RegistrationEmailData) {
    try {
        // Read and compile the Handlebars template
        const templatePath = path.join(__dirname, 'templates', 'registration-confirmation.hbs');
        const templateSource = fs.readFileSync(templatePath, 'utf-8');
        const template = Handlebars.compile(templateSource);

        // Generate HTML content from template
        const htmlContent = template({
            firstName: registration.firstName,
            eventTitle: registration.eventTitle,
            eventDate: registration.eventDate,
            eventTime: registration.eventTime,
            eventVenue: "Zoom",
            meetingLink: process.env.MEETING_LINK,
            meetingId: process.env.MEETING_ID,
            meetingPasscode: process.env.MEETING_PASSCODE,
            calendarLink: registration.calendarLink,
            email: registration.email,
        });

        // Configure email message
        const msg = {
            to: registration.email,
            from: {
                email: process.env.SENDGRID_FROM_EMAIL!,
                name: process.env.SENDGRID_FROM_NAME!,
            },
            subject: `You're Registered! - ${registration.eventTitle}`,
            html: htmlContent,
        };

        // Send email via SendGrid
        const response = await sgMail.send(msg);

        console.log('Email sent successfully:', {
            to: registration.email,
            statusCode: response[0].statusCode,
            messageId: response[0].headers['x-message-id'],
        });

        return {
            success: true,
            messageId: response[0].headers['x-message-id'],
        };
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

/**
 * Generate calendar (.ics) file content for the event
 * @param eventDetails - Event details for calendar generation
 */
export function generateCalendarFile(eventDetails: {
    title: string;
    startDate: Date;
    endDate: Date;
    location: string;
    description?: string;
    meetingLink?: string;
}): string {
    const formatDate = (date: Date): string => {
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Frid Events//Event Registration//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        `DTSTART:${formatDate(eventDetails.startDate)}`,
        `DTEND:${formatDate(eventDetails.endDate)}`,
        `SUMMARY:${eventDetails.title}`,
        `LOCATION:${eventDetails.location}`,
        eventDetails.description ? `DESCRIPTION:${eventDetails.description}${eventDetails.meetingLink ? '\\n\\nJoin Link: ' + eventDetails.meetingLink : ''}` : '',
        `UID:${Date.now()}@frid.com`,
        'STATUS:CONFIRMED',
        'SEQUENCE:0',
        'END:VEVENT',
        'END:VCALENDAR',
    ].filter(Boolean).join('\r\n');

    return icsContent;
}