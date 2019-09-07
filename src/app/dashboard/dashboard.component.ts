import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
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
  @ViewChild('container', { static: false }) container: ElementRef;
  numberOfElements: Number = 30;
  pace = 100;
  myData: Number[];
  sliderDisabled = false;
  sliderInvert = false;
  sliderMax = 100;
  sliderMin = 30;
  sliderStep = 1;
  autoTicks = false;
  showTicks = false;
  thumbLabel = true;
  sliderVertical = false;
  allAlgos = ['Selection Sort', 'Bubble Sort', 'Insertion Sort'];
  selectedAlgo;
  chartWidth;
  chartHeight;
  sortDissable=false;
  randomArray = (length, max) =>
    [...new Array(length)].map(() => Math.round(Math.random() * max))
  wait = ms => new Promise((r, j) => setTimeout(r, ms));
  ngOnInit() {}
  ngAfterViewInit() {
    console.log(this.container.nativeElement.offsetWidth);
    this.chartHeight = 500;
    this.chartWidth = this.container.nativeElement.offsetWidth;
    this.myData = this.randomArray(this.numberOfElements, 1000);
    this.createChart('chart', this.myData);
  }
  changeArray() {
    if(this.sortDissable){
      return
    }
    this.myData = this.randomArray(this.numberOfElements, 1000);
    this.createChart('chart', this.myData);
    // console.log('change');
  }
  submit() {
    if(this.sortDissable){
      return
    }
    switch (this.selectedAlgo) {
      case 'Selection Sort':
        this.sortDissable = true;
        this.selectionSort();
        break;
      case 'Bubble Sort':
        this.sortDissable = true;
        this.bubbleSort();
        break;
      case 'Insertion Sort':
        this.sortDissable = true;
        this.insertionSort();
        break;
    }

  }
  async insertionSort() {
    for(let i = 1; i < this.myData.length; i++) {
      let j = i - 1;
      let key = this.myData[i];
      let dummyData = Array.from(this.myData);
      this.createChart('chart',dummyData,i);
      await this.wait(this.pace);
      while(this.myData[j] > key) {
        if(j < 0) { break; }
        this.myData[j+1] = this.myData[j];
        this.createChart('chart',dummyData,i,j);
        await this.wait(this.pace);
        j--;
      }
      this.myData[j + 1] = key;
      this.createChart('chart', this.myData, j+1);
      await this.wait(this.pace);
    }
    this.sortDissable = false;

  }
  async selectionSort() {
    for (let i = 0; i < this.myData.length; i++) {
      let minIndex = i;
      let min = this.myData[i];
      for (let j = i; j < this.myData.length; j++) {
        if (this.myData[j] <= min) {
          min = this.myData[j];
          minIndex = j;
        }
        this.createChart('chart', this.myData, i, j);
        await this.wait(this.pace);
      }
      this.createChart('chart', this.myData, i, minIndex);
      await this.wait(this.pace * 2);
      this.myData[minIndex] = this.myData[i];
      this.myData[i] = min;
      this.createChart('chart', this.myData, i, minIndex);
      await this.wait(this.pace);
    }
    this.sortDissable = false;
  }
  async bubbleSort() {
    for(let i = 0; i < this.myData.length; i++){
      for(let j = 0; j < this.myData.length - i - 1 ; j++  ) {
        this.createChart('chart', this.myData, j, j+1);
        await this.wait(this.pace);
        if(this.myData[j] > this.myData[j + 1]) {
          this.createChart('chart', this.myData, j, j+1 );
          await this.wait(this.pace * 2);
          let temp = this.myData[j];
          this.myData[j] = this.myData[j + 1];
          this.myData[j + 1] = temp;
          this.createChart('chart', this.myData, j, j+1 );
          await this.wait(this.pace);
        }
      }
    }
    this.sortDissable = false;
  }
  createChart(id, data, indexI = -1, indexJ = -1) {
    const margin = { top: 20, right: 10, bottom: 20, left: 10 };
    const height = this.chartHeight - margin.top - margin.bottom;
    const width = this.chartWidth - margin.left - margin.right;
    const yscale = d3
      .scaleLinear()
      .domain([0, +d3.max(data)])
      .range([0, height]);
    const xscale = d3
      .scaleBand()
      .domain(d3.range(data.length).map(d => d + ''))
      .rangeRound([0, width])
      .paddingInner(0.1);
    d3.select('#' + id)
      .selectAll('*')
      .remove();
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
        } else if (i === indexJ) {
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
  @HostListener('window:resize')
  public detectResize(): void {
    this.chartWidth = this.container.nativeElement.offsetWidth;
    this.createChart('chart', this.myData);
  }

}
