import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";

import { AppState } from "src/app/ngrx-store/app.reducer";
import { clearTargetStock } from "src/app/stock/stock-state/stock.actions";
import { LoadingStatus_user } from "src/app/user/user-models";
import { toggleSignInModal } from "src/app/user/user-state/user.actions";
import {
  selectHasAuth,
  selectLoadingStatus_user,
} from "src/app/user/user-state/user.selectors";

@Component({
  selector: "app-navigation-bar",
  templateUrl: "./navigation-bar.component.html",
  styleUrls: ["./navigation-bar.component.css"],
  // encapsulation: ViewEncapsulation.None,
})
export class NavigationBarComponent implements OnInit {
  public isSmallScreen: boolean = false;
  public hasAuth$ = this.store.select(selectHasAuth);
  public loadingStatus$ = this.store.select(selectLoadingStatus_user);

  constructor(
    private breakpointObserver: BreakpointObserver,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.breakpointObserver
      .observe(["(max-width: 600px)"])
      .subscribe((state: BreakpointState) => {
        if (state.matches) this.isSmallScreen = true;
        else this.isSmallScreen = false;
      });
  }

  openModal() {
    this.store.dispatch(toggleSignInModal({ open: true }));
  }

  clearStock() {
    this.store.dispatch(clearTargetStock());
  }

  get LoadingStatus() {
    return LoadingStatus_user;
  }
}
