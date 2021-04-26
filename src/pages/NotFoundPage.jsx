import '../scss/not-found-page.scss';
import React from 'react';
import { motion } from 'framer-motion';
import { useHistory } from 'react-router-dom';
import gif from '../assets/404.gif';
import Card from '../components/Card.jsx';
import Button from '../components/Button.jsx';

const animationVariants = {
  hidden: {
    opacity: 0,
    transform: 'translateY(50%)',
  },
  show: {
    opacity: 1,
    transform: 'translateY(0%)',
  },
};

const animationOpts = {
  delay: 0.5,
  duration: 1.5,
  ease: [0.16, 1, 0.3, 1],
};

function NotFoundPage() {
  const history = useHistory();

  return (
    <div className="not-found-page">
      <div className="card-overlay">
        <motion.div
          initial="hidden"
          animate="show"
          className="card-wrapper"
          transition={animationOpts}
          variants={animationVariants}
        >
          <Card className="not-found-card">
            <h1 className="card-title">{"I Think You're Lost"}</h1>
            <p className="card-description">
              {"We couldn't find the page you were looking for..."}
            </p>
            <img src={gif} alt="Animated GIF" />
            <Button className="back-btn" onClick={() => history.push('/')}>
              Back Home
            </Button>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default NotFoundPage;
