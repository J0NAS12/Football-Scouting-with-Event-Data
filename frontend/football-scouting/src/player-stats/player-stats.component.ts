import { Component, NgModule, OnInit } from '@angular/core';
import { PlayerService } from '../services/player';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Chart, ChartItem, registerables } from 'chart.js';
import { FootballPitchComponent } from '../football-pitch/football-pitch.component';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import annotationPlugin from 'chartjs-plugin-annotation';
import { FootballPitchResizableComponent } from '../football-pitch-resizable/football-pitch-resizable.component';
Chart.register(...registerables, annotationPlugin);

@Component({
  selector: 'app-player-stats',
  imports: [
    MatOption,
    MatSelect,
    MatFormFieldModule,
    CommonModule,
    MatChipsModule,
    MatTabsModule,
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    FootballPitchResizableComponent,
  ],
  templateUrl: './player-stats.component.html',
  styleUrl: './player-stats.component.scss',
})
export class PlayerStatsComponent implements OnInit {
  players: any[] = [];

  selectedPlayer: any = null;
  otherPlayer: any = {};
  playerEvents: any = undefined;
  eventTypes: any = [];

  similarPlayers: any[] = [];
  selectedTabIndex = 0;

  positionsChart?: Chart;
  Object: any;
  charts: any = {};

  constructor(private playerService: PlayerService) {}
  displayedColumns: string[] = [
    'id',
    'player_name',
    'minutes',
    'analyze',
    'compare',
  ];

  ngOnInit(): void {
    this.selectedPlayer = null;
    this.charts = {};
    this.playerService.getPlayerList().subscribe((x) => {
      this.players = x;
    });
  }

  playerSelected(player: Event) {
    console.log(player, 'player selected');
    this.selectedTabIndex = 0;
    this.playerService.getPlayer(player).subscribe((x) => {
      this.selectedPlayer = x;
      this.playerService
        .getPlayerList(this.selectedPlayer.cluster)
        .subscribe((x) => {
          this.similarPlayers = x;
        });
      setTimeout(() => this.setUpCharts(), 200);
    });
    this.playerService.getPlayerEvents(player, []).subscribe((x) => {
      this.playerEvents = x;
    });

    this.playerService.getEventTypes().subscribe((x) => {
      this.eventTypes = x;
    });
  }

  chipSelected(eventType: any) {
    eventType.selected = !eventType.selected;
    console.log(eventType);
    this.playerService
      .getPlayerEvents(
        this.selectedPlayer.id,
        this.eventTypes.filter((x: any) => x.selected)
      )
      .subscribe((x) => {
        this.playerEvents = x;
      });
  }

  otherPlayerSelected(player: number) {
    this.playerService.getPlayer(player).subscribe((x) => {
      this.otherPlayer = x;
      this.selectedTabIndex = 3;
    });
  }

  setUpCharts() {
    const ctx = document.getElementById('myChart') as ChartItem;
    if (this.positionsChart) {
      this.positionsChart.destroy();
    }
    if (!ctx) {
      console.error('Failed to get 2D context');
      return;
    }
    this.positionsChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: [
          'Goalkeeper',
          'Center Back',
          'Wide Back',
          'Center Midfielder',
          'Wide Midfielder',
          'Striker',
        ],
        datasets: [
          {
            label: 'Positions',
            data: [
              this.selectedPlayer.goalkeeper * 100,
              this.selectedPlayer.center_back * 100,
              this.selectedPlayer.wide_back * 100,
              this.selectedPlayer.centermidfielder * 100,
              this.selectedPlayer.wide_midfielder * 100,
              this.selectedPlayer.striker * 100,
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
          },
        },
      },
    });
    this.selectAttributeChart('pass_90');
  }

  playerAttributeKeys() {
    return Object.keys(this.selectedPlayer) || [];
  }

  selectAttributeChart(event: string) {
    this.playerService
      .getAttributeBucket(this.selectedPlayer.id, event)
      .subscribe((bucketData) => {
        const statName = bucketData.stat_name ?? 'Stat';
        console.log(this.charts);
        this.showEqualWidthBuckets(
          bucketData.global,
          statName,
          'global-equal-width'
        );
        this.showEqualSizeBuckets(
          bucketData.global,
          statName,
          'global-equal-size'
        );
        this.showEqualWidthBuckets(
          bucketData.cluster,
          statName,
          'cluster-equal-width'
        );
        this.showEqualSizeBuckets(
          bucketData.cluster,
          statName,
          'cluster-equal-size'
        );
      });
  }

  getComparisonWidth(
    value: number,
    attribute: string,
    player: 'selected' | 'other'
  ): number {
    if (value == null) return 0;

    const val1 = this.selectedPlayer?.[attribute] ?? 0;
    const val2 = this.otherPlayer?.[attribute] ?? 0;

    // Normalize percentage-based attributes
    const normalized1 = attribute.includes('percent') ? val1 * 100 : val1;
    const normalized2 = attribute.includes('percent') ? val2 * 100 : val2;

    const total = normalized1 + normalized2;

    if (total === 0) return 50; // both 0 → neutral center

    const width =
      ((player === 'selected' ? normalized1 : normalized2) / total) * 100;
    return Math.min(Math.max(width, 0), 100);
  }

  playerName(id: any): string {
    if (id == null) return '';
    return this.players.find((x) => x.id == id).name;
  }

  showEqualWidthBuckets(bucketData: any, statName: any, element: string) {
    const ctx = document.getElementById(element) as ChartItem;
    if (this.charts[element]) {
      this.charts[element].destroy();
    }
    // Extract labels and counts from bucketData
    const labels = bucketData.width_buckets.map(
      (b: any) => ` ${b.bucket * 10} %`
    );
    const counts = bucketData.width_buckets.map((b: any) => b.count);

    // Highlight the player's bucket
    const backgroundColors = bucketData.width_buckets.map((b: any) =>
      b.bucket === bucketData.player_bucket_width
        ? 'rgba(63,81,181,0.8)'
        : 'rgba(200,200,200,0.5)'
    );

    this.charts[element] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: this.playerName(this.selectedPlayer.id),
            data: counts,
            backgroundColor: backgroundColors,
            borderColor: 'rgba(63,81,181,1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  showEqualSizeBuckets(data: any, statName: any, element: string) {
    // Get 2D drawing context safely
    const canvas = document.getElementById(element) as HTMLCanvasElement;
    if (!canvas) {
      console.warn(`Canvas not found for ${element}`);
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.warn('Failed to get 2D context');
      return;
    }

    // Destroy any existing chart
    if (this.charts[element]) {
      this.charts[element].destroy();
    }

    const buckets = data.size_buckets ?? [];
    const playerBucket = data.player_bucket;

    if (!buckets.length) return;

    // Compute density

    const xValues = buckets.map((b: any) => (b.start + b.end) / 2);
    let yValues = buckets.map((b: any) => {
      const width = b.end - b.start;
      return width > 0 ? b.count / width : Infinity; // temporarily mark width=0 as Infinity
    });

    // Step 2: find the max finite value
    const finiteMax = Math.max(
      ...yValues.filter((v: any) => Number.isFinite(v))
    );

    // Step 3: replace any Infinity or NaN with finiteMax
    yValues = yValues.map((v: any) => (Number.isFinite(v) ? v : finiteMax));

    const playerX = this.selectedPlayer[statName];
    console.log(playerX);

    console.log(`${playerX}, ${Math.max(...yValues)}`);
    // Create the chart
    this.charts[element] = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [
          {
            label: 'Distribution Density',
            parsing: false,
            data: xValues.map((x: number, i: number) => ({ x, y: yValues[i] })),
            fill: true,
            tension: 0.3,
            borderColor: 'cornflowerblue',
            backgroundColor: 'rgba(100,149,237,0.2)',
            pointRadius: 0,
          },
          {
            label: 'Player',
            data: [
              { x: playerX, y: Math.max(0) }, // bottom of chart
              {
                x: playerX + Math.max(...xValues) / 100,
                y: Math.max(...yValues) / 1,
              }, // slightly above max for padding
            ],
            borderColor: 'green',
            borderWidth: 2,
            type: 'line', // ensures this dataset is rendered as a line
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: 'linear',
            title: { display: true, text: `${statName} (value)` },
            grid: { display: false },
            border: { display: false },
          },
          y: {
            title: { display: true, text: 'Density (count / width)' },
            beginAtZero: true,
            border: { display: false },
          },
        },
      },
    });
  }

  attr_list: any = [
    ['pass_90', 'Passes/90'],
    ['assists_90', 'Assists/90'],
    ['shot_90', 'Shots/90'],
    ['xg_90', 'Expected goals/90'],
    ['goals_90', 'Goals/90'],
    ['dribble_90', 'Dribbles/90'],
    ['carry_90', 'Carries/90'],
    ['block_90', 'Blocks/90'],
    ['ball_recovery_90', 'Ball recovery/90'],
    ['interception_90', 'Interception/90'],
    ['clearance_90', 'Clearence/90'],
    ['pressure_90', 'Pressures/90'],
    ['foul_won_90', 'Fouls won/90'],
    ['foul_commited_90', 'Fouls committed/90'],
    ['pass_success_rate_percent', 'Pass success rate'],
    ['header_percent', 'Headers'],
    ['extra_shots_percent', 'Acrobatic shots'],
    ['first_time_shots_percent', 'First time shots'],
    ['shots_on_target_percent', 'Shots on target'],
    ['ground_pass_percent', 'Ground passes'],
    ['low_pass_percent', 'Low passes'],
    ['high_pass_percent', 'High passes'],
  ];
}
