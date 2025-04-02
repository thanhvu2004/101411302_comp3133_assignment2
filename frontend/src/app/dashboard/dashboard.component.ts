import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  employees: any[] = [];
  errorMessage: string = '';

  constructor(private http: HttpClient) {}

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
              salary
              department
            }
          }
        `,
      })
      .subscribe(
        (response: any) => {
          this.employees = response.data.getAllEmployees;
        },
        (error) => {
          this.errorMessage = 'Failed to fetch employees. Please try again later.';
        }
      );
  }

  deleteEmployee(employeeId: string) {
    const confirmDelete = window.confirm('Are you sure you want to delete this employee?');
    if (confirmDelete) {
      this.http
        .post('http://localhost:5000/graphql', {
          query: `
            mutation {
              deleteEmployeeById(eid: "${employeeId}") { 
                id 
                first_name 
                last_name 
                email 
                gender 
                designation 
                salary 
                date_of_joining 
                department 
                employee_photo 
                created_at 
                updated_at 
              }
            }
          `,
        })
        .subscribe(
          (response: any) => {
            this.employees = this.employees.filter((employee) => employee.id !== employeeId);
          },
          (error) => {
            this.errorMessage = 'Failed to delete employee. Please try again later.';
          }
        );
    }
  }
}