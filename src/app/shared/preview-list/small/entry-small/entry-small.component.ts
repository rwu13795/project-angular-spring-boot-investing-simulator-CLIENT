import { Component, Input, OnInit } from "@angular/core";
import { Response_realTimePrice } from "src/app/stock/stock-models";
import { Response_stockList } from "../../preview-list-models";
import { entryAnimation } from "./entry-small.animation";

@Component({
  selector: "app-preview-list-small-entry",
  templateUrl: "./entry-small.component.html",
  styleUrls: ["./entry-small.component.css"],
  animations: [entryAnimation],
})
export class PreviewSmallEntryComponent implements OnInit {
  @Input() entry?: Response_realTimePrice | Response_stockList;

  ngOnInit(): void {}

  toFixed_2(number: number) {
    return number.toFixed(2);
  }
}
