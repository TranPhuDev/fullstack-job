package vn.tranphudev.jobhunter.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import vn.tranphudev.jobhunter.domain.Company;

@Repository
public interface CompanyRepositoty extends JpaRepository<Company, Long> {

}
