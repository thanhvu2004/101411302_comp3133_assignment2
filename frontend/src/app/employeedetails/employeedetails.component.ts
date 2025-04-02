import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-employeedetails',
  standalone: true,
  imports: [ CommonModule, RouterModule ],
  templateUrl: './employeedetails.component.html',
  styleUrls: ['./employeedetails.component.css']
})
export class EmployeedetailsComponent implements OnInit {
  employee: any = null;
  errorMessage: string = '';

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit() {
    const employeeId = this.route.snapshot.paramMap.get('id');
    if (employeeId) {
      this.fetchEmployeeDetails(employeeId);
    }
  }

  fetchEmployeeDetails(employeeId: string) {
    const query = `
      query {
        searchEmployeeById(eid: "${employeeId}") {
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
    `;

    this.http
      .post('http://localhost:5000/graphql', { query })
      .subscribe(
        (response: any) => {
          this.employee = response.data.searchEmployeeById;
        },
        (error) => {
          this.errorMessage = 'Failed to fetch employee details. Please try again later.';
          console.error('Error fetching employee details:', error);
        }
      );
  }
}