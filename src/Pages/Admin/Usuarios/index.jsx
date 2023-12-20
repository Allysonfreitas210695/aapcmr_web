import React, { useEffect, useState } from 'react'
import { Button, Col, Row } from 'reactstrap';
import { useForm } from 'react-hook-form';
import { FaPlus } from "react-icons/fa6";
import { HiPencilAlt } from "react-icons/hi";


//Componente
import TableCustom from '../../../Components/TableCustom'
import { ModalCustom } from '../../../Components/Modal';
import ControlledInput from '../../../Components/ControlledInput';
import Loading from '../../../Components/Loading';

//Service
import { api_DELETE, api_GET, api_POST, api_PUT } from '../../../Service/apiConfig';

//Context
import { useAuth } from '../../../Context/useAuth';

//Helpers
import { ShowConfirmation, ShowMessage } from '../../../helpers/ShowMessage';

//Actions
import { EditeActionTable, RemoveActionTable } from "../../../Constants/ActionsTable"

export default function Usuarios() {
  const { showLoading, loding } = useAuth();

  const {
    setValue,
    control,
    getValues
  } = useForm({
    mode: 'onBlur'
  });

  const [columns] = useState([
    { title: 'Nome', field: 'nome' },
    { title: 'Email', field: 'email' }
  ]);

  //State para pegar lista de usuarios Adm
  const [listusuarios, setListusuarios] = useState([]);

  //State para controlar modal
  const [isOpenModal, setIsOpenModal] = useState(false);

  //State para pegar o ID do usuario de edição
  const [usuarioEditId, setUsuarioEditId] = useState(null);

  const togglemodal = () => {
    setValue("nome", "");
    setValue("email", "");
    setUsuarioEditId(null);
    setIsOpenModal(!isOpenModal)
  };

  const loadUsuarios = async () => {
    showLoading(true);
    try {
      let response = await api_GET("Usuario");
      const { data } = response;
      setListusuarios(data);
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
    loadUsuarios();
  }, []);

  const handleEditUsuario = (rowData) => {
    setValue("nome", rowData.nome);
    setValue("email", rowData.email);
    setUsuarioEditId(rowData.id);
    setIsOpenModal(true);
  }

  const handleRemoveUsuario = async (rowData) => {
    const resposta = await ShowConfirmation({ title: "", text: "Você tem certeza que quer deletar esse usuário?" });
    if (resposta) {
      try {
        showLoading(true);
        let response = await api_DELETE(`Usuario/${rowData.id}`);
        const { data } = response;

        showLoading(false);
        ShowMessage({
          title: 'Sucesso',
          text: 'Operação Realizado com sucesso',
          icon: 'success'
        }, () => { loadUsuarios() });

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

  //Listas com as acoes definidas
  const _actions = [EditeActionTable(handleEditUsuario), RemoveActionTable(handleRemoveUsuario)];

  const onSubmit = async () => {
    const { nome, email } = getValues();
    if (!nome || nome.trim() == "") {
      ShowMessage({
        title: 'Aviso',
        text: 'Por favor, preencha o campo do nome.',
        icon: 'warning'
      });
      return;
    }

    if (!email || email.trim() == 0) {
      ShowMessage({
        title: 'Aviso',
        text: 'Por favor, preencha o campo do email.',
        icon: 'warning'
      });
      return;
    }

    //usuario id
    let id = usuarioEditId;

    try {
      if (id) {
        showLoading(true);
        await api_PUT("Usuario", { id, nome, email });
        ShowMessage({
          title: 'Sucesso',
          text: 'Sucesso na operação.',
          icon: 'success'
        });
      } else {
        showLoading(true);
        await api_POST("Usuario", { nome, email });
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
      setUsuarioEditId(null);
      setIsOpenModal(false);
      loadUsuarios();
      setValue("nome", "");
      setValue("email", "");
    }
  }

  return (
    < >
      {loding && <Loading />}
      {!loding &&
        <>
          <ModalCustom
            isOpen={isOpenModal}
            toggle={togglemodal}
            onSubmit={onSubmit}
            size={"lg"}
            edit={usuarioEditId}
            title='Cadastro de Usuário'
          >
            <Row>
              <Col lg={"6"} sm={"6"}>
                <ControlledInput
                  control={control}
                  name='nome'
                  label='Nome'
                  type='text'
                  rules={{
                    required: true
                  }}
                />
              </Col>
              <Col lg={"6"} sm={"6"}>
                <ControlledInput
                  control={control}
                  name='email'
                  label='Email'
                  type='email'
                  rules={{
                    required: true,
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                      message: 'Endereço de e-mail inválido',
                    },
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
                title='Lista de Usuários Administratores'
                columns={columns}
                data={listusuarios}
                actions={_actions}
              />
            </Col>
          </Row>
        </>
      }
    </>
  )
}
