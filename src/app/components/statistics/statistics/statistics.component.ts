import { Component, OnInit } from '@angular/core';
import { CMSService } from 'src/app/services/cms/cms.service';
import { ProductService } from 'src/app/services/product/product.service';
import { socket_connection } from 'src/environments/environment';
import * as io from 'socket.io-client'
import * as d3 from 'd3';
import * as d3Axis from 'd3-axis';
import { OrderService } from 'src/app/services/order/order.service';
import { Order } from 'src/app/models/order';
import { map } from 'rxjs';
import { UserService } from 'src/app/services/user/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {

  products!: any
  socket!: any
  scatterPlotConfig: any = {}
  svg!: any

  displayedColumns = [
    'name',
    'picture',
    'price',
    'manufacturer',
    'productionCountry',
    'code',
    'cmsResult'
  ]

  constructor(
    private cmsService: CMSService,
    private productService: ProductService,
    private userService: UserService,
    private orderService: OrderService,
    private router: Router) {}

  ngOnInit(): void {
    if (!this.userService.isAdmin()) this.router.navigate(['/'])

    this.getProducts()
    this.updateUpperBound()
    this.updateProducts()
  }

  updateUpperBound() {
    this.cmsService.updateUpperBound()
  }

  getProducts() {
    this.productService.getProducts().subscribe((data) => {
      this.products = data
      this.organizeScatterPlotData().subscribe((plotData) => {
        this.scatterPlotConfig.data = plotData
        this.initScatterGraph()
      })
    })
  }

  updateProducts() {
    this.socket = io.io(socket_connection)
    this.socket.on('newOrder', () => {
      this.productService.getProducts().subscribe((data) => {
        this.products = data
        this.organizeScatterPlotData().subscribe((plotData) => {
          this.scatterPlotConfig.data = plotData
          this.initScatterGraph()
        })
      })
    })
  }

  organizeScatterPlotData() {
    return this.orderService.getOrders().pipe(map((data: any) => {
      let tmpArr: any = []
      let dataArr: any = []

      data.forEach((order: Order) => {
        order.products.forEach((product: any) => {
          if(!tmpArr.includes(product._id)) {
            dataArr.push({
              product: product,
              numTimesBought: product.amount,
              numOrdersProductWasIn: 1
            })
            tmpArr.push(product._id)
          } else {
            for(let i = 0; i < dataArr.length; i++) {
              if(dataArr[i].product._id == product._id) {
                dataArr[i].numTimesBought += product.amount
                dataArr[i].numOrdersProductWasIn++
                break
              }
            }
          }
        })
      })

      return dataArr
    }))
  }

  initScatterGraph() {
    let height = 500
    let width = 600
    let spacing = 120

    const svg = d3
    .select('#scatterPlot')
    .append('svg')
    .attr('height', height)
    .attr('width', width)
    .append('g')
    .attr('transform', 'translate(' + spacing/2 + ',' + spacing/2 + ')')

    const xScale = 
    d3
    .scaleLinear()
    .domain([
      0,
      this.getMaxNumOrdersProductWasIn(this.scatterPlotConfig.data)
    ])
    .range([0, width-spacing])

    const yScale =
    d3
    .scaleLinear()
    .domain([
      0,
      this.getMaxNumTimesBought(this.scatterPlotConfig.data)
    ])
    .range([height-spacing, 0])

    const xAxis = d3Axis.axisBottom(xScale)
    const yAxis = d3Axis.axisLeft(yScale)

    svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width - 200)
    .attr("y", height - 80)
    .text("Number of times item was bought in general")

    svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("x", -50)
    .attr("y", -50)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("Number of times item was included in an order")

    svg
    .append('g')
    .attr('transform', 'translate(0,' + (height - spacing) + ')' )
    .call(xAxis)

    svg
    .append('g')
    .call(yAxis)

    var tooltip = d3.select("#scatterPlot")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("position", "absolute")


    const mouseover = function(event: any, d: any) {
      tooltip
        .style("opacity", 1)
    }
  
    const mousemove = function(event: any, d: any) {
      tooltip
        .html(
          `
          <div style="text-align: center">
          ${d.product.name}
          </div>
          <div style="text-align: center">
            <img src="${d.product.picture} width="100px" height="100px">
          </div>
          <div style="text-align: center">
            Number of orders this product was in: <b>${d.numOrdersProductWasIn}</b>
          </div>
          <div style="text-align: center">
            Number of times this product was bought: <b>${d.numTimesBought}</b>
          </div>
          `
        )
        .style("left", (event.pageX) + "px")
        .style("top", (event.pageY + 5) + "px")
    }
  
    const mouseleave = function(ent: any, d: any) {
      tooltip
        .transition()
        .style("opacity", 0)
    }

    svg.append('g')
    .selectAll("dot")
    .data(this.scatterPlotConfig.data)
    .enter()
    .append("circle")
    .attr('cx', (d: any) => { return xScale(d.numOrdersProductWasIn) })
    .attr('cy', (d: any) => { return yScale(d.numTimesBought) })
      .attr("r", 7)
      .style("fill", "#69b3a2")
      .style("opacity", 0.7)
      .style("stroke", "white")
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)

  }

  getMaxNumOrdersProductWasIn(array: any) {
    let max = 0

    for(let i = 0; i < array.length; i++) {
      if(array[i].numOrdersProductWasIn > max) max = array[i].numOrdersProductWasIn
    }

    return max
  }

  getMaxNumTimesBought(array: any) {
    let max = 0

    for(let i = 0; i < array.length; i++) {
      if(array[i].numTimesBought > max) max = array[i].numTimesBought
    }

    return max
  }
}
