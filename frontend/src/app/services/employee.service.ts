import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private readonly apiUrl = 'http://localhost:5000/graphql';

  constructor(private readonly http: HttpClient) {}

  fetchEmployees(): Observable<any> {
    const query = `
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
    `;
    return this.http.post(this.apiUrl, { query });
  }

  deleteEmployee(employeeId: string): Observable<any> {
    const mutation = `
      mutation {
        deleteEmployeeById(eid: "${employeeId}") {
          id
        }
      }
    `;
    return this.http.post(this.apiUrl, { query: mutation });
  }

  searchEmployeeById(employeeId: string): Observable<any> {
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
    return this.http.post(this.apiUrl, { query });
  }

  addEmployee(employeeData: any): Observable<any> {
    const mutation = `
      mutation {
        addEmployee(
          first_name: "${employeeData.first_name}",
          last_name: "${employeeData.last_name}",
          email: "${employeeData.email}",
          gender: "${employeeData.gender}",
          designation: "${employeeData.designation}",
          department: "${employeeData.department}",
          salary: ${employeeData.salary},
          date_of_joining: "${employeeData.date_of_joining}",
          employee_photo: "${employeeData.employee_photo}"
        ) {
          id
        }
      }
    `;
    return this.http.post(this.apiUrl, { query: mutation });
  }

  updateEmployeeById(employeeId: string, employeeData: any): Observable<any> {
    const mutation = `
      mutation {
        updateEmployeeById(
          eid: "${employeeId}",
          first_name: "${employeeData.first_name}",
          last_name: "${employeeData.last_name}",
          email: "${employeeData.email}",
          gender: "${employeeData.gender}",
          designation: "${employeeData.designation}",
          department: "${employeeData.department}",
          salary: ${employeeData.salary},
          date_of_joining: "${employeeData.date_of_joining}",
          employee_photo: "${employeeData.employee_photo}"
        ) {
          id
        }
      }
    `;
    return this.http.post(this.apiUrl, { query: mutation });
  }
}