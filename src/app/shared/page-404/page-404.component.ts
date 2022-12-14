import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-page-404",
  templateUrl: "./page-404.component.html",
  styleUrls: ["./page-404.component.css"],
})
export class Page404Component implements OnInit {
  public symbol: string = "";

  constructor(private router: Router) {}

  ngOnInit(): void {
    const urlArray = this.router.url.split("/");
    if (urlArray[2] === "stock") {
      this.symbol = urlArray[3];
    }
  }
}
