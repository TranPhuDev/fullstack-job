package vn.tranphudev.jobhunter.domain.response.email;

public class ResSendMailDTO {
    private int statusCode;
    private String message;
    private String error;
    private String data;

    public ResSendMailDTO() {
    }

    public ResSendMailDTO(int statusCode, String message, String error, String data) {
        this.statusCode = statusCode;
        this.message = message;
        this.error = error;
        this.data = data;
    }

    public int getStatusCode() {
        return statusCode;
    }

    public void setStatusCode(int statusCode) {
        this.statusCode = statusCode;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }
}