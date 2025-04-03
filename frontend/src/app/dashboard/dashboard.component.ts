import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../services/employee.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  employees: any[] = [];
  filteredEmployees: any[] = [];
  searchQuery: string = '';
  errorMessage: string = '';

  constructor(private readonly employeeService: EmployeeService) {}

  ngOnInit() {
    this.fetchEmployees();
  }

  fetchEmployees() {
    this.employeeService.fetchEmployees().subscribe(
      (response: any) => {
        this.employees = response.data.getAllEmployees;
        this.filteredEmployees = this.employees;
      },
      (error) => {
        this.errorMessage = 'Failed to fetch employees. Please try again later.';
      }
    );
  }

  filterEmployees() {
    const query = this.searchQuery.toLowerCase();
    this.filteredEmployees = this.employees.filter(
      (employee) =>
        employee.department.toLowerCase().includes(query) ||
        employee.designation.toLowerCase().includes(query)
    );
  }

  deleteEmployee(employeeId: string) {
    const confirmDelete = window.confirm('Are you sure you want to delete this employee?');
    if (confirmDelete) {
      this.employeeService.deleteEmployee(employeeId).subscribe(
        (response: any) => {
          if (response.data && response.data.deleteEmployeeById) {
            this.employees = this.employees.filter((employee) => employee.id !== employeeId);
            this.filterEmployees();
          } else {
            this.errorMessage = 'Failed to delete employee. Please try again later.';
          }
        },
        (error) => {
          this.errorMessage = 'Failed to delete employee. Please try again later.';
        }
      );
    }
  }
}