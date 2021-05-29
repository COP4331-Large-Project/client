import '../../scss/floating-button.scss';

type FloatingButtonProps = {
  onClick?: () => void,
  children: JSX.Element,
}

function FloatingButton({ onClick, children = <> </> }: FloatingButtonProps): JSX.Element {
  return (
    <button onClick={onClick} className="floating-button">
      {children}
    </button>
  );
}

export default FloatingButton;
