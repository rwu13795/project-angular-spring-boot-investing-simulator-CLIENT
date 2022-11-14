import {
  AfterContentChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  DoCheck,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from "@angular/core";

@Component({
  selector: "app-digit-cylinder",
  templateUrl: "./digit-cylinder.component.html",
  styleUrls: ["./digit-cylinder.component.css"],
})
export class DigitCylinderComponent
  implements OnInit, OnChanges, AfterViewInit
{
  @ViewChild("containerRef") containerRef?: ElementRef<HTMLDivElement>;

  @Input() bold: boolean = false;
  @Input() fontSize: number = 32;
  @Input() currentDigit: string = "0";
  @Input() previousDigit: string = "0";
  @Input() timeRange: string | null = "1D";
  // the "selector" "cylinder" can be the same for all the children
  // all of the children DigitCylinderComponent are seperate instances
  @ViewChild("cylinder") cylinder?: ElementRef<HTMLDivElement>;

  public showCylinder: boolean = true;

  ngOnInit(): void {
    const regex = new RegExp("^[0-9]$");
    this.showCylinder = regex.test(this.currentDigit);
  }

  ngOnChanges(changes: SimpleChanges) {
    // The @Input() variable will be updated when new input is passed into
    // this component
    // In Angular, if I need to manipulate the DOM, I have to do it in the
    // "ngAfterViewInit". The elements will be available ONLY after the views
    // are fully rendered.

    // ----- (2) ----- //
    if (this.timeRange !== "1D") {
      this.translateCylinder(0);
    }
    this.setSize();
  }

  ngAfterViewInit(): void {
    this.setSize();
    this.translateCylinder(+this.previousDigit);
  }

  private translateCylinder(preivousDigit: number) {
    const cylinder = this.cylinder?.nativeElement;

    // ----- (1) ----- //
    if (cylinder) {
      cylinder.classList.remove("cylinder");

      const distance = cylinder.offsetHeight / 10;
      cylinder.style.transform = `translateY(${
        distance * (this.timeRange === "1D" ? preivousDigit : 0)
      }px)`;

      setTimeout(() => {
        cylinder.classList.add("cylinder");

        cylinder.style.transform = `translateY(${
          distance * +this.currentDigit
        }px)`;
      }, 200);
    }
  }

  private setSize() {
    const container = this.containerRef?.nativeElement;
    if (container) {
      container.style.fontSize = `${this.fontSize}px`;
      if (this.bold) container.style.fontWeight = "bold";
    }
  }
}

/*  

----- (1) -----
When the real-time price is updated, the digit cylinders will be 
rendered if the new digit is not the same as the previous one.
while using *ngFor, the re-rendered cylinder component somehow (don't know why)
does NOT has the previous value of the input variable.

I have to manaully save the preivous and the current price in the ngrx store
and pass them to the cylinder component. After view init, first, I need to 
"translateY" the cylinder to the previous digit position. secondly, I need to
"translateY" the cylinder to the current digit position and add the "cylinder"
class at the same time. By doing, the digit will "slide" from the previous
digit to the current one.

If I set the current digit directly without setting the previous one first,
the digit transition will always start from the "0", since there is no previous
value and the default digit value is "0". The transition will be messed up.

I also need to wait for the translation of the previous digit before I could 
translate the current digit

----- (2) -----
When I use *ngFor to map the digitCylinder, if the previous digit is the same
as the current digit, no matter what is the mapping order, the component will
NOT fully re-render!! For example, if the previous price is 25.13, the digit "5"
is at index "1", and the current price is 14.15, the digit "5" is at index "5",
in this situation, the digitCylinder component that has the digit "5" will
NOT fukking re-render even the mapping index is different!!! that means the
transition animation won't be trigger! the is "set" to "5" at the init

This behavior is fit for the real-time price update, but it will make the 
transition look really ugly when user is switching between the time range 
since the transition won't be trigger on some digits cylinder.

Such change can be detected in the "ngOnChanges", BUT "simpleChanges" does
NOT reflect the changes corrrectly at all!! fortunately, I can still manaully 
set the previous digit to "0", then trigger the transition again

If both the previous digit and its index are the same as the current ones,
then even the "ngOnChanges" won't detect the change! Only the OnCheck and
ContentCheck can detect the change. But both of these hooks will cause severe
performance issues.


*/
