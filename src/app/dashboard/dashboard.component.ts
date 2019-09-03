import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import * as d3 from 'd3';
import { timer } from 'd3';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  constructor() {}
  randomArray = (length, max) =>
    [...new Array(length)].map(() => Math.round(Math.random() * max))
  myData: Array[] = this.randomArray(100, 1000);
  ngOnInit() {
    let i = 0,howManyTimes = 100;
    let parent = this;
    let f = () => {
      parent.createChart('chart', parent.myData, i);
      i++;
      if (i < howManyTimes) {
        setTimeout(f, 500);
      }
    };
    f();
  }
  createChart(id, data, index = -1) {
    const margin = { top: 20, right: 10, bottom: 20, left: 10 };
    const height = 500 - margin.top - margin.bottom;
    const width = 1250 - margin.left - margin.right;
    const yscale = d3
      .scaleLinear()
      .domain([0, d3.max(data)])
      .range([0, height]);
    const xscale = d3
      .scaleBand()
      .domain(d3.range(data.length).map(d => d + ''))
      .rangeRound([0, width])
      .paddingInner(0.05);
    console.log(xscale(600 + ''));
    console.log(data);
    d3.select('#' + id)
      .selectAll('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
      .style('background', '#f4f4f4')
      .selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .style('fill', (d, i) => {
        if (i === index) {
          return 'red';
        }
        return 'rgb(33, 150, 243)';
      })
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
