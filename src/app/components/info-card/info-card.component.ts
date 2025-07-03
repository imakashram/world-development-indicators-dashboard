import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonCard,IonCardContent,IonCardSubtitle,IonCardTitle,IonCardHeader,IonText } from '@ionic/angular/standalone';

@Component({
  selector: 'app-info-card',
  templateUrl: './info-card.component.html',
  styleUrls: ['./info-card.component.scss'],
  standalone: true,
  imports: [IonCard,IonCardContent,IonCardSubtitle,IonCardTitle,IonCardHeader,IonText]
})
export class InfoCardComponent  implements OnInit {

  @Input() yearList : number[] = [];
  @Output() onSelectedYearChanged = new EventEmitter<number>();
  @Input() devIndicatorList : string[] = [];
  @Output() onSelectedonDevIndicatorChanged = new EventEmitter<number>();

  ngOnInit() {}

  /**
   * @description Emits the selected year to the parent component
   * @param event 
   */
  onYearChange(event:any){
    if(event){
      this.onSelectedYearChanged.emit(event.target.value);
    }
  }

  /**
   * @description Emits the selected dev indicator to the parent component
   * @param event 
   */
  onDevIndicatorChange(event:any){
    if(event){
      this.onSelectedonDevIndicatorChanged.emit(event.target.value);
    }
  }
  

}
