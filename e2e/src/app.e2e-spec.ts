import { browser, by, element, ExpectedConditions as EC } from 'protractor';

/**
 * Protractor e2e tests for BoA Digital Banking.
 * Protractor is deprecated and was removed in Angular v15.
 * Migration target: Cypress or Playwright.
 */
describe('BoA Digital Banking App', () => {

  beforeEach(async () => {
    await browser.get('/');
    await browser.waitForAngularEnabled(true);
  });

  it('should display the application title', async () => {
    const title = await browser.getTitle();
    expect(title).toContain('BoA Digital Banking');
  });

  it('should render the navigation shell', async () => {
    const navShell = element(by.tagName('meridian-nav-shell'));
    expect(await navShell.isPresent()).toBeTruthy();
  });

  it('should have a toolbar with bank branding', async () => {
    const toolbar = element(by.tagName('mat-toolbar'));
    expect(await toolbar.isPresent()).toBeTruthy();
  });

  it('should navigate to dashboard', async () => {
    await browser.get('/dashboard');
    const dashboardEl = element(by.tagName('boa-dashboard'));
    await browser.wait(EC.presenceOf(dashboardEl), 5000);
    expect(await dashboardEl.isPresent()).toBeTruthy();
  });

  it('should navigate to accounts', async () => {
    await browser.get('/accounts');
    const accountsEl = element(by.tagName('boa-account-list'));
    await browser.wait(EC.presenceOf(accountsEl), 5000);
    expect(await accountsEl.isPresent()).toBeTruthy();
  });

  it('should navigate to transfers', async () => {
    await browser.get('/transfers');
    const transfersEl = element(by.tagName('boa-transfer-form'));
    await browser.wait(EC.presenceOf(transfersEl), 5000);
    expect(await transfersEl.isPresent()).toBeTruthy();
  });

  it('should display account cards on dashboard', async () => {
    await browser.get('/dashboard');
    const cards = element.all(by.tagName('meridian-account-summary'));
    await browser.wait(EC.presenceOf(cards.first()), 5000);
    expect(await cards.count()).toBeGreaterThan(0);
  });

  it('should display quick actions on dashboard', async () => {
    await browser.get('/dashboard');
    const quickActions = element(by.tagName('boa-quick-actions'));
    await browser.wait(EC.presenceOf(quickActions), 5000);
    expect(await quickActions.isPresent()).toBeTruthy();
  });
});
