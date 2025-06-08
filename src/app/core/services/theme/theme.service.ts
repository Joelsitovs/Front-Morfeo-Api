import { computed, effect, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {

  private theme = signal<'light' | 'dark'>('light');

  currentTheme = computed(() => this.theme());
  constructor() {
    const saved = (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
    this.setTheme(saved, false);

    effect(() => {
      const theme = this.theme();
      const html = document.documentElement;
      html.classList.toggle('dark', theme === 'dark');
    });
  }
  toggleTheme(): void {
    this.theme.set(this.theme() === 'light' ? 'dark' : 'light');
    localStorage.setItem('theme', this.theme());
  }

  setTheme(value: 'light' | 'dark', persist = true): void {
    this.theme.set(value);
    if (persist) localStorage.setItem('theme', value);
  }
  /*
    private themeSubject = new BehaviorSubject<'light' | 'dark'>('light');
    theme$ = this.themeSubject.asObservable();

    constructor() {
      const savedTheme =
        (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
      this.setTheme(savedTheme, false);
    }

    toggleTheme() {
      const newTheme = this.themeSubject.value === 'light' ? 'dark' : 'light';
      this.setTheme(newTheme);
    }
    setTheme(theme: 'light' | 'dark', persist = true): void {
      const html = document.documentElement;

      if (theme === 'dark') {
        html.classList.add('dark');
      } else {
        html.classList.remove('dark');
      }

      this.themeSubject.next(theme);

      if (persist) {
        localStorage.setItem('theme', theme);
      }
    }
    get currentTheme(): 'light' | 'dark' {
      return this.themeSubject.value;
    }
  */

}
