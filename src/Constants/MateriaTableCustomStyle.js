export const localization = {
    body: {
        emptyDataSourceMessage: 'Nenhum registro encontrado',
        addTooltip: 'Adicionar',
        deleteTooltip: 'Deletar',
        editTooltip: 'Editar',
        editRow: {
            deleteText: 'Tem certeza que deseja deletar esta linha?',
            cancelTooltip: 'Cancelar',
            saveTooltip: 'Salvar',
        },
    },
    toolbar: {
        searchTooltip: 'Pesquisar',
        searchPlaceholder: 'Pesquisar',
    },
    pagination: {
        labelRowsSelect: 'linhas',
        labelDisplayedRows: '{from}-{to} de {count}',
        firstTooltip: 'Primeira página',
        previousTooltip: 'Página anterior',
        nextTooltip: 'Próxima página',
        lastTooltip: 'Última página',
    },
    header: {
        actions: 'Ações',
    },
};

export const options = {
    headerStyle: {
        fontFamily: 'Montserrat, Helvetica Neue, Arial, sans-serif',
        fontWeight: '700',
        color: '#888',
    },
    textLabels: {
        body: {
            noMatch: "Nenhum registro encontrado",
            toolTip: "Ordenar",
            columnHeaderTooltip: column => `Ordenar por ${column.label}`,
        },
        pagination: {
            next: "Próximo",
            previous: "Anterior",
            rowsPerPage: "Linhas por página:",
            displayRows: "de",
        },
        toolbar: {
            search: "Pesquisar",
            downloadCsv: "Download CSV",
            print: "Imprimir",
            viewColumns: "Visualizar colunas",
            filterTable: "Filtrar tabela",
        },
        filter: {
            all: "Todos",
            title: "FILTROS",
            reset: "RESTAURAR",
        },
        viewColumns: {
            title: "Mostrar colunas",
            titleAria: "Mostrar/Esconder colunas",
        },
        selectedRows: {
            text: "linha(s) selecionada(s)",
            delete: "Apagar",
            deleteAria: "Apagar linhas selecionadas",
        },
    },
};
