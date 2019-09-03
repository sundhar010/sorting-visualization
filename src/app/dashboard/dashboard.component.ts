import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import * as d3 from 'd3';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  /** Based on the screen size, switch from standard to one column per row */
  randomArray = (length, max) => [...new Array(length)]
    .map(() => Math.round(Math.random() * max));
  constructor() {}
  ngOnInit() {
    let height = 500;
    let width = 1200;
    let data = this.randomArray(30,1000);
    let yscale = d3.scaleLinear().domain([0,d3.max(data)]).range([0,height]);
    let xscale =  d3.scaleBand().domain(d3.range(data.length).map((d) => d+'')).rangeRound([0, width]).paddingInner(0.05);
    console.log(xscale(600+''));
    console.log(data);
    d3.select('#chart')
    .append('svg')
    .attr("width", width)
    .attr("height", height)
    .style("background", '#f4f4f4')
    .selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .style('fill', 'lightgreen')
    .attr('width', xscale.bandwidth())
    .attr('height', function(d) {
      return yscale(d);
    })
    .attr('x', function(d, i) {
      return xscale(i + '');
    })
    .attr('y', function(d) {
      return height - yscale(d);
    });

  }
}
