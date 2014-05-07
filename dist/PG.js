/**
 * Phune Gaming SDK for JavaScript v0.1.2
 *
 * @file Handles the communication between the Phune Gaming platform and the games.
 * @license MIT License <http://opensource.org/licenses/MIT>
 * @copyright Copyright (c) 2014 Present Technologies
 */
(function(window, document) {
    'use strict';

    /**
     * Constructs a new instance of the Phune Gaming SDK.
     *
     * @constructor PG
     * @classdesc Phune Gaming SDK
     */
    var PG = function() {

        var origin = '*', // (document.location.origin) ? document.location.origin : document.location.protocol + '//' + document.location.host,
            result = {
                WON: 'won',
                LOST: 'lost',
                DRAW: 'draw'
            },
            message, lastMessage = null,
            player, opponent;

        /**
         * Get the match result with the correct value based on the winnerPlayerId param.
         *
         * @private
         * @abstract
         * @memberof PG
         * @param {number} winnerPlayerId The id of the player that won the match.
         * @returns {string} A match result valid value.
         */
        var getMatchResult = function(winnerPlayerId) {
            if (typeof winnerPlayerId === 'undefined') {
                return;
            }

            if (winnerPlayerId === player.id) {
                return result.WON;
            } else if (winnerPlayerId === opponent.id) {
                return result.LOST;
            }

            return result.DRAW;
        };

        /**
         * The game should build the user interface and get ready to start playing.
         *
         * @private
         * @abstract
         * @memberof PG
         * @param {Object} player The current player details.
         * @param {Object} opponent The opponent details.
         * @param {string} deviceType Indicates the type of the device where the game is running. Possible values are 'MOBILE' and 'TV'.
         */
        var onMatchPrepare = function(player, opponent, deviceType) {
            throw new Error('onMatchPrepare is not implemented.');
        };

        /**
         * The game can now configure additional match details.
         *
         * @private
         * @abstract
         * @memberof PG
         * @param {number} allowedTime Time allowed for the player to configure the game and start the match.
         */
        var onGameLobby = function(allowedTime) {
            throw new Error('onGameLobby is not implemented.');
        };

        /**
         * The match start confirmation. Only now is the player allowed to play the game.
         *
         * @private
         * @abstract
         * @memberof PG
         * @param {number} playerIdToPlayNext The identifier of the player to whom the next move belongs.
         * @param {number} timeToPlay Time allowed for the player to make a move.
         */
        var onMatchStart = function(playerIdToPlayNext, timeToPlay) {
            throw new Error('onMatchStart is not implemented.');
        };

        /**
         * Acknowledgment to a valid move.
         *
         * @private
         * @abstract
         * @memberof PG
         * @param {number} playerIdWhoSentTheMove The identifier of the player that sent the move.
         * @param {number} playerIdToPlayNext The identifier of the player to whom the next move belongs.
         * @param {Object} moveDetails The move details.
         * @param {Object} moveEvaluation The result of the move validation.
         * @param {string} [matchResult] If the move ended the match, this indicates its result. Possible values are 'won', 'lost' or 'draw'.
         */
        var onMoveValid = function(playerIdWhoSentTheMove, playerIdToPlayNext, moveDetails, moveEvaluation, matchResult) {
            throw new Error('onMoveValid is not implemented.');
        };

        /**
         * Acknowledgment to an invalid move sent by the current player.
         *
         * @private
         * @abstract
         * @memberof PG
         * @param {number} playerIdToPlayNext The identifier of the player to whom the next move belongs.
         * @param {Object} moveEvaluation The result of the move validation.
         */
        var onMoveInvalid = function(playerIdToPlayNext, moveEvaluation) {
            throw new Error('onMoveInvalid is not implemented.');
        };

        /**
         * A message from the server-side rules was received.
         *
         * @private
         * @abstract
         * @memberof PG
         * @param {number} playerWhoSentTheMessage The identifier of the player that sent the message.
         * @param {Object} messageDetails Message specific to a game and unknown to the platform. The developer is advised to have multiple message types with different bodies in order to achieve different goals.
         * @param {Object} messageResult The result returned by the server-side rules.
         */
        var onServerMessage = function(playerIdWhoSentTheMessage, messageDetails, messageResult) {
            throw new Error('onServerMessage is not implemented.');
        };

        /**
         * A message sent directly from another player was received.
         *
         * @private
         * @abstract
         * @memberof PG
         * @param {Object} messageDetails Message specific to a game and unknown to the platform. The developer is advised to have multiple message types with different bodies in order to achieve different goals.
         */
        var onPlayerMessage = function(messageDetails) {
            throw new Error('onPlayerMessage is not implemented.');
        };

        /**
         * Called by the platform when a match end event is received.
         *
         * @private
         * @abstract
         * @memberof PG
         * @param {string} matchResult The match result. Possible values are 'won', 'lost' or 'draw'.
         */
        var onMatchEnd = function(matchResult) {
            throw new Error('onMatchEnd is not implemented.');
        };

        /**
         * A keyboard or TV remote control key was pressed.
         *
         * @private
         * @abstract
         * @memberof PG
         * @param {string} key The key that was pressed. Possible values are 'left', 'right', 'up', 'down' or 'enter'.
         */
        var onKeyPress = function(key) {
            throw new Error('onKeyPress is not implemented.');
        };

        return {
            /**
             * Initialize the Phune Gaming SDK.
             *
             * @public
             * @memberof PG
             * @param {Object} params Object containing all the options to configure the SDK. This includes the mandatory callback functions: onMatchPrepare, onMatchStart, onMoveValid, onMoveInvalid, onMatchEnd, as well as the optional callback functions: onServerMessage, onPlayerMessage and onKeyPress.
             */
            init: function(params) {
                onMatchPrepare = params.onMatchPrepare || onMatchPrepare;
                onGameLobby = params.onGameLobby || onGameLobby;
                onMatchStart = params.onMatchStart || onMatchStart;
                onMoveValid = params.onMoveValid || onMoveValid;
                onMoveInvalid = params.onMoveInvalid || onMoveInvalid;
                onMatchEnd = params.onMatchEnd || onMatchEnd;
                onServerMessage = params.onServerMessage || onServerMessage;
                onPlayerMessage = params.onPlayerMessage || onPlayerMessage;
                onKeyPress = params.onKeyPress || onKeyPress;

                window.addEventListener('message', function(msg) {
                    // if (msg.origin !== origin) {
                    //     console.warn('Origin not recognized: ' + msg.origin);
                    //     return;
                    // }
                    switch (msg.data.type) {
                    case 'matchPrepare':
                        player = msg.data.player;
                        opponent = msg.data.opponent;
                        onMatchPrepare(player, opponent, msg.data.deviceType);
                        break;
                    case 'enterGameLobby':
                        onGameLobby(msg.data.timeout);
                        break;
                    case 'matchStart':
                        onMatchStart(msg.data.nextPlayerId, msg.data.timeout);
                        break;
                    case 'matchMoveValid':
                        onMoveValid(msg.data.playerId, msg.data.nextPlayerId, msg.data.content, msg.data.evaluationContent, getMatchResult(msg.data.winnerPlayerId));
                        break;
                    case 'matchMoveInvalid':
                        onMoveInvalid(msg.data.nextPlayerId, msg.data.evaluationContent);
                        break;
                    case 'matchEnd':
                        onMatchEnd(getMatchResult(msg.data.winnerPlayerId));
                        break;
                    case 'serverMessage':
                        onServerMessage(msg.data.playerId, msg.data.content, msg.data.result);
                        break;
                    case 'playerMessage':
                        onPlayerMessage(msg.data.content);
                        break;
                    case 'keyPress':
                        onKeyPress(msg.data.value);
                        break;
                    }
                });

                // Inform the platform that the game loaded successfully.
                window.parent.postMessage({
                    type: 'loaded'
                }, origin);
            },

            /**
             * Informs the server that the client is ready to start the match.
             *
             * @public
             * @memberof PG
             */
            ready: function() {
                window.parent.postMessage({
                    type: 'ready'
                }, origin);
            },

            /**
             * Informs the server that the game configuration phase ended and the game can start.
             *
             * @public
             * @memberof PG
             */
            exitGameLobby: function() {
                window.parent.postMessage({
                    type: 'exitGameLobby'
                }, origin);
            },

            /**
             * Asks the platform to show the game menu.
             *
             * @public
             * @memberof PG
             */
            showMenu: function() {
                window.parent.postMessage({
                    type: 'showMenu'
                }, origin);
            },

            /**
             * Send a move to the platform server.
             *
             * @public
             * @memberof PG
             * @param {Object} moveDetails The move details.
             * @param {function(Object): boolean} [validate] Optional function to validate the move before sending it to server.
             * @returns {boolean} True when the move is valid or when no validation function was provided.
             */
            sendMove: function(moveDetails, validate) {
                if (validate && !validate(moveDetails)) {
                    return false;
                }

                window.parent.postMessage({
                    type: 'move',
                    content: moveDetails
                }, origin);

                return true;
            },

            /**
             * Send a message to the server-side rules. This message is specific to a game and will not be processed by the platform itself.
             * The response from the server could either be sent to you only or to all players.
             *
             * @public
             * @memberof PG
             * @param {Object} messageDetails The content of the message to be sent.
             * @param {boolean} isAnswerPublic Whether the reply from the server's rules should be sent to all players or not.
             * @param {boolean} [serializeRequest] Whether the messages should be processed in order of arrival or can be executed in parallel.
             */
            sendMessageToServer: function(messageDetails, isAnswerPublic, serializeRequest) {
                window.parent.postMessage({
                    type: 'serverMessage',
                    publicAnswer: isAnswerPublic,
                    requiresConcurrencyControl: (serializeRequest) ? serializeRequest : true,
                    content: messageDetails
                }, origin);
            },

            /**
             * Peer-to-peer message sent directly to another player.
             *
             * @public
             * @memberof PG
             * @param {Object} messageDetails The content of the message to be sent.
             * @param {number} [sendTimeIntervalLimit] Do not allow sending more than one message within the specified time in milliseconds.
             *                 If this is called more than once during this interval only the last message will be sent.
             */
            sendMessageToPlayer: function(messageDetails, sendTimeIntervalLimit) {
                if (!sendTimeIntervalLimit || lastMessage === null) {
                    message = {
                        type: 'playerMessage',
                        content: messageDetails
                    };
                    window.parent.postMessage(message, origin);

                    if (sendTimeIntervalLimit) {
                        setTimeout(function() {
                            if (lastMessage !== message) {
                                message = lastMessage;
                                lastMessage = null;
                                window.parent.postMessage(message, origin);
                            } else {
                                lastMessage = null;
                            }
                        }, sendTimeIntervalLimit);
                    }
                }
                if (sendTimeIntervalLimit) {
                    lastMessage = message;
                }
            }
        };
    };
    window.PG = new PG();

}(window, document));
