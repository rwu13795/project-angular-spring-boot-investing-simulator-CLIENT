import {
  Component,
  OnInit,
  OnChanges,
  SimpleChanges,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from "@angular/core";

@Component({
  selector: "app-custom-button",
  templateUrl: "./custom-button.component.html",
  styleUrls: ["./custom-button.component.css"],
})
export class CustomButtonComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild("wrapperRef") wrapperRef?: ElementRef<HTMLDivElement>;
  @ViewChild("frontRef") frontRef?: ElementRef<HTMLDivElement>;

  @Input() type: "button" | "submit" = "button";
  @Input() color: "blue" | "orange" | "red" | "green" = "blue";
  @Input() bold: boolean = false;
  @Input() isActive: boolean = false;
  @Input() fontSize: number = 12;
  @Input() marginTop: number = 0;
  @Input() marginBottom: number = 0;
  @Input() width: number = 30;
  @Input() height: number = 20;
  @Input() callbackArg: any;
  @Input() text: string = "";
  @Input() disabled: boolean = false;

  @Output() onClick = new EventEmitter<any>();

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.updateSize();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateSize();
  }

  onClickButton(event: any) {
    this.onClick.emit(this.callbackArg);
  }

  private updateSize() {
    const wrapper = this.wrapperRef?.nativeElement;
    const front = this.frontRef?.nativeElement;
    if (wrapper && front) {
      if (this.bold) wrapper.style.fontWeight = "bold";
      wrapper.style.fontSize = `${this.fontSize}px`;
      wrapper.style.width = `${this.width}px`;
      wrapper.style.height = `${this.height}px`;
      wrapper.style.marginTop = `${this.marginTop}px`;
      wrapper.style.marginBottom = `${this.marginBottom}px`;

      switch (this.color) {
        case "blue":
          break;
        case "orange":
          front.classList.add("orange");
          break;
        case "red":
          front.classList.add("red");
          break;
        case "green":
          front.classList.add("green");
          break;
      }
    }
  }
}
