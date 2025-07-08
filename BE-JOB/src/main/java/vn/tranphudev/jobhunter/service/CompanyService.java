package vn.tranphudev.jobhunter.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import vn.tranphudev.jobhunter.domain.Company;
import vn.tranphudev.jobhunter.domain.User;
import vn.tranphudev.jobhunter.domain.response.ResultPaginationDTO;
import vn.tranphudev.jobhunter.domain.response.job.CompanyWithJobsDTO;
import vn.tranphudev.jobhunter.repository.CompanyRepository;
import vn.tranphudev.jobhunter.repository.UserRepository;

@Service
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;

    public CompanyService(CompanyRepository companyRepository, UserRepository userRepository) {
        this.companyRepository = companyRepository;
        this.userRepository = userRepository;
    }

    public Company handleCreateCompany(Company company) {
        return this.companyRepository.save(company);
    }

    public ResultPaginationDTO handleGetCompany(Specification<Company> spec, Pageable pageable) {
        Page<Company> pCompany = this.companyRepository.findAll(spec, pageable);
        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta mt = new ResultPaginationDTO.Meta();

        mt.setPage(pCompany.getNumber() + 1);
        mt.setPageSize(pCompany.getSize());

        mt.setPages(pCompany.getTotalPages());
        mt.setTotal(pCompany.getTotalElements());

        rs.setMeta(mt);
        rs.setResult(pCompany.getContent());
        return rs;
    }

    public Company handleUpdateCompany(Company company) {
        Optional<Company> companyOptional = this.companyRepository.findById(company.getId());
        if (companyOptional.isPresent()) {
            Company currentCompany = companyOptional.get();
            currentCompany.setName(company.getName());
            currentCompany.setDescription(company.getDescription());
            currentCompany.setWorkingTime(company.getWorkingTime());
            currentCompany.setField(company.getField());
            currentCompany.setScale(company.getScale());
            currentCompany.setOverTime(company.getOverTime());
            currentCompany.setAddress(company.getAddress());
            currentCompany.setLogo(company.getLogo());

            return this.companyRepository.save(currentCompany);

        }

        return null;
    }

    public void handleDeleteCompany(long id) {
        Optional<Company> comOptional = this.companyRepository.findById(id);
        if (comOptional.isPresent()) {
            Company com = comOptional.get();
            // fetch all user belong to this company
            List<User> users = this.userRepository.findByCompany(com);
            this.userRepository.deleteAll(users);
        }
        this.companyRepository.deleteById(id);
    }

    public Optional<Company> findById(long id) {
        return this.companyRepository.findById(id);
    }

    public Company handleDeleteAndReturnCompany(long id) {
        Optional<Company> comOptional = this.companyRepository.findById(id);
        if (comOptional.isPresent()) {
            Company com = comOptional.get();
            // fetch all user belong to this company
            List<User> users = this.userRepository.findByCompany(com);
            this.userRepository.deleteAll(users);
            this.companyRepository.deleteById(id);
            return com;
        }
        return null;
    }

    public List<CompanyWithJobsDTO> getCompaniesWithAtLeastNJobs(int minJobCount) {
        List<Company> companies = companyRepository.findAll(); // hoặc findAll(pageable).getContent()
        return companies.stream()
                .filter(c -> c.getJobs() != null && c.getJobs().size() >= minJobCount)
                .map(c -> new CompanyWithJobsDTO(
                        c.getId(),
                        c.getName(),
                        c.getLogo(),
                        c.getAddress(),
                        c.getDescription(),
                        c.getWorkingTime(),
                        c.getField(),
                        c.getScale(),
                        c.getOverTime(),
                        (long) c.getJobs().size(),
                        c.getJobs().stream().map(job -> job.getName()).collect(Collectors.toList())))
                .collect(Collectors.toList());
    }
}
