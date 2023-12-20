export const EditeActionTable = (callback) => {
    return {
        icon: 'edit',
        tooltip: 'Editar Registro',
        onClick: (event, rowData) => callback(rowData)
    }
}

export const RemoveActionTable = (callback) => {
    return {
        icon: 'delete',
        tooltip: 'Remover Registro',
        onClick: (event, rowData) => callback(rowData)
    }
}

export const SeachActionTable = (callback) => {
    return {
        icon: 'search',
        tooltip: 'Pesquisar Registro',
        onClick: (event, rowData) => callback(rowData)
    }
}
