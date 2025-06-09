package vn.tranphudev.jobhunter.service;

import org.springframework.stereotype.Service;

import vn.tranphudev.jobhunter.domain.Company;
import vn.tranphudev.jobhunter.repository.CompanyRepositoty;

@Service
public class CompanyService {

    private final CompanyRepositoty companyRepositoty;

    public CompanyService(CompanyRepositoty companyRepositoty) {
        this.companyRepositoty = companyRepositoty;
    }

    public Company handleCreateCompany(Company company) {
        return this.companyRepositoty.save(company);
    }
}
