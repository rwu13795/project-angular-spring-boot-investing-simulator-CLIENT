import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Response_transaction } from "src/app/user/user-models";
import { UserService } from "src/app/user/user.service";

@Component({
  selector: "app-transactions",
  templateUrl: "./transactions.component.html",
  styleUrls: ["./transactions.component.css"],
})
export class TransactionsComponent implements OnInit {
  @Output() selectedTpye = new EventEmitter<number>();
  @Input() transactions: Response_transaction[] = [];

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

  toFixed(number: number, decimal: number = 2) {
    return this.userService.toFixedLocale(number, false, decimal);
  }

  onSelect(event: any) {
    const type = event.target.value as string;
    if (type) this.selectedTpye.emit(+type);
  }
}
