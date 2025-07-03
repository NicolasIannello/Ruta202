import { Component } from '@angular/core';
import { CommonService } from '../../../servicios/common.service';

@Component({
  selector: 'app-emergency-notice',
  standalone: true,
  imports: [],
  templateUrl: './emergency-notice.component.html',
})
export class EmergencyNoticeComponent {
  constructor(public common: CommonService) {}
}
