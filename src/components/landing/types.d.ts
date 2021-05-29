
type CardType = 'login' | 'register' | 'forgotPassword'

export type CardProps = {
    switchCard: (card: CardType) => void;
}