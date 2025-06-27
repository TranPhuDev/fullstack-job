package vn.tranphudev.jobhunter.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import vn.tranphudev.jobhunter.service.EmailService;
import vn.tranphudev.jobhunter.service.SubscriberService;
import vn.tranphudev.jobhunter.util.annotaion.ApiMessage;

@RestController
@RequestMapping("/api/v1")
public class EmailController {

    private final EmailService emailService;
    private final SubscriberService subscriberService;

    public EmailController(EmailService emailService, SubscriberService subscriberService) {
        this.emailService = emailService;
        this.subscriberService = subscriberService;
    }

    @GetMapping("/email")
    @ApiMessage("Send simple email")
    public String sendSimpleEmail() {
        // this.emailService.sendEmailSync("ilovewhenifyoucallme@gmail.com", "Test",
        // "<h1><b>Hello</b></h1>", false,
        // true);
        // this.emailService.sendEmailFromTemplateSync("ilovewhenifyoucallme@gmail.com",
        // "Test send maul", "job");
        this.subscriberService.sendSubscribersEmailJobs();
        return "ok";
    }
}
