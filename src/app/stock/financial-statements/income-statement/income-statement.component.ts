import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-income-statement",
  templateUrl: "./income-statement.component.html",
  styleUrls: ["./income-statement.component.css"],
})
export class IncomeStatementComponent implements OnInit {
  @Input() incomeStatements: any[] = [];

  constructor() {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}
}
