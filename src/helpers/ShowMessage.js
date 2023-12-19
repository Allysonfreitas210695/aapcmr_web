import Swal from 'sweetalert2';

export const ShowMessage = ({ title = "", text, icon }, callback = null) => {
    return new Promise((resolve) => {
        Swal.fire({
            title: title,
            text: text,
            icon: icon,
            confirmButtonText: 'OK'
        }).then((result) => {
            if (result.isConfirmed && callback && typeof callback === 'function') {
                callback();
            }
        });
    });
}

export const ShowConfirmation = ({ title = "", text }) => {
    return new Promise((resolve) => {
        Swal.fire({
            title: title,
            text: text,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                resolve(true); 
            } else {
                resolve(false); 
            }
        });
    });
};