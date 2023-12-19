import React, { useEffect, useState } from 'react';
import { Button, Col, Nav, NavItem, NavLink, Row } from 'reactstrap';
import { FaArrowLeft } from "react-icons/fa";

//Componentes
import DadosPrimario from './DadosPrimario';
import Tratamento from './Tratamento';

//Context
import { useAuth } from '../../../../Context/useAuth';

//Service
import { api_GET } from '../../../../Service/apiConfig';

//Helpers
import { ShowMessage } from '../../../../helpers/ShowMessage';

export default function NovoPaciente({ id = null, handleVoltar }) {
    const { showLoading, loding } = useAuth();

    const [activeStep, setActiveStep] = useState(1);
    const [paciente, setPaciente] = useState(null);

    const loadPaciente = async (id) => {
        showLoading(true);
        try {
            let response = await api_GET(`Paciente/${id}`);
            const { data } = response;
            setPaciente(data);
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
        if (id != null)
            loadPaciente(id)
    }, [])

    const getContent = () => {
        switch (activeStep) {
            case 1:
                return <DadosPrimario
                    paciente={paciente}
                    loadPaciente={loadPaciente}
                    showLoading={showLoading}
                    setPaciente={setPaciente}
                />
            case 2:
                return <Tratamento
                    paciente={paciente}
                    loadPaciente={loadPaciente}
                    showLoading={showLoading}
                    setPaciente={setPaciente}
                />
        }
    }

    return (
        <>
            <Row>
                <Col lg={12} md={12} className='mb-2 d-flex justify-content-end'>
                    <Button color='primary' className='text-white' onClick={() => handleVoltar()}>
                        <FaArrowLeft color='#fff' /> Voltar
                    </Button>
                </Col>
            </Row>
            <div className='bg-white p-3 rounded shadow'>

                <Row>
                    <Nav tabs>
                        <NavItem className='ms-2'>
                            <NavLink
                                role='button'
                                style={{ backgroundColor: activeStep == 1 ? "#fff" : "#ccc" }}
                                className={activeStep == 1 ? "active fw-bold text-success" : "text-secondary"}
                                onClick={() => { setActiveStep(1); }}
                            >
                                Dado Primário
                            </NavLink>
                        </NavItem>
                        <NavItem className='ms-2'>
                            <NavLink
                                role='button'
                                style={{ backgroundColor: activeStep == 2 ? "#fff" : "#ccc" }}
                                className={activeStep == 2 ? "active fw-bold text-success" : "text-secondary"}
                                onClick={() => { setActiveStep(2); }}
                            >
                                Tratamento
                            </NavLink>
                        </NavItem>
                    </Nav>
                    <div className="mt-4">
                        {getContent()}
                    </div>
                </Row >
            </div>
        </>
    )
}
