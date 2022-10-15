import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { Store } from "@ngrx/store";

import { StockService } from "../stock.service";

@Component({
  selector: "app-financial-statements",
  templateUrl: "./financial-statements.component.html",
  styleUrls: ["./financial-statements.component.css"],
})
export class FinancialStatementsComponent implements OnInit {
  public symbol: string = "";

  array = [
    {
      year: 2021,
      revenue: 365817000,
      costOfRevenue: 212981000,
      grossProfit: 152836000,
    },
    {
      year: 2020,
      revenue: 245817000,
      costOfRevenue: 112981000,
      grossProfit: 122836000,
    },
    {
      year: 2019,
      revenue: 165817000,
      costOfRevenue: 512981000,
      grossProfit: 19992836,
    },
    {
      year: 2019,
      revenue: 165817000,
      costOfRevenue: 512981000,
      grossProfit: 19992836,
    },
    {
      year: 2019,
      revenue: 165817000,
      costOfRevenue: 512981000,
      grossProfit: 19992836,
    },
    {
      year: 2019,
      revenue: 165817000,
      costOfRevenue: 512981000,
      grossProfit: 19992836,
    },
    {
      year: 2019,
      revenue: 165817000,
      costOfRevenue: 512981000,
      grossProfit: 19992836,
    },
    {
      year: 2019,
      revenue: 165817000,
      costOfRevenue: 512981000,
      grossProfit: 19992836,
    },
    {
      year: 2019,
      revenue: 165817000,
      costOfRevenue: 512981000,
      grossProfit: 19992836,
    },
    {
      year: 2019,
      revenue: 165817000,
      costOfRevenue: 512981000,
      grossProfit: 19992836,
    },
  ];

  constructor(
    private route: ActivatedRoute,
    private stockService: StockService,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.symbol = params["symbol"].toUpperCase();
    });
  }

  ngOnDestroy(): void {}
}
