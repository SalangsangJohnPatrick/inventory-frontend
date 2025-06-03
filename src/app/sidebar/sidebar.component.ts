import { Component, Output, EventEmitter, OnInit, HostListener } from '@angular/core';
import { navbarData } from './nav-data';
import { Router } from '@angular/router';
import { AuthService } from '../auth-service/auth-service.service';

interface SidebarToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  constructor(private router: Router, private authService: AuthService) {}

  @HostListener('window:resize', ['$event'])

  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    if(this.screenWidth <= 768) {
      this.collapsed = false;
      this.onToggleSidebar.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});
    }
  }

  // Logout method
  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/authentication']);
  }

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
  }

  @Output() onToggleSidebar: EventEmitter<SidebarToggle> = new EventEmitter();

  collapsed = false;
  screenWidth = 0;
  navData = navbarData;

  toggleCollapsed(): void {
    this.collapsed = !this.collapsed;
    this.onToggleSidebar.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});
  }

  closeSidebar() {
    this.collapsed = false;
    this.onToggleSidebar.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});
  }

}
