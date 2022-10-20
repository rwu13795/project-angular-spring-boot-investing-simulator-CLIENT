import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";

@Component({
  selector: "app-market-index",
  templateUrl: "./market-index.component.html",
  styleUrls: ["./market-index.component.css"],
})
export class MarketIndexComponent implements OnInit {
  public symbol: string = "^DJI";

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      const symbol = params["symbol"];

      if (symbol && symbol !== "") {
        this.symbol = symbol.toUpperCase();
      }
    });
  }
}
