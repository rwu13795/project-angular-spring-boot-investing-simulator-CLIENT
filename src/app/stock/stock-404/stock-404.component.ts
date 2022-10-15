import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-stock-404",
  templateUrl: "./stock-404.component.html",
  styleUrls: ["./stock-404.component.css"],
})
export class Stock404Component implements OnInit {
  public symbol: string = "";

  constructor(private router: Router) {}

  ngOnInit(): void {
    const urlArray = this.router.url.split("/");
    this.symbol = urlArray[3];
  }
}
