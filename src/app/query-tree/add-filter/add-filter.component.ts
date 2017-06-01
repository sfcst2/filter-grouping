import { Input, Component, OnInit, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { InputText, Button } from 'primeng/primeng'
import {AddFilterModel} from '../../models/add-filter.model';

@Component({
  selector: 'add-filter',
  templateUrl: './add-filter.component.html',
  styleUrls: ['./add-filter.component.css']
})
export class AddFilterComponent implements OnInit {

  @Input('addFilterModel')
  private addFilterModel:AddFilterModel;

  @Output()
  private addFilter:EventEmitter<AddFilterModel> = new EventEmitter<AddFilterModel>();

  @ViewChild('filterInputField')
  private filterInputText:ElementRef;

  constructor() { }

  ngOnInit() {
  }

  clickAddFilter(event:any):void{
    let filterStr:string = this.filterInputText.nativeElement.value;
    this.addFilterModel.value = filterStr;    
    this.addFilter.emit(this.addFilterModel);    
  }

}
