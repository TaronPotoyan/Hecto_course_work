// src/app/app.ts
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ToastComponent } from './shared/toast/toast.component';
import { ChatWidgetComponent } from './shared/chatWidget/chatWidget.component';
import { ThemeService } from './services/themeService/themeService';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, ToastComponent, ChatWidgetComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  // Instantiated at startup so the saved theme is applied immediately.
  protected readonly theme = inject(ThemeService);
}
