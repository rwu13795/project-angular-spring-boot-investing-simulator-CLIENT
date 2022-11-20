import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { Response_transaction } from "src/app/user/user-models";
import { UserService } from "src/app/user/user.service";

@Component({
  selector: "app-transactions",
  templateUrl: "./transactions.component.html",
  styleUrls: ["./transactions.component.css"],
})
export class TransactionsComponent implements OnInit {
  @Output() selectedTpye = new EventEmitter<number>();
  @Output() currentPage = new EventEmitter<number>();
  @Input() transactions: Response_transaction[] = [];
  @Input() totalCount: number = 0;

  public pageSize = 20;
  public pageIndex = 0;

  constructor(private userService: UserService) {}

  ngOnInit(): void {}

  toDate(timestamp: number) {
    return new Date(timestamp).toLocaleString().split(",");
  }

  getType(buy?: boolean, shortSell?: boolean) {
    if (buy !== undefined) {
      return buy ? "Buy" : "Sell";
    }
    if (shortSell !== undefined) {
      return shortSell ? "Sell Short" : "Buy to Cover";
    }
    return "-";
  }

  toFixed(number: number, addSymbol: boolean = true, decimal: number = 2) {
    return this.userService.toFixedLocale({ number, decimal, addSymbol });
  }

  onSelect(event: any) {
    const type = event.target.value as string;
    if (type) {
      this.selectedTpye.emit(+type);
      this.pageIndex = 0;
    }
  }

  handlePageEvent(e: PageEvent) {
    this.currentPage.emit(e.pageIndex + 1);
    this.pageIndex = e.pageIndex;
  }
}
