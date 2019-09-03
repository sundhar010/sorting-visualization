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
  wait = ms => new Promise((r, j)=>setTimeout(r, ms))
  numberOfElements:Number = 30;
  myData: Number[] ;
  sliderDisabled: boolean = false;
  sliderInvert:boolean = false;
  sliderMax:number = 100;
  sliderMin:number = 30;
  sliderStep:number = 1;
  autoTicks = false;
  showTicks = false;
  thumbLabel = true;
  sliderVertical = false;
  allAlgos = ['Selection Sort'];
  selectedAlgo;
  ngOnInit() {
    this.myData = this.randomArray(this.numberOfElements, 1000);
    this.createChart('chart',this.myData);
  }
  changeArray() {
    this.myData = this.randomArray(this.numberOfElements, 1000);
    this.createChart('chart',this.myData);
    // console.log('change');
  }
  submit() {
    switch (this.selectedAlgo) {
      case 'Selection Sort':
        this.selectionSort();
        break;
    }
  }
  async selectionSort(){
    // let wait = ms => new Promise((r, j)=>setTimeout(r, ms))
    for(let i = 0; i < this.myData.length; i++) {
      let minIndex = i;
      let min = this.myData[i];
      for(let j = i; j < this.myData.length; j++) {
        if(this.myData[j] <= min) {
          min = this.myData[j];
          minIndex = j;
        }
        this.createChart('chart', this.myData, i, j);
        await this.wait(100);
      }
      this.createChart('chart', this.myData, i, minIndex);
      await this.wait(500);
      this.myData[minIndex] = this.myData[i];
      this.myData[i] = min;
      this.createChart('chart', this.myData, i, minIndex);
      await this.wait(200);


    }
  }
  createChart(id, data, indexI = -1, indexJ = -1) {
    const margin = { top: 20, right: 10, bottom: 20, left: 10 };
    const height = 500 - margin.top - margin.bottom;
    const width = 1250 - margin.left - margin.right;
    const yscale = d3
      .scaleLinear()
      .domain([0, +d3.max(data)])
      .range([0, height]);
    const xscale = d3
      .scaleBand()
      .domain(d3.range(data.length).map(d => d + ''))
      .rangeRound([0, width])
      .paddingInner(0.1);
    d3.select('#' + id).selectAll('*').remove();
    d3.select('#' + id)
      .append('svg')
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
        if (i === indexI) {
          return 'red';
        }
        else if( i=== indexJ) {
          return 'lightgreen';
        }
        return 'rgb(33, 150, 243)';
      })
      .attr('width', xscale.bandwidth())
      .attr('height', function(d) {
        return yscale(+d);
      })
      .attr('x', function(d, i) {
        return xscale(i + '');
      })
      .attr('y', function(d) {
        return height - yscale(+d);
      });
  }
}
