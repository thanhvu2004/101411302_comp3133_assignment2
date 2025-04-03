import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EmployeeService } from '../services/employee.service';

@Component({
  selector: 'app-employeedetails',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './employeedetails.component.html',
  styleUrls: ['./employeedetails.component.css'],
})
export class EmployeedetailsComponent implements OnInit {
  employee: any = null;
  errorMessage: string = '';

  constructor(
    private readonly employeeService: EmployeeService,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit() {
    const employeeId = this.route.snapshot.paramMap.get('id');
    if (employeeId) {
      this.fetchEmployeeDetails(employeeId);
    }
  }

  fetchEmployeeDetails(employeeId: string) {
    this.employeeService.searchEmployeeById(employeeId).subscribe(
      (response: any) => {
        this.employee = response.data.searchEmployeeById;

        // Prepend the base URL to the employee_photo if it's a relative path
        if (this.employee && this.employee.employee_photo) {
          this.employee.employee_photo = `http://localhost:5000${this.employee.employee_photo}`;
        }
      },
      (error) => {
        this.errorMessage = 'Failed to fetch employee details. Please try again later.';
        console.error('Error fetching employee details:', error);
      }
    );
  }
}