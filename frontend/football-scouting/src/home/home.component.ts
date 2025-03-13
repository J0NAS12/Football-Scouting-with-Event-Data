import { Component, OnInit } from '@angular/core';
import { MatchService } from '../services/match';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-home',
  imports: [CommonModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  constructor(private matchService: MatchService) {}
  matches: any[] = [];
  competitions: any[] = [];
  events: any[] = [];
  event: any = '';

  ngOnInit(): void {
    this.matchService.getCompetititons().subscribe((x) => {
      this.competitions = x;
    });
  }

  competitionSelected(event: any) {
    this.matchService.getMatchesList(event).subscribe((x) => {
      console.log(x);
      this.matches = x;
    });
  }

  matchSelected(event: any) {
    this.matchService.getEventsList(event).subscribe((x) => {
      console.log(x);
      this.events = x.filter((x: any) => x.event_name == 'Shot');
    });
  }

  eventSelected(event: any) {
    this.matchService.getEventwithPlayerPositions(event).subscribe((x) => {
      console.log(x);
      this.event = JSON.stringify(x);
    });
  }
}
