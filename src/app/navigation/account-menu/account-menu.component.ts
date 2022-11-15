import { Component, ViewEncapsulation } from "@angular/core";

@Component({
  selector: "app-account-menu",
  templateUrl: "./account-menu.component.html",
  styleUrls: ["./account-menu.component.css"],

  encapsulation: ViewEncapsulation.None,
})
export class AccountMenuComponent {}

// Disable the component encapsulation in order to select and add style to
// the material UI.

// -------- Note -----------
// only use "ViewEncapsulation.None" on a specific small component,
// the styles defined inside this component.css will affect
// all other components in the app!!!
