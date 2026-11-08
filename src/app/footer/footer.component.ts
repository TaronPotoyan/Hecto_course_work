// src/app/footer/footer.component.ts
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigatorService } from '../services/navigatorService/navigatorService';
import { SubscribeService } from '../services/subscribeService/subscribeService';
import { Helper } from '../helpers/helperClass';

@Component({
  selector: 'app-footer',
  imports: [FormsModule],
  templateUrl: 'footer.component.html',
  styleUrl: 'footer.component.scss',
})
export class FooterComponent {
  private navService = inject(NavigatorService);
  private subscribeService = inject(SubscribeService);

  readonly socialMedia = Helper.getSocialMedias();
  readonly footerSections = Helper.getFooterSections();
  readonly year = new Date().getFullYear();

  email = signal('');
  submitting = signal(false);

  async subscribe() {
    this.submitting.set(true);
    if (await this.subscribeService.subscribe(this.email())) this.email.set('');
    this.submitting.set(false);
  }

  handleNavigate(path: string) {
    this.navService.handleNavigate(path);
  }
}
