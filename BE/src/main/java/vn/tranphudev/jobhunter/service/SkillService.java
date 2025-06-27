package vn.tranphudev.jobhunter.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import vn.tranphudev.jobhunter.domain.Skill;
import vn.tranphudev.jobhunter.domain.User;
import vn.tranphudev.jobhunter.domain.response.ResultPaginationDTO;
import vn.tranphudev.jobhunter.repository.SkillRepository;

@Service
public class SkillService {

    SkillRepository skillRepository;

    public SkillService(SkillRepository skillRepository) {
        this.skillRepository = skillRepository;
    }

    // find skill by id
    public Skill handleGetSkillById(long id) {
        Optional<Skill> skillOptinal = this.skillRepository.findById(id);
        if (skillOptinal.isPresent()) {
            return skillOptinal.get();
        }
        return null;
    }

    // create skill
    public Skill handleCreateSkill(Skill skill) {
        return this.skillRepository.save(skill);
    }

    public boolean isSkillExits(String name) {
        return this.skillRepository.existsByName(name);
    }

    // update skill
    public Skill handleUpdateSkill(Skill reqSkill) {
        Skill currentSkill = this.handleGetSkillById(reqSkill.getId());
        if (currentSkill != null) {
            currentSkill.setName(reqSkill.getName());
        }

        return this.skillRepository.save(currentSkill);
    }

    // get all skills
    public ResultPaginationDTO handleFetchAllSkills(Specification<Skill> spec, Pageable pageable) {
        Page<Skill> pageUser = this.skillRepository.findAll(spec, pageable);

        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta mt = new ResultPaginationDTO.Meta();

        mt.setPage(pageable.getPageNumber() + 1);
        mt.setPageSize(pageable.getPageSize());

        mt.setPages(pageUser.getTotalPages());
        mt.setTotal(pageUser.getTotalElements());

        rs.setMeta(mt);

        rs.setResult(pageUser.getContent());
        return rs;
    }

    // Delete skill
    public void deleteSkill(long id) {
        // delete job (inside job_skill table)
        Optional<Skill> skillOptional = this.skillRepository.findById(id);
        Skill currentSkill = skillOptional.get();
        currentSkill.getJobs().forEach(job -> job.getSkills().remove(currentSkill));

        // delete subscriber (inside subscriber_skill table)
        currentSkill.getSubscribers().forEach(subs -> subs.getSkills().remove(currentSkill));

        // delete skill
        this.skillRepository.delete(currentSkill);
    }
}
