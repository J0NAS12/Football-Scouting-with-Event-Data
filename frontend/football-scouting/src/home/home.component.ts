import { Component, OnInit } from '@angular/core';
import { MatchService } from '../services/match';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { FootballPitchComponent } from '../football-pitch/football-pitch.component';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    FootballPitchComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  constructor(private matchService: MatchService) {}
  matches: any[] = [];
  competitions: any[] = [];
  events: any[] = [];
  event: any = {};
  json: string = '';

  ngOnInit(): void {
    this.matchService.getCompetititons().subscribe((x) => {
      this.competitions = x;
    });
  }

  competitionSelected(event: any) {
    this.matchService.getMatchesList(event).subscribe((x) => {
      this.matches = x;
    });
  }

  matchSelected(event: any) {
    this.matchService.getEventsList(event).subscribe((x) => {
      this.events = x.filter((x: any) => x.event_name == 'Shot');
    });
  }

  eventSelected(event: any) {
    this.matchService.getEventwithPlayerPositions(event).subscribe((x) => {
      this.event = x;
      this.json = JSON.stringify(this.event);
    });
  }
}
