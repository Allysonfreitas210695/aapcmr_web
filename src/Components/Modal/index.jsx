import React from 'react'
import { Modal, ModalBody, Button, ModalHeader } from 'reactstrap'
import { FaRegSave } from "react-icons/fa";
import { FaRegWindowClose } from "react-icons/fa";
import { HiPencilAlt } from 'react-icons/hi';


export const ModalCustom = ({ children, isOpen = false, toggle, onSubmit, edit, save, invisibleButtons = true, ...args }) => {
    const closeBtn = (
        <Button className="close bg-danger text-white border-none" style={{borderRadius: "100%"}} onClick={toggle} type="button">
            &times;
        </Button>
    );

    return (
        <Modal
            isOpen={isOpen}
            toggle={toggle}
            {...args}
        >
            <ModalHeader toggle={toggle} close={closeBtn} >
                
            </ModalHeader>
            <ModalBody>
                {children}
            </ModalBody>
            {invisibleButtons && <div className='py-2 d-flex justify-content-center align-items-center gap-3'>
                <Button color={edit ? "warning" : "success"} onClick={onSubmit}>
                    {edit ? <><HiPencilAlt /> Edit</> : <><FaRegSave /> Salvar</>}
                </Button>
            </div>}
        </Modal>
    )
}
