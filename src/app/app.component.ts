import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  host: {
    '(document:click)': 'onClick($event)',
  },
})
export class AppComponent implements OnInit {
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  list_contents: any[] = []

  constructor(private http: ApiService, private snackbar: MatSnackBar) { }

  ngOnInit(): void {
    this.fetchServerData();
  }

  fetchServerData(): void {
    this.http.fetchAllData().subscribe((res: any) => {
      const mappedData = res.map((ele: any) => {
        const updatedEle = { ...ele, edit_question: false };
        const updatedAnswers = ele.answers.map((ans: any) => ({ ...ans, edit_answer: false }));
        return { ...updatedEle, answers: updatedAnswers };
      });
      this.list_contents = mappedData.sort((a: any, b: any) => a.id - b.id);
    }, (error: any) => {
      this.snackbar.open('Something Went Wrong', 'dismiss', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        duration: 2500
      });
    })
  }

  pushEmptyData(type: string): void {
    const newData = {
      question: "Question",
      type: type,
      edit_question: false,
      answers: [],
    };

    this.list_contents.push(newData);
    this.http.sendNewBlockData(newData).subscribe((res: any) => {
      this.fetchServerData();
    }, (error: any) => {
      this.snackbar.open('Something Went Wrong', 'dismiss', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        duration: 2500
      });
    });
  }

  pushExtraAnswer(index: number, id: number, isOptions: boolean): void {
    const newAnswer: any = isOptions
      ? { code: "answer", answer: "answer", edit_answer: false }
      : { answer: "answer", edit_answer: false };

    this.list_contents[index].answers.push(newAnswer);

    this.http.patchNewData(this.list_contents[index], id).subscribe((res: any) => {
      this.disableInputFiels();
      this.list_contents[index].answers[this.list_contents[index].answers.length - 1].edit_answer = true;
    }, (error: any) => {
      this.snackbar.open('Something Went Wrong', 'dismiss', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        duration: 2500
      });
    });
  }

  deleteCard(index: number, id: number): void {
    this.list_contents.splice(index, 1);
    this.http.deleteCard(id).subscribe((res: any) => { }, (error: any) => {
      this.snackbar.open('Something Went Wrong', 'dismiss', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        duration: 2500
      });
    })
  }

  deleteRow(index: number, rowIndex: number, id: number): void {
    this.list_contents[index].answers.splice(rowIndex, 1);
    this.http.patchNewData(this.list_contents[index], id).subscribe((res: any) => { }, (error: any) => {
      this.snackbar.open('Something Went Wrong', 'dismiss', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        duration: 2500
      });
    })
  }

  editQuestionTitle(index: number): void {
    this.disableInputFiels();
    this.list_contents[index].edit_question = true;
  }

  editRow(topIndex: number, rowIndex: number): void {
    this.disableInputFiels();
    this.list_contents[topIndex].answers[rowIndex].edit_answer = true;
  }

  disableInputFiels(): void {
    this.list_contents.forEach((item) => {
      item.edit_question = false;

      item.answers.forEach((ele: any) => {
        ele.edit_answer = false;
      })
    });
  }

  updateInputData(index: number, id: number): void {
    this.http.patchNewData(this.list_contents[index], id).subscribe((res: any) => {
    }, (error: any) => {
      this.snackbar.open('Something Went Wrong', 'dismiss', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        duration: 2500
      });
    })
  }

  onClick(event: any): void {
    if (!event.target.classList.contains('editor-ele')) {
      this.disableInputFiels();
    }
  }

  saveFormData(): void {
    this.disableInputFiels();
    console.log(this.list_contents);
  }
}
