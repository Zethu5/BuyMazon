import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Branch } from 'src/app/models/branch';

@Injectable({
  providedIn: 'root'
})
export class BranchService {
  private apiBase: String
  private port: Number

  constructor(private http: HttpClient) { 
    this.port = 3000
    this.apiBase = `http://localhost:${this.port}/api`
  }

  getBranchs() {
    const url = `${this.apiBase}/branches`
    return this.http.get(url)
  }

  createBranchs(branch: Branch) {
    const url = `${this.apiBase}/branches`
    this.http.post(url, branch).subscribe()
  }

  getBranch(id: string) {
    const url = `${this.apiBase}/branches/${id}`
    return this.http.get(url)
  }

  deleteBranchs(id: string) {
    const url = `${this.apiBase}/branches/${id}`
    this.http.delete(url).subscribe()
  }

  updateBranchs(id: string, branch: Branch) {
    const url = `${this.apiBase}/branches/${id}`
    this.http.put(url, branch).subscribe()
  }
}
