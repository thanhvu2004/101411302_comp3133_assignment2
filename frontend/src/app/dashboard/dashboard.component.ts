import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  constructor(private readonly http: HttpClient) {}

  ngOnInit() {
    this.fetchEmployees();
  }

  fetchEmployees() {
    this.http
      .post('http://localhost:5000/graphql', {
        query: `
          query {
            getAllEmployees {
              id
              first_name
              last_name
              email
              gender
              designation
              department
              salary
            }
          }
        `,
      })
      .subscribe(
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
      this.http
        .post('http://localhost:5000/graphql', {
          query: `
            mutation {
              deleteEmployeeById(eid: "${employeeId}")
            }
          `,
        })
        .subscribe(
          () => {
            this.employees = this.employees.filter((employee) => employee.id !== employeeId);
            this.filterEmployees();
          },
          (error) => {
            this.errorMessage = 'Failed to delete employee. Please try again later.';
          }
        );
    }
  }
}