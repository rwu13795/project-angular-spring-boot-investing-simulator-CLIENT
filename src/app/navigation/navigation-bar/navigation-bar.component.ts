import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import { Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";

@Component({
  selector: "app-navigation-bar",
  templateUrl: "./navigation-bar.component.html",
  styleUrls: ["./navigation-bar.component.css"],
  // encapsulation: ViewEncapsulation.None,
})
export class NavigationBarComponent implements OnInit {
  public isSmallScreen: boolean = false;

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit(): void {
    this.breakpointObserver
      .observe(["(max-width: 600px)"])
      .subscribe((state: BreakpointState) => {
        if (state.matches) this.isSmallScreen = true;
        else this.isSmallScreen = false;
      });
  }
}
