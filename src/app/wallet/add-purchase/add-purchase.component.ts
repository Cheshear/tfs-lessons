import {Component, EventEmitter, OnInit, Output, AfterViewChecked} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {Purchase} from '../../model/purchase';
import {error} from 'util';
import {ValidateFn} from 'codelyzer/walkerFactory/walkerFn';

@Component({
  selector: 'tfs-add-purchase',
  templateUrl: './add-purchase.component.html',
  styleUrls: ['./add-purchase.component.css']
})
export class AddPurchaseComponent implements OnInit, AfterViewChecked {
  form: FormGroup;
  @Output() addPurchase = new EventEmitter<Purchase>();
  private formErrors = {
    'title': '',
    'price': ''
  };

  private validationMessages = {
    'title': {
      'required': 'поле обязательно для заполнения',
      'minlength': 'минимальная длина — 3',
      'maxlength': 'максимальная длина — 80',
    },
    'price': {
      'required': 'поле обязательно для заполнения',
      'min': 'минимальное значение 10',
      'max': 'максимальное значение 1000000',
      'pattern': 'разрешены лишь цифры'
    },
  };

  constructor(private formBuilder: FormBuilder) {
  }
  ngOnInit() {
    this.form = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(80)]],
      price: ['', [Validators.required, Validators.min(10), Validators.max(1000000),
                    Validators.pattern('/^[+-]?\\d+(\\.\\?d+)?$/')]],
      date: [''],
      comment: ['']
    });
  }
  get title(){
    return this.form.get('title');
  }
  get price(){
    return this.form.get('price');
  }
  // forbidInfinity(): ValidatorFn {
  //   return(control: AbstractControl): {[ key: number]: any } => {
  //     const bigValue = Infinity;
  //     const forbidden = (bigValue === control.value);
  //     return forbidden ? {'forbidInfinity': {value: control.value}} : null;
  //   };
  // }

  getFormValidationErrors() {
    Object.keys(this.form.controls).forEach(key => {

      const controlErrors: ValidationErrors = this.form.get(key).errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {
          console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
        });
      }
    });
  }

  ngAfterViewChecked() {
    this.formChanged();
  }
  private formChanged() {
    if (this.form) {
      this.form.valueChanges.subscribe(data => this.onValueChanged(data));
    }
  }
  onValueChanged(data?: any) {
    if (this.form) {
      const form = this.form;
      for (const field in this.formErrors) {
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.invalid) {
          console.log(this.formErrors);
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              console.log("msg:" + messages[key]);
              this.formErrors[field] += messages[key] + ' ';
              break;
            }
          }
        }
      }
    }
  }

  onSubmit() {
    const price = parseFloat(this.form.value.price);
    if (this.form.invalid) {
      return;
    }
    const purchase: Purchase = {
      title: this.form.value.title,
      price: Math.floor(price * 100) / 100,
      date: this.form.value.data === '' ? new Date() : new Date(this.form.value.data),
    };

    if (this.form.value.comment) {
      purchase.comment = this.form.value.comment;
    }

    this.addPurchase.emit(purchase);
  }
}
