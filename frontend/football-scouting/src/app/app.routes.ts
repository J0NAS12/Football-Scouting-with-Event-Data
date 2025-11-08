import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { PlayerStatsComponent } from '../player-stats/player-stats.component';
import { MatchStatsComponent } from '../match-stats/match-stats.component';
import { NgModule } from '@angular/core';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'player', component: PlayerStatsComponent },
  { path: 'match', component: MatchStatsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
