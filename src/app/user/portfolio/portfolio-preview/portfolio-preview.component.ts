import {
  Component,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
} from "@angular/core";

@Component({
  selector: "app-user-portfolio-preview",
  templateUrl: "./portfolio-preview.component.html",
  styleUrls: ["./portfolio-preview.component.css"],
})
export class PortfolioPreviewComponent implements OnInit, OnDestroy, OnChanges {
  ngOnInit(): void {}
  ngOnDestroy(): void {}
  ngOnChanges(changes: SimpleChanges): void {}
}
