import React from 'react'
import { Modal, ModalBody, Button } from 'reactstrap'
import { FaRegSave } from "react-icons/fa";
import { FaRegWindowClose } from "react-icons/fa";
import { HiPencilAlt } from 'react-icons/hi';


export const ModalCustom = ({ children, isOpen = false, toggle, onSubmit, edit, save, ...args }) => {
    return (
        <Modal
            isOpen={isOpen}
            toggle={toggle}
            {...args}
        >
            <ModalBody>
                {children}
            </ModalBody>
            <div className='py-2 d-flex justify-content-center align-items-center gap-3'>
                <Button color={edit ? "warning" : "success" }onClick={onSubmit}>
                    {edit ? <><HiPencilAlt /> Edit</> : <><FaRegSave /> Salvar</>}
                </Button>
                <Button color="danger" onClick={toggle}>
                    <FaRegWindowClose /> Cancelar
                </Button>
            </div>
        </Modal>
    )
}
