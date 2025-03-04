import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InventoryApiService } from '../inventory-api/inventory-api.service';
import Swal from 'sweetalert2';
import { InventoryItem } from '../types/inventory.type';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-create-update-modal',
  templateUrl: './create-update-modal.component.html',
  styleUrls: ['./create-update-modal.component.scss']
})
export class CreateUpdateModalComponent implements OnInit {

  @Input() item: InventoryItem | null = null;

  inventoryForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private inventoryApiService: InventoryApiService,
    private activeModal: NgbActiveModal
  ) {
    this.inventoryForm = this.fb.group({
      brand_name: ['', [Validators.required, Validators.maxLength(255)]],
      type: ['', [Validators.required, Validators.maxLength(255)]],
      quantity_on_hand: ['', [Validators.required]],
      price: ['', [Validators.required]],
      products_sold: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    if (this.item) {
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
    this.activeModal.dismiss();
  }

  onSubmit() {
    if (this.item) {
      Swal.fire({
        title: 'Updating...',
        text: 'Please wait while we update the item',
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => {
          Swal.showLoading();
        }
      });
      this.inventoryApiService.updateInventoryItem(this.item.id, this.inventoryForm.value).subscribe(
        () => {
          Swal.fire({
            icon: 'success',
            title: 'Updated!',
            text: 'Item has been updated successfully',
            timer: 2000,
            showConfirmButton: false
          });
          this.activeModal.close();
        },
        error => {
          console.error('Error updating inventory item:', error);
          Swal.fire({
            icon: 'error',
            title: 'Update Failed',
            text: 'There was an error updating the item. Please try again.',
            confirmButtonColor: '#d33'
          });
        }
      );
    } else {
      Swal.fire({
        title: 'Creating...',
        text: 'Please wait while we add the item',
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => {
          Swal.showLoading();
        }
      });
      this.inventoryApiService.addInventoryItem(this.inventoryForm.value).subscribe(
        () => {
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Item has been added successfully',
            confirmButtonColor: '#3085d6'
          });
          this.activeModal.close();
        },
        error => {
          console.error('Error adding inventory item:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'There was an error adding the item. Please try again.',
            confirmButtonColor: '#d33'
          });
        }
      );
    }
  }
}
