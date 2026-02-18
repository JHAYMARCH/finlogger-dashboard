import React from 'react';
import { Card } from 'react-bootstrap';

const OverviewCard = ({ cardIcon, cardText, cardTitle }) => {
  return (
    <Card className="overview-card">
      <Card.Body>
        <div className="d-flex align-items-center">
          {cardIcon ? <img src={cardIcon} alt={cardTitle} /> : null}
          <div>
            <h5>{cardText}</h5>
            <p className="mb-0">{cardTitle}</p>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default OverviewCard;
