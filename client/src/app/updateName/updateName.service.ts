import { Inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { debounceTime, distinctUntilChanged, filter } from "rxjs/operators";
import { SESSION_STORAGE, StorageService } from "ngx-webstorage-service";
import { User } from '../model';

@Injectable()
export class UpdateNameService {
  constructor(private http: HttpClient, @Inject(SESSION_STORAGE) private storage: StorageService) {}


  
  updateName(sessionId: string, userId: string, terms: Observable<string>): void {
    terms
      .pipe(
        debounceTime(800),
        filter(x => x.length > 0),
        distinctUntilChanged()
      )
      .subscribe(term => {
        this.http.post("/updateName", {id: sessionId, userId: userId, userName: term}).subscribe(
          (val: any) => {
            let sessionUser = this.storage.get("SessionUser") as User;
            sessionUser.name = term;
            this.storage.set("SessionUser", sessionUser);
          },
          response => {
            console.log("POST call in error", response);
          },
          () => {}
        );
      });
  }
}
