import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AddItemComponent } from '../modals/add-item/add-item.component';
import { ImportComponent } from '../modals/import/import.component';

@Component({
  selector: 'app-modals',
  templateUrl: './modals.component.html',
  styleUrls: ['./modals.component.scss']
})
export class ModalsComponent {
  @Input() showAddModal = false;  // Input property for showing Add Modal
  @Input() showImportModal = false;  // Input property for showing Import Modal

  @Output() closeAddModal = new EventEmitter<void>();
  @Output() closeImportModal = new EventEmitter<void>();

  openAddModal() {
    this.showAddModal = true;
  }

  closeAddModalHandler() {
    this.closeAddModal.emit();
  }

  openImportModal() {
    this.showImportModal = true;
  }

  closeImportModalHandler() {
    this.closeImportModal.emit();
  }
}
