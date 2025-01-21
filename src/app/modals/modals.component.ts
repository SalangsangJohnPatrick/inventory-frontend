import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AddItemComponent } from '../modals/add-item/add-item.component';
import { ImportComponent } from '../modals/import/import.component';

@Component({
  selector: 'app-modals',
  templateUrl: './modals.component.html',
  styleUrls: ['./modals.component.scss']
})
export class ModalsComponent {
  @Input() showAddModal = false;
  @Input() showImportModal = false;
  @Input() showUpdateModal = false;
  @Input() selectedItem: any = null;

  @Output() closeAddModal = new EventEmitter<void>();
  @Output() closeImportModal = new EventEmitter<void>();
  @Output() closeUpdateModal = new EventEmitter<void>();

  @Output() addItem = new EventEmitter<any>();
  @Output() importFile = new EventEmitter<File>();
  @Output() updateItem = new EventEmitter<any>();

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

  openUpdateModal() {
    this.showUpdateModal = true;
  }

  closeUpdateModalHandler() {
    this.closeUpdateModal.emit();
  }

  onAddItem(item: any) {
    this.addItem.emit(item);
  }

  onImportFile(file: File) {
    this.importFile.emit(file);
  }

  onUpdateItem(item: any) {
    this.updateItem.emit(item);
  }
}
