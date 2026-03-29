package com.hospital.service;

import com.hospital.entity.Staff;
import java.util.List;

public interface StaffService {
    Staff createStaff(Staff staff);
    Staff getStaffById(Long id);
    List<Staff> getAllStaff();
    Staff updateStaff(Long id, Staff staffDetails);
    void deleteStaff(Long id);
}
