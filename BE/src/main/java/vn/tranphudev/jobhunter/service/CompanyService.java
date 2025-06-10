package vn.tranphudev.jobhunter.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import vn.tranphudev.jobhunter.domain.Company;
import vn.tranphudev.jobhunter.domain.User;
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

    public List<Company> handelGetAllCompany() {
        return this.companyRepositoty.findAll();
    }

    public Company handleGetCompanyById(long id) {
        Optional<Company> companyOptinal = this.companyRepositoty.findById(id);
        if (companyOptinal.isPresent()) {
            return companyOptinal.get();
        }
        return null;
    }

    public Company handleUpdateCompany(Company company) {
        Company currentCompany = this.handleGetCompanyById(company.getId());
        if (currentCompany != null) {
            currentCompany.setName(company.getName());
            currentCompany.setDescription(company.getDescription());
            currentCompany.setAddress(company.getAddress());
            currentCompany.setLogo(company.getLogo());

            currentCompany = this.companyRepositoty.save(currentCompany);
        }

        return currentCompany;
    }

    public void handleDeleteCompany(long id) {
        this.companyRepositoty.deleteById(id);
    }
}
