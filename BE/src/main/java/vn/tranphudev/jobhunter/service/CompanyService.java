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

    public Company handleUpdateCompany(Company company) {
        Optional<Company> companyOptional = this.companyRepositoty.findById(company.getId());
        if (companyOptional.isPresent()) {
            Company currentCompany = companyOptional.get();
            currentCompany.setName(company.getName());
            currentCompany.setDescription(company.getDescription());
            currentCompany.setAddress(company.getAddress());
            currentCompany.setLogo(company.getLogo());

            return this.companyRepositoty.save(currentCompany);

        }

        return null;
    }

    public void handleDeleteCompany(long id) {
        this.companyRepositoty.deleteById(id);
    }
}
