import { CronJob } from 'cron';
import sendEventEmail from "./sendEventEmail";

export default function startEmailSendingJob() {
    const job = CronJob.from({
        cronTime: '0 * * * * *',
        onTick: sendEventEmail,
        start: true,
    });
}
