import {
  Component,
  OnInit,
  OnChanges,
  SimpleChanges,
  Input,
} from "@angular/core";
import { Response_PortfolioAsset } from "src/app/user/user-models";

@Component({
  selector: "app-unrealized-gain-loss",
  templateUrl: "./unrealized-gain-loss.component.html",
  styleUrls: ["./unrealized-gain-loss.component.css"],
})
export class UnrealizedGainLossComponent implements OnInit, OnChanges {
  @Input() asset: Response_PortfolioAsset | null = null;
  @Input() currentPrice: number = 0;
  @Input() isLargeScreen: boolean = true;

  public unrealized: number = 0;
  public previousString: string[] = ["0"];
  public currentString: string[] = ["0"];

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges): void {
    if (this.asset && this.currentPrice !== 0) {
      const { shares, sharesBorrowed, avgCost, avgBorrowed } = this.asset;
      this.unrealized =
        (this.currentPrice - avgCost) * shares +
        (avgBorrowed - this.currentPrice) * sharesBorrowed;
      this.previousString = this.currentString;
      this.currentString = this.toStringArray(this.unrealized);
    }
  }

  private toStringArray(number: number): string[] {
    let temp = number;
    if (number < 0) temp = number * -1;
    return [
      ...temp.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    ];
  }
}
