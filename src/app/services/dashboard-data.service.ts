import { Injectable } from '@angular/core';
import { csvParse as d3CsvParse } from 'd3-dsv';


@Injectable({
  providedIn: 'root'
})
export class DashboardDataService {

  constructor() { }

  /**
   * @description This function is used to get the GDP data from the csv file
   * @returns gdpJsonData & yearList
   */
  async getGDPData(){
    const gdpDataPath = await fetch('../../assets/data/gdp/gdp.csv');
    const gdpDataString = await gdpDataPath.text();
    let removeUnusedData = gdpDataString.split('\n').slice(3);
    let  [_, ...requiredData] = removeUnusedData;
    let gdpJsonData = d3CsvParse(requiredData.join('\n'));
    let yearList =  Object.keys(gdpJsonData[0]).filter((d:any) => parseInt(d) == d)
    return { data : gdpJsonData, yearList: yearList }
  }

  /**
   * @description This function is used to get the population data from the csv file
   * @returns populationJsonData & yearList
   */
  async getPopulationData(){
    const populationDataPath = await fetch('../../assets/data/populations/populations.csv');
    const populationDataString = await populationDataPath.text();
    let removeUnusedData = populationDataString.split('\n').slice(3);
    let  [_, ...requiredData] = removeUnusedData;
    let populationJsonData = d3CsvParse(requiredData.join('\n'));
    let yearList =  Object.keys(populationJsonData[0]).filter((d:any) => parseInt(d) == d)
    return { data : populationJsonData, yearList: yearList }
  }

  /**
   * @description  This function is used to get the world topology data from the json file
   * @returns topologyJson
   */
  async getWorldTopoJSON(){
      const topologyJson = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json').then(response => response.json());
      return topologyJson;
  }
}
