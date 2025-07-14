package vn.tranphudev.jobhunter.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class ScheduledMailSender {
    private final SubscriberService subscriberService;

    public ScheduledMailSender(SubscriberService subscriberService) {
        this.subscriberService = subscriberService;
    }

    @Scheduled(fixedRate = 10 * 60 * 1000)
    @Transactional
    public void sendMailToAllSubscribers() {
        subscriberService.sendSubscribersEmailJobs();
    }
}