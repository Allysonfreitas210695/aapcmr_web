import React, { useEffect, useState } from 'react'
import { HiPencilAlt } from 'react-icons/hi';
import { FaPlus, FaRegSave } from 'react-icons/fa';
import { Button, Col, Row } from 'reactstrap';
import { useForm } from 'react-hook-form';

//Service
import { api_DELETE, api_POST, api_PUT } from '../../../../Service/api';

//Helpers
import { ShowConfirmation, ShowMessage } from '../../../../helpers/ShowMessage';

//Constants
import { EditeActionTable, RemoveActionTable } from '../../../../Constants/ActionsTable';

//Components
import ControlledInput from '../../../../Components/ControlledInput';
import SelectCustom from '../../../../Components/SelectCustom';
import TableCustom from '../../../../Components/TableCustom';

export default function ComposicaoFamiliar({ paciente, loadPaciente, showLoading, setPaciente }) {
  const {
    handleSubmit,
    control,
    setValue
  } = useForm({
    mode: 'onBlur'
  });

  const [columns] = useState([
    { title: 'Nome do Familiar', field: 'nomeFamiliar' },
    { title: 'Idade do Familiar', field: 'idadeFamiliar', render: (rowDate) => <>{rowDate.idadeFamiliar} Ano(s)</> },
    { title: 'Vinculo Familiar', field: 'vinculoFamiliar' },
    { title: 'Renda', field: 'renda', render: (rowDate) => <>{rowDate.renda.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</> }])

  const [optionsVinculosFamiliar] = useState([
    { value: 'Pai', label: 'Pai' },
    { value: 'Filho(a)', label: 'Filho(a)' },
    { value: 'Irmão(a)', label: 'Irmão(a)' },
    { value: 'Avó', label: 'Avó' },
    { value: 'Avô', label: 'Avô' },
    { value: 'Neto(a)', label: 'Neto(a)' },
    { value: 'Bisneto(a)', label: 'Bisneto(a)' },
    { value: 'Tio(a)', label: 'Tio(a)' },
    { value: 'Sobrinho(a)', label: 'Sobrinho(a)' },
    { value: 'Primo(a)', label: 'Primo(a)' },
    { value: 'Cônjuge', label: 'Cônjuge' },
    { value: 'Parceiro(a)', label: 'Parceiro(a)' },
    { value: 'Nora(a)', label: 'Nora(a)' },
    { value: 'Genro(a)', label: 'Genro(a)' },
    { value: 'Sogro(a)', label: 'Sogro(a)' },
    { value: 'Cunhado(a)', label: 'Cunhado(a)' }
  ]);

  const [vinculosFamiliar, setVinculosFamiliar] = useState(null);
  const handleVinculosFamiliar = (vinculo) => {
    setVinculosFamiliar(vinculo);
  };

  const [listComposicaoFamiliar, setListComposicaoFamiliar] = useState([]);

  const [familiar, setFamiliar] = useState(null);

  useEffect(() => {
    setListComposicaoFamiliar(paciente?.composicaoFamiliares ?? [])
  }, [paciente]);

  const onSubmit = async (data) => {
    if (vinculosFamiliar == null) {
      ShowMessage({
        title: 'Aviso',
        text: "Por favoer, informe o vinculo familiar da pessoa.",
        icon: 'warning'
      });
      return;
    }

    const json = {
      id: familiar == null ? 0 : familiar.id,
      nomeFamiliar: data.nomeFamiliar,
      idadeFamiliar: data.idadeFamiliar,
      vinculoFamiliar: vinculosFamiliar.value,
      renda: data.renda,
      pacienteId: paciente.id
    }

    showLoading(true);
      try {
        if (!familiar) {
          let response = await api_POST("ComposicaoFamiliar", json);
          loadPaciente(paciente.id);
        } else {
          let response = await api_PUT("ComposicaoFamiliar", json);
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
          text: error?.message ?? "Erro na Operação",
          icon: 'error'
        });
        return;
      } finally {
        setValue("nomeFamiliar", "");
        setValue("idadeFamiliar", "");
        setValue("renda", "");
        setFamiliar(null);
        showLoading(false);
      }
  }

  const handleRemoveTramentoPaciente = async ({ id }) => {
    const resposta = await ShowConfirmation({ title: "", text: "Você tem certeza que quer deletar o familiar do paciente?" });
    if (resposta) {
      try {
        showLoading(true);
        let response = await api_DELETE(`ComposicaoFamiliar/${id}`);
        const { data } = response;

        showLoading(false);
        ShowMessage({
          title: 'Sucesso',
          text: 'Operação Realizado com sucesso',
          icon: 'success'
        }, () => { loadPaciente(paciente.id) });

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

  const handleEditTramentoPaciente = (composicaoFamiliar) => {
    setVinculosFamiliar({ value: composicaoFamiliar.vinculoFamiliar, label: composicaoFamiliar.vinculoFamiliar })
    setFamiliar(composicaoFamiliar);
    setValue("nomeFamiliar", composicaoFamiliar.nomeFamiliar);
    setValue("idadeFamiliar", composicaoFamiliar.idadeFamiliar);
    setValue("renda", composicaoFamiliar.renda);
  }

  // //Listas com as acoes definidas
  const _actions = [EditeActionTable(handleEditTramentoPaciente), RemoveActionTable(handleRemoveTramentoPaciente)];

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Row>
        <Col sm={12} lg={6}>
          <ControlledInput
            control={control}
            name='nomeFamiliar'
            label={<><span className='text-danger'>*</span> Nome do Familiar</>}
            type='text'
            rules={{
              required: true
            }}
          />
        </Col>
        <Col sm={12} lg={3}>
          <ControlledInput
            control={control}
            name='idadeFamiliar'
            label={<><span className='text-danger'>*</span> Idade do Familiar</>}
            type='number'
            rules={{
              required: true
            }}
          />
        </Col>
        <Col sm={12} lg={3} style={{ zIndex: 9999 }}>
          <SelectCustom
            control={control}
            name='vinculoFamiliar'
            label='Vinculo Familiar'
            value={vinculosFamiliar}
            options={optionsVinculosFamiliar}
            onChange={handleVinculosFamiliar}
          />

        </Col>
        <Col sm={12} lg={2}>
          <ControlledInput
            control={control}
            name='renda'
            label={<><span className='text-danger'>*</span> Renda do Familiar</>}
            type='number'
            maxlenght={15}
            rules={{
              required: true
            }}
          />
        </Col>
        <Col sm={12} lg={3} className='mt-2'>
          <br />
          <Button color={familiar ? "warning" : "success"}>
            {familiar ? <><HiPencilAlt /> Edit</> : <><FaRegSave /> Salvar</>}
          </Button>
        </Col>
      </Row>
      <Col lg={12} md={12}>
        <TableCustom
          title='Lista de composição familiar'
          columns={columns}
          data={listComposicaoFamiliar}
          actions={_actions}
        />
      </Col>
    </form>
  )
}
