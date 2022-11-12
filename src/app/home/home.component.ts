import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import { Component, Input, OnDestroy, OnInit } from "@angular/core";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit, OnDestroy {
  public isLargeScreen: boolean = true;

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit(): void {
    // use Angular material CDK to observe the current window width
    this.breakpointObserver
      .observe(["(min-width: 1200px)"])
      .subscribe((state: BreakpointState) => {
        if (state.matches) this.isLargeScreen = true;
        else this.isLargeScreen = false;
      });
  }

  ngOnDestroy(): void {}
}
