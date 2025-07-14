package vn.tranphudev.jobhunter.controller;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.transaction.Transactional;
import vn.tranphudev.jobhunter.service.EmailService;
import vn.tranphudev.jobhunter.service.SubscriberService;
import vn.tranphudev.jobhunter.util.annotaion.ApiMessage;
import vn.tranphudev.jobhunter.util.error.SecurityUtil;
import org.springframework.http.ResponseEntity;
import vn.tranphudev.jobhunter.domain.response.RestResponse;
import vn.tranphudev.jobhunter.domain.response.email.ResSendMailDTO;
import java.util.concurrent.TimeUnit;
// import vn.tranphudev.jobhunter.service.DynamicMailScheduler;

@RestController
@RequestMapping("/api/v1")
public class EmailController {

    private final EmailService emailService;
    private final SubscriberService subscriberService;
    // private final DynamicMailScheduler dynamicMailScheduler;

    public EmailController(EmailService emailService, SubscriberService subscriberService) {
        this.emailService = emailService;
        this.subscriberService = subscriberService;
    }

    @GetMapping("/email")
    @ApiMessage("Send simple email")
    public ResponseEntity<ResSendMailDTO> sendSimpleEmail() {
        String email = SecurityUtil.getCurrentUserLogin().orElse(null);
        if (email == null) {
            return ResponseEntity.status(401).body(new ResSendMailDTO(401, null, "Bạn chưa đăng nhập", null));
        }

        var subscriber = this.subscriberService.findByEmail(email);
        if (subscriber == null || !subscriber.isReceiveEmail()) {
            return ResponseEntity.status(400)
                    .body(new ResSendMailDTO(400, null, "Bạn chưa đăng ký nhận email hoặc đã tắt nhận email", null));
        }

        // Gửi mail ngay lần đầu
        this.subscriberService.sendSubscribersEmailJobsForOne(subscriber);

        return ResponseEntity
                .ok(new ResSendMailDTO(200, "Gửi mail thành công!", null, "ok"));
    }

}
