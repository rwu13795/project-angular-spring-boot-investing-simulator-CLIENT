import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { Store } from "@ngrx/store";
import { selectCompanyProfile } from "../stock-state/stock.selectors";

@Component({
  selector: "app-company-profile",
  templateUrl: "./company-profile.component.html",
  styleUrls: ["./company-profile.component.css"],
})
export class CompanyProfileComponent implements OnInit {
  public symbol: string = "";
  public profile = this.store.select(selectCompanyProfile);
  public isLargeScreen?: boolean;

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.symbol = params["symbol"].toUpperCase();
    });

    this.breakpointObserver
      .observe(["(min-width: 1200px)"])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.isLargeScreen = true;
        } else {
          this.isLargeScreen = false;
        }
      });
  }

  ngOnDestroy(): void {}
}
