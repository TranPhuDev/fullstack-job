package vn.tranphudev.jobhunter.domain.response.job;

import java.util.List;

public class CompanyWithJobsDTO {
    private Long id;
    private String name;
    private String logo;
    private String address;
    private String description;
    private String workingTime;
    private String companyPic;
    private String field;
    private String scale;
    private String overTime;
    private Long jobCount;
    private List<String> jobNames;
    private List<Long> jobIds;

    public CompanyWithJobsDTO(Long id, String name, String logo, String address, String description,
            String workingTime, String companyPic, String field, String scale, String overTime,
            Long jobCount, List<String> jobNames, List<Long> jobIds) {
        this.id = id;
        this.name = name;
        this.logo = logo;
        this.address = address;
        this.description = description;
        this.workingTime = workingTime;
        this.companyPic = companyPic;
        this.field = field;
        this.scale = scale;
        this.overTime = overTime;
        this.jobCount = jobCount;
        this.jobNames = jobNames;
        this.jobIds = jobIds;
    }

    // Getters & Setters
    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getLogo() {
        return logo;
    }

    public String getAddress() {
        return address;
    }

    public String getDescription() {
        return description;
    }

    public String getWorkingTime() {
        return workingTime;
    }

    public String getField() {
        return field;
    }

    public String getScale() {
        return scale;
    }

    public String getOverTime() {
        return overTime;
    }

    public String getCompanyPic() {
        return companyPic;
    }

    public Long getJobCount() {
        return jobCount;
    }

    public List<String> getJobNames() {
        return jobNames;
    }

    public List<Long> getJobIds() {
        return jobIds;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setLogo(String logo) {
        this.logo = logo;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setWorkingTime(String workingTime) {
        this.workingTime = workingTime;
    }

    public void setField(String field) {
        this.field = field;
    }

    public void setScale(String scale) {
        this.scale = scale;
    }

    public void setOverTime(String overTime) {
        this.overTime = overTime;
    }

    public void setJobCount(Long jobCount) {
        this.jobCount = jobCount;
    }

    public void setJobNames(List<String> jobNames) {
        this.jobNames = jobNames;
    }

    public void setJobIds(List<Long> jobIds) {
        this.jobIds = jobIds;
    }
}
