package com.hospital.hospital_management_system.RestController;

import com.hospital.hospital_management_system.Exceptions.FileUploadException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/upload")
public class FileUploadController {

    @PostMapping("/image")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'PATIENT')")
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("file") MultipartFile file) {

        if (file.isEmpty()) {
            throw new FileUploadException("Please select an image.");
        }

        String contentType = file.getContentType();

        if (contentType == null || !contentType.startsWith("image/")) {
            throw new FileUploadException("Only image files are allowed.");
        }

        if (file.getSize() > 5 * 1024 * 1024) {
            throw new FileUploadException("Maximum file size is 5 MB.");
        }

        try {
            String uploadDir = "uploads/photos/";
            File directory = new File(uploadDir);

            if (!directory.exists()) {
                directory.mkdirs();
            }

            String originalFilename = file.getOriginalFilename();
            String extension = "";

            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }

            String uniqueFilename = UUID.randomUUID() + extension;

            Path path = Paths.get(uploadDir + uniqueFilename);

            Files.write(path, file.getBytes());

            String fileUrl = "http://localhost:8080/uploads/photos/" + uniqueFilename;

            Map<String, String> response = new HashMap<>();
            response.put("url", fileUrl);

            return ResponseEntity.ok(response);

        } catch (IOException e) {
            throw new FileUploadException("Failed to upload image.");
        }
    }
}
