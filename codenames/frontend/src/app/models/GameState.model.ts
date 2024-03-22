export interface GameState {
    gameWords: GameWord[];
    isRedTurn: boolean;
    blueScore: number;
    redScore: number;
    redWin: boolean;
    blueWin: boolean;
}

export interface GameWord {
    word: string;
    color: string;
    clicked: boolean;
}