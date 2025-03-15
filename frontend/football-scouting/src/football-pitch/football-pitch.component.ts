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
    player_positions: any[];
    player_name: string;
    player_id: number;
    x: number;
    y: number;
  };

  constructor() {}

  ngOnInit(): void {
    console.log(typeof this.event);
  }

  initPositions() {
    setTimeout(() => {
      if (!!this.event) {
        this.event.player_positions.forEach((player) => {
          let d = document.getElementById(`${player.player_id}`);
          if (!!d) {
            d.style.left = (player.x * 600) / 120 + 'px';
            d.style.top = player.y * 5 + 'px';
            if (!player.teammate) {
              d.style.backgroundColor = 'red';
            }
          }
        });
        let ball = document.getElementById(`${this.event.player_id}`);
        if (!!ball) {
          ball.style.left = -5 + this.event.x * 5 + 'px';
          ball.style.top = -5 + this.event.y * 5 + 'px';
          ball.style.backgroundColor = 'lightblue';
        }
      }
    }, 0);
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    this.ngOnInit();
    this.initPositions();
  }
}
