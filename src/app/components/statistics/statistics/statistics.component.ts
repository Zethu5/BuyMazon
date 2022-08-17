import { Component, OnInit } from '@angular/core';
import { CMSService } from 'src/app/services/cms/cms.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {

  socket!: any
  bounds: number[][] = [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0]
  ]
  cms!: any

  constructor(private cmsService: CMSService) {}

  ngOnInit(): void {
    this.updateUpperBound()
    this.getAllProductsUpperBound()
  }

  updateUpperBound() {
    this.cmsService.updateUpperBound()
  }

  // Use this to get a upper bound for every product json
  getAllProductsUpperBound() {
    this.cmsService.getAllProductsUpperBound().subscribe((data: any) => {
      console.log(data)
    })
  }
}
