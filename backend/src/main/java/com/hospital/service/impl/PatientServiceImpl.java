package com.hospital.service.impl;

import com.hospital.entity.Patient;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.repository.PatientRepository;
import com.hospital.service.PatientService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PatientServiceImpl implements PatientService {

    private final PatientRepository patientRepository;

    public PatientServiceImpl(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    @Override
    public Patient createPatient(Patient patient) {
        return patientRepository.save(patient);
    }

    @Override
    public Patient getPatientById(Long id) {
        return patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + id));
    }

    @Override
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    @Override
    public Patient updatePatient(Long id, Patient patientDetails) {
        Patient existingPatient = getPatientById(id);
        existingPatient.setFirstName(patientDetails.getFirstName());
        existingPatient.setLastName(patientDetails.getLastName());
        existingPatient.setDateOfBirth(patientDetails.getDateOfBirth());
        existingPatient.setGender(patientDetails.getGender());
        existingPatient.setPhone(patientDetails.getPhone());
        existingPatient.setEmail(patientDetails.getEmail());
        existingPatient.setAddress(patientDetails.getAddress());
        existingPatient.setBloodGroup(patientDetails.getBloodGroup());
        return patientRepository.save(existingPatient);
    }

    @Override
    public void deletePatient(Long id) {
        Patient existingPatient = getPatientById(id);
        patientRepository.delete(existingPatient);
    }
}
