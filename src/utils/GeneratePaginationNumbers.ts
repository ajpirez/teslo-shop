export const generatePaginationNumbers = (currentPage: number, totalPages: number) => {
    // Si el numero total de páginas es 7 o menos
    //vamos a mostrar todas las páginas sin puntos suspensivos
    if (totalPages <= 7) {
        return Array.from({length: totalPages}, (_, i) => i + 1)
    }
    //si la página actual esta enre las primeras 3 paginas
    //mostrar las primeras 3 ,puntos suspensivos, y las ultimas 2
    if(currentPage <=3){
        return [1,2,3,'...', totalPages - 1, totalPages]
    }

    //si la página actual esta entre las últimas 3 páginas
    //mostrar las primeras 2 ,puntos suspensivos, las ultimas 3 paginas
    if(currentPage >= totalPages - 2){
        return [1,2,'...', totalPages - 2, totalPages - 1, totalPages]
    }
    // si la pagina actual esta en otro lugar medio
    //mostrar la primera pagina, puntos suspensivos, pagina actual y vecinos
    return [
        1,'...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages
    ]
}