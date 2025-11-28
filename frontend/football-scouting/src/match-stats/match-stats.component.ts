import { Component } from '@angular/core';
import { MatchService } from '../services/match';
import { PlayerService } from '../services/player';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FootballPitchResizableComponent } from '../football-pitch-resizable/football-pitch-resizable.component';
import { PossessionSummaryComponent } from './possession-summary/possession-summary.component';

@Component({
  selector: 'app-match-stats',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTabsModule,
    FormsModule,
    MatTableModule,
    MatToolbarModule,
    FootballPitchResizableComponent,
    PossessionSummaryComponent,
  ],
  templateUrl: './match-stats.component.html',
  styleUrl: './match-stats.component.scss',
})
export class MatchStatsComponent {
  Object = Object;

  constructor(
    private matchService: MatchService,
    private playerService: PlayerService
  ) {}

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

  playingStyleSelected($event: any) {
    this.playerService
      .getPlayerStats(this.currentMatch.id, $event.value)
      .subscribe((x) => {
        this.stats = x;
        this.displayedColumns = Object.keys(this.stats[0]).filter(
          (k) => !k.endsWith('_id') && k != 'playing_style'
        );
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
    this.playerService.getPlayerStats(match).subscribe((x) => {
      this.stats = x;
      this.displayedColumns = Object.keys(this.stats[0]).filter(
        (k) => !k.endsWith('_id')
      );
    });
    this.matchService.getPossessions(match).subscribe((x) => {
      this.possessions = x;
      this.playingStyles = [
        ...new Set(this.possessions.map((item) => item.playing_style)),
      ];
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

  getEventCountsLabels(counts: any) {
    return Object.keys(counts);
  }
  getEventCountsData(counts: any) {
    return Object.values(counts);
  }

  getPlayerInvolvementLabels(involvements: any) {
    return Object.keys(involvements);
  }
  getPlayerInvolvementData(involvements: any) {
    return Object.values(involvements);
  }

  getPlayerDistanceLabels(distance: any) {
    return Object.keys(distance);
  }
  getPlayerDistanceData(distance: any) {
    return Object.values(distance);
  }

  fieldDisplayMap: any = {
    team_name: 'Team Name',
    player_name: 'Player Name',
    playing_style: 'Playing Style',
    total_passes: 'Total Passes',
    successful_passes: 'Successful Passes',
    pass_accuracy_percent: 'Pass Accuracy (%)',
    total_shots: 'Total Shots',
    total_goals: 'Total Goals',
    corners: 'Corners',
    total_dribbles: 'Total Dribbles',
    successful_dribbles: 'Successful Dribbles',
    dribble_success_percent: 'Dribble Success (%)',
    duels_total: 'Duels Total',
    duels_won: 'Duels Won',
    duel_success_percent: 'Duel Success (%)',
    tackles: 'Tackles',
    interceptions: 'Interceptions',
    ball_recoveries: 'Ball Recoveries',
    clearances: 'Clearances',
    blocks: 'Blocks',
    fouls_committed: 'Fouls Committed',
    fouls_won: 'Fouls Won',
  };
}
