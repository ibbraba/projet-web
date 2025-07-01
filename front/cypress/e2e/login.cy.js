// cypress/e2e/login.spec.cy.js

describe('Page de connexion', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000'); // Ajustez l'URL selon votre route de connexion
    });

    it('1. Affiche correctement les éléments de la page', () => {
        // Vérifier les éléments principaux
        cy.get('.login-container').should('exist');
        cy.get('.login-box').should('exist');
        cy.get('.logo').should('contain', 'Blink');

        // Vérifier les champs de formulaire
        cy.get('input[name="email"]').should('exist');
        cy.get('input[name="password"]').should('exist');
        cy.get('.login-button').should('contain', 'Se connecter');

        // Vérifier les liens supplémentaires
        cy.get('.forgot-password').should('contain', 'Mot de passe oublié');
        cy.get('.signup-link').should('contain', 'Inscrivez-vous');
    });

    it('2. Valide les champs obligatoires', () => {
        // Vider les champs pré-remplis
        cy.get('input[name="email"]').clear().should('have.value', '');
        cy.get('input[name="password"]').clear().should('have.value', '');

        // Vérifier que les messages d'erreur ne sont pas visibles initialement
        cy.get('.error-message').should('not.exist');

        // Soumettre le formulaire
        cy.get('.login-button').click();

        // Debug: vérifier si les classes error sont appliquées
        cy.get('input[name="email"]').should('have.class', 'error');
        cy.get('input[name="password"]').should('have.class', 'error');

        // Vérifier les messages d'erreur avec des sélecteurs plus précis
        cy.get('input[name="email"]').siblings('.error-message')
            .should('be.visible')
            .and('contain', 'Ce champ est requis');

        cy.get('input[name="password"]').siblings('.error-message')
            .should('be.visible')
            .and('contain', 'Ce champ est requis');
    });

    it('3. Permet la saisie dans les champs', () => {
        const testData = {
            email: 'test@example.com',
            password: 'password123'
        };

        // Vider les champs pré-remplis
        cy.get('input[name="email"]').clear();
        cy.get('input[name="password"]').clear();

        // Remplir les champs
        cy.get('input[name="email"]').type(testData.email).should('have.value', testData.email);
        cy.get('input[name="password"]').type(testData.password).should('have.value', testData.password);
    });

    it('4. Affiche un message de succès après connexion valide', () => {
        // Remplir le formulaire avec des données valides
        cy.get('input[name="email"]').clear().type('valid@email.com');
        cy.get('input[name="password"]').clear().type('validpassword');

        // Soumettre le formulaire
        cy.get('.login-button').click();

        // Vérifier l'état de soumission
        cy.get('.login-button').should('contain', 'Connexion en cours...');
        cy.get('.login-button').should('be.disabled');

        // Vérifier la notification de succès
        cy.get('.auth-notification.success', { timeout: 2000 }).should('exist');
        cy.get('.auth-notification.success .notification-icon').should('exist');
        cy.get('.auth-notification.success').should('contain', 'Connexion réussie!');

        // Vérifier la redirection (ajustez le timeout selon votre configuration)
        cy.url({ timeout: 3000 }).should('include', '/chat');
    });

    it('5. Affiche un message d\'erreur après connexion invalide', () => {
        // Remplir le formulaire avec des données invalides
        cy.get('input[name="email"]').clear().type('invalidemail');
        cy.get('input[name="password"]').clear().type('short');

        // Soumettre le formulaire
        cy.get('.login-button').click();

        // Vérifier la notification d'erreur
        cy.get('.auth-notification.error', { timeout: 2000 }).should('exist');
        cy.get('.auth-notification.error .notification-icon').should('exist');
        cy.get('.auth-notification.error').should('contain', 'Échec de l\'authentification');
    });

    it('6. Redirige vers la page d\'inscription', () => {
        // Cliquer sur le lien d'inscription
        cy.get('.signup-link').click();

        // Vérifier la redirection
        cy.url().should('include', '/signup');
    });

    it('7. Affiche le lien "Mot de passe oublié"', () => {
        cy.get('.forgot-password')
            .should('be.visible')
            .and('contain', 'Mot de passe oublié');
    });

    it('8. Réinitialise les erreurs lors de la saisie', () => {
        // Soumettre le formulaire vide pour afficher les erreurs
        cy.get('input[name="email"]').clear();
        cy.get('input[name="password"]').clear();
        cy.get('.login-button').click();

        // Commencer à taper dans un champ
        cy.get('input[name="email"]').type('t');

        // Vérifier que l'erreur disparaît
        cy.get('input[name="email"]').should('not.have.class', 'error');
        cy.get('input[name="email"]').next('.error-message').should('not.exist');
    });

    it('9. Conserve les valeurs par défaut', () => {
        cy.get('input[name="email"]').should('have.value', 'junior');
        cy.get('input[name="password"]').should('have.value', 'junior');
    });
});