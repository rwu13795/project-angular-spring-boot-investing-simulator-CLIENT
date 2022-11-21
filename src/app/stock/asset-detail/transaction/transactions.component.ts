import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { Subscription } from "rxjs";
import { Response_transaction } from "src/app/user/user-models";
import { UserService } from "src/app/user/user.service";
import { StockService } from "../../stock.service";

@Component({
  selector: "app-transactions",
  templateUrl: "./transactions.component.html",
  styleUrls: ["./transactions.component.css"],
})
export class TransactionsComponent implements OnInit, OnDestroy {
  @Output() selectedTpye = new EventEmitter<number>();
  @Output() currentPage = new EventEmitter<number>();
  @Input() transactions: Response_transaction[] = [];
  @Input() totalCount: number = 0;
  private newOrderFilled$?: Subscription;

  public pageSize: number = 20;
  public pageIndex: number = 0;
  public transactionType: string = "1";

  constructor(
    private userService: UserService,
    private stockService: StockService
  ) {}

  ngOnInit(): void {
    this.newOrderFilled$ = this.stockService.newOrderFilled.subscribe(
      (type) => {
        // when a new order is filled, update the transaction manually
        // by emitting the "selectedTpye" event to the asset-detail component
        // This works the same way as the user clicks the type in the selection
        let transactionType = "1";
        if (type === "short") transactionType = "2";
        this.transactionType = transactionType;
        this.selectedTpye.emit(+transactionType);
      }
    );
  }

  toDate(timestamp: number) {
    return new Date(timestamp).toLocaleString().split(",");
  }

  getType(buy?: boolean, shortSell?: boolean) {
    return this.stockService.getTransactionType(buy, shortSell);
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

  ngOnDestroy(): void {
    if (this.newOrderFilled$) this.newOrderFilled$.unsubscribe();
  }
}
