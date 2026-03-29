package com.hospital.service.impl;

import com.hospital.entity.Doctor;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.repository.DoctorRepository;
import com.hospital.service.DoctorService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DoctorServiceImpl implements DoctorService {

    private final DoctorRepository doctorRepository;

    public DoctorServiceImpl(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    @Override
    public Doctor createDoctor(Doctor doctor) {
        return doctorRepository.save(doctor);
    }

    @Override
    public Doctor getDoctorById(Long id) {
        return doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + id));
    }

    @Override
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    @Override
    public Doctor updateDoctor(Long id, Doctor doctorDetails) {
        Doctor existingDoctor = getDoctorById(id);
        existingDoctor.setFirstName(doctorDetails.getFirstName());
        existingDoctor.setLastName(doctorDetails.getLastName());
        existingDoctor.setSpecialization(doctorDetails.getSpecialization());
        existingDoctor.setPhone(doctorDetails.getPhone());
        existingDoctor.setEmail(doctorDetails.getEmail());
        existingDoctor.setDepartment(doctorDetails.getDepartment());
        existingDoctor.setExperience(doctorDetails.getExperience());
        existingDoctor.setAvailableDays(doctorDetails.getAvailableDays());
        return doctorRepository.save(existingDoctor);
    }

    @Override
    public void deleteDoctor(Long id) {
        Doctor existingDoctor = getDoctorById(id);
        doctorRepository.delete(existingDoctor);
    }
}
