import { CronJob } from 'cron';
import sendEventEmail from "./sendEventEmail";

const jobObject = {
    cronTime: '0 * * * * *',
    onTick: sendEventEmail,
    start: true,
}

export default function startEmailSendingJob() {
    const job = CronJob.from(jobObject)
}
