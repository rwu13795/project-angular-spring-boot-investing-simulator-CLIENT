import { Component, ViewEncapsulation } from "@angular/core";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/ngrx-store/app.reducer";
import { LoadingStatus_user } from "src/app/user/user-models";
import {
  setLoadingStatus_user,
  signOut,
} from "src/app/user/user-state/user.actions";

@Component({
  selector: "app-account-menu",
  templateUrl: "./account-menu.component.html",
  styleUrls: ["./account-menu.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class AccountMenuComponent {
  constructor(private store: Store<AppState>) {}

  signOut() {
    this.store.dispatch(
      setLoadingStatus_user({ status: LoadingStatus_user.loading_auth })
    );
    this.store.dispatch(signOut());
  }
}

// Disable the component encapsulation in order to select and add style to
// the material UI.

// -------- Note -----------
// only use "ViewEncapsulation.None" on a specific small component,
// the styles defined inside this component.css will affect
// all other components in the app!!!
// I have to make these class names unqiue, otherwise the other components
// might be messed up by the same css class
