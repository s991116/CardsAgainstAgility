import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
@Component({
  selector: "app-create-session",
  templateUrl: "./create-session.component.html",
  styleUrls: ["./create-session.component.css"],
})
export class CreateSessionComponent {
  constructor(
    private http: HttpClient, 
    private router: Router,
    ) {}
    ngOnInit() {
    }

  submitForm(frmElement) {
    this.http.post("/createSession", frmElement.form.value).subscribe(
      (val: any) => {
        let sessionURL = "session/" + val.sessionId;
        this.router.navigate([sessionURL]);
      },
      (response) => {
        console.log("POST call in error", response);
      },
      () => {}
    );
  }
}
