import { Injectable } from '@angular/core';
import io from 'socket.io-client';
import { GameState } from '../models/GameState.model';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private socket;
  public gameState: GameState;

  constructor(private router: Router) {
    this.gameState = {gameWords: [], isRedTurn: false, blueScore: 0, redScore: 0, redWin: false, blueWin: false};
    this.socket = io('http://localhost:3000');

    this.socket.on('connect', () => {
      this.sendGameState();
    });

    this.socket.on('getListResponse', (data) => {
      this.gameState = data;
    });
   }

  public sendClick(index: number): Observable<GameState> {
    this.socket.emit('click', this.router.url, index);
    return this.sendGameState();
  }

  public sendNextPlayer(): Observable<GameState> {
    this.socket.emit('nextPlayer', this.router.url);
    return this.sendGameState();
  }

  public sendGameState(): Observable<GameState> {
    return new Observable((observer) => {
      this.socket.emit('getList', this.router.url);
      this.socket.on('getListResponse', (data: GameState) => {
        this.gameState = data;
        observer.next(this.gameState);
      });
    });
  }
}
