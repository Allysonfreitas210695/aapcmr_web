import React from 'react';

//Components
import Doacao from './Doacao';
import Paciente from './Paciente';

export default function TabelaCard({ itemCard, handleVoltar }) {
    return (
        <>
            {itemCard.tipo == "Doação" &&
                <Doacao
                    itemCard={itemCard}
                    handleVoltar={handleVoltar}
                />
            }
            {itemCard.tipo == "Paciente" &&
                <Paciente
                    itemCard={itemCard}
                    handleVoltar={handleVoltar}
                />
            }

        </>
    )
}
