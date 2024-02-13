import React, { useEffect, useState } from 'react';
import { Card, CardText, CardBody, Row, Col, Button } from 'reactstrap';

//Context
import { useAuth } from '../../../Context/useAuth';

//Services
import { api_POST } from '../../../Service/api';

//Helpers
import { ShowMessage } from '../../../helpers/ShowMessage';

//CSS
import './index.css';
import TabelaCard from './components/TabelaCard';
import ControlledInput from '../../../Components/ControlledInput';
import { useForm } from 'react-hook-form';
import { FaFilter } from 'react-icons/fa6';
import moment from 'moment';

export default function Dashboard() {
  const { handleSubmit, control } = useForm({
    mode: 'onBlur'
  });

  const { showLoading } = useAuth();

  //Pegar a lista de informações na API
  const [listDasboard, setListDasboard] = useState([]);

  //State para pegar qual card clicado e armazenar as informações
  const [itemCard, setItemCard] = useState(null);

  //State para filtro
  const [filtroDashBorad, setFiltroDashBorad] = useState({ dataInicial: null, dataFinal: null });

  const loadDashboard = async (json) => {
    showLoading(true);
    try {
      let response = await api_POST('DashBoard', json);
      const { data } = response;
      setListDasboard(data);
    } catch (error) {
      ShowMessage({
        title: 'Error',
        text: error?.message ?? 'Erro na Operação',
        icon: 'error'
      });
      return;
    } finally {
      showLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard(filtroDashBorad);
  }, []);

  const handleVoltar = () => {
    setItemCard(null);
    loadDashboard(filtroDashBorad);
  };

  const onSubmit = (data) => {
    setFiltroDashBorad({
      dataInicial: moment(data.dataInicial).format('YYYY-MM-DD HH:mm:ss'),
      dataFinal: moment(data.dataFinal).format('YYYY-MM-DD HH:mm:ss')
    });
    loadDashboard({
      dataInicial: moment(data.dataInicial).format('YYYY-MM-DD HH:mm:ss'),
      dataFinal: moment(data.dataFinal).format('YYYY-MM-DD HH:mm:ss')
    });
  };

  return (
    <>
      {!itemCard && (
        <>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col sm={12} lg={4} className="mb-3">
                <ControlledInput
                  control={control}
                  name="dataInicial"
                  label={
                    <>
                      <span className="text-danger">*</span> Data inicial
                    </>
                  }
                  type="date"
                  rules={{
                    required: true
                  }}
                />
              </Col>
              <Col sm={12} lg={4} className="mb-3">
                <ControlledInput
                  control={control}
                  name="dataFinal"
                  label={
                    <>
                      <span className="text-danger">*</span> Data Final
                    </>
                  }
                  type="date"
                  rules={{
                    required: true
                  }}
                />
              </Col>
              <Col sm={12} lg={4} className="mb-3">
                <br />
                <Button color="primary" className=" mt-2">
                  <FaFilter /> Filtrar
                </Button>
              </Col>
            </Row>
          </form>
          <Row>
            <Col sm={12} lg={12} className="mb-3">
              <h5>Arrecadações</h5>
            </Col>
            <Col sm={12} lg={4} className="mb-3">
              <Card className="shadow bg-white rounded shandow-hover">
                <CardBody className="d-flex flex-column justify-content-center align-items-center">
                  <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ width: '120px', height: '120px' }}
                  >
                    <span className="display-5 text-center">
                      {listDasboard?.valorTotalDoacao?.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      })}
                    </span>
                  </div>
                  <CardText className="fw-bold">Total de Doações</CardText>
                </CardBody>
              </Card>
            </Col>
            <Col sm={12} lg={4} className="mb-3">
              <Card className="shadow bg-white rounded shandow-hover">
                <CardBody className="d-flex flex-column justify-content-center align-items-center">
                  <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ width: '120px', height: '120px' }}
                  >
                    <span className="display-5 text-center">
                      {listDasboard?.valorTotalDesposito?.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      })}
                    </span>
                  </div>
                  <CardText className="fw-bold">Doações Por Depósito</CardText>
                </CardBody>
              </Card>
            </Col>
            <Col sm={12} lg={4} className="mb-3">
              <Card className="shadow bg-white rounded shandow-hover">
                <CardBody className="d-flex flex-column justify-content-center align-items-center">
                  <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ width: '120px', height: '120px' }}
                  >
                    <span className="display-5 text-center">
                      {listDasboard?.valorTotalMessageiro?.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      })}
                    </span>
                  </div>
                  <CardText className="fw-bold">Doações Por Mensageiro</CardText>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col sm={12} lg={12} className="mb-3">
              <h5>Doações</h5>
            </Col>
            <Col sm={12} lg={6} className="mb-3">
              <Card
                style={{ cursor: 'pointer' }}
                className="shadow bg-white rounded shandow-hover"
                onClick={() =>
                  setItemCard({
                    tipo: 'Doação',
                    subTitulo: 'Pendentes',
                    listaDashboard: listDasboard?.doacoesPendenteDtos || []
                  })
                }
              >
                <CardBody className="d-flex flex-column justify-content-center align-items-center">
                  <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ width: '120px', height: '120px' }}
                  >
                    <span className="display-5 text-center">
                      {listDasboard?.doacoesPendenteDtos?.length}
                    </span>
                  </div>
                  <CardText className="fw-bold">Doações Pendentes</CardText>
                </CardBody>
              </Card>
            </Col>
            <Col sm={12} lg={6} className="mb-3">
              <Card
                style={{ cursor: 'pointer' }}
                className="shadow bg-white rounded shandow-hover"
                onClick={() =>
                  setItemCard({
                    tipo: 'Doação',
                    subTitulo: 'Recebidas',
                    listaDashboard: listDasboard?.doacoesRecebidasDtos || []
                  })
                }
              >
                <CardBody className="d-flex flex-column justify-content-center align-items-center">
                  <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ width: '120px', height: '120px' }}
                  >
                    <span className="display-5 text-center">
                      {listDasboard?.doacoesRecebidasDtos?.length}
                    </span>
                  </div>
                  <CardText className="fw-bold">Doações Recebidas</CardText>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col sm={12} lg={12} className="mb-3">
              <h5>Pacientes</h5>
            </Col>
            <Col sm={12} lg={6} className="mb-3">
              <Card
                style={{ cursor: 'pointer' }}
                className="shadow bg-white rounded shandow-hover"
                onClick={() =>
                  setItemCard({
                    tipo: 'Paciente',
                    subTitulo: 'Ativos',
                    listaDashboard: listDasboard?.pacientesAtivoDtos || []
                  })
                }
              >
                <CardBody className="d-flex flex-column justify-content-center align-items-center">
                  <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ width: '120px', height: '120px' }}
                  >
                    <span className="display-5 text-center">
                      {listDasboard?.pacientesAtivoDtos?.length}
                    </span>
                  </div>
                  <CardText className="fw-bold">Pacientes Ativos no Sistema</CardText>
                </CardBody>
              </Card>
            </Col>
            <Col sm={12} lg={6} className="mb-3">
              <Card
                style={{ cursor: 'pointer' }}
                className="shadow bg-white rounded shandow-hover"
                onClick={() =>
                  setItemCard({
                    tipo: 'Paciente',
                    subTitulo: 'Inativo',
                    listaDashboard: listDasboard?.pacientesInativosDtos || []
                  })
                }
              >
                <CardBody className="d-flex flex-column justify-content-center align-items-center">
                  <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ width: '120px', height: '120px' }}
                  >
                    <span className="display-5 text-center">
                      {listDasboard?.pacientesInativosDtos?.length}
                    </span>
                  </div>
                  <CardText className="fw-bold">Pacientes Inativo no Sistema</CardText>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </>
      )}
      {itemCard && <TabelaCard itemCard={itemCard} handleVoltar={handleVoltar} />}
    </>
  );
}
