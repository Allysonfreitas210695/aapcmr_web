import React, { useState } from 'react'
import { Button, Col, Row } from 'reactstrap';

//Components
import TableCustom from '../../../../../Components/TableCustom';

import { useAuth } from '../../../../../Context/useAuth';

//Constants
import { AddActionTable, EditeActionTable, RemoveActionTable } from '../../../../../Constants/ActionsTable';

//Helpers
import { ShowConfirmation, ShowMessage } from '../../../../../helpers/ShowMessage';
import { mascaraTelefone } from '../../../../../helpers/ValidadacaoDocumentos';

//Services
import { api_DELETE, api_GET, api_PUT } from '../../../../../Service/api';
import { FaArrowLeft } from 'react-icons/fa6';
import { HiPencilAlt } from 'react-icons/hi';
import { useForm } from 'react-hook-form';
import ControlledInput from '../../../../../Components/ControlledInput';
import MaskedInput from '../../../../../Components/MaskedInput';
import { viacep } from '../../../../../helpers/ViaCep';
import { ModalCustom } from '../../../../../Components/Modal';
import moment from 'moment';

export default function Doacao({ itemCard, handleVoltar }) {
    const {
        setValue,
        control,
        getValues
    } = useForm({
        mode: 'onBlur'
    });

    const [doacao, setDoacao] = useState(null);

    const { showLoading } = useAuth();
    const [columns] = useState([
        { title: 'Nome do Doador', field: 'nomeDoador' },
        { title: 'Telefone', field: 'telefone', render: (rowDate) => <>{mascaraTelefone(rowDate.telefone)}</> },
        { title: 'Valor de Doação', field: 'valorDoacao', render: (rowDate) => <>{rowDate.valorDoacao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</> },
        { title: 'Data da Doação', field: 'dataDoacao' },
        { title: 'Status da Doação', field: 'statusDoacao' },
        { title: 'Tipo de Envior', field: 'tipoDeEnvioValor' },
    ]);

    const [cep, setCep] = useState('');
    const handleCepChange = (value) => {
        setCep(value);
    };

    const [telefone, setTelefone] = useState('');
    const handleTelefoneChange = (value) => {
        setTelefone(value);
    };

    //State para controlar modal
    const [isOpenModal, setIsOpenModal] = useState(false);

    const togglemodal = () => setIsOpenModal(!isOpenModal);

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

    const handleEditDoacao = async (rowDate) => {
        try {
            showLoading(true);
            let response = await api_GET(`Doacao/${rowDate.id}`);
            const { data } = response;
            showLoading(false);
            setDoacao(data);
            setValue("nomeDoador", data.nomeDoador)
            setTelefone(data.telefone);
            setCep(data.cep);
            setValue("tipoDeEnvioValor", data.tipoDeEnvioValor);
            setValue("valor", data.valorDoacao);
            setValue("dataDoacao", moment(data.dataDoacao).format("YYYY-MM-DD"));
            setValue("bairro", data.bairro);
            setValue("numero", data.numero);
            setValue("cep", data.cep);
            setValue("complemento", data.complemento);
            setValue("cidade", data.cidade);
            setValue("uf", data.uf);
            setValue("logradouro", data.logradouro);
            setIsOpenModal(true);
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

    const handleOnBlur = async (event) => {
        try {
            showLoading(true);
            const response = await viacep(event);
            showLoading(false);
            setValue("bairro", response.bairro);
            setValue("cep", response.cep);
            setValue("complemento", response.complemento);
            setValue("cidade", response.localidade);
            setValue("uf", response.uf);
            setValue("logradouro", response.logradouro);
        } catch (error) {
            ShowMessage({
                title: 'Error',
                text: "Cep invalido!",
                icon: 'error'
            });
            return;
        }
    }


    const _actions = [handleAddConfirmacao, EditeActionTable(handleEditDoacao), RemoveActionTable(handleRemoveDoacao)];

    const onSubmit = async () => {
        const data = getValues();
        if (data.mensageiro == false && data.deposito == false) {
            ShowMessage({
                title: 'Aviso',
                text: "Marque o modelo de envior da doação se é 'Messageiro' ou 'Deposito'",
                icon: 'warning'
            });
            return;
        }

        if (data.mensageiro == true && data.deposito == true) {
            ShowMessage({
                title: 'Aviso',
                text: "Só pode marca um, seja ele 'Messageiro' ou 'Deposito'",
                icon: 'warning'
            });
            return;
        }

        const json = {
            id: doacao.id,
            nomeDoador: data.nomeDoador,
            telefone: telefone.replace(/[()\-.\s_]/g, ''),
            valorDoacao: data.valor,
            dataDoacao: data.dataDoacao,
            tipoDeEnvioValor: data.mensageiro ? "Mensageiro" : "Depósito",
            bairro: data.bairro,
            cep: cep.replace(/[()\-.\s_]/g, ''),
            complemento: data.complemento,
            cidade: data.cidade,
            numero: data.numero,
            logradouro: data.logradouro,
            uf: data.uf,
            statusDoacao: doacao.statusDoacao
        }

        try {
            showLoading(true);
            await api_PUT("Doacao", json);
            showLoading(false);
            ShowMessage({
                title: 'Sucesso',
                text: 'Operação Realizado com sucesso',
                icon: 'success'
            }, () => { handleVoltar() });

        } catch (error) {
            ShowMessage({
                title: 'Error',
                text: "Cep invalido!",
                icon: 'error'
            });
            return;
        }finally{
            showLoading(false);
        }
    }

    return (
        <>
            <ModalCustom
                isOpen={isOpenModal}
                toggle={togglemodal}
                size={"lg"}
                invisibleButtons={false}
            >
                <Row>
                    <Col sm={12} lg={7}>
                        <ControlledInput
                            control={control}
                            name='nomeDoador'
                            label={<><span className='text-danger'>*</span> Nome do Doador</>}
                            type='text'
                            rules={{
                                required: true
                            }}
                        />
                    </Col>
                    <Col sm={12} lg={3}>
                        <MaskedInput
                            value={telefone}
                            name={"telefone"}
                            label={<><span className='text-danger'>*</span> Telefone</>}
                            onChange={handleTelefoneChange}
                            mask="(99) 9999-9999"
                        />
                    </Col>
                    <Col sm={12} lg={2}>
                        <ControlledInput
                            control={control}
                            name='valor'
                            label={<><span className='text-danger'>*</span> Valor</>}
                            type='number'
                            rules={{
                                required: true
                            }}
                        />
                    </Col>
                    <Col sm={12} lg={3}>
                        <ControlledInput
                            control={control}
                            name='dataDoacao'
                            label={<><span className='text-danger'>*</span> Data de Doação</>}
                            type='date'
                            rules={{
                                required: true
                            }}
                        />
                    </Col>
                    <Col sm={12} lg={2}>
                        <MaskedInput
                            value={cep}
                            name={"Cep"}
                            label={<><span className='text-danger'>*</span> CEP</>}
                            onChange={handleCepChange}
                            mask="99999-999"
                            placeholder="Digite seu CEP"
                            onBlur={handleOnBlur}
                        />
                    </Col>
                    <Col sm={12} lg={3}>
                        <ControlledInput
                            control={control}
                            name='bairro'
                            label={<><span className='text-danger'>*</span> Bairro</>}
                            type='text'
                            rules={{
                                required: true
                            }}
                        />
                    </Col>
                    <Col sm={12} lg={2}>
                        <ControlledInput
                            control={control}
                            name='numero'
                            label={<><span className='text-danger'>*</span> Número</>}
                            type='number'
                            rules={{
                                required: true
                            }}
                        />
                    </Col>
                    <Col sm={12} lg={2}>
                        <ControlledInput
                            control={control}
                            name='uf'
                            label={<><span className='text-danger'>*</span> UF</>}
                            type='text'
                            rules={{
                                required: true
                            }}
                        />
                    </Col>
                    <Col sm={12} lg={4}>
                        <ControlledInput
                            control={control}
                            name='complemento'
                            label='Complemento'
                            type='text'
                            rules={{
                                required: false
                            }}
                        />
                    </Col>

                    <Col sm={12} lg={5}>
                        <ControlledInput
                            control={control}
                            name='logradouro'
                            label={<><span className='text-danger'>*</span> Logradouro</>}
                            type='text'
                            rules={{
                                required: true
                            }}
                        />
                    </Col>
                    <Col sm={12} lg={3}>
                        <ControlledInput
                            control={control}
                            label={<><span className='text-danger'>*</span> Cidade</>}
                            name='cidade'
                            type='text'
                            rules={{
                                required: true
                            }}
                        />
                    </Col>
                    <Col sm={12} lg={3}>
                        <ControlledInput
                            check={true}
                            control={control}
                            label={"Mensageiro"}
                            name='mensageiro'
                            type='checkbox'
                            rules={{
                                required: false
                            }}
                        />
                    </Col>
                    <Col sm={12} lg={3}>
                        <ControlledInput
                            check={true}
                            control={control}
                            label={"Depósito"}
                            name='deposito'
                            type='checkbox'
                            rules={{
                                required: false
                            }}
                        />
                    </Col>
                    <div className='py-2 d-flex justify-content-center align-items-center gap-3'>
                        <Button color={"warning"} onClick={onSubmit}>
                            <HiPencilAlt /> Editar
                        </Button>
                    </div>
                </Row>
            </ModalCustom>
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
                        title={`Lista de Doações ${itemCard?.subTitulo}`}
                        columns={columns}
                        data={itemCard.listaDashboard}
                        actions={_actions}
                    />
                </Col>
            </Row>
        </>
    )
}
