import React, { useState } from 'react'
import { useEffect } from 'react';
import { AddActionTable, RemoveActionTable, SeachActionTable } from '../../../../Constants/ActionsTable';
import { Button, Col, Row } from 'reactstrap';
import { FaArrowLeft } from 'react-icons/fa6';

//helpers
import { mascaraCPF, mascaraTelefone } from '../../../../helpers/ValidadacaoDocumentos';
import { ShowConfirmation, ShowMessage } from '../../../../helpers/ShowMessage';

//Components
import TableCustom from '../../../../Components/TableCustom';
import FichaPaciente from '../../ConsultaPaciente/components/FichaPaciente';

//Services
import { api_DELETE, api_PUT } from '../../../../Service/api';

//Context
import { useAuth } from '../../../../Context/useAuth';

export default function TabelaCard({ itemCard, handleVoltar }) {
    const { showLoading } = useAuth();
    const [columns, setColumns] = useState([]);

    useEffect(() => {
        if (itemCard) {
            if (itemCard.tipo == "Paciente") {
                setColumns([
                    { title: 'Nome', field: 'nome' },
                    { title: 'Endereço', field: 'endereco' },
                    { title: 'Estado Civil', field: 'statusCivil' },
                    { title: 'Naturalidade', field: 'naturalidade' },
                    { title: 'DataNascimento', field: 'dataNascimento' },
                    { title: 'CPF', field: 'cpf', render: (rowDate) => <>{mascaraCPF(rowDate.cpf)}</> },
                    { title: 'Status', field: 'status', render: (rowDate) => <>{rowDate.status ? "Ativo" : "Inativo"}</> },
                ]);
            }
            if (itemCard.tipo == "Doação") {
                setColumns([
                    { title: 'Nome do Doador', field: 'nomeDoador' },
                    { title: 'Telefone', field: 'telefone', render: (rowDate) => <>{mascaraTelefone(rowDate.telefone)}</> },
                    { title: 'Valor de Doação', field: 'valorDoacao', render: (rowDate) => <>{rowDate.valorDoacao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</> },
                    { title: 'Data da Doação', field: 'dataDoacao' },
                    { title: 'Status da Doação', field: 'statusDoacao' },
                    { title: 'Tipo de Envior', field: 'tipoDeEnvioValor' },
                ]);
            }
        }
    }, [itemCard]);

    const [pacienteId, setpacienteId] = useState(null);
    const handleSearchPaciente = (rowData) => {
        setpacienteId(rowData.id);
    }

    const confirmaDoacao = async (rowData) => {
        try {
            showLoading(true);
            let response = await api_PUT(`Doacao/${rowData.id}/${true}`);
            showLoading(false);
            ShowMessage({
                title: 'Sucesso',
                text: "Sucesso na Operação",
                icon: 'success'
            }, () => { handleVoltar() });
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

    const handleAddConfirmacao = (rowData) => {
        if (rowData.statusDoacao == "Pendente")
            return AddActionTable(confirmaDoacao);
        else
            return null;
    }

    const handleRemoveDoacao = async (rowData) => {
        const resposta = await ShowConfirmation({ title: "", text: "Você tem certeza que quer deletar essa doação?" });
        if (resposta) {
            try {
                showLoading(true);
                let response = await api_DELETE(`Doacao/${rowData.id}`);

                showLoading(false);
                ShowMessage({
                    title: 'Sucesso',
                    text: 'Operação Realizado com sucesso',
                    icon: 'success'
                }, () => { handleVoltar() });

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
    }

    const _actions = itemCard.tipo == "Doação" ? [handleAddConfirmacao, RemoveActionTable(handleRemoveDoacao)] : [SeachActionTable(handleSearchPaciente)];

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
                                title={itemCard.tipo == "Doação" ? `Lista de Doações ${itemCard?.subTitulo}` : `Lista de pacientes ${itemCard?.subTitulo}`}
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
