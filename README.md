# Phune Gaming SDK for JavaScript

Build HTML5 games for Phune Gaming platform.

## Requirements

Building Phune Gaming SDK requires you to have previously installed [Node.js](http://nodejs.org/).

## Build

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

```js
onMatchPrepare: function(player, opponent, timeToPlay, deviceType) {
    // ...
},
```

### Match starts

When the match starts the game will be informed of which player should start playing. 

```js
onMatchStart: function(playerIdToPlayNext){
    // ...
},
```

### Receive move confirmations and opponent moves

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

### Handle messages from the server

Responses to messages sent to the server will be processed in the onServerMatch callback function.

```js
onServerMessage: function(playerIdWhoSentTheMessage, messageDetails, messageResults) {
    // ...
},
```

### Handle message from the opponent

Messages sent by the opponent will be processed by the onPlayerMessage callback function.

```js
onPlayerMessage: function(messageDetails) {
    // ...
},
```

### Match ended

When the game ends, the onMatchEnd callback function is called with the end condition. Possible values are 'won', 'lost', and 'draw'.

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

### Handle TV remote control input

In the TV environment, the information of remote control buttons that were pressed, are sent to the game to be handled in the onKeyPress callback function. Possible values are: 'left', 'right', 'up', 'down' and 'enter'.

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

The Phune Gaming SDK provides an [API](http://phune-gaming.github.io/pg-sdk-js/) with the public methods detailed bellow.

### Start the match

During the match preparation phase the game should inform the platform when it should be shown to the player and when it is ready to start the match. 

If the game requires user interaction to configure the match details, it should request the game to be shown to the user calling PG.prepared. Then it can send messages to be evaluated by the server-side rules.

```js
PG.prepared();
```

When it is ready to start the match, it should call PG.ready. If PG.prepared has not been called, the game will now be shown to the user.

```js
PG.ready();
```

### Send messages to the server

It is possible to send messages to be evaluated by the server side-rules. You can specify if you want the response to be sent to both player or only to you. Additionally you can also indicate if you want the messages to be processed by the server-side rules in order of arrival or can be executed in parallel.

```js
PG.serverMessage(
    { message: 'message' },    // any message content can be passed here
    false,                     // should the response be sent to both players
    true                       // should the message be processed by the order of arrival
);
```

### Send messages to the opponent

If the game requires to send messages to the opponent that should not be evaluated by the server-side rules, it can use the PG.playerMessage. Optionally, you can specify if you do not want to allow to send more than one message within the specified time in milliseconds. If this is called more than once during this interval only the last message will be sent.

```js
PG.playerMessage(
    { message: 'message' },    // any message content can be passed here
    150                        // do not send more than one message during this interval
);
```

### Perform moves

If it is the current player turn, the game should allow the player to make a move and then send it to the platform.

```js
PG.move({
    pos: 0 // any move details can be passed here
});
```

### Show the platform menu

The game must implement a way to allow the player to see the platform menu. When the user indicates that he wants to see the menu call PG.showMenu.

```js
PG.showMenu();
```

## License

Copyright (c) 2014 Present Technologies

Licensed under the MIT license.
