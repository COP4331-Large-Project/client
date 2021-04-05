import React, { useState } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import LoginCard from '../components/landing/LoginCard.jsx';
import ForgotPassword from '../components/landing/ForgotPassword.jsx';
import RegisterCard from '../components/landing/RegisterCard.jsx';

import '../scss/animation.scss';
import '../scss/landing.scss';

function LandingPage() {
  const nodeRef = React.useRef(null);
  const [card, setCard] = useState('login');

  const cards = {
    login: <LoginCard switchCard={setCard} />,
    register: <RegisterCard switchCard={setCard} />,
    forgotPassword: <ForgotPassword switchCard={setCard} />,
  };

  return (
    <div className="landing-container">
      <div className="landing-body">
        <SwitchTransition>
          <CSSTransition
            nodeRef={nodeRef}
            key={card}
            in
            timeout={450}
            classNames="fade"
          >
            <div className="landing-header-container" ref={nodeRef}>
              <div className="landing-title-container">
                <h1 className="title-header">ImageUs</h1>
                <h1 className="landing-header">
                  Image sharing made simple and easy
                </h1>
                <div className="form-area">{cards[card]}</div>
              </div>
            </div>
          </CSSTransition>
        </SwitchTransition>
      </div>
    </div>
  );
}

export default LandingPage;
