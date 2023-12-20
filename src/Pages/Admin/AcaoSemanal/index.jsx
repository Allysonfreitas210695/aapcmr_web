import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { HiPencilAlt } from 'react-icons/hi';
import { FaRegSave, FaRegWindowClose } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { Button, Col, Row } from 'reactstrap';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import 'moment/locale/pt-br';

//Helpers
import { ShowConfirmation, ShowMessage } from '../../../helpers/ShowMessage';

//ApicConfig
import { api_DELETE, api_GET, api_POST, api_PUT } from '../../../Service/apiConfig';

//Context
import { useAuth } from '../../../Context/useAuth';

//Components
import SelectCustom from '../../../Components/SelectCustom';
import { defaultMessages } from './CalendarConfi';
import { ModalCustom } from '../../../Components/Modal';
import ControlledInput from '../../../Components/ControlledInput';

moment.locale('pt-br');
// Configura o moment como localizador para o React Big Calendar
const localizer = momentLocalizer(moment);

export default function AcaoSemanal() {
    const { showLoading, loding } = useAuth();
    const {
        setValue,
        control,
        getValues
    } = useForm({
        mode: 'onBlur'
    });

    const [eventos, setEventos] = useState([]);

    const [listAcoesApoio, setListAcoesApoio] = useState([]);

    const [eventoId, setEventoId] = useState(null);
    //State para controlar modal
    const [isOpenModal, setIsOpenModal] = useState(false);

    const [acaoApoio, setAcaoApoio] = useState(null);
    const handleAcaoApoioChange = ({ id, descricao }) => {
        setAcaoApoio({ value: id, descricao: descricao });
    };

    const loadAcaoSemanal = async () => {
        showLoading(true);
        try {
            let response = await api_GET("AcaoApoioSemanal");
            const { data } = response;
            let _data = []
            if (data && data.length > 0) {
                _data = data?.map(x => {
                    x.allDay = true;
                    x.title = x.acoesApoio.descricao;
                    x.start = x.dataInicial;
                    x.end = x.dataFinal;
                    return x;
                })
            }
            setEventos(_data);

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

    const loadAcoesApoio = async () => {
        showLoading(true);
        try {
            let response = await api_GET("AcoesApoio");
            const { data } = response;

            if (data && data.length > 0) {
                let _data = data?.map(x => {
                    x.value = x.id;
                    x.label = x.descricao;
                    return x;
                })
                setListAcoesApoio(_data);
            }
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
        loadAcaoSemanal();
        loadAcoesApoio()
    }, []);

    const togglemodal = () => {
        setValue("dataInicial", "");
        setValue("timeInicial", "");
        setValue("dataFinal", "");
        setValue("timeFinal", "");
        setEventoId(null);
        setAcaoApoio(null);
        setIsOpenModal(!isOpenModal);
    };

    const handleSelect = ({ start, end }) => {
        setValue("dataInicial", moment(start).format("YYYY-MM-DD"))
        //pegar o time inical 
        setValue("timeInicial", moment(start).format("HH:mm"))

        setValue("dataFinal", moment(end).format("YYYY-MM-DD"))
        setValue("timeFinal", moment(end).format("HH:mm"))
        setIsOpenModal(true);
    };

    const handleSelectEvent = (event) => {
        setEventoId(event);
        setAcaoApoio({ value: event.acoesApoioId, label: event.acoesApoio.descricao })
        setValue("dataInicial", moment(event.start).format("YYYY-MM-DD"));
        setValue("timeInicial", moment(event.start).format("HH:mm"));
        setValue("dataFinal", moment(event.end).format("YYYY-MM-DD"));
        setValue("timeFinal", moment(event.end).format("HH:mm"));
        setIsOpenModal(true);
    };

    const handleRemoveAcaoApoioSemanal = async () => {
        const resposta = await ShowConfirmation({ title: "", text: "Você tem certeza que quer deletar essa ação de apoio?" });
        if (resposta) {
            try {
                showLoading(true);
                let response = await api_DELETE(`AcaoApoioSemanal/${eventoId.id}`);
                const { data } = response;

                showLoading(false);
                ShowMessage({
                    title: 'Sucesso',
                    text: 'Operação Realizado com sucesso',
                    icon: 'success'
                }, () => {
                    togglemodal();
                    loadAcaoSemanal();
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

    const onSubmit = async () => {
        const { dataInicial, timeInicial, dataFinal, timeFinal } = getValues();

        if (!acaoApoio) {
            ShowMessage({
                title: 'Error',
                text: "Por favor, informe o tipo da ação de apoio.",
                icon: 'error'
            });
            return;
        }
        if (!dataInicial) {
            ShowMessage({
                title: 'Error',
                text: "Por favor, preencha o campo de data incial.",
                icon: 'error'
            });
            return;
        }
        if (!timeInicial) {
            ShowMessage({
                title: 'Error',
                text: "Por favor, preencha o campo de tempo incial.",
                icon: 'error'
            });
            return;
        }
        if (!dataFinal) {
            ShowMessage({
                title: 'Error',
                text: "Por favor, preencha o campo de data final.",
                icon: 'error'
            });
            return;
        }

        if (!timeFinal) {
            ShowMessage({
                title: 'Error',
                text: "Por favor, preencha o campo de tempo final.",
                icon: 'error'
            });
            return;
        }

        const json = {
            id: eventoId == null || !eventoId?.id ? 0 : eventoId.id,
            dataInicial: moment(new Date(`${dataInicial}T${timeInicial}:00`)).format('YYYY-MM-DD HH:mm:ss'),
            dataFinal: moment(new Date(`${dataFinal}T${timeFinal}:00`)).format('YYYY-MM-DD HH:mm:ss'),
            acoesApoioId: acaoApoio.value
        }


        if (eventoId == null || !eventoId?.id) {
            showLoading(true);
            try {
                let response = await api_POST("AcaoApoioSemanal", json);
                const { data } = response;
                showLoading(false);
                ShowMessage({
                    title: 'Sucesso',
                    text: 'Sucesso na operação.',
                    icon: 'success'
                }, () => {
                    togglemodal();
                    loadAcaoSemanal();
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
            try {
                showLoading(true);
                let response = await api_PUT("AcaoApoioSemanal", json);
                showLoading(false);
                ShowMessage({
                    title: 'Sucesso',
                    text: 'Sucesso na operação.',
                    icon: 'success'
                }, () => {
                    togglemodal();
                    loadAcaoSemanal()
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
        <>
            <ModalCustom
                isOpen={isOpenModal}
                toggle={togglemodal}
                size={"lg"}
                invisibleButtons={false}
            >
                <Row>
                    <Col sm={12} lg={12}>
                        <SelectCustom
                            control={control}
                            name='acaoApoio'
                            label='Tipo de Ação Apoio'
                            value={acaoApoio}
                            options={listAcoesApoio}
                            onChange={handleAcaoApoioChange}
                        />
                    </Col>
                    <Col lg={"6"} sm={"6"}>
                        <ControlledInput
                            control={control}
                            name='dataInicial'
                            label='Data inicial'
                            type='date'
                            rules={{
                                required: true
                            }}
                        />
                    </Col>
                    <Col lg={"6"} sm={"6"}>
                        <ControlledInput
                            control={control}
                            name='timeInicial'
                            label='Tempo inicial'
                            type='time'
                            rules={{
                                required: true
                            }}
                        />
                    </Col>
                    <Col lg={"6"} sm={"6"}>
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
                    <Col lg={"6"} sm={"6"}>
                        <ControlledInput
                            control={control}
                            name='timeFinal'
                            label='Tempo Final'
                            type='time'
                            rules={{
                                required: true
                            }}
                        />
                    </Col>
                    <div className='py-2 d-flex justify-content-center align-items-center gap-3'>
                        <Button color={eventoId ? "warning" : "success"} onClick={onSubmit}>
                            {eventoId ? <><HiPencilAlt /> Editar</> : <><FaRegSave /> Salvar</>}
                        </Button>
                        {eventoId != null &&
                            <Button color="danger" onClick={handleRemoveAcaoApoioSemanal}>
                                <FaRegWindowClose /> Deletar
                            </Button>
                        }
                    </div>
                </Row>
            </ModalCustom>
            <div style={{ height: '500px' }}>
                <Calendar
                    localizer={localizer}
                    events={eventos}
                    startAccessor="start"
                    endAccessor="end"
                    defaultDate={new Date()}
                    selectable
                    onSelectSlot={handleSelect}
                    onSelectEvent={handleSelectEvent}
                    messages={defaultMessages}
                    popup={true}
                    resizable
                    eventPropGetter={(event) => {
                        let eventStyle = {};
                        if (new Date(event.end) < new Date()) {
                            eventStyle.backgroundColor = 'red';
                            eventStyle.color = 'white';
                        } else {
                            eventStyle.backgroundColor = 'green';
                            eventStyle.color = 'white';
                        }
                        return { style: eventStyle };
                    }}
                    dayPropGetter={(date) => {
                        const now = new Date();
                        if (date < now) {
                            return {
                                className: 'past-day',
                                style: {
                                    backgroundColor: '#95a5a6',
                                    color: 'white'
                                },
                            };
                        }
                        return {};
                    }}
                />

            </div>
        </>
    );
}
