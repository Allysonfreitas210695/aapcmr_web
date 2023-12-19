import React, { useEffect, useState } from 'react';
import { Row, Col, Button } from 'reactstrap';
import { useForm } from 'react-hook-form';
import { HiPencilAlt } from 'react-icons/hi';
import { FaRegSave } from 'react-icons/fa';


//Components
import ControlledInput from '../../../../Components/ControlledInput'
import MaskedInput from '../../../../Components/MaskedInput';
import SelectCustom from '../../../../Components/SelectCustom';

//Helpers
import { ShowMessage } from '../../../../helpers/ShowMessage';
import { validarCPF, validarRG } from '../../../../helpers/ValidadacaoDocumentos';
import { viacep } from '../../../../helpers/ViaCep';

//Service
import { api_POST, api_PUT } from '../../../../Service/apiConfig';

//Context
import { useAuth } from '../../../../Context/useAuth';
import moment from 'moment';

export default function DadosPrimario({ paciente, loadPaciente, showLoading, setPaciente }) {
    const { session } = useAuth();
    const {
        handleSubmit,
        formState: { errors },
        control,
        setValue
    } = useForm({
        mode: 'onBlur'
    });

    const [cpf, setCpf] = useState('');
    const [rg, setRg] = useState('');
    const [cep, setCep] = useState('');
    const [estadoCivil, setEstadoCivil] = useState({ value: 'Solteiro(a)', label: 'Solteiro(a)' });

    const options = [
        { value: 'Solteiro(a)', label: 'Solteiro(a)' },
        { value: 'Casado(a)', label: 'Casado(a)' },
        { value: 'Divorciado(a)', label: 'Divorciado(a)' },
        { value: 'Viúvo(a)', label: 'Viúvo(a)' },
        { value: 'Separado(a)', label: 'Separado(a)' },
        { value: 'União Estável', label: 'União Estável' }
    ];

    useEffect(() => {
        if (!!paciente) {
            setValue("nome", paciente.nome);
            setValue("naturalidade", paciente.naturalidade);
            setValue("statusCivil", { value: paciente.statusCivil, label: paciente.statusCivil });
            setCpf(paciente.cpf);
            setCep(paciente.cep);
            setRg(paciente.rg);
            setValue("bairro", paciente.bairro);
            if (paciente.dataNascimento != null) {
                const dataNascimentoFormatada = moment(paciente.dataNascimento).format("YYYY-MM-DD");
                setValue("dataNascimento", dataNascimentoFormatada);

            }
            setValue("cep", paciente.cep);
            setValue("complemento", paciente.complemento);
            setValue("cidade", paciente.cidade);
            setValue("uf", paciente.uf);
            setValue("logradouro", paciente.logradouro);
            setValue("numero", paciente.numero);
        }
    }, [paciente]);

    const handleCpfChange = (value) => {
        setCpf(value);
    };

    const handleRgChange = (value) => {
        setRg(value);
    };

    const handleCepChange = (value) => {
        setCep(value);
    };

    const handleEstadoCivil = (selectedOption) => {
        setEstadoCivil(selectedOption);
    };

    const onSubmit = async (data) => {
        if (!validarRG(rg)) {
            ShowMessage({
                title: 'Error',
                text: "RG invalido.",
                icon: 'error'
            });
            return;
        }

        if (!validarCPF(cpf)) {
            ShowMessage({
                title: 'Error',
                text: "CPF é invalido!",
                icon: 'error'
            });
            return;
        }

        if (!estadoCivil) {
            ShowMessage({
                title: 'Error',
                text: "Por favor, preencha o campo de estado civil.",
                icon: 'error'
            });
            return;
        }

        const json = {
            id: paciente == null || !paciente?.id ? 0 : paciente.id,
            nome: data.nome,
            bairro: data.bairro,
            cep: cep.replace(/[./\-]/g, ""),
            complemento: data.complemento,
            cpf: cpf.replace(/[./\-]/g, ""),
            dataNascimento: data.dataNascimento,
            logradouro: data.logradouro,
            naturalidade: data.naturalidade,
            cidade: data.cidade,
            numero: data.numero,
            rg: rg.replace(/[./\-]/g, ""),
            statusCivil: estadoCivil.value,
            uf: data.uf,
            usuarioId: session.id
        }

        if (paciente == null || !paciente?.id) {
            showLoading(true);
            try {
                let response = await api_POST("Paciente", json);
                const { data } = response;
                setPaciente(data);
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
                showLoading(false);
            }
        } else {
            showLoading(true);
            try {
                let response = await api_PUT("Paciente", json);
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
                showLoading(false);
            }
        }
    }

    const handleOnBlur = async (event) => {
        try {
            showLoading(true);
            const response = await viacep(event);
            showLoading(false);
            setValue("bairro", response.bairro);
            setValue("cep", response.cep);
            setValue("complemento", response.complemento);
            setValue("cidade", response.localidade);
            setValue("uf", response.uf);
            setValue("logradouro", response.logradouro);
        } catch (error) {
            ShowMessage({
                title: 'Error',
                text: "Cep invalido!",
                icon: 'error'
            });
            return;
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Row>
                <Col sm={12} lg={5}>
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
                <Col sm={12} lg={2}>
                    <SelectCustom
                        control={control}
                        name='statusCivil'
                        label='Estado Civil'
                        value={estadoCivil}
                        options={options}
                        onChange={handleEstadoCivil}
                    />
                </Col>
                <Col sm={12} lg={3}>
                    <ControlledInput
                        control={control}
                        name='naturalidade'
                        label='Naturalidade'
                        type='text'
                        rules={{
                            required: true
                        }}
                    />
                </Col>

                <Col sm={12} lg={2}>
                    <ControlledInput
                        control={control}
                        name='dataNascimento'
                        label='Data de Nascimento'
                        type='date'
                        rules={{
                            required: true
                        }}
                        value
                    />
                </Col>
                <Col sm={12} lg={2}>
                    <MaskedInput
                        value={rg}
                        name={"rg"}
                        label={"RG"}
                        onChange={handleRgChange}
                        mask="99.999.999-9"
                        placeholder="Digite seu RG"
                    />
                </Col>
                <Col sm={12} lg={2}>
                    <MaskedInput
                        value={cpf}
                        name={"rg"}
                        label={"CPF"}
                        onChange={handleCpfChange}
                        mask="999.999.999-99"
                        placeholder="Digite seu CPF"
                    />
                </Col>

                <Col sm={12} lg={2}>
                    <MaskedInput
                        value={cep}
                        name={"Cep"}
                        label={"Cep"}
                        onChange={handleCepChange}
                        mask="99999-999"
                        placeholder="Digite seu CEP"
                        onBlur={handleOnBlur}
                    />
                </Col>
                <Col sm={12} lg={6}>
                    <ControlledInput
                        control={control}
                        name='complemento'
                        label='Complemento'
                        type='text'
                        rules={{
                            required: false
                        }}
                    />
                </Col>

                <Col sm={12} lg={4}>
                    <ControlledInput
                        control={control}
                        name='logradouro'
                        label='Logradouro'
                        type='text'
                        rules={{
                            required: true
                        }}
                    />
                </Col>
                <Col sm={12} lg={3}>
                    <ControlledInput
                        control={control}
                        name='bairro'
                        label='Bairro'
                        type='text'
                        rules={{
                            required: true
                        }}
                    />
                </Col>
                <Col sm={12} lg={2}>
                    <ControlledInput
                        control={control}
                        name='numero'
                        label='numero'
                        type='number'
                        rules={{
                            required: true
                        }}
                    />
                </Col>
                <Col sm={12} lg={3}>
                    <ControlledInput
                        control={control}
                        name='cidade'
                        label='cidade'
                        type='text'
                        rules={{
                            required: true
                        }}
                    />
                </Col>
            </Row>
            <div className='py-2 d-flex justify-content-center align-items-center gap-3'>
                <Button color={paciente?.id ? "warning" : "success"}>
                    {paciente?.id ? <><HiPencilAlt /> Edit</> : <><FaRegSave /> Salvar</>}
                </Button>
            </div>
        </form>
    )
}
