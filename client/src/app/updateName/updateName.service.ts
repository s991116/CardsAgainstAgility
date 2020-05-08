import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { debounceTime, distinctUntilChanged, filter } from "rxjs/operators";

@Injectable()
export class UpdateNameService {
  constructor(private http: HttpClient) {}

  updateName(sessionId: string, userId: string, terms: Observable<string>): void {
    terms
      .pipe(
        debounceTime(800),
        filter(x => x.length > 0),
        distinctUntilChanged()
      )
      .subscribe(term => {
        this.http.post("/updateName", {id: sessionId, userId: userId, userName: term}).subscribe(
          (val: any) => {},
          response => {
            console.log("POST call in error", response);
          },
          () => {}
        );
      });
  }
}
