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
      this.list_contents = mappedData;
    })
  }

  pushEmptyOptionData(): void {
    const newOption = {
      question: "untitled",
      type: "options",
      edit_question: false,
      answers: []
    };

    this.list_contents.push(newOption);
    this.http.sendNewBlockData(newOption).subscribe((res: any) => {
      this.fetchServerData()
    })
  }

  pushEmptyTextData(): void {
    const newText = {
      question: "untitled",
      type: "text",
      edit_question: false,
      answers: []
    };

    this.list_contents.push(newText);
    this.http.sendNewBlockData(newText).subscribe((res: any) => { })
  }

  pushExtraOptionsAnswer(index: number, id: number): void {
    this.list_contents[index].answers.push({
      code: "untitled",
      answer: "untitled",
      edit_answer: false
    });
    this.http.patchNewData(this.list_contents[index], id).subscribe((res: any) => {
      this.disableInputFiels();
      this.list_contents[index].answers[this.list_contents[index].answers.length - 1].edit_answer = true;
    });
  }

  pushExtraTextAnswer(index: number, id: number): void {
    this.list_contents[index].answers.push({
      answer: "untitled",
      edit_answer: false
    });
    this.http.patchNewData(this.list_contents[index], id).subscribe((res: any) => {
      this.disableInputFiels();
      this.list_contents[index].answers[this.list_contents[index].answers.length - 1].edit_answer = true;
    });
  }

  deleteCard(index: number, id: number) {
    this.list_contents.splice(index, 1);
    this.http.deleteCard(id).subscribe((res: any) => { })
  }

  deleteRow(index: number, rowIndex: number, id: number) {
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

  updateInputData(index: number, id: number) {
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
