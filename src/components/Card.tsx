import '../scss/card.scss';

type CardProps = {
  className?: string;
  children?: React.ReactNode;
};

function Card({ className, children }: CardProps): JSX.Element {
  return (
    <div
      className={`card ${className}`}
    >
      {children}
    </div>
  );
}

export default Card;
