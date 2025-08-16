package vn.tranphudev.jobhunter.controller;

import java.util.List;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.turkraft.springfilter.boot.Filter;

import jakarta.validation.Valid;
import vn.tranphudev.jobhunter.domain.Skill;
import vn.tranphudev.jobhunter.domain.response.ResultPaginationDTO;
import vn.tranphudev.jobhunter.service.SkillService;
import vn.tranphudev.jobhunter.util.annotaion.ApiMessage;
import vn.tranphudev.jobhunter.util.error.IdInvalidException;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/v1")
public class SkillController {

    SkillService skillService;

    public SkillController(SkillService skillService) {
        this.skillService = skillService;
    }

    // Create skill
    @PostMapping("/skills")
    @ApiMessage("Create skill success")
    public ResponseEntity<Skill> createSkill(@Valid @RequestBody Skill skill) throws IdInvalidException {
        boolean isSkillExist = this.skillService.isSkillExits(skill.getName());
        if (isSkillExist) {
            throw new IdInvalidException(
                    "Skill " + skill.getName() + " đã tồn tại, vui lòng điền kĩ năng khác.");
        }
        Skill newSkill = this.skillService.handleCreateSkill(skill);

        return ResponseEntity.status(HttpStatus.CREATED).body(newSkill);
    }

    // Update skill
    @PutMapping("/skills")
    @ApiMessage("Update skill success")
    public ResponseEntity<Skill> updateSkill(@Valid @RequestBody Skill skill) throws IdInvalidException {

        // check id
        Skill currentSkill = this.skillService.handleGetSkillById(skill.getId());
        if (currentSkill == null) {
            throw new IdInvalidException("Skill id = " + skill.getId() + " không tồn tại");
        }

        // check name
        if (skill.getName() != null && this.skillService.isSkillExits(skill.getName())) {
            throw new IdInvalidException("Skill name = " + skill.getName() + " đã tồn tại");
        }

        Skill updateSkill = this.skillService.handleUpdateSkill(skill);

        return ResponseEntity.ok().body(updateSkill);
    }

    // Fetch all skills
    @GetMapping("/skills")
    public ResponseEntity<ResultPaginationDTO> fetchAllSkills(@Filter Specification<Skill> spec, Pageable pageable) {
        return ResponseEntity.status(HttpStatus.OK).body(this.skillService.handleFetchAllSkills(spec, pageable));
    }

    // Fetch all skills without pagination for dropdowns
    @GetMapping("/skills/all")
    public ResponseEntity<List<Skill>> fetchAllSkillsWithoutPagination() {
        return ResponseEntity.status(HttpStatus.OK).body(this.skillService.handleFetchAllSkillsWithoutPagination());
    }

    // Delete skill
    @DeleteMapping("/skills/{id}")
    @ApiMessage("Delete a skill")
    public ResponseEntity<Void> delete(@PathVariable("id") long id) throws IdInvalidException {
        // check id
        Skill currentSkill = this.skillService.handleGetSkillById(id);
        if (currentSkill == null) {
            throw new IdInvalidException("Skill id = " + id + " không tồn tại");
        }
        this.skillService.deleteSkill(id);
        return ResponseEntity.ok().body(null);
    }

}
