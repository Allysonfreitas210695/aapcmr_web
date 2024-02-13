import React, { useEffect, useState } from 'react';
import { Button, Col, Row } from 'reactstrap';
import { FaPlus } from 'react-icons/fa';
import { useForm } from 'react-hook-form';

//Context
import { useAuth } from '../../../Context/useAuth';

//Service
import { api_DELETE, api_GET, api_POST, api_PUT } from '../../../Service/api';

//Helpers
import { ShowConfirmation, ShowMessage } from '../../../helpers/ShowMessage';

//Component
import Loading from '../../../Components/Loading';
import TableCustom from '../../../Components/TableCustom';
import ControlledInput from '../../../Components/ControlledInput';
import { ModalCustom } from '../../../Components/Modal';

//Actions
import { EditeActionTable, RemoveActionTable } from '../../../Constants/ActionsTable';

export default function AcoesApoio() {
  const { showLoading, loding } = useAuth();

  const { setValue, control, getValues } = useForm({
    mode: 'onBlur'
  });

  const [listAcoesApoio, setListAcoesApoio] = useState([]);

  //State para pegar ID do paciente
  const [acaoApoioId, setAcaoApoioId] = useState(null);

  //State para controlar modal
  const [isOpenModal, setIsOpenModal] = useState(false);

  const togglemodal = () => {
    setAcaoApoioId(null);
    setValue('descricao', '');
    setIsOpenModal(!isOpenModal);
  };

  const loadAcoesApoio = async () => {
    showLoading(true);
    try {
      let response = await api_GET('AcoesApoio');
      const { data } = response;
      setListAcoesApoio(data);
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
    loadAcoesApoio();
  }, []);

  const handleEditAcaoApoio = (rowData) => {
    setAcaoApoioId(rowData.id);
    setValue('descricao', rowData.descricao);
    setIsOpenModal(true);
  };

  const handleRemoveAcaoApoio = async (rowData) => {
    const resposta = await ShowConfirmation({
      title: '',
      text: 'Você tem certeza que quer deletar essa ação de apoio?'
    });
    if (resposta) {
      try {
        showLoading(true);
        let response = await api_DELETE(`AcoesApoio/${rowData.id}`);
        const { data } = response;

        showLoading(false);
        ShowMessage(
          {
            title: 'Sucesso',
            text: 'Operação Realizado com sucesso',
            icon: 'success'
          },
          () => {
            loadAcoesApoio();
          }
        );
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
    }
  };

  // //Listas com as acoes definidas
  const _actions = [
    EditeActionTable(handleEditAcaoApoio),
    RemoveActionTable(handleRemoveAcaoApoio)
  ];

  const onSubmit = async () => {
    const { descricao } = getValues();
    if (!descricao || descricao.trim() == '') {
      ShowMessage({
        title: 'Aviso',
        text: 'Por favor, preencha o campo do descrição.',
        icon: 'warning'
      });
      return;
    }

    let id = acaoApoioId;

    try {
      if (id) {
        showLoading(true);
        await api_PUT('AcoesApoio', { id, descricao });
        ShowMessage({
          title: 'Sucesso',
          text: 'Sucesso na operação.',
          icon: 'success'
        });
      } else {
        showLoading(true);
        await api_POST('AcoesApoio', { descricao });
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
      setAcaoApoioId(null);
      setIsOpenModal(false);
      setValue('descricao', '');
      loadAcoesApoio();
    }
  };

  return (
    <>
      {loding && <Loading />}
      {!loding && (
        <>
          <ModalCustom
            isOpen={isOpenModal}
            toggle={togglemodal}
            onSubmit={onSubmit}
            size={'lg'}
            edit={acaoApoioId}
            title="Cadastro de Ações de Apoio"
          >
            <Row>
              <Col lg={'12'} sm={'12'}>
                <ControlledInput
                  control={control}
                  name="descricao"
                  label="Descrição da Ação"
                  type="text"
                  rules={{
                    required: true
                  }}
                />
              </Col>
            </Row>
          </ModalCustom>
          <Row>
            <Col lg={12} md={12} className="mb-2 d-flex justify-content-end">
              <Button color="success" onClick={() => setIsOpenModal(true)}>
                <FaPlus /> NOVO
              </Button>
            </Col>
            <Col lg={12} md={12}>
              <TableCustom
                title="Lista de Ações de Apoio"
                columns={[{ title: 'Descrição', field: 'descricao' }]}
                data={listAcoesApoio}
                actions={_actions}
              />
            </Col>
          </Row>
        </>
      )}
    </>
  );
}
