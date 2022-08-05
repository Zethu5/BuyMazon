import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Branch } from 'src/app/models/branch';
import { api_base } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class BranchService {
  constructor(private http: HttpClient) {}

  getBranchs() {
    const url = `${api_base}/branches`
    return this.http.get(url)
  }

  createBranch(branch: Branch) {
    const url = `${api_base}/branches`
    this.http.post(url, branch).subscribe()
  }

  getBranch(id: string) {
    const url = `${api_base}/branches/${id}`
    return this.http.get(url)
  }

  deleteBranch(id: string) {
    const url = `${api_base}/branches/${id}`
    this.http.delete(url).subscribe()
  }

  updateBranchs(id: string, branch: Branch) {
    const url = `${api_base}/branches/${id}`
    this.http.put(url, branch).subscribe()
  }
}
