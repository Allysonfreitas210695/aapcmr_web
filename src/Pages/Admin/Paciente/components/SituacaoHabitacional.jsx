import React, { useEffect, useState } from 'react'
import { Button, Col, Row } from 'reactstrap'
import { useForm } from 'react-hook-form';
import { HiPencilAlt } from 'react-icons/hi';
import { FaRegSave } from 'react-icons/fa';

import MaskedInput from '../../../../Components/MaskedInput';
import ControlledInput from '../../../../Components/ControlledInput';
import { viacep } from '../../../../helpers/ViaCep';
import { ShowMessage } from '../../../../helpers/ShowMessage';
import { api_POST, api_PUT } from '../../../../Service/apiConfig';

export default function SituacaoHabitacional({ paciente, loadPaciente, showLoading, setPaciente }) {
    const {
        handleSubmit,
        formState: { errors },
        control,
        setValue
    } = useForm({
        mode: 'onBlur'
    });

    useEffect(() => {
        console.log(paciente)
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

    const onSubmit = async (data) => {
        const json = {
            bairro: data.bairro,
            cep: cep.replace(/[./\-]/g, ""),
            complemento: data.complemento,
            cidade: data.cidade,
            numero: data.numero,
            logradouro: data.logradouro,
            uf: data.uf,
            pacienteId: paciente.id,
            transporte: data.transporte,
            moradia: data.moradia,
            casa: data.casa
        }
        
        if (!paciente.situacaoHabitacional) {
            showLoading(true);
            try {
                let response = await api_POST("SituacaoHabitacional", json);
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
                let response = await api_PUT("SituacaoHabitacional", json);
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
                <Col sm={12} lg={4}>
                    <ControlledInput
                        control={control}
                        name='transporte'
                        label={<><span className='text-danger'>*</span> Transporte</>}
                        type='text'
                        rules={{
                            required: true
                        }}
                    />
                </Col>

                <Col sm={12} lg={3}>
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
                <Col sm={12} lg={5}>
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
                        label={<><span className='text-danger'>*</span> Logradouro</>}
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
                        label={<><span className='text-danger'>*</span> Bairro</>}
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
            </Row>
            <div className='py-2 d-flex justify-content-center align-items-center gap-3'>
                <Button color={paciente?.situacaoHabitacional ? "warning" : "success"}>
                    {paciente?.situacaoHabitacional ? <><HiPencilAlt /> Edit</> : <><FaRegSave /> Salvar</>}
                </Button>
            </div>
        </form>
    )
}
