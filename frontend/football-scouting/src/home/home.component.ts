import { Component, OnInit } from '@angular/core';
import { MatchService } from '../services/match';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { PlayerService } from '../services/player';
import { FootballPitchResizableComponent } from '../football-pitch-resizable/football-pitch-resizable.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
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
    RouterModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  random_goal: any = null;
  home_team = '';

  constructor(
    private matchService: MatchService,
    private playerService: PlayerService
  ) {}

  ngOnInit(): void {
    this.matchService.getRandomGoal().subscribe((x) => {
      this.random_goal = x.events;
      this.home_team = x.possession_team_name;
    });
  }
}
