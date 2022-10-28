import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Response_realTimePrice } from "src/app/stock/stock-models";
import { Response_stockList } from "../../preview-list-models";

@Component({
  selector: "app-preview-list-small-entry",
  templateUrl: "./entry-small.component.html",
  styleUrls: ["./entry-small.component.css"],
})
export class PreviewSmallEntryComponent implements OnInit, OnDestroy {
  @Input() entry?: Response_realTimePrice | Response_stockList;

  ngOnInit(): void {}

  ngOnDestroy(): void {}
}
