package com.hospital.controller;

import com.hospital.dto.ApiResponse;
import com.hospital.entity.Bill;
import com.hospital.service.BillService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bills")
public class BillController {

    private final BillService billService;

    public BillController(BillService billService) {
        this.billService = billService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Bill>> createBill(@RequestBody Bill bill) {
        return new ResponseEntity<>(new ApiResponse<>(true, "Bill created successfully", billService.createBill(bill)), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Bill>>> getAllBills() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Bills fetched successfully", billService.getAllBills()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Bill>> getBillById(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Bill fetched successfully", billService.getBillById(id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Bill>> updateBill(@PathVariable Long id, @RequestBody Bill billDetails) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Bill updated successfully", billService.updateBill(id, billDetails)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteBill(@PathVariable Long id) {
        billService.deleteBill(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Bill deleted successfully", null));
    }
}
