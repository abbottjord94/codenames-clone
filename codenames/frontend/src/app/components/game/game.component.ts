import { Component, OnInit } from '@angular/core';
import { TileComponent } from '../tile/tile/tile.component';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button/button.component';
import { GameService } from '../../services/game.service';
import { SocketModule } from '../../app.module';
import { GameState } from '../../models/GameState.model';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [TileComponent, 
    CommonModule, 
    ButtonComponent,
    SocketModule
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent implements OnInit {

  public isPlayer: boolean = true;

  public wordList: string[] = [];

  public gameState: GameState;

  constructor(private gameService: GameService) {
    this.gameState = {gameWords: [],  isRedTurn: false, blueScore: 0, redScore: 0, redWin: false, blueWin: false};
  }

  ngOnInit(): void {
    this.getLatestGameState();
  }

  public handleNextPlayer() {
    this.gameService.sendNextPlayer().subscribe((data: GameState) => {
      this.gameState = data;
    });
  }

  public handleSpymaster() {
    this.isPlayer = !this.isPlayer;
  }

  public handleClick(index: number) {
    if(this.isPlayer && !this.gameState.gameWords[index].clicked && !this.gameState.redWin && !this.gameState.blueWin) {
      this.gameService.sendClick(index).subscribe((data: GameState) => {
        this.gameState = data;
      });
    }
  }

  public getLatestGameState() {
    this.gameService.sendGameState().subscribe((data: GameState) => {
      this.gameState = data;
    });
  }
}
