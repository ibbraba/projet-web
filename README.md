# Chat-App

Chat-App est une application permettant à n utilisateur de créer un compte et discuter avec d'autres membres via un onglet conversation. 
L'interface est simple, fluide et a été concue pour traiter au mieux l'échange de message 

## Installation du projet 

Le projet se trouve [ici](https://github.com/ibbraba/projet-web)

Clonez le projet sur un dossier de votre ordinateur en utilisant la commande suivante 

```
git clone https://github.com/ibbraba/projet-web
``` 

Puis lancez l'application en utilisant cette commande 
```
docker compose up --build
``` 

Attendre que tous les conteneurs soient initialisés. Le worker renverra une erreur jusqu'a l'initialisation du serveur RabbitMQ

L'application sera disponible à l'adresse suivante 

```
localhost:3000
```

Le playground GraphQl est disponible pour tester des requêtes à cette adresse : 

```
localhost:5000/graphql
```

Le serveur de management est disponible à cette adresse : 

```
localhost:15672
```

## Architecture de l'application 


### Partie Frontend - Interface utilisateur

La partie frontend permettra aux utilisateurs de se connecter et de consulter la liste de leurs conversations. Ils pourront également créer une discussion, consulter et éditer leurs profils. 
Une page d'inscription est disponible pour acceuillir de nouveaux utilisateurs 



### Partie API - Nest.js & GraphQL 

L'API NestJS sert d’intermédiaire centralisé entre le frontend et le broker de messages (RabbitMQ) pour orchestrer les requêtes CRUD des différents services métiers. Elle expose des endpoints GraphQL en approche Code First, permettant de définir les schémas et résolveurs directement en TypeScript pour une meilleure maintenabilité et productivité. Grâce à cette architecture, elle gère efficacement les opérations de lecture/écriture tout en assurant une communication asynchrone avec les microservices via le broker, offrant ainsi une solution scalable et performante.


### Broker RabbitMQ 

Le broker RabbitMQ permet d'échager des messages entre l'API et le worker qui effectue des operations en base de données. Il est utilisé pour assurer le découplage entre l'API et la couche de persistance et permet d'initialiser un grand nombre de workers selon la charge de travail de notre application. 
Si l'API a besoin de données, elle emet un message dans une queue qui sera lue par le broker. Le broker executera une requête pour obtenir ou modifier des informations en base de données avant de renvoyer un message de réponse dans une autre queue. L'API se charge ensuite de lire le message de retour pour ensuite renvoyer les information à l'application client.

### Worker Nest.js et base de données 
Le worker consomme des messages du broker ou sont indiqués l'objet et l'operation souhaitée. Il effectue l'operation puis renvoie un message de succès ou d'erreur dans une nouvelle queue.

### TEST
Dans ce projet, on a des tests pour chaque module que l'on retrouve dans le dossier Chat-App.
Par exemple, dans le module user, on a :

    user.service.spec.ts qui est un fichier de test unitaire pour le service UserService,

    et user.integration.spec.ts qui est un fichier de test d'intégration pour le service User.

On retrouve ce format de fichiers également dans les modules messages et conversation.
Pour lancer les tests, il faut aller dans le dossier Chat-App :
```
cd chat-app
```
Et exécuter la commande suivante :
```
npm run test
``` 
