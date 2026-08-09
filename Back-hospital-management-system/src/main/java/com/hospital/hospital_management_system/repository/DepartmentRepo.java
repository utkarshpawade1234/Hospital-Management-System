package com.hospital.hospital_management_system.repository;

import com.hospital.hospital_management_system.model.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface DepartmentRepo extends JpaRepository<Department, Long> {

    Optional<Department> findByDepartmentNameIgnoreCase(String departmentName);

    @Query("SELECT d.departmentName FROM Department d")
    List<String> findAllDepartmentNames();

}
