package com.hospital.service;

import com.hospital.entity.Patient;
import java.util.List;

public interface PatientService {
    Patient createPatient(Patient patient);
    Patient getPatientById(Long id);
    List<Patient> getAllPatients();
    Patient updatePatient(Long id, Patient patientDetails);
    void deletePatient(Long id);
}
