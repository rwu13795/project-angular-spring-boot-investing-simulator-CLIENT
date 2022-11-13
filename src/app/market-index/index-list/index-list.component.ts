import {
  Component,
  OnInit,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  Input,
} from "@angular/core";
import { RealTimeIndex } from "../market-index-models";
import { MarketIndexService } from "../market-index.service";

@Component({
  selector: "app-index-list",
  templateUrl: "./index-list.component.html",
  styleUrls: ["./index-list.component.css"],
})
export class IndexListComponent implements OnInit, OnChanges {
  @Input() indices: RealTimeIndex[] = [];
  public targetSymbol: string = "^DJI";

  constructor(private marketIndexService: MarketIndexService) {}

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges): void {}

  onSelectIndex(symbol: string, name: string) {
    this.targetSymbol = symbol;

    this.marketIndexService.targetIndexSymbol.emit(symbol);
    this.marketIndexService.targetIndexName.emit(name);
  }

  toFixedLocale(number: number, min: number = 2, max: number = 2) {
    return this.marketIndexService.toFixedLocale(number, min, max);
  }
}
