import React, { useEffect, useState } from 'react'
import { useAuth } from '../../../Context/useAuth';
import { useForm } from 'react-hook-form';
import { FaFilter, FaPlus } from 'react-icons/fa';
import { Button, Col, Row } from 'reactstrap';
import * as XLSX from 'xlsx'
//Helpers
import { ShowConfirmation, ShowMessage } from '../../../helpers/ShowMessage';

//Service
import { api_DELETE, api_GET, api_POST, api_PUT } from '../../../Service/api';

//Contants
import { EditeActionTable, RemoveActionTable } from '../../../Constants/ActionsTable';

//Components
import { ModalCustom } from '../../../Components/Modal';
import ControlledInput from '../../../Components/ControlledInput';
import TableCustom from '../../../Components/TableCustom';
import moment from 'moment';
import SelectCustom from '../../../Components/SelectCustom';

export default function RelatorioMensal() {
  const { showLoading, loding } = useAuth();

  const {
    setValue,
    control,
    getValues,
    handleSubmit
  } = useForm({
    mode: 'onBlur'
  });



  const [listRelatorioMensal, setListRelatorioMensal] = useState([]);

  const [listTipoGasto, setListTipoGasto] = useState([]);

  //State para pegar ID do paciente
  const [relatorioMensalId, setRelatorioMensalId] = useState(null);

  //State para controlar modal
  const [isOpenModal, setIsOpenModal] = useState(false);

  const [columns] = useState([
    { title: 'movimentação', field: 'tipoGasto.descricao' },
    { title: 'Data', field: 'data', render: (rowData) => <>{moment(rowData.data).format("DD/MM/YYYY")}</> },
    { title: 'Entrada', field: 'entrada', render: (rowData) => <>{rowData.entrada?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</> },
    { title: 'Saida', field: 'saida', render: (rowData) => <>{rowData.saida?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</> },
    { title: 'Saldo Referente ao Dia', field: 'saldo', render: (rowData) => <>{rowData.saldo?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</> }
  ])

  const togglemodal = () => {
    setRelatorioMensalId(null);
    setValue("descricao", "");
    setIsOpenModal(!isOpenModal)
  };

  const loadRelatorioMensal = async () => {
    showLoading(true);
    try {
      let response = await api_GET("RelatorioMensal");
      const { data } = response;
      setListRelatorioMensal(data);
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

  const loadTipoGasto = async () => {
    showLoading(true);
    try {
      let response = await api_GET("TipoGasto");
      const { data } = response;
      let _data = []
      if (data?.length > 0) {
        _data = data?.map(value => {
          value.value = value.id;
          value.label = value.descricao;
          return value
        })
      }
      setListTipoGasto(_data);
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
    loadRelatorioMensal();
    loadTipoGasto()
  }, []);

  const handleEditRelatorioMensal = (rowData) => {
    setValue("saida", rowData.saida);
    setValue("entrada", rowData.entrada);
    setValue("data", moment(rowData.data).format("YYYY-MM-DD"));
    setTipoGasto({ value: rowData.tipoGastoId, label: rowData.tipoGasto.descricao, id: rowData.tipoGastoId });
    setRelatorioMensalId(rowData.id);
    setIsOpenModal(true);
  }

  const handleRemoveRelatorioMensal = async (rowData) => {
    const resposta = await ShowConfirmation({ title: "", text: "Você tem certeza que quer deletar essa ação de apoio?" });
    if (resposta) {
      try {
        showLoading(true);
        let response = await api_DELETE(`RelatorioMensal/${rowData.id}`);
        const { data } = response;

        showLoading(false);
        ShowMessage({
          title: 'Sucesso',
          text: 'Operação Realizado com sucesso',
          icon: 'success'
        }, () => { loadRelatorioMensal() });

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
  const _actions = [EditeActionTable(handleEditRelatorioMensal), RemoveActionTable(handleRemoveRelatorioMensal)];

  //State para pegar tipo do gasto
  const [tipoGasto, setTipoGasto] = useState(null);

  const onSubmit = async () => {
    const { saida, entrada, data } = getValues();
    if (tipoGasto == null) {
      ShowMessage({
        title: 'Aviso',
        text: 'Por favor, selecione o tipo de gasto.',
        icon: 'warning'
      });
      return;
    }

    if (data == null || data?.length == 0 || data?.trim().length == 0) {
      ShowMessage({
        title: 'Aviso',
        text: 'Por favor, Informe a  data do registro.',
        icon: 'warning'
      });
      return;
    }

    if (entrada == null || entrada?.length == 0 || entrada?.trim().length == 0) {
      ShowMessage({
        title: 'Aviso',
        text: 'Por favor, Informe o valor de entrada.',
        icon: 'warning'
      });
      return;
    }

    if (saida == null || saida?.length == 0 || saida?.trim().length == 0) {
      ShowMessage({
        title: 'Aviso',
        text: 'Por favor, Informe o valor de saida.',
        icon: 'warning'
      });
      return;
    }

    let id = relatorioMensalId;

    showLoading(true);
    try {
      if (id) {
        await api_PUT("RelatorioMensal", { id, saida, entrada, data, tipoGastoId: tipoGasto.id });
      } else {
        await api_POST("RelatorioMensal", { saida, entrada, data, tipoGastoId: tipoGasto.id });
      }
      ShowMessage({
        title: 'Sucesso',
        text: 'Sucesso na operação.',
        icon: 'success'
      });

    } catch (error) {
      ShowMessage({
        title: 'Error',
        text: 'Erro na operação.',
        icon: 'warning'
      });
    } finally {
      showLoading(false);
      setValue("saida", "");
      setValue("entrada", "");
      setValue("data", "");
      setTipoGasto(null);
      setRelatorioMensalId(null);
      setIsOpenModal(false);
      loadRelatorioMensal();
    }
  }

  const exportToExcel = async () => {
    const { totalEntrada, totalSaida, TotalSaldo } = listRelatorioMensal.reduce(
      (acc, curr) => {
        acc.totalEntrada += curr.entrada || 0;
        acc.totalSaida += curr.saida || 0;
        acc.TotalSaldo += curr.saldo || 0;
        return acc;
      },
      { totalEntrada: 0, totalSaida: 0, TotalSaldo: 0 }
    );

    const data = [
      ...listRelatorioMensal.map(item => ({
        'Movimentação': item.tipoGasto.descricao,
        'Data': moment(item.data).format("DD/MM/YYYY"),
        'Entrada': item.entrada?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        'Saida': item.saida?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        'Saldo': item.saldo?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      })),
      {
        'Movimentação': 'Total:',
        'Data': '',
        'Entrada': totalEntrada?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        'Saida': totalSaida?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        'Saldo': TotalSaldo?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      },
    ];

    const nomeRelatorio = "RelatorioMensal";
    const dataAtual = new Date();

    const dia = String(dataAtual.getDate()).padStart(2, "0");
    const mes = String(dataAtual.getMonth() + 1).padStart(2, "0");
    const ano = dataAtual.getFullYear();

    const dataGeracao = `${dia}-${mes}-${ano}`;

    const tituloPlanilha = `${nomeRelatorio}_${dataGeracao}`;

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, tituloPlanilha);

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

    const s2ab = s => {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
      return buf;
    };

    const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', tituloPlanilha+'.xlsx');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFiltroRelatorioMensal = async (data) => {
    const { dataInicial, dataFinal } = data;
    showLoading(true);
    try {
      var response = await api_POST("RelatorioMensal/FiltroRelatorioMensal", { dataInicial: moment(dataInicial).format("YYYY-MM-DD"), dataFinal: moment(dataFinal).format("YYYY-MM-DD") });
      const { data } = response;
      setListRelatorioMensal(data);

    } catch (error) {
      ShowMessage({
        title: 'Error',
        text: 'Erro na operação.',
        icon: 'warning'
      });
    } finally {
      showLoading(false);
    }
  }


  return (
    <>
      {!loding &&
        <>
          {/* Modal para cadastrar */}
          <ModalCustom
            isOpen={isOpenModal}
            toggle={togglemodal}
            onSubmit={onSubmit}
            size={"lg"}
            edit={relatorioMensalId}
            title='Cadastre o Gasto'
          >
            <Row>
              <Col sm={12} lg={6}>
                <SelectCustom
                  control={control}
                  name='acaoApoio'
                  label='Tipo de Gasto'
                  value={tipoGasto}
                  options={listTipoGasto}
                  onChange={(tipogasto) => setTipoGasto(tipogasto)}
                />
              </Col>
              <Col sm={12} lg={6}>
                <ControlledInput
                  control={control}
                  name='data'
                  label='Data do Registro'
                  type='date'
                  rules={{
                    required: true
                  }}
                />
              </Col>
              <Col sm={12} lg={6}>
                <ControlledInput
                  control={control}
                  name='entrada'
                  label='Entrada'
                  type='number'
                  rules={{
                    required: true
                  }}
                />
              </Col>
              <Col sm={12} lg={6}>
                <ControlledInput
                  control={control}
                  name='saida'
                  label='Saida'
                  type='number'
                  rules={{
                    required: true
                  }}
                />
              </Col>
            </Row>
          </ModalCustom>

          <form onSubmit={handleSubmit(handleFiltroRelatorioMensal)}>
            <Row className='mb-3'>
              <Col sm={12} lg={4}>
                <ControlledInput
                  control={control}
                  name='dataInicial'
                  label='Data Inical'
                  type='date'
                  rules={{
                    required: true
                  }}
                />
              </Col>
              <Col sm={12} lg={4}>
                <ControlledInput
                  control={control}
                  name='dataFinal'
                  label='Data Final'
                  type='date'
                  rules={{
                    required: true
                  }}
                />
              </Col>
              <Col sm={12} lg={4} className='mb-3'>
                <br />
                <Button color='primary' className='mt-2'>
                  <FaFilter />  Filtrar
                </Button>
              </Col>
            </Row>
          </form>

          <Row>
            <div className='mb-2 d-flex justify-content-between align-items-center'>
              <Button color='danger' onClick={exportToExcel}>
                Exportar para Excel
              </Button>
              <Button color='success' onClick={() => setIsOpenModal(true)}>
                <FaPlus /> NOVO
              </Button>
            </div>
            <Col lg={12} md={12}>
              <TableCustom
                title='Lista de Gastos'
                columns={columns}
                data={listRelatorioMensal}
                actions={_actions}
              />
            </Col>
          </Row>
        </>
      }</>
  )
}

