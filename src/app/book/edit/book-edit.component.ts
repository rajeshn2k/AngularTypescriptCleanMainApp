import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Book } from '../../common/model/book';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PageAction } from '../../common/constant/page-action';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BookApiService } from '../service/book-api.service';

@Component({
  selector: 'app-book-edit',
  templateUrl: './book-edit.component.html',
  styleUrl: './book-edit.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class BookEditComponent
  implements OnInit, OnDestroy
{
  private getBookByBookIdSubscription!: Subscription;
  private editBookSubscription!: Subscription;
  private addBookSubscription!: Subscription;
  private deleteBookSubscription!: Subscription;
  action!: string;
  pageError: string = '';
  editBookForm!: FormGroup;
  bookId!: number;
  selectedBook!: Book;
  pageStatus: string = PageAction.None;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookApiService,
    private editBookFormBuilder: FormBuilder
  ) {
    this.bookService = bookService;
  }

  initiateEditBookForm(book: Book) {
    this.editBookForm = this.editBookFormBuilder.group({
      bookNameField: [book.bookName, Validators.required],
      bookCategoryField: [book.bookCategory, Validators.required],
      editionField: [book.edition, Validators.required],
      priceField: [book.price, Validators.required],
      imageField: [book.image, Validators.required],
    });
  }

  isFormEdited(): boolean {
    return Object.values(this.editBookForm.controls).some(
      (control) => control.dirty
    );
  }

  canDeactivate(): boolean {
    let hasUnsavedChanges = this.isFormEdited();
    if (this.pageStatus !== PageAction.CompleteAction) {
      if (hasUnsavedChanges) {
        return confirm(
          'You have unsaved changes. Do you really want to leave?'
        );
      }
    }
    return true;
  }

  getBookByBookId(bookid: number): void {
    this.getBookByBookIdSubscription = this.bookService
      .GetBookByBookId(bookid)
      .subscribe({
        next: (book) => {
          this.selectedBook = book;
          this.initiateEditBookForm(this.selectedBook);
        },
        error: (e) => console.error(e),
        complete: () => console.info('complete'),
      });
  }

  saveBook(): void {
    if (this.editBookForm.valid) {
      
      this.selectedBook.bookCategory =
        this.editBookForm.get('bookCategoryField')?.value;
      this.selectedBook.bookName =
        this.editBookForm.get('bookNameField')?.value;
      this.selectedBook.edition = this.editBookForm.get('editionField')?.value;
      this.selectedBook.image = this.editBookForm.get('imageField')?.value;
      this.selectedBook.price = Number(
        this.editBookForm.get('priceField')?.value
      );

      if (this.action == PageAction.EditAction) {
        this.editBook();
      }

      if (this.action == PageAction.AddAction) {
        this.addBook();
      }
    } else {
      this.pageError = 'SET ALL REQUIRED FIELDS WITH CORRECT VALUE';
    }
  }

  addBook(): void {
    this.addBookSubscription = this.bookService
      .AddBook(this.selectedBook)
      .subscribe({
        next: (value) => {
          console.log(value);
          //this.pageStatus = PageAction.CompleteAction;
        },
        error: (e) => console.error(e),
        complete: () => {
          this.routeBack(PageAction.AddAction, PageAction.CompleteAction);
        },
      });
  }

  editBook(): void {
    this.editBookSubscription = this.bookService
      .EditBook(this.selectedBook, this.bookId)
      .subscribe({
        next: (value) => {
          console.log(value);
          //this.pageStatus = PageAction.CompleteAction;
        },
        error: (e) => console.error(e),
        complete: () => {
          this.routeBack(PageAction.EditAction, PageAction.CompleteAction);
        },
      });
  }

  deleteBook(): void {
    this.deleteBookSubscription = this.bookService
      .DeleteBook(this.bookId)
      .subscribe({
        next: (value) => {
          console.log(value);
          //this.pageStatus = PageAction.CompleteAction;
        },
        error: (e) => console.error(e),
        complete: () => {
          this.routeBack(PageAction.DeleteAction, PageAction.CompleteAction);
        },
      });
  }

  cancel(): void {
    this.routeBack(PageAction.CancelAction, PageAction.None);
  }

  routeBack(action: string, state: string): void {
    this.pageStatus = state;

    this.router.navigate(['/book'], {
      queryParams: {
        action: action,
        state: state,
        id: this.bookId,
      },
    });
  }

  ngOnInit() {
    this.bookId = this.route.snapshot.params['id'];

    if (this.bookId) {
      this.getBookByBookId(this.bookId);
      this.action = PageAction.EditAction;
    } else {
      this.action = PageAction.AddAction;
      this.selectedBook = {
        id: null,
        bookCategory: '',
        bookName: '',
        edition: '',
        image: '',
        price: 0,
        personId: '0',
        authorName: '',
        dateCreated: new Date(2024, 11, 11),
      };

      this.initiateEditBookForm(this.selectedBook);
    }
  }

  ngOnDestroy() {
    this.getBookByBookIdSubscription?.unsubscribe();
    this.deleteBookSubscription?.unsubscribe();
    this.editBookSubscription?.unsubscribe();
    this.addBookSubscription?.unsubscribe();
  }
}
