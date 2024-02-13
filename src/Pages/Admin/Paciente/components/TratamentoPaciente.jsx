import React, { useEffect, useState } from 'react';
import { Button, Col, Row } from 'reactstrap';
import { useForm } from 'react-hook-form';
import { HiPencilAlt } from 'react-icons/hi';
import { FaPlus, FaRegSave } from 'react-icons/fa';

//Component
import ControlledInput from '../../../../Components/ControlledInput';
import TableCustom from '../../../../Components/TableCustom';
import SelectCustom from '../../../../Components/SelectCustom';

//Services
import { api_DELETE, api_POST, api_PUT } from '../../../../Service/api';

//Helpers
import { ShowConfirmation, ShowMessage } from '../../../../helpers/ShowMessage';

//Constants
import { EditeActionTable, RemoveActionTable } from '../../../../Constants/ActionsTable';
import moment from 'moment';

export default function TratamentoPaciente({ paciente, loadPaciente, showLoading, setPaciente }) {
  const { handleSubmit, control, setValue } = useForm({
    mode: 'onBlur'
  });

  const [listTramentosPaciente, setListTramentosPaciente] = useState([]);

  const [tratamentoPaciente, setTratamentoPaciente] = useState(null);

  const [columns] = useState([
    { title: 'Diagnostico', field: 'diagnostico' },
    { title: 'Hospital do Tratamento', field: 'hospitalTratamento' },
    { title: 'Ano do Diagnostico', field: 'anoDiagnostico' },
    { title: 'Status do Tratamento', field: 'statusTratamento' },
    { title: 'Medico', field: 'medico' },
    { title: 'Tipo da Cirurgia', field: 'tipoCirurgia' }
  ]);

  useEffect(() => {
    setListTramentosPaciente(paciente?.tratamentoPacientes ?? []);
  }, [paciente]);

  const handleRemoveTramentoPaciente = async ({ id }) => {
    const resposta = await ShowConfirmation({
      title: '',
      text: 'Você tem certeza que quer deletar o tratamento paciente?'
    });
    if (resposta) {
      try {
        showLoading(true);
        let response = await api_DELETE(`TratamentoPaciente/${id}`);
        const { data } = response;

        showLoading(false);
        ShowMessage(
          {
            title: 'Sucesso',
            text: 'Operação Realizado com sucesso',
            icon: 'success'
          },
          () => {
            loadPaciente(paciente.id);
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

  const handleEditTramentoPaciente = (tratamentoPacientes) => {
    setTratamentoPaciente(tratamentoPacientes);
    setValue('diagnostico', tratamentoPacientes.diagnostico);
    setValue('medico', tratamentoPacientes.medico);
    setValue('tipoCirurgia', tratamentoPacientes.tipoCirurgia);
    setValue('anoDiagnostico', tratamentoPacientes.anoDiagnostico);
    setValue('hospitalTratamento', tratamentoPacientes.hospitalTratamento);
    setValue('observacao', tratamentoPacientes.observacao);
    setValue('dataObservacao', moment(tratamentoPacientes.dataObservacao).format('YYYY-MM-DD'));
    setHistoricoFamiliaCancer({
      value: tratamentoPacientes.historicoFamiliaCancer,
      label: tratamentoPacientes.historicoFamiliaCancer ? 'Sim' : 'Não'
    });
    setUsoEntorpecente({
      value: tratamentoPacientes.usoEntorpecente,
      label: tratamentoPacientes.usoEntorpecente ? 'Sim' : 'Não'
    });
    setStatusTratamento({
      value: tratamentoPacientes.statusTratamento,
      label: tratamentoPacientes.statusTratamento
    });
  };

  const [statusTratamento, setStatusTratamento] = useState({
    value: 'Em Andamento',
    label: 'Em Andamento'
  });
  const handleStatusTratamento = (selectedOption) => {
    setStatusTratamento(selectedOption);
  };

  const [historicoFamiliaCancer, setHistoricoFamiliaCancer] = useState({
    value: false,
    label: 'Não'
  });
  const handleHistoricoFamiliaCancer = (selectedOption) => {
    setHistoricoFamiliaCancer(selectedOption);
  };

  const [usoEntorpecente, setUsoEntorpecente] = useState({ value: false, label: 'Não' });
  const handleUsoEntorpecente = (selectedOption) => {
    setUsoEntorpecente(selectedOption);
  };

  const onSubmit = async (data) => {
    if (data.observacao.length > 0 && !data.dataObservacao) {
      ShowMessage({
        title: 'Aviso',
        text: 'Ao preencher o campo de observação, o campo de data de observação também deve ser preenchido.',
        icon: 'warning'
      });
      return;
    }

    const json = {
      id: tratamentoPaciente == null ? 0 : tratamentoPaciente.id,
      diagnostico: data.diagnostico,
      statusTratamento: statusTratamento.value,
      medico: data.medico,
      tipoCirurgia: data.tipoCirurgia,
      hospitalTratamento: data.hospitalTratamento,
      anoDiagnostico: data.anoDiagnostico,
      observacao: data.observacao,
      dataObservacao: data.dataObservacao,
      usoEntorpecente: usoEntorpecente.value,
      historicoFamiliaCancer: historicoFamiliaCancer.value,
      pacienteId: paciente.id
    };

    showLoading(true);
    try {
      let response;
      if (!tratamentoPaciente) {
        response = await api_POST('TratamentoPaciente', json);
      } else {
        response = await api_PUT('TratamentoPaciente', json);
      }

      loadPaciente(paciente.id);
      ShowMessage({
        title: 'Sucesso',
        text: 'Sucesso na operação.',
        icon: 'success'
      });
    } catch (error) {
      ShowMessage({
        title: 'Error',
        text: error?.message ?? 'Erro na Operação',
        icon: 'error'
      });
    } finally {
      // Limpar os valores dos campos e redefinir o estado
      Object.keys(data).forEach((key) => {
        setValue(key, '');
      });
      setTratamentoPaciente(null);
      showLoading(false);
    }
  };

  // //Listas com as acoes definidas
  const _actions = [
    EditeActionTable(handleEditTramentoPaciente),
    RemoveActionTable(handleRemoveTramentoPaciente)
  ];
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Row>
        <Col sm={12} lg={5}>
          <ControlledInput
            control={control}
            name="diagnostico"
            label={
              <>
                <span className="text-danger">*</span> Diagnóstico
              </>
            }
            type="text"
            rules={{
              required: true
            }}
          />
        </Col>
        <Col sm={12} lg={4}>
          <ControlledInput
            control={control}
            name="hospitalTratamento"
            label={
              <>
                <span className="text-danger">*</span> Hospital do Tratamento
              </>
            }
            type="text"
            rules={{
              required: true
            }}
          />
        </Col>
        <Col sm={12} lg={3}>
          <SelectCustom
            control={control}
            name="statusTratamento"
            label="Status do Tratamento"
            value={statusTratamento}
            options={[
              { value: 'Finalizado', label: 'Finalizado' },
              { value: 'Em Andamento', label: 'Em Andamento' }
            ]}
            onChange={handleStatusTratamento}
          />
        </Col>
        <Col sm={12} lg={5}>
          <ControlledInput
            control={control}
            name="medico"
            label={
              <>
                <span className="text-danger">*</span> Médico
              </>
            }
            type="text"
            rules={{
              required: true
            }}
          />
        </Col>
        <Col sm={12} lg={4}>
          <ControlledInput
            control={control}
            name="tipoCirurgia"
            label={
              <>
                <span className="text-danger">*</span> Tipo da Cirurgia
              </>
            }
            type="text"
            rules={{
              required: true
            }}
            value
          />
        </Col>
        <Col sm={12} lg={3}>
          <ControlledInput
            control={control}
            name="anoDiagnostico"
            label={
              <>
                <span className="text-danger">*</span> Ano do Diagnóstico
              </>
            }
            type="number"
            maxlenght={15}
            rules={{
              required: true
            }}
          />
        </Col>
        <Col sm={12} lg={4}>
          <SelectCustom
            control={control}
            name="historicoFamiliaCancer"
            label="Histórico Familiar de Câncer?"
            value={historicoFamiliaCancer}
            options={[
              { value: true, label: 'Sim' },
              { value: false, label: 'Não' }
            ]}
            onChange={handleHistoricoFamiliaCancer}
          />
        </Col>
        <Col sm={12} lg={4}>
          <SelectCustom
            control={control}
            name="usoEntorpecente"
            label="Uso de Álcool/Drogas"
            value={usoEntorpecente}
            options={[
              { value: true, label: 'Sim' },
              { value: false, label: 'Não' }
            ]}
            onChange={handleUsoEntorpecente}
          />
        </Col>
        <Col sm={12} lg={4}>
          <ControlledInput
            control={control}
            name="dataObservacao"
            label={'Data de Observação'}
            type="date"
            maxlenght={15}
            rules={{
              required: false
            }}
          />
        </Col>
        <Col sm={12} lg={12}>
          <ControlledInput
            control={control}
            name="observacao"
            label={'Observação'}
            type="textarea"
            rules={{
              required: false
            }}
          />
        </Col>
        <div className="d-flex justify-content-center align-items-center mb-2">
          <Button color={tratamentoPaciente ? 'warning' : 'success'}>
            {tratamentoPaciente ? (
              <>
                <HiPencilAlt /> Edit
              </>
            ) : (
              <>
                <FaRegSave /> Salvar
              </>
            )}
          </Button>
        </div>
      </Row>
      <Col lg={12} md={12}>
        <TableCustom
          title="Lista de tratamentos do paciente"
          columns={columns}
          data={listTramentosPaciente}
          actions={_actions}
        />
      </Col>
    </form>
  );
}
