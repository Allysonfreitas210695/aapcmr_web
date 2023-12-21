import React, { useState } from 'react';
import { FaRegArrowAltCircleDown, FaRegArrowAltCircleUp, FaUser } from 'react-icons/fa';
import { UncontrolledPopover, PopoverBody } from 'reactstrap';
import { RiLockPasswordLine } from 'react-icons/ri';
import { IoIosLogOut } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

//Contexto
import { useAuth } from '../../Context/useAuth';

export default function Header() {
    const [openPopover, setPopover] = useState(false);
    const { session, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <header
            style={{
                position: 'fixed',
                width: '100%',
                zIndex: 1,
                transition: 'width 0.3s ease-in-out',
                background: '#ffffff',
                borderBottom: '1px solid #e0e0e0',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
            }}
        >
            <div
                className='p-2'

            >
                <UncontrolledPopover placement='bottom' target='UncontrolledPopover'>
                    <PopoverBody style={{ minWidth: '120px' }}>
                        <div className='d-flex flex-column'>
                            <div
                                className='d-flex align-items-center'
                                style={{ cursor: 'pointer' }}
                                onClick={() => navigate("/admin/trocaSenha")}
                            >
                                <span style={{ marginRight: '8px' }}>Trocar senha</span>
                                <RiLockPasswordLine />
                            </div>
                            <div
                                className='d-flex align-items-center'
                                style={{ cursor: 'pointer' }}
                                onClick={() => logout()}
                            >
                                <span style={{ marginRight: '8px' }}>Sair</span>
                                <IoIosLogOut />
                            </div>
                        </div>
                    </PopoverBody>
                </UncontrolledPopover>

                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <FaUser color='#000' />
                    <span
                        className='text-dark'
                        style={{ cursor: 'pointer', margin: '0px 8px' }}
                    >
                        {session?.nome}
                    </span>
                    <div id='UncontrolledPopover' type='button' onClick={() => setPopover(!openPopover)}>
                        {!openPopover ? <FaRegArrowAltCircleDown color='#000' /> : <FaRegArrowAltCircleUp color='#000' />}
                    </div>
                </div>
            </div>
        </header>
    );
}
