package vn.tranphudev.jobhunter.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import vn.tranphudev.jobhunter.domain.User;
import vn.tranphudev.jobhunter.service.UserService;

@RestController
public class UserController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserService userService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/users")
    public ResponseEntity<User> createNewUser(@RequestBody User user) {
        String hashPassword = this.passwordEncoder.encode(user.getPassword());
        user.setPassword(hashPassword);
        User newUser = this.userService.handleCreateUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(newUser);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable("id") long id) {

        this.userService.handleDeleteUser(id);
        return ResponseEntity.ok("delete success");
        // return ResponseEntity.status(HttpStatus.OK).body("ericUser");
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUser() {
        List<User> listUser = this.userService.handleGetAllUsers();
        return ResponseEntity.status(HttpStatus.OK).body(listUser);
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable("id") long id) {

        return ResponseEntity.status(HttpStatus.OK).body(this.userService.handleGetUserById(id));
    }

    @PutMapping("/users")
    public ResponseEntity<User> updateUser(@RequestBody User user) {
        User updateUser = this.userService.handleUpdateUser(user);
        return ResponseEntity.ok(updateUser);
    }

}
