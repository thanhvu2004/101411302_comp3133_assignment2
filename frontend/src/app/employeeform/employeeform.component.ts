import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employeeform',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './employeeform.component.html',
  styleUrls: ['./employeeform.component.css'],
})
export class EmployeeFormComponent implements OnInit {
  employeeForm: FormGroup;
  isEditMode: boolean = false;
  employeeId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.employeeForm = this.fb.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', [Validators.required]],
      designation: ['', [Validators.required]],
      department: ['', [Validators.required]],
      salary: ['', [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit() {
    this.employeeId = this.route.snapshot.paramMap.get('id');
    if (this.employeeId) {
      this.isEditMode = true;
      this.loadEmployeeData(this.employeeId);
    }
  }

  loadEmployeeData(employeeId: string) {
    this.http
      .post('http://localhost:5000/graphql', {
        query: `
          query {
            searchEmployeeById(eid: "${employeeId}") {
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
      .subscribe((response: any) => {
        const employee = response.data.searchEmployeeById;
        this.employeeForm.patchValue(employee);
      });
  }

  onSubmit() {
    if (this.employeeForm.valid) {
      const mutation = this.isEditMode
        ? `
          mutation {
            updateEmployeeById(
              eid: "${this.employeeId}",
              first_name: "${this.employeeForm.value.first_name}",
              last_name: "${this.employeeForm.value.last_name}",
              email: "${this.employeeForm.value.email}",
              gender: "${this.employeeForm.value.gender}",
              designation: "${this.employeeForm.value.designation}",
              department: "${this.employeeForm.value.department}",
              salary: ${this.employeeForm.value.salary},
              date_of_joining: "2023-10-01",
              employee_photo: "path/to/photo.jpg"
            ) {
              id
            }
          }
        `
        : `
          mutation {
            addEmployee(
              first_name: "${this.employeeForm.value.first_name}",
              last_name: "${this.employeeForm.value.last_name}",
              email: "${this.employeeForm.value.email}",
              gender: "${this.employeeForm.value.gender}",
              designation: "${this.employeeForm.value.designation}",
              department: "${this.employeeForm.value.department}",
              salary: ${this.employeeForm.value.salary},
              date_of_joining: "2023-10-01",
              employee_photo: "path/to/photo.jpg"
            ) {
              id
            }
          }
        `;
  
      this.http
        .post('http://localhost:5000/graphql', { query: mutation })
        .subscribe(
          () => {
            this.router.navigate(['/dashboard']);
          },
          (error) => {
            console.error('Error:', error);
          }
        );
    }
  }
}