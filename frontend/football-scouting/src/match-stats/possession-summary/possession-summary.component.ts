import {
  Component,
  Input,
  AfterViewInit,
  ViewChild,
  ElementRef,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Chart, ChartConfiguration } from 'chart.js';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-possession-summary',
  templateUrl: './possession-summary.component.html',
  styleUrls: ['./possession-summary.component.scss'],
  imports: [MatCardModule],
})
export class PossessionSummaryComponent implements AfterViewInit, OnChanges {
  @Input() possession: any; // the DTO from the backend

  @ViewChild('eventTypeChart')
  eventTypeChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('playerChart') playerChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('distanceChart') distanceChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('successChart') successChartRef!: ElementRef<HTMLCanvasElement>;

  private eventTypeChart!: Chart;
  private playerChart!: Chart;
  private distanceChart!: Chart;
  private successChart!: Chart;

  ngAfterViewInit() {
    if (this.possession) {
      this.initCharts();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['possession'] && !changes['possession'].firstChange) {
      this.updateCharts();
    }
  }

  private initCharts() {
    this.eventTypeChart = new Chart(
      this.eventTypeChartRef.nativeElement,
      this.getEventTypeConfig()
    );
    this.playerChart = new Chart(
      this.playerChartRef.nativeElement,
      this.getPlayerConfig()
    );
    this.distanceChart = new Chart(
      this.distanceChartRef.nativeElement,
      this.getDistanceConfig()
    );
    this.successChart = new Chart(
      this.successChartRef.nativeElement,
      this.getSuccessConfig()
    );
  }

  private updateCharts() {
    this.updateChart(this.eventTypeChart, this.getEventTypeConfig());
    this.updateChart(this.playerChart, this.getPlayerConfig());
    this.updateChart(this.distanceChart, this.getDistanceConfig());
    this.updateChart(this.successChart, this.getSuccessConfig());
  }

  private updateChart(chart: Chart, config: ChartConfiguration) {
    chart.data = config.data!;
    chart.options = config.options!;
    chart.update();
  }

  // -----------------------------
  // Chart Configurations
  // -----------------------------

  private getEventTypeConfig(): ChartConfiguration {
    const counts: Record<string, number> = {};
    this.possession.events.forEach((e: any) => {
      counts[e.event_name] = (counts[e.event_name] || 0) + 1;
    });

    return {
      type: 'bar',
      data: {
        labels: Object.keys(counts),
        datasets: [
          {
            label: 'Event Count',
            data: Object.values(counts),
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
          },
        ],
      },
      options: { responsive: true, scales: { y: { beginAtZero: true } } },
    };
  }

  private getPlayerConfig(): ChartConfiguration {
    const counts: Record<string, number> = {};
    this.possession.events.forEach((e: any) => {
      counts[e.player_name] = (counts[e.player_name] || 0) + 1;
    });

    return {
      type: 'bar',
      data: {
        labels: Object.keys(counts),
        datasets: [
          {
            label: 'Player Involvements',
            data: Object.values(counts),
            backgroundColor: 'rgba(255, 99, 132, 0.6)',
          },
        ],
      },
      options: { responsive: true, scales: { y: { beginAtZero: true } } },
    };
  }

  private getDistanceConfig(): ChartConfiguration {
    const distances: Record<string, number> = {};
    this.possession.events.forEach((e: any) => {
      if (e.end_x >= 0 && e.end_y >= 0) {
        const dx = e.end_x - e.x;
        const dy = e.end_y - e.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        distances[e.player_name] = (distances[e.player_name] || 0) + dist;
      }
    });

    return {
      type: 'bar',
      data: {
        labels: Object.keys(distances),
        datasets: [
          {
            label: 'Distance (m)',
            data: Object.values(distances),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
          },
        ],
      },
      options: { responsive: true, scales: { y: { beginAtZero: true } } },
    };
  }

  private getSuccessConfig(): ChartConfiguration {
    let success = 0;
    let fail = 0;
    const failedEvents = ['Dispossessed', 'Foul Committed', 'Error'];

    this.possession.events.forEach((e: any) => {
      if (failedEvents.includes(e.event_name)) fail++;
      else success++;
    });

    return {
      type: 'pie',
      data: {
        labels: ['Success', 'Failure'],
        datasets: [
          {
            data: [success, fail],
            backgroundColor: [
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 99, 132, 0.6)',
            ],
          },
        ],
      },
      options: { responsive: true },
    };
  }
}
