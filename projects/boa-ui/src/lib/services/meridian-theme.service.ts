import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type ThemeMode = 'light' | 'dark' | 'high-contrast';

export interface ThemeConfig {
  mode: ThemeMode;
  primaryColor: string;
  accentColor: string;
  fontSize: 'small' | 'medium' | 'large';
}

const DEFAULT_THEME: ThemeConfig = {
  mode: 'light',
  primaryColor: '#012169',
  accentColor: '#DC1431',
  fontSize: 'medium'
};

/**
 * Meridian Theme Service - manages design system theming.
 */
@Injectable({
  providedIn: 'root'
})
export class MeridianThemeService {
  private themeSubject = new BehaviorSubject<ThemeConfig>(DEFAULT_THEME);
  public theme$: Observable<ThemeConfig> = this.themeSubject.asObservable();

  constructor() {
    this.loadSavedTheme();
  }

  setThemeMode(mode: ThemeMode): void {
    const current = this.themeSubject.value;
    this.updateTheme({ ...current, mode });
    document.body.setAttribute('data-theme', mode);
  }

  setFontSize(size: 'small' | 'medium' | 'large'): void {
    const current = this.themeSubject.value;
    this.updateTheme({ ...current, fontSize: size });

    const fontSizeMap = { small: '14px', medium: '16px', large: '18px' };
    document.documentElement.style.fontSize = fontSizeMap[size];
  }

  getCurrentTheme(): ThemeConfig {
    return this.themeSubject.value;
  }

  resetTheme(): void {
    this.updateTheme(DEFAULT_THEME);
    document.body.removeAttribute('data-theme');
    document.documentElement.style.fontSize = '16px';
  }

  private updateTheme(config: ThemeConfig): void {
    this.themeSubject.next(config);
    try {
      localStorage.setItem('boa-theme', JSON.stringify(config));
    } catch {
      // localStorage may not be available
    }
  }

  private loadSavedTheme(): void {
    try {
      const saved = localStorage.getItem('boa-theme');
      if (saved) {
        const config = JSON.parse(saved) as ThemeConfig;
        this.themeSubject.next(config);
        document.body.setAttribute('data-theme', config.mode);
      }
    } catch {
      // Use default theme
    }
  }
}
