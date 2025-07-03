import { Component, Input, OnChanges, ViewContainerRef } from '@angular/core';
// d3.js module import
import { select as d3Select } from 'd3-selection';
import { scaleLinear as d3ScaleLinear } from 'd3-scale';
import { extent as d3Extent } from 'd3-array';
import { line as d3Line } from 'd3-shape';

@Component({
  selector: 'app-sparkline-chart',
  templateUrl: './sparkline-chart.component.html',
  styleUrls: ['./sparkline-chart.component.scss'],
  standalone: true,
})
export class SparklineChartComponent implements OnChanges {
  @Input() public chartData: any = [];
  @Input() public chartWidth!: number;
  @Input() public chartHeight!: number;
  
  private svgInHtml: any;
  private xScale!: any
  private yScale!: any
  constructor(private viewContainerRef: ViewContainerRef) {}

  ngOnChanges() {
    if (this.chartData?.length && this.chartWidth > 0) {
      this.drawSparkLineChart();
    }
  }

  /**
   * @description create svg for chart
   * @function    createSvg
   */
  private createSvg(): void {
    this.svgInHtml = d3Select(this.viewContainerRef.element.nativeElement)
      .select('svg')
      .attr('width', this.chartWidth)
      .attr('height', this.chartHeight);
  }

  /**
   * @description configure chart data
   * @function configureChartData
   */
  private configureChartData(): void {
    // xScale and yScale value
    this.xScale = d3ScaleLinear()
      .domain([0, this.chartData.length])
      .range([0, this.chartWidth]);
    const minMaxValue: any = d3Extent(this.chartData, (d: number) => {
      return d;
    });
    this.yScale = d3ScaleLinear()
      .domain(minMaxValue)
      .range([this.chartHeight, 0]);
  }


  /**
   * @description draw sparkline
   * @function drawLine
   */
  private drawLine(): void {
    let lineGenerator = d3Line()
      .x((_: any, i: number) => {
        return this.xScale(i);
      })
      .y((d: any) => this.yScale(d));

    this.svgInHtml
      .selectAll('path.sparkline')
      .data([this.chartData])
      .join('path')
      .attr('class', 'sparkline')
      .attr('d', lineGenerator)
      .attr('stroke', "#6030ff")
      .attr('fill', 'none');
  }


  /**
   * @description draw sparkline chart with gradient fill color
   * @function drawSparkLineChart
   */
  private drawSparkLineChart(): void {
    this.createSvg();
    this.configureChartData();
    this.drawLine();
  }
}

