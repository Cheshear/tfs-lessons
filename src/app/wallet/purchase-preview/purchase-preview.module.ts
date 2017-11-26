import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PurchasePreviewComponent} from './purchase-preview.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [PurchasePreviewComponent],
  exports: [PurchasePreviewComponent]
})
export class PurchasePreviewModule { }
