import { Component, OnInit, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-process-step',
  templateUrl: './processStep.component.html',
  styleUrls: ['./processStep.component.css']
})
/** chỉ hỗ trợ dưới 3 step T^T */
export class ProcessStepComponent implements OnInit {

  @Input() header: string = "";
  @Input() description: string = "";
  @Input() activeItem: number = 1;
  @Input() processList: Array<ProcessItem> = [{icon: 'ti-info-alt', title: 'Thông tin'}];
  processBarLength: number = 0;
  constructor() { }

  ngOnInit() {
    this.calWidthItem();
    this.setActiveItem();
    this.calProcessBar();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['processList']) {
      this.calWidthItem();
      this.setActiveItem();
      this.calProcessBar();
    }
  }
  calWidthItem() {
    this.processList.forEach(item => {
      item.width = 100 / this.processList.length;
    })
  }
  calProcessBar() {
    let step = 100 / this.processList.length;
    let offset = step / 2;
    this.processBarLength = offset + ( step * (this.activeItem - 1));
  }
  setActiveItem() {
    this.processList.forEach(item => {
      item.active = false;
    })
    if (this.activeItem <= this.processList.length) {
      for (let i = 0; i < this.activeItem; i++ ) {
        this.processList[i].active = true;
      }
    }
  }
}
export class ProcessItem {
  icon: string;
  title: string;
  active?: boolean = false;
  width?: number;
}