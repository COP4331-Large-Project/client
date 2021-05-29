import React, { useState, useEffect } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { useHistory } from 'react-router-dom';
import LoginCard from '../components/landing/LoginCard.jsx';
import ForgotPassword from '../components/landing/ForgotPassword.jsx';
import RegisterCard from '../components/landing/RegisterCard.jsx';

import '../scss/animation.scss';
import '../scss/landing.scss';

function LandingPage(): JSX.Element {
  const nodeRef = React.useRef(null);
  const [card, setCard] = useState('login');
  const history = useHistory();

  const cards: Record<string, JSX.Element> = {
    login: <LoginCard switchCard={setCard} />,
    register: <RegisterCard switchCard={setCard} />,
    forgotPassword: <ForgotPassword switchCard={setCard} />,
  };

  useEffect(() => {
    const userId = localStorage.getItem('id');
    const token = localStorage.getItem('token');

    // Automatically go to the main page if the user
    // is already authenticated
    if (userId && token) {
      history.push('/');
    }
  }, []);

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
