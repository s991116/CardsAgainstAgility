import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import * as io from "socket.io-client";
import { HttpClient } from "@angular/common/http";
import { Session, GameState, User } from "./../model/";
import { FellowPlayerViewModel } from "../viewModel";
import { ClipboardService } from "ngx-clipboard";
import { UpdateNameService } from "../updateName/updateName.service";
import { Subject } from "rxjs";

@Component({
  selector: "app-game-session",
  templateUrl: "./game-session.component.html",
  styleUrls: ["./game-session.component.css"],
  providers: [UpdateNameService,
  ],
})
export class GameSessionComponent implements OnInit {
  sessionId: string;
  sessionName: string;
  sessionExists: boolean;
  userName: string;
  userId: string;
  session: Session;
  newRoundDisabled: boolean;
  showCardsDisabled: boolean;
  fellowPlayers: FellowPlayerViewModel[];
  updateNameTerm = new Subject<string>();
  socket = io({
    timeout: 20000,
  });

  selectedPlayingTypes = [
    {
      name: "Player",
      value: true,
    },
    {
      name: "Observer",
      value: false,
    },
  ];
  selectedPlayingType = this.selectedPlayingTypes[0];

  constructor(
    private _Activatedroute: ActivatedRoute,
    private _clipboardService: ClipboardService,
    private http: HttpClient,
    private updateNameService: UpdateNameService,
  ) {}

  newRoundForm(): void {
    this.http
      .post("/newRound", {
        id: this.sessionId,
      })
      .subscribe(
        (val: any) => {},
        (response) => {
          console.log("POST call in error", response);
        },
        () => {}
      );
  }

  showCardsForm(): void {
    this.http
      .post("/showCards", {
        id: this.sessionId,
      })
      .subscribe(
        (val: any) => {},
        (response) => {
          console.log("POST call in error", response);
        },
        () => {}
      );
  }

  onCardSelected(value: string): void {
    this.http
      .post("/vote", {
        sessionId: this.sessionId,
        userId: this.userId,
        cardValue: value,
      })
      .subscribe(
        (val: any) => {},
        (response) => {
          console.log("POST call in error", response);
        },
        () => {}
      );
  }

  onPlayerTypeSelected(value: string): void {
    let playing = this.selectedPlayingTypes[value].value;
    this.http
      .post("/changePlayerType", {
        sessionId: this.sessionId,
        userId: this.userId,
        playing: playing,
      })
      .subscribe(
        (val: any) => {},
        (response) => {
          console.log("POST call in error", response);
        },
        () => {}
      );
  }

  setButtonState(state: GameState): void {
    switch (state) {
      case "drawQuestion":
        this.newRoundDisabled = true;
        this.showCardsDisabled = false;
        break;

      case "proposeAnswer":
        this.newRoundDisabled = false;
        this.showCardsDisabled = true;
        break;
    }
  }

  copyURLToClipboard(): void {
    this._clipboardService.copyFromContent(window.location.href);
  }

  ngOnInit(): void {
    this.sessionId = this._Activatedroute.snapshot.params.id;
    this.session = new Session("", "");
    this.sessionExists = true;
    this.socket.on("connect", () => {
      this.socket.emit("sessionRoom", this.sessionId);
          this.http
            .post("/createUser", {
              sessionId: this.sessionId,
              socketId: this.socket.id,
            })
            .subscribe(
              (val: User) => {
                this.userName = val.name;
                this.userId = val._id;
                this.sessionExists = true;
                //this.cardDeckService.getCardDeck(val.cardDeckName).then(c => { this.cards = c.cards});
                this.updateNameService.updateName(
                  this.sessionId,
                  this.userId,
                  this.updateNameTerm
                );              
              },
              (response) => {
                this.sessionExists = false;
              },
              () => {}
            );
      });

    this.socket.on("status", (data) => {
      this.session = data as Session;
      this.sessionName = this.session.name;
      this.UpdateViewModel(this.session);
    });
  }

  ngOnDestroy() {
    this.socket.close();
  }

  UpdateViewModel(session: Session) {
    this.setButtonState(session.state);
    this.fellowPlayers = [];
    session.users.forEach((user) => {
      if (user._id !== this.userId) {
        let cardText = this.getCardText(user, session, true);
       } else {
        let cardText = this.getCardText(user, session, false);
        this.fellowPlayers.unshift(
          new FellowPlayerViewModel(user.name, user.played, cardText)
        );
        if (user.isPlaying) {
          this.selectedPlayingType = this.selectedPlayingTypes[0];
        } else {
          this.selectedPlayingType = this.selectedPlayingTypes[1];
        }
      }
    });
  }

  private getCardText(user: User, session: Session, opponent: boolean): string {
    var cardIndex = Math.max(1, user.cardIndex);
    let cardText: string;
    if (!user.isPlaying) {
      return "Observer";
    }
    if (opponent) {
      if (session.state == "drawQuestion") {
        if (user.played) cardText = "Played Card";
        else cardText = "?";
      }
      if (session.state == "proposeAnswer") {
        if (user.played) {
          cardText = "Test Result";
        } else cardText = "No Card Played";
      }
    } else {
      if (user.played) {
        cardText = "Test2";
      } else {
        if (session.state == "drawQuestion") cardText = "Select Card";
        else cardText = "No Card Played";
      }
    }
    return cardText;
  }
}
