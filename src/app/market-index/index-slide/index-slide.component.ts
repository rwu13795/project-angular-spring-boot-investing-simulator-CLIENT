import { Component, ElementRef, Input, ViewChild } from "@angular/core";
import { Router } from "@angular/router";

import { RealTimeIndex } from "../market-index-models";
import { MarketIndexService } from "../market-index.service";

@Component({
  selector: "app-index-slide",
  templateUrl: "./index-slide.component.html",
  styleUrls: ["./index-slide.component.css"],
})
export class IndexSlideComponent {
  @ViewChild("slideRef") slideRef?: ElementRef<HTMLDivElement>;
  @Input() indices: RealTimeIndex[] = [];
  @Input() isPreview: boolean = true;
  @Input() targetIndexSymbol: string = "^DJI";

  constructor(
    private marketIndexService: MarketIndexService,
    private router: Router
  ) {}

  scrollHorizontally(direction: string) {
    const slide = this.slideRef?.nativeElement;
    if (!slide) return;

    if (direction === "left") {
      slide.scrollTo({
        left: slide.scrollLeft + -300,
        behavior: "smooth",
      });
    } else {
      slide.scrollTo({
        left: slide.scrollLeft + 300,
        behavior: "smooth",
      });
    }
  }

  onSelectIndex(symbol: string, name: string) {
    this.targetIndexSymbol = symbol;
    this.marketIndexService.targetIndexSymbol.emit(symbol);
    this.marketIndexService.targetIndexName.emit(name);

    if (!this.isPreview) {
      this.router.navigate(["/market-index", symbol]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  toFixedLocale(number: number, min: number = 2, max: number = 2) {
    return this.marketIndexService.toFixedLocale(number, min, max);
  }
}
