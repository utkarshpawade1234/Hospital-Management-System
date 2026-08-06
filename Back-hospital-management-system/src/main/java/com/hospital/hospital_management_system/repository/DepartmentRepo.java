package com.hospital.hospital_management_system.repository;

import com.hospital.hospital_management_system.model.Department;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DepartmentRepo extends JpaRepository<Department,Long> {

    Optional<Department> findBydepartmentNameIgnoreCase(String departmentName);
}
