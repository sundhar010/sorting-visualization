import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  HostListener
} from '@angular/core';
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
  allAlgos = [
    'Selection Sort',
    'Bubble Sort',
    'Insertion Sort',
    'Merge Sort',
    'Quick Sort',
    'Radix Sort'
  ];
  selectedAlgo;
  chartWidth;
  chartHeight;
  sortDissable = false;
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
    if (this.sortDissable) {
      return;
    }
    this.myData = this.randomArray(this.numberOfElements, 1000);
    this.createChart('chart', this.myData);
    // console.log('change');
  }
  submit() {
    if (this.sortDissable) {
      return;
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
      case 'Merge Sort':
        this.sortDissable = true;
        this.mergeSorter();
        break;
      case 'Quick Sort':
        this.sortDissable = true;
        this.quickSorter();
        break;
      case 'Radix Sort':
        this.sortDissable = true;
        this.radixSort();
    }
  }
  async partition(a, low, high) {
    const pivot = a[high];
    this.createChart('chart', this.myData, high);
    await this.wait(this.pace);
    let k = low;
    for (let i = low; i < high; i++) {
      if (a[i] <= pivot) {
        const t = a[i];
        a[i] = a[k];
        a[k] = t;
        k++;
      }
      this.createChart('chart', this.myData, high, i);
      await this.wait(this.pace);
    }
    const t = a[k];
    a[k] = a[high];
    a[high] = t;
    this.createChart('chart', this.myData, k);
    await this.wait(this.pace);

    return k;
  }
  async quickSort(a, low, high) {
    if (low < high) {
      const pivotPosition = await this.partition(a, low, high);
      await this.quickSort(a, low, pivotPosition - 1);
      await this.quickSort(a, pivotPosition + 1, high);
    }
  }
  async quickSorter() {
    await this.quickSort(this.myData, 0, this.myData.length - 1);
    this.sortDissable = false;
    this.createChart('chart', this.myData);
  }
  async merge(a, start, mid, end) {
    const arr = [];
    let p = start,
      q = mid + 1,
      k = 0;
    for (let i = start; i <= end; i++) {
      if (p > mid) {
        arr[k++] = a[q++];
      } else if (q > end) {
        arr[k++] = a[p++];
      } else if (a[p] < a[q]) {
        arr[k++] = a[p++];
      } else {
        arr[k++] = a[q++];
      }
      this.createChart('chart', this.myData, p, q);
      await this.wait(this.pace);
    }
    for (let i = 0; i < k; i++) {
      this.createChart('chart', this.myData, -1, start);
      await this.wait(this.pace);
      a[start++] = arr[i];
    }
  }
  async mergeSort(a, l, h) {
    if (l < h) {
      const m = parseInt((l + h) / 2 + '');
      await this.mergeSort(a, l, m);
      await this.mergeSort(a, m + 1, h);
      await this.merge(a, l, m, h);
    }
  }

  async mergeSorter() {
    await this.mergeSort(this.myData, 0, this.myData.length - 1);
    this.sortDissable = false;
  }
  async insertionSort() {
    for (let i = 1; i < this.myData.length; i++) {
      let j = i - 1;
      const key = this.myData[i];
      const dummyData = Array.from(this.myData);
      this.createChart('chart', dummyData, i);
      await this.wait(this.pace);
      while (this.myData[j] > key) {
        if (j < 0) {
          break;
        }
        this.myData[j + 1] = this.myData[j];
        this.createChart('chart', dummyData, i, j);
        await this.wait(this.pace);
        j--;
      }
      this.myData[j + 1] = key;
      this.createChart('chart', this.myData, j + 1);
      await this.wait(this.pace);
    }
    this.sortDissable = false;
  }
  async countsort(a,exp){
    var digit ={1:[],2:[], 3:[], 4:[], 5:[], 6:[], 7:[], 8:[], 9:[], 0:[]};
    for(let i =0;i<a.length;i++ )
{
  digit[Math.floor(a[i]/exp)%10].push(a[i])
  this.createChart('chart', this.myData, i);
  await this.wait(this.pace);
}
let index = 0
const temp =Array.from(a)
  for  (let i=0;i<10;i++)
  {
    for (let j=0;j<digit[i].length;j++)
    {
      let prevIndex=temp.indexOf(digit[i][j])
      a[index]= digit[i][j]
      this.createChart('chart', this.myData,prevIndex,index);
      await this.wait(this.pace);
      index = index +1
    }

  }

  }
  async radixSort(){
 var max =Math.max.apply(Math,this.myData)
 var exp=1
while (Math.floor(max/exp)>0.0)
{
  await this.countsort(this.myData,exp)
  exp=exp*10
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
    for (let i = 0; i < this.myData.length; i++) {
      for (let j = 0; j < this.myData.length - i - 1; j++) {
        this.createChart('chart', this.myData, j, j + 1);
        await this.wait(this.pace);
        if (this.myData[j] > this.myData[j + 1]) {
          this.createChart('chart', this.myData, j, j + 1);
          await this.wait(this.pace * 2);
          const temp = this.myData[j];
          this.myData[j] = this.myData[j + 1];
          this.myData[j + 1] = temp;
          this.createChart('chart', this.myData, j, j + 1);
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
