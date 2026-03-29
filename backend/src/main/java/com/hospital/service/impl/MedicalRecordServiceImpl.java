package com.hospital.service.impl;

import com.hospital.entity.MedicalRecord;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.repository.MedicalRecordRepository;
import com.hospital.service.MedicalRecordService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MedicalRecordServiceImpl implements MedicalRecordService {

    private final MedicalRecordRepository medicalRecordRepository;

    public MedicalRecordServiceImpl(MedicalRecordRepository medicalRecordRepository) {
        this.medicalRecordRepository = medicalRecordRepository;
    }

    @Override
    public MedicalRecord createMedicalRecord(MedicalRecord record) {
        return medicalRecordRepository.save(record);
    }

    @Override
    public MedicalRecord getMedicalRecordById(Long id) {
        return medicalRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Record not found with id: " + id));
    }

    @Override
    public List<MedicalRecord> getAllMedicalRecords() {
        return medicalRecordRepository.findAll();
    }

    @Override
    public MedicalRecord updateMedicalRecord(Long id, MedicalRecord recordDetails) {
        MedicalRecord existingRecord = getMedicalRecordById(id);
        existingRecord.setPatient(recordDetails.getPatient());
        existingRecord.setDoctor(recordDetails.getDoctor());
        existingRecord.setDiagnosis(recordDetails.getDiagnosis());
        existingRecord.setPrescription(recordDetails.getPrescription());
        existingRecord.setNotes(recordDetails.getNotes());
        existingRecord.setVisitDate(recordDetails.getVisitDate());
        return medicalRecordRepository.save(existingRecord);
    }

    @Override
    public void deleteMedicalRecord(Long id) {
        MedicalRecord existingRecord = getMedicalRecordById(id);
        medicalRecordRepository.delete(existingRecord);
    }

    @Override
    public List<MedicalRecord> getRecordsByPatientId(Long patientId) {
        return medicalRecordRepository.findByPatientId(patientId);
    }
}
