package com.hospital.controller;

import com.hospital.dto.ApiResponse;
import com.hospital.entity.Staff;
import com.hospital.service.StaffService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/staff")
public class StaffController {

    private final StaffService staffService;

    public StaffController(StaffService staffService) {
        this.staffService = staffService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Staff>> createStaff(@RequestBody Staff staff) {
        return new ResponseEntity<>(new ApiResponse<>(true, "Staff created successfully", staffService.createStaff(staff)), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Staff>>> getAllStaff() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Staff fetched successfully", staffService.getAllStaff()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Staff>> getStaffById(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Staff fetched successfully", staffService.getStaffById(id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Staff>> updateStaff(@PathVariable Long id, @RequestBody Staff staffDetails) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Staff updated successfully", staffService.updateStaff(id, staffDetails)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteStaff(@PathVariable Long id) {
        staffService.deleteStaff(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Staff deleted successfully", null));
    }
}
