import React, { useState } from 'react'
import { Button, Col, Row } from 'reactstrap';

import { useAuth } from '../../../Context/useAuth';
import Loading from '../../../Components/Loading';
import TableCustom from '../../../Components/TableCustom';
import ControlledInput from '../../../Components/ControlledInput';
import { useForm } from 'react-hook-form';
import MaskedInput from '../../../Components/MaskedInput';
import SelectCustom from '../../../Components/SelectCustom';
import { FaFilter } from 'react-icons/fa6';
import { ShowMessage } from '../../../helpers/ShowMessage';
import { api_POST } from '../../../Service/apiConfig';
import { mascaraCPF } from '../../../helpers/ValidadacaoDocumentos';
import { SeachActionTable } from '../../../Constants/ActionsTable';
import FichaPaciente from './components/FichaPaciente';

export default function ConsultaPaciente() {
    const { showLoading, loding } = useAuth();
    const {
        handleSubmit,
        formState: { errors },
        control,
        setValue
    } = useForm({
        mode: 'onBlur'
    });
    //State para pegar lista de usuarios Adm
    const [listPacientes, setListPacientes] = useState([]);

    //State para pegar ID do paciente
    const [pacienteId, setPacienteId] = useState(null);

    const [columns] = useState([
        { title: 'Nome', field: 'nome' },
        { title: 'Endereço', field: 'endereco' },
        { title: 'Estado Civil', field: 'statusCivil' },
        { title: 'Naturalidade', field: 'naturalidade' },
        { title: 'DataNascimento', field: 'dataNascimento' },
        { title: 'CPF', field: 'cpf', render: (rowDate) => <>{mascaraCPF(rowDate.cpf)}</> },
        { title: 'Némero do SUS', field: 'susNumero' },
    ]);

    const optionsStatusCestaBasica = [
        { value: true, label: 'Sim' },
        { value: false, label: 'Não' }
    ];


    const [cpf, setCpf] = useState('');
    const handleCpfChange = (value) => {
        setCpf(value);
    };

    const [cestaBasica, setCestaBasica] = useState({ value: false, label: 'Não' });
    const handleCestaBasicaChange = (selectedOption) => {
        setCestaBasica(selectedOption);
    };

    const onSubmit = async (data) => {
        if (!cpf || cpf.trim().length === 0) {
            ShowMessage({
                title: 'Aviso',
                text: "Por favor, Informe o CPF do paciente.",
                icon: 'warning'
            });
            return;
        }

        const json = {
            nome: data.nome,
            dataNascimento: data.dataNascimento,
            cpf: cpf.replace(/[./\-]/g, ""),
            susNumero: data.susNumero,
            cestaBasica: cestaBasica.value
        }

        try {
            showLoading(true);
            let response = await api_POST("Paciente/ConsultaPaciente", json);
            const { data } = response;
            if (data?.length == 0) {
                setListPacientes([])
                ShowMessage({
                    title: 'Aviso',
                    text: 'Não foi encontrado nenhum paciente com esses dados informados!',
                    icon: 'warning'
                });
                showLoading(false);
                return;
            }
            setListPacientes(data);
        } catch (error) {
            ShowMessage({
                title: 'Error',
                text: 'Error na operação.',
                icon: 'error'
            });
        } finally {
            setValue("nome", "");
            setValue("dataNascimento", "");
            setValue("susNumero", "");
            setCestaBasica({ value: true, label: 'Sim' });
            showLoading(false);
        }
    }

    const handlePesquisarPaciente = (rowData) => {
        setPacienteId(rowData.id)
    }

    const _actions = [SeachActionTable(handlePesquisarPaciente)];

    const handleVoltar = () => {
        setCpf('');
        setPacienteId(null);
    }

    if (pacienteId != null) {
        return <FichaPaciente
            handleVoltar={handleVoltar}
            id={pacienteId}
        />
    }

    return (
        < >
            {loding && <Loading />}
            {!loding &&
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Row>
                        <Col sm={12} lg={5}>
                            <ControlledInput
                                control={control}
                                name='nome'
                                label={"Nome"}
                                type='text'
                                rules={{
                                    required: false
                                }}
                            />
                        </Col>
                        <Col sm={12} lg={3}>
                            <ControlledInput
                                control={control}
                                name='dataNascimento'
                                label={"Data de Nascimento"}
                                type='date'
                                rules={{
                                    required: false
                                }}
                                value
                            />
                        </Col>
                        <Col sm={12} lg={3}>
                            <MaskedInput
                                value={cpf}
                                name={"rg"}
                                label={<><span className='text-danger'>*</span> CPF</>}
                                onChange={handleCpfChange}
                                mask="999.999.999-99"
                                placeholder="Digite seu CPF"
                            />
                        </Col>
                        <Col sm={12} lg={3}>
                            <ControlledInput
                                control={control}
                                name='susNumero'
                                label='Número do SUS'
                                type='number'
                                maxlenght={15}
                                rules={{
                                    required: false
                                }}
                            />
                        </Col>
                        <Col sm={12} lg={3}>
                            <SelectCustom
                                control={control}
                                name='cestaBasica'
                                label='Recebe Cesta Básica?'
                                value={cestaBasica}
                                options={optionsStatusCestaBasica}
                                onChange={handleCestaBasicaChange}
                            />
                        </Col>
                        <Col sm={12} lg={3} className='mt-2'>
                            <br />
                            <Button color={"primary"}>
                                <FaFilter /> Filtrar
                            </Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={12} md={12}>
                            <TableCustom
                                title='Lista de Pacientes'
                                columns={columns}
                                data={listPacientes}
                                actions={_actions}
                            />
                        </Col>
                    </Row>
                </form>
            }
        </>
    )
}
