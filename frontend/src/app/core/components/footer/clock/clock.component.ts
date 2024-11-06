import { Component } from '@angular/core';
import {DateTimeFormatPipe} from './date-time-format.pipe';

@Component({
  selector: 'app-clock',
  standalone: true,
  imports: [
    DateTimeFormatPipe
  ],
  templateUrl: './clock.component.html',
  styleUrl: './clock.component.css'
})
export class ClockComponent {
  currentDate = new Date();
  private intervalId: any;

  ngOnInit(): void {
    this.intervalId = setInterval(() => {
      this.currentDate = new Date();
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
