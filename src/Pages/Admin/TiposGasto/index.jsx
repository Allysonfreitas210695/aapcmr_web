import React, { useEffect, useState } from 'react'
import { Button, Col, Row } from 'reactstrap';
import { FaPlus } from 'react-icons/fa';

//Context
import { useAuth } from '../../../Context/useAuth';

//Service
import { api_DELETE, api_GET, api_POST, api_PUT } from '../../../Service/apiConfig';

//Helpers
import { ShowConfirmation, ShowMessage } from '../../../helpers/ShowMessage';

//Component
import Loading from '../../../Components/Loading';
import TableCustom from '../../../Components/TableCustom';

//Actions 
import { EditeActionTable, RemoveActionTable } from '../../../Constants/ActionsTable';
import { useForm } from 'react-hook-form';
import ControlledInput from '../../../Components/ControlledInput';
import { ModalCustom } from '../../../Components/Modal';

export default function TiposGasto() {
    const { showLoading, loding } = useAuth();

    const {
        setValue,
        control,
        getValues
    } = useForm({
        mode: 'onBlur'
    });

    const [listTiposGasto, setListTiposGasto] = useState([]);

    //State para pegar ID do paciente
    const [movimentacaoGastoId, setMovimentacaoGastoId] = useState(null);

    //State para controlar modal
    const [isOpenModal, setIsOpenModal] = useState(false);

    const togglemodal = () => {
        setMovimentacaoGastoId(null);
        setValue("descricao", "");
        setIsOpenModal(!isOpenModal)
    };

    const loadTiposGasto = async () => {
        showLoading(true);
        try {
            let response = await api_GET("MovimentacaoGasto");
            const { data } = response;
            setListTiposGasto(data);
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
        loadTiposGasto();
    }, []);

    const handleEditMovimentacaoGasto = (rowData) => {
        setMovimentacaoGastoId(rowData.id);
        setValue("descricao", rowData.descricao);
        setIsOpenModal(true);
    }

    const handleRemoveMovimentacaoGasto = async (rowData) => {
        const resposta = await ShowConfirmation({ title: "", text: "Você tem certeza que quer deletar essa ação de apoio?" });
        if (resposta) {
            try {
                showLoading(true);
                let response = await api_DELETE(`MovimentacaoGasto/${rowData.id}`);
                const { data } = response;

                showLoading(false);
                ShowMessage({
                    title: 'Sucesso',
                    text: 'Operação Realizado com sucesso',
                    icon: 'success'
                }, () => { loadTiposGasto() });

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

    // //Listas com as acoes definidas
    const _actions = [EditeActionTable(handleEditMovimentacaoGasto), RemoveActionTable(handleRemoveMovimentacaoGasto)];

    const onSubmit = async () => {
        const { descricao } = getValues();
        if (!descricao || descricao.trim() == "") {
            ShowMessage({
                title: 'Aviso',
                text: 'Por favor, preencha o campo do descrição.',
                icon: 'warning'
            });
            return;
        }

        let id = movimentacaoGastoId;

        try {
            if (id) {
                showLoading(true);
                await api_PUT("MovimentacaoGasto", { id, descricao });
                ShowMessage({
                    title: 'Sucesso',
                    text: 'Sucesso na operação.',
                    icon: 'success'
                });
            } else{
                showLoading(true);
                await api_POST("MovimentacaoGasto", { descricao });
                ShowMessage({
                    title: 'Sucesso',
                    text: 'Sucesso na operação.',
                    icon: 'success'
                });
            }
        } catch (error) {
            ShowMessage({
                title: 'Error',
                text: 'Erro na operação.',
                icon: 'warning'
            });
        } finally {
            showLoading(false);
            setMovimentacaoGastoId(null);
            setIsOpenModal(false);
            setValue("descricao", "");
            loadTiposGasto();
        }
    }

    return (
        <>
            {loding && <Loading />}
            {!loding &&
                <>
                    <ModalCustom
                        isOpen={isOpenModal}
                        toggle={togglemodal}
                        onSubmit={onSubmit}
                        size={"lg"}
                        edit={movimentacaoGastoId != null}
                    >
                        <Row>
                            <Col lg={"12"} sm={"12"}>
                                <ControlledInput
                                    control={control}
                                    name='descricao'
                                    label='Descrição'
                                    type='text'
                                    rules={{
                                        required: true
                                    }}
                                />
                            </Col>
                        </Row>
                    </ModalCustom>
                    <Row>
                        <Col lg={12} md={12} className='mb-2 d-flex justify-content-end'>
                            <Button color='success' onClick={() => setIsOpenModal(true)}>
                                <FaPlus /> NOVO
                            </Button>
                        </Col>
                        <Col lg={12} md={12}>
                            <TableCustom
                                title='Lista de Movimentação'
                                columns={[{ title: 'Descrição', field: 'descricao' }]}
                                data={listTiposGasto}
                                actions={_actions}
                            />
                        </Col>
                    </Row>
                </>
            }</>
    )
}
