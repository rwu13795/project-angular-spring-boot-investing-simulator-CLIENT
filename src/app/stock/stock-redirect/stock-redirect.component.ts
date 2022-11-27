import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-stock-redirect",
  templateUrl: "./stock-redirect.component.html",
  styleUrls: ["./stock-redirect.component.css"],
})
export class StockRedirectComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.navigate(["/"]);
  }
}

/*
  
  This component is used to redirect the user to home page if user
  enter the url "/stock" directly. StockComponent is just used for
  initializing the children routes
  
  */
