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
