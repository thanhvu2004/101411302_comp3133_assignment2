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
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.employeeForm = this.fb.group({
      first_name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20), Validators.pattern('^[a-zA-Z ]*$')]],
      last_name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20), Validators.pattern('^[a-zA-Z ]*$')]],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', [Validators.required]],
      designation: ['', [Validators.required, Validators.minLength(2)]],
      department: ['', [Validators.required, Validators.minLength(2)]],
      salary: ['', [Validators.required, Validators.min(0)]],
      employee_photo: [null, [Validators.required]],
      date_of_joining: ['', [Validators.required]],
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
              date_of_joining
              employee_photo
            }
          }
        `,
      })
      .subscribe((response: any) => {
        const employee = response.data.searchEmployeeById;
        this.employeeForm.patchValue(employee);
        // If the photo exists, set it for display
        if (employee.employee_photo) {
          this.selectedFile = null; // Reset the selected file
        }
      });
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
  
      if (!allowedExtensions.exec(file.name)) {
        alert("Only image files (jpg, jpeg, png, gif) are allowed.");
        input.value = ""; // Clear the input
        this.selectedFile = null;
        return;
      }
  
      this.selectedFile = file;
      this.employeeForm.patchValue({ employee_photo: this.selectedFile.name });
    }
  }

  onSubmit() {
    if (this.employeeForm.valid) {
      const formData = new FormData();
      let filePath = this.employeeForm.value.employee_photo; // Default to the existing photo
  
      if (this.selectedFile) {
        formData.append("employee_photo", this.selectedFile);

        if (this.isEditMode && this.employeeId) {
          formData.append("employeeId", this.employeeId);
        }
  
        // Upload the file first
        this.http.post("http://localhost:5000/upload", formData).subscribe(
          (response: any) => {
            filePath = response.filePath; // Update the file path after upload
  
            this.submitGraphQLMutation(filePath);
          },
          (error) => {
            console.error("File upload error:", error);
          }
        );
      } else {
        // No new file selected, proceed with the existing photo
        this.submitGraphQLMutation(filePath);
      }
    } else {
      this.employeeForm.markAllAsTouched();
    }
  }
  
  submitGraphQLMutation(filePath: string) {  
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
            date_of_joining: "${this.employeeForm.value.date_of_joining}",
            employee_photo: "${filePath}",
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
            date_of_joining: "${this.employeeForm.value.date_of_joining}",
            employee_photo: "${filePath}",
          ) {
            id
          }
        }
      `;
  
    this.http.post("http://localhost:5000/graphql", { query: mutation }).subscribe(
      () => {
        this.router.navigate(["/dashboard"]);
      },
      (error) => {
        console.error("Error:", error);
      }
    );
  }
}