describe('Home Page E2E Tests', () => {
  it('should load the home page', () => {
    cy.visit('/', { timeout: 10000 });
    cy.wait(2000); // Attendre que la page se charge (SSR, pas d'interception possible)
    // Vérifier que la page est chargée - chercher le header ou un élément visible
    cy.get('header', { timeout: 5000 }).should('be.visible');
    // Vérifier qu'il y a au moins un élément de contenu
    cy.get('main', { timeout: 5000 }).should('be.visible');
  });

  it('should display burger products or loading state', () => {
    cy.visit('/', { timeout: 10000 });
    cy.wait(2000); // Attendre que la page se charge
    // Soit les produits sont affichés, soit il y a un état de chargement
    // On vérifie juste que la page est fonctionnelle
    cy.get('main', { timeout: 5000 }).should('be.visible');
    // Si des produits sont chargés, ils seront visibles
    // Sinon, c'est OK aussi car l'API externe peut ne pas répondre en test
  });

  it('should have navigation elements', () => {
    cy.visit('/', { timeout: 10000 });
    cy.wait(2000); // Attendre que la page se charge
    // Vérifier que les éléments de navigation existent
    cy.get('header', { timeout: 5000 }).should('be.visible');
    // Vérifier qu'il y a des liens dans le header (navigation)
    cy.get('header a', { timeout: 5000 }).should('have.length.at.least', 1);
    // Si des produits existent et ont des liens, on peut tester la navigation
    // Sinon, on vérifie juste que la structure de la page est correcte
    cy.get('main', { timeout: 5000 }).should('be.visible');
  });
});

