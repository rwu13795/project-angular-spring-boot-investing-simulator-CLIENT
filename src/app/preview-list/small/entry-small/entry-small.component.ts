import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Response_realTimePrice } from "src/app/stock/stock-models";
import { Response_stockList } from "../../preview-list-models";
import { entryAnimation } from "./entry-small.animation";

@Component({
  selector: "app-preview-list-small-entry",
  templateUrl: "./entry-small.component.html",
  styleUrls: ["./entry-small.component.css"],
  animations: [entryAnimation],
})
export class PreviewSmallEntryComponent implements OnInit, OnDestroy {
  @Input() entry?: Response_realTimePrice | Response_stockList;

  ngOnInit(): void {}

  toFixedLocale(number: number, min: number = 2, max: number = 2) {
    return number.toLocaleString(undefined, {
      minimumFractionDigits: min,
      maximumFractionDigits: max,
    });
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  ngOnDestroy(): void {
    this.scrollToTop();
  }
}
