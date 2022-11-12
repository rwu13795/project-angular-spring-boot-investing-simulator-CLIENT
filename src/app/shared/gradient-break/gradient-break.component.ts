import {
  Component,
  OnInit,
  OnChanges,
  SimpleChanges,
  Input,
  ViewChild,
  ElementRef,
} from "@angular/core";

@Component({
  selector: "app-gradient-break",
  templateUrl: "./gradient-break.component.html",
  styleUrls: ["./gradient-break.component.css"],
})
export class GradientBreakComponent implements OnInit, OnChanges {
  @Input() type: number = 1;
  @Input() width: "50%" | "75%" | "100%" = "100%";
  @Input() height: number = 1;
  @Input() marginBottom: number = 1;
  @ViewChild("breakLine", { static: true })
  breakLineRef?: ElementRef<HTMLDivElement>;

  public className: string = "";

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    const breakLine = this.breakLineRef?.nativeElement;
    if (breakLine) {
      breakLine.style.height = `${this.height}px`;
      breakLine.style.marginBottom = `${this.marginBottom}px`;
    }
    if (this.type === 1) {
      if (this.width === "100%") {
        this.className = "gradient-break-100";
      } else if (this.width === "75%") {
        this.className = "gradient-break-75";
      } else {
        this.className = "gradient-break-50";
      }
    } else {
      this.className = "gradient-middle";
    }
  }
}
