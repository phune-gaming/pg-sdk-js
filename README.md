# Phune Gaming SDK for JavaScript

SDK to build HTML5 games for the Phune Gaming platform.

## Requirements

Node.js is required to build the SDK.

## Build

Setup build dependencies:
```shell
npm install
```
Build the SDK:
```js
grunt build
```
## Create a game

Create a html page that imports the SDK's JavaScript file:
```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <!-- Meta Tags -->
        <meta charset="UTF-8" />
        <title>Game Title</title>

        <!-- Link Tags -->
        <link rel="icon" href="favicon.ico" sizes="16x16 32x32" />

        <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1, maximum-scale=1.0, user-scalable=no">
    </head>
    <body>

        <script type="text/javascript" src="PG.min.js"></script>
        <script type="text/javascript" src="game.js"></script>
    </body>
</html>
```

Initialize the SDK using PG.init and pass as parameters the callback functions that will handle all the matchmaking state changes and game events:
```javascript
PG.init({
    onMatchPrepare: function(player, opponent, timeToPlay, deviceType) {
        // ...
    },
    onMatchStart: function(playerIdToPlayNext) {
        // ...
    },
    onServerMessage: function(playerIdWhoSentTheMessage, messageDetails, messageResults) {
        // ...
    },
    onPlayerMessage: function(messageDetails) {
        // ...
    },
    onMoveValid: function(playerIdWhoSentTheMove, playerIdToPlayNext, moveDetails, moveResults, gameResults) {
        // ...
    },
    onMoveInvalid: function(playerIdWhoSentTheMove, playerIdToPlayNext) {
        // ...
    },
    onMatchEnd: function(gameResults) {
        // ...
    },
    onKeyPress: function(key) { // TV only
        // ...
    }
});
```
### Prepare the match

During the match preparation phase, the game should build the user interface and get ready to start playing. It is provided with the details of the player and opponent, the time allowed for each player to make a move and in which device type the game is running (mobile or tv).

If the game requires user interaction to configure the match details, it should request the game to be shown to the user calling PG.prepared. Then it can send messages to be evaluated by the server-side rules using PG.serverMessage.

When it is ready to start the match, it should call PG.ready. If PG.prepared has not been called, the game will be shown to the user now.

```javascript
onMatchPrepare: function(player, opponent, timeToPlay, deviceType) {
    // ...
    PG.serverMessage(
        { message: 'message' },    // any message content can be passed here
        false                      // should the response be sent to both players
    );
    // ...
    PG.prepared(); // optional
    // ...
    PG.ready();
},
```

Responses to messages sent to the server will be processed in the onServerMatch callback function.

```javascript
onServerMessage: function(playerIdWhoSentTheMessage, messageDetails, messageResults) {
    // ...
},
```

### Start the match

When the match starts the game will be informed of which player should start playing. 

```javascript
onMatchStart: function(playerIdToPlayNext){
    // ...
},
```

### Send messages to the opponent

If the game requires to send messages to the opponent that should not be evaluated by the server-side rules, it can use the PG.playerMessage.

```javascript
PG.playerMessage(
    { message: 'message' }    // any message content can be passed here
);
```

Messages sent by the opponent will be processed by the onPlayerMessage callback function.

```javascript
onPlayerMessage: function(messageDetails) {
    // ...
},
```

### Perform moves

If it is the current player turn, the game should allow the player to make a move and the send it to the platform.

```javascript
PG.move({
    pos: 0 // any move details can be passed here
});
```

If the move passed the server-side rules validation, the server will respond with a confirmation message that will be handled by the onMoveValid callback function. Moves performed by the opponent will also be handled by this callback function.

If a move ends the game, the gameResults parameter will indicate how the game ended. Possible values are 'won', 'lost', and 'draw'.

```javascript
onMoveValid: function(playerIdWhoSentTheMove, playerIdToPlayNext, moveDetails, moveResults, gameResults) {
    // ...
},
```

If the move does not pass the server-side rules validation, the game will be notified in the onMoveInvalid callback function.

```javascript
onMoveInvalid: function(playerIdWhoSentTheMove, playerIdToPlayNext) {
    // ...
},
```

### Match end

When the game ends, the onMatchEnd callback function is called.

```javascript
onMatchEnd: function(gameResults) {
    switch (gameResults) {
        case 'won':
            // ...
        break;
        case 'lost':
            // ...
        break;
        case 'draw':
            // ...
        break;
    }
},
```

### Show platform menu

The game must implement a way to allow the player to see the platform menu. When the user indicates that he wants to se the menu call PG.showMenu.

```javascript
PG.showMenu();
```

### Handle tv remote control input

In the TV environment, all the remote control buttons are passed to the game in the onKeyPress callback function. Possible values are: 'left', 'right', 'up', 'down' and 'enter'.

```javascript
onKeyPress: function(key) {
    switch(key) {
        case 'left':
            // ...
            break;
        case 'right':
            // ...
            break;
        case 'up':
            // ...
            break;
        case 'down':
            // ...
            break;
        case 'enter':
            // ...
            break;
    }
}
```

## License
Copyright (c) 2013 Present Technologies  
