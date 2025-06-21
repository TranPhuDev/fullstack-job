package vn.tranphudev.jobhunter.controller;

import java.io.IOException;
import java.net.URISyntaxException;
import java.time.Instant;
import java.util.Arrays;
import java.util.List;

import org.apache.tomcat.util.http.fileupload.FileUploadException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import vn.tranphudev.jobhunter.domain.response.ResUploadFileDTO;
import vn.tranphudev.jobhunter.service.FileService;
import vn.tranphudev.jobhunter.util.annotaion.ApiMessage;
import vn.tranphudev.jobhunter.util.error.StorageException;

@RestController
@RequestMapping("/api/v1")
public class FileController {

    @Value("${service.upload-file.base-uri}")
    private String baseURI;

    private final FileService fileService;

    public FileController(FileService fileService) {
        this.fileService = fileService;
    }

    @PostMapping("/files")
    @ApiMessage("Upload Single File")
    public ResponseEntity<ResUploadFileDTO> upLoad(@RequestParam(name = "file", required = false) MultipartFile file,
            @RequestParam("folder") String folder) throws URISyntaxException, IOException, StorageException {

        // valid
        if (file == null || file.isEmpty()) {
            throw new StorageException("File is empty. Please upload file!");
        }
        String fileName = file.getOriginalFilename();
        List<String> allowedExtensions = Arrays.asList("pdf", "jpg", "jpeg", "png", "doc", "docx");
        boolean isValid = allowedExtensions.stream().anyMatch(item -> fileName.toLowerCase().endsWith(item));

        if (isValid == false) {
            throw new StorageException("Invalid file, only allows " + allowedExtensions.toString());

        }

        // create dir if not exits
        this.fileService.createDirectory(baseURI + folder);
        // store file
        String uploadFile = this.fileService.store(file, folder);

        ResUploadFileDTO res = new ResUploadFileDTO(uploadFile, Instant.now());

        return ResponseEntity.ok().body(res);
    }
}
