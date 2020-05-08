export class FellowPlayerViewModel {
    public name: string;
    public playedCard: boolean;
    public cardText: string;

    constructor(name: string, playedCard: boolean, cardText: string) {
        this.name = name;
        this.playedCard = playedCard;
        this.cardText = cardText;
    }
}