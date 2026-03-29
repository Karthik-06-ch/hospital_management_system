package com.hospital.service;

import com.hospital.entity.MedicalRecord;
import java.util.List;

public interface MedicalRecordService {
    MedicalRecord createMedicalRecord(MedicalRecord record);
    MedicalRecord getMedicalRecordById(Long id);
    List<MedicalRecord> getAllMedicalRecords();
    MedicalRecord updateMedicalRecord(Long id, MedicalRecord recordDetails);
    void deleteMedicalRecord(Long id);
    List<MedicalRecord> getRecordsByPatientId(Long patientId);
}
