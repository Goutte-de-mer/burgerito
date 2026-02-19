describe('Navigation E2E Tests', () => {
  it('should navigate to login page', () => {
    cy.visit('/', { timeout: 10000 });
    cy.wait(1000); // Attendre que l'hydratation se termine
    cy.contains(/connexion|login/i, { timeout: 5000 }).click();
    cy.url().should('include', '/login');
  });

  it('should navigate to register page', () => {
    cy.visit('/', { timeout: 10000 });
    cy.wait(1000); // Attendre que l'hydratation se termine
    cy.contains(/inscription|register|sign up/i, { timeout: 5000 }).click();
    cy.url().should('include', '/register');
  });

  it('should navigate back to home', () => {
    cy.visit('/login', { timeout: 10000 });
    cy.wait(1000); // Attendre que l'hydratation se termine
    // Le logo dans le header est un lien vers la home
    cy.get('header a[href="/"]', { timeout: 5000 }).first().click();
    cy.url().should('eq', 'http://localhost:3000/');
  });
});

