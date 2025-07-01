// cypress/e2e/form.spec.cy.js

describe('Formulaire d\'inscription', () => {
    beforeEach(() => {
        // Visiter la page contenant le formulaire
        cy.visit('http://localhost:3000/signup'); // Ajustez l'URL selon votre configuration
    });

    it('1. Affiche correctement les éléments du formulaire', () => {
        // Vérifier la présence des éléments principaux
        cy.get('.signup-container').should('exist');
        cy.get('.signup-box').should('exist');
        cy.get('.logo').should('contain', 'Blink');
        cy.get('.signup-subtitle').should('contain', 'Inscrivez-vous pour discuter avec vos amis');

        // Vérifier les champs de formulaire
        cy.get('input[name="email"]').should('exist');
        cy.get('input[name="fullName"]').should('exist');
        cy.get('input[name="username"]').should('exist');
        cy.get('input[name="password"]').should('exist');
        cy.get('.signup-button').should('contain', 'Inscription');

        // Vérifier le lien de connexion
        cy.get('.login-link').should('contain', 'Connectez-vous');
    });

    it('2. Valide les champs obligatoires', () => {
        // Vider tous les champs et vérifier qu'ils sont vides
        cy.get('input[name="email"]').clear().should('have.value', '');
        cy.get('input[name="fullName"]').clear().should('have.value', '');
        cy.get('input[name="username"]').clear().should('have.value', '');
        cy.get('input[name="password"]').clear().should('have.value', '');

        // Vérifier qu'aucun message d'erreur n'est visible initialement
        cy.get('.error-message').should('not.exist');

        // Soumettre le formulaire vide
        cy.get('.signup-button').click();

        // Vérifier que les classes d'erreur sont appliquées
        cy.get('input[name="email"]').should('have.class', 'error');
        cy.get('input[name="fullName"]').should('have.class', 'error');
        cy.get('input[name="username"]').should('have.class', 'error');
        cy.get('input[name="password"]').should('have.class', 'error');

        // Vérifier les messages d'erreur pour chaque champ
        cy.get('input[name="email"]').siblings('.error-message')
            .should('be.visible')
            .and('contain', 'Ce champ est requis');

        cy.get('input[name="fullName"]').siblings('.error-message')
            .should('be.visible')
            .and('contain', 'Ce champ est requis');

        cy.get('input[name="username"]').siblings('.error-message')
            .should('be.visible')
            .and('contain', 'Ce champ est requis');

        cy.get('input[name="password"]').siblings('.error-message')
            .should('be.visible')
            .and('contain', 'Ce champ est requis');
    });

    it('3. Permet la saisie dans les champs', () => {
        const testData = {
            email: 'test@example.com',
            fullName: 'Jean Dupont',
            username: 'jeandupont',
            password: 'password123'
        };

        // Remplir les champs
        cy.get('input[name="email"]').type(testData.email).should('have.value', testData.email);
        cy.get('input[name="fullName"]').type(testData.fullName).should('have.value', testData.fullName);
        cy.get('input[name="username"]').type(testData.username).should('have.value', testData.username);
        cy.get('input[name="password"]').type(testData.password).should('have.value', testData.password);
    });

    it('4. Affiche un message de succès après inscription valide', () => {
        // Remplir le formulaire avec des données valides
        cy.get('input[name="email"]').type('valid@email.com');
        cy.get('input[name="fullName"]').type('Valid User');
        cy.get('input[name="username"]').type('validuser');
        cy.get('input[name="password"]').type('validpassword');

        // Soumettre le formulaire
        cy.get('.signup-button').click();

        // Vérifier l'état de soumission
        cy.get('.signup-button').should('contain', 'Inscription en cours...');
        cy.get('.signup-button').should('be.disabled');

        // Vérifier la notification de succès
        cy.get('.registration-notification.success', { timeout: 2000 }).should('exist');
        cy.get('.registration-notification.success .notification-icon').should('exist');
        cy.get('.registration-notification.success').should('contain', 'Compte créé avec succès');
    });

    it('5. Affiche un message d\'erreur après inscription invalide', () => {
        // Remplir le formulaire avec des données invalides (email sans @ et mot de passe trop court)
        cy.get('input[name="email"]').type('invalidemail');
        cy.get('input[name="fullName"]').type('Invalid User');
        cy.get('input[name="username"]').type('invaliduser');
        cy.get('input[name="password"]').type('short');

        // Soumettre le formulaire
        cy.get('.signup-button').click();

        // Vérifier la notification d'erreur
        cy.get('.registration-notification.error', { timeout: 2000 }).should('exist');
        cy.get('.registration-notification.error .notification-icon').should('exist');
        cy.get('.registration-notification.error').should('contain', 'Erreur lors de l\'inscription');
    });

    it('6. Redirige vers la page de connexion', () => {
        // Cliquer sur le lien de connexion
        cy.get('.login-link').click();

        // Vérifier la redirection (ajustez selon votre configuration de routes)
        cy.url().should('include', 'http://localhost:3000'); // Ou la route appropriée pour la page de connexion
    });

    it('7. Réinitialise les erreurs lors de la saisie', () => {
        // Soumettre le formulaire vide pour afficher les erreurs
        cy.get('.signup-button').click();

        // Commencer à taper dans un champ
        cy.get('input[name="email"]').type('t');

        // Vérifier que l'erreur disparaît
        cy.get('input[name="email"]').should('not.have.class', 'error');
        cy.get('input[name="email"]').next('.error-message').should('not.exist');
    });
});