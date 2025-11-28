import { Component, Input, SimpleChanges } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-football-pitch-resizable',
  imports: [MatTooltip],
  templateUrl: './football-pitch-resizable.component.html',
  styleUrl: './football-pitch-resizable.component.scss',
})
export class FootballPitchResizableComponent {
  @Input('event') event?: {
    duration: number;
    event_name: string;
    player_positions: any[];
    player_name: string;
    player_id: number;
    x: number;
    y: number;
    end_x: number;
    end_y: number;
    team_name: string;
  };

  @Input() scale = 1; // 🔹 dynamic scale factor

  @Input('possession') eventlist?: any;
  @Input('player_events') player_events?: any;
  @Input('home_team') home_team: string = '';

  private readonly BASE_WIDTH = 600; // px
  private readonly BASE_HEIGHT = 450; // px
  private readonly FIELD_X_UNITS = 120;
  private readonly FIELD_Y_UNITS = 80;

  constructor() {}

  ngOnInit(): void {
    // optional initialization
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.ngOnInit();
    this.initPositions();
  }

  /** Initializes player and ball positions dynamically */
  initPositions() {
    setTimeout(() => {
      if (!this.event) return;
      this.event.player_positions.forEach((player, idx) => {
        const el = document.getElementById(`ppos-${idx}`);
        if (!el) return;
        let team = '';
        console.log(this.home_team, this.event?.team_name);
        if (this.event?.team_name == this.home_team) {
          team = player.teammate ? this.home_team : '';
        } else if (player.teammate) {
          team = '';
        } else {
          team = this.home_team;
        }
        this.assignPos(
          el,
          player.x,
          player.y,
          team,
          this.event?.team_name != this.home_team
        );
      });

      const start = document.getElementById(`${this.event.player_id}`);
      if (start) {
        this.assignPos(
          start,
          this.event.x,
          this.event.y,
          this.event.team_name,
          this.event.team_name != this.home_team
        );
      }

      const ball = document.getElementById('ball');
      const end = document.getElementById('end');

      if (ball && end && this.event.end_x > 0 && this.event.end_y > 0) {
        this.assignPos(
          end,
          this.event.end_x,
          this.event.end_y,
          this.event.team_name,
          this.event.team_name != this.home_team
        );
        this.ball_assign(ball);
      } else {
        if (end) end.style.display = 'none';
        if (ball) ball.style.display = 'none';
      }
    }, 0);
  }

  /** Assigns position to any player element */
  assignPos(
    element: HTMLElement,
    x: number,
    y: number,
    team?: string,
    rotate: boolean = false
  ) {
    // colors
    if (team === undefined) {
      element.style.backgroundColor = 'lightblue';
    } else if (team === this.home_team) {
      element.style.backgroundColor = 'blue';
    } else {
      element.style.backgroundColor = 'red';
    }

    // scaling factor based on base dimensions
    const scaleX = (this.BASE_WIDTH / this.FIELD_X_UNITS) * this.scale;
    const scaleY = (this.BASE_HEIGHT / this.FIELD_Y_UNITS) * this.scale;

    const left = rotate
      ? -5 * this.scale + (this.FIELD_X_UNITS - x) * scaleX
      : -5 * this.scale + x * scaleX;

    const top = rotate
      ? -5 * this.scale + (this.FIELD_Y_UNITS - y) * scaleY
      : -5 * this.scale + y * scaleY;

    element.style.left = `${left}px`;
    element.style.top = `${top}px`;
    element.style.display = 'block';
  }

  /** Assigns ball position and triggers animation */
  ball_assign(ball: HTMLElement) {
    if (!this.event) return;

    const scaleX = (this.BASE_WIDTH / this.FIELD_X_UNITS) * this.scale;
    const scaleY = (this.BASE_HEIGHT / this.FIELD_Y_UNITS) * this.scale;

    if (this.home_team === this.event.team_name) {
      ball.style.left = `${-3 * this.scale + this.event.x * scaleX}px`;
      ball.style.top = `${-3 * this.scale + this.event.y * scaleY}px`;
      ball.style.setProperty(
        '--endX',
        `${(this.event.end_x - this.event.x) * scaleX}px`
      );
      ball.style.setProperty(
        '--endY',
        `${(this.event.end_y - this.event.y) * scaleY}px`
      );
    } else {
      ball.style.left = `${
        -3 * this.scale + (this.FIELD_X_UNITS - this.event.x) * scaleX
      }px`;
      ball.style.top = `${
        -3 * this.scale + (this.FIELD_Y_UNITS - this.event.y) * scaleY
      }px`;
      ball.style.setProperty(
        '--endX',
        `${-(this.event.end_x - this.event.x) * scaleX}px`
      );
      ball.style.setProperty(
        '--endY',
        `${-(this.event.end_y - this.event.y) * scaleY}px`
      );
    }

    ball.style.display = 'block';
    ball.style.setProperty('--duration', `${this.event.duration}s`);

    // restart animation
    ball.classList.remove('animate');
    void ball.offsetWidth;
    ball.classList.add('animate');
  }

  /** Utility coordinate scaling functions (optional) */
  scaleX(x: number, home: boolean = true): number {
    const scaleX = (this.BASE_WIDTH / this.FIELD_X_UNITS) * this.scale;
    return home ? x * scaleX : (this.FIELD_X_UNITS - x) * scaleX;
  }

  scaleY(y: number, home: boolean = true): number {
    const scaleY = (this.BASE_HEIGHT / this.FIELD_Y_UNITS) * this.scale;
    return home ? y * scaleY : (this.FIELD_Y_UNITS - y) * scaleY;
  }

  success(event: any) {
    const failEvents = ['Dispossessed', 'Foul Committed', 'Error'];
    if (failEvents.includes(event.event_name)) return false;
    const successLabels = [
      null,
      'Success',
      'Complete',
      'Success to team',
      'Success in Play',
      'Goal',
      'Won',
    ];
    return successLabels.includes(event.event_outcome);
  }
}
