import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss']
})
export class AddItemComponent {
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() addItem = new EventEmitter<any>();

  inventoryForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.inventoryForm = this.fb.group({
      brand_name: ['', [Validators.required, Validators.maxLength(255)]],
      type: ['', [Validators.required, Validators.maxLength(255)]],
      quantity_on_hand: ['', [Validators.required]],
      price: ['', [Validators.required]],
      products_sold: ['', [Validators.required]]
    });
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.close();
    }
  }

  close(): void {
    this.inventoryForm.reset();
    this.closeModal.emit();
  }

  onSubmit(): void {
    // console.log(this.inventoryForm.value);
    if (this.inventoryForm.valid) {
      this.addItem.emit(this.inventoryForm.value);
      this.close();
    }
  }
}
