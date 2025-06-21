package vn.tranphudev.jobhunter.controller;

import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.turkraft.springfilter.boot.Filter;

import jakarta.validation.Valid;
import vn.tranphudev.jobhunter.domain.Company;
import vn.tranphudev.jobhunter.domain.response.ResultPaginationDTO;
import vn.tranphudev.jobhunter.service.CompanyService;
import vn.tranphudev.jobhunter.util.annotaion.ApiMessage;

import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/api/v1")
public class CompanyController {

    CompanyService companyService;

    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }

    // create company
    @PostMapping("/companies")
    @ApiMessage("Create companies success")
    public ResponseEntity<Company> createNewCompany(@Valid @RequestBody Company company) {
        Company newCompany = this.companyService.handleCreateCompany(company);
        return ResponseEntity.status(HttpStatus.CREATED).body(newCompany);
    }

    // get all company
    @GetMapping("/companies")
    @ApiMessage("Fetch companies")
    public ResponseEntity<ResultPaginationDTO> getCompany(
            @Filter Specification<Company> spec, Pageable pageable) {

        return ResponseEntity.ok(this.companyService.handleGetCompany(spec, pageable));
    }

    // update company
    @PutMapping("/companies")
    public ResponseEntity<Company> updateCompany(@RequestBody Company company) {
        Company updateCompany = this.companyService.handleUpdateCompany(company);
        return ResponseEntity.ok(updateCompany);
    }

}
