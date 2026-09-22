import { Component, OnDestroy, OnInit } from '@angular/core';
import { Book } from '../../common/model/book';
import { Subscription } from 'rxjs';
import { BookApiService } from '../service/book-api.service';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.scss',
})
export class BookListComponent implements OnInit, OnDestroy {
  public books: Book[] = [];
  private getBookSubscription!: Subscription;
  private message: string = '';

  constructor(private bookService: BookApiService) {}

  searchRequestHandle(message: string) {
    this.message = message;
  }

  getBooks(): void {
    this.getBookSubscription = this.bookService.GetBooks().subscribe({
      next: (books) => {
        this.books = books;
      },
      error: (e) => console.error(e),
      complete: () => console.info('complete'),
    });
  }

  ngOnInit() {
    this.getBooks();
  }

  ngOnDestroy() {
    this.getBookSubscription?.unsubscribe();
  }
}
