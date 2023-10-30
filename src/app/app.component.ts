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

  list_contents: any[] = []

  constructor(private http: ApiService) { }

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
      this.list_contents = mappedData.sort((a:any,b:any) => a.id - b.id);
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
    });
  }

  deleteCard(index: number, id: number): void {
    this.list_contents.splice(index, 1);
    this.http.deleteCard(id).subscribe((res: any) => { })
  }

  deleteRow(index: number, rowIndex: number, id: number): void {
    this.list_contents[index].answers.splice(rowIndex, 1);
    this.http.patchNewData(this.list_contents[index], id).subscribe((res: any) => { })
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
