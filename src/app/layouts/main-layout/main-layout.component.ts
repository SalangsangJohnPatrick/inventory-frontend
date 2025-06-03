import { Component } from '@angular/core';

interface SidebarToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent {
  isSidebarCollapsed = false;
  screenWidth = 0;

  onToggleSidebar(data: SidebarToggle): void {
    this.screenWidth = data.screenWidth;
    this.isSidebarCollapsed = data.collapsed;
  }
}
