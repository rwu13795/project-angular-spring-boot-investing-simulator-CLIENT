import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { Store } from "@ngrx/store";

import { StockService } from "../stock.service";
import { FinancialStatementType } from "./financial-statements.models";

@Component({
  selector: "app-financial-statements",
  templateUrl: "./financial-statements.component.html",
  styleUrls: ["./financial-statements.component.css"],
})
export class FinancialStatementsComponent implements OnInit {
  public symbol: string = "";
  public type: FinancialStatementType = "income-statement";
  public isLargeScreen?: boolean;

  constructor(
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

  onSelectStatement(type: FinancialStatementType) {
    this.type = type;
  }

  ngOnDestroy(): void {}
}
