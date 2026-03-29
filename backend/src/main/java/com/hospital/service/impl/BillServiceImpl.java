package com.hospital.service.impl;

import com.hospital.entity.Bill;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.repository.BillRepository;
import com.hospital.service.BillService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BillServiceImpl implements BillService {

    private final BillRepository billRepository;

    public BillServiceImpl(BillRepository billRepository) {
        this.billRepository = billRepository;
    }

    @Override
    public Bill createBill(Bill bill) {
        return billRepository.save(bill);
    }

    @Override
    public Bill getBillById(Long id) {
        return billRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bill not found with id: " + id));
    }

    @Override
    public List<Bill> getAllBills() {
        return billRepository.findAll();
    }

    @Override
    public Bill updateBill(Long id, Bill billDetails) {
        Bill existingBill = getBillById(id);
        existingBill.setPatient(billDetails.getPatient());
        existingBill.setAppointment(billDetails.getAppointment());
        existingBill.setAmount(billDetails.getAmount());
        existingBill.setPaidAmount(billDetails.getPaidAmount());
        existingBill.setPaymentStatus(billDetails.getPaymentStatus());
        existingBill.setPaymentDate(billDetails.getPaymentDate());
        existingBill.setDescription(billDetails.getDescription());
        return billRepository.save(existingBill);
    }

    @Override
    public void deleteBill(Long id) {
        Bill existingBill = getBillById(id);
        billRepository.delete(existingBill);
    }
}
