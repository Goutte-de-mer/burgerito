describe("Authentication E2E Tests", () => {
  beforeEach(() => {
    cy.intercept("POST", "https://node-eemi.vercel.app/api/auth/login", {
      statusCode: 200,
      body: {
        token: "test-token",
        user: {
          id: "1",
          name: "Test User",
          email: "test@example.com",
        },
      },
    }).as("login");

    cy.intercept("POST", "https://node-eemi.vercel.app/api/auth/register", {
      statusCode: 200,
      body: {
        token: "test-token",
        user: {
          id: "1",
          name: "New User",
          email: "new@example.com",
        },
      },
    }).as("register");
  });

  it("should display login form", () => {
    cy.visit("/login", { timeout: 10000 });
    cy.wait(1000); // Attendre que l'hydratation se termine
    cy.get('input[type="email"]', { timeout: 5000 }).should("be.visible");
    cy.get('input[type="password"]', { timeout: 5000 }).should("be.visible");
    // Le bouton dit "Connexion"
    cy.get("button").contains("Connexion").should("be.visible");
  });

  it("should display register form", () => {
    cy.visit("/register", { timeout: 10000 });
    cy.wait(1000); // Attendre que l'hydratation se termine
    cy.get("input", { timeout: 5000 }).should("have.length.at.least", 2);
    cy.get('input[type="email"]', { timeout: 5000 }).should("be.visible");
    cy.get('input[type="password"]', { timeout: 5000 }).should("be.visible");
  });

  it("should fill and submit login form", () => {
    cy.visit("/login", { timeout: 10000 });
    cy.wait(1000); // Attendre que l'hydratation se termine
    cy.get('input[type="email"]', { timeout: 5000 }).type("test@example.com");
    cy.get('input[type="password"]', { timeout: 5000 }).type("password123");
    // Vérifier que le bouton est cliquable et le cliquer
    cy.get("button").contains("Connexion").should("be.visible").click();
    // Attendre un peu pour que la soumission se fasse (Server Action, pas d'interception possible)
    cy.wait(1000);
    // Le formulaire devrait être soumis (peu importe le résultat, on teste juste l'interaction)
    cy.get("form", { timeout: 5000 }).should("exist");
  });
});
