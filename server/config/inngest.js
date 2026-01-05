import { Inngest } from 'inngest';

export const inngest = new Inngest({
    id: 'furniture-management',
    eventKey: process.env.INNGEST_EVENT_KEY
});

export default inngest;
