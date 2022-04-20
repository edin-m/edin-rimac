import { describe, it } from 'mocha';
import { expect } from 'chai';

import { GameResult, TicTacToe } from "./tictactoe";

describe('test tictactoe', () => {
    it('tests game result', () => {
        const data = [{
            state: [
                'OOX',
                'XOO',
                '_XO'
            ],
            expectedResult: GameResult.OWon
        },
        {
            state: [
                'OOX',
                'XXO',
                'OXO'
            ],
            expectedResult: GameResult.Draw
        }];

        data.forEach(item => {
            const ttt = new TicTacToe(item.state as [string, string, string]);
            const result = ttt.getGameResult();
            expect(result).to.equal(item.expectedResult);
        });
    });

    it('test combinations', () => {
        const game = new TicTacToe([], 4);
        console.log(game.combinations);
    });
});

