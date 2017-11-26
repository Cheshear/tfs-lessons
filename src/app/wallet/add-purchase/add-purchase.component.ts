import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Purchase} from '../../model/purchase';

const digitRegex = /^\d*\.?\d+$/;

@Component({
  selector: 'tfs-add-purchase',
  templateUrl: './add-purchase.component.html',
  styleUrls: ['./add-purchase.component.css']
})
export class AddPurchaseComponent implements OnInit {
  form: FormGroup;
  @Output() addPurchase = new EventEmitter<Purchase>();
  private _purchase: Purchase;
  @Input()
  set purchase(purch: Purchase) {
    let date ;
    if (purch.date) {
      date = new Date(purch.date);
    } else {date = new Date();
    }
    this.form.setValue({
      title: purch.title,
      price: purch.price,
      date: date.toISOString().slice(0, 10),
      comment: purch.comment
    });
    this._purchase = this.form.value;
  }

  get purchase(): Purchase { return this._purchase; }


  constructor(private formBuilder: FormBuilder) {
  }

  getErrors(errors: any): string {
    if (errors['required']) {
      return 'поле обязательно для заполнения';
    }

    if (errors['min']) {
      return `минимальное значение ${errors['min']['min']}`;
    }

    if (errors['max']) {
      return `максимальное значение ${errors['max']['max']}`;
    }

    if (errors['minlength']) {
      return `минимальная длина — ${errors['minlength']['requiredLength']}`;
    }

    if (errors['maxlength']) {
      return `максимальная длина — ${errors['maxlength']['requiredLength']}`;
    }

    if (errors['pattern'] && errors['pattern']['requiredPattern'] === digitRegex.toString()) {
      return `разрешены лишь цифры`;
    }
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(80)]],
      price: ['', [Validators.required, Validators.min(10), Validators.max(1000000), Validators.pattern(digitRegex)]],
      date: [''],
      comment: ['']
    });
  }
  onSubmit() {
    const price = parseFloat(this.form.value.price);
    if (!isFinite(price) || this.form.invalid) {
      return;
    }

    const date = this.form.value.date
      ? new Date(this.form.value.date)
      : new Date();

    const purchase: Purchase = {
      title: this.form.value.title,
      price: Math.floor(price * 100) / 100,
      date: date.toISOString()
    };

    if (this.form.value.comment) {
      purchase.comment = this.form.value.comment;
    }

    this.addPurchase.emit(purchase);
  }

}
