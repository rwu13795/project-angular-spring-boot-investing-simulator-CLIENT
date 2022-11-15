import {
  Component,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
} from "@angular/core";

@Component({
  selector: "app-user-portfolio",
  templateUrl: "./portfolio.component.html",
  styleUrls: ["./portfolio.component.css"],
})
export class PortfolioComponent implements OnInit, OnDestroy, OnChanges {
  ngOnInit(): void {}
  ngOnDestroy(): void {}
  ngOnChanges(changes: SimpleChanges): void {}
}
