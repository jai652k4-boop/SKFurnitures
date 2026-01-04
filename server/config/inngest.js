import { Inngest } from 'inngest';

export const inngest = new Inngest({
    id: 'hotel-management',
    eventKey: process.env.INNGEST_EVENT_KEY
});

export default inngest;
