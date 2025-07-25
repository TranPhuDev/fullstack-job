package vn.tranphudev.jobhunter.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import vn.tranphudev.jobhunter.domain.Subscriber;
import vn.tranphudev.jobhunter.service.SubscriberService;
import vn.tranphudev.jobhunter.util.annotaion.ApiMessage;
import vn.tranphudev.jobhunter.util.error.IdInvalidException;
import vn.tranphudev.jobhunter.util.error.SecurityUtil;
import vn.tranphudev.jobhunter.domain.request.ReqToggleReceiveEmailDTO;

@RestController
@RequestMapping("/api/v1")
public class SubscriberController {
    private final SubscriberService subscriberService;

    public SubscriberController(SubscriberService subscriberService) {
        this.subscriberService = subscriberService;
    }

    @PostMapping("/subscribers")
    @ApiMessage("Create a subscriber")
    public ResponseEntity<Subscriber> create(@Valid @RequestBody Subscriber sub) throws IdInvalidException {
        // check email
        boolean isExist = this.subscriberService.isExistsByEmail(sub.getEmail());
        if (isExist == true) {
            throw new IdInvalidException("Email " + sub.getEmail() + " đã tồn tại");
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(this.subscriberService.create(sub));
    }

    @PutMapping("/subscribers")
    @ApiMessage("Update a subscriber")
    public ResponseEntity<Subscriber> update(@RequestBody Subscriber subsRequest) throws IdInvalidException {
        // check id
        Subscriber subsDB = this.subscriberService.findById(subsRequest.getId());
        if (subsDB == null) {
            throw new IdInvalidException("Id " + subsRequest.getId() + " không tồn tại");
        }
        return ResponseEntity.ok().body(this.subscriberService.update(subsDB, subsRequest));
    }

    @PutMapping("/subscribers/toggle-receive-email")
    @ApiMessage("Toggle receive email for subscriber")
    public ResponseEntity<Subscriber> toggleReceiveEmail(@RequestBody ReqToggleReceiveEmailDTO request)
            throws IdInvalidException {
        Subscriber subsDB = this.subscriberService.findByEmail(request.getEmail());
        if (subsDB == null) {
            throw new IdInvalidException("Email " + request.getEmail() + " không tồn tại");
        }
        subsDB.setReceiveEmail(request.isReceiveEmail());
        return ResponseEntity.ok().body(this.subscriberService.update(subsDB, subsDB));
    }

    @PutMapping("/subscribers/unsubscribe")
    @ApiMessage("Unsubscribe from email notifications")
    public ResponseEntity<Subscriber> unsubscribe() throws IdInvalidException {
        String email = SecurityUtil.getCurrentUserLogin().orElse(null);
        if (email == null) {
            throw new IdInvalidException("Bạn chưa đăng nhập");
        }
        Subscriber subsDB = this.subscriberService.findByEmail(email);
        if (subsDB == null) {
            throw new IdInvalidException("Email " + email + " không tồn tại");
        }
        subsDB.setReceiveEmail(false);
        return ResponseEntity.ok().body(this.subscriberService.update(subsDB, subsDB));
    }

    @PutMapping("/subscribers/resubscribe")
    @ApiMessage("Resubscribe to email notifications")
    public ResponseEntity<Subscriber> resubscribe() throws IdInvalidException {
        String email = SecurityUtil.getCurrentUserLogin().orElse(null);
        if (email == null) {
            throw new IdInvalidException("Bạn chưa đăng nhập");
        }
        Subscriber subsDB = this.subscriberService.findByEmail(email);
        if (subsDB == null) {
            throw new IdInvalidException("Email " + email + " không tồn tại");
        }
        subsDB.setReceiveEmail(true);
        return ResponseEntity.ok().body(this.subscriberService.update(subsDB, subsDB));
    }

    @PostMapping("/subscribers/skills")
    @ApiMessage("Get subscriber's skill")
    public ResponseEntity<Subscriber> getSubscribersSkill() throws IdInvalidException {
        String email = SecurityUtil.getCurrentUserLogin().isPresent() == true
                ? SecurityUtil.getCurrentUserLogin().get()
                : "";

        return ResponseEntity.ok().body(this.subscriberService.findByEmail(email));
    }

}
