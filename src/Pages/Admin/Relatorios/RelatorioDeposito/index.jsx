import React, { useEffect, useState } from 'react'
import { FaArrowLeft, FaFilter } from 'react-icons/fa';
import { FaFileCsv } from "react-icons/fa6";
import { useForm } from 'react-hook-form';
import moment from 'moment';
import { Button, Col, Row } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';

//Components
import ControlledInput from '../../../../Components/ControlledInput';
import TableCustom from '../../../../Components/TableCustom';

//Context
import { useAuth } from '../../../../Context/useAuth';

//Services
import { api_POST } from '../../../../Service/api';

//Helpers
import { ShowMessage } from '../../../../helpers/ShowMessage';
import { mascaraTelefone } from '../../../../helpers/ValidadacaoDocumentos';

export default function RelatorioDeposito() {
    const { showLoading, loding } = useAuth();
    const navigate = useNavigate();

    const {
        control,
        handleSubmit
    } = useForm({
        mode: 'onBlur'
    });

    const [listRelatorioDeposito, setListRelatorioDeposito] = useState([]);

    const loadRelatorioDoacaoDeposito = async () => {
        showLoading(true);
        try {
            let response = await api_POST("RelatorioMensal/RelatorioDoacaoDeposito", { dataInicial: null, dataFinal: null });
            const { data } = response;
            setListRelatorioDeposito(data);
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
        loadRelatorioDoacaoDeposito();
    }, []);


    const exportToExcel = async () => {
        const { totalValorDoacao } = listRelatorioDeposito.reduce((acc, curr) => { acc.totalValorDoacao += curr.valorDoacao || 0; return acc; }, { totalValorDoacao: 0 });

        const data = [
            ...listRelatorioDeposito.map(item => ({
                'Nome do Doador': item.nomeDoador,
                'Telefone': mascaraTelefone(item.telefone),
                'Valor de Doação': item.valorDoacao?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
                'Data da Doação': moment(item.dataDoacao).format("DD/MM/YYYY"),
                'Status da Doação': item.statusDoacao ? "Recebido" : "Pendente",
                'Tipo de Envior': item.tipoDeEnvioValor,
            })),
            {
                'Nome do Doador': 'Total:',
                'Telefone': '',
                'Valor de Doação': totalValorDoacao?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
                'Data da Doação': '',
                'Status da Doação': '',
                'Tipo de Envior': '',
            },
        ];

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "RelatorioDoacoes");

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
        link.setAttribute('download', 'RelatorioDoacoes.xlsx');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    const handleFiltroRelatorioMensal = async (data) => {
        const { dataInicial, dataFinal } = data;
        showLoading(true);
        try {
            var response = await api_POST("RelatorioMensal/RelatorioDoacaoDeposito", { dataInicial: moment(dataInicial).format("YYYY-MM-DD"), dataFinal: moment(dataFinal).format("YYYY-MM-DD") });
            const { data } = response;
            setListRelatorioDeposito(data);

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
                    <div className='mb-2 d-flex justify-content-end align-items-center mb-1'>
                        <Button color='secondary' onClick={() => navigate(-1)}>
                            <FaArrowLeft /> Voltar
                        </Button>
                    </div>
                    <div className='bg-white p-3 rounded shadow'>
                        <form onSubmit={handleSubmit(handleFiltroRelatorioMensal)}>
                            <Row className='mb-3'>
                                <Col sm={12} lg={4}>
                                    <ControlledInput
                                        control={control}
                                        name='dataIncial'
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
                                <Col sm={12} lg={2} className='mb-3'>
                                    <br />
                                    <Button color='primary' className='mt-2 w-100'>
                                        <FaFilter />  Filtrar
                                    </Button>

                                </Col>
                                <Col sm={12} lg={2} className='mb-3'>
                                    <br />
                                    <Button color='danger' className='mt-2 w-100' onClick={exportToExcel}>
                                        <FaFileCsv /> Exportar
                                    </Button>

                                </Col>
                            </Row>
                        </form>
                        <Col lg={12} md={12}>
                            <TableCustom
                                title='Lista de Depósitos por Mesageiro'
                                columns={[
                                    { title: 'Nome do Doador', field: 'nomeDoador' },
                                    { title: 'Telefone', field: 'telefone', render: (rowDate) => <>{mascaraTelefone(rowDate.telefone)}</> },
                                    { title: 'Valor de Doação', field: 'valorDoacao', render: (rowDate) => <>{rowDate.valorDoacao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</> },
                                    { title: 'Data da Doação', field: 'dataDoacao', render: (rowDate) => <>{moment(rowDate.dataDoacao).format("DD/MM/YYYY")}</> },
                                    { title: 'Status da Doação', field: 'statusDoacao', render: (rowDate) => <>{rowDate.statusDoacao ? "Recebido" : "Pendente"}</> },
                                    { title: 'Tipo de Envior', field: 'tipoDeEnvioValor' },
                                ]}
                                data={listRelatorioDeposito}
                            />
                        </Col>
                    </div>
                </>
            }</>
    )
}
