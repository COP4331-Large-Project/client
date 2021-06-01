import '../../scss/floating-button.scss';

type FloatingButtonProps = {
  onClick?: () => void,
  children: React.ReactNode,
}

function FloatingButton({ onClick, children = <> </> }: FloatingButtonProps): JSX.Element {
  return (
    <button onClick={onClick} className="floating-button">
      {children}
    </button>
  );
}

export default FloatingButton;
