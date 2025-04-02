import { Component, OnInit } from '@angular/core';
import { MatchService } from '../services/match';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { FootballPitchComponent } from '../football-pitch/football-pitch.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    FootballPitchComponent,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  Object = Object;
  constructor(private matchService: MatchService) {}

  matches: any[] = [];
  competitions: any[] = [];
  events: any[] = [];
  event_index = 0;
  event: any;
  json: string = '';
  stats: any = {};
  currentMatch: any;

  ngOnInit(): void {
    this.matchService.getCompetititons().subscribe((x) => {
      this.competitions = x;
    });
  }

  competitionSelected(competition: any) {
    this.matchService.getMatchesList(competition).subscribe((x) => {
      this.matches = x;
    });
  }

  matchSelected(match: any) {
    this.currentMatch = this.matches.find((x) => x.id == match);
    this.matchService.getEventsList(match).subscribe((x) => {
      this.events = x;
      this.eventSelected(this.events[this.event_index].id);
    });
    this.matchService.getStats(match).subscribe((x) => {
      this.stats = x;
    });
  }

  eventSelected(event: any) {
    this.matchService.getEventwithPlayerPositions(event).subscribe((x) => {
      this.event = x;
      this.json = JSON.stringify(this.event);
    });
  }

  eventChanged(change: number) {
    this.event_index += change;
    this.eventSelected(this.events[this.event_index].id);
  }
}
