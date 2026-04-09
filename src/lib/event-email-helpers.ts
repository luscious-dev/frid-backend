import { Event } from '@prisma/client';
import { generateCalendarFile } from '../services/mail/email-delivery';

/**
 * Format event date for email display
 * @param date - Event date
 * @returns Formatted date string (e.g., "April 21, 2026")
 */
export function formatEventDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });
}

/**
 * Format event time range for email display
 * @param startDate - Event start date/time
 * @param endDate - Event end date/time
 * @param timezone - Event timezone (optional)
 * @returns Formatted time string (e.g., "6:00 PM - 8:00 PM WAT")
 */
export function formatEventTime(startDate: Date, endDate: Date, timezone?: string): string {
    const startTime = startDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });

    const endTime = endDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });

    // Extract timezone abbreviation from timezone string
    const timezoneAbbr = timezone ? getTimezoneAbbreviation(timezone) : '';

    return `${startTime} - ${endTime}${timezoneAbbr ? ' ' + timezoneAbbr : ''}`;
}

/**
 * Get timezone abbreviation from IANA timezone identifier
 * @param timezone - IANA timezone identifier (e.g., "Africa/Lagos")
 * @returns Timezone abbreviation (e.g., "WAT")
 */
function getTimezoneAbbreviation(timezone: string): string {
    // Common timezone abbreviations
    const timezoneMap: Record<string, string> = {
        'Africa/Lagos': 'WAT',
        'America/New_York': 'EST/EDT',
        'America/Chicago': 'CST/CDT',
        'America/Los_Angeles': 'PST/PDT',
        'Europe/London': 'GMT/BST',
        'Europe/Paris': 'CET/CEST',
        'Asia/Tokyo': 'JST',
        // Add more as needed
    };

    return timezoneMap[timezone] || '';
}

/**
 * Generate calendar download link for an event
 * @param event - Event object from database
 * @param baseUrl - Base URL of your application (e.g., "https://yourdomain.com")
 * @returns Calendar download URL
 */
export function generateCalendarDownloadLink(event: Event, baseUrl: string): string {
    // Option 1: Generate data URL (works but may have size limits)
    const calendarContent = generateCalendarFile({
        title: event.title,
        startDate: event.startDate,
        endDate: event.endDate,
        location: event.venue || 'Online',
        description: event.description || undefined,
        meetingLink: event.meetingLink || undefined,
    });

    // Encode as base64 data URL
    const base64Content = Buffer.from(calendarContent).toString('base64');
    return `data:text/calendar;base64,${base64Content}`;

    // Option 2: API endpoint (recommended for production)
    // return `${baseUrl}/api/events/${event.id}/calendar.ics`;
}

/**
 * Prepare event data for email template
 * @param event - Event object from database
 * @param baseUrl - Base URL for calendar download
 * @returns Email template data
 */
export function prepareEventEmailData(event: Event, baseUrl: string) {
    return {
        eventTitle: event.title,
        eventDate: formatEventDate(event.startDate),
        eventTime: formatEventTime(event.startDate, event.endDate, event.timezone),
        eventVenue: event.venue || 'Online',
        meetingLink: event.meetingLink || undefined,
        meetingId: event.meetingId || undefined,
        meetingPasscode: event.meetingPasscode || undefined,
        calendarLink: generateCalendarDownloadLink(event, baseUrl),
        hostName: event.hostName,
    };
}
