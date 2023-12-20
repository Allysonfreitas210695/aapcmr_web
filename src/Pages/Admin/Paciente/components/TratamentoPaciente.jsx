import React, { useEffect, useState } from 'react'
import { Button, Col, Row } from 'reactstrap'
import { useForm } from 'react-hook-form';
import { HiPencilAlt } from 'react-icons/hi';
import { FaPlus, FaRegSave } from 'react-icons/fa';


//Component
import ControlledInput from '../../../../Components/ControlledInput';
import { api_DELETE, api_POST, api_PUT } from '../../../../Service/apiConfig';
import { ShowConfirmation, ShowMessage } from '../../../../helpers/ShowMessage';
import TableCustom from '../../../../Components/TableCustom';
import { EditeActionTable, RemoveActionTable } from '../../../../Constants/ActionsTable';
import SelectCustom from '../../../../Components/SelectCustom';

export default function TratamentoPaciente({ paciente, loadPaciente, showLoading, setPaciente }) {
    const {
        handleSubmit,
        formState: { errors },
        control,
        setValue
    } = useForm({
        mode: 'onBlur'
    });

    const [listTramentosPaciente, setListTramentosPaciente] = useState([]);

    const [tratamentoPaciente, setTratamentoPaciente] = useState(null);

    const [columns] = useState([
        { title: 'Diagnostico', field: 'diagnostico' },
        { title: 'Ano do Diagnostico', field: 'anoDiagnostico' },
        { title: 'Status do Tratamento', field: 'statusTratamento' },
        { title: 'Medico', field: 'medico' },
        { title: 'Tipo da Cirurgia', field: 'tipoCirurgia' },
    ]);

    const optionsStatusTratamento = [
        { value: "Finalizado", label: 'Finalizado' },
        { value: "Em Andamento", label: 'Em Andamento' }
    ];

    useEffect(() => {
        setListTramentosPaciente(paciente?.tratamentoPacientes ?? [])
    }, [paciente]);

    const handleRemoveTramentoPaciente = async ({ id }) => {
        const resposta = await ShowConfirmation({ title: "", text: "Você tem certeza que quer deletar o tratamento paciente?" });
        if (resposta) {
            try {
                showLoading(true);
                let response = await api_DELETE(`TratamentoPaciente/${id}`);
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

    const handleEditTramentoPaciente = (tratamentoPacientes) => {
        setTratamentoPaciente(tratamentoPacientes);
        setValue("diagnostico", tratamentoPacientes.diagnostico);
        setValue("medico", tratamentoPacientes.medico);
        setValue("tipoCirurgia", tratamentoPacientes.tipoCirurgia);
        setValue("anoDiagnostico", tratamentoPacientes.anoDiagnostico);
        setStatusTratamento({value: tratamentoPacientes.statusTratamento, label: tratamentoPacientes.statusTratamento})
    }

    const [statusTratamento, setStatusTratamento] = useState({ value: "Em Andamento", label: 'Em Andamento' });
    const handleStatusTratamento = (selectedOption) => {
        setStatusTratamento(selectedOption);
    };

    const onSubmit = async (data) => {
        const json = {
            id: tratamentoPaciente == null ? 0 : tratamentoPaciente.id,
            diagnostico: data.diagnostico,
            statusTratamento: statusTratamento.value,
            medico: data.medico,
            tipoCirurgia: data.tipoCirurgia,
            anoDiagnostico: data.anoDiagnostico,
            pacienteId: paciente.id
        }

        if (!tratamentoPaciente) {
            showLoading(true);
            try {
                let response = await api_POST("TratamentoPaciente", json);
                const { data } = response;
                loadPaciente(paciente.id);
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
                setValue("diagnostico", "");
                setValue("medico", "");
                setValue("tipoCirurgia", "");
                setValue("anoDiagnostico", "");
                setTratamentoPaciente(null);
                showLoading(false);
            }
        } else {
            showLoading(true);
            try {
                let response = await api_PUT("TratamentoPaciente", json);
                loadPaciente(paciente.id);
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
                setValue("diagnostico", "");
                setValue("medico", "");
                setValue("tipoCirurgia", "");
                setValue("anoDiagnostico", "");
                setTratamentoPaciente(null);
                showLoading(false);
            }
        }
    }


    // //Listas com as acoes definidas
    const _actions = [EditeActionTable(handleEditTramentoPaciente), RemoveActionTable(handleRemoveTramentoPaciente)];
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Row>
                <Col sm={12} lg={6}>
                    <ControlledInput
                        control={control}
                        name='diagnostico'
                        label={<><span className='text-danger'>*</span> Diagnostico</>}
                        type='text'
                        rules={{
                            required: true
                        }}
                    />
                </Col>
                <Col sm={12} lg={3}>
                    <SelectCustom
                        control={control}
                        name='statusTratamento'
                        label='Status do Tratamento'
                        value={statusTratamento}
                        options={optionsStatusTratamento}
                        onChange={handleStatusTratamento}
                    />
                </Col>
                <Col sm={12} lg={3}>
                    <ControlledInput
                        control={control}
                        name='medico'
                        label={<><span className='text-danger'>*</span> Médico</>}
                        type='text'
                        rules={{
                            required: true
                        }}
                    />
                </Col>
                <Col sm={12} lg={5}>
                    <ControlledInput
                        control={control}
                        name='tipoCirurgia'
                        label={<><span className='text-danger'>*</span> Tipo da Cirurgia</>}
                        type='text'
                        rules={{
                            required: true
                        }}
                        value
                    />
                </Col>
                <Col sm={12} lg={3}>
                    <ControlledInput
                        control={control}
                        name='anoDiagnostico'
                        label={<><span className='text-danger'>*</span> Ano do Diagnostico</>}
                        type='number'
                        maxlenght={15}
                        rules={{
                            required: true
                        }}
                    />
                </Col>
                <Col sm={12} lg={3} className='mt-2'>
                    <br />
                    <Button color={tratamentoPaciente ? "warning" : "success"}>
                        {tratamentoPaciente ? <><HiPencilAlt /> Edit</> : <><FaPlus /> Adicionar</>}
                    </Button>
                </Col>
            </Row>
            <Col lg={12} md={12}>
                <TableCustom
                    title='Lista de tratamentos do paciente'
                    columns={columns}
                    data={listTramentosPaciente}
                    actions={_actions}
                />
            </Col>
        </form>
    )
}
