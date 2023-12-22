import React, { useEffect, useState } from 'react';
import { Button, Col, Nav, NavItem, NavLink, Row } from 'reactstrap';
import { FaArrowLeft } from "react-icons/fa";

//Componentes
import DadosPrimario from './DadosPrimario';
import TratamentoPaciente from './TratamentoPaciente';
import ComposicaoFamiliar from './ComposicaoFamiliar';
import SituacaoHabitacional from './SituacaoHabitacional';

//Context
import { useAuth } from '../../../../Context/useAuth';

//Service
import { api_GET } from '../../../../Service/api';

//Helpers
import { ShowMessage } from '../../../../helpers/ShowMessage';
import PerfilPaciente from './PerfilPaciente';

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
                return <PerfilPaciente
                    paciente={paciente}
                    loadPaciente={loadPaciente}
                    showLoading={showLoading}
                    setPaciente={setPaciente}
                />
            case 3:
                return <TratamentoPaciente
                    paciente={paciente}
                    loadPaciente={loadPaciente}
                    showLoading={showLoading}
                    setPaciente={setPaciente}
                />
            case 4:
                return <SituacaoHabitacional
                    paciente={paciente}
                    loadPaciente={loadPaciente}
                    showLoading={showLoading}
                    setPaciente={setPaciente}
                />
            case 5:
                return <ComposicaoFamiliar
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
                    <Button color='secondary' className='text-white' onClick={() => handleVoltar()}>
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
                                className={activeStep == 1 ? "active fw-bold text-primary" : "text-secondary"}
                                onClick={() => { setActiveStep(1); }}
                            >
                                Dados Primário
                            </NavLink>
                        </NavItem>
                        <NavItem className='ms-2'>
                            <NavLink
                                role='button'
                                style={{ backgroundColor: activeStep == 2 ? "#fff" : "#ccc" }}
                                className={activeStep == 2 ? "active fw-bold text-primary" : "text-secondary"}
                                onClick={() => {
                                    if (paciente == null) {
                                        ShowMessage({
                                            title: 'Aviso',
                                            text: 'Salve primeiro os dados primarios do paciente para avança para outras telas.',
                                            icon: 'warning'
                                        });
                                        return;
                                    }
                                    setActiveStep(2);
                                }}
                            >
                                Perfil Paciente
                            </NavLink>
                        </NavItem>
                        <NavItem className='ms-2'>
                            <NavLink
                                role='button'
                                style={{ backgroundColor: activeStep == 3 ? "#fff" : "#ccc" }}
                                className={activeStep == 3 ? "active fw-bold text-primary" : "text-secondary"}
                                onClick={() => {
                                    if (paciente == null) {
                                        ShowMessage({
                                            title: 'Aviso',
                                            text: 'Salve primeiro os dados primarios do paciente para avança para outras telas.',
                                            icon: 'warning'
                                        });
                                        return;
                                    }
                                    setActiveStep(3);
                                }}
                            >
                                Situação Habitacional
                            </NavLink>
                        </NavItem>
                        <NavItem className='ms-2'>
                            <NavLink
                                role='button'
                                style={{ backgroundColor: activeStep == 4 ? "#fff" : "#ccc" }}
                                className={activeStep == 4 ? "active fw-bold text-primary" : "text-secondary"}
                                onClick={() => {
                                    if (paciente == null) {
                                        ShowMessage({
                                            title: 'Aviso',
                                            text: 'Salve primeiro os dados primarios do paciente para avança para outras telas.',
                                            icon: 'warning'
                                        });
                                        return;
                                    }
                                    setActiveStep(4);
                                }}
                            >
                                Composição Familiar
                            </NavLink>
                        </NavItem>
                        <NavItem className='ms-2'>
                            <NavLink
                                role='button'
                                style={{ backgroundColor: activeStep == 5 ? "#fff" : "#ccc" }}
                                className={activeStep == 5 ? "active fw-bold text-primary" : "text-secondary"}
                                onClick={() => {
                                    if (paciente == null) {
                                        ShowMessage({
                                            title: 'Aviso',
                                            text: 'Salve primeiro os dados primarios do paciente para avança para outras telas.',
                                            icon: 'warning'
                                        });
                                        return;
                                    }
                                    setActiveStep(5);
                                }}
                            >
                                Tratamentos do Paciente
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
