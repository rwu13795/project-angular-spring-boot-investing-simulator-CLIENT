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

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.symbol = params["symbol"].toUpperCase();
    });
  }

  onSelectStatement(type: FinancialStatementType) {
    this.type = type;
  }

  ngOnDestroy(): void {}
}
