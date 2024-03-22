import { NgModule } from "@angular/core";
import { SocketIoModule } from "ngx-socket-io";
import { GameService } from "./services/game.service";

@NgModule({
    imports : [
        SocketIoModule.forRoot({url: 'http://localhost:3000', options: {}}),
    ],
    providers: [GameService],
})

export class SocketModule {

}