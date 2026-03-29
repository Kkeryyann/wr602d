describe('Formulaire de Connexion', () => {
    it('test 1 - connexion OK', () => {
        cy.visit('YOU_LOCAL/login');

        // Entrer le nom d'utilisateur et le mot de passe
        cy.get('#username').type('YOUR_USERNAME');
        cy.get('#password').type('YOUR_PASSWORD');

        // Soumettre le formulaire
        cy.get('button[type="submit"]').click();

        // Vérifier que l'utilisateur est connecté
        cy.contains('You are logged in as YOUR_USERNAME').should('exist');
    });

    it('test 2 - connexion KO', () => {
        cy.visit('YOUR_LOCAL/login');

        // Entrer un nom d'utilisateur et un mot de passe incorrects
        cy.get('#username').type('YOUR_USERNAME');
        cy.get('#password').type('WRONG_PASSWORD');

        // Soumettre le formulaire
        cy.get('button[type="submit"]').click();

        // Vérifier que le message d'erreur est affiché
        cy.contains('Invalid credentials.').should('exist');
    });
});
