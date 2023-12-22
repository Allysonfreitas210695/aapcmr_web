import React, { useState } from 'react'
import { Button, Col, Row } from 'reactstrap';
import { FaArrowLeft } from 'react-icons/fa6';

//Components
import TableCustom from '../../../../../Components/TableCustom';

//Constants
import { SeachActionTable } from '../../../../../Constants/ActionsTable';

//Services
import { mascaraCPF } from '../../../../../helpers/ValidadacaoDocumentos';

//
import FichaPaciente from '../../../ConsultaPaciente/components/FichaPaciente';


export default function Paciente({ itemCard, handleVoltar }) {
    const [columns, setColumns] = useState([
        { title: 'Nome', field: 'nome' },
        { title: 'Endereço', field: 'endereco' },
        { title: 'Estado Civil', field: 'statusCivil' },
        { title: 'Naturalidade', field: 'naturalidade' },
        { title: 'DataNascimento', field: 'dataNascimento' },
        { title: 'CPF', field: 'cpf', render: (rowDate) => <>{mascaraCPF(rowDate.cpf)}</> },
        { title: 'Status', field: 'status', render: (rowDate) => <>{rowDate.status ? "Ativo" : "Inativo"}</> },
    ]);

    const [pacienteId, setpacienteId] = useState(null);
    const handleSearchPaciente = (rowData) => {
        setpacienteId(rowData.id);
    }

    const _actions = [SeachActionTable(handleSearchPaciente)];

    return (
        <>
            {!pacienteId &&
                <>
                    <Row>
                        <Col lg={12} md={12} className='mb-2 d-flex justify-content-end'>
                            <Button color='secondary' className='text-white' onClick={() => handleVoltar()}>
                                <FaArrowLeft color='#fff' /> Voltar
                            </Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={12} md={12}>
                            <TableCustom
                                title={`Lista de pacientes ${itemCard?.subTitulo}`}
                                columns={columns}
                                data={itemCard.listaDashboard}
                                actions={_actions}
                            />
                        </Col>
                    </Row>
                </>
            }
            {pacienteId &&
                <FichaPaciente
                    id={pacienteId}
                    handleVoltar={handleVoltar}
                />
            }
        </>
    )
}
