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
  @Input() width: "50%" | "75%" | "100%" = "100%";
  @Input() height: number = 1;
  @Input() marginBottom: number = 1;
  @ViewChild("breakLine", { static: true })
  breakLineRef?: ElementRef<HTMLDivElement>;

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    const breakLine = this.breakLineRef?.nativeElement;
    if (breakLine) {
      breakLine.style.height = `${this.height}px`;
      breakLine.style.marginBottom = `${this.marginBottom}px`;
    }
  }
}
