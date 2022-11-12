import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import {
  AfterViewChecked,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { Subscription } from "rxjs";
import { newsAnimation } from "./news.animation";
import { Response_news } from "./news.models";
import { NewsService } from "./news.service";

@Component({
  selector: "app-news",
  templateUrl: "./news.component.html",
  styleUrls: ["./news.component.css"],
  animations: [newsAnimation],
})
export class NewsComponent implements OnInit, OnDestroy, AfterViewChecked {
  @Input() symbol: string = "";
  // ---- (2) ---- //
  @ViewChild("last_entry") lastEntryRef!: ElementRef;

  private news$?: Subscription;
  private news: Response_news[] = [];
  private partNumber: number = 0;
  private waiting: boolean = false;
  private ENTRY_LIMIT: number = 5;
  private timerId?: any;
  // have to bind the class context with the methed in order to pass it as a callback
  private _toggleBackToTop = this.toggleBackToTop.bind(this);

  public newsToBeDisplayed: Response_news[] = [];
  public moreNews: boolean = true;
  public showBackToTop: boolean = false;

  private intersectionObserver = new IntersectionObserver(
    (entries) => {
      const { isIntersecting } = entries[0];
      if (!isIntersecting) return;

      if (this.newsToBeDisplayed.length === this.news.length) {
        this.moreNews = false;
        this.intersectionObserver.disconnect();
        return;
      }
      if (this.moreNews) {
        // unobserve the previous lastEntry
        this.intersectionObserver.unobserve(this.lastEntryRef.nativeElement);

        this.loadMoreNews();
      }
    },
    {
      rootMargin: "-50px",
    }
  );

  constructor(private newsService: NewsService) {}

  ngOnInit(): void {
    this.news$ = this.newsService.fetchNews(this.symbol).subscribe((data) => {
      this.news = data;
      // ---- (1) ----- //
      this.newsToBeDisplayed = this.news.slice(
        this.partNumber,
        this.ENTRY_LIMIT
      );
    });

    window.addEventListener("scroll", this._toggleBackToTop);
  }

  ngAfterViewChecked(): void {
    // ---- (2) ---- //
    if (this.lastEntryRef && this.moreNews) {
      this.intersectionObserver.observe(this.lastEntryRef.nativeElement);
    }
  }

  loadMoreNews() {
    // ---- (1) ----- //
    this.newsToBeDisplayed.push(
      ...this.news.slice(
        ++this.partNumber * this.ENTRY_LIMIT,
        (this.partNumber + 1) * this.ENTRY_LIMIT
      )
    );
    console.log("partNumber", this.partNumber);
  }

  toggleBackToTop() {
    if (this.waiting) return;
    this.waiting = true;
    if (window.scrollY > 1500) {
      this.showBackToTop = true;
    } else {
      this.showBackToTop = false;
    }
    // limit the minimum execution interval time
    this.timerId = setTimeout(() => {
      this.waiting = false;
    }, 500);
  }

  toDateString(date: string) {
    return new Date(date).toDateString().slice(4);
  }

  openNewWindow(url: string) {
    window.open(url);
  }

  onBackToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    this.showBackToTop = false;
  }

  ngOnDestroy(): void {
    if (this.news$) this.news$.unsubscribe();
    if (this.timerId) clearTimeout(this.timerId);
    window.removeEventListener("scroll", this._toggleBackToTop);
  }
}

/*

----(1)----
Each page of news fetched from the API consists of at least 100 entries (with a
specific symbol). The limit param is useless for pagination since it only limits 
number of the entry for the same page. If the first time I fetch 10 news, 
the next time I need to fetch 20 news which includes the previous 10 news 
that haved been fetched.

I will just fetch the page without using the limit param, and then slice the 
array and show 10 entries at a time. when all 100 news are displayed, fetch 
the next page from the server 

PS: I did not implement the "fetch next page", since 100 news are more than enough,
I don't think someone will scroll all the way down to bottom


---- (2) ---- 
In Angular component template, the "@ViewChile('ref-name')" or "@ViewChildren('ref-name')"
needs to be used in order to select the elements in the DOM. I can NOT use
the normal JS document.getElementById() to select the the element.

In this example, I use *ngIf="i === newsToBeDisplayed.length - 1" to find out
if the entry is last one (like I did in React), then I attach the #last_entry
ref to this last entry

Also, I need to use the "ngAfterViewChecked" to check if the DOM has been updated
and the lastEntryRef is available

*/
