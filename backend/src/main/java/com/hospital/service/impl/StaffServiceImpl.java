package com.hospital.service.impl;

import com.hospital.entity.Staff;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.repository.StaffRepository;
import com.hospital.service.StaffService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StaffServiceImpl implements StaffService {

    private final StaffRepository staffRepository;

    public StaffServiceImpl(StaffRepository staffRepository) {
        this.staffRepository = staffRepository;
    }

    @Override
    public Staff createStaff(Staff staff) {
        return staffRepository.save(staff);
    }

    @Override
    public Staff getStaffById(Long id) {
        return staffRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Staff not found with id: " + id));
    }

    @Override
    public List<Staff> getAllStaff() {
        return staffRepository.findAll();
    }

    @Override
    public Staff updateStaff(Long id, Staff staffDetails) {
        Staff existingStaff = getStaffById(id);
        existingStaff.setFirstName(staffDetails.getFirstName());
        existingStaff.setLastName(staffDetails.getLastName());
        existingStaff.setRole(staffDetails.getRole());
        existingStaff.setDepartment(staffDetails.getDepartment());
        existingStaff.setPhone(staffDetails.getPhone());
        existingStaff.setEmail(staffDetails.getEmail());
        existingStaff.setSalary(staffDetails.getSalary());
        existingStaff.setJoiningDate(staffDetails.getJoiningDate());
        return staffRepository.save(existingStaff);
    }

    @Override
    public void deleteStaff(Long id) {
        Staff existingStaff = getStaffById(id);
        staffRepository.delete(existingStaff);
    }
}
