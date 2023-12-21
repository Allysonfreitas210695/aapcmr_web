import React, { useEffect, useState } from 'react'
import { Card, CardText, CardBody, Row, Col } from 'reactstrap';

//Context
import { useAuth } from '../../../Context/useAuth';

//Services
import { api_POST } from '../../../Service/api';

//Helpers
import { ShowMessage } from '../../../helpers/ShowMessage';

export default function Dashboard() {
    const { showLoading } = useAuth();
    const [listDasboard, setListDasboard] = useState([]);

    const loadDashboard = async () => {
        showLoading(true);
        try {
            let response = await api_POST("DashBoard", {dataInical: null, dataFinal: null});
            const { data } = response;
            setListDasboard(data);
        } catch (error) {
            ShowMessage({
                title: 'Error',
                text: error?.message ?? "Erro na Operação",
                icon: 'error'
            });
            return;
        } finally {
            showLoading(false);
        }
    }

    useEffect(() => {
        loadDashboard();
    }, []);

    return (
        <>
            <Row>
                <Col>
                </Col>
            </Row>
            <Row>
                <Col sm={12} lg={4} className='mb-3'>
                    <Card style={{ cursor: "pointer" }} className='shadow bg-white rounded'>
                        <CardBody className="d-flex flex-column justify-content-center align-items-center">
                            <div className="d-flex justify-content-center align-items-center" style={{ width: "120px", height: "120px" }}>
                                <span className="display-3 text-center">{listDasboard?.doacoesPendenteDtos?.length}</span>
                            </div>
                            <CardText className='fw-bold'>
                                Doações Pendentes
                            </CardText>
                        </CardBody>
                    </Card>
                </Col>
                <Col sm={12} lg={4} className='mb-3'>
                    <Card style={{ cursor: "pointer" }} className='shadow bg-white rounded'>
                        <CardBody className="d-flex flex-column justify-content-center align-items-center">
                            <div className="d-flex justify-content-center align-items-center" style={{ width: "120px", height: "120px" }}>
                                <span className="display-3 text-center">{listDasboard?.doacoesRecebidasDtos?.length}</span>
                            </div>
                            <CardText className='fw-bold'>
                                Doações Recebidas
                            </CardText>
                        </CardBody>
                    </Card>
                </Col>
                <Col sm={12} lg={4} className='mb-3'>
                    <Card style={{ cursor: "pointer" }} className='shadow bg-white rounded'>
                        <CardBody className="d-flex flex-column justify-content-center align-items-center">
                            <div className="d-flex justify-content-center align-items-center" style={{ width: "120px", height: "120px" }}>
                                <span className="display-3 text-center">{listDasboard?.pacientesAtivoDtos?.length}</span>
                            </div>
                            <CardText className='fw-bold'>
                                Pacientes Ativos no Sistema
                            </CardText>
                        </CardBody>
                    </Card>
                </Col>
                <Col sm={12} lg={4} className='mb-3'>
                    <Card style={{ cursor: "pointer" }} className='shadow bg-white rounded'>
                        <CardBody className="d-flex flex-column justify-content-center align-items-center">
                            <div className="d-flex justify-content-center align-items-center" style={{ width: "120px", height: "120px" }}>
                                <span className="display-3 text-center">{listDasboard?.pacientesInativosDtos?.length}</span>
                            </div>
                            <CardText className='fw-bold'>
                                Pacientes Inativo no Sistema
                            </CardText>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </>
    )
}
