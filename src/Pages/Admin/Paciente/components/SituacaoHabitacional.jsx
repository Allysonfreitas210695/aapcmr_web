import React, { useEffect, useState } from 'react'
import { Button, Col, Row } from 'reactstrap'
import { useForm } from 'react-hook-form';
import { HiPencilAlt } from 'react-icons/hi';
import { FaRegSave } from 'react-icons/fa';

//Components
import MaskedInput from '../../../../Components/MaskedInput';
import ControlledInput from '../../../../Components/ControlledInput';
import SelectCustom from '../../../../Components/SelectCustom';

//Helpers
import { viacep } from '../../../../helpers/ViaCep';
import { ShowMessage } from '../../../../helpers/ShowMessage';

//Services
import { api_POST, api_PUT } from '../../../../Service/api';

export default function SituacaoHabitacional({ paciente, loadPaciente, showLoading, setPaciente }) {
    const {
        handleSubmit,
        control,
        setValue
    } = useForm({
        mode: 'onBlur'
    });

    useEffect(() => {
        if (!!paciente && paciente?.situacaoHabitacional != null) {
            setValue("moradia", paciente.situacaoHabitacional.moradia);
            setValue("transporte", paciente.situacaoHabitacional.transporte);
            setValue("casa", paciente.situacaoHabitacional.casa);
            setValue("bairro", paciente.situacaoHabitacional.bairro);
            setCep(paciente.situacaoHabitacional.cep);
            setValue("complemento", paciente.situacaoHabitacional.complemento);
            setValue("cidade", paciente.situacaoHabitacional.cidade);
            setValue("uf", paciente.situacaoHabitacional.uf);
            setValue("logradouro", paciente.situacaoHabitacional.logradouro);
            setValue("numero", paciente.situacaoHabitacional.numero);
            setTransporte({value: paciente.situacaoHabitacional.transporte, label: paciente.situacaoHabitacional.transporte ? "Sim" : "Não"});
            setLuz({value: paciente.situacaoHabitacional.luz, label: paciente.situacaoHabitacional.luz ? "Sim" : "Não"});
            setAgua({value: paciente.situacaoHabitacional.agua, label: paciente.situacaoHabitacional.agua ? "Sim" : "Não"});
            setInstalacaoSanitaria({value: paciente.situacaoHabitacional.instalacaoSanitaria, label: paciente.situacaoHabitacional.instalacaoSanitaria ? "Sim": "Não"});
        }
    }, [paciente]);

    const [cep, setCep] = useState('');
    const handleCepChange = (value) => {
        setCep(value);
    };

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

    const [transporte, setTransporte] = useState({ value: false, label: 'Não' });
    const handleTransporte = (selectedOption) => {
        setTransporte(selectedOption);
    };

    const [luz, setLuz] = useState({ value: false, label: 'Não' });
    const handleLuz = (selectedOption) => {
        setLuz(selectedOption);
    };

    const [agua, setAgua] = useState({ value: false, label: 'Não' });
    const handleAgua = (selectedOption) => {
        setAgua(selectedOption);
    };

    const [instalacaoSanitaria, setInstalacaoSanitaria] = useState({ value: false, label: 'Não' });
    const handleInstalacaoSanitaria = (selectedOption) => {
        setInstalacaoSanitaria(selectedOption);
    };

    const onSubmit = async (data) => {
        if (cep.length == 0 || cep.replace(/[./\-]/g, "").length < 8) {
            ShowMessage({
                title: 'Error',
                text: "Cep invalido!",
                icon: 'error'
            });
            return;
        }
        const json = {
            id: paciente.situacaoHabitacional ? paciente.situacaoHabitacional.id : 0,
            bairro: data.bairro,
            cep: cep.replace(/[./\-]/g, ""),
            complemento: data.complemento,
            cidade: data.cidade,
            numero: data.numero,
            logradouro: data.logradouro,
            uf: data.uf,
            pacienteId: paciente.id,
            moradia: data.moradia,
            casa: data.casa,
            transporte: transporte.value,
            luz: luz.value,
            agua: agua.value,
            instalacaoSanitaria: instalacaoSanitaria.value
        };

        showLoading(true);
        try {
            let response;
            if (!paciente.situacaoHabitacional) {
                response = await api_POST("SituacaoHabitacional", json);
                const { data: responseData } = response;
                loadPaciente(paciente.id);
            } else {
                response = await api_PUT("SituacaoHabitacional", json);
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
                        name='moradia'
                        label={<><span className='text-danger'>*</span> Moradia</>}
                        type='text'
                        rules={{
                            required: true
                        }}
                    />
                </Col>
                <Col sm={12} lg={4}>
                    <ControlledInput
                        control={control}
                        name='casa'
                        label={<><span className='text-danger'>*</span> Casa</>}
                        type='text'
                        rules={{
                            required: true
                        }}
                    />
                </Col>
                <Col sm={12} lg={2}>
                    <SelectCustom
                        control={control}
                        name='transporte'
                        label='Transporte'
                        value={transporte}
                        options={[{ value: true, label: 'Sim' }, { value: false, label: "Não"}]}
                        onChange={handleTransporte}
                    />
                </Col>
                <Col sm={12} lg={2}>
                    <SelectCustom
                        control={control}
                        name='luz'
                        label='Luz'
                        value={luz}
                        options={[{ value: true, label: 'Sim' }, { value: false, label: "Não"}]}
                        onChange={handleLuz}
                    />
                </Col>
                <Col sm={12} lg={2}>
                    <SelectCustom
                        control={control}
                        name='agua'
                        label='Água'
                        value={agua}
                        options={[{ value: true, label: 'Sim' }, { value: false, label: "Não"}]}
                        onChange={handleAgua}
                    />
                </Col>
                <Col sm={12} lg={3}>
                    <SelectCustom
                        control={control}
                        name='instalacaoSanitaria'
                        label='Instalação Sanitária'
                        value={instalacaoSanitaria}
                        options={[{ value: true, label: 'Sim' }, { value: false, label: "Não"}]}
                        onChange={handleInstalacaoSanitaria}
                    />
                </Col>
                <Col sm={12} lg={2}>
                    <MaskedInput
                        value={cep}
                        name={"Cep"}
                        label={<><span className='text-danger'>*</span> CEP</>}
                        onChange={handleCepChange}
                        mask="99999-999"
                        placeholder="Digite seu CEP"
                        onBlur={handleOnBlur}
                    />
                </Col>
                <Col sm={12} lg={4}>
                    <ControlledInput
                        control={control}
                        name='bairro'
                        label={<><span className='text-danger'>*</span> Bairro</>}
                        type='text'
                        rules={{
                            required: true
                        }}
                    />
                </Col>
                <Col sm={12} lg={1}>
                    <ControlledInput
                        control={control}
                        label={<><span className='text-danger'>*</span> UF</>}
                        name='uf'
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
                        label={<><span className='text-danger'>*</span> Número</>}
                        type='number'
                        rules={{
                            required: true
                        }}
                    />
                </Col>
                <Col sm={12} lg={3}>
                    <ControlledInput
                        control={control}
                        label={<><span className='text-danger'>*</span> Cidade</>}
                        name='cidade'
                        type='text'
                        rules={{
                            required: true
                        }}
                    />
                </Col>
                <Col sm={12} lg={7}>
                    <ControlledInput
                        control={control}
                        name='logradouro'
                        label={<><span className='text-danger'>*</span> Logradouro</>}
                        type='text'
                        rules={{
                            required: true
                        }}
                    />
                </Col>
                <Col sm={12} lg={12}>
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
            </Row>
            <div className='py-2 d-flex justify-content-center align-items-center gap-3'>
                <Button color={paciente?.situacaoHabitacional ? "warning" : "success"}>
                    {paciente?.situacaoHabitacional ? <><HiPencilAlt /> Edit</> : <><FaRegSave /> Salvar</>}
                </Button>
            </div>
        </form>
    )
}
