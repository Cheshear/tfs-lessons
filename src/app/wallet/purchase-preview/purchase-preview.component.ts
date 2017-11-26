import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Purchase} from '../../model/purchase';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

const digitRegex = /^\d*\.?\d+$/;

@Component({
  selector: 'tfs-purchase-preview',
  templateUrl: './purchase-preview.component.html',
  styleUrls: ['./purchase-preview.component.css']
})
export class PurchasePreviewComponent implements OnInit, OnChanges {
  editPurchaseForm: FormGroup;
  @Input() purchase: Purchase;
  @Input() isOpen: boolean;
  @Output() previewClick = new EventEmitter();
  @Output() previewDelete = new EventEmitter();
  @Output() edit = new EventEmitter<Purchase>();
  isEdit = false;


  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.editPurchaseForm = this.formBuilder.group({
      title: [this.purchase.title, [Validators.required, Validators.minLength(3), Validators.maxLength(80)]],
      price: [this.purchase.price, [Validators.required, Validators.min(10), Validators.max(1000000), Validators.pattern(digitRegex)]],
      date: [this.purchase.date],
      comment: [this.purchase.comment]
    });
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

  ngOnChanges(isOpen) {
    this.isOpen = isOpen;
    this.isEdit = false;
  }

  onClick() {
    this.previewClick.emit();
  }

  onDeleteClick(event: MouseEvent) {
    event.stopPropagation();
    this.previewDelete.emit();
  }

  onEditPurchase(purchaseToAdd: Purchase) {
    if (this.purchase.id) {
      this.purchase.title = purchaseToAdd.title;
      this.purchase.price = purchaseToAdd.price;
      this.purchase.date = purchaseToAdd.date;
      this.purchase.comment = purchaseToAdd.comment;
    }
    this.edit.emit(this.purchase);
  }

  onEditClick() {
    this.isEdit = true;
  }

  toggleEdit() {
    this.isEdit = false;
  }

  onSubmit() {
    const price = parseFloat(this.editPurchaseForm.value.price);

    if (!isFinite(price) || this.editPurchaseForm.invalid) {
      return;
    }

    const date = this.editPurchaseForm.value.date
      ? new Date(this.editPurchaseForm.value.date)
      : new Date();

    const purchase: Purchase = {
      title: this.editPurchaseForm.value.title,
      price: Math.floor(price * 100) / 100,
      date: date.toISOString()
    };

    if (this.editPurchaseForm.value.comment) {
      purchase.comment = this.editPurchaseForm.value.comment;
    }
    this.onEditPurchase(purchase);
    this.isEdit = false;
  }
}
