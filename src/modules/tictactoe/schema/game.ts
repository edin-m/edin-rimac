import mongoose from 'mongoose';
import { model, Schema } from 'mongoose';
import { gameTypes } from '../constants';

const moveSchema = new Schema({
    playerId: mongoose.Types.ObjectId,
    row: Number,
    col: Number,
    val: {
        type: String,
        enum: ['X', 'O', '_'],
        default: '_'
    }
});

const gameSchema = new Schema({
    gameType: {
        type: String,
        enum: [gameTypes.sp, gameTypes.mp],
        default: gameTypes.sp
    },
    moves: [moveSchema],
    state: [String],
    player1: mongoose.Types.ObjectId,
    player2: mongoose.Types.ObjectId
});

export default model('Game', gameSchema);

