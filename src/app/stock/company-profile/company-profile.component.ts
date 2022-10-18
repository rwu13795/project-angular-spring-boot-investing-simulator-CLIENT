import { Component, Input, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { selectCompanyProfile } from "../stock-state/stock.selectors";

@Component({
  selector: "app-company-profile",
  templateUrl: "./company-profile.component.html",
  styleUrls: ["./company-profile.component.css"],
})
export class CompanyProfileComponent implements OnInit {
  public profile = this.store.select(selectCompanyProfile);

  constructor(private store: Store) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}
}
