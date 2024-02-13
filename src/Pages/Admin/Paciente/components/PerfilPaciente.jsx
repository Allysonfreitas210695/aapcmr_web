import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Col, Row } from 'reactstrap';

//Context
import { useAuth } from '../../../../Context/useAuth';
import ControlledInput from '../../../../Components/ControlledInput';
import SelectCustom from '../../../../Components/SelectCustom';

//Service
import { api_POST, api_PUT } from '../../../../Service/api';

//Helpers
import { ShowMessage } from '../../../../helpers/ShowMessage';
import { HiPencilAlt } from 'react-icons/hi';
import { FaRegSave } from 'react-icons/fa';

export default function PerfilPaciente({
  paciente,
  loadPaciente,
  showLoading,
  setPaciente
}) {
  const { session } = useAuth();

  const { handleSubmit, control, setValue } = useForm({
    mode: 'onBlur'
  });

  useEffect(() => {
    if (!!paciente && paciente?.perfilPaciente != null) {
      setValue('nomePai', paciente.perfilPaciente.nomePai);
      setValue('nomeMae', paciente.perfilPaciente.nomeMae);
      setValue('religiao', paciente.perfilPaciente.religiao);
      setValue('profissao', paciente.perfilPaciente.profissao);
      setProgramaGoverno({
        value: paciente.perfilPaciente.programaGoverno,
        label: paciente.perfilPaciente.programaGoverno ? 'Sim' : 'Não'
      });
    }
  }, [paciente]);

  const [programaGoverno, setProgramaGoverno] = useState({
    value: false,
    label: 'Não'
  });

  const onSubmit = async (data) => {
    const json = {
      id: paciente.perfilPaciente ? paciente.perfilPaciente.id : 0,
      nomePai: data.nomePai,
      nomeMae: data.nomeMae,
      religiao: data.religiao,
      profissao: data.profissao,
      programaGoverno: programaGoverno.value,
      pacienteId: paciente.id
    };

    showLoading(true);
    try {
      let response;
      if (!paciente.perfilPaciente) {
        response = await api_POST('PerfilPaciente', json);
        loadPaciente(paciente.id);
      } else {
        response = await api_PUT('PerfilPaciente', json);
        loadPaciente(paciente.id);
      }

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
      showLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Row>
        <Col sm={12} lg={4}>
          <ControlledInput
            control={control}
            name="nomePai"
            label={
              <>
                <span className="text-danger">*</span> Nome do Pai
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
            name="nomeMae"
            label={
              <>
                <span className="text-danger">*</span> Nome do Mãe
              </>
            }
            type="text"
            rules={{
              required: true
            }}
          />
        </Col>
        <Col sm={12} lg={4}>
          <SelectCustom
            control={control}
            name="programaGoverno"
            label="Participação do Programa do Governo?"
            value={programaGoverno}
            options={[
              { value: true, label: 'Sim' },
              { value: false, label: 'Não' }
            ]}
            onChange={(option) => setProgramaGoverno(option)}
          />
        </Col>
        <Col sm={12} lg={4}>
          <ControlledInput
            control={control}
            name="religiao"
            label={
              <>
                <span className="text-danger">*</span> Religião
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
            name="profissao"
            label={
              <>
                <span className="text-danger">*</span> Profissão
              </>
            }
            type="text"
            rules={{
              required: true
            }}
          />
        </Col>
      </Row>
      <div className="py-2 d-flex justify-content-center align-items-center gap-3">
        <Button color={paciente?.perfilPaciente?.id ? 'warning' : 'success'}>
          {paciente?.perfilPaciente?.id ? (
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
    </form>
  );
}
