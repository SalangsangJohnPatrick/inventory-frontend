import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InventoryApiService } from 'src/app/inventory-api/inventory-api.service';

@Component({
  selector: 'app-update-item',
  templateUrl: './update-item.component.html',
  styleUrls: ['./update-item.component.scss']
})
export class UpdateItemComponent {
  @Input() isOpen = false;
  @Input() item: any = null;  // The item to be updated
  @Output() closeModal = new EventEmitter<void>();
  @Output() updateItem = new EventEmitter<any>();

  inventoryForm: FormGroup;

  constructor(private fb: FormBuilder, private inventoryApiService: InventoryApiService) {
    this.inventoryForm = this.fb.group({
      brand_name: ['', [Validators.required, Validators.maxLength(255)]],
      type: ['', [Validators.required, Validators.maxLength(255)]],
      quantity_on_hand: ['', [Validators.required]],
      price: ['', [Validators.required]],
      products_sold: ['', [Validators.required]]
    });
  }

  ngOnChanges() {
    if (this.item) {
      // Initialize the form with existing item data
      this.inventoryForm.patchValue({
        brand_name: this.item.brand_name,
        type: this.item.type,
        quantity_on_hand: this.item.quantity_on_hand,
        price: this.item.price,
        products_sold: this.item.products_sold
      });
    }
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
    if (this.inventoryForm.valid) {
      const updatedItem = { ...this.item, ...this.inventoryForm.value }; // Merge existing item with form data
      this.updateItem.emit(updatedItem);
      this.close();
    }
  }
}
