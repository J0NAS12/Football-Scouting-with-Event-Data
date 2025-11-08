import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-football-pitch',
  imports: [MatTooltip],
  templateUrl: './football-pitch.component.html',
  styleUrl: './football-pitch.component.scss',
})
export class FootballPitchComponent implements OnInit, OnChanges {
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

  @Input('possession') eventlist?: any;
  @Input('player_events') player_events?: any;
  @Input('home_team') home_team: string = '';

  constructor() {}

  ngOnInit(): void {}

  initPositions() {
    setTimeout(() => {
      if (!!this.event) {
        this.event.player_positions.forEach((player, idx) => {
          let d = document.getElementById(`ppos-${idx}`);
          if (!!d) {
            let team = '';
            if (this.event?.team_name == this.home_team) {
              team = player.teammate ? this.home_team : '';
            } else if (player.teammate) {
              team = '';
            } else {
              team = this.home_team;
            }

            this.assignPos(
              d,
              player.x,
              player.y,
              team,
              player.team_name != this.home_team
            );
          }
        });
        let start = document.getElementById(`${this.event.player_id}`);
        if (!!start) {
          this.assignPos(
            start,
            this.event.x,
            this.event.y,
            this.event.team_name,
            this.event.team_name != this.home_team
          );
        }
        let ball = document.getElementById('ball');

        let end = document.getElementById('end');
        if (!!ball && !!end && this.event.end_x > 0 && this.event.end_y > 0) {
          this.assignPos(
            end,
            this.event.end_x,
            this.event.end_y,
            this.event.team_name,
            this.event.team_name != this.home_team
          );

          this.ball_assign(ball);
        } else {
          end!!.style.display = 'none';
          ball!!.style.display = 'none';
        }
      }
    }, 0);
  }
  /*
  initPossessions() {
    setTimeout(() => {
      if (this.possession) {
        this.possession.events.forEach((event: any, index: number) => {
          console.log(index);
          let d = document.getElementById(`poss-${index}`);
          console.log(d);
          if (!!d) {
            this.assignPos(d, event.x, event.y, event.team_name);
          }
        });
      }
    }, 0);
  }

  */

  assignPos(
    element: any,
    x: number,
    y: number,
    team?: string,
    rotate: boolean = false
  ) {
    if (team === undefined) {
      element.style.backgroundColor = 'lightblue';
    } else if (team == this.home_team) {
      element.style.backgroundColor = 'blue';
    } else {
      element.style.backgroundColor = 'red';
    }
    if (rotate) {
      element.style.left = -5 + (120 - x) * 5 + 'px';
      element.style.top = -5 + (80 - y) * 5 + 'px';
    } else {
      element.style.left = -5 + x * 5 + 'px';
      element.style.top = -5 + y * 5 + 'px';
    }
    element.style.display = 'block';
  }

  ball_assign(ball: any) {
    if (this.event) {
      if (this.home_team == this.event.team_name) {
        ball.style.left = -3 + this.event.x * 5 + 'px';
        ball.style.top = -3 + this.event.y * 5 + 'px';
        ball.style.setProperty(
          '--endX',
          this.event.end_x * 5 - this.event.x * 5 + 'px'
        );
        ball.style.setProperty(
          '--endY',
          this.event.end_y * 5 - this.event.y * 5 + 'px'
        );
      } else {
        ball.style.left = -3 + (120 - this.event.x) * 5 + 'px';
        ball.style.top = -3 + (80 - this.event.y) * 5 + 'px';
        ball.style.setProperty(
          '--endX',
          -(this.event.end_x * 5 - this.event.x * 5) + 'px'
        );
        ball.style.setProperty(
          '--endY',
          -(this.event.end_y * 5 - this.event.y * 5) + 'px'
        );
      }
      ball.style.display = 'block';
      ball.style.setProperty('--duration', this.event.duration + 's');
      ball.classList.remove('animate');
      void ball.offsetWidth;
      ball.classList.add('animate');
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    this.ngOnInit();
    this.initPositions();
  }

  scaleX(x: number, home: boolean = true) {
    if (home) {
      return x * 5;
    }
    return (120 - x) * 5;
  }

  scaleY(y: number, home: boolean = true) {
    if (home) {
      return y * 5;
    }
    return (80 - y) * 5;
  }

  success(event: any) {
    if (['Dispossessed', 'Foul Committed', 'Error'].includes(event.event_name))
      return false;
    return [
      null,
      'Success',
      'Complete',
      'Success to team',
      'Success in Play',
      'Goal',
      'Won',
    ].includes(event.event_outcome);
  }
}
