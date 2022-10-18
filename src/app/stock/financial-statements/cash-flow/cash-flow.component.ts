import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";

import { Response_cashFlow } from "../financial-statements.models";
import { FinancialStatementsService } from "../financial-statements.service";

@Component({
  selector: "app-cash-flow",
  templateUrl: "./cash-flow.component.html",
  styleUrls: ["./cash-flow.component.css"],
})
export class CashFlowComponent implements OnInit, OnDestroy {
  @Input() symbol: string = "";
  private cashFlow$?: Subscription;
  public cashFlow: Response_cashFlow[] = [];

  constructor(private financialStatementsService: FinancialStatementsService) {}

  ngOnInit(): void {
    this.financialStatementsService
      .getFinancialStatements<Response_cashFlow>(
        this.symbol,
        "cash-flow-statement"
      )
      .subscribe((data) => {
        this.cashFlow = data;
        for (let elem of this.cashFlow) {
          for (let [k, v] of Object.entries(elem)) {
            elem[k] = v.toLocaleString();
          }
        }
      });
  }

  ngOnDestroy(): void {
    if (this.cashFlow$) this.cashFlow$.unsubscribe();
  }
}
