import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';

const Header = () => {
  return (
    <header className="header">
      <Container>
        <Row className="align-items-center">
          <Col xs={12} md={6}>
            <h1 className="title mb-0">FinLogger</h1>
          </Col>
          <Col xs={12} md={6}>
            <p className="tagline mb-0">Your financial diary!</p>
            <div className="data-status-badge">Data saved locally</div>
          </Col>
        </Row>
      </Container>
    </header>
  );
};

export default Header;
