import React, { useEffect, useState } from 'react';
import { Button, Card, CardBody, CardText, Col, Row } from 'reactstrap';
import { FaFileCsv } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

//Rotas
import { AdminRoutes } from '../../../Routes/AdminRoutes';

export default function Relatorios() {
  const navigate = useNavigate();
  const [relatorios, setRelatorios] = useState([]);

  useEffect(() => {
    setRelatorios(
      AdminRoutes.filter((x) => x.relatorio != null && x.relatorio == true)
    );
  }, []);

  return (
    <>
      <Row>
        {relatorios.map((relatorio, index) => (
          <Col sm={12} lg={6} key={index} className="mb-3">
            <Card
              style={{ cursor: 'pointer' }}
              className="shadow bg-white rounded shandow-hover"
              onClick={() => navigate(relatorio.path)}
            >
              <CardBody className="d-flex flex-column justify-content-center align-items-center">
                <strong style={{ fontSize: '18px' }} className="mb-3">
                  {relatorio.name}
                </strong>
                <CardText className="fw-bold mt-2">
                  <Button color="danger">
                    <FaFileCsv /> GERAR RELATÓRIO
                  </Button>
                </CardText>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
}
