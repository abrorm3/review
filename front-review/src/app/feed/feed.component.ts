import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FeedService } from './feed.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css'],
})
export class FeedComponent implements OnInit {
  constructor(private router: Router, private feedService:FeedService) {}
  opened: boolean=true;
  reviews: String[] =[];

  ngOnInit(){
      this.feedService.getReviews().subscribe((reviews) => {
        console.log(reviews)});

  }
}
