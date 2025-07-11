package vn.tranphudev.jobhunter.domain.response;

import lombok.Getter;
import lombok.Setter;
import vn.tranphudev.jobhunter.domain.Role;

@Getter
@Setter
public class ResUpdatePasswordDTO {
    private long id;
    private String email;
    private String name;
    private String avatar;
    private Role role;
}