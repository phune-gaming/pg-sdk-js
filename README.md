# Phune Gaming SDK for JavaScript

Build HTML5 games for Phune Gaming platform.

## Requirements

Building Phune Gaming SDK requires you to have previously installed [Node.js](http://nodejs.org/).

## Build

Install Grunt's command line interface globally:

```
npm install -g grunt-cli
```

Install Node.js dependencies:

```
npm install
```

Build the SDK:

```
grunt build
```

Clean, lint, and build the SDK:

```
grunt
```

Generate the API documentation:

```
grunt docs
```

There are many other tasks that can be run through Grunt. For the complete list of available tasks run:

```
grunt --help
```

## Getting Started

In your web page HTML, include the Phune Gaming SDK file:

```html
<script src="PG.min.js"></script>
```

Initialize the SDK by calling `PG.init` and define the callback functions that will handle all the matchmaking state changes and game events:

```js
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

Please find below a detailed description for each callback.

### Prepare the match

During the match preparation phase, the game should build the user interface and get ready to start playing. It is provided with the details of the player and opponent, the time allowed for each player to make a move and in which device type the game is running (mobile or tv).

If the game requires user interaction to configure the match details, it should request the game to be shown to the user calling PG.prepared. Then it can send messages to be evaluated by the server-side rules using PG.serverMessage.

When it is ready to start the match, it should call PG.ready. If PG.prepared has not been called, the game will be shown to the user now.

```js
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

```js
onServerMessage: function(playerIdWhoSentTheMessage, messageDetails, messageResults) {
    // ...
},
```

### Start the match

When the match starts the game will be informed of which player should start playing. 

```js
onMatchStart: function(playerIdToPlayNext){
    // ...
},
```

### Send messages to the opponent

If the game requires to send messages to the opponent that should not be evaluated by the server-side rules, it can use the PG.playerMessage.

```js
PG.playerMessage(
    { message: 'message' }    // any message content can be passed here
);
```

Messages sent by the opponent will be processed by the onPlayerMessage callback function.

```js
onPlayerMessage: function(messageDetails) {
    // ...
},
```

### Perform moves

If it is the current player turn, the game should allow the player to make a move and the send it to the platform.

```js
PG.move({
    pos: 0 // any move details can be passed here
});
```

If the move passed the server-side rules validation, the server will respond with a confirmation message that will be handled by the onMoveValid callback function. Moves performed by the opponent will also be handled by this callback function.

If a move ends the game, the gameResults parameter will indicate how the game ended. Possible values are 'won', 'lost', and 'draw'.

```js
onMoveValid: function(playerIdWhoSentTheMove, playerIdToPlayNext, moveDetails, moveResults, gameResults) {
    // ...
},
```

If the move does not pass the server-side rules validation, the game will be notified in the onMoveInvalid callback function.

```js
onMoveInvalid: function(playerIdWhoSentTheMove, playerIdToPlayNext) {
    // ...
},
```

### Match end

When the game ends, the onMatchEnd callback function is called.

```js
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

```js
PG.showMenu();
```

### Handle tv remote control input

In the TV environment, all the remote control buttons are passed to the game in the onKeyPress callback function. Possible values are: 'left', 'right', 'up', 'down' and 'enter'.

```js
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

## Public API

The Phune Gaming SDK provides an [API](http://phune-gaming.github.io/pg-sdk-js/) the public methods detailed bellow.

## License

Copyright (c) 2014 Present Technologies

Licensed under the MIT license.
