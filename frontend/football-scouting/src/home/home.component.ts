import { Component, OnInit } from '@angular/core';
import { MatchService } from '../services/match';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { FootballPitchComponent } from '../football-pitch/football-pitch.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';

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
    MatTabsModule,
    FormsModule,
    MatTableModule,
    MatToolbarModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  Object = Object;

  constructor(private matchService: MatchService) {}

  playing = false;
  matches: any[] = [];
  competitions: any[] = [];
  events: any[] = [];
  possessions: any[] = [];
  possession: any;
  event_index = 0;
  event: any;
  json: string = '';
  stats: any = {};
  currentMatch: any;
  competition: any;
  playingStyles: any = [1, 2, 3, 4];
  selectedStyle: any;
  selectedPlayers: any;

  displayedColumns: string[] = ['team_name']; //

  ngOnInit(): void {
    this.matchService.getCompetititons().subscribe((x) => {
      this.competitions = x;
    });
  }

  set(l: any): any {
    return new Set(l);
  }

  competitionSelected(competition: any) {
    this.currentMatch = null;
    this.competition = null;
    this.event = null;
    this.competition = this.competitions.find(
      (x) => x.competition_id == competition
    );
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
    this.matchService.getPlayerStats(match).subscribe((x) => {
      this.stats = x;
      this.displayedColumns = Object.keys(this.stats[0]).filter(
        (k) => !k.endsWith('_id')
      );
    });
    this.matchService.getPossessions(match).subscribe((x) => {
      this.possessions = x;
    });
    this.matchService.getPossession(this.currentMatch.id, 3).subscribe((x) => {
      this.possession = x;
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
    this.play();
  }

  possessionSelected($event: any) {
    this.matchService
      .getPossession(this.currentMatch.id, $event)
      .subscribe((x) => {
        this.possession = x;
      });
  }

  start() {
    if (!this.playing) {
      this.playing = true;
      this.play();
    }
  }

  play() {
    if (this.playing) {
      setTimeout(() => {
        console.log(this.event.duration);
        this.eventChanged(1);
      }, this.event.duration * 1000);
    }
  }

  stop() {
    this.playing = false;
  }
}
