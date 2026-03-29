package com.hospital.controller;

import com.hospital.dto.ApiResponse;
import com.hospital.entity.MedicalRecord;
import com.hospital.service.MedicalRecordService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medical-records")
public class MedicalRecordController {

    private final MedicalRecordService service;

    public MedicalRecordController(MedicalRecordService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<MedicalRecord>> createRecord(@RequestBody MedicalRecord record) {
        MedicalRecord savedRecord = service.createMedicalRecord(record);
        return new ResponseEntity<>(new ApiResponse<>(true, "Record created successfully", savedRecord), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<MedicalRecord>>> getAllRecords() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Records fetched successfully", service.getAllMedicalRecords()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MedicalRecord>> getRecordById(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Record fetched successfully", service.getMedicalRecordById(id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<MedicalRecord>> updateRecord(@PathVariable Long id, @RequestBody MedicalRecord recordDetails) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Record updated successfully", service.updateMedicalRecord(id, recordDetails)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteRecord(@PathVariable Long id) {
        service.deleteMedicalRecord(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Record deleted successfully", null));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<ApiResponse<List<MedicalRecord>>> getRecordsByPatientId(@PathVariable Long patientId) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Records fetched successfully", service.getRecordsByPatientId(patientId)));
    }
}
