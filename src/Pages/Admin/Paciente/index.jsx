import React, { useEffect, useState } from 'react'
import { Button, Col, Row } from 'reactstrap';
import { FaPlus } from 'react-icons/fa6';

//Context
import { useAuth } from '../../../Context/useAuth';
import Loading from '../../../Components/Loading';
import TableCustom from '../../../Components/TableCustom';
import NovoPaciente from './components/NovoPaciente';

//Service
import { api_DELETE, api_GET } from '../../../Service/apiConfig';

//ShowMessage
import { ShowConfirmation, ShowMessage } from '../../../helpers/ShowMessage';

//Actions 
import { EditeActionTable, RemoveActionTable } from '../../../Constants/ActionsTable';

export default function Paciente() {
  const { showLoading, loding } = useAuth();

  //State para pegar lista de usuarios Adm
  const [listPacientes, setListPacientes] = useState([]);

  //State para pegar ID do paciente
  const [pacienteId, setPacienteId] = useState(null);

  //State para criar um novo paciente
  const [pacienteNovo, setPacienteNovo] = useState(false);

  const [columns] = useState([
    { title: 'Nome', field: 'nome' },
    { title: 'Endereço', field: 'endereco' },
    { title: 'Estado Civil', field: 'statusCivil' },
    { title: 'Naturalidade', field: 'naturalidade' },
    { title: 'DataNascimento', field: 'dataNascimento' },
    { title: 'CPF', field: 'cpf' },
    { title: 'RG', field: 'rg' },
  ]);

  const loadPacientes = async () => {
      showLoading(true);
      try {
        let response = await api_GET("Paciente");
        const { data } = response;
        setListPacientes(data);
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
    loadPacientes();
  }, []);

  const handleEditPaciente = (rowData) => {
    setPacienteId(rowData.id);
  }

  const handleRemovePaciente = async (rowData) => {
    const resposta = await ShowConfirmation({ title: "", text: "Você tem certeza que quer deletar esse paciente?" });
    if (resposta) {
      try {
        showLoading(true);
        let response = await api_DELETE(`Paciente/${rowData.id}`);
        const { data } = response;

        showLoading(false);
        ShowMessage({
          title: 'Sucesso',
          text: 'Operação Realizado com sucesso',
          icon: 'success'
        }, () => { loadPacientes() });

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
  const _actions = [EditeActionTable(handleEditPaciente), RemoveActionTable(handleRemovePaciente)];

  const handleVoltar = () => {
    setPacienteId(null);
    setPacienteNovo(false);
    loadPacientes();
  }

  if (pacienteNovo || pacienteId != null) {
    return <NovoPaciente
      handleVoltar={handleVoltar}
      id={pacienteId}
    />
  }

  return (
    < >
      {loding && <Loading />}
      {!loding &&
        <>
          <Row>
            <Col lg={12} md={12} className='mb-2 d-flex justify-content-end'>
              <Button color='success' onClick={() => setPacienteNovo(true)}>
                <FaPlus /> NOVO
              </Button>
            </Col>
            <Col lg={12} md={12}>
              <TableCustom
                title='Lista de Pacientes'
                columns={columns}
                data={listPacientes}
                actions={_actions}
              />
            </Col>
          </Row>
        </>
      }
    </>
  )
}
