package com.hospital.service;

import com.hospital.entity.Bill;
import java.util.List;

public interface BillService {
    Bill createBill(Bill bill);
    Bill getBillById(Long id);
    List<Bill> getAllBills();
    Bill updateBill(Long id, Bill billDetails);
    void deleteBill(Long id);
}
