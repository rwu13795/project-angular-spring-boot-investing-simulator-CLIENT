import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NewsModule } from "src/app/news/news.module";
import { PreviewListModule } from "src/app/preview-list/preview-list.module";
import { SharedModule } from "src/app/shared/shared.module";
import { BalanceSheetComponent } from "./balance-sheet/balance-sheet.component";
import { CashFlowComponent } from "./cash-flow/cash-flow.component";
import { FinancialStatementsComponent } from "./financial-statements.component";
import { IncomeStatementComponent } from "./income-statement/income-statement.component";

@NgModule({
  declarations: [
    FinancialStatementsComponent,
    IncomeStatementComponent,
    BalanceSheetComponent,
    CashFlowComponent,
  ],
  imports: [CommonModule, SharedModule, NewsModule, PreviewListModule],
})
export class FinancialStatementsModule {}
