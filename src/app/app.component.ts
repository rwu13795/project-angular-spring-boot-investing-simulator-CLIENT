import { Component, OnDestroy, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";

import { AppState } from "./ngrx-store/app.reducer";
import { LoadingStatus_user } from "./user/user-models";
import {
  fetchPortfolio,
  getUserInfo,
  setLoadingStatus_user,
} from "./user/user-state/user.actions";
import { selectHasAuth } from "./user/user-state/user.selectors";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit, OnDestroy {
  private hasAuth$?: Subscription;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.store.dispatch(getUserInfo());

    this.hasAuth$ = this.store.select(selectHasAuth).subscribe((hasAuth) => {
      if (hasAuth) {
        this.store.dispatch(
          setLoadingStatus_user({
            status: LoadingStatus_user.loading_portfolio,
          })
        );
        this.store.dispatch(fetchPortfolio());
      }
    });
  }

  ngOnDestroy(): void {
    this.hasAuth$ && this.hasAuth$.unsubscribe();
  }
}
