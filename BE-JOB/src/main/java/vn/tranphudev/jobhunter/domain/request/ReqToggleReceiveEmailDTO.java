package vn.tranphudev.jobhunter.domain.request;

public class ReqToggleReceiveEmailDTO {
    private String email;
    private boolean receiveEmail;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public boolean isReceiveEmail() {
        return receiveEmail;
    }

    public void setReceiveEmail(boolean receiveEmail) {
        this.receiveEmail = receiveEmail;
    }
}