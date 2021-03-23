import React, { useState } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import '../../scss/landing.scss';
import LoginCard from './LoginCard.jsx';
import GroupLogin from './GroupLogin.jsx';
import RegisterCard from './RegisterCard.jsx';
import '../../scss/animation.scss';

function LandingPage() {
  const nodeRef = React.useRef(null);
  const [card, setCard] = useState('login');

  const cards = {
    login: <LoginCard switchCard={setCard} />,
    register: <RegisterCard switchCard={setCard} />,
    groupLogin: <GroupLogin switchCard={setCard} />,
  };

  return (
    <div className="landing-container">
      <div className="landing-body">
        <div className="landing-header-container">
          <div>
            <h1 className="title-header">ImageUs</h1>
            <h1 className="landing-header">Welcome back to our app!</h1>
          </div>
        </div>
        <SwitchTransition>
          <CSSTransition
            nodeRef={nodeRef}
            key={card}
            in timeout={300}
            classNames='fade'
          >
            <div ref={nodeRef}>
              {cards[card]}
            </div>
          </CSSTransition>
        </SwitchTransition>

      </div>
    </div>
  );
}

export default LandingPage;
