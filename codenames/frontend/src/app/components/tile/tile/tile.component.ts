import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tile',
  standalone: true,
  imports: [],
  templateUrl: './tile.component.html',
  styleUrl: './tile.component.scss'
})
export class TileComponent {

  @Input() public word: string = '';
  @Input() public color: string = '';
  @Input() public clicked: boolean = false;
  @Input() public isPlayer: boolean = false;

  public styleText: string = '';

  constructor() { }

  ngOnInit(): void {
    if(this.color === 'red') {
      this.styleText = 'red-text';
    }
    else if(this.color === 'blue') {
      this.styleText = 'blue-text';
    }
    else if(this.color === 'black') {
      this.styleText = 'black-text';
    }
    else if(this.color === 'neutral') {
      this.styleText = 'neutral-text';
    }
  }
}
