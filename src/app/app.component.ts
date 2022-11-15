import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Store } from "@ngrx/store";
import { AppState } from "./ngrx-store/app.reducer";
import { getUserInfo } from "./user/user-state/user.actions";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  constructor(private store: Store<AppState>) {}
  ngOnInit(): void {
    this.store.dispatch(getUserInfo());
  }
}
