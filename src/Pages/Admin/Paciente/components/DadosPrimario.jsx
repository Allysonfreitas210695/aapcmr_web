import React, { useEffect, useState } from 'react';
import { Row, Col, Button } from 'reactstrap';
import { useForm } from 'react-hook-form';
import { HiPencilAlt } from 'react-icons/hi';
import { FaRegSave } from 'react-icons/fa';
import moment from 'moment';


//Components
import ControlledInput from '../../../../Components/ControlledInput'
import MaskedInput from '../../../../Components/MaskedInput';
import SelectCustom from '../../../../Components/SelectCustom';

//Helpers
import { ShowMessage } from '../../../../helpers/ShowMessage';
import { validarCPF } from '../../../../helpers/ValidadacaoDocumentos';


//Service
import { api_POST, api_PUT } from '../../../../Service/api';

//Context
import { useAuth } from '../../../../Context/useAuth';

export default function DadosPrimario({ paciente, loadPaciente, showLoading, setPaciente }) {
    const { session } = useAuth();
    const {
        handleSubmit,
        control,
        setValue
    } = useForm({
        mode: 'onBlur'
    });



    const options = [
        { value: 'Solteiro(a)', label: 'Solteiro(a)' },
        { value: 'Casado(a)', label: 'Casado(a)' },
        { value: 'Divorciado(a)', label: 'Divorciado(a)' },
        { value: 'Viúvo(a)', label: 'Viúvo(a)' },
        { value: 'Separado(a)', label: 'Separado(a)' },
        { value: 'União Estável', label: 'União Estável' }
    ];

    const optionsStatusCestaBasica = [
        { value: true, label: 'Sim' },
        { value: false, label: 'Não' }
    ];

    useEffect(() => {
        if (!!paciente) {
            setValue("nome", paciente.nome);
            setValue("naturalidade", paciente.naturalidade);
            setValue("bairro", paciente.bairro);
            setValue("susNumero", paciente.susNumero);
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

            setCpf(paciente.cpf);
            setEstadoCivil({ value: paciente.statusCivil, label: paciente.statusCivil });
            setCestaBasica({ value: paciente.cestaBasica, label: paciente.cestaBasica ? "Sim" : "Não" });
        }
    }, [paciente]);


    const [cpf, setCpf] = useState('');
    const handleCpfChange = (value) => {
        setCpf(value);
    };

   

    const [estadoCivil, setEstadoCivil] = useState({ value: 'Solteiro(a)', label: 'Solteiro(a)' });
    const handleEstadoCivil = (selectedOption) => {
        setEstadoCivil(selectedOption);
    };


    const [cestaBasica, setCestaBasica] = useState({ value: true, label: 'Sim' });
    const handleCestaBasicaChange = (selectedOption) => {
        setCestaBasica(selectedOption);
    };

    const onSubmit = async (data) => {
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
            id: paciente == null ? 0 : paciente.id,
            nome: data.nome,
            cpf: cpf.replace(/[./\-]/g, ""),
            dataNascimento: data.dataNascimento,
            naturalidade: data.naturalidade,
            susNumero: data.susNumero,
            statusCivil: estadoCivil.value,
            cestaBasica: cestaBasica.value,
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

    

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Row>
                <Col sm={12} lg={5}>
                    <ControlledInput
                        control={control}
                        name='nome'
                        label={<><span className='text-danger'>*</span> Nome</>}
                        type='text'
                        rules={{
                            required: true
                        }}
                    />
                </Col>
                <Col sm={12} lg={3}>
                    <SelectCustom
                        control={control}
                        name='statusCivil'
                        label='Estado Civil'
                        value={estadoCivil}
                        options={options}
                        onChange={handleEstadoCivil}
                    />
                </Col>
                <Col sm={12} lg={4}>
                    <ControlledInput
                        control={control}
                        name='naturalidade'
                        label={<><span className='text-danger'>*</span> Naturalidade</>}
                        type='text'
                        rules={{
                            required: true
                        }}
                    />
                </Col>
                <Col sm={12} lg={3}>
                    <ControlledInput
                        control={control}
                        name='dataNascimento'
                        label={<><span className='text-danger'>*</span> Data de Nascimento</>}
                        type='date'
                        rules={{
                            required: true
                        }}
                        value
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
                    <MaskedInput
                        value={cpf}
                        name={"rg"}
                        label={<><span className='text-danger'>*</span> CPF</>}
                        onChange={handleCpfChange}
                        mask="999.999.999-99"
                        placeholder="Digite seu CPF"
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
