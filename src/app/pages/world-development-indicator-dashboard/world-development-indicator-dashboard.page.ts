import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent,IonGrid,IonRow,IonCol,IonCard,IonCardContent,IonCardSubtitle,IonCardTitle,IonCardHeader,IonText,IonItem,IonList} from '@ionic/angular/standalone';
import { InfoCardComponent } from 'src/app/components/info-card/info-card.component';
import { DashboardDataService } from 'src/app/services/dashboard-data.service';
import * as topojson from 'topojson-client'
import { SparklineChartComponent } from 'src/app/components/data-viz/sparkline-chart/sparkline-chart.component';
import { WorldMapComponent } from 'src/app/components/data-viz/world-map/world-map.component';

@Component({
  selector: 'app-world-development-indicator-dashboard',
  templateUrl: './world-development-indicator-dashboard.page.html',
  styleUrls: ['./world-development-indicator-dashboard.page.scss'],
  standalone: true,
  imports: [IonContent,IonGrid,IonRow,IonCol,IonCard,IonCardContent,WorldMapComponent,IonCardSubtitle,IonCardTitle,IonCardHeader,IonText,IonList,IonItem,CommonModule, FormsModule,InfoCardComponent,SparklineChartComponent]
})
export class WorldDevelopmentIndicatorDashboardPage implements OnInit {

  constructor(private dashboardDataServices: DashboardDataService) { }

  selectedYear : any;
  yearList : any;
  devIndicatorList = ["GDP","Population"]
  selectedDevIndicator = "GDP"
  gdpData : any;
  populationData : any
  yearWiseData : any;
  topCountryByDevIndicator:any;
  worldTopoJSON : any;
  countryName: any
  worldData : any;
  devData : any;
  topCountryTrend : any
  chartData : any;

  

  async ngOnInit() {
    this.worldTopoJSON = await this.dashboardDataServices.getWorldTopoJSON();
    const countries = (topojson.feature(this.worldTopoJSON, this.worldTopoJSON.objects.countries) as any).features;
    this.countryName = new Set(countries.map((d:any) =>  d.properties.name));
    await this.getGDPData();
    await this.getPopulationData();
  }

  /**
   * @description  year selection change
   * @param event 
   */
  onSelectedYearChanged(event:any){
    this.selectedYear = event;
    this.getYearWiseGData(event);
  }

  /**
   * @description dev indicator selection change
   * @param event 
   */
  onSelectedonDevIndicatorChanged(event:any){
    this.selectedDevIndicator = event;
    this.getYearWiseGData();
  }

  /**
   * @description get year wise GDP and Population data
   * @param year 
   */
  getYearWiseGData(year?:any){
    let yearWiseData = this.selectedDevIndicator === 'GDP' ? this.gdpData : this.populationData
    this.devData = yearWiseData
    this.yearWiseData = yearWiseData.map((d:any) =>{
    let obj = {} as any;
    obj["year"] = this.selectedYear ?? year;
    obj[(this.selectedDevIndicator).toLocaleLowerCase()] = d[this.selectedYear ?? year];
    obj["countryName"]= d["Country Name"];
    obj["countryCode"] = d["Country Code"];
    obj["indicatorName"] = d["Indicator Name"];
    obj["indicatorCode"] = d["Indicator Code"];
    return obj;
    });
   
    this.getTopCountries();
    this.worldData = this.yearWiseData.filter((el:any) => el.countryCode === "WLD")[0][(this.selectedDevIndicator).toLocaleLowerCase()]
  }

  /**
   * @description Get GDP of countries
   */
  async getGDPData(){
    const {data,yearList} = await this.dashboardDataServices.getGDPData();
    this.gdpData = data;
    this.yearList = yearList.reverse(); // to show latest year first
    this.getYearWiseGData(this.yearList[0]);
    this.selectedYear = this.yearList[0];
  }

  /**
   * @description Get population data
   */
  async getPopulationData(){
    const {data} = await this.dashboardDataServices.getPopulationData();
    this.populationData = data;
  }


  /**
   * @description Get top countries by selected indicator
   */
  getTopCountries(){
    this.topCountryByDevIndicator = this.yearWiseData.filter((el:any) => {
      if(this.countryName.has(el.countryName)){
        return true
      }else{
        return false
      }
    } ).sort((a:any,b:any) => (+b[(this.selectedDevIndicator).toLocaleLowerCase()]) - (+a[(this.selectedDevIndicator).toLocaleLowerCase()])).slice(0,6); // Top 6 countries
  this.getTopCountryTrends();
  }


  /**
   * @description Get top country trends
   */
  getTopCountryTrends(){
   let topCountryList = this.topCountryByDevIndicator.map((el:any) =>{
    return el.countryName;
   })
   this.topCountryTrend = this.devData.filter((el:any) =>{
    return topCountryList.includes(el["Country Name"])
   })
   this.chartData = this.topCountryTrend.map((el:any) =>{
     return Object.values(el).filter((item:any) => {
      return item !== '' && +(item) == item
    }).map(Number)
   })
  }

  
  /**
   * @description abbreviate number
   * @param value - number to be converted
   * @param decimals default 1
   * @returns abbreviated value
   */
  abbreviateNumber = (value: any, decimals: number = 1): string => {
  if (value === null || value === undefined || isNaN(value)) {
    return '—';
  }

  const abs = Math.abs(value);

  if (abs >= 1_000_000_000_000) { // Trillion
    return (value / 1_000_000_000_000).toFixed(decimals).replace(/\.0+$/, '') + 'T';
  } else if (abs >= 1_000_000_000) { // Billion
    return (value / 1_000_000_000).toFixed(decimals).replace(/\.0+$/, '') + 'B';
  } else if (abs >= 1_000_000) { // Million
    return (value / 1_000_000).toFixed(decimals).replace(/\.0+$/, '') + 'M';
  } else {
    return value.toLocaleString(); // No abbreviation
  }
}
}
