import { Component, Input } from "@angular/core";
import { RealTimeIndex } from "../market-index-models";
import { MarketIndexService } from "../market-index.service";

@Component({
  selector: "app-index-list",
  templateUrl: "./index-list.component.html",
  styleUrls: ["./index-list.component.css"],
})
export class IndexListComponent {
  @Input() indices: RealTimeIndex[] = [];
  public targetSymbol: string = "^DJI";

  constructor(private marketIndexService: MarketIndexService) {}

  onSelectIndex(symbol: string, name: string) {
    this.targetSymbol = symbol;

    this.marketIndexService.targetIndexSymbol.emit(symbol);
    this.marketIndexService.targetIndexName.emit(name);
  }

  toFixedLocale(number: number, min: number = 2, max: number = 2) {
    return this.marketIndexService.toFixedLocale(number, min, max);
  }
}
