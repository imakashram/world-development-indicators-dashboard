import { Component, Input, ViewContainerRef, OnChanges } from '@angular/core';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';

@Component({
  selector: 'app-world-map',
  templateUrl: './world-map.component.html',
  styleUrls: ['./world-map.component.scss'],
})
export class WorldMapComponent implements OnChanges {

  @Input() topoJSON : any
  @Input() chartWidth  = 900;
  @Input() chartHeight = 500;
  @Input() yearWiseData : any;
  @Input() selectedDevIndicator = "GDP"
  @Input() devIndicatorFactor =  1_000_000_000_000 
  devIndicatorMap : any
  colorScale: any

  constructor(private viewContainerRef: ViewContainerRef) {

  }

  ngOnChanges() {
    if(this.topoJSON) {
      
      //this.devIndicatorFactor = this.selectedDevIndicator.toLocaleLowerCase() == "gdp" ? 1_000_000_000_000 : 1_000_000_00
      this.devIndicatorMap = new Map(this.yearWiseData.map((d:any) => [d.countryName, +d[this.selectedDevIndicator.toLocaleLowerCase()]]));
      let devIndicatorList = [...this.devIndicatorMap.values()].filter((d:any) => d > 0);
      let min = d3.min(devIndicatorList) as any
      let max = d3.max(devIndicatorList) as any
      this.colorScale = d3.scaleLinear().domain([min, max]).range(["#BCD2E8","#6030FF"] as any).clamp(true);
      this.drawMap();
    }
  }

  private drawMap(): void {
    const svg = d3.select(this.viewContainerRef.element.nativeElement)
      .selectAll('svg').data([null]).join('svg')
      .attr('width', this.chartWidth)
      .attr('height', this.chartHeight);

    const projection = d3.geoMercator()
      .scale(110)
      .translate([this.chartWidth / 2, this.chartHeight / 1.5]);

    const path = d3.geoPath().projection(projection);

   
      const countries = topojson.feature(this.topoJSON, this.topoJSON.objects.countries) as any;

      svg.selectAll('g#world-path')
        .data([null])
        .join('g')
        .attr('id', 'world-path')
        .selectAll('path')
        .data(countries.features)
        .join('path')
        .attr('d', path as any)
        .attr('fill', (d:any)=>{
          return this.colorScale(this.devIndicatorMap.get(d.properties.name) ?? 0)
        })
        .attr('stroke', '#333')


        svg.selectAll('g#world-path')
        .data([null])
        .join('g')
        .attr('id', 'world-path')
        .selectAll('circle.indicator')
        .data(countries.features)
        .join('circle')
        .attr('class', 'indicator')
        .attr('cx', (d: any) => {
        const centroid = path.centroid(d);
        return centroid[0];
      })
      .attr('cy', (d: any) => {
        const centroid = path.centroid(d);
        return centroid[1];
      })
      .attr('r', (d:any)=>{
        const devIndicatorValue = this.devIndicatorMap.get(d.properties.name) ?? 0
        return devIndicatorValue/this.devIndicatorFactor;
      })
      .attr("stroke", "#000000")
      .attr('fill', '#009A82');
  }
}
