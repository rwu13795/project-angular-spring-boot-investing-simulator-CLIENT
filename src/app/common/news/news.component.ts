import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { Response_news } from "./news.models";
import { NewsService } from "./news.service";

@Component({
  selector: "app-news",
  templateUrl: "./news.component.html",
  styleUrls: ["./news.component.css"],
})
export class NewsComponent implements OnInit, OnDestroy {
  @Input() symbol: string = "";
  private news$?: Subscription;
  public news: Response_news[] = [];

  constructor(private newsService: NewsService) {}

  ngOnInit(): void {
    this.news$ = this.newsService
      .fetchNews(this.symbol)
      .subscribe((data) => (this.news = data));
  }

  ngOnDestroy(): void {
    if (this.news$) this.news$.unsubscribe();
  }
}
