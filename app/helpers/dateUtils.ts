export const formatDate = (creationTime: number) => {
    return new Date(creationTime).toLocaleDateString("es-ES", {
        month: "short",
        year: "numeric"
    });
};
