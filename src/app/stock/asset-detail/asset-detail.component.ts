import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/ngrx-store/app.reducer";
import { StockMenu } from "../stock-models";
import { setStockActiveMenu } from "../stock-state/stock.actions";

@Component({
  selector: "app-asset-detail",
  templateUrl: "./asset-detail.component.html",
  styleUrls: ["./asset-detail.component.css"],
})
export class AssetDetailComponent implements OnInit {
  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.store.dispatch(setStockActiveMenu({ menu: StockMenu.asset }));
  }
}
