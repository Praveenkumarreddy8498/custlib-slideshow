import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, interval, switchMap, takeUntil, map, repeat } from 'rxjs';
type ImageItem = {
  id: string;
  url: string;
  width: number;
  height: number;
};
@Component({
  selector: 'lib-slideshow-lib',
  template: `
    <button (click)="onStart()">Start</button>
    <button (click)="onEnd()">Stop</button>

    <div>
      <img [src]="imgUrl" height="100" />
    </div>
  `,
  styles: [],
})
export class SlideshowLibComponent implements OnInit {
  start$ = new Subject<void>();
  stop$ = new Subject<void>();

  @Input()
  imgUrl = '';

  constructor(private http: HttpClient) {}

  getImage() {
    return this.http.get<ImageItem[]>(
      'https://api.thecatapi.com/v1/images/search'
    );
  }

  onStart() {
    this.start$.next();
  }

  onEnd() {
    this.stop$.next();
  }

  ngOnInit() {
    this.start$
      .pipe(
        switchMap(() => interval(2000)),
        switchMap(() => this.getImage()),
        map((response: ImageItem[]) => response[0].url),
        takeUntil(this.stop$),
        repeat()
      )
      .subscribe((url) => {
        this.imgUrl = url;
        // this.count = val;
      });
  }
}
