import React, { useState } from 'react'
import { Button, Col, Row } from 'reactstrap';
import { FaFilter } from 'react-icons/fa6';
import { useForm } from 'react-hook-form';

//Context
import { useAuth } from '../../../Context/useAuth';

//Components
import Loading from '../../../Components/Loading';
import TableCustom from '../../../Components/TableCustom';
import ControlledInput from '../../../Components/ControlledInput';
import MaskedInput from '../../../Components/MaskedInput';
import SelectCustom from '../../../Components/SelectCustom';
import FichaPaciente from './components/FichaPaciente';

//Helpers
import { ShowMessage } from '../../../helpers/ShowMessage';
import { mascaraCPF } from '../../../helpers/ValidadacaoDocumentos';

//Service
import { api_POST } from '../../../Service/api';

//Constants
import { SeachActionTable } from '../../../Constants/ActionsTable';

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
        { title: 'Status', field: 'status' },
    ]);

    const optionsStatusCestaBasica = [
        { value: true, label: 'Sim' },
        { value: false, label: 'Não' }
    ];


    const [cpf, setCpf] = useState('');
    const handleCpfChange = (value) => {
        setCpf(value);
    };

    const [cestaBasica, setCestaBasica] = useState(null);
    const handleCestaBasicaChange = (selectedOption) => {
        setCestaBasica(selectedOption);
    };

    const [statusTratamento, setStatusTratamento] = useState(null);
    const handleStatusTratamento = (selectedOption) => {
        setStatusTratamento(selectedOption);
    };

    const onSubmit = async (data) => {
        const json = {
            nome: data.nome,
            dataNascimento: data.dataNascimento,
            cpf: cpf.replace(/[./\-]/g, ""),
            cestaBasica: cestaBasica == null ? null : cestaBasica.value,
            statusTratamento: statusTratamento == null ? null : statusTratamento.value
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
            setCestaBasica({ value: false, label: 'Não' });
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
                        <Col sm={12} lg={6}>
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
                            <MaskedInput
                                value={cpf}
                                name={"rg"}
                                label={"CPF"}
                                onChange={handleCpfChange}
                                mask="999.999.999-99"
                                placeholder="Digite seu CPF"
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
                            <SelectCustom
                                control={control}
                                name='statusTratamento'
                                label='Status do Tratamento'
                                value={statusTratamento}
                                options={[{ value: "Finalizado", label: 'Finalizado' }, { value: "Em Andamento", label: 'Em Andamento' }]}
                                onChange={handleStatusTratamento}
                            />
                        </Col>
                        <Col sm={12} lg={3}>
                            <SelectCustom
                                control={control}
                                name='cestaBasica'
                                label='Cesta Básica'
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
