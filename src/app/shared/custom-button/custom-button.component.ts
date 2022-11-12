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

  @Input() isActive: boolean = false;
  @Input() fontSize: number = 12;
  @Input() marginTop: number = 0;
  @Input() marginBottom: number = 0;
  @Input() width: number = 30;
  @Input() height: number = 20;
  @Input() callbackArg: any;
  @Input() text: string = "";

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
    if (wrapper) {
      wrapper.style.fontSize = `${this.fontSize}px`;
      wrapper.style.width = `${this.width}px`;
      wrapper.style.height = `${this.height}px`;
      wrapper.style.marginTop = `${this.marginTop}px`;
      wrapper.style.marginBottom = `${this.marginBottom}px`;
    }
  }
}
